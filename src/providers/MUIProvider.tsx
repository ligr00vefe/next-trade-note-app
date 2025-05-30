'use client'

import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { ReactNode } from 'react'

interface MUIProviderProps {
  children: ReactNode
}

const MUIProvider = ({ children }: MUIProviderProps) => {
  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      {children}
    </StyledEngineProvider>
  )
}

export default MUIProvider 