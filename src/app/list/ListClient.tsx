'use client';

import { useEffect, useState } from 'react';
import Buy from '@/components/popup/Buy';
import Container from '@/components/ui/Container';
import styles from './List.module.scss';
import { useRouter } from 'next/navigation';
import { ISafeProduct } from '@/actions/getProducts';
import { formatNumber } from '@/helpers/formatNumber';
import { useTheme } from '@/contexts/ThemeContext';

interface IListClientProps {
  products: ISafeProduct[];
}

export default function ListClient({ products }: IListClientProps) {
  const [mounted, setMounted] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [buyData, setBuyData] = useState({
    category: '',
    company: '',
    price: '',
    quantity: '',
    reason: '',
    theme1: '',
    theme2: '',
  });

  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleBuyClick = (row: ISafeProduct) => {
    setBuyData({
      category: row.category,
      company: row.company,
      price: String(row.price),
      quantity: String(row.quantity),
      reason: row.reason || '',
      theme1: row.theme1 || '',
      theme2: row.theme2 || '',
    });
    setBuyOpen(true);
  };

  const handleBuyClose = () => {
    setBuyOpen(false);
    router.refresh();
  };

  return (
    <div className={`${theme}-theme`}>
      <Container>
        <div className={styles['list-root']}>
          <div className={styles['list-header']}>
            <h1 className={styles['list-title']}>매매 리스트</h1>
            <button
              className={styles['add-buy-btn']}
              tabIndex={0}
              aria-label="매수 종목 추가"
              onClick={() => setBuyOpen(true)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && setBuyOpen(true)}
            >
              매수 종목 추가
            </button>
          </div>
          <table className={styles['list-table']}>
            <thead className={styles['list-thead']}>
              <tr className={styles['list-tr']}>
                <th className={styles['list-th']}>분류</th>
                <th className={styles['list-th']}>종목명</th>
                <th className={styles['list-th']}>매수 금액</th>
                <th className={styles['list-th']}>보유 수량</th>
                <th className={styles['list-th']}>총 매수 금액</th>
                <th className={styles['list-th']}>테마</th>
                <th className={styles['list-th']}>구매 사유</th>
                <th className={styles['list-th']}>매매</th>
              </tr>
            </thead>
            <tbody>
              {products && products.map((product) => (
                <tr key={product.id} className={styles['list-tr']}>
                  <td className={styles['list-td']}>{product.category}</td>
                  <td className={styles['list-td']}>{product.company}</td>
                  <td className={styles['list-td']}>{formatNumber(product.price)}</td>
                  <td className={styles['list-td']}>{product.quantity}</td>
                  <td className={styles['list-td']}>{formatNumber(product.totalPrice)}</td>
                  <td className={styles['list-td']}>{(product.theme1 || '') + (product.theme2 ? ` - ${product.theme2}` : '')}</td>
                  <td className={styles['list-td']}>
                    <button
                      className={styles['view-btn']}
                      tabIndex={0}
                      aria-label={`${product.company} 구매 사유 보기`}
                      onClick={() => handleBuyClick(product)}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleBuyClick(product)}
                    >
                      보기
                    </button>
                  </td>
                  <td className={styles['list-td']}>
                    <button
                      className={styles['buy-btn']}
                      tabIndex={0}
                      aria-label={`${product.company} 추가매수`}
                      onClick={() => handleBuyClick(product)}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleBuyClick(product)}
                    >
                      추가매수
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
              {products && products.length === 0 && (
                <tr className={styles['list-tr']}>
                  <td className={styles['list-td']} colSpan={7} style={{ textAlign: 'center' }}>
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
            price={buyData.price}
            quantity={buyData.quantity}
            reason={buyData.reason}
            theme1={buyData.theme1}
            theme2={buyData.theme2}
          />
        </div>
      </Container>
    </div>
  );
}
