import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (!Number.isInteger(id)) {
      return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const status = body?.status as 'ACTIVE' | 'DELISTED' | undefined;
    if (!status) {
      return NextResponse.json({ message: 'status is required' }, { status: 400 });
    }

    const updated = await prisma.stock.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ id: updated.id, status });
  } catch (err: any) {
    console.error('PATCH /api/admin/stocks/[id]/status error', err);
    if (err?.code === 'P2025') {
      return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
