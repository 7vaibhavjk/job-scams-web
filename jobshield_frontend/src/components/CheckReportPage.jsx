import React, { useState, useEffect } from "react";
import ApiService from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./CheckReportPage.css";

const AnimatedHighlightedText = ({ text, phrases = [], verdict }) => {
  const [html, setHtml] = useState("");
  const escapeReg = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  useEffect(() => {
    if (!text) return;
    if (!phrases?.length) {
      setHtml(text);
      return;
    }

    let highlighted = text;
    phrases.forEach(({ phrase }) => {
      const regex = new RegExp(escapeReg(phrase), "gi");
      highlighted = highlighted.replace(
        regex,
        `<span class="highlighted">${phrase}</span>`
      );
    });
    setHtml(highlighted);
  }, [text, phrases]);

  return (
    <div
      className="highlighted-text"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const sanitizeText = (input) => {
  if (!input) return input;
  const patterns = [
    { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, label: "[EMAIL]" },
    { regex: /\+?\d[\d\s-]{8,}\d/g, label: "[PHONE]" },
    { regex: /\bhttps?:\/\/[^\s]+/gi, label: "[URL]" },
  ];
  let result = input;
  patterns.forEach(({ regex, label }) => (result = result.replace(regex, label)));
  return result;
};

function CheckReportPage({ onNavigate }) {
  const [jobPosition, setJobPosition] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobText, setJobText] = useState("");
  const [urlToCheck, setUrlToCheck] = useState("");
  const [jobResult, setJobResult] = useState(null);
  const [checkResult, setCheckResult] = useState(null);
  const [displayText, setDisplayText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const analyzeAll = async () => {
    if (!jobText.trim() && !urlToCheck.trim()) return;

    const sanitized = sanitizeText(jobText);
    setDisplayText(sanitized);
    setLoading(true);

    try {
      const jobPromise = ApiService.analyzeJobAd(sanitized);
      const urlPromise = urlToCheck ? ApiService.checkUrl(urlToCheck) : null;
      const [jobResponse, urlResponse] = await Promise.all([
        jobPromise,
        urlPromise,
      ]);

      if (jobResponse?.data) setJobResult(jobResponse.data);
      if (urlResponse?.data) setCheckResult(urlResponse.data);
      setShowReport(true);
    } catch (err) {
      console.error(err);
      setJobResult({ Verdict: "Error", Message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallScore = () => {
    const jobScore = jobResult?.Score || 0;
    const urlScore = checkResult?.aiCheck?.safety_score || 0;
    if (jobScore && urlScore) return Math.round((jobScore + urlScore) / 2);
    return jobScore || urlScore || 0;
  };

  const overallScore = calculateOverallScore();

  const getScoreColor = (score) => {
    if (score >= 80) return "#16a34a";
    if (score >= 50) return "#facc15";
    return "#dc2626";
  };

  const resetForm = () => {
    setShowReport(false);
    setJobResult(null);
    setCheckResult(null);
    setJobText("");
    setUrlToCheck("");
  };

  return (
    <div className="page-wrapper">
      {!showReport && (
        <>
          <section className="intro-section">
            <h1>AI Job & Website Safety Analyzer</h1>
            <p className="intro-desc">
              Instantly verify job advertisements and their related websites using AI-powered
              analysis. Detect scams, phishing attempts, and suspicious phrasing in seconds.
            </p>

            <div className="feature-badges">
              <span>✅ Real-time AI Analysis</span>
              <span>🧠 Phrase Highlighting</span>
              <span>🌐 Website Reputation Check</span>
            </div>
          </section>

          <motion.div
            className="analyzer-card compact"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="form-grid">
              <div className="input-group">
                <label>Job Position</label>
                <input
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  placeholder="e.g., Data Entry Clerk"
                />
              </div>
              <div className="input-group">
                <label>Company Name</label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Horizon Solutions"
                />
              </div>
            </div>

            <div className="input-group full">
              <label>Job Advertisement Text</label>
              <textarea
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste the job description here..."
                style={{ resize: "vertical" }}
                rows={5}
              />
            </div>

            <div className="input-group full">
              <label>Related Website (optional)</label>
              <input
                type="url"
                value={urlToCheck}
                onChange={(e) => setUrlToCheck(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <button
              className="analyze-btn"
              disabled={loading}
              onClick={analyzeAll}
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </motion.div>
        </>
      )}

      {showReport && (
        <AnimatePresence>
          <motion.div
            className="report-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="report-header">
              <div className="gauge-container">
                <CircularProgressbar
                  value={overallScore}
                  text={`${overallScore}`}
                  strokeWidth={10}
                  styles={buildStyles({
                    textColor: "#1e3a8a",
                    pathColor: getScoreColor(overallScore),
                    trailColor: "#e5e7eb",
                  })}
                />
                <p className="gauge-label">Overall Safety Score</p>
              </div>

              <button className="reset-btn" onClick={resetForm}>
                🔄 Analyze Again
              </button>
            </div>

            <div className="report-body">
              {/* Job Ad Section */}
              {jobResult && (
                <div className="report-card job-section">
                  <h2>
                    🧾 Job Ad Analysis —{" "}
                    <span
                      className={
                        jobResult.Verdict?.includes("FAKE")
                          ? "danger-text"
                          : "safe-text"
                      }
                    >
                      {jobResult.Verdict}
                    </span>
                  </h2>
                  <div className="score-bar">
                    <div
                      className={`score-fill ${
                        jobResult.Verdict?.includes("FAKE")
                          ? "danger"
                          : "safe"
                      }`}
                      style={{ width: `${jobResult.Score || 0}%` }}
                    />
                  </div>
                  <AnimatedHighlightedText
                    text={displayText}
                    phrases={jobResult["Important Phrases"]}
                    verdict={jobResult.Verdict}
                  />
                  {jobResult["Important Phrases"]?.length > 0 && (
                    <div className="phrase-tags">
                      {jobResult["Important Phrases"].map((p, i) => (
                        <span key={i} className="phrase-tag">
                          {p.phrase}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Website Analysis Section */}
              {checkResult?.aiCheck && (
                <div className="report-card web-section">
                  <h2>🌐 Website Analysis</h2>
                  <div className="badge-row">
                    <span className="info-badge">
                      Prediction:{" "}
                      <strong>
                        {checkResult.aiCheck.prediction.charAt(0).toUpperCase() +
                          checkResult.aiCheck.prediction.slice(1)}
                      </strong>
                    </span>
                    <span className="info-badge">
                      Confidence:{" "}
                      <strong>
                        {(checkResult.aiCheck.confidence * 100).toFixed(1)}%
                      </strong>
                    </span>
                    <span
                      className={`info-badge ${
                        checkResult.aiCheck.risk_level.toLowerCase()
                      }`}
                    >
                      Risk Level:{" "}
                      <strong>
                        {checkResult.aiCheck.risk_level.charAt(0).toUpperCase() +
                          checkResult.aiCheck.risk_level.slice(1)}
                      </strong>
                    </span>
                  </div>

                  <details>
                    <summary>View Technical Details</summary>
                    <ul className="details-list">
                      <li>
                        Phishing Probability:{" "}
                        {(checkResult.aiCheck.probabilities?.phishing * 100).toFixed(1)}%
                      </li>
                      <li>
                        Legitimate Probability:{" "}
                        {(checkResult.aiCheck.probabilities?.legitimate * 100).toFixed(1)}%
                      </li>
                      <li>Safety Score: {checkResult.aiCheck.safety_score}/100</li>
                      <li>Risk Level: {checkResult.aiCheck.risk_level}</li>
                    </ul>
                  </details>
                </div>
              )}

              {/* Database Records Section */}
              {checkResult?.basicCheck && (
                <div className="report-card db-section">
                  <h2>🗂️ Database Records</h2>
                  {checkResult.basicCheck.totalCount > 0 ? (
                    <details>
                      <summary>
                        {checkResult.basicCheck.totalCount} record(s) found
                      </summary>
                      <ul className="record-list">
                        {checkResult.basicCheck.linkDataList?.map((l, idx) => (
                          <li key={idx}>
                            <strong>{l.url}</strong> — {l.status} ({l.threat})
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <p>No records found in public threat databases.</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default CheckReportPage;
