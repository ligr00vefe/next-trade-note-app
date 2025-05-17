import { User } from '@prisma/client';
import { Session } from 'next-auth';
import { getSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link'
import React from 'react'

interface NavItemProps {
  mobile?: boolean;

  // 유저가 로그인 되어서 props로 user 데이터를 받아왔을 때는 Prisma/client에서 제공하는 기본 User 안의 타입을 쓰고 로그인이 안되었을 때는 타입 null 
  currentUser?: Session | null; 
}

const NavItem = ({ mobile, currentUser }: NavItemProps) => {
  // useSession을 통해서 session 데이터 바로 확인하기
  // const { data: session, status } = useSession();
  // console.log({ session }, status );
  // console.log('NavItem_session: ', session);
  
  // session?.user?.id

  // getServerSession을 모듈화하여 session 데이터 확인
  // console.log('NavItem_currentUser', currentUser);      

  return (
    <ul className={`nav-items-list ${mobile ? 'nav-items-list-sm' : ''}`}> 
      <li tabIndex={0} aria-label="매매리스트" onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (window.location.href = '/list')}>
        <Link href="/list">매매리스트</Link>
      </li>
      <li tabIndex={0} aria-label="마이페이지" onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (window.location.href = '/mypage')}>
        <Link href="/mypage">마이페이지</Link>
      </li>
      {currentUser ?
        <li tabIndex={0} aria-label="로그아웃" onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && signOut()}>
          <button type="button" onClick={() => signOut()}>로그아웃</button>
        </li>
        :
        <li tabIndex={0} aria-label="로그인" onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && signIn()}>
          <button type="button" onClick={() => signIn()}>로그인</button>
        </li>
      }
    </ul>
  )
}

export default NavItem