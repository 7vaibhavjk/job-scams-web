import React, { useEffect, useRef } from 'react';
import './HomePage.css';

function HomePage({ onNavigate }) {
  const videoRef = useRef(null);

  // Respect reduced-motion preferences
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const vid = videoRef.current;
    if (!vid) return;

    const apply = () => {
      if (mq.matches) {
        vid.pause();
        vid.removeAttribute('autoplay');
        vid.currentTime = 0;
      } else {
        vid.setAttribute('autoplay', 'true');
        // Try to play if allowed by browser policy
        vid.play().catch(() => {});
      }
    };

    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  const handleDownloadExtension = () => {
    window.open('https://chrome.google.com/webstore', '_blank');
  };

  const handleSupport = () => {
    onNavigate('ChatAssistant');
  };

  const handleStartLearning = () => {
    onNavigate('education');
  };

  const handleCheckURL = () => {
    onNavigate && onNavigate('check');
  };

  const handleReportScams = () => {
    onNavigate && onNavigate('report');
  };

  const handleAnalyze = () => {
    onNavigate && onNavigate('check-report');
  };

  return (
    <div id="home-page" className="page active">
      <div className="home-content-wrapper">
        {/* ===== Hero: Video Background (Option 1) ===== */}
        <section
          className="hero-video-section"
          role="img"
          aria-label="Abstract cyber security circuit background video"
        >
          {/* Fallback poster shows immediately while video buffers */}
          <video
            ref={videoRef}
            className="hero-video"
            poster="/hero/protegrad-hero-poster.jpg"
            muted
            loop
            playsInline
            autoPlay
          >
            {/* Provide both sources for better compatibility */}
            <source src="/hero/protegrad-hero.webm" type="video/webm" />
            <source src="/hero/protegrad-hero.mp4" type="video/mp4" />
            {/* If video can't play, the poster + overlay still show */}
          </video>

          {/* Soft gradient overlay to improve text contrast */}
          <div className="hero-video-overlay" />

          {/* Your existing hero copy */}
          <div className="hero-video__content container">
            <h2 className="hero-title">
              Protecting <span className="green-text">Job Seekers</span>
              <br />
              from Online Scams
            </h2>
            <p className="hero-subtitle">
              Protegrad helps you identify fraudulent job postings
              <br />
              and protect your personal information
            </p>
            <div className="hero-cta">
              <div className="hero-cta-note" aria-hidden="true">Try our new feature - analyze a job ad or URL</div>
              <button className="btn-hero-analyze" onClick={handleAnalyze} aria-label="Analyze a job ad or URL">
                Analyze URL/Ad
              </button>
            </div>
          </div>
        </section>

        {/* What Protegrad Offers */}
        <section className="title-section">
          <div className="title-container">
            <h2 className="section-title">What Protegrad Offers</h2>
          </div>
        </section>

        {/* Smart URL Protection */}
        <section className="second-card-section">
          <div className="second-card-container">
            <div className="second-card-image">
              <img
                src="/green_web_float_loop.png"
                alt="Smart URL Protection"
                className="second-card-png"
              />
            </div>
            <div className="second-card-content">
              <h2 className="second-card-title">URL and Job Ad Checker</h2>
              <p className="second-card-description">
                By entering a website address or a job ad, users can instantly check its safety status and receive clear risk alerts.
                At the same time, they can report suspicious sites to enrich the shared database and help strengthen collective protection.
              </p>
              <div className="second-card-features">
                <div className="second-card-actions">
                  <button className="btn-check-url" onClick={handleCheckURL}>Analyze Url and Job Ads</button>
                  <button className="btn-report-scams" onClick={handleReportScams}>Report Scams</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Center */}
        <section className="third-card-section">
          <div className="third-card-container ">
            <div className="third-card-content">
              <h2 className="third-card-title">Support Center</h2>
              <p className="third-card-description">
                With AI-powered support and seamless browser protection, Protegrad offers users real-time scam recovery
                guidance and URL safety checks directly in the browser.
              </p>
              <div className="third-card-buttons">
                <button className="btn-download-extension" onClick={handleDownloadExtension}>Download Extension</button>
                <button className="btn-support" onClick={handleSupport}>Support</button>
              </div>
            </div>
            <div className="third-card-image">
              <img
                src="/chart_blue_whole_float.png"
                alt="Support Center"
                className="third-card-png"
              />
            </div>
          </div>
        </section>

        {/* Educational Cognition */}
        <section className="fourth-card-section">
          <div className="fourth-card-container">
            <div className="fourth-card-image">
              <img
                src="/education_module_float.gif"
                alt="Educational Cognition"
                className="fourth-card-gif"
              />
            </div>
            <div className="fourth-card-content">
              <h2 className="fourth-card-title">Educational Cognition</h2>
              <p className="fourth-card-description">
                Through adventure gameplay and interactive quizzes, users can identify scam scenarios and learn scam-prevention knowledge,
                combining fun with education to strengthen their ability to recognize and respond to job scams.
              </p>
              <div className="fourth-card-buttons">
                <button className="btn-start-learning" onClick={handleStartLearning}>Start Learning</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
