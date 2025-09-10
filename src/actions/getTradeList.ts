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

export interface IFilters {
  categories?: string[];
  keyword?: string;
  startDate?: string;
  endDate?: string;
}

export interface ITradeListParams {
  limit?: number; // 페이지당 표시할 개수 (기본값: 10)
  page?: number; // 현재 페이지 (기본값: 1)
  sortBy?: 'createdAt' | 'company' | 'totalPrice' | 'avgPrice'; // 정렬 기준
  sortOrder?: 'asc' | 'desc'; // 정렬 순서 (기본값: 'desc')
  filters?: IFilters; // 필터 옵션
}

export default async function getTradeList(params?: ITradeListParams): Promise<ITradeListData> {
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

  // 파라미터 기본값 설정
  const limit = params?.limit || 10;
  const page = params?.page || 1;
  const sortBy = params?.sortBy || 'createdAt';
  const sortOrder = params?.sortOrder || 'desc';

  // console.log('$limit', limit);
  // console.log('$page', page);
  // console.log('$sortBy', sortBy);
  // console.log('$sortOrder', sortOrder);

  // 페이지네이션을 위한 offset 계산
  const offset = (page - 1) * limit;

  try {
    // 필터 조건 구성
    const whereClause: any = {
      userId: currentUser.id,
      totalQuantity: {
        gt: 0 // totalQuantity가 0보다 큰 데이터만 가져오기
      }
    };

    // 카테고리 필터
    if (params?.filters?.categories?.length) {
      whereClause.category = {
        in: params.filters.categories
      };
    }

    // 키워드 검색 (회사명 또는 테마에서 검색)
    if (params?.filters?.keyword) {
      whereClause.OR = [
        { company: { contains: params.filters.keyword, mode: 'insensitive' } },
        { theme1: { contains: params.filters.keyword, mode: 'insensitive' } },
        { theme2: { contains: params.filters.keyword, mode: 'insensitive' } }
      ];
    }

    // 날짜 범위 필터
    if (params?.filters?.startDate || params?.filters?.endDate) {
      whereClause.createdAt = {};
      if (params.filters.startDate) {
        whereClause.createdAt.gte = new Date(params.filters.startDate);
      }
      if (params.filters.endDate) {
        whereClause.createdAt.lte = new Date(params.filters.endDate);
      }
    }

    const allTradeList = await prisma.tradeList.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sortOrder, // 동적 정렬
      },
      skip: offset, // 페이지네이션을 위한 건너뛸 개수
      take: limit, // 페이지당 표시할 개수 제한
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

    // totalItems 전체 아이템 개수 (필터 조건 적용)
    const totalItems = await prisma.tradeList.count({
      where: whereClause
    });

    return {
      data: filteredTradeList,
      currentUser,
      totalItems
    };
  } catch (error) {
    console.error('Error in getTradeList:', error);
    return {
      data: [],
      currentUser: null,
      totalItems: 0
    };
  }
}