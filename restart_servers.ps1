# Stop all existing processes on ports 8000, 5001, 5173, 5000
Write-Host "Cleaning up existing ports..." -ForegroundColor Yellow
$ports = @(8000, 5001, 5173, 5000)
foreach ($port in $ports) {
    $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conn) {
        Write-Host "Killing process on port $port (PID: $($conn.OwningProcess))" -ForegroundColor Gray
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

# Start AI Service
Write-Host "Starting AI Service (Port 5001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ai_service; python app.py"

# Start Python Backend
Write-Host "Starting Python Backend (Port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; uvicorn main:app --port 8000 --reload"

# Start Node.js Backend (Optional, Port 5000)
Write-Host "Starting Node backend (Port 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm start"

# Start Frontend
Write-Host "Starting Frontend (Port 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

Write-Host "`nAll servers are starting in separate windows." -ForegroundColor Cyan
Write-Host "1. AI Service: http://localhost:5001" -ForegroundColor Gray
Write-Host "2. Backend API (Python): http://localhost:8000" -ForegroundColor Gray
Write-Host "3. Backend API (Node): http://localhost:5000" -ForegroundColor Gray
Write-Host "4. Frontend: http://localhost:5173" -ForegroundColor Gray
