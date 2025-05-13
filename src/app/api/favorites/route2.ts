import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

interface IParams {
  userId?: string;
}

// GET 요청 핸들러
export async function GET(request: NextRequest) {
  try {    
    // console.log('favorites_request: ', request);

     // URL 인스턴스 생성
     const url = new URL(request.url);

     // searchParams에서 'userId' 값을 가져옴
     const userId = url.searchParams.get('userId');
 
     console.log('favorites_userId: ', userId);
    
    let query: any = {};

    if (userId) {
      query.userId = userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { favoriteIds: true }
      });

      if (user) {
        query.stockId = { in: user.favoriteIds };
      }
    }

    console.log('query', query);
    const favorites = await prisma.favorite.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      },
    });

    const totalItems = await prisma.favorite.count({
      where: query
    });

    const resultData = {
      data: favorites,
      totalItems
    };

    // console.log('favorites_route_resultData: ', resultData);

    // 성공적인 응답 반환
    return NextResponse.json({ resultData });
  } catch (error) {
    // 오류 처리
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ error: 'Error fetching favorites' });
  }
}
