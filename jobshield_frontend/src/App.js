import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CheckPage from './components/CheckPage';
import ReportPage from './components/ReportPage';
import CheckReportPage from './components/CheckReportPage';
import TrendsPage from './components/TrendsPage';
import NewsPage from './components/NewsPage';
import EducationPage from './components/EducationPage';
import ChatAssistant from "./components/ChatAssistant";
import ExtensionPage from "./components/ExtensionPage";
import Footer from './components/Footer';
import ConnectionTest from './components/ConnectionTest';

/**
 * Only responsible for rendering the original site content (keep original logic unchanged)
 */
function AppContent({ isFullAccess }) {
    const [currentPage, setCurrentPage] = useState('home');

    const navigateTo = (page) => {
        // 检查权限：如果是受限页面且没有完整权限，不允许导航
        if (['education', 'ChatAssistant'].includes(page) && !isFullAccess) {
            return;
        }
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    // 基础可访问页面
    const accessiblePages = {
        home: <HomePage onNavigate={navigateTo} />,
        check: <CheckPage onNavigate={navigateTo} />,
        report: <ReportPage onNavigate={navigateTo} />,
        'check-report': <CheckReportPage onNavigate={navigateTo} />,
        news: <NewsPage onNavigate={navigateTo} />,
        trends: <TrendsPage onNavigate={navigateTo} />,
    };

    // 只有在完整权限下才添加教育页面和聊天助手
    if (isFullAccess) {
        accessiblePages.education = <EducationPage onNavigate={navigateTo} />;
        accessiblePages.ChatAssistant = <ChatAssistant onNavigate={navigateTo} />;
        accessiblePages.ExtensionPage = <ExtensionPage onNavigate={navigateTo} />;
    }

    const renderPage = () => {
        if (['education', 'ChatAssistant', 'ExtensionPage'].includes(currentPage) && !isFullAccess) {
            setTimeout(() => setCurrentPage('home'), 0);
            return <HomePage onNavigate={navigateTo} />;
        }
        return accessiblePages[currentPage] || <HomePage onNavigate={navigateTo} />;
    };

    return (
        <div className="App">
            {/* <ConnectionTest /> */}
            <Header currentPage={currentPage} onNavigate={navigateTo} isFullAccess={isFullAccess} />
            {renderPage()}
            <Footer />
        </div>
    );
}

/**
 * Outermost: password gate (handles authorization)
 */
export default function App() {
    const [authorized, setAuthorized] = useState(false);
    const [pwd, setPwd] = useState('');
    const [isFullAccess, setIsFullAccess] = useState(false); // 默认没有完整权限

    useEffect(() => {
        if (sessionStorage.getItem('test_auth_ok') === '1') {
            setAuthorized(true);

            setIsFullAccess(true); // 不分端口，统一完整权限
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (pwd === 'TA39test123') {
            sessionStorage.setItem('test_auth_ok', '1');
            setAuthorized(true);

            setIsFullAccess(true); // 不分端口，统一完整权限
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

    return <AppContent isFullAccess={isFullAccess} />;
}
