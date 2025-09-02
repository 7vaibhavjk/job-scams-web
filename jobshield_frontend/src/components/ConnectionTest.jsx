import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

function ConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  const testConnection = async () => {
    setConnectionStatus('checking');
    try {
      // Try to call a simple API to test the connection
      const response = await ApiService.checkUrl('http://example.com');
      setConnectionStatus('connected');
      setLastChecked(new Date().toLocaleTimeString());
    } catch (error) {
      setConnectionStatus('disconnected');
      setLastChecked(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return '#2e7d32'; // green
      case 'disconnected':
        return '#d32f2f'; // red
      case 'checking':
        return '#f57f17'; // orange
      default:
        return '#666';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return '✅ Backend Connected';
      case 'disconnected':
        return '❌ Backend Disconnected';
      case 'checking':
        return '🔄 Checking Connection...';
      default:
        return '❓ Unknown Status';
    }
  };

  if (!isVisible) {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setIsVisible(true)}
          style={{
            padding: '8px 12px',
            fontSize: '12px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: '#f5f5f5',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
          }}
          title="Show connection status"
        >
          🔗
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      padding: '10px 15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      border: `2px solid ${getStatusColor()}`,
      zIndex: 1000,
      fontSize: '14px',
      fontFamily: 'monospace'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <div style={{ color: getStatusColor(), fontWeight: 'bold' }}>
          {getStatusText()}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            padding: '2px 6px',
            fontSize: '10px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#999'
          }}
          title="Hide connection status"
        >
          ✕
        </button>
      </div>
      {lastChecked && (
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
          Last checked: {lastChecked}
        </div>
      )}
      <button
        onClick={testConnection}
        style={{
          padding: '4px 8px',
          fontSize: '12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          background: '#f5f5f5',
          cursor: 'pointer'
        }}
      >
        Retest
      </button>
    </div>
  );
}

export default ConnectionTest;
