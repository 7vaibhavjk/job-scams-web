import React from "react";

function ExtensionPage() {
  return (
    <div id="extension-page" className="page active">
      {/* Hero Section */}
      <section className="hero extension-hero">
        <div className="hero-content">
          <h2>Protegrad Browser Extension</h2>
          <p>
            Take control of your online safety. Our extension checks URLs,
            blocks malicious websites, and warns you before it’s too late.
          </p>
          <a
            href="https://chrome.google.com/webstore" // replace with actual link
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn"
          >
            Install Extension
          </a>
        </div>
        <div className="hero-image">
          <img src="/extension-preview.png" alt="Protegrad Extension Preview" />
        </div>
      </section>

      {/* Features Section */}
      <section className="section extension-features">
        <div className="container">
          <h2 className="features-title">Why Use the Extension?</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-search"></i></div>
              <h3>Instant URL Checking</h3>
              <p>
                Get real-time safety scores for job links before you click.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-ban"></i></div>
              <h3>Block Unsafe Sites</h3>
              <p>
                Prevent scams and phishing attempts by blocking risky websites automatically.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-bell"></i></div>
              <h3>Smart Alerts</h3>
              <p>
                Get notified instantly if a page looks suspicious or dangerous.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><i className="fas fa-user-shield"></i></div>
              <h3>Privacy First</h3>
              <p>
                Protects your personal information while browsing job sites safely.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ExtensionPage;
