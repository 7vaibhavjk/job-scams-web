import React, { useState } from 'react';
import ApiService from '../services/api';

const SOURCE_LABELS = {
    source_kaggle: 'PhiUSIIL Phishing URL Dataset',
    source_urlhaus: 'URLHaus',
    source_openphish: 'OpenPhish',
};

const formatSourceName = (code) => (code && SOURCE_LABELS[code]) || code || 'unknown';

function CheckReportPage({ onNavigate }) {
    // URL检查相关状态
    const [urlToCheck, setUrlToCheck] = useState('');
    const [checkResult, setCheckResult] = useState(null);
    const [checkLoading, setCheckLoading] = useState(false);
    const [linkDataList, setLinkDataList] = useState([]);
    const [aiCheckData, setAiCheckData] = useState(null);
    const [basicCheckData, setBasicCheckData] = useState(null);
    const [urlError, setUrlError] = useState('');
    
    // 举报相关状态
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
    
    // 布局状态
    const [layoutMode, setLayoutMode] = useState('normal'); // 'normal', 'check-result', 'report-result', 'both'

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

    // URL校验函数
    const validateUrl = (url) => {
        if (!url.trim()) {
            return 'Please enter a URL';
        }
        
        // 基本的URL格式校验
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

    // Threat Type联想数据
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

    // 处理Threat Type输入变化
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

    // 选择建议项
    const selectSuggestion = (suggestion) => {
        setScamType(suggestion);
        setShowSuggestions(false);
        setThreatTypeSuggestions([]);
    };

    // 检查安全冲突
    const checkSafetyConflict = (checkData) => {
        if (!checkData) return false;

        const { aiCheck } = checkData;

        // 只有AI模型显示链接是安全的，才需要确认
        const isAISafe = aiCheck && !aiCheck.is_phishing && aiCheck.prediction === 'legitimate';
        
        return isAISafe;
    };

    // 处理安全冲突确认
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

    // 处理安全冲突取消
    const handleSafetyConflictCancel = () => {
        setShowSafetyConflictModal(false);
        setSafetyCheckData(null);
        setReportLoading(false);
    };

    const checkUrl = async () => {
        // 校验URL格式
        const urlValidationError = validateUrl(urlToCheck);
        if (urlValidationError) {
            setUrlError(urlValidationError);
            return;
        }
        
        setUrlError(''); // 清除之前的错误

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
            console.log('API Response Data:', apiData); // 调试日志

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

            // 切换到检查结果布局
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
        // 校验举报URL格式
        const reportUrlValidationError = validateUrl(urlToReport);
        if (reportUrlValidationError) {
            setReportUrlError(reportUrlValidationError);
            return;
        }
        
        if (!scamType) {
            setReportError('Please describe the threat type');
            return;
        }
        
        setReportUrlError(''); // 清除URL错误

        setReportLoading(true);
        setReportSuccess(false);
        setReportError('');

        try {
            // 先调用Check Safety接口检查链接状态
            console.log('Checking URL safety before reporting...');
            const checkResponse = await ApiService.checkUrl(urlToReport);
            
            if (checkResponse && checkResponse.data) {
                const checkData = checkResponse.data;
                console.log('Safety check result:', checkData);
                
                // 检查是否需要确认
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
            // 安全检查失败不影响举报流程，继续执行
        }

        try {
            const response = await ApiService.reportUrl(urlToReport, scamType);

            if (response && response.code === 'Success') {
                setReportSuccess(true);
                setUrlToReport('');
                setScamType('');
                
                // 切换到举报结果布局
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
                            setUrlError(''); // 清除错误信息
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
                            // 如果已经有检查结果，切换到both模式
                            if (layoutMode === 'check-result') {
                                setLayoutMode('both');
                            } else {
                                // 否则切换到report模式
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
                            setReportUrlError(''); // 清除错误信息
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
                                // 延迟隐藏，让用户有时间点击建议项
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

                {/* Common Job Scam Types 选择器 */}
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
                return renderSplitLayout();
            case 'report-result':
                return renderMainContent();
            case 'both':
                return renderBothLayout();
            default:
                return renderMainContent();
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

            {/* 安全冲突确认对话框 */}
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
