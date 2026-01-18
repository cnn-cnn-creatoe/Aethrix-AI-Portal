@echo off
echo ============================================================
echo Starting AI Skill Server on Port 4005
echo ============================================================
cd /d "%~dp0"
python skill_server.py
pause
