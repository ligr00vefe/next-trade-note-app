"use client";

import styles from './Mypage.module.scss';
import { useState, useEffect } from 'react';

export default function MypageClient() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });
  const [activeTab, setActiveTab] = useState('account');

  const handleThemeToggle = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      sessionStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    const rootElement = document.querySelector(`.${styles['mypage-root']}`);
    if (rootElement) {
      rootElement.classList.remove(styles['light-theme'], styles['dark-theme']);
      rootElement.classList.add(styles[theme === 'dark' ? 'dark-theme' : 'light-theme']);
    }
  }, [theme]);

  const renderTabContent = () => {
    if (activeTab === 'account') {
      return (
        <div className={styles['account-info-content']}>
          <div className={styles['info-card']}>
            <h4>계정 정보</h4>
            <ul>
              <li>이메일: user@email.com</li>
              <li>가입일: 2023-01-01</li>
            </ul>
          </div>
          <div className={styles['info-card']}>
            <h4>보안 설정</h4>
            <button>비밀번호 변경</button>
          </div>
          <div className={styles['info-card']}>
            <h4>테마 설정</h4>
            <div className={styles['theme-toggle']}>
              <input
                type="checkbox"
                id="theme-toggle-checkbox"
                className={styles['theme-checkbox']}
                checked={theme === 'light'}
                onChange={handleThemeToggle}
                aria-label="테마 전환"
              />
              <label htmlFor="theme-toggle-checkbox" className={styles['theme-label']}>
                <span className={styles['theme-track']}>
                  <span className={styles['theme-thumb']}></span>
                </span>
                <span className={styles['theme-icons']}>
                  <span className={styles['icon-dark']}>🌙</span>
                  <span className={styles['icon-light']}>☀️</span>
                </span>
              </label>
            </div>
          </div>
        </div>
      );
    } else if (activeTab === 'portfolio') {
      return (
        <div className={styles['portfolio-content']}>
          <section className={styles['portfolio-section']}>
            <h2>Portfolio</h2>
            <div className={styles['chart-placeholder']}>[캔들차트]</div>
          </section>
          <section className={styles['overview-section']}>
            <div className={styles['overview-card']}>
              <h3>수익률</h3>
              <div className={styles['chart-placeholder']}>[수익률 차트]</div>
            </div>
            <div className={styles['overview-card']}>
              <h3>총 자산</h3>
              <div className={styles['asset-value']}>2,229만원</div>
            </div>
          </section>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles['mypage-root']}>
      <aside className={styles['mypage-sidebar']}>
        <button
          className={`${styles['sidebar-tab-btn']} ${activeTab === 'account' ? styles['active'] : ''}`}
          onClick={() => setActiveTab('account')}
          tabIndex={0}
          aria-selected={activeTab === 'account'}
          role="tab"
        >
          계정정보
        </button>
        <button
          className={`${styles['sidebar-tab-btn']} ${activeTab === 'portfolio' ? styles['active'] : ''}`}
          onClick={() => setActiveTab('portfolio')}
          tabIndex={0}
          aria-selected={activeTab === 'portfolio'}
          role="tab"
        >
          포트폴리오
        </button>
        <button className={styles['sidebar-btn']}>Q&A</button>
      </aside>
      <main className={styles['mypage-main']}>
        {renderTabContent()}
      </main>
      <aside className={styles['mypage-info']}>
        <div className={styles['info-card']}>
          <h4>계정 정보</h4>
          <ul>
            <li>이메일: user@email.com</li>
            <li>가입일: 2023-01-01</li>
          </ul>
        </div>
        <div className={styles['info-card']}>
          <h4>보안 설정</h4>
          <button>비밀번호 변경</button>
        </div>
        <div className={styles['info-card']}>
          <h4>테마 설정</h4>
          <div className={styles['theme-toggle']}>
            <input
              type="checkbox"
              id="theme-toggle-checkbox"
              className={styles['theme-checkbox']}
              checked={theme === 'light'}
              onChange={handleThemeToggle}
              aria-label="테마 전환"
            />
            <label htmlFor="theme-toggle-checkbox" className={styles['theme-label']}>
              <span className={styles['theme-track']}>
                <span className={styles['theme-thumb']}></span>
              </span>
              <span className={styles['theme-icons']}>
                <span className={styles['icon-dark']}>🌙</span>
                <span className={styles['icon-light']}>☀️</span>
              </span>
            </label>
          </div>
        </div>
      </aside>
      <div className={styles['mypage-bottom-cards']}>
        <div className={styles['bottom-card']}>Stock Overview</div>
        <div className={styles['bottom-card']}>거래내역</div>
      </div>
    </div>
  );
}
