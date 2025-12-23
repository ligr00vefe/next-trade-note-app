import { NextRequest, NextResponse } from "next/server";
import { kiwoomFetch } from "@/lib/kiwoom/kiwoomClient";
import { IKiwoomAccountEvaluationResponse } from "@/lib/type/kiwoom";

export async function POST(req: NextRequest) {
    try {
        const { data } = await kiwoomFetch<IKiwoomAccountEvaluationResponse>(
            `/api/dostk/acnt`, {
                method: "POST",
                data: {
                    qry_tp: "1", // 합산
                    dmst_stex_tp: "KRX" // 한국거래소
                },
                headers: {
                    "api-id": "kt00018"
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
