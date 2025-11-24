import { NextResponse } from "next/server";
import { kiwoomFetch } from "@/lib/kiwoom/kiwoomClient";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker"); // ex: "005930"

  if (!ticker) {
    return NextResponse.json({ error: "ticker required" }, { status: 400 });
  }

  const data = await kiwoomFetch(`/uapi/domestic-stock/v1/quotations/inquire-price?fid_cond_mrkt_div_code=J&fid_input_iscd=${ticker}`);


  return NextResponse.json(data);
}
