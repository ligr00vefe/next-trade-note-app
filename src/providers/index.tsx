'use client'

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import ThemeProvider from './ThemeProvider'
import MUIProvider from './MUIProvider'
import ToastProvider from './ToastProvider'

interface ProvidersProps {
  children: ReactNode
  session?: Session | null
}

const Providers = ({ children, session }: ProvidersProps) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <MUIProvider>
          <ToastProvider />
          {children}
        </MUIProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

export default Providers 