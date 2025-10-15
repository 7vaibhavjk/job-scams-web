import React, { useState, useEffect } from "react";
import ApiService from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./CheckReportPage.css";

const AnimatedHighlightedText = ({ text, phrases = [] }) => {
  const [html, setHtml] = useState("");
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  useEffect(() => {
    if (!text) return;
    if (!phrases?.length) {
      setHtml(text);
      return;
    }

    let result = text;
    phrases.forEach(({ phrase }) => {
      if (!phrase) return;
      const re = new RegExp(esc(phrase), "gi");
      result = result.replace(
        re,
        `<span class="hl-phrase">$&</span>`
      );
    });
    setHtml(result);
  }, [text, phrases]);

  return (
    <div
      className="hl-container"
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
  let out = input;
  patterns.forEach(({ regex, label }) => (out = out.replace(regex, label)));
  return out;
};

const colorForScore = (score) => {
  if (score >= 80) return "#16a34a";
  if (score >= 50) return "#2563eb";
  return "#dc2626";
};

function CheckReportPage() {
  const [jobPosition, setJobPosition] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobText, setJobText] = useState("");
  const [urlToCheck, setUrlToCheck] = useState("");
  const [jobResult, setJobResult] = useState(null);
  const [checkResult, setCheckResult] = useState(null);
  const [displayText, setDisplayText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportUrlInput, setReportUrlInput] = useState("");
  const [reportThreat, setReportThreat] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportError, setReportError] = useState("");
  const [reportLoading, setReportLoading] = useState(false);

  const analyzeAll = async () => {
    if (!jobText.trim() && !urlToCheck.trim()) return;

    const sanitized = sanitizeText(jobText);
    setDisplayText(sanitized);
    setLoading(true);

    try {
      const jobPromise = jobText.trim() ? ApiService.analyzeJobAd(sanitized) : null;
      const urlPromise = urlToCheck ? ApiService.checkUrl(urlToCheck) : null;

      const [jobRes, urlRes] = await Promise.all([jobPromise, urlPromise]);

      if (jobRes?.data) setJobResult(jobRes.data);
      if (urlRes?.data) setCheckResult(urlRes.data);
      setShowReport(true);
      // Prefill report URL input with the checked URL if available
      const autoUrl = urlRes?.data?.basicCheck?.linkDataList?.[0]?.url || urlToCheck || "";
      setReportUrlInput(autoUrl);
    } catch (err) {
      console.error(err);
      setJobResult({ Verdict: "Error", Message: err.message, Score: 0 });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowReport(false);
    setJobResult(null);
    setCheckResult(null);
    setJobText("");
    setUrlToCheck("");
    setReportUrlInput("");
    setReportThreat("");
    setReportSuccess(false);
    setReportError("");
    setReportLoading(false);
  };

  const jobScore = jobResult?.Score ?? 0;
  const webScore = checkResult?.aiCheck?.safety_score ?? 0;
  const overallScore =
    jobScore && webScore ? Math.round((jobScore + webScore) / 2) : Math.round(jobScore || webScore || 0);

  const isPhishing = !!checkResult?.aiCheck?.is_phishing;
  const jobVerdict = jobResult?.Verdict || "";
  const jobVerdictText = jobVerdict.includes("FAKE")
    ? "Unsafe - Proceed with Caution"
    : jobVerdict.includes("REAL")
    ? "Safe"
    : "";
  const webVerdictText = isPhishing ? "Unsafe - Phishing Detected" : "Safe";

  const gaugeStyles = (score) =>
    buildStyles({
      textColor: "#1e3a8a",
      pathColor: colorForScore(score),
      trailColor: "#e5e7eb",
    });

  const dbCount = checkResult?.basicCheck?.totalCount ?? 0;
  const firstDbUrl = checkResult?.basicCheck?.linkDataList?.[0]?.url || urlToCheck || "";

  const reasons = checkResult?.aiCheck?.summary_reasons?.join(", ") || "";

  const getPredictionBg = (pred, phishing) => {
    if (phishing || pred?.toLowerCase().includes("phishing") || pred?.toLowerCase().includes("malicious"))
      return "#fee2e2";
    if (pred?.toLowerCase().includes("legitimate") || pred?.toLowerCase().includes("safe"))
      return "#ffffff";
    return "#fef9c3";
  };

  const capitalizeFirst = (value) => {
    if (typeof value !== "string" || !value.length) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const submitReport = async () => {
    if (!reportUrlInput) {
      setReportError("Please enter a URL to report");
      return;
    }
    if (!reportThreat) {
      setReportError("Please describe the threat type");
      return;
    }

    setReportLoading(true);
    setReportSuccess(false);
    setReportError("");
    try {
      const response = await ApiService.reportUrl(reportUrlInput, reportThreat);
      if (response && response.code === "Success") {
        setReportSuccess(true);
        setReportThreat("");
      } else {
        setReportError(response?.message || "Failed to report the URL");
      }
    } catch (error) {
      setReportError(error.message || "An error occurred while reporting. Please try again later.");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      {!showReport && (
        <section className={`form-hero ${loading ? "dimmed" : ""}`}>
          <h1 className="app-title">AI Safety Analysis</h1>
          <p className="app-subtitle">
            Check job ads and websites for fraud, phishing, and other scams.
          </p>

          <div className="info-section">
            <p className="info-text">
              This tool uses advanced AI to detect fraudulent job listings and unsafe websites. 
              It analyzes both text and URLs to provide a complete safety report - including fake phrase detection, phishing likelihood, and database verification.
            </p>
            <div className="feature-badges">
              <div className="badge"><i className="fas fa-brain"></i> AI-Powered Analysis</div>
              <div className="badge"><i className="fas fa-globe"></i> Website Safety Scan</div>
              <div className="badge"><i className="fas fa-search"></i> Fraud Phrase Detection</div>
            </div>
          </div>

          <div className="form-card colored-card">
            <div className="grid-2">
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

            <div className="input-group">
              <label>Job Advertisement Text</label>
              <textarea
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste the job description here..."
                rows={5}
              />
            </div>

            <div className="input-group">
              <label>Related Website (optional)</label>
              <input
                type="url"
                value={urlToCheck}
                onChange={(e) => setUrlToCheck(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <button className="btn analyze" onClick={analyzeAll} disabled={loading}>
              {loading ? (
                <>
                  Analyzing <span className="spinner" />
                </>
              ) : (
                "Analyze"
              )}
            </button>
          </div>
        </section>
      )}

      {showReport && (
        <AnimatePresence>
          <motion.section
            className="report-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="report-head">
              <h1 className="report-title">AI Safety Analysis Report</h1>
              <button className="btn again" onClick={resetForm}>
                Analyze Again
              </button>
            </div>
            <p className="report-subtitle">
              Below is a comprehensive breakdown of both the job advertisement and related website safety assessments conducted by our AI models.
            </p>

            <div className="overall-gauge-wrap">
              <CircularProgressbar
                value={overallScore}
                text={`${overallScore}`}
                strokeWidth={10}
                styles={gaugeStyles(overallScore)}
              />
              <p className="gauge-label">Overall Safety Score</p>
            </div>

            {/* Job Section (only if analyzed) */}
            {jobResult && (
              <motion.div
                className="job-card colored-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h2>Job Advertisement Evaluation</h2>
                <div className="job-grid">
                  <div className="left small-gauge">
                    <CircularProgressbar
                      value={jobScore}
                      text={`${jobScore}`}
                      strokeWidth={10}
                      styles={gaugeStyles(jobScore)}
                    />
                    <p className="gauge-label">Job Ad Safety Score</p>
                    {jobVerdictText && (
                      <p className={`verdict ${jobVerdictText.includes("Safe") ? "safe" : "unsafe"}`}>
                        {jobVerdictText}
                      </p>
                    )}
                  </div>
                  <div className="right job-text-box">
                    <AnimatedHighlightedText
                      text={displayText}
                      phrases={jobResult?.["Important Phrases"]}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Website Section */}
            {checkResult?.aiCheck && (
              <motion.div
                className="web-card colored-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2>Website & Link Analysis</h2>
                <div className="web-layout">
                  <div className="left small-gauge">
                    <CircularProgressbar
                      value={webScore}
                      text={`${webScore}`}
                      strokeWidth={10}
                      styles={gaugeStyles(webScore)}
                    />
                    <p className="gauge-label">Website Safety Score</p>
                    <p className={`verdict ${isPhishing ? "unsafe" : "safe"}`}>
                      {webVerdictText}
                    </p>
                  </div>
                  <div className="right">
                    <div className="web-collage">
                      <div
                        className="tile prediction"
                        style={{
                          background: getPredictionBg(checkResult.aiCheck.prediction, isPhishing),
                        }}
                      >
                        <h3>Prediction</h3>
                        <p className={isPhishing ? "phish" : "safe"}>
                          {capitalizeFirst(checkResult.aiCheck.prediction)}
                        </p>
                      </div>
                      {reasons && (
                        <div className="tile">
                          <h3>Detection Reasons</h3>
                          <p>{reasons}</p>
                        </div>
                      )}
                      <div className="tile">
                        <h3>Risk Level</h3>
                        <p>{capitalizeFirst(checkResult.aiCheck.risk_level)}</p>
                      </div>
                      <div className="tile">
                        <h3>Phishing Probability</h3>
                        <p>{(checkResult.aiCheck.probabilities?.phishing * 100).toFixed(1)}%</p>
                      </div>
                      <div className="tile">
                        <h3>Legitimate Probability</h3>
                        <p>{(checkResult.aiCheck.probabilities?.legitimate * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Database Summary */}
            <motion.div
              className="db-card colored-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <h2>Database Records Summary</h2>
              {dbCount > 0 ? (
                <p>
                  Found <strong>{dbCount}</strong> related entries in public threat databases.
                </p>
              ) : (
                <p>No entries found in public threat databases.</p>
              )}
              {firstDbUrl && (
                <p className="url">
                  URL analyzed: <span>{firstDbUrl}</span>
                </p>
              )}
            </motion.div>

            {/* Report Submit Section */}
            <motion.div
              className="report-submit colored-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <h2>Submit a Report</h2>
              <p className="report-hint">Help protect others by reporting suspicious websites you encountered.</p>

              <div className="grid-2">
                <div className="input-group">
                  <label>URL to Report</label>
                  <input
                    type="url"
                    value={reportUrlInput}
                    placeholder="https://suspicious-site.com"
                    onChange={(e) => setReportUrlInput(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Threat Type</label>
                  <select
                    value={reportThreat}
                    onChange={(e) => setReportThreat(e.target.value)}
                  >
                    <option value="">Select a threat type...</option>
                    {[
                      "Phishing Scams",
                      "Advance Fee Scams",
                      "Identity Theft",
                      "Work-from-Home Scams",
                      "Fake Job Offers",
                      "Equipment Purchase Scams",
                      "Other types of fraud",
                    ].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button className="btn report" onClick={submitReport} disabled={reportLoading}>
                {reportLoading ? (
                  <>
                    Reporting <span className="spinner" />
                  </>
                ) : (
                  "Report Website"
                )}
              </button>

              {reportSuccess && (
                <div className="result-box safe">
                  <p>Thank you for your report! Your contribution helps protect the community.</p>
                </div>
              )}
              {reportError && (
                <div className="result-box danger">
                  <p>{reportError}</p>
                </div>
              )}
            </motion.div>
          </motion.section>
        </AnimatePresence>
      )}
    </div>
  );
}

export default CheckReportPage;
