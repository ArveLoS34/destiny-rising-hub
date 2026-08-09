import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';
import { check as diagnosticCheck } from 'k6/http';

// Custom metrics
const errorRate = new Rate('errors');
const apiLatency = new Trend('api_latency');
const requestCount = new Counter('request_count');
const rateLimitBlocked = new Counter('rate_limit_blocked');
const serverErrors = new Counter('server_errors');

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Warm up
    { duration: '1m', target: 30 },    // Increase
    { duration: '1m', target: 60 },    // High load
    { duration: '1m', target: 100 },   // Stress
    { duration: '30s', target: 0 },    // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    errors: ['rate<0.10'],
    http_req_failed: ['rate<0.10'],
  },
};

const BASE_URL = 'http://localhost:3000';
const DIAGNOSTIC_INTERVAL = 10; // Check diagnostics every 10 iterations

let iterationCount = 0;

export default function () {
  iterationCount++;
  requestCount.add(1);
  
  // Periodically check diagnostic endpoint
  if (iterationCount % DIAGNOSTIC_INTERVAL === 0) {
    const diagRes = http.get(`${BASE_URL}/api/debug/performance`);
    if (diagRes.status === 200) {
      const diagData = diagRes.json();
      console.log(`[Diagnostic] Rate limit stats: ${JSON.stringify(diagData.data.rateLimit)}`);
    }
  }

  // Test 1: Health Check
  const healthStart = Date.now();
  const healthRes = http.get(`${BASE_URL}/api/health`);
  apiLatency.add(Date.now() - healthStart);
  
  const healthSuccess = check(healthRes, {
    'health check status is 200': (r) => r.status === 200,
  });
  
  if (!healthSuccess) {
    if (healthRes.status === 429) {
      rateLimitBlocked.add(1);
      console.log(`[Rate Limit Blocked] Health endpoint blocked`);
    } else if (healthRes.status >= 500) {
      serverErrors.add(1);
      console.log(`[Server Error] Health endpoint returned ${healthRes.status}`);
    }
  }
  
  errorRate.add(!healthSuccess);

  // Test 2: Get All Characters (most common operation)
  const charactersStart = Date.now();
  const charactersRes = http.get(`${BASE_URL}/api/v1/characters`);
  apiLatency.add(Date.now() - charactersStart);
  
  const charactersSuccess = check(charactersRes, {
    'characters list status is 200': (r) => r.status === 200,
    'characters list has data': (r) => {
      try {
        const json = r.json();
        return json.success === true && Array.isArray(json.data) && json.data.length > 0;
      } catch (e) {
        return false;
      }
    },
  });
  
  if (!charactersSuccess) {
    if (charactersRes.status === 429) {
      rateLimitBlocked.add(1);
      console.log(`[Rate Limit Blocked] Characters endpoint blocked`);
    } else if (charactersRes.status >= 500) {
      serverErrors.add(1);
      console.log(`[Server Error] Characters endpoint returned ${charactersRes.status}`);
    } else {
      console.log(`[Error] Characters endpoint returned ${charactersRes.status}: ${charactersRes.body}`);
    }
  }
  
  errorRate.add(!charactersSuccess);

  // Test 3: Get Characters with Pagination
  const paginatedStart = Date.now();
  const paginatedRes = http.get(`${BASE_URL}/api/v1/characters?page=1&limit=10`);
  apiLatency.add(Date.now() - paginatedStart);
  
  const paginatedSuccess = check(paginatedRes, {
    'paginated characters status is 200': (r) => r.status === 200,
  });
  
  if (!paginatedSuccess && paginatedRes.status === 429) {
    rateLimitBlocked.add(1);
  }
  
  errorRate.add(!paginatedSuccess);

  // Test 4: Filter Characters
  const filterStart = Date.now();
  const filterRes = http.get(`${BASE_URL}/api/v1/characters?filter[element]=Fire`);
  apiLatency.add(Date.now() - filterStart);
  
  const filterSuccess = check(filterRes, {
    'filter status is 200': (r) => r.status === 200,
  });
  
  if (!filterSuccess && filterRes.status === 429) {
    rateLimitBlocked.add(1);
  }
  
  errorRate.add(!filterSuccess);

  // Test 5: Sort Characters
  const sortStart = Date.now();
  const sortRes = http.get(`${BASE_URL}/api/v1/characters?sortBy=name&order=asc`);
  apiLatency.add(Date.now() - sortStart);
  
  const sortSuccess = check(sortRes, {
    'sort status is 200': (r) => r.status === 200,
  });
  
  if (!sortSuccess && sortRes.status === 429) {
    rateLimitBlocked.add(1);
  }
  
  errorRate.add(!sortSuccess);

  // Small sleep to simulate real user behavior
  sleep(0.2);
}

export function handleSummary(data) {
  return {
    'stdout': textSummary(data, { indent: ' ', enableColors: true }),
    'tests/performance/results/stress-test-diagnostic.json': JSON.stringify(data, null, 2),
  };
}

function textSummary(data, opts) {
  let summary = '\n=== Stress Test Diagnostic Summary ===\n\n';
  summary += `Total Requests: ${data.metrics.request_count?.values?.count || 0}\n`;
  summary += `Error Rate: ${((data.metrics.errors?.values?.rate || 0) * 100).toFixed(2)}%\n`;
  summary += `Rate Limit Blocked: ${data.metrics.rate_limit_blocked?.values?.count || 0}\n`;
  summary += `Server Errors: ${data.metrics.server_errors?.values?.count || 0}\n`;
  summary += `p95 Latency: ${data.metrics.http_req_duration?.values?.['p(95)']?.toFixed(2) || 0}ms\n`;
  summary += '\n========================================\n';
  return summary;
}
