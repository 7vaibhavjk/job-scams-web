# JobShield 启动脚本说明

本项目提供了中英文两版的启动脚本，用户可以根据自己的语言偏好选择使用。

## 📁 启动脚本文件

### Linux/Mac 用户
- **中文版**: `start_dev_zh.sh` - 中文界面和提示
- **英文版**: `start_dev.sh` - 英文界面和提示

### Windows 用户
- **中文版**: `start_dev_zh.bat` - 中文界面和提示
- **英文版**: `start_dev.bat` - 英文界面和提示

## 🚀 使用方法

### Linux/Mac 用户

**中文版启动:**
```bash
./start_dev_zh.sh
```

**英文版启动:**
```bash
./start_dev.sh
```

### Windows 用户

**中文版启动:**
```cmd
start_dev_zh.bat
```

**英文版启动:**
```cmd
start_dev.bat
```

## 🌟 脚本功能特性

所有启动脚本都包含以下功能：

1. **环境检查**
   - 检查Go 1.24+是否安装
   - 检查Node.js 16+是否安装
   - 检查npm是否安装
   - 显示版本信息

2. **自动配置**
   - 创建环境变量文件(.env)
   - 自动安装前端依赖
   - 检查项目目录结构

3. **服务启动**
   - 启动Go后端服务(端口8003)
   - 启动React前端服务(端口3000)
   - 监控服务启动状态

4. **用户指导**
   - 显示访问地址
   - 提供使用提示
   - 优雅的错误处理

## 🔧 启动前准备

1. **确保在项目根目录**
   ```
   JobShield/
   ├── jobshield_backend/
   ├── jobshield_frontend/
   ├── start_dev_zh.sh    # 中文版
   ├── start_dev.sh       # 英文版
   ├── start_dev_zh.bat   # 中文版(Windows)
   └── start_dev.bat      # 英文版(Windows)
   ```

2. **安装必要工具**
   - Go 1.24+
   - Node.js 16+
   - npm

3. **选择语言版本**
   - 中文用户推荐使用 `start_dev_zh.*`
   - 英文用户推荐使用 `start_dev.*`

## 📱 启动成功后

- **前端地址**: http://localhost:3000
- **后端地址**: http://localhost:8003
- **连接状态**: 显示在前端右上角
- **停止服务**: 按Ctrl+C(Linux/Mac)或关闭命令窗口(Windows)

## 🆘 常见问题

### 权限问题 (Linux/Mac)
```bash
chmod +x start_dev_zh.sh
chmod +x start_dev.sh
```

### 端口被占用
- 检查8003和3000端口是否被其他程序占用
- 使用 `lsof -i :8003` 和 `lsof -i :3000` 查看

### 依赖安装失败
- 确保网络连接正常
- 检查Node.js和npm版本
- 尝试手动运行 `npm install`

## 🌍 语言选择建议

- **中文用户**: 使用 `start_dev_zh.*` 脚本，获得更好的中文体验
- **英文用户**: 使用 `start_dev.*` 脚本，保持英文环境一致性
- **团队开发**: 建议统一使用同一语言版本，便于协作

## 📚 相关文档

- **中文文档**: `README_ZH.md`
- **英文文档**: `README.md`
- **API配置**: `API_CONFIG.md`
