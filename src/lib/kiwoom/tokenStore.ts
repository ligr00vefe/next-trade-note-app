import axios, { AxiosResponse } from 'axios'; // axios import 추가
import { IKiwoomTokenResponse } from "@/lib/type/kiwoom";

let accessToken: string | null = null;
let expiresAt: number | null = null; // timestamp (밀리초)

export async function getToken(): Promise<string | null> {
  // 1. 이미 유효한 토큰이 있다면 반환
  if (accessToken && expiresAt && Date.now() < expiresAt) {
    return accessToken;
  }

  // 2. 새로운 토큰 발급 요청
  const host = process.env.NEXT_PUBLIC_KIWOOM_BASE_URL;
  const endpoint = '/oauth2/token';
  const url = host + endpoint;

  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
  };

  // .env 파일에서 appkey, secretkey 가져오기 (지시사항에 따라 직접 접근)
  const appKey = process.env.NEXT_PUBLIC_KIWOOM_APP_KEY;
  const secretKey = process.env.NEXT_PUBLIC_KIWOOM_SECRET_KEY;

  if (!appKey || !secretKey) {
    console.error("환경 변수 KIWOOM_APP_KEY 또는 KIWOOM_SECRET_KEY가 설정되지 않았습니다.");
    return null;
  }

  const params = {
    'grant_type': 'client_credentials',
    'appkey': appKey,
    'secretkey': secretKey,
  };

  try {
    const response: AxiosResponse<IKiwoomTokenResponse> = await axios.post(url, params, { headers });
    const responseBody = response.data;

    // 응답 헤더 로깅 (지시사항에 따라 추가)
    // console.log('code :', response.status);
    // console.log('header :', JSON.stringify({
    //   'next-key': response.headers['next-key'],
    //   'cont-yn': response.headers['cont-yn'],
    //   'api-id': response.headers['api-id'],
    // }, null, 4));
    // console.log('body :', JSON.stringify(responseBody, null, 4));

    // 3. 응답 유효성 검사 (return_code)
    if (responseBody.return_code !== 0) {
      console.error("키움증권 토큰 발급 오류:", responseBody.return_msg);
      return null;
    }

    // 4. 토큰 저장 및 반환
    accessToken = responseBody.token;
    // expires_dt 문자열을 파싱하여 expiresAt 타임스탬프 계산
    const expiresDtString = responseBody.expires_dt;
    const year = parseInt(expiresDtString.substring(0, 4));
    const month = parseInt(expiresDtString.substring(4, 6)) - 1; // 월은 0부터 시작
    const day = parseInt(expiresDtString.substring(6, 8));
    const hour = parseInt(expiresDtString.substring(8, 10));
    const minute = parseInt(expiresDtString.substring(10, 12));
    const second = parseInt(expiresDtString.substring(12, 14));
    expiresAt = new Date(year, month, day, hour, minute, second).getTime();

    return accessToken;
  } catch (error) {
    console.error('키움증권 토큰 요청 실패:', (error as any).response?.data || (error as any).message);
    return null;
  }
}

// saveToken 함수는 getToken이 이제 토큰을 발급하고 저장하므로 더 이상 외부에서 호출할 필요가 없습니다.
// 하지만 기존 로직과의 호환성을 위해 유지하거나 용도에 따라 제거할 수 있습니다.
export function saveToken(token: string, expiresInOrDt: number | string) {
  accessToken = token;
  if (typeof expiresInOrDt === 'number') {
    expiresAt = Date.now() + expiresInOrDt * 1000; // 초 단위 → ms
  } else {
    // YYYYMMDDHHmmss 형식의 문자열을 Date 객체로 파싱
    const year = parseInt(expiresInOrDt.substring(0, 4));
    const month = parseInt(expiresInOrDt.substring(4, 6)) - 1; // 월은 0부터 시작
    const day = parseInt(expiresInOrDt.substring(6, 8));
    const hour = parseInt(expiresInOrDt.substring(8, 10));
    const minute = parseInt(expiresInOrDt.substring(10, 12));
    const second = parseInt(expiresInOrDt.substring(12, 14));
    expiresAt = new Date(year, month, day, hour, minute, second).getTime();
  }
}
