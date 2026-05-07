import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { type PropsWithChildren } from 'react'
import { BrowserRouter, HashRouter } from 'react-router-dom'

import { muiTheme } from '@/app/theme/muiTheme'
import { QueryProvider } from './QueryProvider'

const isGitHubPages =
  typeof window !== 'undefined' && window.location.pathname.startsWith('/podcast-player-app')

const Router = isGitHubPages ? HashRouter : BrowserRouter

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <QueryProvider>
        <Router>{children}</Router>
      </QueryProvider>
    </ThemeProvider>
  )
}
