import React, { useState } from 'react';

function Header({ currentPage, onNavigate, isFullAccess }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavClick = (page) => {
        onNavigate(page);
        setIsMenuOpen(false); // 关闭移动端菜单
    };

    return (
        <header>
            <div className="container header-content">
                <div className="logo-container">
                    <div className="team-logo">
                        <img src="/team-logo.png" alt="Team Logo" />
                    </div>
                    <div
                        className="logo"
                        style={{cursor: 'pointer'}}
                        onClick={(e) => {
                            e.preventDefault();
                            onNavigate('home');
                        }}
                    >
                        <h1>Protegrad</h1>
                    </div>
                </div>
                
                {/* 移动端菜单按钮 */}
                <button 
                    className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav className={isMenuOpen ? 'open' : ''}>
                    <ul>
                        <li>
                            <a
                                href="#"
                                className={currentPage === 'home' ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavClick('home');
                                }}
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={currentPage === 'check-report' ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavClick('check-report');
                                }}
                            >
                                Check & Report
                            </a>
                        </li>
                    <li>
                        <a
                            href="#"
                            className={currentPage === 'news' || currentPage === 'trends' ? 'active' : ''}
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavClick('news');
                            }}
                        >
                            News
                        </a>
                    </li>

                        {/* 只有在 full access 模式下才渲染 */}
                        {isFullAccess && (
                            <>
                                <li>
                                    <a
                                        href="#"
                                        className={currentPage === 'education' ? 'active' : ''}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavClick('education');
                                        }}
                                    >
                                        Educational Cognition
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={currentPage === 'ChatAssistant' ? 'active' : ''}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavClick('ChatAssistant');
                                        }}
                                    >
                                        Support Center
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={currentPage === 'ExtensionPage' ? 'active' : ''}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavClick('ExtensionPage');
                                        }}
                                    >
                                        ExtensionPage
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