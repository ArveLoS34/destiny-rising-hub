# Stress Test Diagnostic Runner
# This script runs the stress test with diagnostic monitoring

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  RC-3 Stress Test with Diagnostics" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

$OutputDir = "docs/validation/evidence/performance"
$ScriptsDir = "tests/performance/scripts"
$BaseUrl = "http://localhost:3000"

# Create output directory
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# Check if application is running
Write-Host "Checking if application is running..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$BaseUrl/api/health" -TimeoutSec 5
    if ($response.status -eq "healthy") {
        Write-Host "[OK] Application is running and healthy" -ForegroundColor Green
    } else {
        Write-Host "[FAIL] Application is not healthy" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "[FAIL] Application is not running at $BaseUrl" -ForegroundColor Red
    Write-Host "Please start the application with: docker compose up -d" -ForegroundColor Yellow
    exit 1
}

# Get initial diagnostic snapshot
Write-Host ""
Write-Host "Getting initial diagnostic snapshot..." -ForegroundColor Yellow
try {
    $initialDiag = Invoke-RestMethod -Uri "$BaseUrl/api/debug/performance" -TimeoutSec 5
    Write-Host "Initial rate limit stats:" -ForegroundColor Gray
    Write-Host "  Total keys: $($initialDiag.data.rateLimit.totalKeys)" -ForegroundColor Gray
    Write-Host "  Total blocked: $($initialDiag.data.rateLimit.totalBlocked)" -ForegroundColor Gray
    Write-Host "  Database connected: $($initialDiag.data.database.connected)" -ForegroundColor Gray
} catch {
    Write-Host "[WARN] Could not get initial diagnostics" -ForegroundColor Yellow
}

# Start monitoring in background
Write-Host ""
Write-Host "Starting stress test with diagnostics..." -ForegroundColor Yellow
Write-Host "Duration: ~4.5 minutes" -ForegroundColor Gray
Write-Host "VUs: 100 (peak)" -ForegroundColor Gray
Write-Host ""

# Run stress test with diagnostic script
$stressOutput = "$OutputDir/stress-diagnostic-output.txt"
$stressJson = "$OutputDir/stress-diagnostic-output.json"

k6 run --out "json=$stressJson" "$ScriptsDir/stress-test-diagnostic.js" 2>&1 | Tee-Object -FilePath $stressOutput

# Get final diagnostic snapshot
Write-Host ""
Write-Host "Getting final diagnostic snapshot..." -ForegroundColor Yellow
try {
    $finalDiag = Invoke-RestMethod -Uri "$BaseUrl/api/debug/performance" -TimeoutSec 5
    Write-Host "Final rate limit stats:" -ForegroundColor Gray
    Write-Host "  Total keys: $($finalDiag.data.rateLimit.totalKeys)" -ForegroundColor Gray
    Write-Host "  Total blocked: $($finalDiag.data.rateLimit.totalBlocked)" -ForegroundColor Gray
    Write-Host "  Database connected: $($finalDiag.data.database.connected)" -ForegroundColor Gray
    
    if ($finalDiag.data.rateLimit.topBlocked.Count -gt 0) {
        Write-Host ""
        Write-Host "Top blocked endpoints:" -ForegroundColor Gray
        foreach ($entry in $finalDiag.data.rateLimit.topBlocked) {
            Write-Host "  $($entry.key): $($entry.blocked) blocked, $($entry.count) total" -ForegroundColor Gray
        }
    }
    
    # Save diagnostic report
    $diagReport = @{
        timestamp = Get-Date -Format "o"
        initial = $initialDiag
        final = $finalDiag
        blocked_increase = $finalDiag.data.rateLimit.totalBlocked - $initialDiag.data.rateLimit.totalBlocked
    }
    
    $diagReport | ConvertTo-Json -Depth 10 | Out-File "$OutputDir/stress-diagnostic-report.json"
    Write-Host ""
    Write-Host "[OK] Diagnostic report saved to: $OutputDir/stress-diagnostic-report.json" -ForegroundColor Green
    
} catch {
    Write-Host "[WARN] Could not get final diagnostics: $_" -ForegroundColor Yellow
}

# Get application logs
Write-Host ""
Write-Host "Collecting application logs..." -ForegroundColor Yellow
docker compose logs app --tail=100 > "$OutputDir/stress-test-app-logs.txt" 2>&1
Write-Host "[OK] Application logs saved to: $OutputDir/stress-test-app-logs.txt" -ForegroundColor Green

# Summary
Write-Host ""
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "  Stress Test Diagnostic Complete" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Generated files:" -ForegroundColor Yellow
Write-Host "  [OK] $stressOutput" -ForegroundColor White
Write-Host "  [OK] $stressJson" -ForegroundColor White
Write-Host "  [OK] $OutputDir/stress-diagnostic-report.json" -ForegroundColor White
Write-Host "  [OK] $OutputDir/stress-test-app-logs.txt" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review the diagnostic report to identify bottlenecks" -ForegroundColor White
Write-Host "  2. Check application logs for errors" -ForegroundColor White
Write-Host "  3. Share the diagnostic files for analysis" -ForegroundColor White
Write-Host ""
