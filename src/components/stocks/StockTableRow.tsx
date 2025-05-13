'use client';

import React, { useState } from 'react'
import { Favorite, User } from '@prisma/client';

import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import SwitchBtn from '@/components/stocks/SwitchBtn';
import { IconButton, Input, TextField } from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import { toast } from 'react-toastify';

interface IStockTableRowProps {
  // 로그인을 하지 않으면 currentUser는 값이 없을 수 있음
  currentUser?: User | null;
  stock: Favorite;
  hasPrice: boolean;
  hasFavorite: boolean;
  hasSellingPrice: boolean;
  readonly: boolean;
}

const StockTableRow = ({ 
  stock,
  currentUser, 
  hasPrice,
  hasFavorite,
  hasSellingPrice,
  readonly
}: IStockTableRowProps) => {
  
  // console.log('row_currentUser: ', currentUser);
  // console.log('row_stock: ', stock);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();  
  const [desiredSellingPriceValue, setDesiredSellingPriceValue] = React.useState(stock.desired_selling_price);

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
  } = useForm<FieldValues>({
    defaultValues:{    
      symbol: stock.symbol,
      company: stock.company,
      currency: stock.currency,
      price: stock.price,
      userId: stock.userId,
      stockId: stock.stockId,
      desired_selling_price: stock.desired_selling_price
    }
  });

  // console.log('stock: ', stock);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    // console.log('data: ', data);

    // 요청 본문에 stock 정보를 추가하여 전송
    const requestData = {
      ...data,
      desired_selling_price: desiredSellingPriceValue
    };

    // console.log('requestData:', requestData);    

    try {       
      // 즐겨찾기를 추가하려는 경우 post로 axios 전송
      axios.post(`/api/favorites/${stock.stockId}`, requestData)
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      })  

      // 즐겨찾기 반영을 위해 router refresh
      router.refresh();

      toast.success('성공했습니다.');

    } catch (error) {
      toast.error('문제가 발생했습니다.');
    }
  }

  return (
    <tr key={stock.id}>
      <td className='px-5 py-2 border-[1px] border-black text-center'><span>{stock.symbol}</span></td>
      <td className='px-5 py-2 border-[1px] border-black'><span>{stock.company}</span></td>
      <td className='px-5 py-2 border-[1px] border-black text-center'><span>{stock.currency}</span></td>
      {hasPrice &&
        <td className='px-5 py-2 border-[1px] border-black text-right min-w-[140px]'><span>{stock.price != null ? stock.price.toLocaleString("en-US")+'원' : ''}</span></td>
      }    
      {hasSellingPrice && 
        <td className={`px-5 py-2 border-[1px] border-black text-right ${readonly ? '': 'min-w-[305px]'}`}>
          {readonly ? 
            (<span>{stock.desired_selling_price != null ? stock.desired_selling_price.toLocaleString("en-US")+'원' : ''}</span>)
          :           
          (<form 
            className='flex items-center justify-center text-right'
            onSubmit={handleSubmit(onSubmit)}   
          >             
            <TextField 
              id="desired_selling_price"
              name="desired_selling_price"
              type="number" 
              label="매도가를 입력해주세요." 
              variant="outlined" 
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
              value={desiredSellingPriceValue}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDesiredSellingPriceValue(parseInt(event.target.value));
              }}
            /> 
            <IconButton aria-label="savingsIcon" color="primary" type="submit">
              <SavingsIcon fontSize="large" />
              {/* <PriceCheckIcon /> */}
            </IconButton>                           
          </form>)            
          }
        </td>
      }
      {hasFavorite && 
        <td className='px-5 py-2 border-[1px] border-black text-center'>
          <SwitchBtn stockId={stock.id} currentUser={currentUser} stockData={stock} />
        </td>
      }

    </tr>
  )
}

export default StockTableRow