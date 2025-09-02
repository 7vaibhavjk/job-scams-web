import React from 'react';

function HomePage({ onNavigate }) {
  return (
    <div id="home-page" className="page active">
      <section className="hero">
        <div className="hero-content">
          <h2>Protecting Job Seekers from Online Scams</h2>
          <p>JobShield helps you identify fraudulent job postings and protect your personal information</p>
          <a 
            href="#" 
            className="btn" 
            onClick={(e) => {
              e.preventDefault();
              onNavigate('check');
            }}
          >
            Check URL Safety
          </a>
          <a 
            href="#" 
            className="btn btn-outline" 
            onClick={(e) => {
              e.preventDefault();
              onNavigate('trends');
            }}
          >
            View Scam Trends
          </a>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">How JobShield Protects You</h2>
          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>URL Safety Check</h3>
              <p>Verify the safety of job posting URLs before applying to avoid phishing sites and scams.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-flag"></i>
              </div>
              <h3>Report Suspicious Listings</h3>
              <p>Help protect others by reporting suspicious job postings and websites.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <h3>Scam Trend Analysis</h3>
              <p>Stay informed about the latest job scam trends and patterns.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">Job Scam Statistics</h2>
          <p className="section-subtitle">Understanding the scale of job scams helps us protect more people</p>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">73%</div>
              <div className="stat-label">of job seekers encounter suspicious postings</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">$2B+</div>
              <div className="stat-label">lost to job scams annually</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">42%</div>
              <div className="stat-label">increase in job scams since 2020</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">1 in 5</div>
              <div className="stat-label">job seekers have been targeted by scammers</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card">
            <h2 className="section-title">Stay Protected with JobShield</h2>
            <p className="section-subtitle">Join thousands of job seekers who use JobShield to verify job postings and avoid scams</p>

            <div style={{textAlign: 'center', marginTop: '30px'}}>
              <a 
                href="#" 
                className="btn" 
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('check');
                }}
              >
                Check a URL Now
              </a>
              <a 
                href="#" 
                className="btn btn-outline" 
                style={{borderColor: 'var(--blue)', color: 'var(--blue)'}}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('report');
                }}
              >
                Report a Scam
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
