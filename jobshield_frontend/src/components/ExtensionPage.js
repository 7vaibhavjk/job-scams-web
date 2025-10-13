import React from "react";
import { FaDownload, FaCogs, FaFolderOpen, FaCheckCircle, FaChrome } from "react-icons/fa";

function ExtensionPage() {
  return (
    <div id="extension-page" className="page active">
      <div className="page-content-wrapper">

        {/* Hero Section */}
        <section className="hero extension-hero full-bleed">
          <div className="hero-content centered">
            <h2>Protegrad Browser Extension</h2>
            <p>
              Take control of your online safety — instantly detect and block fraudulent job links directly in your browser.
            </p>
            <a
              href="https://drive.google.com/file/d/1OAwSRMe6Ks1-kq0lhwobQihFU8F_aMqF/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
            >
              <FaDownload style={{ marginRight: "8px" }} />
              Download Extension (ZIP)
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="section extension-features">
          <div className="container">
            <h2 className="features-title">Extension Highlights</h2>
            <div className="feature-cards">
              <div className="feature-card">
                <div className="feature-icon"><i className="fas fa-search"></i></div>
                <h3>Instant URL Checking</h3>
                <p>Get real-time safety scores for job links before you click.</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"><i className="fas fa-lock"></i></div>
                <h3>Data Protection</h3>
                <p>Safeguards your sensitive details by detecting phishing attempts early.</p>
              </div>

              <div className="feature-card">
  <div className="feature-icon"><i className="fas fa-briefcase"></i></div>
  <h3>Analyze Job Ads</h3>
  <p>
    Paste or scan job postings to instantly detect fraudulent offers and protect your data.
  </p>
</div>

            </div>
          </div>
        </section>

        {/* Setup Instructions Section */}
        <section className="section setup-instructions">
          <div className="container">
            <h2 className="features-title">How to Set It Up</h2>
            <p className="setup-subtitle">Follow these quick steps to install Protegrad manually in Chrome.</p>
            <div className="setup-steps">
              <div className="setup-step">
                <FaDownload className="step-icon" />
                <h4>1. Download ZIP</h4>
                <p>Click the button above to download the Protegrad extension ZIP file.</p>
              </div>

              <div className="setup-step">
                <FaFolderOpen className="step-icon" />
                <h4>2. Extract ZIP</h4>
                <p>Unzip the downloaded file to a safe location on your computer.</p>
              </div>

              <div className="setup-step">
                <FaChrome className="step-icon" />
                <h4>3. Open Chrome Extensions</h4>
                <p>Go to <strong>chrome://extensions/</strong> and enable <strong>Developer Mode</strong>.</p>
              </div>

              <div className="setup-step">
                <FaCogs className="step-icon" />
                <h4>4. Load Unpacked</h4>
                <p>Click <strong>“Load unpacked”</strong> and select the unzipped Protegrad folder.</p>
              </div>

              <div className="setup-step">
                <FaCheckCircle className="step-icon" />
                <h4>5. Done!</h4>
                <p>Protegrad is now active. You’ll see the icon in your Chrome toolbar.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default ExtensionPage;
