'use client'

import axios, { AxiosError } from "axios";

const fetchStockData = async (searchTerm: string) => {
  try {
    if (!searchTerm) {
      // 검색어가 없으면 아무것도 하지 않고 함수 종료
      return;
    }

    // financialmodelingprep API 호출
    const apiKey = '760add19e6a62895d03f01b029c4d3c1';
    const apiUrl = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(searchTerm)}&apikey=${apiKey}`;

    const response = await axios.get(apiUrl);
    const data = response.data;
    
    console.log('response: ', response);
    console.log('data: ', data);

    // // API 응답에서 필요한 정보 추출하여 업데이트
    // if (data && Array.isArray(data)) {
    //   return data;
    // } else {
    //   console.error('Financial Modeling Prep에서 데이터를 가져오는 중 오류 발생: 잘못된 데이터 형식');
    // }

    // console.log('Original data: ', data);

     // API 응답에서 currency가 USD인 데이터만 필터링(Financial Modeling Prep의 무료 플랜에서는 USD정보만 무료)
     const filteredData = data.filter((item: any) => item.currency === "USD");
    // API 응답에서 currency가 USD 또는 KRW인 데이터만 필터링
    // const filteredData = data.filter((item: any) => item.currency === "USD" || item.currency === "KRW");

    // console.log('Filtered data (USD and KRW only): ', filteredData);

    // 필터링된 데이터 반환
    if (filteredData.length) {
      return filteredData;
    } else {
      return { error : 'Financial Modeling Prep에서 데이터를 찾을 수 없음' };
    }
  } catch (error) {
    // 에러 처리
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 429) {
        return { error: "API 호출 횟수를 초과했습니다. 내일 다시 시도해주세요." };
      }
    }
    return { error: "데이터를 불러오는 중 오류가 발생했습니다." };
  }
}

export default fetchStockData;