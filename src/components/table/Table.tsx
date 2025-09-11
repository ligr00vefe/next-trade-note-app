'use client';

import React from 'react';
import styles from './Table.module.scss';
import { ITradeListProps } from '@/actions/getTradeList';
import { formatKRW } from '@/helpers/formatKRW';
import clsx from 'clsx';

interface TableProps {
  data: ITradeListProps[];
  onBuyClick: (product: ITradeListProps) => void;
  onSellClick: (product: ITradeListProps) => void;
}

const Table: React.FC<TableProps> = ({ data, onBuyClick, onSellClick }) => {
  return (
    <>
      {/* 데스크톱 테이블 뷰 */}
      <table className={styles['list-table']}>
        <thead className={styles['list-thead']}>
          <tr className={styles['list-tr']}>
            <th className={styles['list-th']}>분류</th>
            <th className={styles['list-th']}>종목명</th>
            <th className={styles['list-th']}>평균 매수 금액</th>
            <th className={styles['list-th']}>보유 수량</th>
            <th className={styles['list-th']}>총 매수 금액</th>
            <th className={styles['list-th']}>테마</th>
            <th className={styles['list-th']}>매매</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((product) => (
            <tr key={product.id} className={styles['list-tr']}>
              <td className={styles['list-td']}>{product.category}</td>
              <td className={clsx(styles['list-td'], styles['list-td-company'])}>{product.company}</td>
              <td className={clsx(styles['list-td'], styles['list-td-price'])}>{formatKRW(product.avgPrice)}</td>
              <td className={clsx(styles['list-td'], styles['list-td-quantity'])}>{product.totalQuantity}</td>
              <td className={clsx(styles['list-td'], styles['list-td-total-price'])}>{formatKRW(product.totalPrice)}</td>
              <td className={styles['list-td']}>{(product.theme1 || '') + (product.theme2 ? ` - ${product.theme2}` : '')}</td>
              <td className={styles['list-td']}>
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
              </td>
            </tr>
          ))}
          {data && data.length === 0 && (
            <tr className={styles['list-tr']}>
              <td className={clsx(styles['list-td'], styles['list-td-empty'])} colSpan={7} style={{ textAlign: 'center' }}>
                등록된 매매 내역이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default Table;