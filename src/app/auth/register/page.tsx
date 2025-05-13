'use client'

import Input from '@/components/Input';
import Button from '@/components/ui/Button';
import React, { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  
  // 회원가입완료 되었을 때 페이지 이동처리
  const router = useRouter();

  const { register, handleSubmit, formState: {
    errors
  } } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    }
  });

  // form 태그 안의 input에 입력된 값들이 body 객체로 onSubmit 메서드를 통해서 들어옴
  const onSubmit: SubmitHandler<FieldValues> = async (body) => {
    setIsLoading(true);
    // console.log('body', body);

    try {
      const { data } = await axios.post('/api/register', body);
      console.log('data', data);
      router.push('/auth/login');
    } catch (error) {
      // console.log('error', error);
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
        <h1 className='text-2xl'>회원가입</h1>
        
        <Input
          id="email"
          label="Email"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />

        <Input
          id="name"
          label="Name"
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
          label="Register"
        />
        <div className='text-center'>
          <p className='text-gray-400'>
            이미 회원가입 하셨나요?{" "}
            <Link href="/auth/login" className='text-black hover:underline'>로그인</Link>  
          </p>
        </div>
      </form>      
    </section>
  )
}

export default RegisterPage 