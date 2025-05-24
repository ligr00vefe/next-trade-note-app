'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function updateProductReason(productId: string, reason: string) {
  try {
    if (!productId) {
      throw new Error('상품 ID가 필요합니다.');
    }

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        reason,
      },
    });

    if (!updatedProduct) {
      throw new Error('상품을 찾을 수 없습니다.');
    }

    revalidatePath('/list');
    return updatedProduct;
  } catch (error: any) {
    console.error('구매 사유 업데이트 오류:', error);
    throw new Error(error.message || '구매 사유 업데이트 중 오류가 발생했습니다.');
  }
} 