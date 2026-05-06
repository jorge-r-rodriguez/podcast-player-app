import { createTheme } from '@mui/material/styles'

export const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5c67de',
    },
    background: {
      default: '#101116',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255,255,255,0.58)',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: ['Quicksand', 'Inter', 'system-ui', 'sans-serif'].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(144deg, rgba(27,27,27,1) 0%, rgba(20,21,31,1) 89%)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          borderRadius: 15,
        },
      },
    },
  },
})
