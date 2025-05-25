'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// 테마 타입 정의: 'dark' 또는 'light' 중 하나
type Theme = 'dark' | 'light';

// ThemeContext의 타입 정의
interface ThemeContextType {
  theme: Theme;        // 현재 테마 상태
  toggleTheme: () => void;  // 테마 전환 함수
}

// ThemeContext 생성
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider 컴포넌트
 * 
 * 기능:
 * 1. 테마 상태 관리 (dark/light)
 * 2. 로컬 스토리지를 통한 테마 설정 유지
 * 3. HTML 루트 요소에 테마 클래스 적용
 * 
 * @param children - Provider 내부의 자식 컴포넌트들
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme Hook
 * 
 * 기능:
 * 1. ThemeContext의 값에 접근
 * 2. Provider 외부에서 사용 시 에러 발생
 * 
 * @returns ThemeContextType - 현재 테마와 테마 전환 함수
 * @throws Error - Provider 외부에서 사용 시 에러 발생
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 