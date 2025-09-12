'use client';

import { useState } from 'react';
import styles from './Buy.module.scss';
import { updateProductReason } from '@/actions/updateProductReason';
import { toast } from 'react-toastify';

interface IBuyReasonProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  company: string;
  reason: string;
}

export default function BuyReason({ open, onClose, productId, company, reason: initialReason }: IBuyReasonProps) {
  const [reason, setReason] = useState(initialReason);
  const [isLoading, setIsLoading] = useState(false);

  if (!open) return null;

  const handleUpdateReason = async () => {
    try {
      setIsLoading(true);
      await updateProductReason(productId, reason);
      toast.success('구매 사유가 수정되었습니다.');
      onClose();
    } catch (error: any) {
      console.error('구매 사유 수정 실패:', error);
      toast.error(error.message || '구매 사유 수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles['popup']} role="dialog" aria-modal="true" aria-label="구매 사유 수정" onClick={handleBackdropClick}>
      <div className={styles['popup-content']}>
        {isLoading && <div className={styles['loading-overlay']}>수정 중...</div>}
        <h2 className={styles['title']}>{company} 구매 사유</h2>
        <label className={styles['label']}>
          구매 사유
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={styles['textarea']}
            placeholder="구매 사유를 입력하세요"
            rows={5}
            disabled={isLoading}
            aria-label="구매 사유"
          />
        </label>
        <div className={styles['btn-row']}>
          <button
            type="button"
            className={styles['confirm-btn']}
            onClick={handleUpdateReason}
            disabled={isLoading}
            tabIndex={0}
            aria-label="수정"
          >
            수정
          </button>
          <button
            type="button"
            className={styles['cancel-btn']}
            onClick={onClose}
            disabled={isLoading}
            tabIndex={0}
            aria-label="취소"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
