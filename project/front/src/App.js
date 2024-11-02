import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, Box } from "@mui/material";
import SignUp from "./components/signUp";
import LoginForm from "./components/signIn";
import LandingPage from "./components/landing";
import Footer from "./components/common/Footer";
import { theme } from "./theme";
import { AuthProvider } from "./context/authContext";
import Header from "./components/common/Header";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Header />
          <Box sx={{ flex: 1, mt: 8 }}>
            <Routes>
              <Route path="/Register" element={<SignUp />} />
              <Route path="/Signin" element={<LoginForm />} />
              <Route path="/" element={<LandingPage />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </ThemeProvider>
    </AuthProvider>
  );
}
export default App;
