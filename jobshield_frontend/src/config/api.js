// API Configuration File
const API_CONFIG = {
    // Backend API Base URL
    BASE_URL: process.env.REACT_APP_API_URL || 'http://13.211.253.6:8003',

    // API Endpoints
    ENDPOINTS: {
        // URL Check Related
        CHECK_URL: '/api/v1/link/check/check',
        QUERY_ALL_LINKS: '/api/v1/link/check/query/all',
        RECORDS: '/api/v1/record/query',

        // Report Related
        REPORT_URL: '/api/v1/report/portal/add'
    },

    // Request Timeout (milliseconds)
    TIMEOUT: 60000,

    // Request Headers Configuration
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

// Create Complete API URL
export const getApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Export Configuration
export default API_CONFIG;
