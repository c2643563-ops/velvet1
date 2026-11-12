@echo off
title Velvet Cafe & Grill — Local Server
echo ===================================================
echo   Starting Velvet Cafe ^& Grill Luxury Starter...
echo ===================================================
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies (first run only)...
  call npm install
)
if not exist .env.local (
  copy .env.example .env.local >nul
)
start "" "http://localhost:3000"
call npm run dev
pause
