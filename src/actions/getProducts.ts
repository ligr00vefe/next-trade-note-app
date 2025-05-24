'use server';

import prisma from "@/helpers/prismadb";
import { User } from "@prisma/client";
import getCurrentUser from "@/actions/getCurrentUser";

// 직렬화된 주식 데이터를 위한 인터페이스 정의
export interface IProductProps {
  id: string;
  category: string;
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

export interface ProductsData {
  data: IProductProps[] | null; // ISafeProduct 배열 사용
  currentUser: User | null;
  totalItems: number;
}

export default async function getProducts(): Promise<ProductsData> {
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
    const products = await prisma.product.findMany({
      where: {
        userId: currentUser.id,
      },
      orderBy: {
        createdAt: 'desc', // 최신 순으로 정렬 예시
      },
    });

    // 날짜 필드를 포함하여 모든 필드를 ISafeProduct 타입에 맞게 직렬화
    const filteredProducts: IProductProps[] = products.map(product => ({
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      // 다른 Date 타입 필드도 필요시 추가 직렬화
      category: product.category,
      company: product.company,
      price: product.price, // number 타입 유지
      quantity: product.quantity, // number 타입 유지
      totalPrice: product.totalPrice, // number | null 타입 유지
      desired_selling_price: product.desired_selling_price, // number | null 타입 유지
      symbol: product.symbol, // string | null 타입 유지
      currency: product.currency, // string | null 타입 유지
      reason: product.reason, // string | null 타입 유지
    }));

    // totalItems 전체 아이템 개수
    const totalItems = await prisma.product.count({
      where: {
        userId: currentUser.id,
      }
    });

    return {
      data: filteredProducts,
      currentUser,
      totalItems
    };

  } catch (error: any) {
    console.error('Error fetching products:', error);
    // 에러 발생 시 빈 배열 또는 에러 throw
    throw new Error('사용자 주식 정보를 가져오는데 실패했습니다.');
  }
}