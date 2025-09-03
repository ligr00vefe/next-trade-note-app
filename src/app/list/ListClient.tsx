'use client';

import { useEffect, useState } from 'react';
import Buy from '@/components/popup/Buy';
import Sell from '@/components/popup/Sell';
import Container from '@/components/ui/Container';
import styles from './List.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import { ITradeListProps, ITradeListData } from '@/actions/getTradeList';
import { formatKRW } from '@/helpers/formatKRW';
import { useTheme } from 'next-themes';
import clsx from 'clsx';
import Pagination from '@/components/pagination/Pagination';
// @ts-ignore
import { useQuery } from '@tanstack/react-query';
import Loader from '@/components/Loader';

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
  // 커스텀 드롭다운 state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme } = useTheme();

  // URL 파라미터에서 현재 값들 가져오기
  const urlLimit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : initialLimit;
  const urlPage = searchParams.get('page') ? parseInt(searchParams.get('page')!) : initialPage;

  // React Query를 사용하여 데이터 가져오기 (limit만 변경)
  const { data: tradeListData, isLoading, error, refetch } = useQuery<ITradeListData>({
    queryKey: ['tradeList', urlLimit, urlPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: urlLimit.toString(),
        page: urlPage.toString(),
        sortBy: 'createdAt', // 고정값
        sortOrder: 'desc', // 고정값
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
    enabled: urlLimit !== initialLimit || urlPage !== initialPage, // 초기 데이터와 다를 때만 쿼리 실행
  });

  // 컴포넌트 마운트 시 mounted state를 true로 설정
  useEffect(() => {
    setMounted(true);
    // URL 파라미터와 동기화
    setProductsPerPage(urlLimit);
    setCurrentPage(urlPage);
  }, [urlLimit, urlPage]);

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
        {/* 데스크톱 테이블 정렬 박스 */}
        <div className={styles['sort-control']}>
          <div 
            className={styles['custom-dropdown']}
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div className={styles['dropdown-trigger']}>
              <span className={styles['dropdown-text']}>
                {productsPerPage}개씩 보기
              </span>
              <span className={styles['dropdown-arrow']}>
                ▼
              </span>
            </div>
            
            {isDropdownOpen && (
              <div className={styles['dropdown-menu']}>
                <div 
                  className={clsx(styles['dropdown-item'], productsPerPage === 10 && styles['active'])}
                  onClick={() => handleProductsPerPageChange(10)}
                >
                  10개씩 보기
                </div>
                <div 
                  className={clsx(styles['dropdown-item'], productsPerPage === 20 && styles['active'])}
                  onClick={() => handleProductsPerPageChange(20)}
                >
                  20개씩 보기
                </div>
                <div 
                  className={clsx(styles['dropdown-item'], productsPerPage === 30 && styles['active'])}
                  onClick={() => handleProductsPerPageChange(30)}
                >
                  30개씩 보기
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 데스크톱 테이블 뷰 */}
        <table className={styles['list-table']}>
          <thead className={styles['list-thead']}>
            <tr className={styles['list-tr']}>
              <th className={styles['list-th']}>분류</th>
              <th className={styles['list-th']}>종목명</th>
              <th className={styles['list-th']}>평균 매수 금액</th>
              <th className={styles['list-th']}>보유 수량</th>
              <th className={styles['list-th']}>총 매수 금액</th>
              <th className={styles['list-th']}>테마</th>
              <th className={styles['list-th']}>매매</th>
            </tr>
          </thead>
          <tbody>
            {allTradeList && allTradeList.map((product: ITradeListProps) => (
              <tr key={product.id} className={styles['list-tr']}>
                <td className={styles['list-td']}>{product.category}</td>
                <td className={clsx(styles['list-td'], styles['list-td-company'])}>{product.company}</td>
                <td className={clsx(styles['list-td'], styles['list-td-price'])}>{formatKRW(product.avgPrice)}</td>
                <td className={clsx(styles['list-td'], styles['list-td-quantity'])}>{product.totalQuantity}</td>
                <td className={clsx(styles['list-td'], styles['list-td-total-price'])}>{formatKRW(product.totalPrice)}</td>
                <td className={styles['list-td']}>{(product.theme1 || '') + (product.theme2 ? ` - ${product.theme2}` : '')}</td>
                <td className={styles['list-td']}>
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
                </td>
              </tr>
            ))}
            {allTradeList && allTradeList.length === 0 && (
              <tr className={styles['list-tr']}>
                <td className={clsx(styles['list-td'], styles['list-td-empty'])} colSpan={8} style={{ textAlign: 'center' }}>
                  등록된 매매 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
            totalPrice={selectedProduct.avgPrice}
          />
        )}

        <Pagination
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          totalProducts={totalItems}
          productsPerPage={productsPerPage}
        />
      </div>
    </Container>
  );
}
