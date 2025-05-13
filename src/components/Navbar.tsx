'use client'

import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import NavItem from './NavItem';
// import SearchBox from './SearchBox';
import { getSession, useSession } from 'next-auth/react';
import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

const Navbar = () => {

  const [menu, setMenu] = useState(false);
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<Session | null>(null);
  const { data: session, status } = useSession();
  // console.log('Navbar_status', status);

  const handleMenu = () => {
    setMenu(!menu);
  }

  // useEffect(() => {
  //   // 페이지 로드 시에도 경로 업데이트
  //   setCurrentPath(window.location.pathname);  
  // }, []);

  useEffect(() => {  
    // NavItem props용 currentUser 생성
    const fetchCurrentUser = async () => {
      try {
        const user = await getSession();  
        // console.log('Navbar_user: ', user);
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };

    fetchCurrentUser();
    
    // console.log('window.location.pathname: ', window.location.pathname);
    // console.log('Navbar_status: ', status);

    // 만약 로그인이 되어 있지 않다면 로그인 페이지로 리다이렉트합니다.
    // 로그인 상태가 아니고, 현재 페이지가 로그인 페이지가 아닌 경우 로그인 페이지로 리다이렉트
    if (status === "unauthenticated" && window.location.pathname !== '/auth/login') {
      router.push('/api/auth/signin');
    }
  }, [status, router]); 

  return (
    <nav className='relative z-10 w-full bg-blue-500 text-white py-2'>
      <div className='flex items-center justify-between mx-5 sm:mx-10 lg:mx-20'>
        <div className='flex items-center text2xl h-14'>
          <Link href="/">주식알리미</Link>
        </div>

        {/* { currentUser && currentPath !== '/' && 
          <div className='text-2xl'>
            <SearchBox />
          </div>
        }    */}

        <div className='text-2xl sm:hidden'>
          {menu === false ? <button onClick={handleMenu}>+</button> : <button onClick={handleMenu}>-</button>}
        </div>
        
        <div className='hidden sm:block'>
          <NavItem currentUser={currentUser} />
        </div>
      </div>

      <div className='block sm:hidden'>
        {(menu === false) ? null : <NavItem mobile />}
      </div>
    </nav>
  )
}

export default Navbar