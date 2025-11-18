import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Stock {
  id: number;
  isinCode: string;
  ticker?: string;
  name: string;
  shortName: string;
  englishName?: string;
  listingDate?: Date;
  marketType?: string;
  securityType: string;
  sector?: string;
  stockType: string;
  parValue?: number;
  listedShares?: bigint;
  status: 'ACTIVE' | 'DELISTED';
  createdAt: Date;
  updatedAt: Date;
}

interface StockState {
  // 상태
  stocks: Stock[];
  filteredStocks: Stock[];
  searchTerm: string;
  isLoading: boolean;
  error: string | null;

  // 액션
  setStocks: (stocks: Stock[]) => void;
  setSearchTerm: (term: string) => void;
  setFilteredStocks: (stocks: Stock[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSearch: () => void;

  // 검색 기능
  searchStocks: (searchTerm: string) => void;

  // 초기 데이터 로딩
  loadStocks: () => Promise<void>;
}

export const useStockStore = create<StockState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      stocks: [],
      filteredStocks: [],
      searchTerm: '',
      isLoading: false,
      error: null,

      // 액션들
      setStocks: (stocks) => set({ stocks }, false, 'setStocks'),

      setSearchTerm: (term) => set({ searchTerm: term }, false, 'setSearchTerm'),

      setFilteredStocks: (stocks) => set({ filteredStocks: stocks }, false, 'setFilteredStocks'),

      setLoading: (loading) => set({ isLoading: loading }, false, 'setLoading'),

      setError: (error) => set({ error }, false, 'setError'),

      clearSearch: () => set({
        searchTerm: '',
        filteredStocks: get().stocks
      }, false, 'clearSearch'),

      // 한국어 자음 검색 기능이 포함된 검색 함수
      searchStocks: (searchTerm) => {
        const { stocks } = get();

        if (!searchTerm.trim()) {
          set({ filteredStocks: stocks, searchTerm: '' }, false, 'searchStocks');
          return;
        }

        // 한국어 자음 검색 유틸리티 함수 import
        const { searchByKoreanConsonant } = require('@/lib/korean-search');

        const filtered = searchByKoreanConsonant(stocks, searchTerm);

        set({
          filteredStocks: filtered,
          searchTerm
        }, false, 'searchStocks');
      },

      // 서버에서 Stock 데이터 로딩
      loadStocks: async () => {
        const { setLoading, setError, setStocks } = get();

        setLoading(true);
        setError(null);

        try {
          const response = await fetch('/api/stocks');

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const stocks: Stock[] = await response.json();
          setStocks(stocks);

        } catch (error) {
          console.error('Failed to load stocks:', error);
          setError(error instanceof Error ? error.message : 'Failed to load stocks');
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: 'stock-storage',
    }
  )
);
