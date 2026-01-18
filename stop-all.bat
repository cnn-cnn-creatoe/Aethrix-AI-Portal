@echo off
chcp 65001 >nul
echo ========================================
echo   停止所有服务
echo ========================================

echo 正在停止 Node.js 服务...
taskkill /F /IM node.exe 2>nul

echo 正在停止 Python 服务...
taskkill /F /IM python.exe 2>nul

echo.
echo ========================================
echo   所有服务已停止！
echo ========================================
