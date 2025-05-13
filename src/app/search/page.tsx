// Search.tsx
'use client'

import React, { useEffect, useState } from 'react';
import fetchStockData from '@/app/actions/getStockData';
import axios from 'axios';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import AddBoxIcon from '@mui/icons-material/AddBox';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import { Stock } from '@prisma/client';

const SearchPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState<any>({
    symbol: '',
    company: '',
    currency: '',
  });
  const [symbolExistsMap, setSymbolExistsMap] = useState<Record<string, boolean>>({}); // 종목 존재 여부를 저장하는 객체

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      symbol: '',
      company: '',
      currency: '',
      price: 0,
      userId: '',
      desired_selling_price: 0,
    }
  });  

  // 검색된 데이터 불러오기
  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get('q');
    setSearchTerm(query || '');
  }, []);

  useEffect(() => {
    const fetchAndSetData = async () => {
      if (searchTerm !== '') {
        try {
          const results = await fetchStockData(searchTerm);
          console.log('results: ', results);
          if ('error' in results) {
            // error 프로퍼티가 있는 경우, 즉 에러가 발생한 경우
            setError(results.error);  // 에러 메시지 설정
            setSearchResults([]);   
          }else {
            setSearchResults(results);

            // 등록 버튼에서 이미 등록된 종목인지 체크
            // 종목 존재 여부를 미리 가져와서 상태 업데이트
            const symbols = results.map((stock:Stock) => stock.symbol); // 모든 검색 결과에서 symbol만 추출
            const symbolExistsMap: Record<string, boolean> = {}; // 존재 여부를 저장할 객체 초기화
            
            try {
              const responses = await Promise.all( // 모든 symbol에 대해 동시에 API 호출
                symbols.map((symbol:string) => axios.get(`/api/check/symbol?symbol=${symbol}`))
              );

              responses.forEach((response, index) => { // API 응답을 기반으로 symbol 존재 여부 객체 생성
                const symbol = symbols[index];
                symbolExistsMap[symbol] = response.data.exists;
              });

              setSymbolExistsMap(symbolExistsMap); // 상태 업데이트
            } catch (error) {
              console.error('Error checking symbol existence:', error);
              setSymbolExistsMap({}); // 에러 발생 시 초기화
            }
          }
          // console.log('results: ', results);
        } catch (error) {
          setError('데이터를 불러오는 중 오류가 발생했습니다.');
        }finally {
          setIsLoading(false);
        }
      }
    };

    fetchAndSetData();
  }, [searchTerm]);
  
    
  // 등록버튼으로 관심종목을 바로 등록할 때 사용.
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    const requestData = {
      ...data,
      ...selectedStock
    };

    // console.log('requestData', requestData);

    try {
      await axios.post(`/api/stocks`, requestData);
      router.push(`/stocks`);
      reset();
      toast.success('성공적으로 등록했습니다.');
    } catch (error) {
      console.error('Error while adding stock:', error);
      toast.error('문제가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }


  // 등록버튼으로 price값을 구하는 api로 전달할 때 사용.
  async function handleRegisterButtonClick(
    symbol:string, 
    company:string, 
    currency:string
  ) {
    // console.log('symbol:', symbol);
    // console.log('company:', company);
    // console.log('currency:', currency);
    // API 요청 주소 구성  
    try {

       // 서버에 종목이 이미 등록되었는지 확인하는 요청 보내기
      const checkExistsResponse = await axios.get(`/api/check/symbol?symbol=${symbol}`);
      if (checkExistsResponse.data.exists) {
        toast.error('이미 등록된 종목입니다.');
        setIsLoading(false);
        return; // 이미 등록된 경우, 여기서 처리를 중단
      }

      // AlphaVantage API를 호출하는 서버측 API에 요청
      const response = await axios.get(`/api/search?symbol=${encodeURIComponent(symbol)}&currency=${encodeURIComponent(currency)}`);
      const data = response.data;
  
      // console.log('response: ', response);
      // console.log('data: ', data);
      // console.log('data.price: ', data.price);

      // 성공적으로 데이터를 받아온 경우, StockUploadPage로 리다이렉트
      if (data.price) {
        const queryParams = new URLSearchParams({
          symbol,
          company,
          currency,
          price: data.price,
        }).toString();
  
        router.push(`/stocks/upload?${queryParams}`);
      } else {
        const queryParams = new URLSearchParams({
          symbol,
          company,
          currency,
          price: '0',
        }).toString();

        router.push(`/stocks/upload?${queryParams}`);
      }
    } catch (error) {
      console.error('Error fetching current price', error);
    }
  } 

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>오류: {error}</div>; // 에러 메시지 표시
  }

  return (
    <div className='flex items-start justify-center w-full h-full py-20'>
      {searchResults.length > 0 ? (
        <table className="w-[70vw] max-w-[1000px] border-2 border-black border-collapse border-spacing-0 p-10">
           <colgroup>
            <col className='w-[15%]'/>
            <col className=''/>
            <col className='w-[10%]'/>
            <col className='w-[13%]'/>
          </colgroup>
          <thead>
            <tr>
              <th className='p-2 border-[1px] border-black bg-blue-100'>종목코드</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>종목명</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>통화</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>관심종목 등록</th>
            </tr>
          </thead>
          <tbody>
            {searchResults
            .map((stock) => (
              <tr key={stock.symbol}>
                <td className='px-5 py-2 border-[1px] border-black'>{stock.symbol}</td>
                <td className='px-5 py-2 border-[1px] border-black'>{stock.name}</td>
                <td className='px-5 py-2 border-[1px] border-black text-center'>{stock.currency}</td>
                <td className={`px-5 py-2 border-[1px] border-black text-center ${symbolExistsMap[stock.symbol] ? 'min-w-[150px]' : 'min-w-[130px]'}`}>                 
                {/* <form onSubmit={handleSubmit(onSubmit)}> */}
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={symbolExistsMap[stock.symbol] ? '' : <AddBoxIcon />}
                    className="bg-blue-500"

                    // 등록버튼으로 관심종목으로 바로 등록
                    // onClick={() => {
                    //   setSelectedStock({
                    //     symbol: stock.symbol,
                    //     company: stock.name,
                    //     currency: stock.currency,
                    //   });
                    // }}

                    // 파라미터로 symbol, company, currency값만 전달
                    // component={Link}
                    // href={`/stocks/upload?symbol=${stock.symbol}&company=${stock.name}&currency=${stock.currency}`}
                  
                    // symnbol과 currency 값을 가지고 price 값을 구하여 관심종목 등록 페이지로 이동
                    onClick={() => {handleRegisterButtonClick(stock.symbol, stock.name, stock.currency)}}
                  
                    // 이미 등록된 종목인지 체크
                    disabled={symbolExistsMap[stock.symbol]}
                  >
                    {symbolExistsMap[stock.symbol] ? '이미 등록됨' : '등록'}
                  </Button>
                {/* </form> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className='flex w-full h-full items-center justify-center'>
          <strong>일치하는 종목을 찾을 수 없습니다.</strong>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
