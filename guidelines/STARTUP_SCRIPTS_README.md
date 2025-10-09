# JobShield Startup Scripts Guide

This project provides startup scripts in both Chinese and English versions. Users can choose based on their language preference.

## 📁 Startup Script Files

### Linux/Mac Users
- **Chinese Version**: `start_dev_zh.sh` - Chinese interface and prompts
- **English Version**: `start_dev.sh` - English interface and prompts

### Windows Users
- **Chinese Version**: `start_dev_zh.bat` - Chinese interface and prompts
- **English Version**: `start_dev.bat` - English interface and prompts

## 🚀 Usage Instructions

### Linux/Mac Users

**Start with Chinese version:**
```bash
./start_dev_zh.sh
```

**Start with English version:**
```bash
./start_dev.sh
```

### Windows Users

**Start with Chinese version:**
```cmd
start_dev_zh.bat
```

**Start with English version:**
```cmd
start_dev.bat
```

## 🌟 Script Features

All startup scripts include the following features:

1. **Environment Check**
   - Check if Go 1.24+ is installed
   - Check if Node.js 16+ is installed
   - Check if npm is installed
   - Display version information

2. **Auto Configuration**
   - Create environment variables file (.env)
   - Automatically install frontend dependencies
   - Check project directory structure

3. **Service Startup**
   - Start Go backend service (port 8003)
   - Start React frontend service (port 3000)
   - Monitor service startup status

4. **User Guidance**
   - Display access addresses
   - Provide usage tips
   - Graceful error handling

## 🔧 Pre-startup Preparation

1. **Ensure you're in the project root directory**
   ```
   JobShield/
   ├── jobshield_backend/
   ├── jobshield_frontend/
   ├── start_dev_zh.sh    # Chinese version
   ├── start_dev.sh       # English version
   ├── start_dev_zh.bat   # Chinese version (Windows)
   └── start_dev.bat      # English version (Windows)
   ```

2. **Install required tools**
   - Go 1.24+
   - Node.js 16+
   - npm

3. **Choose language version**
   - Chinese users recommended: `start_dev_zh.*`
   - English users recommended: `start_dev.*`

## 📱 After Successful Startup

- **Frontend URL**: http://localhost:3000
- **Backend URL**: http://localhost:8003
- **Connection Status**: Displayed in top-right corner of frontend
- **Stop Services**: Press Ctrl+C (Linux/Mac) or close command windows (Windows)

## 🆘 Common Issues

### Permission Issues (Linux/Mac)
```bash
chmod +x start_dev_zh.sh
chmod +x start_dev.sh
```

### Port Occupied
- Check if ports 8003 and 3000 are occupied by other programs
- Use `lsof -i :8003` and `lsof -i :3000` to check

### Dependency Installation Failed
- Ensure network connection is stable
- Check Node.js and npm versions
- Try running `npm install` manually

## 🌍 Language Selection Recommendations

- **Chinese Users**: Use `start_dev_zh.*` scripts for better Chinese experience
- **English Users**: Use `start_dev.*` scripts to maintain English environment consistency
- **Team Development**: Recommend using the same language version for better collaboration

## 📚 Related Documentation

- **Chinese Documentation**: `README_ZH.md`
- **English Documentation**: `README.md`
- **API Configuration**: `API_CONFIG.md`
- **Chinese Startup Guide**: `启动脚本说明.md`

## 🎯 Quick Start Commands

### For Chinese Users
```bash
# Linux/Mac
./start_dev_zh.sh

# Windows
start_dev_zh.bat
```

### For English Users
```bash
# Linux/Mac
./start_dev.sh

# Windows
start_dev.bat
```

## 🔍 Script Differences

| Feature | Chinese Scripts | English Scripts |
|---------|----------------|-----------------|
| Interface Language | Chinese | English |
| Error Messages | Chinese | English |
| User Prompts | Chinese | English |
| Functionality | Identical | Identical |
| Performance | Identical | Identical |

## 💡 Best Practices

1. **Choose based on your team's language preference**
2. **Use the same language version across your development team**
3. **Keep both versions for international collaboration**
4. **Test both versions to ensure compatibility**
