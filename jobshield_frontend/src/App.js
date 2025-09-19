import React, { useState } from 'react';
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

function App() {
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

export default App;
