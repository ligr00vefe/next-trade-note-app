import React, { useState, useEffect } from 'react';
import styles from './Buy.module.scss';
import { KOREA_STOCK_THEMES, TRADING_CATEGORIES } from '@/data/koreaStockThemes';
import { createProduct } from '@/actions/createProduct';
import { toast } from 'react-toastify';

interface IBuyProps {
  open: boolean;
  onClose: () => void;
  category: string;
  company: string;
  price: string;
  quantity: string;
  reason: string;
  theme1?: string;
  theme2?: string;
}

const Buy: React.FC<IBuyProps> = ({ open, onClose, category, company, price, quantity, reason, theme1 = '', theme2 = '' }) => {
  const [form, setForm] = useState({
    category: '',
    company: '',
    price: '',
    quantity: '',
    reason: '',
    theme1: '',
    theme2: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ category, company, price, quantity, reason, theme1, theme2 });
    }
  }, [open, category, company, price, quantity, reason, theme1, theme2]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTheme1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, theme1: e.target.value, theme2: '' }));
  };

  const handleTheme2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!form.theme1) {
      setForm((prev) => ({ ...prev, theme2: '' }));
      return;
    }
    setForm((prev) => ({ ...prev, theme2: e.target.value }));
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, reason: e.target.value }));
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    const requiredFields = [
      { name: 'category', value: form.category, label: '상품 종류' },
      { name: 'company', value: form.company, label: '종목명' },
      { name: 'price', value: form.price, label: '매수 금액' },
      { name: 'quantity', value: form.quantity, label: '보유 수량' },
    ];

    const emptyFields = requiredFields.filter(field => !field.value);

    if (emptyFields.length > 0) {
      const missingLabels = emptyFields.map(field => field.label).join(', ');
      alert(`다음 필드를 채워주세요: ${missingLabels}`);
      setIsLoading(false);
      return;
    }

    try {
      await createProduct(form);
      toast.success('매수 정보가 등록되었습니다.');
      onClose();
    } catch (error: any) {
      console.error('매수 정보 등록 오류:', error);
      if (error.message === '이미 등록된 종목입니다.') {
        toast.error('이미 등록된 종목입니다.');
      } else {
        toast.error(`매수 정보 등록 중 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const theme1Options = Object.keys(KOREA_STOCK_THEMES);
  const theme2Options = form.theme1 ? KOREA_STOCK_THEMES[form.theme1 as keyof typeof KOREA_STOCK_THEMES] : [];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
              disabled={isLoading}
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
            disabled={isLoading}
          />
        </label>
        <div className={styles['inline-inputs']}>
          <label className={styles['label']}>
            매수 금액
            <input
              name="price"
              type="text"
              value={form.price}
              onChange={handleChange}
              className={styles['input']}
              aria-label="매수 금액"
              disabled={isLoading}
            />
          </label>
          <label className={styles['label']}>
            보유 수량
            <input
              name="quantity"
              type="text"
              value={form.quantity}
              onChange={handleChange}
              className={styles['input']}
              aria-label="보유 수량"
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
              disabled={isLoading}
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
              disabled={!form.theme1 || isLoading}
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
          구매 사유
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleReasonChange}
            className={styles['textarea']}
            aria-label="구매 사유"
            disabled={isLoading}
            rows={4}
          />
        </label>
        <div className={styles['btn-row']}>
          <button type="button" className={styles['confirm-btn']} onClick={handleConfirm} tabIndex={0} aria-label="확인" disabled={isLoading}>확인</button>
          <button type="button" className={styles['cancel-btn']} onClick={handleCancel} tabIndex={0} aria-label="취소" disabled={isLoading}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default Buy; 