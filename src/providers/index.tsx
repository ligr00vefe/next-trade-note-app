'use client'

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import ThemeProvider from './ThemeProvider'
import MUIProvider from './MUIProvider'
import ToastProvider from './ToastProvider'
import QueryProvider from './QueryProvider'

interface IProvidersProps {
  children: ReactNode
  session?: Session | null
}

const Providers = ({ children, session }: IProvidersProps) => {
  return (
    <QueryProvider>
      <SessionProvider session={session}>
        <ThemeProvider>
          <MUIProvider>
            <ToastProvider />
            {children}
          </MUIProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryProvider>
  )
}

export default Providers 