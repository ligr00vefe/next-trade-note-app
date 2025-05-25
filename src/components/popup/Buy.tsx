'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleTrade } from '@/actions/updateTradeList';
import styles from './BuySell.module.scss';
import { KOREA_STOCK_THEMES, TRADING_CATEGORIES } from '@/data/koreaStockThemes';

interface IBuyProps {
  open: boolean;
  onClose: () => void;
  category?: string;
  company?: string;
  theme1?: string;
  theme2?: string;
  isAdditionalBuy?: boolean;
}

export default function Buy({ open, onClose, category = '', company = '', theme1 = '', theme2 = '', isAdditionalBuy = false }: IBuyProps) {
  const [form, setForm] = useState({
    category: category,
    company: company,
    price: '',
    quantity: '',
    theme1: theme1,
    theme2: theme2,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!open) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTheme1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setForm(prev => ({
      ...prev,
      theme1: value,
      theme2: '' // theme1이 변경되면 theme2 초기화
    }));
  };

  const handleTheme2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setForm(prev => ({
      ...prev,
      theme2: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const priceNum = Number(form.price);
    const quantityNum = Number(form.quantity);

    if (priceNum <= 0 || quantityNum <= 0) {
      setError('가격과 수량은 0보다 커야 합니다.');
      setIsLoading(false);
      return;
    }

    try {
      await handleTrade({
        category: form.category,
        company: form.company,
        quantity: quantityNum,
        price: priceNum,
        theme1: form.theme1,
        theme2: form.theme2,
        orderType: '매수',
      });

      onClose();
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('매수 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const theme1Options = Object.keys(KOREA_STOCK_THEMES);
  const theme2Options = form.theme1 ? KOREA_STOCK_THEMES[form.theme1 as keyof typeof KOREA_STOCK_THEMES] : [];

  return (
    <div className={styles['popup']} role="dialog" aria-modal="true" aria-label="매수 팝업" onClick={handleBackdropClick}>
      <div className={styles['popup-content']}>
        {isLoading && <div className={styles['loading-overlay']}>등록 중...</div>}
        <h2 className={styles['title']}>매수 등록</h2>
        <div className={styles['inline-inputs']}>
          <label className={styles['label']}>
            상품 종류
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={styles['input']}
              aria-label="상품 종류"
              disabled={isLoading || isAdditionalBuy}
            >
              <option value="" disabled>상품 종류</option>
              {TRADING_CATEGORIES.map((category: string) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>        
        </div>
        <label className={styles['label']}>
          종목명
          <input
            name="company"
            type="text"
            value={form.company}
            onChange={handleChange}
            className={styles['input']}
            aria-label="종목명"
            disabled={isLoading || isAdditionalBuy}
          />
        </label>
        <div className={styles['inline-inputs']}>
          <label className={styles['label']}>
            매수 금액
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className={styles['input']}
              aria-label="매수 금액"
              disabled={isLoading}
            />
          </label>
          <label className={styles['label']}>
            매수 수량
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              className={styles['input']}
              aria-label="매수 수량"
              disabled={isLoading}
            />
          </label>
        </div>
        <div className={styles['inline-inputs']}>
          <label className={styles['label']}>
            테마(1차 분류)
            <select
              name="theme1"
              value={form.theme1}
              onChange={handleTheme1Change}
              className={styles['input']}
              aria-label="1차 분류"
              disabled={isLoading || isAdditionalBuy}
            >
              <option value="" disabled>1차 분류</option>
              {theme1Options.map((theme: string) => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </label>
          <label className={styles['label']}>
            테마(2차 분류)
            <select
              name="theme2"
              value={form.theme2}
              onChange={handleTheme2Change}
              disabled={!form.theme1 || isLoading || isAdditionalBuy}
              className={styles['input']}
              aria-label="2차 분류"
            >
              <option value="" disabled>2차 분류</option>
              {theme2Options.map((theme: string) => (
                <option key={theme} value={theme}>{theme}</option>
              ))}
            </select>
          </label>
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