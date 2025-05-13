'use client'

import Input from '@/components/Input';
import Button from '@/components/ui/Button';
import React, { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
// import getCurrentUser from '@/app/actions/getCurrentUser';
import { useRouter } from 'next/navigation';

const LoginPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  // console.log('login_useSession: ', { session });
  // console.log('login_session_status: ', status );

  const { register, handleSubmit, formState: {
    errors
  } } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    }
  });


  useEffect(() => { 
    if (session) {
      router.push('/'); // 로그인 페이지 경로
    }
  }, [router, session]);

  const onSubmit: SubmitHandler<FieldValues> = async (body) => {
    setIsLoading(true);
    
    try {
      const data = signIn('credentials', body);
      // console.log('@data', data);
    } catch (error) {
      // console.log('@error', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className='grid h-[calc(100vh_-_56px)] place-items-center'>      
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col justify-center gap-4 min-w-[350px]'
      >
        <div>
          <h3>테스트 계정</h3>
          <p>tester001@testmail.com / 1234</p>
          <p>tester002@testmail.com / 1234</p>
        </div> 
        <h1 className='text-2xl'>로그인</h1>
        
        <Input
          id="email"
          label="Email"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />

        <Input
          id="password"
          label="Password"
          type="password"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />

        <Button 
          label="Login"
        />
        <div className='text-center'>
          <p className='text-gray-400'>
            회원이 아니신가요?{" "}
            <Link href="/auth/register" className='text-black hover:underline'>회원가입</Link>  
          </p>
        </div>
      </form>      
    </section>
  )
}

export default LoginPage 