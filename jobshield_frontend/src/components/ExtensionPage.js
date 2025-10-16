import React, { useState, useEffect } from "react";
import {
  FaChrome,
  FaSearch,
  FaLock,
  FaExclamationTriangle,
  FaBolt,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import "./ExtensionPage.css";

function ExtensionPage() {
  const STORE_URL =
    "https://chromewebstore.google.com/detail/ehdbmciejphjjdolmdbfphhidkbgibjb?utm_source=item-share-cb";

  const screenshots = [
    "/images/protegrad-1.png",
    "/images/protegrad-2.png",
    "/images/protegrad-3.png",
    "/images/protegrad-4.png",
  ];

  const [index, setIndex] = useState(0);


  const prev = () =>
    setIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  const next = () =>
    setIndex((prev) => (prev + 1) % screenshots.length);

  return (
    <div className="extension-page">
      {/* HERO */}
      <section className="extension-hero">
        <div className="hero-inner">
          <h1>Browser Extension</h1>
          <p>
            Instantly detect and block fraudulent job links directly in your browser.
            Stay safe while you search and apply.
          </p>

          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="chrome-store-btn"
          >
            <FaChrome className="chrome-colored" />
            Get it on Chrome Web Store
          </a>

          <div className="badges">
            <span className="badge darkblue">Free</span>
            <span className="badge teal">No sign-up</span>
            <span className="badge violet">Lightweight</span>
            <span className="badge gray">Privacy-first</span>
          </div>
        </div>
      </section>

      {/* FEATURES + INSTALL */}
      <section className="extension-body">
        <div className="features-section">
          <h2>What the extension helps you do</h2>
          <div className="feature-grid">
            <div className="feature">
              <FaSearch className="feature-icon blue" />
              <div>
                <h3>Instant URL Checking</h3>
                <p>Get real-time safety scores for job links before you click.</p>
              </div>
            </div>
            <div className="feature">
              <FaLock className="feature-icon teal" />
              <div>
                <h3>Data Protection</h3>
                <p>Safeguards your details by detecting phishing attempts early.</p>
              </div>
            </div>
            <div className="feature">
              <FaExclamationTriangle className="feature-icon red" />
              <div>
                <h3>Suspicious Phrase Alerts</h3>
                <p>Highlights risky phrases in job ads so you can spot scams easily.</p>
              </div>
            </div>
            <div className="feature">
              <FaBolt className="feature-icon yellow" />
              <div>
                <h3>Light & Fast</h3>
                <p>Runs quietly in the background without slowing your browser.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="install-section">
            <div className="install-card">
              <h2>How to Install</h2>
              <ul className="install-list">
                <li>
                  <FaChrome className="step-icon chrome" />
                  <div>
                    <strong>Visit the Chrome Web Store</strong>
                    <p>
                      Go to{" "}
                      <a href={STORE_URL} target="_blank" rel="noopener noreferrer">
                        Protegrad Extension
                      </a>.
                    </p>
                  </div>
                </li>
                <li>
                  <FaCheckCircle className="step-icon darkblue" />
                  <div>
                    <strong>Click “Add to Chrome”</strong>
                    <p>Confirm permissions and installation.</p>
                  </div>
                </li>
                <li>
                  <FaCheckCircle className="step-icon green" />
                  <div>
                    <strong>Done!</strong>
                    <p>The Protegrad icon appears in your Chrome toolbar.</p>
                  </div>
                </li>
              </ul>
            </div>
</div>

      </section>

      {/* CAROUSEL */}
<section className="carousel-section">
  <div className="carousel-wrapper">
      <button className="carousel-btn left" onClick={prev}>
        <FaChevronLeft />
      </button>
    <div className="carousel-track">
      {screenshots.map((src, i) => {
        const offset = (i - index + screenshots.length) % screenshots.length;
        let className = "carousel-item";
        if (offset === 0) className += " center";
        else if (offset === 1) className += " right";
        else if (offset === screenshots.length - 1) className += " left";
        return (
          <div key={i} className={className}>
            <img src={src} alt={`Screenshot ${i + 1}`} />
          </div>
        );
      })}
    </div>

        <button className="carousel-btn right" onClick={next}>
          <FaChevronRight />
        </button>
  </div>
</section>

    </div>
  );
}

export default ExtensionPage;
