// import React, { useState } from 'react';

// function Header({ currentPage, onNavigate, isFullAccess }) {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);

//     const toggleMenu = () => {
//         setIsMenuOpen(!isMenuOpen);
//     };

//     const handleNavClick = (page) => {
//         onNavigate(page);
//         setIsMenuOpen(false); // 关闭移动端菜单
//     };

//     return (
//         <header>
//             <div className="logo-container">
//                 <div
//                     className="project-logo"
//                     role="button"
//                     tabIndex={0}
//                     style={{ cursor: 'pointer' }}
//                     onClick={(e) => {
//                     e.preventDefault();
//                     onNavigate('home');
//                     }}
//                     onKeyDown={(e) => {
//                     if (e.key === 'Enter' || e.key === ' ') {
//                         e.preventDefault();
//                         onNavigate('home');
//                     }
//                     }}
//                     aria-label="Go to Home"
//                 >
//                     <img
//                         src="/project-logo.png"
//                         alt="project-logo"
//                         style={{
//                         width: '140px',      // ← 调整宽度
//                         height: 'auto',      // 保持比例
//                         display: 'block'     // 避免图片下方留白
//                         }}
//                     />
//                 </div>
                
//                 {/* 移动端菜单按钮 */}
//                 <button 
//                     className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
//                     onClick={toggleMenu}
//                     aria-label="Toggle navigation menu"
//                 >
//                     <span></span>
//                     <span></span>
//                     <span></span>
//                 </button>

//                 <nav className={isMenuOpen ? 'open' : ''}>
//                     <ul>
//                         <li>
//                             <a
//                                 href="#"
//                                 className={currentPage === 'home' ? 'active' : ''}
//                                 onClick={(e) => {
//                                     e.preventDefault();
//                                     handleNavClick('home');
//                                 }}
//                             >
//                                 Home
//                             </a>
//                         </li>
//                         <li>
//                             <a
//                                 href="#"
//                                 className={currentPage === 'check-report' ? 'active' : ''}
//                                 onClick={(e) => {
//                                     e.preventDefault();
//                                     handleNavClick('check-report');
//                                 }}
//                             >
//                                 Check & Report
//                             </a>
//                         </li>
//                     <li>
//                         <a
//                             href="#"
//                             className={currentPage === 'trends' ? 'active' : ''}
//                             onClick={(e) => {
//                                 e.preventDefault();
//                                 handleNavClick('trends');
//                             }}
//                         >
//                             Trends
//                         </a>
//                     </li>

//                         {/* 只有在 full access 模式下才渲染 */}
//                         {isFullAccess && (
//                             <>
//                                 <li>
//                                     <a
//                                         href="#"
//                                         className={currentPage === 'education' ? 'active' : ''}
//                                         onClick={(e) => {
//                                             e.preventDefault();
//                                             handleNavClick('education');
//                                         }}
//                                     >
//                                         Educational Cognition
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a
//                                         href="#"
//                                         className={currentPage === 'ChatAssistant' ? 'active' : ''}
//                                         onClick={(e) => {
//                                             e.preventDefault();
//                                             handleNavClick('ChatAssistant');
//                                         }}
//                                     >
//                                         Support Center
//                                     </a>
//                                 </li>
//                                 <li>
//                                     <a
//                                         href="#"
//                                         className={currentPage === 'ExtensionPage' ? 'active' : ''}
//                                         onClick={(e) => {
//                                             e.preventDefault();
//                                             handleNavClick('ExtensionPage');
//                                         }}
//                                     >
//                                         ExtensionPage
//                                     </a>
//                                 </li>
//                             </>
//                         )}
//                     </ul>
//                 </nav>
//             </div>
//         </header>
//     );
// }

// export default Header;

import React, { useState } from 'react';

function Header({ currentPage, onNavigate, isFullAccess }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavClick = (page) => {
    onNavigate(page);
    setIsMenuOpen(false); // close mobile menu after navigation
  };

  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo → navigate to homepage */}
        <a
          href="/"
          className="project-logo"
          onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onNavigate('home');
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Go to Home"
        >
          <img src="/project-logo.png" alt="Protegrad logo" />
        </a>

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

        {/* Right-side nav (no Home, no News, keep Trends) */}
        <nav id="main-nav" className={`main-nav ${isMenuOpen ? 'open' : ''}`} aria-label="Primary">
          <ul>
            <li>
              <a
                href="#"
                className={currentPage === 'check-report' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNavClick('check-report'); }}
              >
                Check&Report
              </a>
            </li>

            <li>
              <a
                href="#"
                className={currentPage === 'trends' ? 'active' : ''}
                onClick={(e) => { e.preventDefault(); handleNavClick('trends'); }}
              >
                Trends
              </a>
            </li>

            {isFullAccess && (
              <>
                <li>
                  <a
                    href="#"
                    className={currentPage === 'education' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); handleNavClick('education'); }}
                  >
                    Educational Cognition
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={currentPage === 'ChatAssistant' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); handleNavClick('ChatAssistant'); }}
                  >
                    Support Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className={currentPage === 'ExtensionPage' ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); handleNavClick('ExtensionPage'); }}
                  >
                    Extension
                  </a>
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
