import { KIWOOM_API } from "./config";
import { getToken, saveToken } from "./tokenStore";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface IBaseKiwoomResponse {
  return_code: number; // 응답 코드 (숫자형으로 변경)
  return_msg: string; // 응답 메시지
}

interface IKiwoomTokenResponse extends IBaseKiwoomResponse {
  expires_dt: number; // 토큰 유효 시간 (초)
  token_type: string; // 토큰 타입 (예: Bearer)
  token: string; // 실제 액세스 토큰
}

interface IKiwoomErrorResponse extends IBaseKiwoomResponse {
  error: string; // 오류 코드
  error_description: string; // 오류 설명
}

async function requestNewToken(): Promise<string> {
  const url = `${KIWOOM_API.baseUrl}/oauth2/token`;

  try {
    const res: AxiosResponse<IKiwoomTokenResponse | IKiwoomErrorResponse> = await axios.post(url, {
      grant_type: "client_credentials",
      client_id: KIWOOM_API.clientId,
      client_secret: KIWOOM_API.clientSecret,
    }, {
      headers: { "Content-Type": "application/json" },
    });

    const data = res.data;

    // 오류 응답 처리 (return_code로 판단)
    if (data.return_code !== 0) { // 예시: 성공 코드가 "0"이라고 가정
      console.error("키움증권 토큰 발급 오류:", data.return_msg);
      throw new Error(`키움증권 토큰을 발급받을 수 없습니다: ${data.return_msg}`);
    }

    // IKiwoomTokenResponse 타입 가드 (error 필드가 없으면 성공 응답으로 간주)
    if (!('error' in data)) {
      saveToken(data.token, data.expires_dt);
      return data.token;
    } else {
      // error 필드가 있지만 return_code가 "0"이 아닌 경우
      console.error("키움증권 토큰 발급 오류 (예상치 못한 응답):");
      throw new Error("키움증권 토큰을 발급받을 수 없습니다: 예상치 못한 오류");
    }
  } catch (error: any) {
    console.error("키움증권 토큰 발급 오류:", error.response?.data || error.message);
    throw new Error("키움증권 토큰을 발급받을 수 없습니다.");
  }
}

async function getValidToken(): Promise<string> {
  let token = getToken();
  if (token) return token;

  return await requestNewToken();
}

export async function kiwoomFetch<T extends IBaseKiwoomResponse = IBaseKiwoomResponse>(endpoint: string, options: AxiosRequestConfig = {}): Promise<AxiosResponse<T>> {
  const token = await getValidToken();

  const url = `${KIWOOM_API.baseUrl}${endpoint}`;
  
  const config: AxiosRequestConfig = {
    url,
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.request<T>(config);
    
    // 모든 키움증권 API 응답에 대한 return_code 유효성 검사
    if (response.data && response.data.return_code !== 0) {
      console.error("키움증권 API 응답 오류:", response.data.return_msg);
      throw new Error(`키움증권 API 호출 실패: ${response.data.return_msg} (Code: ${response.data.return_code})`);
    }

  } catch (error: any) {
    // 토큰 만료 처리: 401 Unauthorized 에러 발생 시 토큰 갱신 후 재시도
    if (error.response && error.response.status === 401) {
      console.warn("키움증권 API 토큰 만료. 새로운 토큰 발급 후 재시도합니다.");
      const newToken = await requestNewToken();
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${newToken}`,
      };
      return await axios.request<T>(config); // 새로운 토큰으로 재시도
    }
    // 기타 Axios 오류 또는 위에서 던져진 return_code 관련 오류
    console.error("키움증권 API 호출 오류:", error.response?.data || error.message);
    throw error; // 다른 오류는 다시 throw
  }
}