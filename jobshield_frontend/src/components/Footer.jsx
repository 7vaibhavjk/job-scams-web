import React from 'react';

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Protegrad</h3>
            <p>Protegrad is a non-profit project aimed at helping job seekers identify and avoid online job scams.</p>
          </div>

          <div className="footer-section">
            <h3>Official Data Sources</h3>
            <a href="https://www.scamwatch.gov.au/" target="_blank" rel="noopener noreferrer">Scamwatch</a>
            <a href="https://www.abs.gov.au/" target="_blank" rel="noopener noreferrer">Australian Bureau of Statistics</a>
            <a href="https://www.accc.gov.au/" target="_blank" rel="noopener noreferrer">Australian Competition and Consumer Commission</a>
          </div>

          <div className="footer-section">
            <h3>Need Help?</h3>
            <p>If you believe you have been a victim of a job scam, contact your bank immediately and report to ACCC.</p>
          </div>
        </div>

        <div className="copyright">
          <p>&copy; 2025 Protegrad Australia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
