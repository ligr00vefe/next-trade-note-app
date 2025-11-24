import { NextResponse } from "next/server";
import { getToken } from "@/lib/kiwoom/tokenStore";

export async function GET() {
  return NextResponse.json({
    token: getToken() || "No token stored",
  });
}
