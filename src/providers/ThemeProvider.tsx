'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes'
import { ReactNode } from 'react'

interface IThemeProviderProps {
  children: ReactNode
}

const ThemeProvider = ({ children }: IThemeProviderProps) => {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  )
}

export default ThemeProvider