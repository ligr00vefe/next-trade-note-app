'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from './Auth.module.scss';
import Loader from '@/components/loader/Loader';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Input from '@/components/input/Input';
import useCurrentUser from '@/hooks/useCurrentUser';

const LoginClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { isLoggedIn } = useCurrentUser();

    const { register, handleSubmit, formState: {
        errors
    } } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: '',
        }
    });

    React.useEffect(() => {
      if (isLoggedIn) {
        router.push('/');
      }
    }, [isLoggedIn, router]);

    const onSubmit: SubmitHandler<FieldValues> = async (body) => {
        setIsLoading(true);
        try {
          await signIn('credentials', body);
        } catch (error) {
          console.log('@error', error);
        } finally {
          setIsLoading(false);
        }
    }

    return (
        <>
            {isLoading && <Loader />}
            <section className={styles['auth-wrapper']}>
                <div className={styles['container']}>
                    <div className={styles['logo']}>
                        <h1>TRADENOTE</h1>
                        <h1>로그인</h1>
                    </div>

                    <form className={styles['form']} onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles['input-box']}>
                            <Input
                                id="email"
                                label="이메일"
                                type="email"
                                placeholder="이메일을 입력하세요."
                                disabled={isLoading}
                                register={register}
                                errors={errors}
                                required
                            />
                        </div>
                        <div className={styles['input-box']}>                            
                            <Input
                                id="password"
                                label="비밀번호"
                                type="password"
                                placeholder="비밀번호를 입력하세요."
                                disabled={isLoading}
                                register={register}
                                errors={errors}
                                required
                            />
                        </div>

                        <div className={styles['btn-area']}>
                            <button
                                className={styles['colored-btn']}
                                type="submit"
                                style={{ width: '100%' }}
                            >
                                로그인
                            </button>

                            <Link href={'/register'}>
                                <button>회원가입</button>
                            </Link>

                            <button onClick={() => signIn('google')}>
                                Google 계정으로 로그인
                            </button>
                            <button onClick={() => signIn('naver')}>
                                Naver 계정으로 로그인
                            </button>
                            <button onClick={() => signIn('kakao')}>
                                Kakao 계정으로 로그인
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default LoginClient;
