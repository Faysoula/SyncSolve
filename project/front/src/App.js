import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, Box } from "@mui/material";
import SignUp from "./components/signUp";
import LoginForm from "./components/signIn";
import LandingPage from "./components/landing";
import ProblemsPage from "./components/problemsPage";
import Footer from "./components/common/Footer";
import { theme } from "./theme";
import { AuthProvider } from "./context/authContext";
import Header from "./components/common/Header";
import AddProblemContainer from "./components/problem-form/AddProblemContainer";
import ProblemSolvingInterface from "./components/problemInterface";
import TeamJoin from "./components/TeamJoin";

// App component is the root component of the app
function App() {
  return (
    <AuthProvider>
      {/* ThemeProvider provides the theme to the entire app */}
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
          {/* Box component is a div with some additional styles */}
          <Box sx={{ flex: 1, mt: 8 }}>
            <Routes>
              <Route path="/Register" element={<SignUp />} />
              <Route path="/Signin" element={<LoginForm />} />
              <Route path="/problems" element={<ProblemsPage />} />
              <Route
                path="/problems/:problemId/session/:sessionId"
                element={<ProblemSolvingInterface />}
              />
              <Route
                path="/problems/edit/:problemId"
                element={<AddProblemContainer mode="edit" />}
              />
              <Route path="/teams/join/:teamId" element={<TeamJoin />} />
              <Route path="/problems/add" element={<AddProblemContainer />} />
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
