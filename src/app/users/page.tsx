'use client'

import React, { useEffect, useState } from 'react'
import EmptyState from '@/components/EmptyState';

import { User } from '@prisma/client';
import { getSession } from 'next-auth/react';
import axios from 'axios';

const UserPage = () => {

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가


  useEffect(() => {  
    const fetchData = async () => {
      try {            
        const currentSession = await getSession();
        console.log('currentSession: ', currentSession);

        const response = await axios.get('/api/user'); // GET 요청을 보냅니다.
        console.log('response: ', response);

        setCurrentUser(response.data.currentUser);
          
      } catch (error) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  console.log('currentUser: ', currentUser);

  if (isLoading) {
    return <div>로딩 중...</div>; // 로딩 인디케이터 추가
  }

  if (error) {
    return <div>오류: {error}</div>; // 에러 메시지 표시
  }

  if (!currentUser) {
    return (
      <div className='flex flex-col items-center justify-start w-full h-full py-[120px]'>
        <EmptyState title="currentUser를 가져올 수 없습니다." subtitle="코드를 수정해 주세요." />
      </div>
    )
  }else {
    return (    
      <div className='flex flex-col items-center justify-start w-full h-full py-[150px]'>           
        <h1>CurrentUser 정보</h1>
      <p>ID: {currentUser.id}</p>
      <p>이름: {currentUser.name}</p>
      <p>이메일: {currentUser.email}</p>
      </div>
    )
  }  
}

export default UserPage