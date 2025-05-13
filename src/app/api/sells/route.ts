import { NextRequest, NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';
import prisma from "@/helpers/prismadb";

// GET 요청 처리
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // 데이터 가져오기
    let query: any = {};
         
    const session = await getSession();
    // console.log('session: ', session);
    // session.user에 email이 없을 경우
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Invalid session or user email' });
    }
    // console.log('session.user.email: ', session.user.email);

    // 이메일을 이용해서 데이터베이스에서 요청 정보 찾은 후 가져오기
    const currentUser = await prisma?.user.findUnique({
      where: {
        email: session.user.email
      }
    });
   
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' });
    }

    if (currentUser?.id) {
      // 현재 사용자의 ID로 favorite 테이블에서 해당 사용자의 데이터만 가져옵니다.
      query.userId = currentUser.id;
    }

    if (currentUser?.favoriteIds) {
      // 사용자 ID로 사용자의 favoriteIds 필드에 포함된 주식만 가져오도록 수정
      const user = await prisma.user.findUnique({
        where: { id: currentUser.id },
        select: { favoriteIds: true }
      });

      if (user) {
        query.stockId = { in: user.favoriteIds };
      }
    }   

    // 테이블의 데이터를 여러개 가져올 때 findMany() 사용    
    const favorites = await prisma.favorite.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      },
    })

    const newFavorites = favorites.filter(favorite => {
      if (favorite.price !== null && favorite.price > 0 && favorite.desired_selling_price !== null && favorite.desired_selling_price > 0) {
        // favorite.price가 favorite.desired_selling_price보다 크거나 같은지를 체크하여 필터링
        return favorite.price >= favorite.desired_selling_price;
      }
      return false;
    });
    
    const totalItems = await prisma.favorite.count({
      where: query
    });
    
    const resultData = {
      data: newFavorites,
      currentUser,
      totalItems
    }

    // 성공적인 응답 반환
    return NextResponse.json({ resultData });
  } catch (error) {
    // 오류 처리
    return NextResponse.json({ error: 'Error fetching stocks' });
  }
}