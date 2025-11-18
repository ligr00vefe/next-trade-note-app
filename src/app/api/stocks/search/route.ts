import { NextResponse } from "next/server";
import prismadb from "@/helpers/prismadb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return new NextResponse("검색어를 입력해주세요.", { status: 400 });
    }

    const stocks = await prismadb.stock.findMany({
      where: {
        shortName: {
          contains: query,
          mode: "insensitive", // 대소문자 구분 없이 검색
        },
      },
      select: {
        id: true,
        shortName: true,
        ticker: true,
        corpCode: true,
      },
      take: 10, // 최대 10개의 결과만 반환
    });

    return NextResponse.json(stocks);
  } catch (error) {
    console.error("주식 검색 API 오류:", error);
    return new NextResponse("내부 서버 오류", { status: 500 });
  }
}

