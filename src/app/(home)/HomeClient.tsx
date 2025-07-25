"use client";

import styles from "./Home.module.scss";
import Container from "@/components/ui/Container";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
// @ts-ignore
import gsap from "gsap";
// @ts-ignore
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HomeClient() {
  // 버튼 접근성 핸들러
  const handleCtaKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.currentTarget.click();
    }
  };

  // 각 섹션 ref
  const sec01Ref = useRef<HTMLDivElement>(null);
  const sec01TextRef = useRef<HTMLDivElement>(null);
  const sec01ImgRef = useRef<HTMLDivElement>(null);
  const sec02Ref = useRef<HTMLDivElement>(null);
  const sec02CardsRef = useRef<HTMLDivElement[]>([]);
  const sec03Ref = useRef<HTMLDivElement>(null);
  const sec03StepsRef = useRef<HTMLDivElement[]>([]);
  const sec04Ref = useRef<HTMLDivElement>(null);
  const sec04TextRef = useRef<HTMLDivElement>(null);
  const sec04ImgRef = useRef<HTMLDivElement>(null);
  const sec04DetailsRef = useRef<(HTMLDivElement | HTMLLIElement)[]>([]);
  const sec05Ref = useRef<HTMLDivElement>(null);

  // 카드/스텝/세부 설명 ref 배열 초기화
  sec02CardsRef.current = [];
  sec03StepsRef.current = [];
  sec04DetailsRef.current = [];

  useEffect(() => {
    if (typeof window === "undefined") return;

    // sec01: 텍스트 좌→우, 이미지 우→좌, stagger
    if (sec01TextRef.current && sec01ImgRef.current) {
      gsap.fromTo(
        sec01TextRef.current,
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec01Ref.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        sec01ImgRef.current,
        { opacity: 0, x: 80 },
        {
          opacity: 1,
          x: 0,
          duration: 1.1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec01Ref.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // sec02: 카드 stagger, scale-up
    if (sec02CardsRef.current.length) {
      gsap.fromTo(
        sec02CardsRef.current,
        { opacity: 0, scale: 0.8, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sec02Ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // sec03: step-list 아래→위 stagger
    if (sec03StepsRef.current.length) {
      gsap.fromTo(
        sec03StepsRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec03Ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // sec04: 텍스트 좌→우, 이미지 우→좌, 세부 설명 fade-in stagger
    if (sec04TextRef.current && sec04ImgRef.current) {
      gsap.fromTo(
        sec04TextRef.current,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec04Ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        sec04ImgRef.current,
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec04Ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }
    if (sec04DetailsRef.current.length) {
      gsap.fromTo(
        sec04DetailsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sec04Ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // sec05: 전체 scale-up + fade-in
    if (sec05Ref.current) {
      gsap.fromTo(
        sec05Ref.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sec05Ref.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // cleanup
    return () => {
      ScrollTrigger.getAll().forEach((st: any) => st.kill());
    };
  }, []);

  // ref 배열에 요소 할당 함수
  const setSec02CardRef = (el: HTMLDivElement | null, idx: number) => {
    if (el) sec02CardsRef.current[idx] = el;
  };
  const setSec03StepRef = (el: HTMLDivElement | null, idx: number) => {
    if (el) sec03StepsRef.current[idx] = el;
  };
  const setSec04DetailRef = (el: HTMLDivElement | HTMLLIElement | null, idx: number) => {
    if (el) sec04DetailsRef.current[idx] = el;
  };

  return (
    <Container
      backgroundImage="/assets/images/main_bg_img.png"
      backgroundSize="100% auto"
      backgroundPosition="top center"
      backgroundRepeat="no-repeat"
    >
      <div className={styles['main-wrapper']}>
        {/* sec01: 메인 인트로 */}
        <section className={styles['sec01']} ref={sec01Ref}>
          <div className={styles['sec01-inner']}>
            <div className={styles['text-area']} ref={sec01TextRef}>
              <h1>
                개인 투자자를 위한<br />주식 매매 기록<br />관리 도구
              </h1>
              <p className={styles['text-area-title']}>
                종목 등록 – 수익률 계산 – 포트폴리오 분석까지 한번에
              </p>
              <button
                className={styles['text-area-btn']}
                tabIndex={0}
                aria-label="지금 시작하기"
                onKeyDown={handleCtaKeyDown}
              >
                지금 시작하기
              </button>
            </div>
            <div className={styles['img-area']} aria-hidden="true" ref={sec01ImgRef}>
              <Image
                src="/assets/images/main_img_01.png"
                alt="차트 일러스트"
                width={400}
                height={400}
                priority
              />
            </div>
          </div>
        </section>

        {/* sec02: 카드 리스트 */}
        <section className={styles['sec02']} ref={sec02Ref}>
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
        </section>

        {/* sec03: 단계별 설명 */}
        <section className={styles['sec03']} ref={sec03Ref}>
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
        </section>

        {/* sec04: 매매 일지 작성 */}
        <section className={styles['sec04']} ref={sec04Ref}>
          <div className={styles['sec04-inner']} style={{ display: 'flex', alignItems: 'center', gap: '4rem', flexWrap: 'wrap' }}>
            <div className={styles['sec04-text']} ref={sec04TextRef} style={{ flex: 1, minWidth: 280 }}>
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
            <div className={styles['sec04-img']} ref={sec04ImgRef} style={{ flex: 1, minWidth: 220, textAlign: 'center' }}>
              <Image
                src="/assets/images/main_bg_img4.png"
                alt="매매 일지 일러스트"
                width={320}
                height={320}
                style={{ borderRadius: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
              />
            </div>
          </div>
        </section>

        {/* sec05: 가이드 */}
        <section className={styles['sec05']} ref={sec05Ref}>
          <p className={styles['guide-text']}>
            초보자 중심으로 시작, 장투 지원, 리밸런스, 알림 기능 추가 예정
          </p>
        </section>
      </div>
    </Container>
  );
}