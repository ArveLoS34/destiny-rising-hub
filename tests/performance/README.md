# Performance Testing with k6

## Overview

This directory contains performance test scripts for the Destiny Rising Hub application using k6.

## Test Scripts

### 1. Baseline Test (`baseline.js`)
- **Purpose:** Establish baseline performance metrics
- **Load:** 1 virtual user
- **Duration:** 30 seconds
- **Focus:** Single user experience

### 2. Moderate Load Test (`moderate-load.js`)
- **Purpose:** Test performance under normal usage
- **Load:** 10 concurrent users
- **Duration:** 2 minutes (ramp up + steady state + ramp down)
- **Focus:** Typical production load

### 3. Peak Load Test (`peak-load.js`)
- **Purpose:** Test performance under heavy load
- **Load:** 50 concurrent users
- **Duration:** 3 minutes (ramp up + peak + ramp down)
- **Focus:** High traffic scenarios

### 4. Stress Test (`stress-test.js`)
- **Purpose:** Identify breaking point
- **Load:** Gradual increase from 10 to 100 users
- **Duration:** 4.5 minutes
- **Focus:** System limits and bottlenecks

## Running Tests

### Prerequisites

1. **Install k6:**
   ```bash
   # macOS
   brew install k6
   
   # Linux
   sudo gpg-key update
   sudo apt install k6
   
   # Docker
   docker pull grafana/k6
   ```

2. **Ensure application is running:**
   ```bash
   docker compose up -d
   ```

3. **Verify application is accessible:**
   ```bash
   curl http://localhost:3000/api/health
   ```

### Running Individual Tests

```bash
# Baseline test
k6 run tests/performance/scripts/baseline.js

# Moderate load test
k6 run tests/performance/scripts/moderate-load.js

# Peak load test
k6 run tests/performance/scripts/peak-load.js

# Stress test
k6 run tests/performance/scripts/stress-test.js
```

### Running with HTML Report

```bash
# Generate HTML report
k6 run --out html=tests/performance/results/baseline-report.html tests/performance/scripts/baseline.js

# Generate JSON output for further analysis
k6 run --out json=tests/performance/results/baseline.json tests/performance/scripts/baseline.js
```

### Running with Docker

```bash
docker run --rm -i --network host grafana/k6 run - < tests/performance/scripts/baseline.js
```

## Metrics Collected

### Standard Metrics
- **http_req_duration:** Request duration (p50, p95, p99)
- **http_req_failed:** Failed request rate
- **http_reqs:** Total number of requests
- **iterations:** Total iterations completed
- **vus:** Current number of virtual users
- **data_received:** Data received in bytes
- **data_sent:** Data sent in bytes

### Custom Metrics
- **errors:** Custom error rate
- **api_latency:** API-specific latency tracking
- **request_count:** Total request counter

## Thresholds

Each test has predefined thresholds that must be met:

### Baseline
- 95% of requests < 500ms
- Error rate < 1%

### Moderate Load
- 95% of requests < 1000ms
- Error rate < 1%

### Peak Load
- 95% of requests < 2000ms
- Error rate < 5%

### Stress Test
- 95% of requests < 5000ms
- Error rate < 10%

## Analyzing Results

### k6 Output
After each test, k6 provides:
- Request duration percentiles
- Request rate (req/s)
- Error rate
- Data transfer metrics
- Iteration statistics

### Visualization
For detailed visualization:
1. Use k6 Cloud (https://app.k6.io)
2. Export to Grafana using k6 output
3. Use HTML reports

## Troubleshooting

### Application Not Accessible
```bash
# Check if application is running
docker compose ps

# Check application logs
docker compose logs app

# Restart application
docker compose restart app
```

### Port Already in Use
```bash
# Check what's using port 3000
lsof -i :3000

# Or change the port in test scripts
```

### k6 Not Installed
```bash
# Install k6
brew install k6  # macOS
# or
docker pull grafana/k6  # Docker
```

## Results Storage

Test results should be stored in:
- `tests/performance/results/` - Raw test outputs
- `docs/validation/evidence/RC-3/` - Final reports and analysis

## Next Steps

After running tests:
1. Analyze results
2. Identify bottlenecks
3. Optimize performance
4. Re-run tests to verify improvements
5. Document findings in RC-3 final report
