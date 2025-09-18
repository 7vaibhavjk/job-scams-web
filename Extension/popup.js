document.addEventListener('DOMContentLoaded', async function() {
  const checkCurrentBtn = document.getElementById('checkCurrentUrl');
  const checkUrlBtn = document.getElementById('checkUrlBtn');
  const urlInput = document.getElementById('urlInput');
  
  // Check current URL button
  checkCurrentBtn.addEventListener('click', async function() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        alert('Cannot check system pages');
        return;
      }
      
      checkCurrentBtn.disabled = true;
      checkCurrentBtn.textContent = 'Checking...';
      
      const response = await checkURL(tab.url);
      showResults(response, tab.url);
      
    } catch (error) {
      console.error('Error checking URL:', error);
      alert('Error checking URL. Please try again.');
    } finally {
      checkCurrentBtn.disabled = false;
      checkCurrentBtn.textContent = 'Check Current Page';
    }
  });
  
  // Check custom URL button
  checkUrlBtn.addEventListener('click', async function() {
    const url = urlInput.value.trim();
    
    if (!url) {
      alert('Please enter a URL to check');
      return;
    }
    
    // Basic URL validation
    try {
      const urlObj = new URL(url);
      if (!urlObj.protocol.startsWith('http')) {
        alert('Please enter a valid HTTP or HTTPS URL');
        return;
      }
    } catch (error) {
      alert('Please enter a valid URL (e.g., https://example.com)');
      return;
    }
    
    try {
      checkUrlBtn.disabled = true;
      checkUrlBtn.textContent = 'Checking...';
      
      const response = await checkURL(url);
      showResults(response, url);
      
    } catch (error) {
      console.error('Error checking URL:', error);
      alert('Error checking URL. Please try again.');
    } finally {
      checkUrlBtn.disabled = false;
      checkUrlBtn.textContent = 'Check URL';
    }
  });
  
  // Allow Enter key to submit URL
  urlInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      checkUrlBtn.click();
    }
  });
});

async function checkURL(url) {
  const response = await fetch('https://url-checker-api-2.onrender.com/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: url })
  });
  
  if (!response.ok) {
    throw new Error('API request failed');
  }
  
  return await response.json();
}

function showResults(data, url) {
  // Create and show results modal
  const modal = document.createElement('div');
  modal.id = 'results-modal';
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;
  
  const getRiskColor = (riskLevel) => {
    switch(riskLevel) {
      case 'low': return '#28a745';
      case 'medium': return '#ffc107';
      case 'high': return '#dc3545';
      default: return '#6c757d';
    }
  };
  
  const closeModal = () => {
    modal.remove();
  };
  
  const visitSite = () => {
    chrome.tabs.create({ url: url });
    closeModal();
  };
  
  modal.innerHTML = `
    <div style="background: white; padding: 30px; border-radius: 12px; max-width: 500px; max-height: 80vh; overflow-y: auto; position: relative;">
      <button id="close-btn" style="position: absolute; top: 15px; right: 15px; border: none; background: none; font-size: 24px; cursor: pointer; color: #999; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">&times;</button>
      
      <h2 style="margin: 0 0 20px 0; color: #333;">URL Safety Report</h2>
      
      <div style="background: ${getRiskColor(data.risk_level)}; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0; font-size: 24px;">Safety Score: ${data.safety_score}/100</h3>
        <p style="margin: 0; font-size: 18px; text-transform: capitalize;">${data.prediction} - ${data.risk_level} Risk</p>
        <p style="margin: 5px 0 0 0; font-size: 14px;">Confidence: ${Math.round(data.confidence * 100)}%</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <strong>URL:</strong> <span style="word-break: break-all; color: #007bff;">${url}</span>
      </div>
      
      ${data.feature_analysis && data.feature_analysis.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #333;">Feature Analysis:</h4>
          <div style="max-height: 200px; overflow-y: auto;">
            ${data.feature_analysis.map(feature => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; border-bottom: 1px solid #eee;">
                <span style="font-weight: 500;">${feature.feature}</span>
                <span style="color: ${getRiskColor(feature.risk_level)}; font-size: 12px; text-transform: uppercase;">${feature.risk_level}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${data.summary_reasons && data.summary_reasons.length > 0 ? `
        <div style="margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #333;">Summary:</h4>
          <ul style="margin: 0; padding-left: 20px;">
            ${data.summary_reasons.map(reason => `<li>${reason}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button id="visit-btn" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
          Visit Site
        </button>
        <button id="close-btn-2" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
          Close
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners
  modal.querySelector('#close-btn').addEventListener('click', closeModal);
  modal.querySelector('#close-btn-2').addEventListener('click', closeModal);
  modal.querySelector('#visit-btn').addEventListener('click', visitSite);
  
  // Close modal when clicking outside
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}