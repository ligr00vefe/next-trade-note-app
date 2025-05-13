'use client';
import React from 'react'
import { signOut } from 'next-auth/react';
import adminNavbarStyles from './AdminNavbar.module.scss';

const AdminNavbar = () => {
  // console.log('currentUser: ', currentUser);

  return (
    <nav className={adminNavbarStyles['nav']}>
      <div className={adminNavbarStyles['nav-container']}>
        <div className={adminNavbarStyles['logout']}>
          <button onClick={() => signOut()}>로그아웃</button>
        </div>      
            
      </div>     
    </nav>    
  )
}

export default AdminNavbar