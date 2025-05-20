'use server';

import prisma from "@/helpers/prismadb";
import { User } from "@prisma/client";
import getCurrentUser from "@/actions/getCurrentUser";

// 직렬화된 주식 데이터를 위한 인터페이스 정의
export interface SafeStock {
  id: string;
  company: string;
  price: number;
  quantity: number;
  theme1: string | null;
  theme2: string | null;
  reason: string | null;
  userId: string;
  createdAt: string; // string 타입으로 변경
  updatedAt: string; // string 타입으로 변경
  symbol: string | null; // schema.prisma에 맞게 추가
  currency: string | null; // schema.prisma에 맞게 추가
  desired_selling_price: number | null; // schema.prisma에 맞게 추가
  totalPrice: number | null; // schema.prisma에 맞게 추가 (Buy.tsx에는 없지만, getStocks에서는 필요할 수 있음)
  // 다른 필드들도 schema.prisma의 Stock 모델에 맞게 추가
}

export interface StocksData {
  data: SafeStock[] | null; // SafeStock 배열 사용
  currentUser: User | null;
  totalItems: number;
}

export default async function getStocks(): Promise<StocksData> {
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
    const stocks = await prisma.stock.findMany({
      where: {
        userId: currentUser.id,
      },
      orderBy: {
        createdAt: 'desc', // 최신 순으로 정렬 예시
      },
    });

    // 날짜 필드를 포함하여 모든 필드를 SafeStock 타입에 맞게 직렬화
    const safeStocks: SafeStock[] = stocks.map(stock => ({
      ...stock,
      createdAt: stock.createdAt.toISOString(),
      updatedAt: stock.updatedAt.toISOString(),
      // 다른 Date 타입 필드도 필요시 추가 직렬화
      price: stock.price, // number 타입 유지
      quantity: stock.quantity, // number 타입 유지
      totalPrice: stock.totalPrice, // number | null 타입 유지
      desired_selling_price: stock.desired_selling_price, // number | null 타입 유지
      symbol: stock.symbol, // string | null 타입 유지
      currency: stock.currency, // string | null 타입 유지
      reason: stock.reason, // string | null 타입 유지
    }));

    // totalItems 전체 아이템 개수
    const totalItems = await prisma.stock.count({
      where: {
        userId: currentUser.id,
      }
    });

    return {
      data: safeStocks,
      currentUser,
      totalItems
    };

  } catch (error: any) {
    console.error('Error fetching stocks:', error);
    // 에러 발생 시 빈 배열 또는 에러 throw
    throw new Error('사용자 주식 정보를 가져오는데 실패했습니다.');
  }
}