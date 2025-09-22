import React from 'react';

function Header({ currentPage, onNavigate, isFullAccess }) {
    return (
        <header>
            <div className="container header-content">
                <div className="logo-container">
                    <div 
                        className="logo"
                        style={{ cursor: "pointer" }} // optional: makes it look clickable
                        onClick={(e) => {
                            e.preventDefault();
                            onNavigate('home');
                        }}
                    >
                        <h1>Protegrad</h1>
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
                                        className={currentPage === 'ChatAssistant' ? 'active' : ''}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onNavigate('ChatAssistant');
                                        }}
                                    >
                                        Chat Assistant
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
