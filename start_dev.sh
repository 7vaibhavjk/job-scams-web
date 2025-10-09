#!/bin/bash

# JobShield Development Environment Startup Script
# This script starts both backend and frontend services

echo "🚀 Starting JobShield Development Environment..."

# Check if we're in the correct directory
if [ ! -d "jobshield_backend" ] || [ ! -d "jobshield_frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected structure:"
    echo "   ├── jobshield_backend/"
    echo "   ├── jobshield_frontend/"
    echo "   └── start_dev.sh"
    exit 1
fi

# Create environment variables file if it doesn't exist
if [ ! -f "jobshield_frontend/.env" ]; then
    echo "📝 Creating environment variables file..."
    cat > jobshield_frontend/.env << EOF
REACT_APP_API_URL=http://localhost:8003
REACT_APP_NAME=JobShield
REACT_APP_VERSION=1.0.0
REACT_APP_DEBUG=true
EOF
    echo "✅ Environment variables file created"
fi

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Error: Go is not installed or not in PATH"
    echo "   Please install Go 1.24+ from: https://golang.org/dl/"
    exit 1
fi

# Check Go version
GO_VERSION=$(go version | awk '{print $3}' | sed 's/go//')
echo "🔧 Go version: $GO_VERSION"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed or not in PATH"
    echo "   Please install Node.js 16+ from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "🌐 Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed or not in PATH"
    echo "   Please install npm from: https://nodejs.org/"
    exit 1
fi

# Install frontend dependencies if needed
echo "📦 Installing frontend dependencies..."
cd jobshield_frontend
if [ ! -d "node_modules" ]; then
    echo "   Installing npm packages..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install npm packages"
        exit 1
    fi
    echo "✅ Frontend dependencies installed"
else
    echo "✅ Frontend dependencies already installed"
fi
cd ..

# Start backend service
echo "🔧 Starting backend service..."
cd jobshield_backend
go run cmd/main.go &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend service to start..."
sleep 5

# Check if backend is running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ Backend service failed to start"
    exit 1
fi

# Check if backend is responding
if curl -s http://localhost:8003 > /dev/null 2>&1; then
    echo "✅ Backend service is running on http://localhost:8003"
else
    echo "⚠️  Backend service started but not responding yet"
fi

# Start frontend service
echo "🌐 Starting frontend service..."
cd jobshield_frontend
npm start &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
echo "⏳ Waiting for frontend service to start..."
sleep 10

# Check if frontend is running
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Frontend service failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Check if frontend is responding
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend service is running on http://localhost:3000"
else
    echo "⚠️  Frontend service started but not responding yet"
fi

echo ""
echo "🎉 JobShield Development Environment Started Successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8003"
echo "📊 API Docs: Check README_EN.md for API endpoints"
echo ""
echo "💡 Tips:"
echo "   • Press Ctrl+C to stop all services"
echo "   • Check browser console for frontend logs"
echo "   • Backend logs are displayed in this terminal"
echo "   • Connection status is shown in the top-right corner of the frontend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup INT TERM EXIT

# Wait for user to stop services
echo ""
echo "Press Ctrl+C to stop all services..."
wait
