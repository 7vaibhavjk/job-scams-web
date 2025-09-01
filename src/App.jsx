import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { UrlCheckerPage } from './pages/UrlCheckerPage.jsx'
import { InsightsPage } from './pages/InsightsPage.jsx'
import { ReportScamPage } from './pages/ReportScamPage.jsx'
import { SubmitReportPage } from './pages/SubmitReportPage.jsx'

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/url-checker" element={<UrlCheckerPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/report-scam" element={<ReportScamPage />} />
            <Route path="/submit-report" element={<SubmitReportPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}