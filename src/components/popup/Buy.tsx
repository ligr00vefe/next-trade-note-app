import React, { useState, useEffect } from 'react';
import styles from './Buy.module.scss';

interface BuyProps {
  open: boolean;
  onClose: () => void;
  stockName: string;
  price: string;
  quantity: string;
  reason: string;
}

const Buy: React.FC<BuyProps> = ({ open, onClose, stockName, price, quantity, reason }) => {
  const [form, setForm] = useState({
    stockName: '',
    price: '',
    quantity: '',
    reason: '',
  });

  useEffect(() => {
    if (open) {
      setForm({ stockName, price, quantity, reason });
    }
  }, [open, stockName, price, quantity, reason]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, reason: e.target.value }));
  };

  const handleConfirm = () => {
    // 실제 매수 처리 로직은 여기에 추가
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className={styles.popup} role="dialog" aria-modal="true" aria-label="매수 팝업">
      <h2 className={styles.title}>매수 등록</h2>
      <label className={styles.label}>
        종목명
        <input
          name="stockName"
          type="text"
          value={form.stockName}
          onChange={handleChange}
          className={styles.input}
          aria-label="종목명"
        />
      </label>
      <div className={styles.inlineInputs}>
        <label className={styles.label}>
          매수 금액
          <input
            name="price"
            type="text"
            value={form.price}
            onChange={handleChange}
            className={styles.input}
            aria-label="매수 금액"
          />
        </label>
        <label className={styles.label}>
          보유 수량
          <input
            name="quantity"
            type="text"
            value={form.quantity}
            onChange={handleChange}
            className={styles.input}
            aria-label="보유 수량"
          />
        </label>
      </div>
      <label className={styles.label}>
        구매 사유
        <input
          name="reason"
          type="text"
          value={form.reason}
          onChange={handleReasonChange}
          className={styles.input}
          aria-label="구매 사유"
        />
      </label>
      <div className={styles.buttonRow}>
        <button type="button" className={styles.confirmButton} onClick={handleConfirm} tabIndex={0} aria-label="확인">확인</button>
        <button type="button" className={styles.cancelButton} onClick={handleCancel} tabIndex={0} aria-label="취소">취소</button>
      </div>
    </div>
  );
};

export default Buy; 