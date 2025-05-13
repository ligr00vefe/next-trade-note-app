'use client'

import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';

const SearchBox = () => {

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');


  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      // Next.js에서의 프로그래밍적인 라우팅
      router.push(`/search?q=${searchTerm}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // console.log('e.target.value: ', e.target.value);
  };

  return (
    <div>
       <input
          type="text"
          placeholder="종목코드를 입력하세요"
          value={searchTerm}
          onChange={handleChange}
          className="bg-transparent/50 rounded-lg text-base text-white p-2 border-0 focus:outline-0"
        />
        <Button 
          variant="contained"
          color="primary"
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          className="ml-2"
        >검색</Button>
    </div>
  )
}

export default SearchBox