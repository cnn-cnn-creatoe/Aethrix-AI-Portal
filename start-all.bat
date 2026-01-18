@echo off
chcp 65001 >nul
echo ========================================
echo   启动所有服务
echo ========================================

echo.
echo [1/7] 启动主站服务 (端口 3006)...
start "主站-3006" /min cmd /c "cd /d %~dp0 && node server.js"

echo [2/7] 启动 2000+ 工作流服务 (端口 4001) [后台]...
powershell -Command "Start-Process -FilePath 'python' -ArgumentList 'run.py --host 0.0.0.0 --port 4001' -WorkingDirectory '%~dp0n8n\工作流\n8n工作流4000+\n8n-workflows-mainz整理部分\n8n-workflows-main' -WindowStyle Hidden"

echo [3/7] 启动 4000+ 工作流服务 (端口 4002) [后台]...
powershell -Command "Start-Process -FilePath 'python' -ArgumentList 'run.py --host 0.0.0.0 --port 4002' -WorkingDirectory '%~dp0n8n\工作流\n8n工作流4000+\4k+n8n-workflows工作流集锦\4k+n8n-workflows' -WindowStyle Hidden"

echo [4/7] 启动 Dify 工作流服务 (端口 4003) [后台]...
powershell -Command "Start-Process -FilePath 'python' -ArgumentList 'dify_api_server.py' -WorkingDirectory '%~dp0dify' -WindowStyle Hidden"

echo [5/7] 启动 Coze 工作流服务 (端口 4004) [后台]...
powershell -Command "Start-Process -FilePath 'python' -ArgumentList 'coze_server.py' -WorkingDirectory '%~dp0coze' -WindowStyle Hidden"

echo [6/7] 启动 AI Skill 服务 (端口 4005) [后台]...
powershell -Command "Start-Process -FilePath 'python' -ArgumentList 'skill_server.py' -WorkingDirectory '%~dp0skill' -WindowStyle Hidden"

echo [7/7] 启动 Prompt Workshop 服务 (端口 4006) [后台]...
powershell -Command "Start-Process -FilePath 'python' -ArgumentList 'prompt_server.py' -WorkingDirectory '%~dp0prompt-workshop' -WindowStyle Hidden"

echo.
echo ========================================
echo   所有服务已启动！
echo ========================================
echo   主站:          http://localhost:3006
echo   2000+ 工作流:  http://localhost:4001 (后台)
echo   4000+ 工作流:  http://localhost:4002 (后台)
echo   Dify 工作流:   http://localhost:4003 (后台)
echo   Coze 工作流:   http://localhost:4004 (后台)
echo   AI Skill:      http://localhost:4005 (后台)
echo   Prompt 工坊:   http://localhost:4006 (后台)
echo ========================================
echo.
