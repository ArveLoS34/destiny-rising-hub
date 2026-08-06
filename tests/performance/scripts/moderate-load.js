import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '30s', target: 5 },  // Ramp up to 5 users
    { duration: '1m', target: 10 },  // Stay at 10 users
    { duration: '30s', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests should be below 1000ms
    errors: ['rate<0.01'], // Less than 1% error rate
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // Test 1: Health Check
  const healthRes = http.get(`${BASE_URL}/api/health`);
  const healthSuccess = check(healthRes, {
    'health check status is 200': (r) => r.status === 200,
  });
  errorRate.add(!healthSuccess);
  sleep(0.5);

  // Test 2: Get All Characters (most common operation)
  const charactersRes = http.get(`${BASE_URL}/api/v1/characters`);
  const charactersSuccess = check(charactersRes, {
    'characters list status is 200': (r) => r.status === 200,
    'characters list has data': (r) => r.json().data.length > 0,
  });
  errorRate.add(!charactersSuccess);
  sleep(0.5);

  // Test 3: Get Single Character
  const characterRes = http.get(`${BASE_URL}/api/v1/characters/nova`);
  const characterSuccess = check(characterRes, {
    'character detail status is 200': (r) => r.status === 200,
  });
  errorRate.add(!characterSuccess);
  sleep(0.5);

  // Test 4: Filter Characters by Element
  const filterRes = http.get(`${BASE_URL}/api/v1/characters?filter[element]=Fire`);
  const filterSuccess = check(filterRes, {
    'filter status is 200': (r) => r.status === 200,
  });
  errorRate.add(!filterSuccess);
  sleep(0.5);

  // Test 5: Get Weapons
  const weaponsRes = http.get(`${BASE_URL}/api/v1/weapons`);
  const weaponsSuccess = check(weaponsRes, {
    'weapons list status is 200': (r) => r.status === 200,
  });
  errorRate.add(!weaponsSuccess);
  sleep(0.5);

  // Test 6: Get Materials
  const materialsRes = http.get(`${BASE_URL}/api/v1/materials`);
  const materialsSuccess = check(materialsRes, {
    'materials list status is 200': (r) => r.status === 200,
  });
  errorRate.add(!materialsSuccess);
  sleep(0.5);
}
