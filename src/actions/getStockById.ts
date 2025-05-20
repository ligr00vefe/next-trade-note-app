import prisma from '@/helpers/prismadb';

interface Params {
  stockId?: string;
}

export default async function getStockById(params: Params) {

  try {
    const { stockId } = params;

    // 종목 하나만 가져오기(findUnique)
    const stock = await prisma.stock.findUnique({
      where: {
        id: stockId,
      },
      // stock 데이터에 user 데이터도 추가(포함;include)
      include: {
        user: true
      }
    });

    // 일치 하는 종목이 없으면 null 반환
    if (!stock) {
      return null;
    }

    return stock;

  } catch (error: any) {
    throw new Error(error);
  }

}