import React from 'react';

function HomePage({ onNavigate }) {
  const handleDownloadExtension = () => {
    // 与ExtensionPage的Install Extension按钮效果一样，跳转到Chrome Web Store
    window.open('https://chrome.google.com/webstore', '_blank');
  };

  const handleSupport = () => {
    // 跳转到Support Center页面 (ChatAssistant)
    onNavigate('ChatAssistant');
  };

  const handleStartLearning = () => {
    onNavigate('education');
  };

  const handleViewTrends = () => {
    onNavigate('trends');
  };
    // 跳到“网址检测”页
  const handleCheckURL = () => {
    onNavigate && onNavigate('check'); // ✅ 改成 check（对应 CheckPage.jsx）
  };

    // 跳到“举报/报告”页
  const handleReportScams = () => {
    onNavigate && onNavigate('report');
  };

  return (
    <div id="home-page" className="page active">
      <div className="home-content-wrapper">
        <section className="hero-image-section">
        <div className="hero-image-container">
          <img 
            src="/9130 A2 - Page 1.png" 
            alt="Protegrad Background" 
            className="hero-background-image"
          />
          <div className="hero-content-overlay">
            <div className="hero-content">
              <h2 className="hero-title">
                Protecting <span className="green-text">Job Seekers</span><br />
                from Online Scams
              </h2>
              <p className="hero-subtitle">
                Protegrad helps you identify fraudulent job postings<br />
                and protect your personal information
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 标题部分 */}
      <section className="title-section">
        <div className="title-container">
          <h2 className="section-title">How Protegrad Protects You</h2>
        </div>
      </section>

      {/* 第二张卡片 */}
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
            <h2 className="second-card-title">Smart URL Protection</h2>
            <p className="second-card-description">
              By entering a website address, users can instantly check its safety status and receive clear risk alerts. 
              At the same time, they can report suspicious sites to enrich the shared database and help strengthen collective protection.
            </p>
            <div className="second-card-features">
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <span className="feature-text">One-click website safety check with instant results</span>
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <span className="feature-text">Report suspicious websites to build a community defense system</span>
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <span className="feature-text">Smart analysis + user collaboration for stronger protection</span>
              </div>
              <div className="second-card-actions">
                <button className="btn-check-url" onClick={handleCheckURL}>Check URL</button>
                <button className="btn-report-scams" onClick={handleReportScams}>Report Scams</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 第三张卡片 */}
      <section className="third-card-section">
        <div className="third-card-container">
          <div className="third-card-content">
            <h2 className="third-card-title">Support center</h2>
            <p className="third-card-description">
              With AI-powered support and seamless browser protection, Protegrad offers users real-time scam recovery 
              guidance and URL safety checks directly in the browser.
            </p>
            <div className="third-card-features">
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <span className="feature-text">AI assistant with step-by-step recovery tips</span>
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <span className="feature-text">One-click URL & page safety check</span>
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <span className="feature-text">Seamless prevention + response support</span>
              </div>
            </div>
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

      {/* 第四张卡片 */}
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
            <div className="fourth-card-features">
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <span className="feature-text">Gamified learning scenarios with immersive experience</span>
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <span className="feature-text">Instant feedback and risk alerts based on real-world cases</span>
              </div>
              <div className="feature-item">
                <span className="check-icon">✓</span>
                <span className="feature-text">Visualized progress and scoring to boost learning motivation</span>
              </div>
            </div>
            <div className="fourth-card-buttons">
              <button className="btn-start-learning" onClick={handleStartLearning}>Start Learning</button>
            </div>
          </div>
        </div>
      </section>

      {/* 第五张卡片 */}
      <section className="fifth-card-section">
        <div className="fifth-card-container">
          <div className="fifth-card-background">
            <img 
              src="/generated_world_map_aus.png" 
              alt="Job Scam Statistics" 
              className="fifth-card-bg-image"
            />
            <div className="fifth-card-overlay">
              <div className="fifth-card-content">
                <div className="fifth-card-header">
                  <h2 className="fifth-card-title">
                    Job'Scam <span className="green-text">Statistics</span>
                  </h2>
                  <p className="fifth-card-subtitle">
                    Understanding the scale of job scams helps us protect more people
                  </p>
                </div>
                
                <div className="fifth-card-stats">
                  <div className="stat-item">
                    <div className="stat-number">73%</div>
                    <div className="stat-description">of job seekers encounter suspicious postings</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">$2B+</div>
                    <div className="stat-description">lost to job scams annually</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">42%</div>
                    <div className="stat-description">increase in job scams since 2020</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">1in5</div>
                    <div className="stat-description">job seekers have been targeted by scammers</div>
                  </div>
                </div>
                
                <div className="fifth-card-button">
                  <button className="btn-view" onClick={handleViewTrends}>view</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}

export default HomePage;
