import logo from "./logo.svg";
import React from "react";
import { Routes, Route } from "react-router-dom";
import SignUpPage from "./components/signUp";

function App() {
  return (
    <Routes>
      <Route path="/Register" element={<SignUpPage />} />
    </Routes>
  );
}

export default App;
