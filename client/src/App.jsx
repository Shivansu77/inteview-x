import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import InterviewPage from "@/pages/InterviewPage";
import Homepage from "@/pages/Homepage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import HistoryPage from "@/pages/HistoryPage";
import "@/styles/App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/choose" element={<LandingPage />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
  );
}

export default App;