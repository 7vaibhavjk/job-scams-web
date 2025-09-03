# API Configuration Guide

## Environment Variables Configuration

Create a `.env` file in the project root directory with the following configuration:

```bash
# Backend API server address
REACT_APP_API_URL=http://13.211.253.6:8003

# Application configuration
REACT_APP_NAME=JobShield
REACT_APP_VERSION=1.0.0

# Development environment configuration
REACT_APP_DEBUG=true
```

## Backend API Endpoints

### 1. URL Security Check
- **Endpoint**: `POST /api/v1/link/check/check`
- **Request Body**: `{ "search": "https://example.com" }`
- **Response**: Contains URL security status and detailed information

### 2. Report Dangerous URL
- **Endpoint**: `POST /api/v1/report/portal/add`
- **Request Body**: `{ "url": "https://example.com", "threat": "phishing" }`
- **Response**: Operation result status

### 3. Query All Links
- **Endpoint**: `POST /api/v1/link/check/query/all`
- **Request Body**: Query parameters
- **Response**: Link list

## Startup Instructions

### Backend Startup
```bash
cd jobshield_backend
go run cmd/main.go
```

### Frontend Startup
```bash
cd jobshield_frontend
npm install
npm start
```

## Connection Testing

1. Ensure the backend service is running on `http://localhost:8003`
2. Frontend will automatically connect to the backend API
3. You can view API request logs in the browser developer tools
