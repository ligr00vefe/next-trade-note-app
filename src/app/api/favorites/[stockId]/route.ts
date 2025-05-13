import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

import prisma from "@/helpers/prismadb";

interface IParams {
  stockId?: string;
}

// 즐겨찾기 추가
export async function POST(
  request: Request,
  { params }: { params: IParams } // /api/favorite/${stockId}` 경로에 들어갈 stockId 값이 params.
) {

  const currentUser = await getCurrentUser();

  // 유저 정보가 없으면 error
  if (!currentUser) {
    return NextResponse.error();
  }

  const { stockId } = params;

  // stockId 없거나 stockId type이 string이 아닐경우 오류 출력
  if (!stockId || typeof stockId !== 'string') {
    throw new Error('Invalid ID');
  }

  // console.log('request: ', request);

  const body = await request.json();
  // console.log('body: ', body);
  const {
    symbol,
    company,
    currency,
    price,
    desired_selling_price
  } = body;

  // 주식이 이미 존재하는지 확인
  const existingFavorite = await prisma.favorite.findFirst({
    where: {
      symbol: symbol,
      userId: currentUser.id
    }
  });

  // 현재 사용자의 favoriteIds 배열에서 stockId를 포함하는지 확인(favoriteIds에 stockId가 포함되어 있지 않을 때 - 신규 등록)
  if (!currentUser.favoriteIds || !currentUser.favoriteIds.includes(stockId)) {
    // spread operator(...)를 이용한 얕은 복사하여 원래 있던 favoriteIds의 배열을 새로운 배열로 만듦.
    let favoriteIds = [...(currentUser.favoriteIds || [])];

    // 얕은 복사된 새로운 배열에 stockId 추가
    favoriteIds.push(stockId);

    // 새 stockId가 추가된 favoriteIds를 DB에 update
    const updatedUserFavoriteIds = await prisma?.user.update({
      where: {
        id: currentUser.id
      },
      data: {
        favoriteIds: favoriteIds
      }
    });

    if (existingFavorite) {
      // 이미 존재하는 경우 해당 주식을 업데이트
      const updatedFavorite = await prisma.favorite.update({
        where: { id: existingFavorite.id },
        data: {
          desired_selling_price: Number(desired_selling_price),
        }
      });
  
      return NextResponse.json({ updatedFavorite, updatedUserFavoriteIds });
    } else {
      // 존재하지 않는 경우 새로운 주식 생성
      const newFavorite = await prisma.favorite.create({
        data: {
          symbol,
          company,
          currency,
          price: Number(price),
          desired_selling_price: Number(desired_selling_price),
          userId: currentUser.id,
          stockId: stockId
        }
      });
  
      return NextResponse.json({ newFavorite, updatedUserFavoriteIds });
  
    }   
    
  }else {    

    if (existingFavorite) {
      // 이미 존재하는 경우 해당 주식을 업데이트
      const updatedFavorite = await prisma.favorite.update({
        where: { id: existingFavorite.id },
        data: {
          desired_selling_price: Number(desired_selling_price),
        }
      });
  
      return NextResponse.json({ updatedFavorite });
    } 
  }   
}

// 즐겨찾기 삭제
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  // Delete에서 경로로 받은 stockId 값은 stock테이블의 id가 아니라 favorite 테이블의 id 이다.
  const { stockId } = params;

  // stockId 없거나 stockId type이 string이 아닐경우 오류 출력
  if (!stockId || typeof stockId !== 'string') {
    throw new Error('Invalid ID');
  }

  // spread operator(...)를 이용한 얕은 복사하여 원래 있던 favoriteIds의 배열을 새로운 배열로 만듦.
  let favoriteIds = [...(currentUser.favoriteIds || [])];

  // 얕은 복사된 새로운 배열에 id가 stockId와 일치하는 값은 제외(filtering)하여 favoriteIds에 덮어쓰기
  // id가 stockId와 일치하지 않는 값들로 다시 배열을 생성해서 favoriteIds에 담는다.
  favoriteIds = favoriteIds.filter(id => id !== stockId); 

  // 새 stockId가 추가된 favoriteIds를 DB에 update
  const deletedUserFavoriteIds = await prisma?.user.update({
    where: {
      id: currentUser.id
    },
    data: {
      favoriteIds: favoriteIds
    }
  });

  // 주식이 이미 존재하는지 확인
  const existingFavorite = await prisma.favorite.findFirst({
    where: {
      stockId: stockId,
      userId: currentUser.id
    }
  });
  
  if(existingFavorite) {
    // stockId에 해당하는 데이터를 삭제
    const deletedFavorite = await prisma?.favorite.delete({
      where: {
        id: existingFavorite.id,
        userId: currentUser.id // 현재 사용자의 id와 일치하는 favorite만 삭제됨
      }
    });

    return NextResponse.json({ deletedFavorite, deletedUserFavoriteIds });  

  }else {
    return NextResponse.json({ deletedUserFavoriteIds }); 
  }

}