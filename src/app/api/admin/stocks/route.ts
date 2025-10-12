import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const SORTABLE = new Set(['shortName', 'ticker', 'isinCode']);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim() || '';
    const sort = searchParams.get('sort') || 'shortName';
    const order = (searchParams.get('order') || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));

    const where = {
      status: 'ACTIVE' as const,
      AND: q
        ? [
            {
              OR: [
                { shortName: { contains: q } },
                { ticker: { contains: q } },
                { isinCode: { contains: q } },
              ],
            },
          ]
        : [],
    };

    const total = await prisma.stock.count({ where });

    const orderBy: any = SORTABLE.has(sort) ? { [sort]: order } : { shortName: 'asc' };

    const items = await prisma.stock.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({ items, total, page, pageSize });
  } catch (err: any) {
    console.error('GET /api/admin/stocks error', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
