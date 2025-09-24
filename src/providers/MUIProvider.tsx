'use client'

import { CssBaseline, StyledEngineProvider } from '@mui/material'
import { ReactNode } from 'react'

interface IMUIProviderProps {
  children: ReactNode
}

const MUIProvider = ({ children }: IMUIProviderProps) => {
  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      {children}
    </StyledEngineProvider>
  )
}

export default MUIProvider