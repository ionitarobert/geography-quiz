import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f6f3ee',
      paper: '#ffffff',
    },
    primary: {
      main: '#1a1a1a',
      contrastText: '#f6f3ee',
    },
    secondary: {
      main: '#8a7a5c',
    },
    success: {
      main: '#2f6e4f',
    },
    error: {
      main: '#a8463a',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#5b5b5b',
    },
    divider: 'rgba(26, 26, 26, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    h1: {
      fontFamily: '"Cormorant Garamond", "Times New Roman", serif',
      fontWeight: 500,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    h2: {
      fontFamily: '"Cormorant Garamond", "Times New Roman", serif',
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    overline: {
      fontWeight: 500,
      letterSpacing: '0.25em',
      fontSize: '0.7rem',
    },
    body2: {
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f6f3ee',
        },
      },
    },
  },
});

export default theme;
