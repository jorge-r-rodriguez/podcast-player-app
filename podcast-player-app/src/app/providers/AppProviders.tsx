import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { type PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { muiTheme } from '@/app/theme/muiTheme'
import { QueryProvider } from './QueryProvider'

const routerBasename =
  typeof window !== 'undefined' && window.location.pathname.startsWith('/podcast-player-app')
    ? '/podcast-player-app/'
    : '/'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <QueryProvider>
        <BrowserRouter basename={routerBasename}>{children}</BrowserRouter>
      </QueryProvider>
    </ThemeProvider>
  )
}
