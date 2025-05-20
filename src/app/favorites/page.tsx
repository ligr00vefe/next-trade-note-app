import React, { useEffect, useState } from 'react'
import EmptyState from '@/components/EmptyState';

import StockTableRow from '@/components/stocks/StockTableRow';
import getFavorites from '@/actions/getFavorites';

const FavoritesPage = async () => {

  const {data, currentUser} = await getFavorites();

  if (!data || data.length === 0) {
    return (
      <div className='flex flex-col items-center justify-start w-full h-full py-[120px]'>
        <EmptyState title="즐겨찾기된 종목이 없습니다." subtitle="종목을 즐겨찾기 해 주세요." />
      </div>
    )
  }else {
    return (    
      <div className='flex flex-col items-center justify-start w-full h-full py-[150px]'>
        <table className="w-[80vw] max-w-[1400px] border-[2px] border-black border-collapse border-spacing-0 p-10">
          <colgroup>
            <col className='w-[15%]' />
            <col className='' />
            <col className='w-[10%]' />
            <col className='w-[12%]' />
            <col className='w-[22%]' />
          </colgroup>
          <thead>
            <tr>
              <th className='p-2 border-[1px] border-black bg-blue-100'>종목코드</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>종목명</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>통화</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>현재가(KRW/원)</th>
              <th className='p-2 border-[1px] border-black bg-blue-100'>희망매도가</th>
            </tr>           
          </thead>
          <tbody>
            {data.map((stock) => (
              <StockTableRow stock={stock} key={stock.id} currentUser={currentUser} hasPrice={true} hasFavorite={false} hasSellingPrice={true} readonly={false} />           
            ))}
          </tbody>          
        </table>
      </div>
    )
  }  
}

export default FavoritesPage