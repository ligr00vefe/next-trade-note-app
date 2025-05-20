'use client';
import Link from 'next/link'
import React, { useState } from 'react'
import NavItem from '@/layouts/navbar/NavItem';
import { User } from '@prisma/client';
import styles from '@/layouts/navbar/Navbar.module.scss';

interface INavbarProps {
  currentUser?: User | null;
}

const Navbar = ({ currentUser }: INavbarProps) => {
  const [menu, setMenu] = useState(false);

  const handleMenu = () => {
    setMenu(!menu);
  }

  return (
    <nav className={styles['nav']}>
      <div className={styles['nav-container']}>
        <div className={styles['logo']}>
          <Link href="/">TradeNote</Link>
        </div>      

        {/* nav-items large screen */}
        <div className={styles['nav-items']}>
          <NavItem currentUser={currentUser} />
        </div>

        {/* 반응형 메뉴 */}
        <div className={styles['nav-items-sm']}>
          <div className={styles['menu-btn']}>
            {(menu === false) ? <button onClick={handleMenu}>+</button> : <button onClick={handleMenu}>-</button>}
          </div>
          {menu === false ? null : <NavItem mobile currentUser={currentUser} />}
        </div>
      </div>     
    </nav>    
  )
}

export default Navbar