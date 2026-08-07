# RC-3 API Endpoint Mapping & Validation

## 1. Endpoint Mapping

### Repository API Routes (src/app/api)

| Route File | HTTP Method | Endpoint | Description |
|------------|-------------|----------|-------------|
| `src/app/api/health/route.ts` | GET | `/api/health` | Health check endpoint |
| `src/app/api/v1/characters/route.ts` | GET | `/api/v1/characters` | List characters with pagination, filtering, sorting |
| `src/app/api/v1/characters/route.ts` | POST | `/api/v1/characters` | Create new character (admin only) |
| `src/app/api/auth/[...all]/route.ts` | ALL | `/api/auth/*` | Authentication routes |

### Performance Test Endpoints

| Test Script | Endpoint | Query Parameters | Tested Features |
|-------------|----------|------------------|-----------------|
| baseline.js | `/api/health` | - | Health check |
| baseline.js | `/api/v1/characters` | - | List all characters |
| baseline.js | `/api/v1/characters` | `?page=1&limit=10` | Pagination |
| baseline.js | `/api/v1/characters` | `?filter[element]=Fire` | Filter by element |
| baseline.js | `/api/v1/characters` | `?sortBy=name&order=asc` | Sort by name |
| moderate-load.js | `/api/health` | - | Health check |
| moderate-load.js | `/api/v1/characters` | - | List all characters |
| moderate-load.js | `/api/v1/characters` | `?page=1&limit=10` | Pagination |
| moderate-load.js | `/api/v1/characters` | `?filter[element]=Fire` | Filter by element |
| moderate-load.js | `/api/v1/characters` | `?filter[role]=DPS` | Filter by role |
| moderate-load.js | `/api/v1/characters` | `?sortBy=name&order=asc` | Sort by name |
| peak-load.js | `/api/health` | - | Health check |
| peak-load.js | `/api/v1/characters` | - | List all characters |
| peak-load.js | `/api/v1/characters` | `?page=1&limit=10` | Pagination |
| peak-load.js | `/api/v1/characters` | `?filter[element]=Fire` | Filter by element |
| peak-load.js | `/api/v1/characters` | `?filter[role]=DPS` | Filter by role |
| peak-load.js | `/api/v1/characters` | `?sortBy=name&order=asc` | Sort by name |
| peak-load.js | `/api/v1/characters` | `?filter[element]=Fire&sortBy=popularity&order=desc` | Combined filter+sort |
| stress-test.js | `/api/health` | - | Health check |
| stress-test.js | `/api/v1/characters` | - | List all characters |
| stress-test.js | `/api/v1/characters` | `?page=1&limit=10` | Pagination |
| stress-test.js | `/api/v1/characters` | `?filter[element]=Fire` | Filter by element |
| stress-test.js | `/api/v1/characters` | `?sortBy=name&order=asc` | Sort by name |

### Validation Result

✅ **All test endpoints match existing API routes**

- `/api/health` → `src/app/api/health/route.ts` ✓
- `/api/v1/characters` → `src/app/api/v1/characters/route.ts` ✓
- All query parameters (page, limit, filter, sortBy, order) are supported by the route ✓

---

## 2. Threshold Definitions

### Baseline Test (baseline.js)

```javascript
thresholds: {
  http_req_duration: ['p(95)<500'],  // 95% of requests < 500ms
  http_req_failed: ['rate<0.01'],    // Error rate < 1%
}
```

**Rationale:**
- Single user scenario, no concurrent load
- 500ms p95 is acceptable for baseline (no optimization pressure)
- 1% error rate threshold ensures basic reliability

### Moderate Load Test (moderate-load.js)

```javascript
thresholds: {
  http_req_duration: ['p(95)<1000'],  // 95% of requests < 1000ms
  errors: ['rate<0.01'],               // Custom error rate < 1%
  http_req_failed: ['rate<0.01'],      // HTTP error rate < 1%
}
```

**Rationale:**
- 10 concurrent users simulate normal production load
- 1000ms p95 allows for moderate latency under load
- 1% error rate maintains quality under normal traffic

### Peak Load Test (peak-load.js)

```javascript
thresholds: {
  http_req_duration: ['p(95)<2000'],  // 95% of requests < 2000ms
  errors: ['rate<0.05'],               // Custom error rate < 5%
  http_req_failed: ['rate<0.05'],      // HTTP error rate < 5%
  api_latency: ['p(95)<2000'],         // Custom API latency < 2000ms
}
```

**Rationale:**
- 50 concurrent users simulate peak traffic
- 2000ms p95 allows for higher latency under peak load
- 5% error rate is acceptable during peak (graceful degradation)
- Custom `api_latency` metric tracks actual API processing time

### Stress Test (stress-test.js)

```javascript
thresholds: {
  http_req_duration: ['p(95)<5000'],  // 95% of requests < 5000ms
  errors: ['rate<0.10'],               // Custom error rate < 10%
  http_req_failed: ['rate<0.10'],      // HTTP error rate < 10%
}
```

**Rationale:**
- 100 concurrent users push system to limits
- 5000ms p95 allows for severe degradation
- 10% error rate identifies breaking point
- Purpose is to find system limits, not maintain quality

---

## 3. Test Scenarios

### Baseline Test

| Parameter | Value |
|-----------|-------|
| VU Count | 1 |
| Duration | 30s |
| Ramp-up | N/A (constant) |
| Ramp-down | N/A (constant) |
| Request Target | ~30 iterations |
| Endpoint Calls | 5 endpoints × 30 iterations = ~150 requests |

**Endpoint Breakdown:**
- `/api/health`: 30 calls
- `/api/v1/characters`: 30 calls
- `/api/v1/characters?page=1&limit=10`: 30 calls
- `/api/v1/characters?filter[element]=Fire`: 30 calls
- `/api/v1/characters?sortBy=name&order=asc`: 30 calls

**Total Requests:** ~150

---

### Moderate Load Test

| Parameter | Value |
|-----------|-------|
| VU Count | 10 (peak) |
| Duration | 2 minutes (30s ramp-up + 1m steady + 30s ramp-down) |
| Ramp-up | 5 VU over 30s |
| Steady State | 10 VU for 1 minute |
| Ramp-down | 0 VU over 30s |
| Request Target | ~600 iterations |
| Endpoint Calls | 6 endpoints × 600 iterations = ~3600 requests |

**Endpoint Breakdown:**
- `/api/health`: 600 calls
- `/api/v1/characters`: 600 calls
- `/api/v1/characters?page=1&limit=10`: 600 calls
- `/api/v1/characters?filter[element]=Fire`: 600 calls
- `/api/v1/characters?filter[role]=DPS`: 600 calls
- `/api/v1/characters?sortBy=name&order=asc`: 600 calls

**Total Requests:** ~3600

---

### Peak Load Test

| Parameter | Value |
|-----------|-------|
| VU Count | 50 (peak) |
| Duration | 3 minutes (30s ramp-up + 2m steady + 30s ramp-down) |
| Ramp-up | 20 VU over 30s |
| Steady State | 50 VU for 2 minutes |
| Ramp-down | 0 VU over 30s |
| Request Target | ~6000 iterations |
| Endpoint Calls | 7 endpoints × 6000 iterations = ~42000 requests |

**Endpoint Breakdown:**
- `/api/health`: 6000 calls
- `/api/v1/characters`: 6000 calls
- `/api/v1/characters?page=1&limit=10`: 6000 calls
- `/api/v1/characters?filter[element]=Fire`: 6000 calls
- `/api/v1/characters?filter[role]=DPS`: 6000 calls
- `/api/v1/characters?sortBy=name&order=asc`: 6000 calls
- `/api/v1/characters?filter[element]=Fire&sortBy=popularity&order=desc`: 6000 calls

**Total Requests:** ~42000

---

### Stress Test

| Parameter | Value |
|-----------|-------|
| VU Count | 100 (peak) |
| Duration | 4.5 minutes (30s + 1m + 1m + 1m + 30s) |
| Ramp-up Phase 1 | 10 VU over 30s |
| Ramp-up Phase 2 | 30 VU over 1 minute |
| High Load | 60 VU for 1 minute |
| Stress | 100 VU for 1 minute |
| Ramp-down | 0 VU over 30s |
| Request Target | ~13500 iterations |
| Endpoint Calls | 5 endpoints × 13500 iterations = ~67500 requests |

**Endpoint Breakdown:**
- `/api/health`: 13500 calls
- `/api/v1/characters`: 13500 calls
- `/api/v1/characters?page=1&limit=10`: 13500 calls
- `/api/v1/characters?filter[element]=Fire`: 13500 calls
- `/api/v1/characters?sortBy=name&order=asc`: 13500 calls

**Total Requests:** ~67500

---

## 4. Test Coverage Summary

| Test | VU | Duration | Total Requests | Endpoints Tested |
|------|-----|----------|----------------|------------------|
| Baseline | 1 | 30s | ~150 | 5 |
| Moderate | 10 | 2m | ~3600 | 6 |
| Peak | 50 | 3m | ~42000 | 7 |
| Stress | 100 | 4.5m | ~67500 | 5 |
| **Total** | - | **10m** | **~113250** | **7 unique** |

---

## 5. Validation Checklist

- [x] All test endpoints match existing API routes
- [x] All query parameters are supported by the API
- [x] Thresholds are appropriate for each load level
- [x] Test scenarios are clearly defined
- [x] VU counts are realistic
- [x] Durations are sufficient for meaningful results
- [x] Ramp-up/down phases are included
- [x] Total request counts are documented

---

## 6. Next Steps

1. Run baseline test and collect results
2. Run moderate load test and collect results
3. Run peak load test and collect results
4. Run stress test and collect results
5. Analyze results against thresholds
6. Generate HTML reports
7. Create evidence files in `docs/validation/evidence/performance/`
8. Write RC-3 final report

---

**Status:** ✅ Script validation complete, ready for execution
