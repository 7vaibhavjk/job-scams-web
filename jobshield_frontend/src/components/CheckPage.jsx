import React, { useState } from 'react';
import ApiService from '../services/api';

const SOURCE_LABELS = {
    source_kaggle: 'PhiUSIIL Phishing URL Dataset',
    source_urlhaus: 'URLHaus',
    source_openphish: 'OpenPhish',
};

const formatSourceName = (code) => (code && SOURCE_LABELS[code]) || code || 'unknown';

function CheckPage({ onNavigate }) {
    const [urlToCheck, setUrlToCheck] = useState('');
    const [checkResult, setCheckResult] = useState(null);
    const [checkLoading, setCheckLoading] = useState(false);
    const [linkDataList, setLinkDataList] = useState([]);
    const [aiCheckData, setAiCheckData] = useState(null);
    const [basicCheckData, setBasicCheckData] = useState(null);

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
            setCheckResult({ status: 'unknown', message: 'Please enter a URL to check' });
            return;
        }

        setCheckLoading(true);
        setCheckResult(null);
        setLinkDataList([]);
        setAiCheckData(null);
        setBasicCheckData(null);

        try {
            const response = await ApiService.checkUrl(urlToCheck);

            if (!response || !response.data) {
                setCheckResult({ status: 'unknown', message: 'Invalid server response' });
                return;
            }

            const apiData = response.data; // 这里直接拿到 basicCheck 和 aiCheck

            setBasicCheckData(apiData.basicCheck || null);
            setAiCheckData(apiData.aiCheck || null);
            setLinkDataList(apiData.basicCheck?.linkDataList || []);

            // 设置总体结果状态（优先使用AI检测结果）
            let overallStatus = 'unknown';
            let overallMessage = '';

            if (apiData.aiCheck) {
                const aiData = apiData.aiCheck;
                overallStatus = aiData.is_phishing ? 'danger' : 'safety';
                overallMessage = `AI detection: ${aiData.prediction} (${(aiData.confidence * 100).toFixed(1)}% confidence)`;
            } else if (apiData.basicCheck?.linkDataList?.length > 0) {
                const firstResult = apiData.basicCheck.linkDataList[0];
                overallStatus = firstResult.status ? firstResult.status.toLowerCase() : 'unknown';
                overallMessage = `Found ${apiData.basicCheck.totalCount} record(s) in databases`;
            } else {
                overallMessage = 'No records found in databases. Please proceed with caution.';
            }

            setCheckResult({ status: overallStatus, message: overallMessage });
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

    const renderAICheckDetails = () => {
        if (!aiCheckData) return null;

        return (
            <div className="check-result-card ai-result">
                <h4><i className="fas fa-robot"></i> AI Detection Results</h4>
                <div className="result-details">
                    <div className="detail-row">
                        <span className="detail-label">Prediction:</span>
                        <span className={`prediction-value ${aiCheckData.prediction}`}>
                            {aiCheckData.prediction}
                            {aiCheckData.is_phishing ? <i className="fas fa-exclamation-triangle"></i> : <i className="fas fa-check-circle"></i>}
                        </span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Confidence:</span>
                        <span className="confidence-value">{(aiCheckData.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Phishing Probability:</span>
                        <span className="probability-value phishing">{(aiCheckData.probabilities?.phishing * 100).toFixed(1)}%</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Legitimate Probability:</span>
                        <span className="probability-value legitimate">{(aiCheckData.probabilities?.legitimate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Risk Level:</span>
                        <span className={`risk-level ${aiCheckData.risk_level}`}>{aiCheckData.risk_level}</span>
                    </div>
                    <div className="detail-row">
                        <span className="detail-label">Safety Score:</span>
                        <span className={`safety-score score-${Math.floor(aiCheckData.safety_score / 20)}`}>
                            {aiCheckData.safety_score}/100
                        </span>
                    </div>
                    {aiCheckData.summary_reasons?.length > 0 && (
                        <div className="detail-row">
                            <span className="detail-label">Detection Reasons:</span>
                            <div className="reasons-list">
                                {aiCheckData.summary_reasons.map((reason, index) => (
                                    <div key={index} className="reason-item">
                                        <i className="fas fa-exclamation-circle"></i> {reason}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="detail-row">
                        <span className="detail-label">URL Analyzed:</span>
                        <span className="url-value">{aiCheckData.url}</span>
                    </div>
                </div>
            </div>
        );
    };

    const renderBasicCheckDetails = () => {
        if (!basicCheckData) return null;

        return (
            <div className="check-result-card basic-result">
                <h4><i className="fas fa-database"></i> Database Check Results</h4>
                {basicCheckData.totalCount > 0 ? (
                    <>
                        <div className="detail-row">
                            <span className="detail-label">Records Found:</span>
                            <span className="count-value">{basicCheckData.totalCount}</span>
                        </div>
                        {linkDataList.length > 0 && (
                            <div className="link-data-list">
                                {linkDataList.map((link, index) => (
                                    <div key={index} className="link-data-item">
                                        <div className="link-data-header">
                                            <strong>{link.url}</strong>
                                            <span className={`link-status status-${(link.status || 'unknown').toLowerCase()}`}>
                                                {link.status || 'Unknown'}
                                            </span>
                                        </div>
                                        <div className="link-details">
                                            {link.threat && <div className="detail-item"><span className="detail-label">Threat:</span> {link.threat}</div>}
                                            {link.last_online && <div className="detail-item"><span className="detail-label">Last Online:</span> {link.last_online}</div>}
                                            {link.tags && <div className="detail-item"><span className="detail-label">Tags:</span> {link.tags}</div>}
                                            {link.source && <div className="detail-item"><span className="detail-label">Source:</span> {formatSourceName(link.source)}</div>}
                                            {link.reporter && <div className="detail-item"><span className="detail-label">Reporter:</span> {link.reporter}</div>}
                                            {link.created_at && <div className="detail-item"><span className="detail-label">Created At:</span> {formatDate(link.created_at)}</div>}
                                            {link.url_detail && <div className="detail-item"><span className="detail-label">Details:</span> {link.url_detail}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="detail-row">
                        <span className="detail-label">Status:</span>
                        <span className="no-records">No records found in threat databases</span>
                    </div>
                )}
            </div>
        );
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
                    <p className="section-subtitle">
                        Enter a URL to check its safety status. Our system will analyze it and provide a safety assessment.
                    </p>

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
                                onKeyPress={(e) => e.key === 'Enter' && checkUrl()}
                            />
                        </div>
                        <button className="btn" onClick={checkUrl} disabled={checkLoading}>
                            {checkLoading ? <span className="loading"><span className="spinner"></span> Checking...</span> : <span>Check Safety</span>}
                        </button>

                        {checkResult && (
                            <div className={`overall-result ${checkResult.status}`}>
                                <div className="result-summary">
                                    {checkResult.status === 'safety' && <h4><i className="fas fa-check-circle"></i> Safe URL</h4>}
                                    {checkResult.status === 'danger' && <h4><i className="fas fa-exclamation-triangle"></i> Dangerous URL Detected!</h4>}
                                    {checkResult.status === 'unknown' && <h4><i className="fas fa-question-circle"></i> Unknown Safety Status</h4>}
                                    <p>{checkResult.message}</p>
                                </div>
                            </div>
                        )}

                        {renderAICheckDetails()}
                        {renderBasicCheckDetails()}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default CheckPage;
