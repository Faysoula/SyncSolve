import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, Box } from "@mui/material";
import SignUp from "./components/signUp";
import LoginForm from "./components/signIn";
import LandingPage from "./components/landing";
import Footer from "./components/common/Footer";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Routes>
            <Route path="/Register" element={<SignUp />} />
            <Route path="/Signin" element={<LoginForm />} />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
