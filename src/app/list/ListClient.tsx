'use client';

import { useEffect, useState } from 'react';
import Buy from '@/components/popup/Buy';
import Container from '@/components/ui/Container';
import styles from './List.module.scss';
import { useRouter } from 'next/navigation';
import { SafeStock } from '@/actions/getStocks';
import { formatNumber } from '@/helpers/formatNumber';
import { useTheme } from '@/contexts/ThemeContext';

interface IListClientProps {
  stocks: SafeStock[];
}

export default function ListClient({ stocks }: IListClientProps) {
  const [mounted, setMounted] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [buyData, setBuyData] = useState({
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

  const handleBuyClick = (row: SafeStock) => {
    setBuyData({
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
                <th className={styles['list-th']}>종목명</th>
                <th className={styles['list-th']}>매수 금액</th>
                <th className={styles['list-th']}>보유 수량</th>
                <th className={styles['list-th']}>총 매수 금액</th>
                <th className={styles['list-th']}>테마</th>
                <th className={styles['list-th']}>구매 사유</th>
                <th className={styles['list-th']}>행동</th>
              </tr>
            </thead>
            <tbody>
              {stocks && stocks.map((stock) => (
                <tr key={stock.id} className={styles['list-tr']}>
                  <td className={styles['list-td']}>{stock.company}</td>
                  <td className={styles['list-td']}>{formatNumber(stock.price)}</td>
                  <td className={styles['list-td']}>{stock.quantity}</td>
                  <td className={styles['list-td']}>{formatNumber(stock.totalPrice)}</td>
                  <td className={styles['list-td']}>{(stock.theme1 || '') + (stock.theme2 ? ` - ${stock.theme2}` : '')}</td>
                  <td className={styles['list-td']}>
                    <button
                      className={styles['view-btn']}
                      tabIndex={0}
                      aria-label={`${stock.company} 구매 사유 보기`}
                      onClick={() => handleBuyClick(stock)}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleBuyClick(stock)}
                    >
                      보기
                    </button>
                  </td>
                  <td className={styles['list-td']}>
                    <button
                      className={styles['buy-btn']}
                      tabIndex={0}
                      aria-label={`${stock.company} 추가매수`}
                      onClick={() => handleBuyClick(stock)}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleBuyClick(stock)}
                    >
                      추가매수
                    </button>
                    <button
                      className={styles['sell-btn']}
                      tabIndex={0}
                      aria-label={`${stock.company} 매도`}
                    >
                      매도
                    </button>
                  </td>
                </tr>
              ))}
              {stocks && stocks.length === 0 && (
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
