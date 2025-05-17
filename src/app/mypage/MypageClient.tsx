"use client";

import styles from './Mypage.module.scss';

const MypageClient = () => {
  return (
    <div className={styles['mypage-root']}>
      <aside className={styles['mypage-sidebar']}>
        <div className={styles['sidebar-card']}>포트폴리오</div>
        <div className={styles['sidebar-card']}>계좌정보</div>
        <button className={styles['sidebar-btn']}>Q&A</button>
      </aside>
      <main className={styles['mypage-main']}>
        <section className={styles['portfolio-section']}>
          <h2>Portfolio</h2>
          <div className={styles['chart-placeholder']}>[캔들차트]</div>
        </section>
        <section className={styles['overview-section']}>
          <div className={styles['overview-card']}>
            <h3>수익률</h3>
            <div className={styles['chart-placeholder']}>[수익률 차트]</div>
          </div>
          <div className={styles['overview-card']}>
            <h3>총 자산</h3>
            <div className={styles['asset-value']}>2,229만원</div>
          </div>
        </section>
      </main>
      <aside className={styles['mypage-info']}>
        <div className={styles['info-card']}>
          <h4>계정 정보</h4>
          <ul>
            <li>이메일: user@email.com</li>
            <li>가입일: 2023-01-01</li>
          </ul>
        </div>
        <div className={styles['info-card']}>
          <h4>보안 설정</h4>
          <button>비밀번호 변경</button>
        </div>
      </aside>
      <section className={styles['mypage-bottom-cards']}>
        <div className={styles['bottom-card']}>Stock Overview</div>
        <div className={styles['bottom-card']}>Portfolio</div>
        <div className={styles['bottom-card']}>거래내역</div>
      </section>
    </div>
  );
};

export default MypageClient;
