'use client';
import React from 'react';
import sidebarStyles from "./Sidebar.module.scss";
import { KOREA_STOCK_THEMES } from '@/data/koreaStockData';
import Link from 'next/link';

export function Sidebar() {
  return (
    <nav className={sidebarStyles.sidebar}>
      <ul>
        {KOREA_STOCK_THEMES.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.name} className={sidebarStyles['item']}>
              <Link href={item.href}>
                <Icon className={sidebarStyles['icon']} /> <span>{item.name}</span>
              </Link>
              
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
