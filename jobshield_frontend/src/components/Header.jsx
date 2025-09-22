import React, { useState } from 'react';

function Header({ currentPage, onNavigate, isFullAccess }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      <div className="container header-content">
        <div className="logo-container">
          <div
            className="logo"
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              e.preventDefault();
              onNavigate('home');
              setMenuOpen(false);
            }}
          >
            <h1>Protegrad</h1>
          </div>
        </div>

        {/* Hamburger button */}
        <button
          className={`menu-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={menuOpen ? 'open' : ''}>
          <ul>
            <li>
              <a
                href="#"
                className={currentPage === 'home' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); onNavigate('home'); setMenuOpen(false); }}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className={currentPage === 'check' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); onNavigate('check'); setMenuOpen(false); }}
              >
                Check URL
              </a>
            </li>
            <li>
              <a
                href="#"
                className={currentPage === 'report' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); onNavigate('report'); setMenuOpen(false); }}
              >
                Report Scam
              </a>
            </li>
            <li>
              <a
                href="#"
                className={currentPage === 'trends' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); onNavigate('trends'); setMenuOpen(false); }}
              >
                Scam Trends
              </a>
            </li>

            {isFullAccess && (
              <>
                <li>
                  <a
                    href="#"
                    className={currentPage === 'education' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); onNavigate('education'); setMenuOpen(false); }}
                  >
                    Educational Cognition
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={currentPage === 'ChatAssistant' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); onNavigate('ChatAssistant'); setMenuOpen(false); }}
                  >
                    Chat Assistant
                  </a>
                </li>
              </>
            )}

            <li>
              <a
                href="#"
                className={currentPage === 'extension' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); onNavigate('extension'); setMenuOpen(false); }}
              >
                Extension
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
