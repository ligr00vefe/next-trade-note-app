import { useCallback, useEffect } from 'react';
import { useStockStore, Stock } from '@/store/stockStore';

export interface UseStockSearchResult {
  // 상태
  stocks: Stock[];
  filteredStocks: Stock[];
  searchTerm: string;
  isLoading: boolean;
  error: string | null;

  // 액션
  searchStocks: (term: string) => void;
  clearSearch: () => void;
  loadStocks: () => Promise<void>;
}

export function useStockSearch(): UseStockSearchResult {
  const {
    stocks,
    filteredStocks,
    searchTerm,
    isLoading,
    error,
    searchStocks: storeSearchStocks,
    clearSearch,
    loadStocks: storeLoadStocks,
    setSearchTerm,
  } = useStockStore();

  // 컴포넌트 마운트 시 Stock 데이터 로딩
  useEffect(() => {
    if (stocks.length === 0 && !isLoading) {
      storeLoadStocks();
    }
  }, [stocks.length, isLoading, storeLoadStocks]);

  // 검색어 변경 시 자동으로 검색 수행
  const searchStocks = useCallback((term: string) => {
    setSearchTerm(term);
    storeSearchStocks(term);
  }, [setSearchTerm, storeSearchStocks]);

  // 검색 초기화
  const loadStocks = useCallback(async () => {
    await storeLoadStocks();
  }, [storeLoadStocks]);

  return {
    stocks,
    filteredStocks,
    searchTerm,
    isLoading,
    error,
    searchStocks,
    clearSearch,
    loadStocks,
  };
}
