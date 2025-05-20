// hooks/useSearch.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Stock {
  symbol: string;
}

const useSearch = () => {
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        // 검색 결과를 가져오는 API 호출
        const response = await axios.get('/api/check/symbol');
        setSearchResults(response.data);
      } catch (error) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, []);

  return { searchResults, loading, error };
};

export default useSearch;
