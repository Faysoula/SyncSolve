import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3C096C",
      light: "#5A189A",
      dark: "#10002B",
      contrastText: "#fff",
    },
    secondary: {
      main: "#C77DFF",
      light: "#E0AAFF",
      dark: "#9D4EDD",
      contrastText: "#10002B",
    },
    background: {
      default: "#10002B",
      paper: "#3C096C",
    },
    text: {
      primary: "#fff",
    },
  },
  typography: {
    fontFamily: '"Coustard", Arial, sans-serif',
    h1: {
      fontFamily: '"Coustard", Arial, sans-serif',
      fontWeight: 900,
    },
    h2: {
      fontFamily: '"Coustard", Arial, sans-serif',
      fontWeight: 900,
    },
    h3: {
      fontFamily: '"Coustard", Arial, sans-serif',
      fontWeight: 900,
    },
    h4: {
      fontFamily: '"Coustard", Arial, sans-serif',
      fontWeight: 900,
    },
    h5: {
      fontFamily: '"Coustard", Arial, sans-serif',
      fontWeight: 900,
    },
    h6: {
      fontFamily: '"Coustard", Arial, sans-serif',
      fontWeight: 900,
    },
  },
  components: {
    MuiBadge: {
      styleOverrides: {
        badge: {
          backgroundColor: "#4ade80",
          color: "#FAF0CA",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          boxShadow: "none",
          borderBottom: "1px solid rgba(123, 44, 191, 0.1)",
          backdropFilter: "blur(10px)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          padding: "8px 24px",
          color: "#fff",
          backgroundColor: "#C77DFF",
          "&:hover": {
            backgroundColor: "#9D4EDD",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "rgba(60, 9, 108, 0.6)",
            color: "#fff",
            "& fieldset": {
              borderColor: "rgba(123, 44, 191, 0.3)",
            },
            "&:hover fieldset": {
              borderColor: "#C77DFF",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#C77DFF",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#E0AAFF",
            "&.Mui-focused": {
              color: "#C77DFF",
            },
          },
          "& .MuiSvgIcon-root": {
            color: "#E0AAFF",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: "rgba(60, 9, 108, 0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(123, 44, 191, 0.3)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: "rgba(60, 9, 108, 0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(123, 44, 191, 0.3)",
        },
      },
    },
  },
});
