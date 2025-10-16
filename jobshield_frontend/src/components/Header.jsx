import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header({ isFullAccess }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo → navigate to homepage */}
        <Link to="/" className="project-logo" aria-label="Go to Home" onClick={() => setIsMenuOpen(false)}>
          <img src="/project-logo.png" alt="Protegrad logo" />
        </Link>

        {/* Mobile menu toggle */}
        <button
          className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="main-nav"
        >
          <span></span><span></span><span></span>
        </button>

        {/* Navigation */}
        <nav id="main-nav" className={`main-nav ${isMenuOpen ? 'open' : ''}`} aria-label="Primary">
          <ul>
            <li>
              <Link
                to="/analyze"
                className={pathname === '/analyze' ? 'active' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                Analyze
              </Link>
            </li>

            <li>
              <Link
                to="/trends"
                className={pathname === '/trends' ? 'active' : ''}
                onClick={() => setIsMenuOpen(false)}
              >
                Trends
              </Link>
            </li>

            {isFullAccess && (
              <>
                <li>
                  <Link
                    to="/education"
                    className={pathname === '/education' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Education and Awareness
                  </Link>
                </li>
                <li>
                  <Link
                    to="/support"
                    className={pathname === '/support' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Support Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/extension"
                    className={pathname === '/extension' ? 'active' : ''}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Extension
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
