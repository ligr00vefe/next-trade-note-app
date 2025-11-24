import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/lib/kiwoom/kiwoomClient";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await kiwoomFetch(
    "/uapi/domestic-stock/v1/trading/order-cash",
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        tr_id: "TTTC0802U",   // 예시: 매수/매도 구분
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data);
}
