# RC-3 Performance Test Runner - Windows PowerShell
# This script runs all performance tests and saves results automatically

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  RC-3 Performance Test Runner" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Configuration
$OutputDir = "docs/validation/evidence/performance"
$ScriptsDir = "tests/performance/scripts"
$BaseUrl = "http://localhost:3000"

# Create output directory if it doesn't exist
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    Write-Host "✓ Created output directory: $OutputDir" -ForegroundColor Green
}

# Function to check if k6 is installed
function Test-K6Installed {
    try {
        $null = Get-Command k6 -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Function to check if application is running
function Test-ApplicationRunning {
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/api/health" -TimeoutSec 5
        return $response.status -eq "healthy"
    } catch {
        return $false
    }
}

# Step 1: Check k6 installation
Write-Host "Step 1: Checking k6 installation..." -ForegroundColor Yellow
if (-not (Test-K6Installed)) {
    Write-Host "✗ k6 is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install k6 using one of these methods:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1: winget (recommended)" -ForegroundColor Cyan
    Write-Host "  winget install k6" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2: Chocolatey" -ForegroundColor Cyan
    Write-Host "  choco install k6" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 3: Download from" -ForegroundColor Cyan
    Write-Host "  https://k6.io/docs/getting-started/installation/" -ForegroundColor White
    Write-Host ""
    Write-Host "After installation, restart PowerShell and run this script again." -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ k6 is installed" -ForegroundColor Green
Write-Host ""

# Step 2: Check if application is running
Write-Host "Step 2: Checking if application is running..." -ForegroundColor Yellow
if (-not (Test-ApplicationRunning)) {
    Write-Host "✗ Application is not running at $BaseUrl" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start the application:" -ForegroundColor Yellow
    Write-Host "  docker compose up -d" -ForegroundColor White
    Write-Host ""
    Write-Host "Then verify it's running:" -ForegroundColor Yellow
    Write-Host "  curl http://localhost:3000/api/health" -ForegroundColor White
    Write-Host ""
    Write-Host "After the application is ready, run this script again." -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Application is running and healthy" -ForegroundColor Green
Write-Host ""

# Step 3: Run Baseline Test
Write-Host "Step 3: Running Baseline Test..." -ForegroundColor Yellow
Write-Host "  Duration: ~30 seconds" -ForegroundColor Gray
Write-Host "  VUs: 1" -ForegroundColor Gray
Write-Host ""

$baselineOutput = "$OutputDir/baseline-output.txt"
$baselineHtml = "$OutputDir/baseline.html"

k6 run --out json=$baselineOutput.replace('.txt', '.json') $ScriptsDir/baseline.js 2>&1 | Tee-Object -FilePath $baselineOutput

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Baseline test completed" -ForegroundColor Green
    # Generate HTML report
    k6 run --out html=$baselineHtml $ScriptsDir/baseline.js 2>&1 | Out-Null
    Write-Host "✓ HTML report generated: $baselineHtml" -ForegroundColor Green
} else {
    Write-Host "✗ Baseline test failed" -ForegroundColor Red
}
Write-Host ""

# Step 4: Run Moderate Load Test
Write-Host "Step 4: Running Moderate Load Test..." -ForegroundColor Yellow
Write-Host "  Duration: ~2 minutes" -ForegroundColor Gray
Write-Host "  VUs: 10 (peak)" -ForegroundColor Gray
Write-Host ""

$moderateOutput = "$OutputDir/moderate-output.txt"
$moderateHtml = "$OutputDir/moderate.html"

k6 run --out json=$moderateOutput.replace('.txt', '.json') $ScriptsDir/moderate-load.js 2>&1 | Tee-Object -FilePath $moderateOutput

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Moderate load test completed" -ForegroundColor Green
    k6 run --out html=$moderateHtml $ScriptsDir/moderate-load.js 2>&1 | Out-Null
    Write-Host "✓ HTML report generated: $moderateHtml" -ForegroundColor Green
} else {
    Write-Host "✗ Moderate load test failed" -ForegroundColor Red
}
Write-Host ""

# Step 5: Run Peak Load Test
Write-Host "Step 5: Running Peak Load Test..." -ForegroundColor Yellow
Write-Host "  Duration: ~3 minutes" -ForegroundColor Gray
Write-Host "  VUs: 50 (peak)" -ForegroundColor Gray
Write-Host ""

$peakOutput = "$OutputDir/peak-output.txt"
$peakHtml = "$OutputDir/peak.html"

k6 run --out json=$peakOutput.replace('.txt', '.json') $ScriptsDir/peak-load.js 2>&1 | Tee-Object -FilePath $peakOutput

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Peak load test completed" -ForegroundColor Green
    k6 run --out html=$peakHtml $ScriptsDir/peak-load.js 2>&1 | Out-Null
    Write-Host "✓ HTML report generated: $peakHtml" -ForegroundColor Green
} else {
    Write-Host "✗ Peak load test failed" -ForegroundColor Red
}
Write-Host ""

# Step 6: Run Stress Test
Write-Host "Step 6: Running Stress Test..." -ForegroundColor Yellow
Write-Host "  Duration: ~4.5 minutes" -ForegroundColor Gray
Write-Host "  VUs: 100 (peak)" -ForegroundColor Gray
Write-Host ""

$stressOutput = "$OutputDir/stress-output.txt"
$stressHtml = "$OutputDir/stress.html"

k6 run --out json=$stressOutput.replace('.txt', '.json') $ScriptsDir/stress-test.js 2>&1 | Tee-Object -FilePath $stressOutput

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Stress test completed" -ForegroundColor Green
    k6 run --out html=$stressHtml $ScriptsDir/stress-test.js 2>&1 | Out-Null
    Write-Host "✓ HTML report generated: $stressHtml" -ForegroundColor Green
} else {
    Write-Host "✗ Stress test failed" -ForegroundColor Red
}
Write-Host ""

# Step 7: Summary
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Test Execution Complete" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Generated files:" -ForegroundColor Yellow
Write-Host "  ✓ $baselineOutput" -ForegroundColor White
Write-Host "  ✓ $baselineHtml" -ForegroundColor White
Write-Host "  ✓ $moderateOutput" -ForegroundColor White
Write-Host "  ✓ $moderateHtml" -ForegroundColor White
Write-Host "  ✓ $peakOutput" -ForegroundColor White
Write-Host "  ✓ $peakHtml" -ForegroundColor White
Write-Host "  ✓ $stressOutput" -ForegroundColor White
Write-Host "  ✓ $stressHtml" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Review the output files in $OutputDir" -ForegroundColor White
Write-Host "  2. Share the output files for analysis" -ForegroundColor White
Write-Host "  3. RC-3 final report will be generated based on results" -ForegroundColor White
Write-Host ""
Write-Host "To view HTML reports:" -ForegroundColor Yellow
Write-Host "  start $baselineHtml" -ForegroundColor White
Write-Host "  start $moderateHtml" -ForegroundColor White
Write-Host "  start $peakHtml" -ForegroundColor White
Write-Host "  start $stressHtml" -ForegroundColor White
Write-Host ""
