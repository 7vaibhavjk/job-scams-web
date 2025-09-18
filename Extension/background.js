// Service Worker for Chrome Extension
let protectionEnabled = true;
const checkedUrls = new Map(); // Cache for checked URLs

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ protectionEnabled: true });
});

// Load protection state on startup
chrome.storage.sync.get(['protectionEnabled']).then((result) => {
  protectionEnabled = result.protectionEnabled !== false;
});

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.protectionEnabled) {
    protectionEnabled = changes.protectionEnabled.newValue;
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleProtection') {
    protectionEnabled = request.enabled;
  }
});

// Check URL before navigation
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  // Only check main frame navigations, not iframes
  if (details.frameId !== 0) return;
  
  // Skip if protection is disabled
  if (!protectionEnabled) return;
  
  const url = details.url;
  
  // Skip system pages and extensions
  if (url.startsWith('chrome://') || 
      url.startsWith('chrome-extension://') || 
      url.startsWith('moz-extension://') ||
      url.startsWith('about:') ||
      url.startsWith('file://')) {
    return;
  }
  
  // Skip if we recently checked this URL
  if (checkedUrls.has(url) && Date.now() - checkedUrls.get(url).timestamp < 300000) { // 5 minutes cache
    const cachedResult = checkedUrls.get(url);
    if (cachedResult.data.is_phishing || cachedResult.data.risk_level === 'high') {
      // Still show warning for dangerous sites even if cached
      showWarning(details.tabId, url, cachedResult.data);
    }
    return;
  }
  
  try {
    // Check the URL
    const response = await fetch('https://url-checker-api-2.onrender.com/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url })
    });
    
    if (!response.ok) {
      console.error('API request failed:', response.status);
      return;
    }
    
    const data = await response.json();
    
    // Cache the result
    checkedUrls.set(url, {
      data: data,
      timestamp: Date.now()
    });
    
    // Show warning if the site is dangerous
    if (data.is_phishing || data.risk_level === 'high' || data.safety_score < 50) {
      showWarning(details.tabId, url, data);
    }
    
  } catch (error) {
    console.error('Error checking URL:', error);
  }
});

// Show warning overlay
function showWarning(tabId, url, data) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: displayWarningOverlay,
    args: [url, data]
  }).catch(err => {
    console.error('Failed to inject warning script:', err);
  });
}

// Function to be injected into the page
function displayWarningOverlay(url, data) {
  // Remove any existing warning
  const existingWarning = document.getElementById('url-safety-warning');
  if (existingWarning) {
    existingWarning.remove();
  }
  
  const getRiskColor = (riskLevel) => {
    switch(riskLevel) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#dc3545';
      default: return '#6c757d';
    }
  };
  
  // Create warning overlay
  const overlay = document.createElement('div');
  overlay.id = 'url-safety-warning';
  overlay.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: rgba(0, 0, 0, 0.95) !important;
    z-index: 999999999 !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    font-size: 16px !important;
    color: #333 !important;
  `;
  
  overlay.innerHTML = `
    <div style="
      background: white !important;
      padding: 40px !important;
      border-radius: 16px !important;
      max-width: 600px !important;
      max-height: 80vh !important;
      overflow-y: auto !important;
      text-align: center !important;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
    ">
      <div style="font-size: 48px !important; margin-bottom: 20px !important;">⚠️</div>
      <h1 style="color: #dc3545 !important; margin: 0 0 20px 0 !important; font-size: 28px !important;">
        WARNING: Potentially Dangerous Site
      </h1>
      
      <div style="
        background: ${getRiskColor(data.risk_level)} !important;
        color: white !important;
        padding: 20px !important;
        border-radius: 12px !important;
        margin: 20px 0 !important;
      ">
        <h2 style="margin: 0 0 10px 0 !important; font-size: 24px !important;">
          Safety Score: ${data.safety_score}/100
        </h2>
        <p style="margin: 0 !important; font-size: 18px !important; text-transform: capitalize;">
          ${data.prediction} - ${data.risk_level.toUpperCase()} Risk
        </p>
        <p style="margin: 10px 0 0 0 !important; font-size: 14px !important;">
          Confidence: ${Math.round(data.confidence * 100)}%
        </p>
      </div>
      
      <div style="
        background: #f8f9fa !important;
        padding: 15px !important;
        border-radius: 8px !important;
        margin: 20px 0 !important;
        text-align: left !important;
      ">
        <strong>URL:</strong><br>
        <span style="word-break: break-all !important; color: #007bff !important; font-family: monospace !important;">
          ${url}
        </span>
      </div>
      
      ${data.summary_reasons.length > 0 ? `
        <div style="text-align: left !important; margin: 20px 0 !important;">
          <h3 style="margin: 0 0 10px 0 !important; color: #333 !important;">Reasons for Warning:</h3>
          <ul style="margin: 0 !important; padding-left: 20px !important;">
            ${data.summary_reasons.map(reason => `<li style="margin: 5px 0 !important;">${reason}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      <div style="
        display: flex !important;
        gap: 15px !important;
        justify-content: center !important;
        margin-top: 30px !important;
        flex-wrap: wrap !important;
      ">
        <button onclick="document.getElementById('url-safety-warning').remove()" style="
          padding: 12px 24px !important;
          background: #28a745 !important;
          color: white !important;
          border: none !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          font-size: 16px !important;
          font-weight: 500 !important;
          transition: background 0.3s !important;
        " onmouseover="this.style.background='#218838'" onmouseout="this.style.background='#28a745'">
          ✓ Continue Anyway
        </button>
        
        <button onclick="window.history.back()" style="
          padding: 12px 24px !important;
          background: #6c757d !important;
          color: white !important;
          border: none !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          font-size: 16px !important;
          font-weight: 500 !important;
          transition: background 0.3s !important;
        " onmouseover="this.style.background='#545b62'" onmouseout="this.style.background='#6c757d'">
          ← Go Back
        </button>
        
        <button onclick="window.location.href='https://google.com'" style="
          padding: 12px 24px !important;
          background: #007bff !important;
          color: white !important;
          border: none !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          font-size: 16px !important;
          font-weight: 500 !important;
          transition: background 0.3s !important;
        " onmouseover="this.style.background='#0056b3'" onmouseout="this.style.background='#007bff'">
          🏠 Go to Google
        </button>
      </div>
      
      <p style="
        margin: 20px 0 0 0 !important;
        font-size: 12px !important;
        color: #666 !important;
        line-height: 1.4 !important;
      ">
        This warning was generated by URL Safety Checker extension based on automated analysis.
        Please exercise caution when proceeding.
      </p>
    </div>
  `;
  
  // Prevent body scroll when overlay is shown
  document.body.style.overflow = 'hidden';
  
  // Add event listener to restore scroll when overlay is removed
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
        for (let node of mutation.removedNodes) {
          if (node.id === 'url-safety-warning') {
            document.body.style.overflow = '';
            observer.disconnect();
            break;
          }
        }
      }
    });
  });
  
  observer.observe(document.body, { childList: true });
  
  document.body.appendChild(overlay);
}

// Clean up old cached URLs periodically
setInterval(() => {
  const now = Date.now();
  for (const [url, data] of checkedUrls.entries()) {
    if (now - data.timestamp > 3600000) { // Remove entries older than 1 hour
      checkedUrls.delete(url);
    }
  }
}, 600000); // Run every 10 minutes