"use client";

import styles from './Mypage.module.scss';
import { useState } from 'react';
import AccountContent from '@/components/mypage/AccountContent';
import PortfolioContent from '@/components/mypage/PortfolioContent';
import SidebarInfo from '@/components/mypage/SidebarInfo';

export default function MypageClient() {
  const [activeTab, setActiveTab] = useState('account');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountContent />;
      case 'portfolio':
        return <PortfolioContent />;
      default:
        return null;
    }
  };

  return (
    <div className={styles['mypage-wrapper']}>
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
        <SidebarInfo />
      </aside>
      <div className={styles['mypage-bottom-cards']}>
        <div className={styles['bottom-card']}>Stock Overview</div>
        <div className={styles['bottom-card']}>거래내역</div>
      </div>
    </div>
  );
}
