import React from 'react';

function Header({ currentPage, onNavigate }) {
  return (
    <header>
      <div className="container header-content">
        <div className="logo-container">
          <div className="team-logo">
            <img src="/project-logo.png" alt="Team Logo" />
          </div>
          <div className="logo">
            <h1>JobShield</h1>
          </div>
        </div>

        <nav role="navigation" aria-label="Primary">
          <ul>
            <li>
              <a
                href="#"
                className={currentPage === 'home' ? 'active' : ''}
                aria-current={currentPage === 'home' ? 'page' : undefined}
                onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
              >
                Home
              </a>
            </li>

            <li>
              <a
                href="#"
                className={currentPage === 'check' ? 'active' : ''}
                aria-current={currentPage === 'check' ? 'page' : undefined}
                onClick={(e) => { e.preventDefault(); onNavigate('check'); }}
              >
                Check URL
              </a>
            </li>

            <li>
              <a
                href="#"
                className={currentPage === 'report' ? 'active' : ''}
                aria-current={currentPage === 'report' ? 'page' : undefined}
                onClick={(e) => { e.preventDefault(); onNavigate('report'); }}
              >
                Report Scam
              </a>
            </li>

            <li>
              <a
                href="#"
                className={currentPage === 'trends' ? 'active' : ''}
                aria-current={currentPage === 'trends' ? 'page' : undefined}
                onClick={(e) => { e.preventDefault(); onNavigate('trends'); }}
              >
                Scam Trends
              </a>
            </li>

            {/* NEW: Assistant full-page tab */}
            <li>
              <a
                href="#"
                className={currentPage === 'assistant' ? 'active' : ''}
                aria-current={currentPage === 'assistant' ? 'page' : undefined}
                onClick={(e) => { e.preventDefault(); onNavigate('assistant'); }}
              >
                Assistant
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
