import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const apiLatency = new Trend('api_latency');
const requestCount = new Counter('request_count');

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Warm up
    { duration: '1m', target: 30 },    // Increase
    { duration: '1m', target: 60 },    // High load
    { duration: '1m', target: 100 },   // Stress
    { duration: '30s', target: 0 },    // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'], // Allow up to 5s under stress
    errors: ['rate<0.10'], // Allow up to 10% error rate under stress
    http_req_failed: ['rate<0.10'],
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  requestCount.add(1);

  // Test 1: Health Check
  const healthStart = Date.now();
  const healthRes = http.get(`${BASE_URL}/api/health`);
  apiLatency.add(Date.now() - healthStart);
  const healthSuccess = check(healthRes, {
    'health check status is 200': (r) => r.status === 200,
  });
  errorRate.add(!healthSuccess);

  // Test 2: Get All Characters (most common operation)
  const charactersStart = Date.now();
  const charactersRes = http.get(`${BASE_URL}/api/v1/characters`);
  apiLatency.add(Date.now() - charactersStart);
  const charactersSuccess = check(charactersRes, {
    'characters list status is 200': (r) => r.status === 200,
  });
  errorRate.add(!charactersSuccess);

  // Test 3: Get Single Character
  const characterStart = Date.now();
  const characterRes = http.get(`${BASE_URL}/api/v1/characters/nova`);
  apiLatency.add(Date.now() - characterStart);
  const characterSuccess = check(characterRes, {
    'character detail status is 200': (r) => r.status === 200,
  });
  errorRate.add(!characterSuccess);

  // Test 4: Filter Characters
  const filterStart = Date.now();
  const filterRes = http.get(`${BASE_URL}/api/v1/characters?filter[element]=Fire`);
  apiLatency.add(Date.now() - filterStart);
  const filterSuccess = check(filterRes, {
    'filter status is 200': (r) => r.status === 200,
  });
  errorRate.add(!filterSuccess);

  // Test 5: Get Weapons
  const weaponsStart = Date.now();
  const weaponsRes = http.get(`${BASE_URL}/api/v1/weapons`);
  apiLatency.add(Date.now() - weaponsStart);
  const weaponsSuccess = check(weaponsRes, {
    'weapons list status is 200': (r) => r.status === 200,
  });
  errorRate.add(!weaponsSuccess);

  // Test 6: Get Materials
  const materialsStart = Date.now();
  const materialsRes = http.get(`${BASE_URL}/api/v1/materials`);
  apiLatency.add(Date.now() - materialsStart);
  const materialsSuccess = check(materialsRes, {
    'materials list status is 200': (r) => r.status === 200,
  });
  errorRate.add(!materialsSuccess);

  // Small sleep to simulate real user behavior
  sleep(0.2);
}
