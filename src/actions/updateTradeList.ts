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
  memo?: string;
  reason: string;
  orderType: 'buy' | 'sell';
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
      if (data.orderType === 'buy' && !data.isAdditionalBuy) {
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
          orderType: data.orderType.toUpperCase(),
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

      // 추가 매수일 경우
      if (data.orderType === 'buy') {
        if (existingTradeList) {
          // 기존 종목이 있는 경우 수량과 평균 단가 업데이트
          const newTotalQuantity = existingTradeList.totalQuantity + data.quantity;
          const newTotalPrice = existingTradeList.totalPrice + (data.quantity * data.price);
          const newAvgPrice = Math.round(newTotalPrice / newTotalQuantity);

          await tx.tradeList.update({
            where: { id: existingTradeList.id },
            data: {
              totalQuantity: newTotalQuantity,
              totalPrice: newTotalPrice,
              avgPrice: newAvgPrice,
              theme1: data.theme1,
              theme2: data.theme2,
            },
          });
        } else {
          // 신규 종목인 경우 추가
          await tx.tradeList.create({
            data: {
              userId: currentUser.id,
              category: data.category,
              company: data.company,
              totalQuantity: data.quantity,
              totalPrice: data.quantity * data.price,
              avgPrice: data.price,
              theme1: data.theme1,
              theme2: data.theme2,
            },
          });
        }
      // 매도일 경우
      } else if (data.orderType === 'sell') {
        if (!existingTradeList || existingTradeList.totalQuantity < data.quantity) {
          throw new Error('보유 수량이 부족합니다.');
        }

        // 매도 처리
        const newTotalQuantity = existingTradeList.totalQuantity - data.quantity;
        
        if (newTotalQuantity > 0) {
          // 일부 매도인 경우
          const newTotalPrice = existingTradeList.totalPrice - (data.quantity * data.price);
          const newAvgPrice = Math.round(newTotalPrice / newTotalQuantity);
          
          await tx.tradeList.update({
            where: { id: existingTradeList.id },
            data: {
              totalQuantity: newTotalQuantity,
              totalPrice: newTotalPrice,
              avgPrice: newAvgPrice,
            },
          });
        } else {
          // 전량 매도인 경우
          await tx.tradeList.delete({
            where: { id: existingTradeList.id },
          });
        }
      }

      // 3. 매도 시 InvestmentAccount 업데이트
      if (data.orderType === 'sell' && existingTradeList) {
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

        // 계정 조회 시 ID로 조회
        const accounts = await tx.investmentAccount.findMany({
          where: { userId: currentUser.id },
          take: 1,
        });
        const existingAccount = accounts[0];

        if (existingAccount) {
          await tx.investmentAccount.update({
            where: { id: existingAccount.id },
            data: {
              totalProfitAmount: {
                increment: profitAmount,
              },
              totalProfitRate: {
                // 간단한 수익률 계산 (실제로는 더 복잡한 로직이 필요할 수 있음)
                set: profitRate,
              },
            },
          });
        } else {
          await tx.investmentAccount.create({
            data: {
              userId: currentUser.id,
              name: '기본 계좌',
              totalProfitAmount: profitAmount,
              totalProfitRate: profitRate,
              riskTolerance: '보통',
            },
          });
        }
      }

      return { product };
    });

    return result;
  } catch (error) {
    console.error('거래 처리 중 오류 발생:', error);
    throw error;
  }
}