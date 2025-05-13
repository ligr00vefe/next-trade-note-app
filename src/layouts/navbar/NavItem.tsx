import React from 'react'
import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { User } from '@prisma/client';
import styles from '@/layouts/navbar/Navbar.module.scss';

interface INavItemProps {
  mobile?: boolean;
  currentUser?: User | null; 
}

const NavItem = ({ mobile, currentUser }: INavItemProps) => {


  return (
    <ul>
      <li><Link href='/admin/dashboard'>관리자</Link></li>
      <li><Link href='/list'>매매리스트</Link></li>
      <li><Link href='/users'>마이페이지</Link></li>
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