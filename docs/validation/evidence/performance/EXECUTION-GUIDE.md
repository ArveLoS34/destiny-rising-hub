# RC-3 Performance Test Execution Guide

## Overview

This guide provides step-by-step instructions for running RC-3 performance tests on Windows. The tests will generate real performance metrics that will be used to validate the application's performance under various load conditions.

## Prerequisites

### 1. Windows Environment
- Windows 10/11
- PowerShell 5.1 or later
- Administrator privileges (for k6 installation)

### 2. Application Running
The application must be running before executing tests:

```powershell
# Start the application
docker compose up -d

# Verify it's running
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "checks": {
    "database": "healthy",
    "application": "healthy"
  }
}
```

### 3. k6 Installation

**Option 1: winget (Recommended)**
```powershell
winget install k6
```

**Option 2: Chocolatey**
```powershell
choco install k6
```

**Option 3: Manual Download**
1. Visit: https://k6.io/docs/getting-started/installation/
2. Download Windows installer
3. Run installer
4. Restart PowerShell

**Verify Installation:**
```powershell
k6 version
```

Expected output:
```
k6 v0.x.x (...)
```

---

## Execution Methods

### Method 1: Automated Script (Recommended)

The automated script runs all tests and saves results automatically.

**Step 1: Open PowerShell**
```powershell
# Navigate to project root
cd destiny-rising-hub
```

**Step 2: Run the test script**
```powershell
.\tests\performance\run-tests.ps1
```

**What it does:**
1. ✓ Checks k6 installation
2. ✓ Verifies application is running
3. ✓ Runs baseline test (~30s)
4. ✓ Runs moderate load test (~2min)
5. ✓ Runs peak load test (~3min)
6. ✓ Runs stress test (~4.5min)
7. ✓ Generates HTML reports
8. ✓ Saves all outputs to `docs/validation/evidence/performance/`

**Total Duration:** ~10-15 minutes

**Generated Files:**
```
docs/validation/evidence/performance/
├── baseline-output.txt
├── baseline.json
├── baseline.html
├── moderate-output.txt
├── moderate.json
├── moderate.html
├── peak-output.txt
├── peak.json
├── peak.html
├── stress-output.txt
├── stress.json
└── stress.html
```

---

### Method 2: Manual Execution

If you prefer to run tests individually:

**Step 1: Navigate to project root**
```powershell
cd destiny-rising-hub
```

**Step 2: Create output directory**
```powershell
New-Item -ItemType Directory -Path "docs/validation/evidence/performance" -Force
```

**Step 3: Run Baseline Test**
```powershell
k6 run tests/performance/scripts/baseline.js 2>&1 | Tee-Object -FilePath "docs/validation/evidence/performance/baseline-output.txt"
```

**Step 4: Run Moderate Load Test**
```powershell
k6 run tests/performance/scripts/moderate-load.js 2>&1 | Tee-Object -FilePath "docs/validation/evidence/performance/moderate-output.txt"
```

**Step 5: Run Peak Load Test**
```powershell
k6 run tests/performance/scripts/peak-load.js 2>&1 | Tee-Object -FilePath "docs/validation/evidence/performance/peak-output.txt"
```

**Step 6: Run Stress Test**
```powershell
k6 run tests/performance/scripts/stress-test.js 2>&1 | Tee-Object -FilePath "docs/validation/evidence/performance/stress-output.txt"
```

**Step 7: Generate HTML Reports**
```powershell
k6 run --out html=docs/validation/evidence/performance/baseline.html tests/performance/scripts/baseline.js
k6 run --out html=docs/validation/evidence/performance/moderate.html tests/performance/scripts/moderate-load.js
k6 run --out html=docs/validation/evidence/performance/peak.html tests/performance/scripts/peak-load.js
k6 run --out html=docs/validation/evidence/performance/stress.html tests/performance/scripts/stress-test.js
```

---

## Expected Test Output

### Baseline Test Output Example

```
          /\      |‾‾| /‾‾/   /‾‾/   
     /\  /  \     |  |/  /   /  /    
    /  \/    \    |     (   /   ‾‾\  
   /          \   |  |\  \ |  (‾)  | 
  / __________ \  |__| \__\ \_____/ .io 

  execution: local
     script: tests/performance/scripts/baseline.js
     output: -

  scenarios: (100.00%) 1 scenario, 1 max VUs, 1m0s maxDuration (incl. 30s gracefulStop):
           * default: 1 looping VUs for 30s (gracefulStop: 30s)

     ✓ health check status is 200
     ✓ health check response is healthy
     ✓ characters list status is 200
     ✓ characters list has data
     ✓ paginated characters status is 200
     ✓ paginated response has pagination metadata
     ✓ filter status is 200
     ✓ sort status is 200

     checks.........................: 100.00% ✓ 80      ✗ 0
     data_received..................: 125 kB  4.2 kB/s
     data_sent......................: 6.4 kB  213 B/s
     http_req_duration..............: avg=45ms   min=20ms  med=40ms   max=150ms  p(95)=120ms
     http_req_failed................: 0.00%   ✓ 0       ✗ 40
     http_reqs......................: 80      2.666667/s
     iteration_duration.............: avg=11.2s  min=11s   med=11.2s  max=11.5s  p(95)=11.4s
     iterations.....................: 10      0.333333/s
     vus............................: 1       min=1     max=1

     ✓ http_req_duration..............: avg=45ms   min=20ms  med=40ms   max=150ms  p(95)=120ms  threshold=<500ms
     ✓ http_req_failed................: 0.00%   ✓ 0       ✗ 40       threshold=<0.01
```

### Key Metrics to Look For

| Metric | Description | Example |
|--------|-------------|---------|
| `http_req_duration` | Request duration | avg=45ms, p(95)=120ms |
| `http_req_failed` | Failed request rate | 0.00% |
| `http_reqs` | Total requests | 80 |
| `iterations` | Total iterations | 10 |
| `vus` | Virtual users | 1 |
| `checks` | Check pass rate | 100.00% |

---

## Troubleshooting

### Problem: k6 not found

**Solution:**
```powershell
# Check if k6 is in PATH
Get-Command k6

# If not found, add to PATH or reinstall
winget install k6
```

### Problem: Application not running

**Solution:**
```powershell
# Start application
docker compose up -d

# Wait for startup
Start-Sleep -Seconds 30

# Verify
curl http://localhost:3000/api/health
```

### Problem: Tests fail with connection errors

**Solution:**
```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill the process if needed
taskkill /PID <PID> /F

# Restart application
docker compose restart app
```

### Problem: HTML reports not generated

**Solution:**
```powershell
# Install k6 HTML extension
k6 login cloud --token <your-token>

# Or use alternative output
k6 run --out json=output.json tests/performance/scripts/baseline.js
```

---

## After Test Execution

### Step 1: Verify Output Files

Check that all output files were created:
```powershell
Get-ChildItem docs/validation/evidence/performance/
```

Expected files:
- baseline-output.txt
- moderate-output.txt
- peak-output.txt
- stress-output.txt
- baseline.html
- moderate.html
- peak.html
- stress.html

### Step 2: Review Results

Open HTML reports in browser:
```powershell
start docs/validation/evidence/performance/baseline.html
start docs/validation/evidence/performance/moderate.html
start docs/validation/evidence/performance/peak.html
start docs/validation/evidence/performance/stress.html
```

### Step 3: Share Results

Share the following files for analysis:
1. All `.txt` output files
2. All `.html` report files (optional)
3. Any errors or issues encountered

### Step 4: Wait for Analysis

After receiving the results:
1. I will analyze the performance metrics
2. Compare against thresholds
3. Generate RC-3 Final Report
4. Determine PASS/FAIL status
5. Provide optimization recommendations

---

## Test Duration Summary

| Test | VUs | Duration | Expected Time |
|------|-----|----------|---------------|
| Baseline | 1 | 30s | ~30s |
| Moderate | 10 | 2min | ~2min |
| Peak | 50 | 3min | ~3min |
| Stress | 100 | 4.5min | ~4.5min |
| **Total** | - | - | **~10-15min** |

---

## Success Criteria

RC-3 will be marked as **PASSED** when:

### Baseline Test
- [ ] http_req_duration p(95) < 500ms
- [ ] http_req_failed < 1%
- [ ] All checks pass

### Moderate Load Test
- [ ] http_req_duration p(95) < 1000ms
- [ ] http_req_failed < 1%
- [ ] All checks pass

### Peak Load Test
- [ ] http_req_duration p(95) < 2000ms
- [ ] http_req_failed < 5%
- [ ] All checks pass

### Stress Test
- [ ] http_req_duration p(95) < 5000ms
- [ ] http_req_failed < 10%
- [ ] System remains stable

---

## Next Steps After Test Execution

1. **Analyze Results** - Review metrics against thresholds
2. **Identify Bottlenecks** - Find performance issues
3. **Optimize** - Fix identified issues
4. **Re-test** - Verify improvements
5. **Document** - Create RC-3 Final Report
6. **Commit** - Push evidence files to repository

---

## Support

If you encounter issues:
1. Check troubleshooting section above
2. Review k6 documentation: https://k6.io/docs/
3. Share error messages for assistance

---

**Status:** Ready for execution  
**Evidence Policy:** Only real test results will be used  
**Next Action:** Run tests and share results
