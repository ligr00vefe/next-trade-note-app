'use client'

import styles from '@/app/mypage/Mypage.module.scss'

const PortfolioTab = () => {
  return (
    <div className={styles['portfolio-content']}>
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
    </div>
  )
}

export default PortfolioTab 