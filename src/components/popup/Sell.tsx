'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleTrade } from '@/actions/updateTradeList';
import styles from './BuySell.module.scss';
import { KOREA_STOCK_THEMES, TRADING_CATEGORY_DETAILS } from '@/data/koreaStockData';

interface ISellProps {
  open: boolean;
  onClose: () => void;
  category?: string;
  company?: string;
  theme1?: string;
  theme2?: string;
  totalQuantity: number;
  totalPrice: number;
  onBuyClose?: () => void;
}

export default function Sell({ open, onClose, category = '', company = '', theme1 = '', theme2 = '', totalQuantity, totalPrice, onBuyClose }: ISellProps) {
  const [form, setForm] = useState({
    category: category,
    company: company,
    price: '',
    quantity: '',
    theme1: theme1,
    theme2: theme2,
    reason: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
    setIsLoading(true);

    if (!form.category) {
      alert('상품 종류를 선택해주세요.');
      setIsLoading(false);
      return;
    }

    if (!form.company) {
      alert('종목명을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (!form.price) {
      alert('매도 금액을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (!form.quantity) {
      alert('매도 수량을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (!form.theme1) {
      alert('1차 분류 테마를 선택해주세요.');
      setIsLoading(false);
      return;
    }

    if (!form.theme2) {
      alert('2차 분류 테마를 선택해주세요.');
      setIsLoading(false);
      return;
    }

    const quantityNum = Number(form.quantity);
    const priceNum = Number(form.price);

    if (quantityNum <= 0 || priceNum <= 0) {
      alert('수량과 가격은 0보다 커야 합니다.');
      setIsLoading(false);
      return;
    }

    if (quantityNum > totalQuantity) {
      alert('매도 수량이 보유 수량보다 많을 수 없습니다.');
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
        reason: form.reason,
        orderType: '매도',
      });

      onClose();
      if (onBuyClose) onBuyClose();
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('매도 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const theme1Options = Object.keys(KOREA_STOCK_THEMES);
  const theme2Options = form.theme1 ? KOREA_STOCK_THEMES[form.theme1 as keyof typeof KOREA_STOCK_THEMES] : [];

  return (
    <div className={styles['popup']} role="dialog" aria-modal="true" aria-label="매도 팝업">
      <div className={styles['popup-content']}>
        {isLoading && <div className={styles['loading-overlay']}>등록 중...</div>}
        <h2 className={styles['title']}>매도 등록</h2>
        <div className={styles['inline-inputs']}>
          <label className={styles['label']}>
            상품 종류
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={styles['input']}
              aria-label="상품 종류"
              disabled={true}
            >
              <option value="" disabled>상품 종류</option>
              {Object.keys(TRADING_CATEGORY_DETAILS).map((category: string) => (
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
            disabled={true}
          />
        </label>
        <div className={styles['inline-inputs']}>
          <label className={styles['label']}>
            매도 금액
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className={styles['input']}
              aria-label="매도 금액"
              disabled={isLoading}
            />
          </label>
          <label className={styles['label']}>
            매도 수량
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              className={styles['input']}
              aria-label="매도 수량"
              disabled={isLoading}
              max={totalQuantity}
            />
          </label>
        </div>
        <div className={styles['info-row']}>
          <span>보유 수량: {totalQuantity}</span>{" "}
          <span>총 매수 금액: {totalPrice.toLocaleString()}원</span>
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
              disabled={true}
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
              disabled={true}
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
        <label className={styles['label']}>
          매도 사유
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            className={styles['textarea']}
            aria-label="매도 사유"
            disabled={isLoading}
            placeholder="매도 사유를 입력해주세요"
          />
        </label>
        
        <div className={styles['btn-row']}>
          <button type="button" className={styles['confirm-btn']} onClick={handleSubmit} tabIndex={0} aria-label="확인" disabled={isLoading}>확인</button>
          <button type="button" className={styles['cancel-btn']} onClick={onClose} tabIndex={0} aria-label="취소" disabled={isLoading}>취소</button>
        </div>
      </div>
    </div>
  );
} 