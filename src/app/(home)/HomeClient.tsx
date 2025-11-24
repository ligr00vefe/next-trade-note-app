"use client";

import styles from "./Home.module.scss";
import Container from "@/components/ui/Container";
import Image from "next/image";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
// @ts-ignore
import gsap from "gsap";
// @ts-ignore
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import SearchBox from "@/components/main/search/SearchBox";

gsap.registerPlugin(ScrollTrigger);

// 주식 데이터의 인터페이스 정의
export interface IStockProps {
  id: string;
  shortName: string;
  ticker: string;
}

export default function HomeClient() {
  // 검색어 입력값
  const [searchTerm, setSearchTerm] = useState<string>("");
  // 검색 결과 목록(SearchBox에 전달)
  const [searchResults, setSearchResults] = useState<IStockProps[]>([]);
  // 검색 결과(searchResults)에서 선택한 종목
  const [selectedStock, setSelectedStock] = useState<IStockProps | null>(null);
  // 검색 진행 중 여부 체크
  const [isSearching, setIsSearching] = useState<boolean>(false);
  // 검색 결과 표시 여부 상태 (SearchBox 렌더링 제어)
  const [showResults, setShowResults] = useState<boolean>(false);

  // 검색어 디바운스를 위한 훅 (검색 API 호출 최적화에 사용)
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 500); // 500ms 디바운스
  // console.log('searchTerm: ', searchTerm);
  // console.log('searchResults: ', searchResults);
  // console.log('selectedStock: ', selectedStock);
  // console.log('isSearching: ', isSearching);
  // console.log('showResults: ', showResults);
  // console.log('debouncedSearchTerm: ', debouncedSearchTerm);

  const router = useRouter();

  // 검색어 입력 변경 핸들러 (검색 기능에 사용)
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(true); // 입력 시 검색 결과 표시
    setSelectedStock(null); // 새로운 검색이 시작되면 기존에 선택된 종목 초기화
  }, []);

  // 검색 버튼 클릭 또는 Enter 키 입력 시 검색을 실행하는 핸들러 (검색 API 호출 및 결과 상태 업데이트)
  const handleSearchSubmit = useCallback(async () => {
    // 검색어가 없을 경우
    if (!debouncedSearchTerm.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    // 검색 진행 중 on
    setIsSearching(true);
    // 검색 API 호출
    try {
      const response = await fetch(`/api/stocks/search?query=${debouncedSearchTerm}`);
      const data: IStockProps[] = await response.json();
      // console.log('search api results data: ', data);
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("검색 오류:", error);
      setSearchResults([]);
    } finally {
      // 검색 진행중 표시 off
      setIsSearching(false);
    }
  }, [debouncedSearchTerm]);

  // 검색 결과에서 주식을 선택했을 때 호출되는 핸들러 (선택된 주식 상태 업데이트 및 라우팅)
  const handleSelectStock = useCallback(async (stock: IStockProps) => {
    setIsSearching(true); // API 호출 시작 시 로딩 상태 활성화
    try {
      const response = await fetch(`/api/stocks/${stock.id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch stock details: ${response.statusText}`);
      }
      const data = await response.json();
      // console.log('Stock details from API:', data); // 가져온 데이터 콘솔에 로깅

      setSelectedStock(stock);
      setSearchTerm(stock.shortName); // 선택된 주식의 이름으로 검색어 업데이트
      setShowResults(false); // 선택 후 검색 결과 숨기기
      setSearchResults([]); // 검색 결과 초기화
      router.push(`/stocks/${stock.id}`); // 주식 상세 페이지로 이동
    } catch (error) {
      console.error("주식 상세 정보 가져오기 오류:", error);
      // 에러 발생 시 검색 관련 상태를 초기화하거나 사용자에게 알림
      setSelectedStock(null);
      setSearchTerm("");
      setShowResults(false);
      setSearchResults([]);
    } finally {
      setIsSearching(false); // API 호출 완료 시 로딩 상태 비활성화
    }
  }, [router]);

  // 디바운스된 검색어가 변경될 때 검색을 자동으로 실행하는 useEffect 훅 (검색 기능에 사용)
  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearchSubmit();
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [debouncedSearchTerm, handleSearchSubmit]);

  // CTA 버튼의 키보드 접근성(Enter/Space)을 처리하는 핸들러 (UI 접근성에 사용)
  const handleCtaKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.currentTarget.click();
    }
  };

  // // 각 섹션 ref
  // const sec01Ref = useRef<HTMLDivElement>(null);
  // const sec01TextRef = useRef<HTMLDivElement>(null);
  // const sec01ImgRef = useRef<HTMLDivElement>(null);
  // const sec02Ref = useRef<HTMLDivElement>(null);
  // const sec02CardsRef = useRef<HTMLDivElement[]>([]);
  // const sec03Ref = useRef<HTMLDivElement>(null);
  // const sec03StepsRef = useRef<HTMLDivElement[]>([]);
  // const sec04Ref = useRef<HTMLDivElement>(null);
  // const sec04TextRef = useRef<HTMLDivElement>(null);
  // const sec04ImgRef = useRef<HTMLDivElement>(null);
  // const sec04DetailsRef = useRef<(HTMLDivElement | HTMLLIElement)[]>([]);
  // const sec05Ref = useRef<HTMLDivElement>(null);

  // // 카드/스텝/세부 설명 ref 배열 초기화
  // sec02CardsRef.current = [];
  // sec03StepsRef.current = [];
  // sec04DetailsRef.current = [];

  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   // sec01: 텍스트 좌우, 이미지 우좌, stagger
  //   if (sec01TextRef.current && sec01ImgRef.current) {
  //     gsap.fromTo(
  //       sec01TextRef.current,
  //       { opacity: 0, x: -80 },
  //       {
  //         opacity: 1,
  //         x: 0,
  //         duration: 1.1,
  //         ease: "power3.out",
  //         immediateRender: false,
  //         scrollTrigger: {
  //           trigger: sec01Ref.current,
  //           start: "top 80%",
  //           toggleActions: "play none none none",
  //         },
  //       }
  //     );
  //     gsap.fromTo(
  //       sec01ImgRef.current,
  //       { opacity: 0, x: 80 },
  //       {
  //         opacity: 1,
  //         x: 0,
  //         duration: 1.1,
  //         delay: 0.2,
  //         ease: "power3.out",
  //         immediateRender: false,
  //         scrollTrigger: {
  //           trigger: sec01Ref.current,
  //           start: "top 80%",
  //           toggleActions: "play none none none",
  //         },
  //       }
  //     );
  //   }

  //   // sec02: 카드 stagger, scale-up
  //   if (sec02CardsRef.current.length) {
  //     gsap.fromTo(
  //       sec02CardsRef.current,
  //       { opacity: 0, scale: 0.8, y: 40 },
  //       {
  //         opacity: 1,
  //         scale: 1,
  //         y: 0,
  //         duration: 0.8,
  //         stagger: 0.15,
  //         ease: "back.out(1.7)",
  //         immediateRender: false,
  //         scrollTrigger: {
  //           trigger: sec02Ref.current,
  //           start: "top 85%",
  //           toggleActions: "play none none none",
  //         },
  //       }
  //     );
  //   }

  //   // sec03: step-list 아래위 stagger
  //   if (sec03StepsRef.current.length) {
  //     gsap.fromTo(
  //       sec03StepsRef.current,
  //       { opacity: 0, y: 60 },
  //       {
  //         opacity: 1,
  //         y: 0,
  //         duration: 0.8,
  //         stagger: 0.18,
  //         ease: "power3.out",
  //         immediateRender: false,
  //         scrollTrigger: {
  //           trigger: sec03Ref.current,
  //           start: "top 85%",
  //           toggleActions: "play none none none",
  //         },
  //       }
  //     );
  //   }

  //   // sec04: 텍스트 좌우, 이미지 우좌, 세부 설명 fade-in stagger
  //   if (sec04TextRef.current && sec04ImgRef.current) {
  //     gsap.fromTo(
  //       sec04TextRef.current,
  //       { opacity: 0, x: -60 },
  //       {
  //         opacity: 1,
  //         x: 0,
  //         duration: 1,
  //         ease: "power3.out",
  //         immediateRender: false,
  //         scrollTrigger: {
  //           trigger: sec04Ref.current,
  //           start: "top 85%",
  //           toggleActions: "play none none none",
  //         },
  //       }
  //     );
  //     gsap.fromTo(
  //       sec04ImgRef.current,
  //       { opacity: 0, x: 60 },
  //       {
  //         opacity: 1,
  //         x: 0,
  //         duration: 1,
  //         delay: 0.2,
  //         ease: "power3.out",
  //         immediateRender: false,
  //         scrollTrigger: {
  //           trigger: sec04Ref.current,
  //           start: "top 85%",
  //           toggleActions: "play none none none",
  //         },
  //       }
  //     );
  //   }
  //   if (sec04DetailsRef.current.length) {
  //     gsap.fromTo(
  //       sec04DetailsRef.current,
  //       { opacity: 0, y: 40 },
  //       {
  //         opacity: 1,
  //         y: 0,
  //         duration: 0.7,
  //         stagger: 0.15,
  //         delay: 0.3,
  //         ease: "power2.out",
  //         immediateRender: false,
  //         scrollTrigger: {
  //           trigger: sec04Ref.current,
  //           start: "top 85%",
  //           toggleActions: "play none none none",
  //         },
  //       }
  //     );
  //   }

  //   // sec05: 전체 scale-up + fade-in
  //   if (sec05Ref.current) {
  //     gsap.fromTo(
  //       sec05Ref.current,
  //       { opacity: 0, scale: 0.95 },
  //       {
  //         opacity: 1,
  //         scale: 1,
  //         duration: 1,
  //         ease: "power2.out",
  //         immediateRender: false,
  //         scrollTrigger: {
  //           trigger: sec05Ref.current,
  //           start: "top 90%",
  //           toggleActions: "play none none none",
  //         },
  //       }
  //     );
  //   }

  //   // cleanup
  //   return () => {
  //     ScrollTrigger.getAll().forEach((st: any) => st.kill());
  //   };
  // }, []);

  // // ref 배열에 요소 할당 함수
  // const setSec02CardRef = (el: HTMLDivElement | null, idx: number) => {
  //   if (el) sec02CardsRef.current[idx] = el;
  // };
  // const setSec03StepRef = (el: HTMLDivElement | null, idx: number) => {
  //   if (el) sec03StepsRef.current[idx] = el;
  // };
  // const setSec04DetailRef = (el: HTMLDivElement | HTMLLIElement | null, idx: number) => {
  //   if (el) sec04DetailsRef.current[idx] = el;
  // };

  return (
    <Container
      backgroundSize="100% auto"
      backgroundPosition="top center"
      backgroundRepeat="no-repeat"
    >
      <div className={styles['main-wrapper']}>
        {/* sec01: 검색 섹션 (신규) */}
        <section className={styles['sec01']}>
          <div className={styles['search-wrap']}>
            <div className={styles['search-header']}>
              {/* <h1>[작업중입니다.]</h1> */}
              <h2 className={styles['search-title']}>종목을 검색해 주세요.</h2>
              {/* <h5 className={styles['search-sub']}>(나스닥에 상장된 주식만 검색이 가능합니다.)</h5>
              <p className={styles['search-example']}>
                예시) 애플: apple, 넷플릭스: netflix, 쿠팡: coupang
              </p> */}
            </div>
            <div className={styles['search-bar']}>
              <input
                type="text"
                placeholder="영어로 검색해주세요"
                className={styles['search-input']}
                value={searchTerm}
                onChange={handleSearchInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit();
                  }
                }}
              />
              <Button
                variant="outlined"
                size="medium"
                color="secondary"
                startIcon={<SearchIcon />}
                className={styles['search-btn']}
                onClick={handleSearchSubmit}
                disabled={isSearching}
              >
                {isSearching ? '검색 중...' : '검색'}
              </Button>
            </div>
            {showResults && searchTerm.length > 0 && !selectedStock && ( // selectedStock이 null일 때만 결과 표시
              <SearchBox
                results={searchResults}
                onSelect={handleSelectStock}
                isLoading={isSearching}
              />
            )}
          </div>
          <div className={styles['scroll-down']}>
            <span>scroll down</span>
            <i className={styles['arrow-down']} aria-hidden="true" />
          </div>
        </section>

        {/* sec02: 메인 인트로 */}
        {/* <section className={styles['sec02']} ref={sec01Ref}>
          <div className={styles['sec02-inner']}>
            <div className={styles['textArea']} ref={sec01TextRef}>
              <h1>
                개인 투자자를 위한<br />주식 매매 기록<br />관리 도구
              </h1>
              <p className={styles['textArea-title']}>
                종목 등록 – 수익률 계산 – 포트폴리오 분석까지 한번에
              </p>
              <button
                className={styles['textArea-btn']}
                tabIndex={0}
                aria-label="지금 시작하기"
                onKeyDown={handleCtaKeyDown}
              >
                지금 시작하기
              </button>
            </div>
            <div className={styles['imgArea']} aria-hidden="true" ref={sec01ImgRef}>
              <Image
                src="/assets/images/main_img_01.png"
                alt="차트 일러스트"
                width={400}
                height={400}
                priority
              />
            </div>
          </div>
        </section> */}

        {/* sec03: 카드 리스트 */}
        {/* <section className={styles['sec03']} ref={sec02Ref}>
          <div className={styles['card-list']}>
            {[
              { icon: "📄", title: "거래 내역 정리", desc: "매수/매도 진행 공수익률, 물량 정량, 총대수익 계산" },
              { icon: "📊", title: "포트폴리오 분석", desc: "테마별 보유 인텔, 리밸런스, 리타표준준" },
              { icon: "📈", title: "월별 수익 추이", desc: "월별 수익률 지표로 시각화" },
            ].map((card, idx) => (
              <div
                className={styles['card']}
                key={card.title}
                ref={el => setSec02CardRef(el, idx)}
              >
                <span className={styles['card-icon']} aria-hidden="true">{card.icon}</span>
                <h2>{card.title}</h2>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </section> */}

        {/* sec04: 단계별 설명 */}
        {/* <section className={styles['sec04']} ref={sec03Ref}>
          {[
            { num: 1, title: "종목 등록", desc: "종목명, 가격, 수량, 시유 입력" },
            { num: 2, title: "수익 확인", desc: "보유수익률, 실현 수익, 총 수익 확인" },
            { num: 3, title: "분석 보기", desc: "포트 분석, 리밸런스, 알림 기능 추가 예정" },
          ].map((step, idx) => (
            <div
              className={styles['step-list']}
              key={step.num}
              ref={el => setSec03StepRef(el, idx)}
            >
              <span className={styles['step-num']}>{step.num}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </section> */}

        {/* sec05: 매매 일지 작성 */}
        {/* <section className={styles['sec05']} ref={sec04Ref}>
          <div className={styles['sec05-inner']} style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
            <div className={styles['sec05-text']} ref={sec04TextRef} style={{ flex: 1, minWidth: 280 }}>
              <h2>매매 일지 작성</h2>
              <p>매매 내역을 쉽고 체계적으로 기록하고, 복기할 수 있습니다.</p>
              <ul className={styles['sec04-details']} style={{ marginTop: '2rem' }}>
                {[
                  "날짜, 종목, 매수/매도, 수량, 가격, 메모 등 다양한 항목 기록",
                  "과거 매매 복기, 실수/성공 패턴 분석",
                  "나만의 투자 노트로 성장 지원"
                ].map((detail, idx) => (
                  <li
                    key={detail}
                    ref={el => setSec04DetailRef(el, idx)}
                    style={{ marginBottom: '1.2rem', fontSize: '1.6rem', opacity: 0 }}
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles['sec05-img']} ref={sec04ImgRef} style={{ flex: 1, minWidth: 220, textAlign: 'center' }}>
              <Image
                src="/assets/images/main_bg_img4.png"
                alt="매매 일지 일러스트"
                width={320}
                height={320}
                style={{ borderRadius: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
              />
            </div>
          </div>
        </section> */}

        {/* sec06: 가이드 */}
        {/* <section className={styles['sec06']} ref={sec05Ref}>
          <p className={styles['guide-text']}>
            초보자 중심으로 시작, 장투 지원, 리밸런스, 알림 기능 추가 예정
          </p>
        </section> */}
      </div>
    </Container>
  );
}
