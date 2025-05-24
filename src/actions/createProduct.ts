'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import getCurrentUser from "@/actions/getCurrentUser";

interface ICreateProductParams {
  category: string;
  company: string;
  price: string;
  quantity: string;
  reason: string;
  theme1?: string;
  theme2?: string;
  userId?: string;
  isAdditionalBuy?: boolean;
}

export async function createProduct(data: ICreateProductParams) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('로그인이 필요합니다.');
  }

  // 가격과 수량을 숫자로 변환
  const price = parseFloat(data.price);
  const quantity = parseFloat(data.quantity);
  const totalPrice = price * quantity;
  
  // 신규 매수인 경우에만 중복 체크
  if (!data.isAdditionalBuy) {
    const existingTradeList = await prisma.tradeList.findFirst({
      where: {
        userId: currentUser.id,
        category: data.category,
        company: data.company,
      },
    });

    if (existingTradeList) {
      throw new Error('이미 등록된 종목입니다.');
    }
  }

  // 1. 새로운 주식 정보 생성
  const createdProduct = await prisma.product.create({
    data: {
      category: data.category,
      company: data.company,
      price: price,
      quantity: quantity,
      theme1: data.theme1,
      theme2: data.theme2,
      reason: data.reason,
      userId: currentUser.id,
      orderType: '매수',
    },
  });

  // 2. TradeList 업데이트
  const existingTradeList = await prisma.tradeList.findFirst({
    where: {
      userId: currentUser.id,
      category: data.category,
      company: data.company,
    },
  });

  if (existingTradeList) {
    // 기존 데이터가 있는 경우 업데이트
    const newTotalQuantity = existingTradeList.totalQuantity + quantity;
    const newTotalPrice = existingTradeList.totalPrice + totalPrice;
    const newAvgPrice = newTotalPrice / newTotalQuantity;

    await prisma.tradeList.update({
      where: { id: existingTradeList.id },
      data: {
        totalQuantity: newTotalQuantity,
        totalPrice: newTotalPrice,
        avgPrice: newAvgPrice,
      },
    });
  } else {
    // 새로운 데이터 생성
    await prisma.tradeList.create({
      data: {
        category: data.category,
        company: data.company,
        totalQuantity: quantity,
        totalPrice: totalPrice,
        avgPrice: price,
        theme1: data.theme1,
        theme2: data.theme2,
        userId: currentUser.id,
      },
    });
  }

  revalidatePath('/list');
  return createdProduct;
} 