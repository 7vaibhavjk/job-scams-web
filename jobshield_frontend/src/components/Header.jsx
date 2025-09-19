import React from 'react';

function Header({ currentPage, onNavigate, isFullAccess }) {
    return (
        <header>
            <div className="container header-content">
                <div className="logo-container">
                    <div className="team-logo">
                        <img src="/team-logo.png" alt="Team Logo" />
                    </div>
                    <div className="logo">
                        <h1>JobShield</h1>
                    </div>
                </div>
                <nav>
                    <ul>
                        <li>
                            <a
                                href="#"
                                className={currentPage === 'home' ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onNavigate('home');
                                }}
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={currentPage === 'check' ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onNavigate('check');
                                }}
                            >
                                Check URL
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={currentPage === 'report' ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onNavigate('report');
                                }}
                            >
                                Report Scam
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className={currentPage === 'trends' ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onNavigate('trends');
                                }}
                            >
                                Scam Trends
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
                                            onNavigate('education');
                                        }}
                                    >
                                        Educational Cognition
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={currentPage === 'support' ? 'active' : ''}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onNavigate('support');
                                        }}
                                    >
                                        Support Center
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
