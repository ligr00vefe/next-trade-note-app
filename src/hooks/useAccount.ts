import { kiwoomFetch } from "@/lib/kiwoom/kiwoomClient";
import { IAccountEvaluationResponse } from "@/lib/type/accountEval";
import { useQuery } from "@tanstack/react-query";

export const useGetAccountEvaluationQuery = () => {
    return useQuery({
        queryKey: ['useGetAccountEvaluationQuery'],
        queryFn: async () => {
            const { data } = await kiwoomFetch<IAccountEvaluationResponse>(
                `/api/dostk/acnt`, {
                    method: "POST", // POST 메서드 명시
                    data: { // 요청 본문은 data 속성으로 전달
                        qry_tp: "1", // 합산
                        dmst_stex_tp: "KRX" // 한국거래소
                    },
                    headers: {
                        "api-id": "kt00018"
                    },
                }
            )

            if (data.return_code !== 0) { // 문자열 "0"을 숫자 0으로 변경
                throw new Error(data.return_msg);
            }

            return data;
        },
    })
}