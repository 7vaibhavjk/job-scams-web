import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import "./App.css";
import Header from "./components/Header";
import HomePage from "./components/HomePage";
import CheckPage from "./components/CheckPage";
import ReportPage from "./components/ReportPage";
import CheckReportPage from "./components/CheckReportPage";
import TrendsPage from "./components/TrendsPage";
import EducationPage from "./components/EducationPage";
import ChatAssistant from "./components/ChatAssistant";
import ExtensionPage from "./components/ExtensionPage";
import Footer from "./components/Footer";

/* ---------------- Password Gate ---------------- */
function AuthGate({ children, setIsFullAccess }) {
  const [authorized, setAuthorized] = useState(false);
  const [pwd, setPwd] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("test_auth_ok") === "1") {
      setAuthorized(true);
      setIsFullAccess(true);
    }
  }, [setIsFullAccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pwd === "TA39test123") {
      sessionStorage.setItem("test_auth_ok", "1");
      setAuthorized(true);
      setIsFullAccess(true);
    } else {
      alert("Wrong password!");
    }
  };

  if (!authorized) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0f2f5",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "12px",
            width: "320px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: 16 }}>Enter Test Password</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Password"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                marginBottom: "12px",
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                background: "#0d6efd",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </form>
          <p style={{ fontSize: 12, color: "#777", marginTop: 10 }}>
            * Dev-only test gate (front-end only)
          </p>
        </div>
      </div>
    );
  }

  return children;
}

/* ---------------- Main Content ---------------- */
function AppContent({ isFullAccess }) {
  const navigate = useNavigate();

  const handleNavigate = (page) => {
    const routes = {
      home: "/",
      check: "/check",
      report: "/report",
      "check-report": "/analyze",
      trends: "/trends",
      education: "/education",     // ✅ education route restored
      ChatAssistant: "/support",   // ✅ support (chatbot)
      ExtensionPage: "/extension",
    };
    navigate(routes[page] || "/");
    window.scrollTo(0, 0);
  };

  return (
    <div className="App">
      <Header onNavigate={handleNavigate} isFullAccess={isFullAccess} />

      <Routes>
        <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
        <Route path="/check" element={<CheckPage onNavigate={handleNavigate} />} />
        <Route path="/report" element={<ReportPage onNavigate={handleNavigate} />} />
        <Route path="/analyze" element={<CheckReportPage onNavigate={handleNavigate} />} />
        <Route path="/trends" element={<TrendsPage />} />

        {/* ✅ Both restricted pages now active */}
        {isFullAccess && (
          <>
            <Route path="/education" element={<EducationPage onNavigate={handleNavigate} />} />
            <Route path="/support" element={<ChatAssistant onNavigate={handleNavigate} />} />
            <Route path="/extension" element={<ExtensionPage onNavigate={handleNavigate} />} />
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </div>
  );
}

/* ---------------- Root Export ---------------- */
export default function App() {
  const [isFullAccess, setIsFullAccess] = useState(false);

  return (
    <AuthGate setIsFullAccess={setIsFullAccess}>
      <AppContent isFullAccess={isFullAccess} />
    </AuthGate>
  );
}
