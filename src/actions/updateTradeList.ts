'use server';

import getCurrentUser from '@/actions/getCurrentUser';
import { prisma } from '@/lib/prisma';

interface TradeData {
  category: string;
  company: string;
  quantity: number;
  price: number;
  theme1: string;
  theme2: string;
  reason: string;
  orderType: '매수' | '매도';
  isAdditionalBuy?: boolean;
}

export async function handleTrade(data: TradeData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('로그인이 필요합니다.');
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 신규 매수인 경우 중복 체크
      if (data.orderType === '매수' && !data.isAdditionalBuy) {
        const existingTradeList = await tx.tradeList.findFirst({
          where: {
            userId: currentUser.id,
            category: data.category,
            company: data.company,
            totalQuantity: {
              gt: 0
            }
          },
        });

        if (existingTradeList) {
          throw new Error('이미 등록된 종목입니다.');
        }
      }

      // 1. Product 테이블에 거래 기록 추가
      const product = await tx.product.create({
        data: {
          category: data.category,
          company: data.company,
          quantity: data.quantity,
          price: data.price,
          theme1: data.theme1,
          theme2: data.theme2,
          reason: data.reason,
          orderType: data.orderType,
          createdAt: new Date(),
          userId: currentUser.id,
        },
      });

      // 2. TradeList 테이블 업데이트
      const existingTradeList = await tx.tradeList.findFirst({
        where: {
          userId: currentUser.id,
          category: data.category,
          company: data.company,
        },
      });

      if (!existingTradeList) {
        // 새로운 거래 정보 생성
        const newTrade = await tx.tradeList.create({
          data: {
            userId: currentUser.id,
            category: data.category,
            company: data.company,
            totalQuantity: data.quantity,
            totalPrice: data.price * data.quantity,
            avgPrice: data.price,
            theme1: data.theme1,
            theme2: data.theme2,
          },
        });
        return { product, updatedTrade: newTrade };
      }

      const newQuantity = data.orderType === '매수' 
        ? existingTradeList.totalQuantity + data.quantity
        : existingTradeList.totalQuantity - data.quantity;

      if (newQuantity < 0) {
        throw new Error('보유 수량을 초과했습니다.');
      }

      const newTotalPrice = newQuantity === 0 
        ? 0 
        : data.orderType === '매수'
          ? existingTradeList.totalPrice + (data.price * data.quantity)
          : existingTradeList.totalPrice - (data.price * data.quantity);

      const updatedTrade = await tx.tradeList.update({
        where: { id: existingTradeList.id },
        data: {
          totalQuantity: newQuantity,
          totalPrice: newTotalPrice,
          avgPrice: newQuantity === 0 ? 0 : newTotalPrice / newQuantity,
        },
      });

      // 3. 매도 시 InvestmentAccount 업데이트
      if (data.orderType === '매도') {
        const profitAmount = (data.price - existingTradeList.avgPrice) * data.quantity;
        const profitRate = (data.price / existingTradeList.avgPrice - 1) * 100;

        // Profit 테이블에 수익 데이터 저장
        await tx.profit.create({
          data: {
            userId: currentUser.id,
            company: data.company,
            category: data.category,
            profitAmount,
          },
        });

        const existingAccount = await tx.investmentAccount.findFirst({
          where: { userId: currentUser.id },
        });

        if (existingAccount) {
          await tx.investmentAccount.update({
            where: { id: existingAccount.id },
            data: {
              totalProfitAmount: existingAccount.totalProfitAmount + profitAmount,
              totalProfitRate: existingAccount.totalProfitRate + profitRate,
            },
          });
        } else {
          await tx.investmentAccount.create({
            data: {
              userId: currentUser.id,
              totalProfitAmount: profitAmount,
              totalProfitRate: profitRate,
              riskTolerance: '중립',
            },
          });
        }
      }

      return { product, updatedTrade };
    });

    return result;
  } catch (error) {
    console.error('Trade error:', error);
    throw error;
  }
} 