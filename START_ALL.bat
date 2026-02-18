@echo off
echo ============================================================
echo    Secure Encryption Platform - Quick Start
echo ============================================================
echo.
echo Starting all servers...
echo.

echo [1/2] Starting Text Encryption Backend (Port 5000)...
start "Text Encryption Backend" cmd /k "cd backend && python app.py"
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Server (Port 8000)...
start "Frontend Server" cmd /k "cd frontend && python -m http.server 8000"
timeout /t 3 /nobreak >nul

echo.
echo ============================================================
echo    All Servers Started!
echo ============================================================
echo.
echo Access Points:
echo   - Home Page: http://localhost:8000/home.html
echo   - Text Encryption: http://localhost:8000/index.html
echo   - Backend API: http://localhost:5000
echo.
echo Opening home page in browser...
timeout /t 2 /nobreak >nul
start http://localhost:8000/home.html

echo.
echo Press any key to stop all servers...
pause >nul

echo.
echo Stopping servers...
taskkill /FI "WindowTitle eq Text Encryption Backend*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Frontend Server*" /T /F >nul 2>&1

echo.
echo All servers stopped.
echo.
pause
