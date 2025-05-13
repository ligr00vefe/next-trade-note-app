import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const symbol = url.searchParams.get('symbol');
  const currency = url.searchParams.get('currency');

  if (typeof symbol !== 'string') {  
    return NextResponse.json({ error: 'Symbol must be a string' });
  }

  // FinancialModelingPrep의 주식 현재가 정보를 가져오는 API URL 구성
  const fmpApiKey = process.env.FINANCIALMODELINGPREP_API_KEY;
  const stockUrl = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${fmpApiKey}`;

  // console.log('stockUrl: ', stockUrl);
  try {
    const response = await fetch(stockUrl);
    const data = await response.json();

    // console.log('data: ', data);

    // FinancialModelingPrep는 응답으로 배열을 반환하므로, 첫 번째 요소를 사용합니다.
    const price = data[0]?.price;

    if (!price) {
      throw new Error('Price not found');
    }

    if (currency?.toUpperCase() === "USD") {
      const exchangeRateApiKey = process.env.EXCHANGERATE_API_KEY;
      const exchangeRateUrl = `https://api.exchangerate-api.com/v4/latest/USD?apikey=${exchangeRateApiKey}`;

      const rateResponse = await fetch(exchangeRateUrl);
      const rateData = await rateResponse.json();

      const usdToKrwRate = rateData.rates["KRW"];
      if (!usdToKrwRate) {
        throw new Error('Exchange rate for KRW not found');
      }

      // USD 가격을 KRW로 환전하고, 결과를 자연수로 반올림합니다.
      const priceInKrw = Math.round(price * usdToKrwRate);
      return NextResponse.json({ price: priceInKrw.toString() });
    } else {
      // 다른 통화를 요청한 경우, 현재는 USD 가격만 반환합니다.
      return NextResponse.json({ price: price.toString() });
    }

  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch current price: ${(error as Error).message}` });
  }
}
