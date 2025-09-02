import axios from 'axios';
import API_CONFIG, { getApiUrl } from '../config/api';

// Create Axios Instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// API服务类
class ApiService {
  // Check URL Safety
  static async checkUrl(url) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.CHECK_URL, {
        search: url
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Report Dangerous URL
  static async reportUrl(url, threat) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.REPORT_URL, {
        url: url,
        threat: threat
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Query All Links
  static async queryAllLinks(params = {}) {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.QUERY_ALL_LINKS, params);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error Handling
  static handleError(error) {
    if (error.response) {
      // Server Responded with Error Status Code
      const { status, data } = error.response;
      return {
        message: data?.message || `Server error: ${status}`,
        status: status,
        data: data
      };
    } else if (error.request) {
      // Request Sent but No Response
      return {
        message: 'Network error: Unable to connect to server',
        status: 0,
        data: null
      };
    } else {
      // Other Errors
      return {
        message: error.message || 'Unknown error occurred',
        status: 0,
        data: null
      };
    }
  }

  // Test Connection
  static async testConnection() {
    try {
      const response = await apiClient.get('/api/v1/health');
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }
}

export default ApiService;
