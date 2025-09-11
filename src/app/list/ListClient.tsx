'use client';

import { useEffect, useState } from 'react';
import Buy from '@/components/popup/Buy';
import Sell from '@/components/popup/Sell';
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
import Sort from '@/components/sort/Sort';
import Filter from '@/components/filter/Filter';
import Table from '@/components/table/Table';

interface IListClientProps {
  initialData: ITradeListProps[];
  initialLimit: number;
  initialPage: number;
  initialTotalItems: number;
}

export default function ListClient({ initialData, initialLimit, initialPage, initialTotalItems }: IListClientProps) {
  // 컴포넌트가 마운트되었는지 확인하는 state
  const [mounted, setMounted] = useState(false);
  // 매수 팝업 표시 여부
  const [buyOpen, setBuyOpen] = useState(false);
  // 매도 팝업 표시 여부
  const [sellOpen, setSellOpen] = useState(false);
  // 매도할 상품 정보
  const [selectedProduct, setSelectedProduct] = useState<ITradeListProps | null>(null);
  // 매수 팝업에 표시할 데이터
  const [buyData, setBuyData] = useState({
    category: '',
    company: '',
    totalQuantity: '',
    totalPrice: '',
    avgPrice: '',
    theme1: '',
    theme2: '',
    isAdditionalBuy: false,
  });
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
      console.log('response', response);
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

  // 추가 매수 버튼 클릭 시 실행되는 함수
  const handleBuyClick = (row: ITradeListProps) => {
    // 매도 팝업이 열려있으면 닫고 선택된 상품 정보 초기화
    if (sellOpen) {
      setSellOpen(false);
      setSelectedProduct(null);
    }

    // 선택된 상품의 정보를 buyData state에 저장
    setBuyData({
      ...row,
      category: row.category,
      company: row.company,
      totalQuantity: String(row.totalQuantity),
      totalPrice: String(row.totalPrice),
      avgPrice: String(row.avgPrice),
      theme1: row.theme1 || '',
      theme2: row.theme2 || '',
      isAdditionalBuy: true,
    });
    // 매수 팝업 열기
    setBuyOpen(true);
  };

  // 매수 팝업 닫기
  const handleBuyClose = () => {
    setBuyOpen(false);
    refetch(); // React Query로 데이터 새로고침
  };

  // 신규 매수 버튼 클릭 시 실행되는 함수
  const handleAddNewBuy = () => {
    // 매도 팝업이 열려있으면 닫고 선택된 상품 정보 초기화
    if (sellOpen) {
      setSellOpen(false);
      setSelectedProduct(null);
    }

    // buyData state 초기화
    setBuyData({
      category: '',
      company: '',
      totalQuantity: '',
      totalPrice: '',
      avgPrice: '',
      theme1: '',
      theme2: '',
      isAdditionalBuy: false,
    });
    // 매수 팝업 열기
    setBuyOpen(true);
  };

  // 매도 버튼 클릭 시 실행되는 함수
  const handleSellClick = (product: ITradeListProps) => {
    // 매수 팝업이 열려있으면 닫기
    if (buyOpen) {
      setBuyOpen(false);
    }

    // 선택된 상품 정보 저장
    const currentProduct = allTradeList.find((item: ITradeListProps) => item.id === product.id);
    if (currentProduct) {
      setSelectedProduct(currentProduct);
      setSellOpen(true);
    }
  };

  // 매도 팝업 닫기
  const handleSellClose = () => {
    setSellOpen(false);
    setSelectedProduct(null);
    refetch(); // React Query로 데이터 새로고침
  };

  // 팝업 외부 클릭 시 실행되는 함수
  const handleBackdropClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    console.log('target', target);
    if (!target.closest(`.${styles['popup']}`)) {
      if (buyOpen) {
        handleBuyClose();
      }
      if (sellOpen) {
        handleSellClose();
      }
    }
  };

  return (
    <Container>
      <div className={styles['list-wrapper']}>
        <div className={styles['list-header']}>
          <h1 className={styles['list-title']}>매매 리스트</h1>
          <button
            className={styles['add-buy-btn']}
            tabIndex={0}
            aria-label="신규 매수"
            onClick={handleAddNewBuy}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleAddNewBuy()}
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
        <div className={styles['mobile-cards']}>
          {allTradeList && allTradeList.map((product: ITradeListProps) => (
            <div key={`mobile-${product.id}`} className={styles['mobile-card']}>
              <div className={styles['card-header']}>
                <div className={styles['card-company']}>{product.company}</div>
                <div className={styles['card-category']}>{product.category}</div>
              </div>
              
              <div className={styles['card-content']}>
                <div className={styles['card-row']}>
                  <span className={styles['card-label']}>평균 매수 금액</span>
                  <span className={styles['card-value']}>{formatKRW(product.avgPrice)}</span>
                </div>
                <div className={styles['card-row']}>
                  <span className={styles['card-label']}>보유 수량</span>
                  <span className={styles['card-value']}>{product.totalQuantity}</span>
                </div>
                <div className={styles['card-row']}>
                  <span className={styles['card-label']}>총 매수 금액</span>
                  <span className={styles['card-value']}>{formatKRW(product.totalPrice)}</span>
                </div>
                {(product.theme1 || product.theme2) && (
                  <div className={styles['card-row']}>
                    <span className={styles['card-label']}>테마</span>
                    <span className={styles['card-value']}>
                      {(product.theme1 || '') + (product.theme2 ? ` - ${product.theme2}` : '')}
                    </span>
                  </div>
                )}
              </div>
              
              <div className={styles['card-actions']}>
                <button
                  className={styles['add-buy-btn']}
                  tabIndex={0}
                  aria-label={`${product.company} 추가 매수`}
                  onClick={() => handleBuyClick(product)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleBuyClick(product)}
                >
                  추가 매수
                </button>
                <button
                  className={styles['sell-btn']}
                  tabIndex={0}
                  aria-label={`${product.company} 매도`}
                  onClick={() => handleSellClick(product)}
                  onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleSellClick(product)}
                >
                  매도
                </button>
              </div>
            </div>
          ))}
          
          {allTradeList && allTradeList.length === 0 && (
            <div className={styles['mobile-empty']}>
              등록된 매매 내역이 없습니다.
            </div>
          )}
        </div>

        {(buyOpen || sellOpen) && (
          <div 
            className={styles['popup-overlay']} 
            onClick={handleBackdropClick}
            role="presentation"
          />
        )}

        <Buy
          key={buyData.company}
          open={buyOpen}
          onClose={handleBuyClose}
          category={buyData.category}
          company={buyData.company}
          theme1={buyData.theme1}
          theme2={buyData.theme2}
          isAdditionalBuy={buyData.isAdditionalBuy}
        />

        {selectedProduct && (
          <Sell
            key={selectedProduct.id}
            open={sellOpen}
            onClose={handleSellClose}
            category={selectedProduct.category}
            company={selectedProduct.company}
            theme1={selectedProduct.theme1 || ''}
            theme2={selectedProduct.theme2 || ''}
            totalQuantity={selectedProduct.totalQuantity}
            totalPrice={selectedProduct.totalPrice}
          />
        )}

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
