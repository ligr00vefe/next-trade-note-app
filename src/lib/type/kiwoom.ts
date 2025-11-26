export interface IKiwoomBasedResponse {
  return_code: number; // 응답 코드
  return_msg: string; // 응답 메시지
}

export interface IKiwoomTokenResponse extends IKiwoomBasedResponse {
  expires_dt: string; // 토큰 만료 일시 (YYYYMMDDHHmmss 형식의 문자열)
  token_type: string; // 토큰 타입 (예: bearer)
  token: string; // 실제 액세스 토큰
}

export interface IKiwoomErrorResponse extends IKiwoomBasedResponse {
  error: string; // 오류 코드
  error_description: string; // 오류 설명
}

export interface IKiwoomAccountEvaluationResponse {
  tot_pur_amt: string;            // 총 매입금액
  tot_evlt_amt: string;           // 총 평가금액
  tot_evlt_pl: string;            // 총 평가손익
  tot_prft_rt: string;            // 총 수익률(%)
  prsm_dpst_aset_amt: string;     // 예수금/자산 총액
  tot_loan_amt: string;           // 대출금
  tot_crd_loan_amt: string;       // 신용대출금
  tot_crd_ls_amt: string;         // 신용이자
  acnt_evlt_remn_indv_tot: IKiwoomAccountEvaluationItem[]; // 종목별 평가 리스트
  return_code: number;
  return_msg: string;
}

export interface IKiwoomAccountEvaluationItem {
  stk_cd: string;             // 종목코드
  stk_nm: string;             // 종목명
  
  evltv_prft: string;         // 평가손익
  prft_rt: string;            // 수익률(%)

  pur_pric: string;           // 매입단가
  pred_close_pric: string;    // 전일종가

  rmnd_qty: string;           // 잔고 수량
  trde_able_qty: string;      // 매매 가능 수량

  cur_prc: string;            // 현재가

  pred_buyq: string;          // 예상 매수량
  pred_sellq: string;         // 예상 매도량

  tdy_buyq: string;           // 당일 매수량
  tdy_sellq: string;          // 당일 매도량

  pur_amt: string;            // 매입금액
  pur_cmsn: string;           // 매입 수수료

  evlt_amt: string;           // 평가금액
  sell_cmsn: string;          // 매도 수수료
  tax: string;                // 세금
  sum_cmsn: string;           // 총 수수료

  poss_rt: string;            // 비중(%)
  
  crd_tp: string;             // 신용구분코드
  crd_tp_nm: string;          // 신용구분명
  crd_loan_dt: string;        // 신용대출일자
}

export interface IKiwoomStockBasicInfoResponse {
  stk_cd: string;          // 종목 코드
  stk_nm: string;          // 종목명
  setl_mm: string;         // 결산월
  fav: string;             // 시가총액 관련 (단위 천억 등?)
  cap: string;             // 시가총액 (억 단위?)
  flo_stk: string;         // 유동 주식 수
  crd_rt: string;          // 신용비율 e.g. "+0.08"
  oyr_hgst: string;        // 1년 최고가 e.g. "+181400"
  oyr_lwst: string;        // 1년 최저가 e.g. "-91200"
  mac: string;             // 발행주식수?
  mac_wght: string;        // 시가총액 비중 (빈 문자열 가능)
  for_exh_rt: string;      // 외국인 지분율
  repl_pric: string;       // 대체가격
  per: string;             // PER (빈 문자열 가능)
  eps: string;             // EPS
  roe: string;             // ROE
  pbr: string;             // PBR
  ev: string;              // EV
  bps: string;             // BPS e.g. "-75300"
  sale_amt: string;        // 매출액
  bus_pro: string;         // 영업이익?
  cup_nga: string;         // 당기순이익?
  "250hgst": string;       // 250일 최고가
  "250lwst": string;       // 250일 최저가
  high_pric: string;       // 고가
  open_pric: string;       // 시가
  low_pric: string;        // 저가
  upl_pric: string;        // 상한가?
  lst_pric: string;        // 최종 가격
  base_pric: string;       // 기준가
  exp_cntr_pric: string;   // 예상 체결가
  exp_cntr_qty: string;    // 예상 체결 수량
  "250hgst_pric_dt": string;       // 250일 최고가 날짜
  "250hgst_pric_pre_rt": string;   // 최고가 대비 변동률
  "250lwst_pric_dt": string;       // 250일 최저가 날짜
  "250lwst_pric_pre_rt": string;   // 최저가 대비 변동률
  cur_prc: string;                 // 현재가
  pre_sig: string;                 // 전일 대비 신호 (빈 문자열 가능)
  pred_pre: string;                // 전일 대비 값 (빈 문자열 가능)
  flu_rt: string;                  // 등락률
  trde_qty: string;                // 거래량
  trde_pre: string;                // 거래대금?
  fav_unit: string;                // 시총 단위?
  dstr_stk: string;                // 유통 주식량?
  dstr_rt: string;                 // 유통비율?
  
  return_code: number;             // 0 성공
  return_msg: string;              // 메시지
}
