'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { handleTrade } from '@/actions/updateTradeList';
import styles from './TradeModal.module.scss';
import { KOREA_STOCK_THEMES, TRADING_CATEGORY_DETAILS } from '@/data/koreaStockData';

type TradeType = 'buy' | 'sell';
type BuyMode = 'new' | 'add';

interface ITradeFormData {
  category: string;
  company: string;
  price: string;
  quantity: string;
  theme1: string;
  theme2: string;
  memo?: string;
}

interface ITradeModalProps {
  type: TradeType;
  mode?: BuyMode;
  open: boolean;
  onClose: () => void;
  category?: string;
  company?: string;
  theme1?: string;
  theme2?: string;
  totalQuantity?: number;
  totalPrice?: number;
}

export default function TradeModal({
  type,
  mode = 'new',
  open,
  onClose,
  category = '',
  company = '',
  theme1 = '',
  theme2 = '',
  totalQuantity = 0,
  totalPrice = 0,
}: ITradeModalProps) {
  const router = useRouter();
  const [form, setForm] = useState<ITradeFormData>({
    category,
    company,
    price: '',
    quantity: '',
    theme1,
    theme2,
    memo: '',
  });

  const [loading, setLoading] = useState(false);

  // 테마 옵션 로드
  useEffect(() => {
    if (open) {
      setForm({
        category,
        company,
        price: '',
        quantity: '',
        theme1,
        theme2,
        memo: '',
      });
    }
  }, [open, category, company, theme1, theme2]);

  const theme1Options = Object.keys(KOREA_STOCK_THEMES);
  const theme2Options = form.theme1 ? KOREA_STOCK_THEMES[form.theme1 as keyof typeof KOREA_STOCK_THEMES] : [];

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'theme1') {
      handleTheme1Change(e as React.ChangeEvent<HTMLSelectElement>);
    } else if (name === 'theme2') {
      handleTheme2Change(e as React.ChangeEvent<HTMLSelectElement>);
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    // 유효성 검사
    if (!form.category) {
      alert('상품 종류를 선택해주세요.');
      setLoading(false);
      return;
    }

    if (!form.company) {
      alert('종목명을 입력해주세요.');
      setLoading(false);
      return;
    }

    if (!form.price) {
      alert(`${type === 'buy' ? '매수' : '매도'} 금액을 입력해주세요.`);
      setLoading(false);
      return;
    }

    const priceNum = Number(form.price);
    if (priceNum < 100) {
      alert('금액을 다시 확인해 주세요.');
      setLoading(false);
      return;
    }

    if (!form.quantity) {
      alert(`${type === 'buy' ? '매수' : '매도'} 수량을 입력해주세요.`);
      setLoading(false);
      return;
    }

    if (type === 'buy' && mode === 'new') {
      if (!form.theme1) {
        alert('1차 분류 테마를 선택해주세요.');
        setLoading(false);
        return;
      }

      if (!form.theme2) {
        alert('2차 분류 테마를 선택해주세요.');
        setLoading(false);
        return;
      }
    }

    const quantityNum = Number(form.quantity);

    if (quantityNum <= 0 || priceNum <= 0) {
      alert('수량과 가격은 0보다 커야 합니다.');
      setLoading(false);
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
        reason: form.memo || '',
        orderType: type,
        isAdditionalBuy: mode === 'add',
      });
      
      onClose();
      // 페이지 새로고침을 확실하게 하기 위해 두 가지 방법 모두 사용
      router.refresh();
      window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert(`${type === 'buy' ? '매수' : '매도'} 처리 중 오류가 발생했습니다.`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  // Add overlay and modal animation classes based on open state
  const overlayClass = `${styles['modal-overlay']} ${open ? styles['active'] : ''}`;
  const modalClass = `${styles['modal']} ${open ? styles['active'] : ''}`;

  return (
    <div className={styles['modal-container']}>
      <div 
        className={overlayClass}
        onClick={onClose}
        role="presentation"
        aria-hidden={!open}
      />
      <div 
        className={modalClass} 
        role="dialog" 
        aria-modal="true" 
        aria-label={type === 'buy' 
          ? mode === 'new' ? '신규 매수' : '추가 매수'
          : '매도'}
        aria-hidden={!open}
      >
        <div className={styles['modal-content']}>
          {loading && <div className={styles['loading-overlay']}>등록 중...</div>}
          <h2 className={styles['title']}>
            {type === 'buy' 
              ? mode === 'new' ? '신규 매수' : '추가 매수'
              : '매도'}
          </h2>
          
          {/* 보유 정보 표시 (매도 및 추가 매수 시) */}
          {(type === 'sell' || (type === 'buy' && mode === 'add')) && (
            <div className={styles['holding-info']}>
              <span>보유 수량: <strong>{totalQuantity}주</strong></span>
              <span>총 매수 금액: <strong>{totalPrice.toLocaleString()}원</strong></span>
            </div>
          )}
          
          <div className={styles['inline-inputs']}>
            <label className={styles['label']}>
              상품 종류
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={styles['input']}
                aria-label="상품 종류"
                disabled={loading || (type === 'buy' && mode === 'add') || type === 'sell'}
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
              disabled={loading || (type === 'buy' && mode === 'add') || type === 'sell'}
            />
          </label>
          
          <div className={styles['inline-inputs']}>
            <label className={styles['label']}>
              {type === 'buy' ? '매수 금액' : '매도 금액'}
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                className={styles['input']}
                aria-label={type === 'buy' ? '매수 금액' : '매도 금액'}
                disabled={loading}
              />
            </label>
            <label className={styles['label']}>
              {type === 'buy' ? '매수 수량' : '매도 수량'}
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleChange}
                className={styles['input']}
                aria-label={type === 'buy' ? '매수 수량' : '매도 수량'}
                disabled={loading}
                max={type === 'sell' ? totalQuantity : undefined}
              />
            </label>
          </div>
          
          {type === 'sell' && (
            <div className={styles['inline-inputs']}>
              <label className={styles['label']}>
                테마(1차 분류)
                <select
                  name="theme1"
                  value={form.theme1}
                  onChange={handleChange}
                  className={styles['input']}
                  aria-label="1차 분류"
                  disabled={loading}
                >
                  <option value="" disabled>1차 분류</option>
                  {theme1Options.map((theme: string) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles['label']}>
                테마(2차 분류)
                <select
                  name="theme2"
                  value={form.theme2}
                  onChange={handleChange}
                  disabled={!form.theme1 || loading}
                  className={styles['input']}
                  aria-label="2차 분류"
                >
                  <option value="" disabled>2차 분류</option>
                  {theme2Options.map((theme: string) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          
          {type === 'buy' && (
            <div className={styles['inline-inputs']}>
              <label className={styles['label']}>
                테마(1차 분류)
                <select
                  name="theme1"
                  value={form.theme1}
                  onChange={handleChange}
                  className={styles['input']}
                  aria-label="1차 분류"
                  disabled={loading || mode === 'add'}
                >
                  <option value="" disabled>1차 분류</option>
                  {theme1Options.map((theme: string) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles['label']}>
                테마(2차 분류)
                <select
                  name="theme2"
                  value={form.theme2}
                  onChange={handleChange}
                  disabled={!form.theme1 || loading || mode === 'add'}
                  className={styles['input']}
                  aria-label="2차 분류"
                >
                  <option value="" disabled>2차 분류</option>
                  {theme2Options.map((theme: string) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
          
          <label className={styles['label']}>
            {type === 'buy' ? '매수 사유' : '매도 사유'}
            <textarea
              name="memo"
              value={form.memo || ''}
              onChange={handleChange}
              className={styles['textarea']}
              aria-label={type === 'buy' ? '매수 사유' : '매도 사유'}
              disabled={loading}
              placeholder={type === 'buy' ? '매수 사유를 입력해주세요' : '매도 사유를 입력해주세요'}
            />
          </label>
          
          <div className={styles['btn-row']}>
            <button 
              type="button" 
              className={styles['confirm-btn']} 
              onClick={handleSubmit} 
              tabIndex={0} 
              aria-label="확인" 
              disabled={loading}
            >
              확인
            </button>
            <button 
              type="button" 
              className={styles['cancel-btn']} 
              onClick={onClose} 
              tabIndex={0} 
              aria-label="취소" 
              disabled={loading}
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
