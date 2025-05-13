import { NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

// GET 요청 핸들러
export async function GET(request: Request) {
    const currentUser = await getCurrentUser();
    console.log('favorites_currentUser', currentUser);  
    
    let query: any = {};

    // if (currentUser?.id) {
    //   // 현재 사용자의 ID로 favorite 테이블에서 해당 사용자의 데이터만 가져옵니다.
    //   query.userId = currentUser.id;
    // }

    // if (currentUser?.favoriteIds) {
    //   // 사용자 ID로 사용자의 favoriteIds 필드에 포함된 주식만 가져오도록 수정
    //   const user = await prisma.user.findUnique({
    //     where: { id: currentUser.id },
    //     select: { favoriteIds: true }
    //   });

    //   if (user) {
    //     query.stockId = { in: user.favoriteIds };
    //   }
    // }   

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
      currentUser,
      totalItems
    };

    // console.log('favorites_route_resultData: ', resultData);

    // 성공적인 응답 반환
    return NextResponse.json({ resultData });
}
