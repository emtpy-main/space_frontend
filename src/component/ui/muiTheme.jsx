import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#FFFFFF" },
    secondary: { main: "#2c1857" },
    background: { paper: "rgba(44, 24, 87, 0.5)" },
    text: { primary: "#FFFFFF" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(44, 24, 87, 0.6)",
          color: "#FFF",
          "&:hover": { backgroundColor: "rgba(44, 24, 87, 0.8)" },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": { color: "rgba(255, 255, 255, 0.7)" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
            "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.8)" },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: { icon: { color: "rgba(255, 255, 255, 0.7)" } },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& label": { color: "rgba(255, 255, 255, 0.7)" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "rgba(255, 255, 255, 0.4)" },
            "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.8)" },
          },
        },
      },
    },
  },
});

export const chatMuiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#2c1857' },
    secondary: { main: '#5f36a0' },
    background: { paper: 'rgba(95, 54, 160, 0.5)' },
    text: { primary: '#FFFFFF' },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
          },
        },
      },
    },
  },
});
