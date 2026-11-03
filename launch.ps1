# Jyoti AI - PowerShell Launcher
Write-Host "========================================================" -ForegroundColor Yellow
Write-Host "  Jyoti AI - 100% Free & Zero-Cost AI Vedic Astrologer" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Starting local server at http://localhost:8080 ..." -ForegroundColor Green
Start-Process "http://localhost:8080"
python -m http.server 8080
