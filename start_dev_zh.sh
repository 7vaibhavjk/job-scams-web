#!/bin/bash

# JobShield 开发环境启动脚本
# 此脚本启动后端和前端服务

echo "🚀 启动 JobShield 开发环境..."

# 检查是否在正确的目录
if [ ! -d "jobshield_backend" ] || [ ! -d "jobshield_frontend" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    echo "   当前目录: $(pwd)"
    echo "   期望的目录结构:"
    echo "   ├── jobshield_backend/"
    echo "   ├── jobshield_frontend/"
    echo "   └── start_dev_zh.sh"
    exit 1
fi

# 创建环境变量文件（如果不存在）
if [ ! -f "jobshield_frontend/.env" ]; then
    echo "📝 创建环境变量文件..."
    cat > jobshield_frontend/.env << EOF
REACT_APP_API_URL=http://localhost:8003
REACT_APP_NAME=JobShield
REACT_APP_VERSION=1.0.0
REACT_APP_DEBUG=true
EOF
    echo "✅ 环境变量文件已创建"
fi

# 检查Go是否安装
if ! command -v go &> /dev/null; then
    echo "❌ 错误: Go未安装或不在PATH中"
    echo "   请从以下地址安装Go 1.24+: https://golang.org/dl/"
    exit 1
fi

# 检查Go版本
GO_VERSION=$(go version | awk '{print $3}' | sed 's/go//')
echo "🔧 Go版本: $GO_VERSION"

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js未安装或不在PATH中"
    echo "   请从以下地址安装Node.js 16+: https://nodejs.org/"
    exit 1
fi

# 检查Node.js版本
NODE_VERSION=$(node --version)
echo "🌐 Node.js版本: $NODE_VERSION"

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: npm未安装或不在PATH中"
    echo "   请从以下地址安装npm: https://nodejs.org/"
    exit 1
fi

# 安装前端依赖（如果需要）
echo "📦 安装前端依赖..."
cd jobshield_frontend
if [ ! -d "node_modules" ]; then
    echo "   正在安装npm包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 安装npm包失败"
        exit 1
    fi
    echo "✅ 前端依赖已安装"
else
    echo "✅ 前端依赖已安装"
fi
cd ..

# 启动后端服务
echo "🔧 启动后端服务..."
cd jobshield_backend
go run cmd/main.go &
BACKEND_PID=$!
cd ..

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 5

# 检查后端是否运行
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "❌ 后端服务启动失败"
    exit 1
fi

# 检查后端是否响应
if curl -s http://localhost:8003 > /dev/null 2>&1; then
    echo "✅ 后端服务运行在 http://localhost:8003"
else
    echo "⚠️  后端服务已启动但尚未响应"
fi

# 启动前端服务
echo "🌐 启动前端服务..."
cd jobshield_frontend
npm start &
FRONTEND_PID=$!
cd ..

# 等待前端启动
echo "⏳ 等待前端服务启动..."
sleep 10

# 检查前端是否运行
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ 前端服务启动失败"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# 检查前端是否响应
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ 前端服务运行在 http://localhost:3000"
else
    echo "⚠️  前端服务已启动但尚未响应"
fi

echo ""
echo "🎉 JobShield 开发环境启动成功！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 前端: http://localhost:3000"
echo "🔧 后端: http://localhost:8003"
echo "📊 API文档: 查看 README.md 了解API端点"
echo ""
echo "💡 提示:"
echo "   • 按 Ctrl+C 停止所有服务"
echo "   • 检查浏览器控制台查看前端日志"
echo "   • 后端日志显示在此终端中"
echo "   • 连接状态显示在前端右上角"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 退出时清理进程的函数
cleanup() {
    echo ""
    echo "🛑 停止服务..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ 所有服务已停止"
    exit 0
}

# 设置脚本退出时的清理陷阱
trap cleanup INT TERM EXIT

# 等待用户停止服务
echo ""
echo "按 Ctrl+C 停止所有服务..."
wait
