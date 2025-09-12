'use client';

import { useEffect, useState } from 'react';
import TradeModal from '@/components/modal/listTrade/TradeModal';
import Container from '@/components/ui/Container';
import styles from './List.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import { ITradeListProps, ITradeListData } from '@/actions/getTradeList';
import { formatKRW } from '@/helpers/formatKRW';
import clsx from 'clsx';
import Pagination from '@/components/pagination/Pagination';
// @ts-ignore
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';
import Sort from '@/components/list/sort/Sort';
import Filter from '@/components/list/filter/Filter';
import Table from '@/components/list/ui/Table';
import MobileCardList from '@/components/list/ui/MobileCardList';

interface IListClientProps {
  initialData: ITradeListProps[];
  initialLimit: number;
  initialPage: number;
  initialTotalItems: number;
}

export default function ListClient({ initialData, initialLimit, initialPage, initialTotalItems }: IListClientProps) {
  // 컴포넌트가 마운트되었는지 확인하는 state
  const [mounted, setMounted] = useState(false);
  // 거래 팝업 관련 상태
  const [tradeModal, setTradeModal] = useState({
    open: false,
    type: 'buy' as 'buy' | 'sell',
    mode: 'new' as 'new' | 'add',
  });
  // 선택된 상품 정보 (매수/매도용)
  const [selectedProduct, setSelectedProduct] = useState<ITradeListProps | null>(null);

  // 매수 버튼 클릭 핸들러
  const handleBuyClick = (product?: ITradeListProps) => {
    if (product) {
      // 추가 매수
      setSelectedProduct(product);
      setTradeModal({
        open: true,
        type: 'buy',
        mode: 'add',
      });
    } else {
      // 신규 매수
      setSelectedProduct(null);
      setTradeModal({
        open: true,
        type: 'buy',
        mode: 'new',
      });
    }
  };

  // 매도 버튼 클릭 핸들러
  const handleSellClick = (product: ITradeListProps) => {
    setSelectedProduct(product);
    setTradeModal({
      open: true,
      type: 'sell',
      mode: 'new',
    });
  };

  // 거래 팝업 닫기 핸들러
  const handleTradeClose = () => {
    setTradeModal(prev => ({
      ...prev,
      open: false,
    }));
  };
  // 페이지네이션 관련 state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);

  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URLSearchParams를 문자열로 변환하여 변경 감지
  const paramsString = searchParams.toString();
  
  // URL 파라미터에서 현재 값들 가져오기 (의존성 배열에 paramsString 추가)
  const urlLimit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : initialLimit;
  const urlPage = searchParams.get('page') ? parseInt(searchParams.get('page')!) : initialPage;

  // URL 파라미터에서 필터 값 가져오기 (의존성 배열에 paramsString 추가)
  const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
  const keyword = searchParams.get('keyword') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  // React Query를 사용하여 데이터 가져오기
  const { data: tradeListData, isLoading, error, refetch } = useQuery<ITradeListData>({
    queryKey: ['tradeList', urlLimit, urlPage, categories, keyword, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: urlLimit.toString(),
        page: urlPage.toString(),
        sortBy: 'createdAt', // 고정값
        sortOrder: 'desc', // 고정값
        ...(categories.length > 0 && { categories: categories.join(',') }),
        ...(keyword && { keyword }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });
      
      const response = await fetch(`/api/trade-list?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch trade list');
      }
      return response.json();
    },
    initialData: {
      data: initialData,
      currentUser: null,
      totalItems: initialTotalItems
    },
    enabled: true, // 항상 쿼리 실행하도록 변경
  });

  // URL 파라미터 변경 감지 및 상태 동기화
  useEffect(() => {
    setMounted(true);
    setProductsPerPage(urlLimit);
    setCurrentPage(urlPage);
    
    // URL 파라미터가 변경될 때마다 refetch 실행
    refetch();
  }, [paramsString, urlLimit, urlPage, refetch]);

  // React Query에서 가져온 데이터 사용
  const allTradeList = tradeListData?.data || initialData;
  const currentProducts = allTradeList;
  const totalItems = tradeListData?.totalItems || initialTotalItems;

  // 페이지당 상품 수 변경 핸들러
  const handleProductsPerPageChange = (value: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', value.toString());
    params.set('page', '1'); // 페이지 수 변경 시 첫 페이지로 이동
    router.push(`/list?${params.toString()}`);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/list?${params.toString()}`);
  };

  if (!mounted) return null;

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <Container>
        <div className={styles['list-wrapper']}>
          <div className={styles['list-header']}>
            <h1 className={styles['list-title']}>매매 리스트</h1>
          </div>
          <Loader />
        </div>
      </Container>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <Container>
        <div className={styles['list-wrapper']}>
          <div className={styles['list-header']}>
            <h1 className={styles['list-title']}>매매 리스트</h1>
          </div>
          <div className={styles['error-message']}>
            데이터를 불러오는 중 오류가 발생했습니다.
            <button 
              onClick={() => refetch()}
              className={styles['retry-btn']}
            >
              다시 시도
            </button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className={styles['list-wrapper']}>
        <div className={styles['list-header']}>
          <h1 className={styles['list-title']}>매매 리스트</h1>
          <button
            className={styles['add-buy-btn']}
            tabIndex={0}
            aria-label="신규 매수"
            onClick={() => handleBuyClick()}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleBuyClick()}
          >
            신규 매수
          </button>
        </div>

        {/* 필터 박스 */}
        <Filter />

        {/* 정렬 박스 */}
        <Sort 
          productsPerPage={productsPerPage}
          onChange={handleProductsPerPageChange}
        />

        {/* 데스크톱 테이블 뷰 */}
        <Table
          data={allTradeList} 
          onBuyClick={handleBuyClick} 
          onSellClick={handleSellClick} 
        />

        {/* 모바일 카드 뷰 */}
        <MobileCardList
          data={allTradeList}
          onBuyClick={handleBuyClick}
          onSellClick={handleSellClick}
        />

        {/* 거래 팝업 */}
        <TradeModal
          type={tradeModal.type}
          mode={tradeModal.mode}
          open={tradeModal.open}
          onClose={handleTradeClose}
          category={selectedProduct?.category || ''}
          company={selectedProduct?.company || ''}
          theme1={selectedProduct?.theme1 || ''}
          theme2={selectedProduct?.theme2 || ''}
          totalQuantity={selectedProduct?.totalQuantity || 0}
          totalPrice={selectedProduct?.totalPrice || 0}
        />

        <Pagination
          currentPage={urlPage}
          setCurrentPage={handlePageChange}
          totalProducts={totalItems}
          productsPerPage={urlLimit}
        />
      </div>
    </Container>
  );
}
