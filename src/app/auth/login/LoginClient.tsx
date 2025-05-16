"use client";

import Input from '@/components/Input';
import Button from '@/components/ui/Button';
import React, { useEffect, useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './Login.module.scss';

const LoginClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  useEffect(() => { 
    if (session) {
      router.push('/');
    }
  }, [router, session]);

  const onSubmit: SubmitHandler<FieldValues> = async (body) => {
    setIsLoading(true);
    try {
      const data = signIn('credentials', body);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={styles.section}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
      >
        <div className={styles.testAccount}>
          <h3>테스트 계정</h3>
          <p>tester001@testmail.com / 1234</p>
          <p>tester002@testmail.com / 1234</p>
        </div>
        <h1 className={styles.title}>로그인</h1>
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
        <Button label="Login" />
        <div className={styles.textCenter}>
          <p className={styles.textGray}>
            회원이 아니신가요?{" "}
            <Link href="/auth/register" className={styles.link}>회원가입</Link>
          </p>
        </div>
      </form>
    </section>
  );
}

export default LoginClient; 