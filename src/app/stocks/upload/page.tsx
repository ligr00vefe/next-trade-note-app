'use client';

import Container from '@/components/ui/Container';
import Heading from '@/components/Heading';
import Input from '@/components/Input';
import Button from '@/components/ui/Button';

import React, { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const StockUploadPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();  

  const {
    // useForm에서 제공해주는 property
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    },
    reset,
  } = useForm<FieldValues>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      const symbol = queryParams.get('symbol');
      const company = queryParams.get('company');
      const currency = queryParams.get('currency');
      const price = queryParams.get('price');

      if (symbol) setValue('symbol', symbol);
      if (company) setValue('company', company);
      if (currency) setValue('currency', currency);
      if (price) setValue('price', price);
    }
  }, [setValue]);


  const onSubmit: SubmitHandler<FieldValues> = (data) => {

    setIsLoading(true);

    axios.post('/api/stocks', data)
      .then((response) => {
        router.push(`/stocks`);
        reset();
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value);
  }


  return (
    <Container>
      <div
        className='max-w-screen-lg mx-auto'
      >
        <form 
          className='flex flex-col gap-8'
          onSubmit={handleSubmit(onSubmit)}  
        >
          <Heading 
            title='관심종목 등록'
            subtitle='관심종목의 정보를 등록해주세요.'
            center={false}
          />
          
          <hr />

          <Input 
            id="symbol"
            label="종목코드"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />

          <hr />

          <Input 
            id="company"
            label="회사명"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />

          <hr />

          <Input 
            id="currency"
            label="통화"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />

          <hr />

          <Input 
            id="price"
            label="현재가"
            formatPrice
            type="number"
            step="0.01"
            disabled={isLoading}
            register={register}
            errors={errors}
          />

          <hr />

          {/* <Input 
            id="desired_selling_price"
            label="희망매도가"
            formatPrice
            type="number"
            disabled={isLoading}
            register={register}
            errors={errors}
          />

          <hr /> */}

          <Button label="등록하기" />

        </form>
      </div>
    </Container>
  )
}

export default StockUploadPage