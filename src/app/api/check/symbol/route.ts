import { NextRequest, NextResponse } from "next/server";
import prisma from "@/helpers/prismadb";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const symbol = url.searchParams.get('symbol');

  if (typeof symbol !== 'string') {  
    return NextResponse.json({ error: 'Symbol must be a string' });
  }  
  
  try {
    const existingStock = await prisma.stock.findFirst({
      where: {
          symbol: symbol,
      }
    });

    // 연산자 !!은 불리언값으로 강제 변환한다. truthy한 값을 true로 falsy(null, undefined 등)값은 false로
    const stockExists = !!existingStock; // Convert to boolean

    return NextResponse.json({ exists: stockExists });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch symbol: ${(error as Error).message}` });
  }
}
