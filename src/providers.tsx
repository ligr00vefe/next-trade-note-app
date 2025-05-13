// providers.tsx
'use client'

import React, { ReactNode } from 'react'
import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'

type IProvidersProps = {
  children: ReactNode;
  session?: Session | null;
}

export default function Providers({ children , session }:IProvidersProps ) {
  return (
    <>
      <StyledEngineProvider injectFirst>
        <SessionProvider session={session}>
          <CssBaseline />
          {children}
        </SessionProvider>          
      </StyledEngineProvider>
    </>
  )
}