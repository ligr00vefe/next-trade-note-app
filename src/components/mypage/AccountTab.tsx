'use client'

import styles from '@/app/mypage/Mypage.module.scss'
import ThemeToggle from './ThemeToggle'

const AccountTab = () => {
  return (
    <div className={styles['account-info-content']}>
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
      <div className={styles['info-card']}>
        <h4>테마 설정</h4>
        <ThemeToggle />
      </div>
    </div>
  )
}

export default AccountTab 