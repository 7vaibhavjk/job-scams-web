import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-section">
          <h3>About Protegrad</h3>
          <p>
            Protegrad is a non-profit project helping job seekers identify and avoid online job scams.
          </p>
        </div>

        <div className="footer-section">
          <h3>Official Data Sources</h3>
          <ul>
            <li>
              <a href="https://www.scamwatch.gov.au/" target="_blank" rel="noopener noreferrer">
                Scamwatch
              </a>
            </li>
            <li>
              <a href="https://www.abs.gov.au/" target="_blank" rel="noopener noreferrer">
                Australian Bureau of Statistics
              </a>
            </li>
            <li>
              <a href="https://www.accc.gov.au/" target="_blank" rel="noopener noreferrer">
                Australian Competition and Consumer Commission
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Need Help?</h3>
          <p>
            If you believe you’ve been a victim of a job scam, contact your bank immediately and report it to the ACCC.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
