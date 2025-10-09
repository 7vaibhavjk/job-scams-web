import React, { useState } from 'react';

function NewsPage({ onNavigate }) {
    const [expandedNews, setExpandedNews] = useState({});

    // 澳大利亚诈骗相关新闻数据
    const newsData = [
        {
            id: 1,
            title: "ACCC Warns of Surge in Job Scam Cases Across Australia",
            image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            summary: "The Australian Competition and Consumer Commission (ACCC) reports a 42% increase in job scam cases in 2024, with victims losing an average of over $15,000 AUD.",
            content: "According to the ACCC's latest Job Scam Report 2024, job scam cases in Australia have shown a dramatic upward trend. The report reveals that in the first three quarters of this year, over 15,000 job scam reports were received nationwide, representing a 42% increase compared to the same period last year.\n\nMain scam types include:\n• Fake job opportunity scams\n• Advance fee fraud\n• Identity theft scams\n• Remote work scams\n\nVictims are primarily concentrated in the 18-35 age group, with an average loss of $15,200 AUD. The ACCC reminds job seekers to remain vigilant and avoid providing personal information or making payments to unverified employers.",
            link: "https://www.accc.gov.au",
            date: "2024-12-15",
            category: "Official Warning"
        },
        {
            id: 2,
            title: "NSW Police Bust Major Job Scam Ring Worth $2 Million",
            image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            summary: "New South Wales Police successfully dismantled a job scam syndicate targeting job seekers through fake recruitment advertisements, involving over $2 million AUD in fraudulent transactions.",
            content: "After a six-month investigation, NSW Police successfully dismantled a job scam syndicate targeting job seekers. The syndicate created fake recruitment websites and social media accounts, posting high-salary job opportunities to lure job seekers into paying so-called 'training fees' and 'background check fees'.\n\nPolice conducted simultaneous raids in Sydney, Melbourne, and Brisbane, arresting 12 suspects and seizing large amounts of electronic equipment and bank accounts. It is estimated that the syndicate has defrauded over 500 victims, involving more than $2 million AUD.\n\nThe head of NSW Police Cybercrime Unit stated this is one of the largest job scam cases cracked in recent years. Police remind the public that legitimate employers do not require job seekers to pay any fees in advance.",
            link: "https://www.police.nsw.gov.au",
            date: "2024-12-10",
            category: "Law Enforcement"
        },
        {
            id: 3,
            title: "Australian Banks Launch Joint Anti-Scam Measures",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            summary: "Australia's four major banks announce joint anti-scam measures including real-time transaction monitoring, intelligent risk assessment, and 24-hour customer support to protect job seekers from fraud.",
            content: "Commonwealth Bank (CBA), Westpac, ANZ, and National Australia Bank (NAB) jointly announced the launch of specialized anti-scam measures targeting job fraud.\n\nNew measures include:\n• Real-time transaction monitoring systems that automatically identify suspicious job-related transfers\n• Intelligent risk assessment algorithms analyzing transaction patterns and amounts\n• 24-hour professional customer service teams providing instant consultation and assistance\n• Information sharing mechanisms with ACCC and police\n\nBanks will also launch specialized job seeker protection programs, providing victims with rapid fund recovery services and psychological support. These measures are expected to help reduce job scam losses by over 30%.",
            link: "https://www.ausbanking.org.au",
            date: "2024-12-08",
            category: "Industry News"
        },
        {
            id: 4,
            title: "Australian Government Allocates $50M to Combat Cyber Scams",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            summary: "The Australian Federal Government announces $50 million AUD funding to combat cyber scams, with $20 million specifically allocated to protect job seekers through national scam alert systems and victim support services.",
            content: "The Australian Federal Government announced a $50 million AUD anti-scam investment plan aimed at strengthening cybersecurity protection, particularly protecting job seekers from scam victimization.\n\nThe investment plan includes:\n• $20 million AUD for establishing a national job scam alert system\n• $15 million AUD for victim support services and psychological counseling\n• $10 million AUD for law enforcement technology upgrades\n• $5 million AUD for public education and awareness campaigns\n\nThe government will also collaborate with technology companies to develop AI systems for identifying and blocking scam websites. These measures are expected to help reduce job scam cases by over 50% in the next two years.",
            link: "https://www.ag.gov.au",
            date: "2024-12-05",
            category: "Policy & Regulation"
        },
    ];

    const toggleNewsExpansion = (newsId) => {
        setExpandedNews(prev => ({
            ...prev,
            [newsId]: !prev[newsId]
        }));
    };

    const handleViewData = () => {
        // 跳转到trends页面，但保持当前页面状态
        onNavigate('trends');
    };

    return (
        <div id="news-page" className="page active">
            <div className="page-content-wrapper">
                <section className="section">
                    <div className="container">
                        <a
                            href="#"
                            className="back-btn"
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigate('home');
                            }}
                        >
                            <i className="fas fa-arrow-left"></i> Back to Home
                        </a>

                        <h2 className="section-title">News & Insights</h2>
                        <p className="section-subtitle">
                            Stay informed about the latest scam trends and protection measures in Australia
                        </p>

                        {/* 新闻模块 */}
                        <div className="news-section">
                            <h3 className="news-section-title">
                                <i className="fas fa-newspaper"></i> Latest News
                            </h3>
                            <div className="news-grid">
                                {newsData.map((news) => (
                                    <div key={news.id} className="news-card">
                                        <div className="news-image">
                                            <img src={news.image} alt={news.title} />
                                            <div className="news-category">{news.category}</div>
                                        </div>
                                        <div className="news-content">
                                            <h4 className="news-title">{news.title}</h4>
                                            <p className="news-summary">{news.summary}</p>
                                            <div className="news-meta">
                                                <span className="news-date">
                                                    <i className="fas fa-calendar"></i> {news.date}
                                                </span>
                                            </div>
                                            <div className="news-actions">
                                                <button
                                                    className="btn btn-outline"
                                                    onClick={() => toggleNewsExpansion(news.id)}
                                                >
                                                    {expandedNews[news.id] ? 'Show Less' : 'Read More'}
                                                </button>
                                                <a
                                                    href={news.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-primary"
                                                >
                                                    <i className="fas fa-external-link-alt"></i> View Source
                                                </a>
                                            </div>
                                            {expandedNews[news.id] && (
                                                <div className="news-expanded">
                                                    <div className="news-full-content">
                                                        {news.content.split('\n').map((paragraph, index) => (
                                                            <p key={index}>{paragraph}</p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 数据模块 */}
                        <div className="data-section">
                            <div className="data-card">
                                <div className="data-content">
                                    <h3 className="data-title">
                                        <i className="fas fa-chart-line"></i> Scam Data & Analytics
                                    </h3>
                                    <p className="data-description">
                                        Explore comprehensive scam statistics, trends, and insights based on real data from Australian authorities and our community reports.
                                    </p>
                                    <div className="data-features">
                                        <div className="feature-item">
                                            <i className="fas fa-check-circle"></i>
                                            <span>Real-time scam statistics</span>
                                        </div>
                                        <div className="feature-item">
                                            <i className="fas fa-check-circle"></i>
                                            <span>Interactive charts and graphs</span>
                                        </div>
                                        <div className="feature-item">
                                            <i className="fas fa-check-circle"></i>
                                            <span>State-by-state analysis</span>
                                        </div>
                                        <div className="feature-item">
                                            <i className="fas fa-check-circle"></i>
                                            <span>Trend analysis and predictions</span>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-primary btn-large"
                                        onClick={handleViewData}
                                    >
                                        <i className="fas fa-chart-bar"></i> View Scam Trends
                                    </button>
                                </div>
                                <div className="data-image">
                                    <img 
                                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                                        alt="Data Analytics" 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default NewsPage;
