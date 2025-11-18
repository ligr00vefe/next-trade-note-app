import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 모든 활성화된 Stock 데이터를 반환하는 API
export async function GET(request: NextRequest) {
  try {
    const stocks = await prisma.stock.findMany({
      where: {
        status: 'ACTIVE'
      },
      orderBy: {
        shortName: 'asc'
      }
    });

    return NextResponse.json(stocks);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stocks' },
      { status: 500 }
    );
  }
}
