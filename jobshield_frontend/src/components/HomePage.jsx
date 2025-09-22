import React from 'react';

function HomePage({ onNavigate }) {
  return (
    <div id="home-page" className="page active">
      <section className="hero">
        <div className="hero-content">
          <h2>Protecting Job Seekers from Online Scams</h2>
          <p>Protegrad helps you identify fraudulent job postings and protect your personal information</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* New heading above the feature cards */}
          <h2 className="features-title">Explore Our Features</h2>

          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>URL Safety Check</h3>
              <p>Verify the safety of job posting URLs before applying to avoid phishing sites and scams.</p>
              <button 
                className="feature-btn"
                onClick={() => onNavigate('check')}
              >
                Go to URL Safety Check
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-flag"></i>
              </div>
              <h3>Report Suspicious Listings</h3>
              <p>Help protect others by reporting suspicious job postings and websites.</p>
              <button 
                className="feature-btn"
                onClick={() => onNavigate('report')}
              >
                Report a Scam
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Scam Trend Analysis</h3>
              <p>Stay informed about the latest job scam trends and patterns.</p>
              <button 
                className="feature-btn"
                onClick={() => onNavigate('trends')}
              >
                View Scam Trends
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
