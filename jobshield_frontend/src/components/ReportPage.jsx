import React, { useState } from 'react';
import ApiService from '../services/api';

function ReportPage({ onNavigate }) {
  const [urlToReport, setUrlToReport] = useState('');
  const [scamType, setScamType] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  const reportUrl = async () => {
    if (!urlToReport) {
      setReportError('Please enter a URL to report');
      return;
    }

    if (!scamType) {
      setReportError('Please describe the threat type');
      return;
    }

    setReportLoading(true);
    setReportSuccess(false);
    setReportError('');

    try {
      const response = await ApiService.reportUrl(urlToReport, scamType);

      if (response && response.code === 'Success') {
        setReportSuccess(true);
        setUrlToReport('');
        setScamType('');
      } else {
        setReportError(response.message || 'Failed to report the URL');
      }
    } catch (error) {
      console.error('Error reporting URL:', error);
      setReportError(error.message || 'An error occurred while reporting the URL. Please try again later.');
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div id="report-page" className="page active">
      <section className="section">
        <div className="container">
          <a 
            href="#" 
            className="back-btn" 
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
            }}
          >
            <i className="fas fa-arrow-left"></i> Back to Home
          </a>

          <h2 className="section-title">Report Dangerous Website</h2>
          <p className="section-subtitle">If you've encountered a scam website, please report it here to help protect other Australians.</p>

          <div className="card">
            <h3 className="card-title"><i className="fas fa-flag"></i> Report Suspicious Website</h3>
            <div className="form-group">
              <label htmlFor="report-url">Enter URL to report</label>
              <input 
                type="url" 
                id="report-url" 
                className="form-control" 
                placeholder="e.g., https://suspicious-site.com" 
                value={urlToReport}
                onChange={(e) => setUrlToReport(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="scam-type">Threat Type (Please describe the threat)</label>
              <input 
                type="text" 
                id="scam-type" 
                className="form-control" 
                placeholder="e.g., Phishing, Job Scam, Investment Scam, etc." 
                value={scamType}
                onChange={(e) => setScamType(e.target.value)}
              />
            </div>
            <button 
              className="btn" 
              onClick={reportUrl} 
              disabled={reportLoading}
            >
              {reportLoading ? (
                <span className="loading">
                  <span className="spinner"></span> Reporting...
                </span>
              ) : (
                <span>Report Website</span>
              )}
            </button>

            {reportSuccess && (
              <div className="result-box safe">
                <p><i className="fas fa-check-circle"></i> Thank you for your report! Your contribution helps protect the community.</p>
              </div>
            )}

            {reportError && (
              <div className="result-box danger">
                <p><i className="fas fa-exclamation-triangle"></i> {reportError}</p>
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="card-title"><i className="fas fa-exclamation-triangle"></i> Common Job Scam Types</h3>
            <div className="scam-type-grid">
              <div className="scam-type-item">
                <i className="fas fa-fish scam-type-icon"></i>
                <span>Phishing Scams</span>
              </div>
              <div className="scam-type-item">
                <i className="fas fa-money-bill-wave scam-type-icon"></i>
                <span>Advance Fee Scams</span>
              </div>
              <div className="scam-type-item">
                <i className="fas fa-id-card scam-type-icon"></i>
                <span>Identity Theft</span>
              </div>
              <div className="scam-type-item">
                <i className="fas fa-house-user scam-type-icon"></i>
                <span>Work-from-Home Scams</span>
              </div>
              <div className="scam-type-item">
                <i className="fas fa-file-invoice-dollar scam-type-icon"></i>
                <span>Fake Job Offers</span>
              </div>
              <div className="scam-type-item">
                <i className="fas fa-tools scam-type-icon"></i>
                <span>Equipment Purchase Scams</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ReportPage;
