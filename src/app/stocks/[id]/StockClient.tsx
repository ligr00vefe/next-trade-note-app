'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { IKiwoomStockBasicInfoResponse } from '@/lib/type/kiwoom';
import styles from "./Stock.module.scss";

interface IStockClientProps {
  id: string;
}

const StockClient = ({ id }: IStockClientProps) => {
  const [stockInfo, setStockInfo] = useState<IKiwoomStockBasicInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [expanded, setExpanded] = useState(false);

  
  // 가독성 있게 숫자 포맷 (간단 버전)
  const fmt = (v?: number | string) => {
    if (v === undefined || v === null || v === "") return "-";
    const n = typeof v === "string" ? Number(v.replace(/[, ]+/g, "")) : Number(v);
    if (Number.isNaN(n)) return String(v);
    // 1,234,567 형태
    return n.toLocaleString();
  };

  const pct = (v?: number | string) => {
    if (v === undefined || v === null || v === "") return "-";
    const n = typeof v === "string" ? Number(v) : Number(v);
    if (Number.isNaN(n)) return String(v);
    return `${n}%`;
  };
  
  const mainFields = useMemo(
    () => [
      { label: "시가총액", value: fmt(stockInfo?.mac) },
      { label: "PER", value: stockInfo?.per ?? "-" },
      { label: "PBR", value: stockInfo?.pbr ?? "-" },
      { label: "ROE", value: stockInfo?.roe ? `${stockInfo?.roe}%` : "-" },
      { label: "EPS", value: fmt(stockInfo?.eps) },
      { label: "BPS", value: fmt(stockInfo?.bps) },
      { label: "연중 최고", value: fmt(stockInfo?.oyr_hgst) },
      { label: "연중 최저", value: fmt(stockInfo?.oyr_lwst) },
      { label: "외인 보유비율", value: pct(stockInfo?.for_exh_rt) },
      { label: "유통비율", value: pct(stockInfo?.dstr_rt) },
    ],
    [stockInfo]
  );

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
    <section className={styles.container} aria-labelledby="stock-title">
      <header className={styles.header}>
        <div className={styles.titleWrap}>
          <h1 id="stock-title" className={styles.title}>
            {stockInfo?.stk_nm ?? "종목명 없음"}
          </h1>
          <div className={styles.code}>{stockInfo?.stk_cd ?? "-"}</div>
        </div>
      </header>

      <div className={styles.grid}>
        {mainFields.slice(0, 3).map((f) => (
          <div key={f.label} className={styles.card}>
            <div className={styles.cardLabel}>{f.label}</div>
            <div className={styles.cardValue}>{f.value}</div>
          </div>
        ))}

        <div className={styles.cardLarge}>
          <div className={styles.cardLabel}>밸류에이션</div>
          <div className={styles.flexRow}>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>PER</div>
              <div className={styles.metricValue}>{stockInfo?.per ?? "-"}</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>PBR</div>
              <div className={styles.metricValue}>{stockInfo?.pbr ?? "-"}</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>ROE</div>
              <div className={styles.metricValue}>{stockInfo?.roe ? `${stockInfo?.roe}%` : "-"}</div>
            </div>
          </div>

          <div className={styles.flexRow} style={{ marginTop: 10 }}>
            <div className={styles.metricSmall}>
              <div className={styles.metricLabel}>EPS</div>
              <div className={styles.metricValue}>{fmt(stockInfo?.eps)}</div>
            </div>
            <div className={styles.metricSmall}>
              <div className={styles.metricLabel}>BPS</div>
              <div className={styles.metricValue}>{fmt(stockInfo?.bps)}</div>
            </div>
            <div className={styles.metricSmall}>
              <div className={styles.metricLabel}>시가총액</div>
              <div className={styles.metricValue}>{fmt(stockInfo?.mac)}</div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>연중 고저</div>
          <div className={styles.cardValue}>
            최고: {fmt(stockInfo?.oyr_hgst)} / 최저: {fmt(stockInfo?.oyr_lwst)}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLabel}>수급 / 유통</div>
          <div className={styles.cardValue}>
            외인: {pct(stockInfo?.for_exh_rt)} / 유통: {pct(stockInfo?.dstr_rt)}
          </div>
        </div>
      </div>

      <div className={styles.expandWrap}>
        <button
          className={styles.expandBtn}
          onClick={() => setExpanded((s) => !s)}
          aria-expanded={expanded}
        >
          {expanded ? "접기" : "재무정보 더보기"}
        </button>

        {expanded && (
          <div className={styles.expandPanel}>
            <div className={styles.row}>
              <div className={styles.panelItem}>
                <div className={styles.panelLabel}>매출액</div>
                <div className={styles.panelValue}>{fmt(stockInfo?.sale_amt)}</div>
              </div>
              <div className={styles.panelItem}>
                <div className={styles.panelLabel}>영업이익</div>
                <div className={styles.panelValue}>{fmt(stockInfo?.bus_pro)}</div>
              </div>
              <div className={styles.panelItem}>
                <div className={styles.panelLabel}>당기순이익</div>
                <div className={styles.panelValue}>{fmt(stockInfo?.cup_nga)}</div>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.panelItem}>
                <div className={styles.panelLabel}>EV</div>
                <div className={styles.panelValue}>{fmt(stockInfo?.ev)}</div>
              </div>
              <div className={styles.panelItem}>
                <div className={styles.panelLabel}>상장주식수</div>
                <div className={styles.panelValue}>{fmt(stockInfo?.flo_stk)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StockClient;