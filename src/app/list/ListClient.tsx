'use client';

import styles from './List.module.scss';
import { useEffect, useState } from 'react';
import Buy from '@/components/popup/Buy';

export default function ListClient() {
  const [mounted, setMounted] = useState(false);
  const [buyOpen, setBuyOpen] = useState(false);
  const [buyData, setBuyData] = useState({
    stockName: '',
    price: '',
    quantity: '',
    reason: '',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 매수 버튼 클릭 핸들러
  const handleBuyClick = (row: { stockName: string; price: string; quantity: string; reason: string }) => {
    setBuyData(row);
    setBuyOpen(true);
  };

  const handleBuyClose = () => {
    setBuyOpen(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>매매 리스트</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>종목명</th>
            <th>매수 금액</th>
            <th>보유 수량</th>
            <th>매수 종액</th>
            <th>구매 사유</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ABC 사</td>
            <td>50.000</td>
            <td>10</td>
            <td>500.000 원</td>
            <td>
              <button
                className={styles.buyButton}
                onClick={() => handleBuyClick({ stockName: 'ABC 사', price: '50.000', quantity: '10', reason: '매수' })}
                tabIndex={0}
                aria-label="ABC 사 매수"
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleBuyClick({ stockName: 'ABC 사', price: '50.000', quantity: '10', reason: '매수' })}
              >
                매수
              </button>
            </td>
          </tr>
          <tr>
            <td>DEF 주식</td>
            <td>72.500</td>
            <td>5</td>
            <td>362.500 원</td>
            <td>
              <button
                className={styles.buyButton}
                onClick={() => handleBuyClick({ stockName: 'DEF 주식', price: '72.500', quantity: '5', reason: '상장 가능성' })}
                tabIndex={0}
                aria-label="DEF 주식 매수"
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleBuyClick({ stockName: 'DEF 주식', price: '72.500', quantity: '5', reason: '상장 가능성' })}
              >
                매수
              </button>
            </td>
          </tr>
          <tr>
            <td>GHI Co.</td>
            <td>40.000</td>
            <td>20</td>
            <td>800.000 원</td>
            <td>
              <button
                className={styles.buyButton}
                onClick={() => handleBuyClick({ stockName: 'GHI Co.', price: '40.000', quantity: '20', reason: '매수' })}
                tabIndex={0}
                aria-label="GHI Co. 매수"
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleBuyClick({ stockName: 'GHI Co.', price: '40.000', quantity: '20', reason: '매수' })}
              >
                매수
              </button>
            </td>
          </tr>
          <tr>
            <td>JKL Electronics</td>
            <td>85.000</td>
            <td>8</td>
            <td>680.000 원</td>
            <td>
              <button
                className={styles.buyButton}
                onClick={() => handleBuyClick({ stockName: 'JKL Electronics', price: '85.000', quantity: '8', reason: '재약하고 싶은 브랜드' })}
                tabIndex={0}
                aria-label="JKL Electronics 매수"
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleBuyClick({ stockName: 'JKL Electronics', price: '85.000', quantity: '8', reason: '재약하고 싶은 브랜드' })}
              >
                매수
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <Buy
        open={buyOpen}
        onClose={handleBuyClose}
        stockName={buyData.stockName}
        price={buyData.price}
        quantity={buyData.quantity}
        reason={buyData.reason}
      />
    </div>
  );
}
