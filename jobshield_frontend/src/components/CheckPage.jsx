import React, { useState } from 'react';
import ApiService from '../services/api';

function CheckPage({ onNavigate }) {
  const [urlToCheck, setUrlToCheck] = useState('');
  const [checkResult, setCheckResult] = useState(null);
  const [checkLoading, setCheckLoading] = useState(false);
  const [linkDataList, setLinkDataList] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const checkUrl = async () => {
    if (!urlToCheck) {
      setCheckResult({
        status: 'unknown',
        message: 'Please enter a URL to check'
      });
      return;
    }

    setCheckLoading(true);
    setCheckResult(null);
    setLinkDataList([]);

    try {
      const response = await ApiService.checkUrl(urlToCheck);

      if (response && response.data) {
        const data = response.data;

        if (data.linkDataList && data.linkDataList.length > 0) {
          setLinkDataList(data.linkDataList);

          const firstResult = data.linkDataList[0];
          const status = firstResult.status ? firstResult.status.toLowerCase() : 'unknown';

          setCheckResult({
            status: status,
            message: `Found ${data.totalCount} record(s) for this URL`
          });
        } else {
          setCheckResult({
            status: 'unknown',
            message: 'This URL has not been recorded yet. We cannot determine its safety. Please proceed with caution.'
          });
        }
      } else {
        setCheckResult({
          status: 'unknown',
          message: 'Unexpected response format from server'
        });
      }
    } catch (error) {
      console.error('Error checking URL:', error);
      setCheckResult({
        status: 'unknown',
        message: error.message || 'An error occurred while checking the URL. Please try again later.'
      });
    } finally {
      setCheckLoading(false);
    }
  };

  return (
    <div id="check-page" className="page active">
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

          <h2 className="section-title">URL Safety Check</h2>
          <p className="section-subtitle">Enter a URL to check its safety status. Our system will analyze it and provide a safety assessment.</p>

          <div className="card">
            <h3 className="card-title"><i className="fas fa-search"></i> Check Website Safety</h3>
            <div className="form-group">
              <label htmlFor="url-input">Enter URL</label>
              <input 
                type="url" 
                id="url-input" 
                className="form-control" 
                placeholder="e.g., https://example.com" 
                value={urlToCheck}
                onChange={(e) => setUrlToCheck(e.target.value)}
              />
            </div>
            <button 
              className="btn" 
              onClick={checkUrl} 
              disabled={checkLoading}
            >
              {checkLoading ? (
                <span className="loading">
                  <span className="spinner"></span> Checking...
                </span>
              ) : (
                <span>Check Safety</span>
              )}
            </button>

            {checkResult && (
              <div className={`result-box ${checkResult.status}`}>
                {checkResult.status === 'safety' && (
                  <p><i className="fas fa-check-circle"></i> This URL is safe</p>
                )}
                {checkResult.status === 'danger' && (
                  <p><i className="fas fa-exclamation-triangle"></i> Warning! This URL has been flagged as dangerous</p>
                )}
                {checkResult.status === 'unknown' && (
                  <p><i className="fas fa-question-circle"></i> This URL has not been recorded yet. We cannot determine its safety. Please proceed with caution.</p>
                )}
              </div>
            )}

            {linkDataList && linkDataList.length > 0 && (
              <div className="link-data-list">
                <h4>URL Safety Details</h4>
                {linkDataList.map((link, index) => (
                  <div key={index} className="link-data-item">
                    <div className="link-data-header">
                      <strong>{link.url}</strong>
                      <span className={`link-status status-${(link.status ? link.status.toLowerCase() : 'unknown')}`}>
                        {link.status || 'Unknown'}
                      </span>
                    </div>
                    <div className="link-details">
                      {link.threat && (
                        <div className="detail-item">
                          <span className="detail-label">Threat:</span> {link.threat}
                        </div>
                      )}
                      {link.last_online && (
                        <div className="detail-item">
                          <span className="detail-label">Last Online:</span> {link.last_online}
                        </div>
                      )}
                      {link.tags && (
                        <div className="detail-item">
                          <span className="detail-label">Tags:</span> {link.tags}
                        </div>
                      )}
                      {link.source && (
                        <div className="detail-item">
                          <span className="detail-label">Source:</span> {link.source}
                        </div>
                      )}
                      {link.reporter && (
                        <div className="detail-item">
                          <span className="detail-label">Reporter:</span> {link.reporter}
                        </div>
                      )}
                      {link.created_at && (
                        <div className="detail-item">
                          <span className="detail-label">Created At:</span> {formatDate(link.created_at)}
                        </div>
                      )}
                    </div>
                    {link.url_detail && (
                      <div className="detail-item">
                        <span className="detail-label">Details:</span> {link.url_detail}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CheckPage;
