'use client'

import { useTheme } from 'next-themes'
import styles from '@/app/mypage/Mypage.module.scss'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className={styles['theme-toggle']}>
      <input
        type="checkbox"
        id="theme-toggle-checkbox"
        className={styles['theme-checkbox']}
        checked={theme === 'light'}
        onChange={handleThemeToggle}
        aria-label="테마 전환"
      />
      <label htmlFor="theme-toggle-checkbox" className={styles['theme-label']}>
        <span className={styles['theme-track']}>
          <span className={styles['theme-thumb']}></span>
        </span>
        <span className={styles['theme-icons']}>
          <span className={styles['icon-dark']}>🌙</span>
          <span className={styles['icon-light']}>☀️</span>
        </span>
      </label>
    </div>
  )
}

export default ThemeToggle 