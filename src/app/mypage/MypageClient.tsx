"use client";

import styles from './Mypage.module.scss';
import { useState, useEffect } from 'react';
import AccountContent from '@/components/mypage/AccountContent';
import PortfolioContent from '@/components/mypage/PortfolioContent';
import SidebarInfo from '@/components/mypage/SidebarInfo';
import Container from '@/components/ui/Container';
import { IKiwoomAccountEvaluationResponse } from '@/lib/type/kiwoom';

export default function MypageClient() {
  const [activeTab, setActiveTab] = useState('account');
  const [evaluation, setEvaluation] = useState<IKiwoomAccountEvaluationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(
          `/api/kiwoom/account`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '서버 응답 오류');
        }

        const data: IKiwoomAccountEvaluationResponse = await response.json();

        if (data.return_code !== 0) {
          throw new Error(data.return_msg);
        }
        setEvaluation(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  if (isLoading) return <div>계좌 정보를 불러오는 중...</div>;
  if (error) return <div>오류 발생: {error?.message}</div>;

  console.log('account evaluation data: ', evaluation);

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
    <Container>
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
    </Container>    
  );
}
