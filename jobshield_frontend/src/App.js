import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import HomePage from './components/HomePage';
import CheckPage from './components/CheckPage';
import ReportPage from './components/ReportPage';
import TrendsPage from './components/TrendsPage';
import Footer from './components/Footer';
import ConnectionTest from './components/ConnectionTest';
import AssistantPage from "./components/AssistantPage";

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'check':
        return <CheckPage onNavigate={navigateTo} />;
      case 'report':
        return <ReportPage onNavigate={navigateTo} />;
      case 'trends':
        return <TrendsPage onNavigate={navigateTo} />;
      case "assistant":
        return <AssistantPage onNavigate={navigateTo} />; // <-- NEW
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="App">
      <ConnectionTest />
      <Header currentPage={currentPage} onNavigate={navigateTo} />
      {renderPage()}
      <Footer />
    </div>
  );
}

export default App;
