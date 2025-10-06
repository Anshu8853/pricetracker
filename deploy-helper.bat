@echo off
REM Deployment Helper Script for Windows

echo.
echo ========================================
echo   Price Tracker Deployment Helper
echo ========================================
echo.

echo Pre-Deployment Checklist:
echo.
echo [ ] MongoDB Atlas account created
echo [ ] Database user and connection string ready
echo [ ] Gmail App Password generated
echo [ ] GitHub account ready
echo [ ] Code pushed to GitHub
echo.
pause

echo.
echo Opening deployment platforms in browser...
echo.

REM Open deployment platforms
start https://cloud.mongodb.com
timeout /t 2 /nobreak >nul
start https://render.com
timeout /t 2 /nobreak >nul
start https://vercel.com

echo.
echo ========================================
echo   Opened in browser:
echo ========================================
echo   1. MongoDB Atlas - Create database
echo   2. Render.com - Deploy backend
echo   3. Vercel.com - Deploy frontend
echo.
echo Follow DEPLOY_NOW.md for detailed steps!
echo.
echo Your app will be PUBLIC in ~20 minutes!
echo.
pause
