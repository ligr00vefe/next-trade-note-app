import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import axios from 'axios';
import JSZip from 'jszip'; // jszip import 추가
import { parseStringPromise } from 'xml2js'; // xml2js import 추가
// import { parse } from 'csv-parse/sync'; // csv-parse/sync import 제거

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

interface DartCodeResponse {
  stock_code: string; // 종목코드
  corp_code: string;  // DART 고유번호
}

async function updateCorpCodes() {
  const DART_CODE_URL = process.env.DART_CODE_URL;
  const DART_API_KEY = process.env.DART_API_KEY;

  if (!DART_CODE_URL || !DART_API_KEY) {
    console.warn('DART_CODE_URL 또는 DART_API_KEY 환경 변수가 설정되지 않았습니다. corpCode 업데이트를 건너뜀.');
    return;
  }

  try {
    console.log('DART API에서 ZIP 파일 데이터 가져오기 시작...');

    const requestUrl = `${DART_CODE_URL}?crtfc_key=${DART_API_KEY}`; // crtfc_key 파라미터 추가

    const response = await axios.get<ArrayBuffer>(requestUrl, {
      responseType: 'arraybuffer',
    });
    const zipBuffer = response.data;

    console.log('Received data length:', zipBuffer.byteLength);

    console.log('ZIP 파일 압축 해제 중...');
    const zip = new JSZip();
    const loadedZip = await zip.loadAsync(zipBuffer);
    console.log('ZIP 파일 압축 해제 완료.');

    let xmlContent = '';
    let xmlFileName = '';

    // ZIP 파일 내에서 CORPCODE.xml 파일을 찾습니다.
    for (const fileName in loadedZip.files) {
      if (fileName === 'CORPCODE.xml' && !loadedZip.files[fileName].dir) {
        xmlContent = await loadedZip.files[fileName].async('text');
        xmlFileName = fileName;
        break; // CORPCODE.xml 파일만 처리
      }
    }

    if (!xmlContent) {
      console.error('ZIP 파일 내부에 CORPCODE.xml 파일을 찾을 수 없습니다.');
      return;
    }
    console.log(`ZIP 파일 내 ${xmlFileName} 파일을 찾았습니다. 내용 파싱 시작...`);

    // XML 내용을 파싱합니다.
    const parsedXml = await parseStringPromise(xmlContent, { explicitArray: false });
    // console.log('Parsed XML result:', JSON.stringify(parsedXml, null, 2)); // 파싱된 XML 전체 구조 확인 (주석 처리)

    // XML 구조에 따라 corpCode 데이터에 접근합니다.
    const dartDataList = parsedXml.result && parsedXml.result.list ? parsedXml.result.list : [];

    console.log(`XML 파일에서 ${dartDataList.length}개의 corpCode 데이터 가져옴.`);

    let updatedCount = 0;
    for (const item of dartDataList) {
      // console.log('Processing item:', JSON.stringify(item, null, 2)); // 각 item 확인 (주석 처리)

      // XML 구조에 따라 stock_code와 corp_code 추출
      // stock_code 태그가 있고 그 내용이 ' ' (공백)인 경우를 빈 값으로 처리
      const rawStockCode = Array.isArray(item.stock_code) && item.stock_code.length > 0 ? item.stock_code[0] : item.stock_code;
      const rawCorpCode = Array.isArray(item.corp_code) && item.corp_code.length > 0 ? item.corp_code[0] : item.corp_code;

      const ticker = (rawStockCode && rawStockCode.trim() !== '') ? rawStockCode.trim() : '';
      const corpCode = (rawCorpCode && rawCorpCode.trim() !== '') ? rawCorpCode.trim() : '';

      // console.log(`Debug - Raw Stock Code: "${rawStockCode}", Raw Corp Code: "${rawCorpCode}"`); // 추출된 원본 ticker, corpCode 확인 (주석 처리)
      // console.log(`Extracted - Ticker: "${ticker}", CorpCode: "${corpCode}"`); // 추출된 ticker, corpCode 확인 (주석 처리)

      // stock_code가 비어있는 경우는 건너뜁니다. (ticker가 없는 경우)
      if (!ticker || ticker === '') {
        // console.warn(`Skipped: DART 데이터에 stock_code 누락 또는 빈 값 (비상장/관리종목 예상) - ${JSON.stringify(item)}`); // 경고 메시지 주석 처리
        continue;
      }

      if (!corpCode || corpCode === '') {
        // console.warn(`Skipped: DART 데이터에 corp_code 누락 또는 빈 값 - ${JSON.stringify(item)}`); // 경고 메시지 주석 처리
        continue;
      }

      const stock = await prisma.stock.findUnique({
        where: { ticker: ticker },
        select: { id: true, corpCode: true }
      });
      // console.log(`Found stock for ticker "${ticker}":`, stock ? `ID: ${stock.id}, Current corpCode: "${stock.corpCode}"` : 'Not found'); // Stock 레코드 검색 결과 확인 (주석 처리)

      if (stock && stock.corpCode !== corpCode) {
        await prisma.stock.update({
          where: { id: stock.id },
          data: { corpCode: corpCode },
        });
        updatedCount += 1;
        // console.log(`SUCCESS: corpCode 업데이트 - Ticker: "${ticker}", Old: "${stock.corpCode}", New: "${corpCode}"`); // 업데이트 성공 로그 (주석 처리)
      } else if (stock && stock.corpCode === corpCode) {
        // console.log(`Skipped: corpCode 이미 최신 - Ticker: "${ticker}", corpCode: "${corpCode}"`); // 이미 최신인 경우 로그 (주석 처리)
      } else {
        // console.log(`Skipped: Stock 테이블에서 Ticker "${ticker}"에 해당하는 종목을 찾을 수 없습니다.`); // Stock 테이블에 없는 경우 로그 (주석 처리)
      }
    }
    console.log(`총 ${updatedCount}개의 종목 corpCode 업데이트 완료.`);

  } catch (error) {
    console.error('DART API 또는 ZIP/XML 처리 중 오류 발생:', error);
  }
}

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
          corpCode: null,
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

    await updateCorpCodes();

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
