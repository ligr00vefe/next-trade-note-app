// actions/fetchStockData.ts
'use client';

const fetchStockData = async (searchTerm: string) => {
  try {
    if (searchTerm) {    
      const apiKey = 'C5IGY3WO69BA3AOJ';
      const apiUrl = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
        searchTerm
      )}&apikey=${apiKey}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      // console.log('data: ', data);
      // console.log('data.Information: ', data.Information);

      if (data.bestMatches && Array.isArray(data.bestMatches)) {
        const results = data.bestMatches
        .map((match: any) => ({
          symbol: match['1. symbol'],
          name: match['2. name'],
          type: match['3. type'],
          region: match['4. region'],
        }));

        return results;
      } else {
        return { error : 'Alpha Vantage에서 데이터를 가져오는 중 오류 발생: 잘못된 데이터 형식' };
      }
    }
  } catch (error) {
    return { error: `Error fetching data from Alpha Vantage: ${error} `};
  }
};

export default fetchStockData;
