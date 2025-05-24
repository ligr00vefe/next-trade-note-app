'use client';

import { useEffect, useState } from 'react';
import Buy from '@/components/popup/Buy';
import BuyReason from '@/components/popup/BuyReason';
import Container from '@/components/ui/Container';
import styles from './List.module.scss';
import { useRouter } from 'next/navigation';
import { ITradeListProps } from '@/actions/getTradeList';
import { formatNumber } from '@/helpers/formatNumber';
import { useTheme } from '@/contexts/ThemeContext';
import clsx from 'clsx';

interface IListClientProps {
  allTradeList: ITradeListProps[];
}

export default function ListClient({ allTradeList }: IListClientProps) {
  const [mounted, setMounted] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [reasonOpen, setReasonOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ITradeListProps | null>(null);
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

  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleBuyClick = (row: ITradeListProps) => {
    setBuyData({
      category: row.category,
      company: row.company,
      totalQuantity: String(row.totalQuantity),
      totalPrice: String(row.totalPrice),
      avgPrice: String(row.avgPrice),
      theme1: row.theme1 || '',
      theme2: row.theme2 || '',
      // 추가 매수일 경우에는 isAdditionalBuy를 true로 설정
      isAdditionalBuy: true,
    });
    setReasonOpen(false);
    setBuyOpen(true);
  };

  const handleReasonClick = (product: ITradeListProps) => {
    setSelectedProduct(product);
    setBuyOpen(false);
    setReasonOpen(true);
  };

  const handleBuyClose = () => {
    setBuyOpen(false);
    router.refresh();
  };

  const handleReasonClose = () => {
    setReasonOpen(false);
    setSelectedProduct(null);
    router.refresh();
  };

  const handleAddNewBuy = () => {
    setBuyData({
      category: '',
      company: '',
      totalQuantity: '',
      totalPrice: '',
      avgPrice: '',
      theme1: '',
      theme2: '',
      // 신규 등록일 경우에는 isAdditionalBuy를 false로 설정
      isAdditionalBuy: false,
    });
    setReasonOpen(false);
    setBuyOpen(true);
  };

  return (
    <Container>
      <div className={styles['list-root']}>
        <div className={styles['list-header']}>
          <h1 className={styles['list-title']}>매매 리스트</h1>
          <button
            className={styles['add-buy-btn']}
            tabIndex={0}
            aria-label="신규 종목 매수"
            onClick={handleAddNewBuy}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setBuyOpen(true)}
          >
            신규 종목 매수
          </button>
        </div>
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
            {allTradeList && allTradeList.map((product) => (
              <tr key={product.id} className={styles['list-tr']}>
                <td className={styles['list-td']}>{product.category}</td>
                <td className={clsx(styles['list-td'], styles['list-td-company'])}>{product.company}</td>
                <td className={clsx(styles['list-td'], styles['list-td-price'])}>{formatNumber(product.avgPrice)}</td>
                <td className={clsx(styles['list-td'], styles['list-td-quantity'])}>{product.totalQuantity}</td>
                <td className={clsx(styles['list-td'], styles['list-td-total-price'])}>{formatNumber(product.totalPrice)}</td>
                <td className={styles['list-td']}>{(product.theme1 || '') + (product.theme2 ? ` - ${product.theme2}` : '')}</td>
                <td className={styles['list-td']}>
                  <button
                    className={styles['add-buy-btn']}
                    tabIndex={0}
                    aria-label={`${product.company} 추가 매수`}
                    onClick={() => {
                      setBuyData({
                        category: product.category,
                        company: product.company,
                        totalQuantity: String(product.totalQuantity),
                        totalPrice: String(product.totalPrice),
                        avgPrice: String(product.avgPrice),
                        theme1: product.theme1 || '',
                        theme2: product.theme2 || '',
                        isAdditionalBuy: true,
                      });
                      setReasonOpen(false);
                      setBuyOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setBuyData({
                          category: product.category,
                          company: product.company,
                          totalQuantity: String(product.totalQuantity),
                          totalPrice: String(product.totalPrice),
                          avgPrice: String(product.avgPrice),
                          theme1: product.theme1 || '',
                          theme2: product.theme2 || '',
                          isAdditionalBuy: true,
                        });
                        setReasonOpen(false);
                        setBuyOpen(true);
                      }
                    }}
                  >
                    추가 매수
                  </button>
                  <button
                    className={styles['sell-btn']}
                    tabIndex={0}
                    aria-label={`${product.company} 매도`}
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

        <Buy
          open={buyOpen}
          onClose={handleBuyClose}
          category={buyData.category}
          company={buyData.company}
          theme1={buyData.theme1}
          theme2={buyData.theme2}
          isAdditionalBuy={buyData.isAdditionalBuy}
        />        
      </div>
    </Container>
  );
}
