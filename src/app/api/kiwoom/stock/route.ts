import { NextRequest, NextResponse } from "next/server";
import { kiwoomFetch } from "@/lib/kiwoom/kiwoomClient";
import { IKiwoomStockBasicInfoResponse } from "@/lib/type/kiwoom";
import prismadb from "@/helpers/prismadb";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    const numericId = Number(id);

    // DB에서 id로 ticker 조회
    const stock = await prismadb.stock.findUnique({
      where: { id: numericId },
      select: { ticker: true },
    });
    if (!stock || !stock.ticker) {
      return NextResponse.json({ error: `Can't find stock ticker for id: ${numericId}` }, { status: 404 });
    }
    const ticker = stock.ticker;

    // Kiwoom API 호출
    const { data } = await kiwoomFetch<IKiwoomStockBasicInfoResponse>(
      `/api/dostk/stkinfo`, {
        method: "POST",
        data: {
          stk_cd: ticker,
        },
        headers: {
          "api-id": "ka10001"
        },
      }
    );

    if (data.return_code !== 0) {
      throw new Error(data.return_msg);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
