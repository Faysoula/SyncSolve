import logo from "./logo.svg";
import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUpPage from "./components/signUp";
import LoginForm from "./components/signIn";
import LandingPage from "./components/landing";

function App() {
  return (
    <Routes>
      <Route path="/Register" element={<SignUpPage />} />
      <Route path="/Signin" element={<LoginForm />} />
      <Route path="/" element={<LandingPage />} />

    </Routes>
  );
}

export default App;
