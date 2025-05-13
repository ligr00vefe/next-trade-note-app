import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // NextRequest 객체에서 URL을 가져옵니다.
  const url = req.nextUrl;
  
  // URL 객체에서 쿼리 파라미터를 추출합니다.
  // 예를 들어, 요청 URL이 /api/stock?symbol=AAPL 인 경우, 'symbol' 쿼리를 추출할 수 있습니다.
  const symbol = url.searchParams.get('symbol');
  const currency = url.searchParams.get('currency');

  if (typeof symbol !== 'string') {  
    return NextResponse.json({ error: 'Symbol must be a string' });
  }

  const stockApiKey  = process.env.ALPHAVANTAGE_API_KEY;
  const stockUrl     = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${stockApiKey}`;

  try {
    const response = await fetch(stockUrl);
    const data = await response.json();

    // AlphaVantage API의 응답 구조에 따라 적절히 경로를 수정해야 할 수 있음
    const price = data['Global Quote']['05. price'];

    if (!price) {
      throw new Error('Price not found');
    }

     // USD를 KRW로 환전할 필요가 있을 경우
     if (currency && currency.toUpperCase() === 'USD') {
      const exchangeApiKey = process.env.ALPHAVANTAGE_API_KEY; // 환율 API 키, 필요한 경우 다른 키를 사용할 수 있습니다.
      const exchangeUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=KRW&apikey=${exchangeApiKey}`;

      const exchangeResponse = await fetch(exchangeUrl);
      const exchangeData = await exchangeResponse.json();
      const exchangeRate = exchangeData['Realtime Currency Exchange Rate']['5. Exchange Rate'];

      if (!exchangeRate) {
        throw new Error('Exchange rate not found');
      }

      const priceInKrw = parseFloat(price) * parseFloat(exchangeRate);
      const resultPriceInKrw = Math.round(priceInKrw);
      return NextResponse.json({ price: resultPriceInKrw.toString() });
    } else {
      // USD가 아닐 경우, 원래 가격을 반환
      return NextResponse.json({ price: price });
    }
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch current price` });
  }
}