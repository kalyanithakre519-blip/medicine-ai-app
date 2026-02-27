# Stop everything
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process uvicorn -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Clear logs
$log1 = "backend/auth_debug_new.log"
$log2 = "backend/auth_debug.log"
if (Test-Path $log1) { Clear-Content $log1 }
if (Test-Path $log2) { Clear-Content $log2 }

Write-Host "Re-creating Kalyani account..." -ForegroundColor Green
# Run script synchronously to ensure account exists
& python create_kalyani.py

Write-Host "Starting Backend..." -ForegroundColor Green
cd backend
Start-Process uvicorn -ArgumentList "main:app --port 8000 --reload" -NoNewWindow
cd ..

Write-Host "Starting Frontend..." -ForegroundColor Green
cd client
Start-Process npm -ArgumentList "run dev" -NoNewWindow
cd ..

Write-Host "System ready. Please try login again." -ForegroundColor Cyan
