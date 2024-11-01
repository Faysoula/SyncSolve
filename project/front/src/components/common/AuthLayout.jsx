import React from "react";
import {
  Box,
  Container,
  Paper,
  ThemeProvider,
  createTheme,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#E0B1CB",
    },
    background: {
      default: "#231942",
      paper: "#5E548E",
    },
    text: {
      primary: "#FAF0CA",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          padding: "12px 24px",
          fontSize: "1rem",
          textTransform: "none",
          fontWeight: 600,
          color: "#231942",
          backgroundColor: "#E0B1CB",
          "&:hover": {
            backgroundColor: "#BE95C4",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "#9F86C0",
            color: "#FAF0CA",
            "& fieldset": {
              borderColor: "#BE95C4",
            },
            "&:hover fieldset": {
              borderColor: "#E0B1CB",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#FAF0CA",
          },
          "& .MuiSvgIcon-root": {
            color: "#FAF0CA",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#5E548E",
          borderRadius: "16px",
          padding: "24px",
        },
      },
    },
  },
});

const AuthLayout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#231942",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="sm">
          <Paper elevation={8} sx={{ p: 4, textAlign: "center" }}>
            {children}
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AuthLayout;