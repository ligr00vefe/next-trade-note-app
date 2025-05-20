import React from 'react'
import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User } from '@prisma/client';
import styles from '@/layouts/navbar/Navbar.module.scss';

interface INavItemProps {
  mobile?: boolean;
  // 유저가 로그인 되어서 props로 user 데이터를 받아왔을 때는 Prisma/client에서 제공하는 기본 User 안의 타입을 쓰고 로그인이 안되었을 때는 타입 null
  currentUser?: User | null; // Session 대신 User 타입 사용
}

const NavItem = ({ mobile, currentUser }: INavItemProps) => {
  // console.log('currentUser: ', currentUser);

  return (
    <ul className={`${styles['nav-items-list']} ${mobile ? styles['nav-items-list-sm'] : ''}`}>
      <li><Link href='/list'>매매리스트</Link></li>
      <li><Link href='/mypage'>마이페이지</Link></li>
      {currentUser 
      ? 
        <li><button onClick={() => signOut()}>로그아웃</button></li>
      :
        <li><button onClick={() => signIn()}>로그인</button></li>
      }
    </ul>
  )
}

export default NavItem