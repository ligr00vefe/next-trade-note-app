"use client";

import styles from "./Home.module.scss";
import Container from "@/components/ui/Container";
import Image from "next/image";
import React from "react";
import { Fade } from "react-awesome-reveal";

const NAV_ITEMS = [
  { label: "로그인", href: "#", key: "login" },
  { label: "거래 등록", href: "#", key: "trade" },
  { label: "미이미지", href: "#", key: "dummy" },
];

export default function HomeClient() {
  // 버튼 접근성 핸들러
  const handleCtaKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.currentTarget.click();
    }
  };

  return (
    <Container
      backgroundImage="/assets/images/main_bg_img.png"
      backgroundSize="100% auto"
      backgroundPosition="top center"
      backgroundRepeat="no-repeat"
    >      
      <section className={styles['sec01']}>
        <div className={styles['sec01-inner']}>
          <Fade direction="left" triggerOnce>
            <div className={styles['text-area']}>
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
          </Fade>
          <Fade direction="right" triggerOnce>
            <div className={styles['img-area']} aria-hidden="true">
              <Image
                src="/assets/images/main_img_01.png"
                alt="차트 일러스트"
                width={400}
                height={400}
                priority
              />
            </div>
          </Fade>          
        </div>
      </section>

      <Fade direction="up" triggerOnce>
        <section className={styles['sec02']}>
          <div className={styles['card-list']}>
            <div className={styles['card']}>
              <span className={styles['card-icon']} aria-hidden="true">📄</span>
              <h2>거래 내역 정리</h2>
              <p>매수/매도 진행 공수익률, 물량 정량, 총대수익 계산</p>
            </div>
            <div className={styles['card']}>
              <span className={styles['card-icon']} aria-hidden="true">📊</span>
              <h2>포트폴리오 분석</h2>
              <p>&#39;테마별 보유 인텔크로로 살펴볼 5개 인트 &#39;리타표준준&#39;</p>
            </div>
            <div className={styles['card']}>
              <span className={styles['card-icon']} aria-hidden="true">📈</span>
              <h2>월별 수익 추이</h2>
              <p>월별 수익률 지표로 시각화</p>
            </div>
          </div>
        </section>
      </Fade>

      <Fade direction="up" triggerOnce>
        <section className={styles['sec03']}>
          <div className={styles['step-list']}>
            <span className={styles['step-num']}>1</span>
            <div>
              <h3>종목 등록</h3>
              <p>종목명, 가격, 수량, 시유 입력</p>
            </div>
          </div>
          <div className={styles['step-list']}>
            <span className={styles['step-num']}>2</span>
            <div>
              <h3>수익 확인</h3>
              <p>보유수익률, 실현 수익, 총 수익 확인</p>
            </div>
          </div>
          <div className={styles['step-list']}>
            <span className={styles['step-num']}>3</span>
            <div>
              <h3>분석 보기</h3>
              <p>포트 분석, 리밸런스, 알림 기능 추가 예정</p>
            </div>
          </div>
        </section>
      </Fade>

      <Fade direction="up" triggerOnce>
        <section className={styles['sec04']}>
          <p className={styles['guide-text']}>
            초보자 중심으로 시작, 장투 지원, 리밸런스, 알림 기능 추가 예정
          </p>
        </section>
      </Fade>
    </Container>
  );
}