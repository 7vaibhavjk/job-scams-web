@echo off
REM JobShield 开发环境启动脚本 (Windows)
REM 此脚本启动后端和前端服务

echo 🚀 启动 JobShield 开发环境...

REM 检查是否在正确的目录
if not exist "jobshield_backend" (
    echo ❌ 错误: 请在项目根目录运行此脚本
    echo    当前目录: %CD%
    echo    期望的目录结构:
    echo    ├── jobshield_backend/
    echo    ├── jobshield_frontend/
    echo    └── start_dev_zh.bat
    pause
    exit /b 1
)

if not exist "jobshield_frontend" (
    echo ❌ 错误: 请在项目根目录运行此脚本
    echo    当前目录: %CD%
    echo    期望的目录结构:
    echo    ├── jobshield_backend/
    echo    ├── jobshield_frontend/
    echo    └── start_dev_zh.bat
    pause
    exit /b 1
)

REM 创建环境变量文件（如果不存在）
if not exist "jobshield_frontend\.env" (
    echo 📝 创建环境变量文件...
    echo REACT_APP_API_URL=http://localhost:8003 > jobshield_frontend\.env
    echo REACT_APP_NAME=JobShield >> jobshield_frontend\.env
    echo REACT_APP_VERSION=1.0.0 >> jobshield_frontend\.env
    echo REACT_APP_DEBUG=true >> jobshield_frontend\.env
    echo ✅ 环境变量文件已创建
)

REM 检查Go是否安装
go version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: Go未安装或不在PATH中
    echo    请从以下地址安装Go 1.24+: https://golang.org/dl/
    pause
    exit /b 1
)

REM 检查Go版本
for /f "tokens=3" %%i in ('go version') do set GO_VERSION=%%i
echo 🔧 Go版本: %GO_VERSION%

REM 检查Node.js是否安装
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: Node.js未安装或不在PATH中
    echo    请从以下地址安装Node.js 16+: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查Node.js版本
for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
echo 🌐 Node.js版本: %NODE_VERSION%

REM 检查npm是否安装
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: npm未安装或不在PATH中
    echo    请从以下地址安装npm: https://nodejs.org/
    pause
    exit /b 1
)

REM 安装前端依赖（如果需要）
echo 📦 安装前端依赖...
cd jobshield_frontend
if not exist "node_modules" (
    echo    正在安装npm包...
    npm install
    if errorlevel 1 (
        echo ❌ 安装npm包失败
        pause
        exit /b 1
    )
    echo ✅ 前端依赖已安装
) else (
    echo ✅ 前端依赖已安装
)
cd ..

REM 启动后端服务
echo 🔧 启动后端服务...
start "JobShield 后端" cmd /k "cd jobshield_backend && go run cmd/main.go"

REM 等待后端启动
echo ⏳ 等待后端服务启动...
timeout /t 5 /nobreak >nul

REM 启动前端服务
echo 🌐 启动前端服务...
start "JobShield 前端" cmd /k "cd jobshield_frontend && npm start"

REM 等待前端启动
echo ⏳ 等待前端服务启动...
timeout /t 10 /nobreak >nul

echo.
echo 🎉 JobShield 开发环境启动成功！
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 📱 前端: http://localhost:3000
echo 🔧 后端: http://localhost:8003
echo 📊 API文档: 查看 README.md 了解API端点
echo.
echo 💡 提示:
echo    • 前端和后端在独立的命令窗口中运行
echo    • 检查浏览器控制台查看前端日志
echo    • 后端日志显示在后端命令窗口中
echo    • 连接状态显示在前端右上角
echo    • 关闭命令窗口可停止服务
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 按任意键退出启动脚本...
pause >nul
