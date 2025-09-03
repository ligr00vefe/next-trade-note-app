import { NextRequest, NextResponse } from 'next/server';
import getTradeList from '@/actions/getTradeList';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // URL 파라미터에서 값 추출
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // 타입 검증
    const validSortBy = ['createdAt', 'company', 'totalPrice', 'avgPrice'].includes(sortBy) 
      ? sortBy as 'createdAt' | 'company' | 'totalPrice' | 'avgPrice'
      : 'createdAt';
    
    const validSortOrder = ['asc', 'desc'].includes(sortOrder) 
      ? sortOrder as 'asc' | 'desc'
      : 'desc';

    const result = await getTradeList({
      limit,
      page,
      sortBy: validSortBy,
      sortOrder: validSortOrder
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in trade-list API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trade list' },
      { status: 500 }
    );
  }
}
