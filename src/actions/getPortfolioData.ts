'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export type PortfolioData = {
  accountName: string
  riskTolerance: string
  categories: {
    category: string
    totalPrice: number
  }[]
}

export async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      throw new Error('인증되지 않은 사용자입니다.')
    }

    const [account, trades] = await Promise.all([
      prisma.investmentAccount.findFirst({
        where: { userId: session.user.id },
        select: { name: true, riskTolerance: true }
      }),
      prisma.tradeList.groupBy({
        by: ['category'],
        where: { userId: session.user.id },
        _sum: { totalPrice: true }
      })
    ])

    const categories = trades.map(trade => ({
      category: trade.category,
      totalPrice: trade._sum.totalPrice || 0
    }))

    // 데이터가 변경될 때마다 자동으로 재검증
    revalidatePath('/mypage')

    return {
      accountName: account?.name || '',
      riskTolerance: account?.riskTolerance || '',
      categories
    }
  } catch (error) {
    console.error('포트폴리오 데이터 조회 중 오류 발생:', error)
    throw new Error('포트폴리오 데이터를 가져오는데 실패했습니다.')
  }
} 