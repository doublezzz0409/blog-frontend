Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Blog Frontend - Dev Server Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVer = node -v
    Write-Host "[OK] Node.js $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js not found. Please install Node.js first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if in correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "[ERROR] package.json not found. Please run this script from blog-frontend directory." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies if node_modules missing
if (-not (Test-Path "node_modules")) {
    Write-Host ""
    Write-Host "[INFO] Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] npm install failed." -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "[OK] Dependencies installed." -ForegroundColor Green
} else {
    Write-Host "[OK] Dependencies already installed." -ForegroundColor Green
}

# Check MSW service worker
if (-not (Test-Path "public\mockServiceWorker.js")) {
    Write-Host ""
    Write-Host "[INFO] Initializing MSW service worker..." -ForegroundColor Yellow
    npx msw init public/ --save 2>&1 | Out-Null
}

Write-Host ""
Write-Host "[INFO] Starting dev server..." -ForegroundColor Yellow
Write-Host "[INFO] Local:  http://localhost:5173" -ForegroundColor White
Write-Host "[INFO] Admin:  http://localhost:5173/admin/login" -ForegroundColor White
Write-Host "[INFO] Login:  admin / admin123" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor DarkGray
Write-Host ""

npm run dev
