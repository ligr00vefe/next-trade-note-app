'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleTrade } from '@/actions/updateTradeList';
import styles from './BuySell.module.scss';

interface ISellProps {
  open: boolean;
  onClose: () => void;
  category: string;
  company: string;
  theme1: string;
  theme2: string;
  totalQuantity: number;
  totalPrice: number;
}

export default function Sell({ open, onClose, category, company, theme1, theme2, totalQuantity, totalPrice }: ISellProps) {
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const quantityNum = Number(quantity);
    const priceNum = Number(price);

    if (quantityNum <= 0 || priceNum <= 0) {
      setError('수량과 가격은 0보다 커야 합니다.');
      setIsLoading(false);
      return;
    }

    if (quantityNum > totalQuantity) {
      setError('매도 수량이 보유 수량보다 많을 수 없습니다.');
      setIsLoading(false);
      return;
    }

    try {
      await handleTrade({
        category,
        company,
        quantity: quantityNum,
        price: priceNum,
        theme1,
        theme2,
        orderType: '매도',
      });

      onClose();
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('매도 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['popup']} role="dialog" aria-modal="true" aria-label="매도 팝업" onClick={handleBackdropClick}>
      <div className={styles['popup-content']}>
        {isLoading && <div className={styles['loading-overlay']}>등록 중...</div>}
        <h2 className={styles['title']}>매도 실행</h2>
        <div className={styles['inline-inputs']}>
          <label className={styles['label']}>
            상품 종류
            <input
              type="text"
              value={category}
              disabled
              className={styles['input']}
              aria-label="상품 종류"
            />
          </label>        
        </div>
        <label className={styles['label']}>
          종목명
          <input
            type="text"
            value={company}
            disabled
            className={styles['input']}
            aria-label="종목명"
          />
        </label>
        <div className={styles['inline-inputs']}>
          <label className={styles['label']}>
            매도 금액
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={styles['input']}
              aria-label="매도 금액"
              disabled={isLoading}
            />
          </label>
          <label className={styles['label']}>
            매도 수량
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={styles['input']}
              aria-label="매도 수량"
              disabled={isLoading}
              max={totalQuantity}
            />
          </label>
        </div>
        <div className={styles['inline-inputs']}>
          <label className={styles['label']}>
            테마(1차 분류)
            <input
              type="text"
              value={theme1}
              disabled
              className={styles['input']}
              aria-label="1차 분류"
            />
          </label>
          <label className={styles['label']}>
            테마(2차 분류)
            <input
              type="text"
              value={theme2}
              disabled
              className={styles['input']}
              aria-label="2차 분류"
            />
          </label>
        </div>
        <div className={styles['info-row']}>
          <span>보유 수량: {totalQuantity}</span>
          <span>총 매수 금액: {totalPrice.toLocaleString()}원</span>
        </div>
        {error && <div className={styles['error']}>{error}</div>}
        <div className={styles['btn-row']}>
          <button type="button" className={styles['confirm-btn']} onClick={handleSubmit} tabIndex={0} aria-label="확인" disabled={isLoading}>확인</button>
          <button type="button" className={styles['cancel-btn']} onClick={onClose} tabIndex={0} aria-label="취소" disabled={isLoading}>취소</button>
        </div>
      </div>
    </div>
  );
} 