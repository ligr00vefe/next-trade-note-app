'use client';
import React from 'react';
import sidebarStyles from "./Sidebar.module.scss";
import { ADMIN_MENU_ITEMS } from '@/data/menu';
import Link from 'next/link';

export function Sidebar() {
  return (
    <nav className={sidebarStyles.sidebar}>
      <ul>
        {ADMIN_MENU_ITEMS.map((item) => {
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
