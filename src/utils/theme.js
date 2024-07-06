import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0000ff', // Blue
    },
    secondary: {
      main: '#ffffff', // White
    },
    background: {
      default: '#1C1C28', // Background color
    },
  },
  typography: {
    fontWeightMedium: 600, // Set font weight to 600
    button: {
      textTransform: 'none',
      fontWeight: 600, // Set font weight to 600
    },
  },
});

export default theme;