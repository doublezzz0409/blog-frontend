@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo   Blog Frontend - Dev Server Launcher
echo ========================================
echo.

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [OK] Node.js %NODE_VER%

:: Check npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not found.
    pause
    exit /b 1
)

:: Check if in correct directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from blog-frontend directory.
    pause
    exit /b 1
)

:: Install dependencies if node_modules missing
if not exist "node_modules" (
    echo.
    echo [INFO] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed.
) else (
    echo [OK] Dependencies already installed.
)

:: Check MSW service worker
if not exist "public\mockServiceWorker.js" (
    echo.
    echo [INFO] Initializing MSW service worker...
    call npx msw init public/ --save
    if %errorlevel% neq 0 (
        echo [WARN] MSW init failed, mock may not work.
    )
)

echo.
echo [INFO] Starting dev server...
echo [INFO] Local:  http://localhost:5173
echo [INFO] Admin:  http://localhost:5173/admin/login
echo [INFO] Login:  admin / admin123
echo.
echo Press Ctrl+C to stop the server.
echo.

:: Start dev server
call npm run dev
