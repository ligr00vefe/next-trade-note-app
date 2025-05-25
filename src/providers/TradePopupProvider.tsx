'use client';

import { createContext, useContext, useState } from 'react';
import { ITradeListProps } from '@/actions/getTradeList';

/**
 * TradePopupContext의 타입 정의
 * 
 * 상태:
 * - buyOpen: 매수 팝업 표시 여부
 * - sellOpen: 매도 팝업 표시 여부
 * - selectedProduct: 현재 선택된 상품 정보
 * - buyData: 매수 관련 데이터 (카테고리, 종목명, 테마 등)
 * 
 * 함수:
 * - handleBuyClick: 추가 매수 버튼 클릭 시 호출
 * - handleBuyClose: 매수 팝업 닫기
 * - handleAddNewBuy: 신규 매수 버튼 클릭 시 호출
 * - handleSellClick: 매도 버튼 클릭 시 호출
 * - handleSellClose: 매도 팝업 닫기
 */
interface TradePopupContextType {
  buyOpen: boolean;
  sellOpen: boolean;
  selectedProduct: ITradeListProps | null;
  buyData: {
    category: string;
    company: string;
    theme1: string;
    theme2: string;
    isAdditionalBuy: boolean;
  };
  handleBuyClick: (product: ITradeListProps) => void;
  handleBuyClose: () => void;
  handleAddNewBuy: () => void;
  handleSellClick: (product: ITradeListProps) => void;
  handleSellClose: () => void;
}

// TradePopupContext 생성
const TradePopupContext = createContext<TradePopupContextType | undefined>(undefined);

/**
 * TradePopupProvider 컴포넌트
 * 
 * 기능:
 * 1. 매수/매도 팝업의 상태 관리
 * 2. 선택된 상품 정보 관리
 * 3. 매수/매도 관련 데이터 관리
 * 4. 팝업 열기/닫기 핸들러 제공
 * 
 * @param children - Provider 내부의 자식 컴포넌트들
 */
export function TradePopupProvider({ children }: { children: React.ReactNode }) {
  // 팝업 상태 관리
  const [buyOpen, setBuyOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  
  // 선택된 상품 정보 관리
  const [selectedProduct, setSelectedProduct] = useState<ITradeListProps | null>(null);
  
  // 매수 관련 데이터 관리
  const [buyData, setBuyData] = useState({
    category: '',
    company: '',
    theme1: '',
    theme2: '',
    isAdditionalBuy: false,
  });

  /**
   * 추가 매수 버튼 클릭 핸들러
   * - 선택된 상품 정보로 buyData 설정
   * - 매수 팝업 열기
   */
  const handleBuyClick = (product: ITradeListProps) => {
    // 매도 팝업이 열려있으면 닫기
    if (sellOpen) {
      setSellOpen(false);
      setSelectedProduct(null);
    }

    setBuyData({
      category: product.category,
      company: product.company,
      theme1: product.theme1 || '',
      theme2: product.theme2 || '',
      isAdditionalBuy: true,
    });
    setBuyOpen(true);
  };

  /**
   * 매수 팝업 닫기 핸들러
   * - 매수 팝업 닫기
   * - buyData 초기화
   */
  const handleBuyClose = () => {
    setBuyOpen(false);
    setBuyData({
      category: '',
      company: '',
      theme1: '',
      theme2: '',
      isAdditionalBuy: false,
    });
  };

  /**
   * 신규 매수 버튼 클릭 핸들러
   * - buyData 초기화
   * - 매수 팝업 열기
   */
  const handleAddNewBuy = () => {
    // 매도 팝업이 열려있으면 닫기
    if (sellOpen) {
      setSellOpen(false);
      setSelectedProduct(null);
    }

    setBuyData({
      category: '',
      company: '',
      theme1: '',
      theme2: '',
      isAdditionalBuy: false,
    });
    setBuyOpen(true);
  };

  /**
   * 매도 버튼 클릭 핸들러
   * - 선택된 상품 정보 설정
   * - 매도 팝업 열기
   */
  const handleSellClick = (product: ITradeListProps) => {
    // 매수 팝업이 열려있으면 닫기
    if (buyOpen) {
      setBuyOpen(false);
      setBuyData({
        category: '',
        company: '',
        theme1: '',
        theme2: '',
        isAdditionalBuy: false,
      });
    }

    setSelectedProduct(product);
    setSellOpen(true);
  };

  /**
   * 매도 팝업 닫기 핸들러
   * - 매도 팝업 닫기
   * - 선택된 상품 정보 초기화
   */
  const handleSellClose = () => {
    setSellOpen(false);
    setSelectedProduct(null);
  };

  return (
    <TradePopupContext.Provider
      value={{
        buyOpen,
        sellOpen,
        selectedProduct,
        buyData,
        handleBuyClick,
        handleBuyClose,
        handleAddNewBuy,
        handleSellClick,
        handleSellClose,
      }}
    >
      {children}
    </TradePopupContext.Provider>
  );
}

/**
 * useTradePopup Hook
 * 
 * 기능:
 * 1. TradePopupContext의 값에 접근
 * 2. Provider 외부에서 사용 시 에러 발생
 * 
 * @returns TradePopupContextType - 팝업 관련 상태와 핸들러 함수들
 * @throws Error - Provider 외부에서 사용 시 에러 발생
 */
export function useTradePopup() {
  const context = useContext(TradePopupContext);
  if (context === undefined) {
    throw new Error('useTradePopup must be used within a TradePopupProvider');
  }
  return context;
} 