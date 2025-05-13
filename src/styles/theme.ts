import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: "#1769aa",
      main: "#2196f3",
      dark: "#4dabf5",
      contrastText: "#fff"
    },
    secondary: {
      light: "#4dabf5",
      main: "#2196f3",
      dark: "#1769aa",
      contrastText: "#000"
    }
  },
});

export default theme;