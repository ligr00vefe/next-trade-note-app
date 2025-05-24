'use server';

import prisma from "@/helpers/prismadb";
import { User } from "@prisma/client";
import getCurrentUser from "@/actions/getCurrentUser";

// 직렬화된 주식 데이터를 위한 인터페이스 정의
export interface ITradeListProps {
  id: string;
  category: string;
  company: string;
  totalQuantity: number;
  totalPrice: number;
  avgPrice: number;
  theme1: string | null;
  theme2: string | null;
  userId: string;
  createdAt: string; // string 타입으로 변경
  updatedAt: string; // string 타입으로 변경  
  // 다른 필드들도 schema.prisma의 Stock 모델에 맞게 추가
  // symbol: string | null; // schema.prisma에 맞게 추가
  // currency: string | null; // schema.prisma에 맞게 추가
  // desiredSellingPrice: number | null; // schema.prisma에 맞게 추가
}

export interface ITradeListData {
  data: ITradeListProps[] | null; // ISafetradeList 배열 사용
  currentUser: User | null;
  totalItems: number;
}

export default async function getTotalList(): Promise<ITradeListData> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    // 로그인되지 않은 경우 빈 배열 반환 또는 에러 throw (요구사항에 따라 선택)
    // 여기서는 로그인되지 않은 경우 주식 목록이 없으므로 빈 배열 반환
    return {
      data: [],
      currentUser: null,
      totalItems: 0
    };
  }

  try {
    const allTradeList = await prisma.tradeList.findMany({
      where: {
        userId: currentUser.id,
      },
      orderBy: {
        createdAt: 'desc', // 최신 순으로 정렬 예시
      },
    });

    // 날짜 필드를 포함하여 모든 필드를 ISafetradeList 타입에 맞게 직렬화
    const filteredTradeList: ITradeListProps[] = allTradeList.map(tradeList => ({
      ...tradeList,
      createdAt: tradeList.createdAt.toISOString(),
      updatedAt: tradeList.updatedAt.toISOString(),
      // 다른 Date 타입 필드도 필요시 추가 직렬화
      category: tradeList.category,
      company: tradeList.company,
      totalQuantity: tradeList.totalQuantity, // number 타입 유지
      totalPrice: tradeList.totalPrice, // number | null 타입 유지
      avgPrice: tradeList.avgPrice, // number 타입 유지
      theme1: tradeList.theme1,
      theme2: tradeList.theme2,
    }));

    // totalItems 전체 아이템 개수
    const totalItems = await prisma.tradeList.count({
      where: {
        userId: currentUser.id,
      }
    });

    return {
      data: filteredTradeList,
      currentUser,
      totalItems
    };

  } catch (error: any) {
    console.error('Error fetching allTradeList:', error);
    // 에러 발생 시 빈 배열 또는 에러 throw
    throw new Error('사용자 주식 정보를 가져오는데 실패했습니다.');
  }
}