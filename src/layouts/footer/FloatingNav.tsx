'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@prisma/client';
import styles from './FloatingNav.module.scss';

interface IFloatingNavProps {
  currentUser?: User | null;
}

const FloatingNav = ({ currentUser }: IFloatingNavProps) => {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/info',
      label: '테마정보',
      icon: '📊',
      activeIcon: '📈'
    },
    {
      href: '/list',
      label: '매매리스트',
      icon: '📋',
      activeIcon: '📝'
    },
    {
      href: '/mypage',
      label: '마이페이지',
      icon: '👤',
      activeIcon: '👨‍💼'
    },
    {
      href: '#',
      label: '',
      icon: '',
      activeIcon: ''
    }
  ];

  const isActive = (href: string) => {
    if (href === '#') return false;
    return pathname === href;
  };

  return (
    <nav className={styles['floating-nav']}>
      <div className={styles['floating-nav-container']}>
        {navItems.map((item, index) => {
          if (item.href === '#') {
            return (
              <div key={index} className={styles['nav-item']}>
                <div className={styles['nav-item-placeholder']}></div>
              </div>
            );
          }

          const active = isActive(item.href);
          
          return (
            <Link 
              key={index} 
              href={item.href} 
              className={`${styles['nav-item']} ${active ? styles['active'] : ''}`}
              tabIndex={0}
              aria-label={item.label}
            >
              <div className={styles['nav-icon']}>
                {active ? item.activeIcon : item.icon}
              </div>
              <span className={styles['nav-label']}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default FloatingNav;
