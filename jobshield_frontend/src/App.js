import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CheckPage from './components/CheckPage';
import ReportPage from './components/ReportPage';
import TrendsPage from './components/TrendsPage';
import EducationPage from './components/EducationPage';
import SupportPage from './components/SupportPage';
import Footer from './components/Footer';
import ConnectionTest from './components/ConnectionTest';

/** 
 * 只负责渲染你原来的站点内容（保持你的原始逻辑不变）
 */
function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');

  const isFullAccess = true;

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // 可访问页面映射
  const accessiblePages = {
    home: <HomePage onNavigate={navigateTo} />,
    check: <CheckPage onNavigate={navigateTo} />,
    report: <ReportPage onNavigate={navigateTo} />,
    trends: <TrendsPage onNavigate={navigateTo} />,
    ...(isFullAccess && {
      education: <EducationPage onNavigate={navigateTo} />,
      support: <SupportPage onNavigate={navigateTo} />
    })
  };

  const renderPage = () => {
    return accessiblePages[currentPage] || <HomePage onNavigate={navigateTo} />;
  };

  return (
    <div className="App">
      <ConnectionTest />
      <Header currentPage={currentPage} onNavigate={navigateTo} isFullAccess={isFullAccess} />
      {renderPage()}
      <Footer />
    </div>
  );
}

/**
 * 最外层：密码门（只处理授权与否，不混用 AppContent 的 Hooks）
 */
export default function App() {
  const [authorized, setAuthorized] = useState(false);
  const [pwd, setPwd] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('test_auth_ok') === '1') {
      setAuthorized(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pwd === 'TA39test123') { // 👈 这里改成你的临时密码
      sessionStorage.setItem('test_auth_ok', '1');
      setAuthorized(true);
    } else {
      alert('Wrong password!');
    }
  };

  if (!authorized) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5'
      }}>
        <div style={{
          background: '#fff',
          padding: '30px',
          borderRadius: '12px',
          width: '320px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: 16 }}>Enter Test Password</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Password"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                marginBottom: '12px'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: '#0d6efd',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Submit
            </button>
          </form>
          <p style={{ fontSize: 12, color: '#777', marginTop: 10 }}>
            * Dev-only test gate (front-end only)
          </p>
        </div>
      </div>
    );
  }

  return <AppContent />;
}
