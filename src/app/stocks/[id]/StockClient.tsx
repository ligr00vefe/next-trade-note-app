'use client';
import React, { useEffect, useState } from 'react';
import { IKiwoomStockBasicInfoResponse } from '@/lib/type/kiwoom';

interface IStockClientProps {
  id: string;
}

const StockClient = ({ id }: IStockClientProps) => {
  const [stockInfo, setStockInfo] = useState<IKiwoomStockBasicInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `/api/kiwoom/stock`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '서버 응답 오류');
        }

        const data: IKiwoomStockBasicInfoResponse = await response.json();

        if (data.return_code !== 0) {
          throw new Error(data.return_msg);
        }
        setStockInfo(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();
  }, [id]);

  if (isLoading) return <div>주식 기본 정보를 불러오는 중...</div>;
  if (error) return <div>오류 발생: {error?.message}</div>;

  console.log('stock basic information data: ', stockInfo);

  return (
    <div>
      <h1>주식 상세 정보 (ID: {id})</h1>
      {stockInfo ? (
        <div>
          <p>종목 코드: {stockInfo.stk_cd}</p>
          <p>종목명: {stockInfo.stk_nm}</p>
          {/* 필요한 다른 정보들을 여기에 렌더링 */}
        </div>
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </div>
  );
};

export default StockClient;