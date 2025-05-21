'use client'

import Input from '@/components/input/Input';
import Button from '@/components/ui/Button';
import React, { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// TODO: 임시로 추가, 실제 Auth.module.scss 경로 확인 후 수정
import styles from '../login/Auth.module.scss';

const RegisterClient = () => {

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
    //   console.log('data', data);
      router.push('/login');
    } catch (error) {
      // console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <section className={styles['auth-wrapper']}>
        <div className={styles['container']}>
          <div className={styles['logo']}>
            <h1>회원가입</h1>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles['form']}
          >
            <div className={styles['input-box']}>
              <Input
                id="email"
                label="Email"
                type="email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
            </div>

            <div className={styles['input-box']}>
              <Input
                id="name"
                label="Name"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
            </div>

            <div className={styles['input-box']}>
              <Input
                id="password"
                label="Password"
                type="password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
              />
            </div>

            <div className={styles['btn-area']}>
              <Button
                label="Register"
              />
              <div className={styles['register-chk']}>
                <p>
                  이미 회원가입 하셨나요?{" "}
                  <Link href="/login" className={styles['login-link']}>로그인</Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}

export default RegisterClient;
