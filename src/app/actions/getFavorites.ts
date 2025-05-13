import prisma from "@/helpers/prismadb";
import { Favorite, User } from "@prisma/client";
import getCurrentUser from "@/app/actions/getCurrentUser";

export interface IStocksParams {
  symbol?: string;
  company?: string;
  currency?: string;
  price: number | null;
  desired_selling_price: number | null;
  userId?: string;
  stockId?: string;
}

export interface FavoritesData {
  data: Favorite[] | null;
  currentUser: User | null;
  totalItems: number;
}

export default async function getFavorites(): Promise<FavoritesData> {

  const currentUser = await getCurrentUser();
  console.log('favorites_currentUser', currentUser);
  
  try {
     
    let query: any = {};
    
    if (currentUser?.id) {
      // 현재 사용자의 ID로 favorite 테이블에서 해당 사용자의 데이터만 가져옵니다.
      query.userId = currentUser.id;
      // console.log('query', query);
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
      // console.log('query', query);
    }

    // 테이블의 데이터를 여러개 가져올 때 findMany() 사용    
    const favorites = await prisma.favorite.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      },
    })

    // console.log('favorites_all', favorites);

    // totalItems 전체 아이템 개수
    const totalItems = await prisma.favorite.count({
      where: query
    });

    return {
      data: favorites,
      currentUser,
      totalItems
    }

  } catch (error: any) {
    throw new Error(error);
  }
}