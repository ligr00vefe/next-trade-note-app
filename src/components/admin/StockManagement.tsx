"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./StockManagement.module.scss";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Loader from "@/components/loader/Loader";

interface IStockProps {
  id: number;
  isinCode: string;
  ticker: string | null;
  name: string;
  shortName: string;
  englishName: string | null;
  listingDate: string | null;
  marketType: string | null;
  securityType: string | null;
  sector: string | null;
  stockType: string | null;
  parValue: number | null;
  listedShares: bigint | null;
}

interface IListResponse {
  items: IStockProps[];
  total: number;
  page: number;
  pageSize: number;
}

const sortables = ["shortName", "ticker"] as const;

type SortKey = (typeof sortables)[number];

function StockManagement() {
  const queryClient = useQueryClient();

  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("shortName");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const excelInputRef = useRef<HTMLInputElement | null>(null);
  const csvInputRef = useRef<HTMLInputElement | null>(null);

  const queryKey = useMemo(
    () => ["stocks", { q, sort, order, page, pageSize }],
    [q, sort, order, page, pageSize]
  );

  // Define default data to prevent undefined errors
  const defaultData: IListResponse = {
    items: [],
    total: 0,
    page: 1,
    pageSize: 20
  };

  const { 
    data = defaultData, 
    isLoading, 
    isFetching, 
    error 
  } = useQuery<IListResponse, Error>({
    queryKey,
    queryFn: async (): Promise<IListResponse> => {
      const params = { q, sort, order, page, pageSize };
      console.log('Fetching data with params:', params);
      
      try {
        const res = await axios.get<IListResponse>("/api/admin/stocks", { params });
        console.log('API Response:', {
          status: res.status,
          data: res.data
        });
        return res.data;
      } catch (error) {
        const err = error as Error & {
          response?: {
            status: number;
            data: any;
          };
          config?: {
            url?: string;
            method?: string;
            params?: any;
          };
        };

        console.error('API Error:', {
          message: err.message,
          response: err.response ? {
            status: err.response.status,
            data: err.response.data
          } : 'No response',
          config: {
            url: err.config?.url,
            method: err.config?.method,
            params: err.config?.params
          }
        });
        throw err;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Handle query errors with useEffect
  useEffect(() => {
    if (error) {
      console.error('Query Error:', error);
      toast.error(`데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`);
    }
  }, [error]);

  // Log successful data fetches
  useEffect(() => {
    if (data && data.items) {
      console.log('Query Success - Data received:', {
        itemsCount: data.items.length,
        total: data.total,
        page: data.page,
        pageSize: data.pageSize
      });
    }
  }, [data]);

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const delistMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      for (const id of ids) {
        await axios.patch(`/api/admin/stocks/${id}/status`, { status: "DELISTED" });
      }
    },
    onSuccess: () => {
      toast.success("상장폐지 처리 완료");
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
      clearSelection();
    },
    onError: () => toast.error("상장폐지 처리 중 오류가 발생했습니다"),
  });

  const onClickDelist = () => {
    if (selected.size === 0) {
      toast.info("선택된 종목이 없습니다");
      return;
    }
    delistMutation.mutate(Array.from(selected));
  };

  const uploadMutation = useMutation({
    mutationFn: async (payload: { file: File }) => {
      const form = new FormData();
      form.append("file", payload.file);
      const res = await axios.post("/api/admin/stocks/upload", form);
      return res.data as { total: number; inserted: number; skipped: number };
    },
    onSuccess: (r) => {
      toast.success(`업로드 완료: 총 ${r.total}개 중 ${r.inserted}개 신규, ${r.skipped}개 PASS`);
      queryClient.invalidateQueries({ queryKey: ["stocks"] });
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || "업로드 실패");
    },
  });

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.currentTarget.value = ""; // 중복 업로드 허용을 위한 reset
    if (!f) return;
    uploadMutation.mutate({ file: f });
  };

  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  console.log('data', data);
  console.log('items', items);
  useEffect(() => {
    // 검색어 변경 시 페이지 초기화
    setPage(1);
  }, [q]);

  const isBusy = isFetching || uploadMutation.isPending || delistMutation.isPending;

  if (isLoading) {
    return <Loader />;
  }

  return (
      <div className={styles["stock-management"]}>
        {isBusy && <Loader />}
        <div className={styles.header}>
          <div className={styles["title-section"]}>
            <h1>종목 관리</h1>
            <p>상장 종목을 조회하고 업로드/상태 변경을 수행합니다</p>
          </div>
          <div className={styles.actions}>
            <input
              ref={excelInputRef}
              type="file"
              accept=".xlsx"
              style={{ display: "none" }}
              onChange={onPickFile}
            />
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={onPickFile}
            />
            <button
              className={styles["upload-btn"]}
              onClick={() => excelInputRef.current?.click()}
              disabled={isBusy}
            >
              Excel 등록
            </button>
            <button
              className={styles["upload-btn"]}
              onClick={() => csvInputRef.current?.click()}
              disabled={isBusy}
            >
              CSV 등록
            </button>
          </div>
        </div>

        <div className={styles.controls}>
          <input
            className={styles["search-input"]}
            placeholder="종목명/단축코드/표준코드 검색"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            disabled={isBusy}
          />

          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} disabled={isBusy}>
            <option value="shortName">종목명</option>
            <option value="ticker">단축코드</option>
            <option value="isinCode">표준코드</option>
          </select>
          <select value={order} onChange={(e) => setOrder(e.target.value as any)} disabled={isBusy}>
            <option value="asc">오름차순</option>
            <option value="desc">내림차순</option>
          </select>
        </div>

        <div className={styles["table-container"]}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>표준코드</th>
                <th>단축코드</th>
                <th>종목명</th>
                <th>종목약명</th>
                <th>영문명</th>
                <th>시장구분</th>
                <th>증권구분</th>
                <th>소속부</th>
                <th>주식종류</th>
                <th>상장일</th>
                <th>액면가</th>
                <th>상장주식수</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s: IStockProps) => (
                <tr key={s.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(s.id)}
                      onChange={() => toggleSelect(s.id)}
                    />
                  </td>
                  <td>{s.isinCode}</td>
                  <td>{s.ticker ?? '-'}</td>
                  <td>{s.name}</td>
                  <td>{s.shortName}</td>
                  <td>{s.englishName ?? '-'}</td>
                  <td>{s.marketType ?? '-'}</td>
                  <td>{s.securityType ?? '-'}</td>
                  <td>{s.sector ?? '-'}</td>
                  <td>{s.stockType ?? '-'}</td>
                  <td>{s.listingDate ? new Date(s.listingDate).toLocaleDateString() : '-'}</td>
                  <td>{s.parValue?.toLocaleString?.() ?? '-'}</td>
                  <td>{s.listedShares ? s.listedShares.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-'}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={13}>
                    <div className={styles["no-results"]}>검색 결과가 없습니다</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <button
            className={styles["page-btn"]}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || isBusy}
          >
            이전
          </button>
          <span>
            {page} / {totalPages} (총 {total.toLocaleString()}건)
          </span>
          <button
            className={styles["page-btn"]}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages || isBusy}
          >
            다음
          </button>

          <button
            className={styles["delist-btn"]}
            onClick={onClickDelist}
            disabled={selected.size === 0 || isBusy}
          >
            상장폐지 처리
          </button>
        </div>
      </div>
  );
}

export default StockManagement;
