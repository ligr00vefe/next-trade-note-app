'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminSidebar.module.scss';

const navigation = [
  { name: '대시보드', href: '/admin', icon: '🏠' },
  { name: '사용자 관리', href: '/admin/users', icon: '👥' },
  { name: '종목 관리', href: '/admin/stocks', icon: '📈' },
  { name: '상품 관리', href: '/admin/products', icon: '📦' },
  { name: '거래 분석', href: '/admin/analytics', icon: '📊' },
  { name: '공지사항', href: '/admin/notices', icon: '📢' },
  { name: '설정', href: '/admin/settings', icon: '⚙️' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2>관리자 패널</h2>
      </div>
      
      <nav className={styles.nav}>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
