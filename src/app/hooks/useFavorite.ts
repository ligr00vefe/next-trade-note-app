'use client';

import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo } from "react";
import { toast } from 'react-toastify'
import { IStocksParams } from "@/app/actions/getFavorites";

interface IUseFavoriteProps {
  stockId: string;

  // 로그인 정보가 없을 경우 null
  currentUser?: User | null;
  stockData: IStocksParams
}

const useFavorite = ({ 
  stockId, 
  currentUser,
  stockData,
}: IUseFavoriteProps) => {

  const router = useRouter();
  const hasFavorited = useMemo(() => {

    // DB에 favorite 배열이 있으면 불러오고 없으면 빈 배열 출력
    const list = currentUser?.favoriteIds || [];

    // 불러온 favorite 배열에 일치하는 stockId가 있는지 확인
    return list.includes(stockId);

  }, [currentUser, stockId]);

  const toggleFavorite = async (e: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    // event 더블링 방지
    e.stopPropagation();

    // 로그인되지 않은 유저는 즐겨찾기 기능이 동작하지 않도록 바로 return 처리
    if (!currentUser) {
      toast.warn('로그인이 필요합니다.');
      return;
    }

    // console.log('stocks', stocks);


    try {
      let request;              

      if (hasFavorited) {
        // 즐겨찾기가 되어있는데 버튼을 한번 더 누를 경우 delete경로로 axios 전송
        request = () => axios.delete(`/api/favorites/${stockId}`);
      } else {
        // 즐겨찾기를 추가하려는 경우 post로 axios 전송
        request = () => axios.post(`/api/favorites/${stockId}`, stockData);
      }

      // request 요청(delete or post) 전송
      await request();
      // 즐겨찾기 반영을 위해 router refresh
      router.refresh();

      toast.success('성공했습니다.');

    } catch (error) {
      toast.error('문제가 발생했습니다.');
    }
  }

  return {
    hasFavorited,
    toggleFavorite
  }
}

export default useFavorite;