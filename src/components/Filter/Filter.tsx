'use client';

import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import styles from './Filter.module.scss';
import { TRADING_CATEGORY_DETAILS } from '@/data/koreaStockData';

interface FilterProps {
  onChange?: (filters: any) => void;
}

const categories = Object.keys(TRADING_CATEGORY_DETAILS);

export default function Filter({ onChange }: FilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isFilterChanged, setIsFilterChanged] = useState(false);

  const toggleCategory = (cat: string) => {
    const updated = selectedCategories.includes(cat)
      ? selectedCategories.filter(c => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(updated);
    setIsFilterChanged(true);
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setIsFilterChanged(true);
  };

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setIsFilterChanged(true);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setIsFilterChanged(true);
  };

  const handleApply = () => {
    const filters = {
      selectedCategories,
      keyword,
      dateRange: {
        startDate: startDate?.toISOString() || null,
        endDate: endDate?.toISOString() || null
      }
    };
    onChange?.(filters);
    setIsFilterChanged(false);
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
        <div className={styles['date-range-container']}>
          <div className={styles['date-picker-wrapper']}>
            <label className={styles['date-label']}>시작일</label>
            <DatePicker
              selected={startDate}
              onChange={handleStartDateChange}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              isClearable
              placeholderText="시작일 선택"
              dateFormat="yyyy-MM-dd"
              locale={ko}
              className={styles['date-picker']}
              maxDate={endDate || new Date()}
            />
          </div>
          <span className={styles['date-separator']}>~</span>
          <div className={styles['date-picker-wrapper']}>
            <label className={styles['date-label']}>종료일</label>
            <DatePicker
              selected={endDate}
              onChange={handleEndDateChange}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || undefined}
              maxDate={new Date()}
              isClearable
              placeholderText="종료일 선택"
              dateFormat="yyyy-MM-dd"
              locale={ko}
              className={styles['date-picker']}
            />
          </div>
        </div>
      </div>

      {/* 적용 버튼 */}
      <div className={styles['apply-button-container']}>
        <button 
          className={`${styles['apply-button']} ${!isFilterChanged ? styles['disabled'] : ''}`}
          onClick={handleApply}
          disabled={!isFilterChanged}
        >
          적용하기
        </button>
      </div>
    </div>
  );
}
