export interface IAccountEvaluationResponse {
    tot_pur_amt: string;            // 총 매입금액
    tot_evlt_amt: string;           // 총 평가금액
    tot_evlt_pl: string;            // 총 평가손익
    tot_prft_rt: string;            // 총 수익률(%)
    prsm_dpst_aset_amt: string;     // 예수금/자산 총액
    tot_loan_amt: string;           // 대출금
    tot_crd_loan_amt: string;       // 신용대출금
    tot_crd_ls_amt: string;         // 신용이자
    acnt_evlt_remn_indv_tot: IAccountEvaluationItem[]; // 종목별 평가 리스트
    return_code: number;
    return_msg: string;
  }
  
  export interface IAccountEvaluationItem {
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
  