import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import axios from 'axios';

// 한글 헤더 -> DB 필드 매핑
const headerMap: Record<string, keyof import('@prisma/client').Prisma.StockCreateInput> = {
  '표준코드': 'isinCode',
  '단축코드': 'ticker',
  '한글 종목명': 'name',
  '한글 종목약명': 'shortName',
  '영문 종목명': 'englishName',
  '상장일': 'listingDate',
  '시장구분': 'marketType',
  '증권구분': 'securityType',
  '소속부': 'sector',
  '주식종류': 'stockType',
  '액면가': 'parValue',
  '상장주식수': 'listedShares',
};

const requiredHeaders = ['표준코드', '한글 종목약명'];

async function parseXlsx(buffer: Buffer): Promise<any[]> {
  const xlsx = await import('xlsx');
  const wb = xlsx.read(buffer, { type: 'buffer' });
  const wsName = wb.SheetNames[0];
  const ws = wb.Sheets[wsName];
  const rows = xlsx.utils.sheet_to_json(ws, { raw: false });
  return rows as any[];
}

function normalizeRow(row: Record<string, any>) {
  const obj: Record<string, any> = {};
  for (const [k, v] of Object.entries(row)) {
    const key = (k || '').trim();
    if (key in headerMap) {
      obj[headerMap[key]] = typeof v === 'string' ? v.trim() : v;
    }
  }
  // 타입 보정
  if (obj.parValue != null && obj.parValue !== '') obj.parValue = Number(String(obj.parValue).replace(/,/g, ''));
  if (obj.listedShares != null && obj.listedShares !== '') {
    // BigInt 변환으로 큰 숫자 처리
    const numStr = String(obj.listedShares).replace(/,/g, '');
    if (/^\d+$/.test(numStr)) {
      obj.listedShares = BigInt(numStr);
    } else {
      delete obj.listedShares; // 변환 실패시 제외
    }
  }
  if (obj.listingDate) {
    const d = new Date(obj.listingDate);
    if (!isNaN(d.getTime())) obj.listingDate = d;
    else delete obj.listingDate;
  }
  return obj;
}

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof Blob)) {
      return NextResponse.json({ message: 'file is required' }, { status: 400 });
    }

    const fileName = (file as any).name as string | undefined;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    // console.log('buffer', buffer); // Excel buffer 로그 (주석 처리)

    const isXlsx = !!fileName && /\.xlsx$/i.test(fileName);
    let rows: any[] = [];
    if (isXlsx) rows = await parseXlsx(buffer);
    else {
      return NextResponse.json({ message: '지원하지 않는 파일 형식입니다(.xlsx)' }, { status: 400 });
    }

    if (!rows.length) {
      return NextResponse.json({ message: '빈 파일입니다' }, { status: 400 });
    }

    // 헤더 검증
    const headers = Object.keys(rows[0] || {});
    for (const h of requiredHeaders) {
      if (!headers.includes(h)) {
        return NextResponse.json({ message: `필드명이 일치하지 않습니다: ${h} 누락` }, { status: 400 });
      }
    }

    let total = 0;
    let inserted = 0;
    let skipped = 0;
    let skippedNoData = 0;
    let skippedExists = 0;

    for (const raw of rows) {
      total += 1;
      const data = normalizeRow(raw);

      // console.log(`Row ${total}:`, { raw, normalized: data }); // 디버깅 로그 (주석 처리)

      if (!data.isinCode || !data.shortName) {
        skipped += 1;
        skippedNoData += 1;
        // console.log(`Skipped: 필수 필드 누락 - isinCode: ${data.isinCode}, shortName: ${data.shortName}`); // 필수 필드 누락 경고 (주석 처리)
        continue;
      }

      const exists = await prisma.stock.findUnique({ where: { isinCode: data.isinCode } }).catch(() => null);
      if (exists) {
        skipped += 1;
        skippedExists += 1;
        // console.log(`Skipped: 이미 존재 - isinCode: ${data.isinCode}`); // 이미 존재하는 경우 경고 (주석 처리)
        continue;
      }

      await prisma.stock.create({
        data: {
          isinCode: data.isinCode,
          ticker: data.ticker ?? null,
          name: data.name,
          shortName: data.shortName,
          englishName: data.englishName ?? null,
          listingDate: data.listingDate ?? null,
          marketType: data.marketType ?? null,
          securityType: data.securityType ?? null,
          sector: data.sector ?? null,
          stockType: data.stockType ?? null,
          parValue: data.parValue ?? null,
          listedShares: data.listedShares ?? null,
          status: 'ACTIVE',
        },
      });
      inserted += 1;
    }

    console.log(`Upload Summary - Total: ${total}, Inserted: ${inserted}, Skipped: ${skipped} (NoData: ${skippedNoData}, Exists: ${skippedExists})`);

    return NextResponse.json({
      total,
      inserted,
      skipped,
      skippedNoData,
      skippedExists,
      message: `총 ${total}개 중 ${inserted}개 신규 등록, ${skipped}개 PASS (필드누락: ${skippedNoData}, 중복: ${skippedExists})`
    });
  } catch (err: any) {
    console.error('POST /api/admin/stocks/upload error', err);
    const hint = err?.code === 'MODULE_NOT_FOUND' ? 'xlsx, axios 패키지 설치가 필요합니다.' : undefined;
    return NextResponse.json({ message: 'Internal Server Error', hint }, { status: 500 });
  }
}
