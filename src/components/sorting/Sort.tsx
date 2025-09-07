'use client';

import { useState } from 'react';
import clsx from 'clsx';
import styles from './Sort.module.scss';

interface ISortProps {
  productsPerPage: number;
  onChange: (value: number) => void;
}

export default function Sort({ productsPerPage, onChange }: ISortProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className={styles['sort-control']}>
      <div
        className={styles['custom-dropdown']}
        onMouseEnter={() => setIsDropdownOpen(true)}
        onMouseLeave={() => setIsDropdownOpen(false)}
      >
        <div className={styles['dropdown-trigger']}>
          <span className={styles['dropdown-text']}>
            {productsPerPage}개씩 보기
          </span>
          <span className={styles['dropdown-arrow']}>▼</span>
        </div>

        {isDropdownOpen && (
          <div className={styles['dropdown-menu']}>
            {[10, 20, 30].map(size => (
              <div
                key={size}
                className={clsx(
                  styles['dropdown-item'],
                  productsPerPage === size && styles['active']
                )}
                onClick={() => onChange(size)}
              >
                {size}개씩 보기
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
