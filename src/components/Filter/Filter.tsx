'use client';

import { useState } from 'react';
import styles from './Filter.module.scss';

interface FilterProps {
  onChange?: (filters: any) => void;
}

const categories = [
  '주식', 'ETN', 'ETF', '선물', '옵션', '리츠', '채권', '펀드',
  'ELS/DLS', '해외주식', '해외ETF', '해외선물', '해외채권', '금', '원유', '은', '외환'
];

export default function Filter({ onChange }: FilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');
  const [dateRange, setDateRange] = useState({
    startYear: '',
    startMonth: '',
    startDay: '',
    endYear: '',
    endMonth: '',
    endDay: '',
  });

  const toggleCategory = (cat: string) => {
    const updated = selectedCategories.includes(cat)
      ? selectedCategories.filter(c => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(updated);
    onChange?.({ selectedCategories: updated, keyword, dateRange });
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    onChange?.({ selectedCategories, keyword: e.target.value, dateRange });
  };

  const handleDateChange = (key: string, value: string) => {
    const updated = { ...dateRange, [key]: value };
    setDateRange(updated);
    onChange?.({ selectedCategories, keyword, dateRange: updated });
  };

  return (
    <div className={styles['filter-box']}>
      {/* 분류 범위 */}
      <div className={styles['filter-section']}>
        <label className={styles['filter-label']}>분류 범위</label>
        <div className={styles['checkbox-group']}>
          {categories.map(cat => (
            <label key={cat} className={styles['custom-checkbox']}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <span className={styles['checkmark']} />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* 종목명 */}
      <div className={styles['filter-section']}>
        <label className={styles['filter-label']}>종목명</label>
        <input
          type="text"
          value={keyword}
          onChange={handleKeywordChange}
          className={styles['input-text']}
          placeholder="종목명을 입력하세요"
        />
      </div>

      {/* 기간 */}
      <div className={styles['filter-section']}>
        <label className={styles['filter-label']}>기간</label>
        <div className={styles['date-range']}>
          <input
            type="text"
            placeholder="YYYY"
            value={dateRange.startYear}
            onChange={e => handleDateChange('startYear', e.target.value)}
          />
          <span> - </span>
          <input
            type="text"
            placeholder="MM"
            value={dateRange.startMonth}
            onChange={e => handleDateChange('startMonth', e.target.value)}
          />
          <span> - </span>
          <input
            type="text"
            placeholder="DD"
            value={dateRange.startDay}
            onChange={e => handleDateChange('startDay', e.target.value)}
          />

          <span className={styles['tilde']}> ~ </span>

          <input
            type="text"
            placeholder="YYYY"
            value={dateRange.endYear}
            onChange={e => handleDateChange('endYear', e.target.value)}
          />
          <span> - </span>
          <input
            type="text"
            placeholder="MM"
            value={dateRange.endMonth}
            onChange={e => handleDateChange('endMonth', e.target.value)}
          />
          <span> - </span>
          <input
            type="text"
            placeholder="DD"
            value={dateRange.endDay}
            onChange={e => handleDateChange('endDay', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
