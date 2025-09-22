import React from "react";

function ExtensionPage() {
  return (
    <div id="extension-page" className="page active">
      {/* Hero Section */}
      <section className="hero extension-hero">
        <div className="hero-content centered">
          <h2>Protegrad Browser Extension</h2>
          <p>
            Take control of your online safety. Our extension checks URLs,
            blocks malicious websites, and keeps you safe while browsing.
          </p>
          <a
            href="https://chrome.google.com/webstore"
            className="cta-btn"
          >
           Install Extension
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
              <p>
                Get real-time safety scores for job links before you click.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-lock"></i></div>
              <h3>Data Protection</h3>
              <p>
                Safeguards your sensitive details by detecting phishing attempts early.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-globe"></i></div>
              <h3>Safe Browsing</h3>
              <p>
                Navigate job portals and career sites with extra security checks.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ExtensionPage;
