'use client';

import { useEffect, useState } from 'react';
import styles from './AdminDashboard.module.scss';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalTrades: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalTrades: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // 실제 데이터를 가져오는 API 호출
    // 현재는 더미 데이터로 설정
    setStats({
      totalUsers: 1250,
      totalProducts: 89,
      totalTrades: 3420,
      totalRevenue: 125000000,
    });
  }, []);

  const statCards = [
    {
      title: '총 사용자',
      value: stats.totalUsers.toLocaleString(),
      icon: '👥',
      color: 'blue',
      change: '+12%',
    },
    {
      title: '등록된 상품',
      value: stats.totalProducts.toLocaleString(),
      icon: '📦',
      color: 'green',
      change: '+8%',
    },
    {
      title: '총 거래 수',
      value: stats.totalTrades.toLocaleString(),
      icon: '📈',
      color: 'purple',
      change: '+23%',
    },
    {
      title: '총 거래액',
      value: `${(stats.totalRevenue / 100000000).toFixed(1)}억원`,
      icon: '💰',
      color: 'orange',
      change: '+15%',
    },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>대시보드 개요</h1>
        <p>트레이드 노트 앱의 전체 현황을 확인하세요</p>
      </div>

      <div className={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <div key={index} className={`${styles.statCard} ${styles[stat.color]}`}>
            <div className={styles.statIcon}>
              <span className={styles.icon}>{stat.icon}</span>
            </div>
            <div className={styles.statContent}>
              <h3>{stat.title}</h3>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statChange}>
                <span className={styles.changePositive}>{stat.change}</span>
                <span>지난 달 대비</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h3>최근 거래 활동</h3>
          <div className={styles.chartPlaceholder}>
            <p>차트 컴포넌트가 여기에 표시됩니다</p>
            <small>Chart.js 또는 Recharts 라이브러리를 사용하여 구현 가능</small>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3>인기 상품 TOP 5</h3>
          <div className={styles.topProducts}>
            {['삼성전자', 'SK하이닉스', 'NAVER', '카카오', 'LG화학'].map((product, index) => (
              <div key={index} className={styles.productItem}>
                <span className={styles.rank}>{index + 1}</span>
                <span className={styles.productName}>{product}</span>
                <span className={styles.productCount}>{Math.floor(Math.random() * 500) + 100}건</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.recentActivity}>
        <h3>최근 활동</h3>
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>👤</div>
            <div className={styles.activityContent}>
              <p><strong>새 사용자 가입</strong></p>
              <small>user@example.com - 5분 전</small>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>📈</div>
            <div className={styles.activityContent}>
              <p><strong>대량 거래 발생</strong></p>
              <small>삼성전자 1,000주 매수 - 10분 전</small>
            </div>
          </div>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>⚠️</div>
            <div className={styles.activityContent}>
              <p><strong>시스템 알림</strong></p>
              <small>서버 점검 예정 - 1시간 전</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
