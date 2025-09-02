@echo off
REM JobShield Development Environment Startup Script (Windows)
REM This script starts both backend and frontend services

echo 🚀 Starting JobShield Development Environment...

REM Check if we're in the correct directory
if not exist "jobshield_backend" (
    echo ❌ Error: Please run this script from the project root directory
    echo    Current directory: %CD%
    echo    Expected structure:
    echo    ├── jobshield_backend/
    echo    ├── jobshield_frontend/
    echo    └── start_dev.bat
    pause
    exit /b 1
)

if not exist "jobshield_frontend" (
    echo ❌ Error: Please run this script from the project root directory
    echo    Current directory: %CD%
    echo    Expected structure:
    echo    ├── jobshield_backend/
    echo    ├── jobshield_frontend/
    echo    └── start_dev.bat
    pause
    exit /b 1
)

REM Create environment variables file if it doesn't exist
if not exist "jobshield_frontend\.env" (
    echo 📝 Creating environment variables file...
    echo REACT_APP_API_URL=http://localhost:8003 > jobshield_frontend\.env
    echo REACT_APP_NAME=JobShield >> jobshield_frontend\.env
    echo REACT_APP_VERSION=1.0.0 >> jobshield_frontend\.env
    echo REACT_APP_DEBUG=true >> jobshield_frontend\.env
    echo ✅ Environment variables file created
)

REM Check if Go is installed
go version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Go is not installed or not in PATH
    echo    Please install Go 1.24+ from: https://golang.org/dl/
    pause
    exit /b 1
)

REM Check Go version
for /f "tokens=3" %%i in ('go version') do set GO_VERSION=%%i
echo 🔧 Go version: %GO_VERSION%

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js is not installed or not in PATH
    echo    Please install Node.js 16+ from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
echo 🌐 Node.js version: %NODE_VERSION%

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: npm is not installed or not in PATH
    echo    Please install npm from: https://nodejs.org/
    pause
    exit /b 1
)

REM Install frontend dependencies if needed
echo 📦 Installing frontend dependencies...
cd jobshield_frontend
if not exist "node_modules" (
    echo    Installing npm packages...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install npm packages
        pause
        exit /b 1
    )
    echo ✅ Frontend dependencies installed
) else (
    echo ✅ Frontend dependencies already installed
)
cd ..

REM Start backend service
echo 🔧 Starting backend service...
start "JobShield Backend" cmd /k "cd jobshield_backend && go run cmd/main.go"

REM Wait for backend to start
echo ⏳ Waiting for backend service to start...
timeout /t 5 /nobreak >nul

REM Start frontend service
echo 🌐 Starting frontend service...
start "JobShield Frontend" cmd /k "cd jobshield_frontend && npm start"

REM Wait for frontend to start
echo ⏳ Waiting for frontend service to start...
timeout /t 10 /nobreak >nul

echo.
echo 🎉 JobShield Development Environment Started Successfully!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:8003
echo 📊 API Docs: Check README_EN.md for API endpoints
echo.
echo 💡 Tips:
echo    • Frontend and backend are running in separate command windows
echo    • Check browser console for frontend logs
echo    • Backend logs are displayed in the backend command window
echo    • Connection status is shown in the top-right corner of the frontend
echo    • Close the command windows to stop the services
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Press any key to exit this startup script...
pause >nul
