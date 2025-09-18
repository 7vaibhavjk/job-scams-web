// Content script for additional protection
(function() {
  'use strict';
  
  // Intercept clicks on links
  document.addEventListener('click', async function(event) {
    // Check if protection is enabled
    const result = await chrome.storage.sync.get(['protectionEnabled']);
    const isEnabled = result.protectionEnabled !== false;
    
    if (!isEnabled) return;
    
    const link = event.target.closest('a');
    if (!link || !link.href) return;
    
    // Skip internal links and non-http(s) links
    if (link.href.startsWith('#') || 
        link.href.startsWith('javascript:') ||
        link.href.startsWith('mailto:') ||
        link.href.startsWith('tel:') ||
        link.href.startsWith(window.location.origin)) {
      return;
    }
    
    // Skip if opening in new tab (user choice)
    if (event.ctrlKey || event.metaKey || event.shiftKey || link.target === '_blank') {
      return;
    }
    
    // For potentially dangerous links, show a quick check
    const url = link.href;
    
    // Skip common safe domains (optional optimization)
    const safeDomains = [
      'google.com', 'youtube.com', 'wikipedia.org', 'github.com', 
      'stackoverflow.com', 'reddit.com', 'twitter.com', 'facebook.com',
      'linkedin.com', 'amazon.com', 'apple.com', 'microsoft.com'
    ];
    
    const domain = new URL(url).hostname.replace('www.', '');
    if (safeDomains.some(safeDomain => domain.endsWith(safeDomain))) {
      return;
    }
    
    // Prevent default navigation for suspicious links
    event.preventDefault();
    
    try {
      // Show loading indicator
      showLoadingIndicator();
      
      // Quick check for this specific URL
      const response = await fetch('https://url-checker-api-2.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url })
      });
      
      hideLoadingIndicator();
      
      if (!response.ok) {
        // If API fails, allow navigation
        window.location.href = url;
        return;
      }
      
      const data = await response.json();
      
      // If safe, navigate normally
      if (!data.is_phishing && data.risk_level !== 'high' && data.safety_score >= 70) {
        window.location.href = url;
      } else {
        // Show warning
        showLinkWarning(url, data);
      }
      
    } catch (error) {
      console.error('Error checking link:', error);
      hideLoadingIndicator();
      // If error occurs, allow navigation
      window.location.href = url;
    }
  }, true);
  
  function showLoadingIndicator() {
    const loader = document.createElement('div');
    loader.id = 'url-checker-loader';
    loader.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      background: #007bff !important;
      color: white !important;
      padding: 10px 20px !important;
      border-radius: 25px !important;
      z-index: 999999 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 14px !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
    `;
    
    loader.innerHTML = `
      <div style="
        width: 16px !important;
        height: 16px !important;
        border: 2px solid rgba(255,255,255,0.3) !important;
        border-radius: 50% !important;
        border-top-color: white !important;
        animation: spin 1s linear infinite !important;
      "></div>
      Checking URL safety...
    `;
    
    // Add spinning animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(loader);
  }
  
  function hideLoadingIndicator() {
    const loader = document.getElementById('url-checker-loader');
    if (loader) {
      loader.remove();
    }
  }
  
  function showLinkWarning(url, data) {
    const getRiskColor = (riskLevel) => {
      switch(riskLevel) {
        case 'low': return '#28a745';
        case 'medium': return '#ffc107';
        case 'high': return '#dc3545';
        default: return '#6c757d';
      }
    };
    
    // Remove any existing warning
    const existingWarning = document.getElementById('link-safety-warning');
    if (existingWarning) {
      existingWarning.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'link-safety-warning';
    modal.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: rgba(0, 0, 0, 0.9) !important;
      z-index: 999999999 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    `;
    
    modal.innerHTML = `
      <div style="
        background: white !important;
        padding: 30px !important;
        border-radius: 12px !important;
        max-width: 500px !important;
        max-height: 80vh !important;
        overflow-y: auto !important;
        text-align: center !important;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
        position: relative !important;
      ">
        <div style="font-size: 40px !important; margin-bottom: 15px !important;">🔗⚠️</div>
        <h2 style="color: #dc3545 !important; margin: 0 0 20px 0 !important; font-size: 24px !important;">
          Suspicious Link Detected
        </h2>
        
        <div style="
          background: ${getRiskColor(data.risk_level)} !important;
          color: white !important;
          padding: 15px !important;
          border-radius: 8px !important;
          margin: 15px 0 !important;
        ">
          <h3 style="margin: 0 0 8px 0 !important; font-size: 20px !important;">
            Safety Score: ${data.safety_score}/100
          </h3>
          <p style="margin: 0 !important; font-size: 16px !important; text-transform: capitalize;">
            ${data.prediction} - ${data.risk_level.toUpperCase()} Risk
          </p>
        </div>
        
        <div style="
          background: #f8f9fa !important;
          padding: 12px !important;
          border-radius: 6px !important;
          margin: 15px 0 !important;
          text-align: left !important;
          font-size: 14px !important;
        ">
          <strong>Destination:</strong><br>
          <span style="word-break: break-all !important; color: #007bff !important; font-family: monospace !important;">
            ${url}
          </span>
        </div>
        
        <p style="color: #666 !important; font-size: 14px !important; margin: 15px 0 !important;">
          This link may lead to a dangerous website. Are you sure you want to continue?
        </p>
        
        <div style="display: flex !important; gap: 10px !important; justify-content: center !important; flex-wrap: wrap !important;">
          <button onclick="window.location.href='${url}'; document.getElementById('link-safety-warning').remove();" style="
            padding: 10px 20px !important;
            background: #dc3545 !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 500 !important;
          ">
            Continue Anyway
          </button>
          <button onclick="document.getElementById('link-safety-warning').remove();" style="
            padding: 10px 20px !important;
            background: #28a745 !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            font-weight: 500 !important;
          ">
            Stay Safe
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Remove modal when clicking outside
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
})();