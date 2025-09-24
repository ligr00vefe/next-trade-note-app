'use client';

import React from 'react';
import styles from './ListComponents.module.scss';
import { ITradeListProps } from '@/actions/getTradeList';
import { formatKRW } from '@/helpers/formatKRW';

interface IMobileCardListProps {
  data: ITradeListProps[];
  onBuyClick: (product: ITradeListProps) => void;
  onSellClick: (product: ITradeListProps) => void;
}

const MobileCardList: React.FC<IMobileCardListProps> = ({ data, onBuyClick, onSellClick }) => {
  return (
    <div className={styles['mobile-cards']}>
      {data && data.map((product: ITradeListProps) => (
        <div key={`mobile-${product.id}`} className={styles['mobile-card']}>
          <div className={styles['card-header']}>
            <div className={styles['card-company']}>{product.company}</div>
            <div className={styles['card-category']}>{product.category}</div>
          </div>
          
          <div className={styles['card-content']}>
            <div className={styles['card-row']}>
              <span className={styles['card-label']}>평균 매수 금액</span>
              <span className={styles['card-value']}>{formatKRW(product.avgPrice)}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-label']}>보유 수량</span>
              <span className={styles['card-value']}>{product.totalQuantity}</span>
            </div>
            <div className={styles['card-row']}>
              <span className={styles['card-label']}>총 매수 금액</span>
              <span className={styles['card-value']}>{formatKRW(product.totalPrice)}</span>
            </div>
            {(product.theme1 || product.theme2) && (
              <div className={styles['card-row']}>
                <span className={styles['card-label']}>테마</span>
                <span className={styles['card-value']}>
                  {(product.theme1 || '') + (product.theme2 ? ` - ${product.theme2}` : '')}
                </span>
              </div>
            )}
          </div>
          
          <div className={styles['card-actions']}>
            <button
              className={styles['add-buy-btn']}
              tabIndex={0}
              aria-label={`${product.company} 추가 매수`}
              onClick={() => onBuyClick(product)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onBuyClick(product)}
            >
              추가 매수
            </button>
            <button
              className={styles['sell-btn']}
              tabIndex={0}
              aria-label={`${product.company} 매도`}
              onClick={() => onSellClick(product)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onSellClick(product)}
            >
              매도
            </button>
          </div>
        </div>
      ))}
      
      {data && data.length === 0 && (
        <div className={styles['mobile-empty']}>
          등록된 매매 내역이 없습니다.
        </div>
      )}
    </div>
  );
};

export default MobileCardList;
