'use client'

import React, { useCallback, useRef, useEffect } from 'react';
import styles from './SearchBox.module.scss';
import { IStockProps } from "@/app/(home)/HomeClient"; // Stock 타입 임포트

interface ISearchBoxProps {
  results: IStockProps[];
  onSelect: (stock: IStockProps) => void;
  isLoading: boolean;
}

const SearchBox: React.FC<ISearchBoxProps> = ({ results, onSelect, isLoading }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const selectedIndexRef = useRef<number>(-1);
  // console.log('SearchBox: results: ', results);

  useEffect(() => {
    selectedIndexRef.current = -1; // 검색 결과 변경 시 선택 인덱스 초기화
  }, [results]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLLIElement | HTMLInputElement>) => {
      const items = listRef.current?.children as HTMLCollectionOf<HTMLLIElement>;
      if (!items || items.length === 0) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        selectedIndexRef.current = Math.min(selectedIndexRef.current + 1, items.length - 1);
        items[selectedIndexRef.current]?.focus();
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        selectedIndexRef.current = Math.max(selectedIndexRef.current - 1, 0);
        items[selectedIndexRef.current]?.focus();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        if (selectedIndexRef.current > -1 && results[selectedIndexRef.current]) {
          onSelect(results[selectedIndexRef.current]);
        }
      }
    },
    [results, onSelect]
  );

  return (
    <div className={styles['search-box-container']}>
      {isLoading && <div className={styles['loading-indicator']}>검색 중...</div>}
      {!isLoading && results.length === 0 && (
        <div className={styles['no-results']}>검색 결과가 없습니다.</div>
      )}
      {!isLoading && results.length > 0 && (
        <ul className={styles['search-results-list']} role="listbox" ref={listRef}>
          {results.map((stock, index) => (
            <li
              key={stock.id}
              className={styles['search-result-item']}
              onClick={() => onSelect(stock)}
              onKeyDown={handleKeyDown}
              tabIndex={0} // 접근성을 위해 tabIndex 추가
              role="option"
              aria-selected={selectedIndexRef.current === index}
            >
              {stock.shortName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;