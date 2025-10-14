import React, { useEffect, useState } from 'react';
import ApiService from '../services/api';
import { motion } from "framer-motion";

const SOURCE_LABELS = {
    source_kaggle: 'PhiUSIIL Phishing URL Dataset',
    source_urlhaus: 'URLHaus',
    source_openphish: 'OpenPhish',
};

const formatSourceName = (code) => (code && SOURCE_LABELS[code]) || code || 'unknown';

const AnimatedHighlightedText = ({ text, phrases = [], verdict }) => {
  const [html, setHtml] = useState(text || "");

  const HIGHLIGHT_FILL_MS = 1000; // duration of the fill animation per phrase

  const escapeReg = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const buildHtml = (base, phrases, progress) => {
    let working = base;
    phrases.forEach(({ phrase }) => {
      const escaped = escapeReg(phrase);
      const regex = new RegExp(escaped, "gi");
      working = working.replace(
        regex,
        `<span class="animated-highlight" style="--fill:${progress}%;">$&</span>`
      );
    });
    return working;
  };

  useEffect(() => {
    if (!text) {
      setHtml("");
      return;
    }
    if (
  !phrases ||
  phrases.length === 0 ||
  verdict?.toLowerCase().includes('real') ||
  verdict?.toLowerCase().includes('safe')
) {
  setHtml(text);
  return;
}


    let startTime = null;
    let frameId;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min((elapsed / HIGHLIGHT_FILL_MS) * 100, 100);
      setHtml(buildHtml(text, phrases, progress));

      if (elapsed < HIGHLIGHT_FILL_MS) {
        frameId = requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [text, phrases, verdict]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="analyzed-text"
      style={{
        background: "#fff",
        borderRadius: "8px",
        padding: "1rem",
        lineHeight: "1.6",
        whiteSpace: "pre-wrap",
        fontSize: "0.95rem",
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

// --- Basic PII Sanitizer ---
const sanitizeText = (input) => {
  if (!input) return input;

  const patterns = [
    { type: 'EMAIL', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
    { type: 'PHONE', regex: /\b(\+?\d{1,3}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}\b/g },
    { type: 'URL', regex: /\bhttps?:\/\/[^\s]+/gi },
    { type: 'SSN_LIKE', regex: /\b\d{3}-\d{2}-\d{4}\b/g },
    { type: 'ADDRESS_LIKE', regex: /\b\d{1,5}\s+[A-Za-z0-9]+\s+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct)\b/gi },
  ];

  let text = input;
  patterns.forEach(({ regex, type }) => {
    text = text.replace(regex, `[${type}]`);
  });

  return text;
};


function CheckReportPage({ onNavigate }) {
    // URL check related state
    const [urlToCheck, setUrlToCheck] = useState('');
    const [checkResult, setCheckResult] = useState(null);
    const [checkLoading, setCheckLoading] = useState(false);
    const [linkDataList, setLinkDataList] = useState([]);
    const [aiCheckData, setAiCheckData] = useState(null);
    const [basicCheckData, setBasicCheckData] = useState(null);
    const [urlError, setUrlError] = useState('');
    
    // Report related state
    const [urlToReport, setUrlToReport] = useState('');
    const [scamType, setScamType] = useState('');
    const [reportSuccess, setReportSuccess] = useState(false);
    const [reportError, setReportError] = useState('');
    const [reportLoading, setReportLoading] = useState(false);
    const [threatTypeSuggestions, setThreatTypeSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [reportUrlError, setReportUrlError] = useState('');
    const [showSafetyConflictModal, setShowSafetyConflictModal] = useState(false);
    const [safetyCheckData, setSafetyCheckData] = useState(null);
    
    // Layout state
    const [layoutMode, setLayoutMode] = useState('normal'); // 'normal', 'check-result', 'report-result', 'both'

    // ---- Add Job Ad Analyzer ----
    const [jobText, setJobText] = useState('');
    const [jobResult, setJobResult] = useState(null);
    const [jobLoading, setJobLoading] = useState(false);
    const [displayText, setDisplayText] = useState('');

  const analyzeJobAd = async () => {
  if (!jobText.trim()) return;

  // Sanitize before sending anywhere
  const sanitizedText = sanitizeText(jobText);
  setJobLoading(true);
  setJobResult(null);

  try {
    const response = await ApiService.analyzeJobAd(sanitizedText); // use sanitized text
    if (response && response.data) {
      setJobResult(response.data);
      setDisplayText(sanitizedText); // display sanitized text to user
      setJobText('');
    } else {
      setJobResult({ Verdict: "Error", Message: "Invalid server response" });
    }
  } catch (error) {
    setJobResult({ Verdict: "Error", Message: error.message });
  } finally {
    setJobLoading(false);
  }
};




    // Highlight high-risk phrases in the job ad text
const highlightJobText = (text, phrases, verdict) => {
    if (!text || verdict?.toLowerCase().includes('real')) return text; // no highlights if real
    if (!phrases || phrases.length === 0) return text;

    // Sort phrases by length (to avoid nested highlight issues)
    const sortedPhrases = [...phrases].sort((a, b) => b.phrase.length - a.phrase.length);

    let highlighted = text;
    sortedPhrases.forEach(({ phrase }) => {
        const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'gi');
        highlighted = highlighted.replace(
            regex,
            `<span style="background-color: rgba(255, 99, 71, 0.3); border-radius: 3px; padding: 1px 2px;">$&</span>`
        );
    });

    return highlighted;
};


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

    // URL validation function
    const validateUrl = (url) => {
        if (!url.trim()) {
            return 'Please enter a URL';
        }
        
        // Basic URL format validation
        const urlPattern = /^https?:\/\/.+/i;
        if (!urlPattern.test(url)) {
            return 'Please enter a valid URL starting with http:// or https://';
        }
        
        try {
            new URL(url);
            return '';
        } catch (error) {
            return 'Please enter a valid URL format';
        }
    };

    // Threat Type suggestion data
    const threatTypeOptions = [
        'Phishing Scams',
        'Advance Fee Scams',
        'Identity Theft',
        'Work-from-Home Scams',
        'Fake Job Offers',
        'Equipment Purchase Scams',
        'Investment Scams',
        'Romance Scams',
        'Tech Support Scams',
        'Tax Scams',
        'Charity Scams',
        'Lottery Scams',
        'Other types of fraud'
    ];

    // Handle Threat Type input changes
    const handleThreatTypeChange = (value) => {
        setScamType(value);
        if (value.length > 0) {
            const suggestions = threatTypeOptions.filter(option =>
                option.toLowerCase().includes(value.toLowerCase())
            );
            setThreatTypeSuggestions(suggestions);
            setShowSuggestions(suggestions.length > 0);
        } else {
            setThreatTypeSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Select suggestion item
    const selectSuggestion = (suggestion) => {
        setScamType(suggestion);
        setShowSuggestions(false);
        setThreatTypeSuggestions([]);
    };

    // Check safety conflict
    const checkSafetyConflict = (checkData) => {
        if (!checkData) return false;

        const { aiCheck } = checkData;

        // Only when AI model shows the link is safe, confirmation is needed
        const isAISafe = aiCheck && !aiCheck.is_phishing && aiCheck.prediction === 'legitimate';
        
        return isAISafe;
    };

    // Handle safety conflict confirmation
    const handleSafetyConflictConfirm = async () => {
        setShowSafetyConflictModal(false);
        setReportLoading(true);
        
        try {
            const response = await ApiService.reportUrl(urlToReport, scamType);

            if (response && response.code === 'Success') {
                setReportSuccess(true);
                setReportError('');
                setUrlToReport('');
                setScamType('');
            } else {
                setReportError(response?.message || 'Failed to report URL');
            }
        } catch (error) {
            console.error('Error reporting URL:', error);
            setReportError(error.message || 'An error occurred while reporting the URL');
        } finally {
            setReportLoading(false);
        }
    };

    // Handle safety conflict cancellation
    const handleSafetyConflictCancel = () => {
        setShowSafetyConflictModal(false);
        setSafetyCheckData(null);
        setReportLoading(false);
    };

    const checkUrl = async () => {
        // Validate URL format
        const urlValidationError = validateUrl(urlToCheck);
        if (urlValidationError) {
            setUrlError(urlValidationError);
            return;
        }
        
        setUrlError(''); // Clear previous errors

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

            const apiData = response.data; // Get basicCheck and aiCheck directly here
            console.log('API Response Data:', apiData); // Debug log

            setBasicCheckData(apiData.basicCheck || null);
            setAiCheckData(apiData.aiCheck || null);
            setLinkDataList(apiData.basicCheck?.linkDataList || []);

            // Set overall result status (prioritize AI detection results)
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

            // Switch to check result layout
            setLayoutMode('check-result');

        } catch (error) {
            console.error('Error checking URL:', error);
            setCheckResult({ 
                status: 'error', 
                message: error.message || 'An error occurred while checking the URL. Please try again later.' 
            });
            setLayoutMode('check-result');
        } finally {
            setCheckLoading(false);
        }
    };

    const reportUrl = async () => {
        // Validate report URL format
        const reportUrlValidationError = validateUrl(urlToReport);
        if (reportUrlValidationError) {
            setReportUrlError(reportUrlValidationError);
            return;
        }
        
        if (!scamType) {
            setReportError('Please describe the threat type');
            return;
        }
        
        setReportUrlError(''); // Clear URL error

        setReportLoading(true);
        setReportSuccess(false);
        setReportError('');

        try {
            // First call Check Safety API to check link status
            console.log('Checking URL safety before reporting...');
            const checkResponse = await ApiService.checkUrl(urlToReport);
            
            if (checkResponse && checkResponse.data) {
                const checkData = checkResponse.data;
                console.log('Safety check result:', checkData);
                
                // Check if confirmation is needed
                const needsConfirmation = checkSafetyConflict(checkData);
                
                if (needsConfirmation) {
                    setReportLoading(false);
                    setShowSafetyConflictModal(true);
                    setSafetyCheckData(checkData);
                    return;
                }
            }
        } catch (error) {
            console.log('Safety check failed, proceeding with report:', error);
            // Safety check failure does not affect report flow, continue execution
        }

        try {
            const response = await ApiService.reportUrl(urlToReport, scamType);

            if (response && response.code === 'Success') {
                setReportSuccess(true);
                setUrlToReport('');
                setScamType('');
                
                // Switch to report result layout
                if (layoutMode === 'check-result') {
                    setLayoutMode('both');
                } else {
                    setLayoutMode('report-result');
                }
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

    const renderCheckForm = () => (
        <div className="check-form-section">
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
                Enter a URL to check its safety status and get detailed analysis
            </p>

            <div className="check-form">
                <div className="form-group">
                    <label htmlFor="url-input">Website URL</label>
                    <input
                        type="url"
                        id="url-input"
                        className={`form-input ${urlError ? 'error' : ''}`}
                        placeholder="https://example.com"
                        value={urlToCheck}
                        onChange={(e) => {
                            setUrlToCheck(e.target.value);
                            setUrlError(''); // Clear error message
                        }}
                        disabled={checkLoading}
                    />
                    {urlError && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i> {urlError}
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        className="btn btn-primary"
                        onClick={checkUrl}
                        disabled={checkLoading || !urlToCheck.trim()}
                    >
                        {checkLoading ? 'Checking...' : 'Check Safety'}
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={() => {
                            // If there are already check results, switch to both mode
                            if (layoutMode === 'check-result') {
                                setLayoutMode('both');
                            } else {
                                // Otherwise switch to report mode
                                setLayoutMode('report-result');
                            }
                        }}
                    >
                        Report Website
                    </button>
                </div>
            </div>
            
        </div>
    );

    const renderReportForm = () => (
        <div className="report-form-section">
            <h3 className="section-title">Report Scam Website</h3>
            <p className="section-subtitle">
                Help protect others by reporting suspicious websites
            </p>

            <div className="report-form">
                <div className="form-group">
                    <label htmlFor="report-url-input">Suspicious Website URL</label>
                    <input
                        type="url"
                        id="report-url-input"
                        className={`form-input ${reportUrlError ? 'error' : ''}`}
                        placeholder="https://suspicious-site.com"
                        value={urlToReport}
                        onChange={(e) => {
                            setUrlToReport(e.target.value);
                            setReportUrlError(''); // Clear error message
                        }}
                        disabled={reportLoading}
                    />
                    {reportUrlError && (
                        <div className="error-message">
                            <i className="fas fa-exclamation-circle"></i> {reportUrlError}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="scam-type-input">Threat Type</label>
                    <div className="autocomplete-container">
                        <input
                            type="text"
                            id="scam-type-input"
                            className="form-input"
                            placeholder="e.g., Phishing, Job Scam, Investment Scam, etc."
                            value={scamType}
                            onChange={(e) => handleThreatTypeChange(e.target.value)}
                            onFocus={() => {
                                if (threatTypeSuggestions.length > 0) {
                                    setShowSuggestions(true);
                                }
                            }}
                            onBlur={() => {
                                // Delay hiding to give user time to click suggestions
                                setTimeout(() => setShowSuggestions(false), 200);
                            }}
                            disabled={reportLoading}
                        />
                        {showSuggestions && threatTypeSuggestions.length > 0 && (
                            <div className="suggestions-dropdown">
                                {threatTypeSuggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="suggestion-item"
                                        onClick={() => selectSuggestion(suggestion)}
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Common Job Scam Types selector */}
                <div className="scam-types-card">
                    <h4 className="scam-types-title">
                        <i className="fas fa-exclamation-triangle"></i> Common Job Scam Types
                    </h4>
                    <p className="scam-types-subtitle">
                        Click on a scam type to automatically fill the threat type:
                    </p>
                    <div className="scam-type-grid">
                        {[
                            'Phishing Scams',
                            'Advance Fee Scams',
                            'Identity Theft',
                            'Work-from-Home Scams',
                            'Fake Job Offers',
                            'Equipment Purchase Scams',
                            'Other types of fraud'
                        ].map((type) => (
                            <div
                                key={type}
                                className="scam-type-item clickable-scam-type"
                                onClick={() => setScamType(type)}
                            >
                                <i className={`fas ${
                                    type === 'Phishing Scams' ? 'fa-fish' :
                                        type === 'Advance Fee Scams' ? 'fa-money-bill-wave' :
                                            type === 'Identity Theft' ? 'fa-id-card' :
                                                type === 'Work-from-Home Scams' ? 'fa-house-user' :
                                                    type === 'Fake Job Offers' ? 'fa-file-invoice-dollar' :
                                                        type === 'Equipment Purchase Scams' ? 'fa-tools' :
                                                            'fa-question-circle'
                                } scam-type-icon`}></i>
                                <span>{type}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={reportUrl}
                        disabled={reportLoading || !urlToReport.trim() || !scamType.trim()}
                    >
                        {reportLoading ? (
                            <span className="loading">
                                <span className="spinner"></span> Reporting...
                            </span>
                        ) : (
                            <span>Report Website</span>
                        )}
                    </button>
                </div>

                {reportSuccess && (
                    <div className="result-box success">
                        <p><i className="fas fa-check-circle"></i> Thank you for your report! Your contribution helps protect the community.</p>
                    </div>
                )}

                {reportError && (
                    <div className="result-box danger">
                        <p><i className="fas fa-exclamation-triangle"></i> {reportError}</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderJobAnalyzer = () => (
  <div className="job-analyzer-section" style={{ marginTop: '3rem' }}>
    <h2 className="section-title">Job Ad Analyzer</h2>
    <p className="section-subtitle">
      Paste a job advertisement to detect if it's safe or suspicious.
    </p>

    <p style={{ color: '#a94442', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
       Please do not paste personal info (emails, phone numbers, addresses, names). We'll automatically redact common ones.
    </p>

    <textarea
      className="form-input"
      style={{ resize: 'none' }}
      placeholder="Paste job ad text here..."
      value={jobText}
      onChange={(e) => setJobText(e.target.value)}
      disabled={jobLoading}
      rows={6}
    />

    <div className="form-actions">
      <button
        className="btn btn-primary"
        onClick={analyzeJobAd}
        disabled={jobLoading || !jobText.trim()}
      >
        {jobLoading ? 'Analyzing...' : 'Analyze Job Ad'}
      </button>
    </div>

    {jobResult && (
      <div
        className="job-result-card"
        style={{
          marginTop: '2rem',
          border: '1px solid #ddd',
          borderRadius: '10px',
          padding: '1.5rem',
          backgroundColor: '#fafafa',
          boxShadow: '0 3px 8px rgba(0,0,0,0.05)',
        }}
      >
        <div
          style={{
            borderBottom: '1px solid #eee',
            paddingBottom: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <h3
            style={{
              fontWeight: '600',
              color: jobResult.Verdict?.includes('FAKE') ? '#d9534f' : '#28a745',
              marginBottom: '0.3rem',
            }}
          >
            {jobResult.Verdict?.includes('FAKE')
              ? '⚠️ Unsafe — Proceed with Caution'
              : '✅ Safe — Likely Legitimate'}
          </h3>

          <p style={{ margin: 0, fontSize: '0.95rem', color: '#666' }}>
            Trust Score:
            <strong> {jobResult.Score?.toFixed(1) || 0}/100</strong>
          </p>

          <div
            style={{
              width: '100%',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: '#e9ecef',
              marginTop: '6px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${jobResult.Score}%`,
                height: '100%',
                backgroundColor: jobResult.Verdict?.includes('FAKE')
                  ? '#dc3545'
                  : '#28a745',
                transition: 'width 0.5s ease',
              }}
            ></div>
          </div>
        </div>

        {/* Highlighted Job Ad */}
        <AnimatedHighlightedText
  text={displayText}
  phrases={jobResult['Important Phrases']}
  verdict={jobResult.Verdict}
/>

      </div>
    )}
  </div>
);



    const renderCheckResults = () => {
        if (!checkResult) {
            console.log('No checkResult data:', checkResult);
            return null;
        }

        console.log('Rendering check results:', checkResult);
        console.log('AI Check Data:', aiCheckData);
        console.log('Basic Check Data:', basicCheckData);
        console.log('Link Data List:', linkDataList);

        return (
            <div className="check-results-section">
                <h3>Safety Check Results</h3>
                
                {checkResult.status === 'safety' && (
                    <div className="result-box success">
                        <p><i className="fas fa-check-circle"></i> Safe URL</p>
                    </div>
                )}

                {checkResult.status === 'danger' && (
                    <div className="result-box danger">
                        <p><i className="fas fa-exclamation-triangle"></i> Dangerous URL Detected!</p>
                    </div>
                )}

                {checkResult.status === 'unknown' && (
                    <div className="result-box warning">
                        <p><i className="fas fa-question-circle"></i> {checkResult.message}</p>
                    </div>
                )}

                {checkResult.status === 'error' && (
                    <div className="result-box danger">
                        <p><i className="fas fa-exclamation-triangle"></i> {checkResult.message}</p>
                    </div>
                )}


                {renderAICheckDetails()}
                {renderBasicCheckDetails()}
            </div>
        );
    };

    const renderAICheckDetails = () => {
        if (!aiCheckData) {
            console.log('No aiCheckData:', aiCheckData);
            return null;
        }
        
        console.log('AI Check Data for rendering:', aiCheckData);

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
        if (!basicCheckData) {
            console.log('No basicCheckData:', basicCheckData);
            return null;
        }
        
        console.log('Basic Check Data for rendering:', basicCheckData);

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

    const renderMainContent = () => (
        <div className="main-content">
            {renderCheckForm()}
            {(layoutMode === 'report-result' || layoutMode === 'both') && renderReportForm()}
        </div>
    );

    const renderSplitLayout = () => (
        <div className="split-layout">
            <div className="left-panel">
                {renderMainContent()}
            </div>
            <div className="right-panel">
                {renderCheckResults()}
            </div>
        </div>
    );

    const renderBothLayout = () => (
        <div className="both-layout">
            <div className="left-panel">
                {renderCheckForm()}
                {renderReportForm()}
            </div>
            <div className="right-panel">
                {renderCheckResults()}
            </div>
        </div>
    );

    const renderContent = () => {
  switch (layoutMode) {
    case 'check-result':
      return (
        <div className="stacked-layout">
          {renderCheckForm()}        {/* URL Check Form */}
          {renderCheckResults()}     {/* ✅ Results come right below it */}
          {renderJobAnalyzer()}      {/* ✅ Job Analyzer stays below results */}
        </div>
      );

    case 'both':
      return (
        <div className="stacked-layout">
          {renderCheckForm()}
          {renderCheckResults()}
          {renderReportForm()}
          {renderJobAnalyzer()}
        </div>
      );

    case 'report-result':
      return (
        <div className="stacked-layout">
          {renderCheckForm()}
          {renderReportForm()}
          {renderJobAnalyzer()}
        </div>
      );

    default:
      return (
        <div className="stacked-layout">
          {renderCheckForm()}
          {renderJobAnalyzer()}
        </div>
      );
  }
};


    return (
        <div id="check-report-page" className="page active">
            <div className="page-content-wrapper">
                <section className="section">
                    <div className="container">
                        {renderContent()}
                    </div>
                </section>
            </div>

            {/* Safety conflict confirmation dialog */}
            {showSafetyConflictModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3><i className="fas fa-exclamation-triangle"></i> Safety Conflict Detected</h3>
                        </div>
                        <div className="modal-body">
                            <p>Our AI analysis indicates this URL appears to be legitimate:</p>
                            
                            {safetyCheckData?.aiCheck && (
                                <div className="conflict-info">
                                    <p><strong>AI Analysis:</strong> Our AI model indicates this URL appears to be legitimate ({(safetyCheckData.aiCheck.confidence * 100).toFixed(1)}% confidence).</p>
                                    <p><strong>Safety Score:</strong> {safetyCheckData.aiCheck.safety_score}/100</p>
                                    <p><strong>Risk Level:</strong> {safetyCheckData.aiCheck.risk_level}</p>
                                </div>
                            )}
                            
                            <p>Do you still want to report this URL as suspicious?</p>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="btn btn-secondary" 
                                onClick={handleSafetyConflictCancel}
                                disabled={reportLoading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-primary" 
                                onClick={handleSafetyConflictConfirm}
                                disabled={reportLoading}
                            >
                                {reportLoading ? 'Reporting...' : 'Yes, Report Anyway'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheckReportPage;
