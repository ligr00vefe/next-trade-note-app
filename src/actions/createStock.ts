'use server';

import prisma from "@/helpers/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";

interface ICreateStockParams {
  company: string;
  price: string;
  quantity: string;
  reason: string;
  theme1?: string;
  theme2?: string;
  userId?: string;
}

export async function createStock(data: ICreateStockParams) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('로그인이 필요합니다.');
  }

  // TODO: 데이터 유효성 검사 추가 (클라이언트에서 일부 처리됨)

  // 1. 동일 종목 등록 여부 확인
  const existingStock = await prisma.stock.findFirst({
    where: {
      userId: currentUser.id,
      company: data.company,
    },
  });

  if (existingStock) {
    throw new Error('이미 등록된 종목입니다.'); // 중복 시 에러 발생
  }

  // 가격과 수량을 숫자로 변환
  const price = parseFloat(data.price);
  const quantity = parseInt(data.quantity, 10);
  
  // 총 매수 금액 계산
  const totalPrice = price * quantity;

  // 2. 새로운 주식 정보 생성 (중복이 없을 경우)
  const createdStock = await prisma.stock.create({
    data: {
      company: data.company,
      price: price,
      quantity: quantity,
      totalPrice: totalPrice,
      theme1: data.theme1,
      theme2: data.theme2,
      reason: data.reason,
      userId: currentUser.id, // 현재 사용자 ID 연결
    },
  });

  return createdStock;
} 