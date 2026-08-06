import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const apiLatency = new Trend('api_latency');

export const options = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up to 20 users
    { duration: '2m', target: 50 },   // Stay at 50 users (peak)
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2000ms
    errors: ['rate<0.05'], // Less than 5% error rate
    http_req_failed: ['rate<0.05'],
    api_latency: ['p(95)<2000'],
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // Test 1: Health Check
  const healthStart = Date.now();
  const healthRes = http.get(`${BASE_URL}/api/health`);
  apiLatency.add(Date.now() - healthStart);
  const healthSuccess = check(healthRes, {
    'health check status is 200': (r) => r.status === 200,
  });
  errorRate.add(!healthSuccess);
  sleep(0.3);

  // Test 2: Get All Characters (most common operation)
  const charactersStart = Date.now();
  const charactersRes = http.get(`${BASE_URL}/api/v1/characters`);
  apiLatency.add(Date.now() - charactersStart);
  const charactersSuccess = check(charactersRes, {
    'characters list status is 200': (r) => r.status === 200,
    'characters list has data': (r) => r.json().data.length > 0,
  });
  errorRate.add(!charactersSuccess);
  sleep(0.3);

  // Test 3: Get Characters with Pagination
  const paginatedStart = Date.now();
  const paginatedRes = http.get(`${BASE_URL}/api/v1/characters?page=1&limit=10`);
  apiLatency.add(Date.now() - paginatedStart);
  const paginatedSuccess = check(paginatedRes, {
    'paginated characters status is 200': (r) => r.status === 200,
  });
  errorRate.add(!paginatedSuccess);
  sleep(0.3);

  // Test 4: Filter Characters by Element
  const filterStart = Date.now();
  const filterRes = http.get(`${BASE_URL}/api/v1/characters?filter[element]=Fire`);
  apiLatency.add(Date.now() - filterStart);
  const filterSuccess = check(filterRes, {
    'filter status is 200': (r) => r.status === 200,
  });
  errorRate.add(!filterSuccess);
  sleep(0.3);

  // Test 5: Filter Characters by Role
  const roleFilterStart = Date.now();
  const roleFilterRes = http.get(`${BASE_URL}/api/v1/characters?filter[role]=DPS`);
  apiLatency.add(Date.now() - roleFilterStart);
  const roleFilterSuccess = check(roleFilterRes, {
    'role filter status is 200': (r) => r.status === 200,
  });
  errorRate.add(!roleFilterSuccess);
  sleep(0.3);

  // Test 6: Sort Characters
  const sortStart = Date.now();
  const sortRes = http.get(`${BASE_URL}/api/v1/characters?sortBy=name&order=asc`);
  apiLatency.add(Date.now() - sortStart);
  const sortSuccess = check(sortRes, {
    'sort status is 200': (r) => r.status === 200,
  });
  errorRate.add(!sortSuccess);
  sleep(0.3);

  // Test 7: Combined Filter and Sort
  const combinedStart = Date.now();
  const combinedRes = http.get(`${BASE_URL}/api/v1/characters?filter[element]=Fire&sortBy=popularity&order=desc`);
  apiLatency.add(Date.now() - combinedStart);
  const combinedSuccess = check(combinedRes, {
    'combined filter+sort status is 200': (r) => r.status === 200,
  });
  errorRate.add(!combinedSuccess);
  sleep(0.3);
}
