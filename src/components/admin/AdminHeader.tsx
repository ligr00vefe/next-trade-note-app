'use client';

import { signOut } from 'next-auth/react';
import styles from './AdminHeader.module.scss';

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        <h1>관리자 대시보드</h1>
      </div>
      
      <div className={styles.actions}>
        <button className={styles.notificationBtn}>
          <span className={styles.icon}>🔔</span>
        </button>
        
        <div className={styles.userMenu}>
          <div className={styles.userInfo}>
            <span className={styles.userIcon}>👤</span>
            <div className={styles.userDetails}>
              <span className={styles.userName}>{user.name || '관리자'}</span>
              <span className={styles.userEmail}>{user.email}</span>
            </div>
          </div>
          
          <button 
            onClick={handleSignOut}
            className={styles.signOutBtn}
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
