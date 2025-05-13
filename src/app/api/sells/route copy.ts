import { NextRequest, NextResponse } from 'next/server';
import getSellStocks from '@/app/actions/getSellStocks';

// GET 요청 처리
export async function GET(request: NextRequest) {
    // 데이터 가져오기
    const resultData = await getSellStocks();
    // console.log('sellStocks_route_resultData: ', resultData);
    // console.log('sellStocks_route_resultData.data: ', resultData.data);
    // console.log('sellStocks_route_resultData.currentSession: ', resultData.currentSession);
    // console.log('sellStocks_route_resultData.totalItems: ', resultData.totalItems);

    // 성공적인 응답 반환
    return NextResponse.json({ resultData });
}