@echo off
echo ============================================================
echo Starting Prompt Workshop Server on Port 4006
echo ============================================================
cd /d "%~dp0"
python prompt_server.py
pause
