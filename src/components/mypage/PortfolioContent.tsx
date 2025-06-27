'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import styles from './MypageContent.module.scss'
import { getPortfolioData, type PortfolioData } from '@/actions/getPortfolioData'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const PortfolioContent = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // 시스템 다크모드 감지
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeMediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches)
    }

    darkModeMediaQuery.addEventListener('change', handleChange)
    return () => darkModeMediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const data = await getPortfolioData()
        setPortfolioData(data)
        setError(null)
      } catch (error) {
        console.error('포트폴리오 데이터를 가져오는데 실패했습니다:', error)
        setError('포트폴리오 데이터를 불러오는데 실패했습니다.')
      }
    }

    fetchPortfolioData()
  }, [])

  const chartOptions = {
    chart: {
      type: 'pie' as const,
      background: 'transparent',
      foreColor: isDarkMode ? '#e2e8f0' : '#0f172a',
    },
    labels: portfolioData?.categories.map((item: { category: string }) => item.category) || [],
    colors: isDarkMode 
      ? ['#bfa46f', '#d6b97a', '#e2c88b', '#edd49c', '#f8e0ad'] // 다크모드 골드 계열
      : ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'], // 라이트모드 블루 계열
    legend: {
      position: 'bottom' as const,
      labels: {
        colors: isDarkMode ? '#e2e8f0' : '#0f172a'
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

  const chartSeries = portfolioData?.categories.map((item: { totalPrice: number }) => item.totalPrice) || []

  const getHighestCategory = () => {
    if (!portfolioData?.categories.length) return ''
    return portfolioData.categories.reduce((prev: { totalPrice: number; category: string }, current: { totalPrice: number; category: string }) => 
      prev.totalPrice > current.totalPrice ? prev : current
    ).category
  }

  if (error) {
    return <div className={styles['error-message']}>{error}</div>
  }

  return (
    <div className={styles['portfolio-content']}>
      <section className={styles['portfolio-section']}>
        <div className={styles['portfolio-weight']}>
          <h2>Portfolio</h2>
          <div className={styles['portfolio-weight-chart']}>
            {portfolioData && (
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="pie"
                height={300}
              />
            )}
          </div>
          <div className={styles['portfolio-weight-info']}>
            <p>
              <span>{portfolioData?.accountName}</span>님의 포트폴리오는 <span>{getHighestCategory()}</span>의 비중이 가장 높으며<br />
              투자 성향은 <span>{portfolioData?.riskTolerance}형</span>입니다.
            </p>
          </div>
        </div>
      </section>
      <section className={styles['overview-section']}>
        <div className={styles['overview-card']}>
          <h3>수익률</h3>
          <div className={styles['chart-placeholder']}>[수익률 차트]</div>
        </div>
        <div className={styles['overview-card']}>
          <h3>총 자산</h3>
          <div className={styles['asset-value']}>
            {portfolioData?.categories.reduce((sum: number, item: { totalPrice: number }) => sum + item.totalPrice, 0).toLocaleString()}원
          </div>
        </div>
      </section>
    </div>
  )
}

export default PortfolioContent 