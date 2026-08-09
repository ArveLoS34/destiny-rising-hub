import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 1,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'], // Less than 1% of requests should fail
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // Test 1: Health Check
  const healthRes = http.get(`${BASE_URL}/api/health`);
  check(healthRes, {
    'health check status is 200': (r) => r.status === 200,
    'health check response is healthy': (r) => r.json().status === 'healthy',
  });
  sleep(1);

  // Test 2: Get All Characters
  const charactersRes = http.get(`${BASE_URL}/api/v1/characters`);
  check(charactersRes, {
    'characters list status is 200': (r) => r.status === 200,
    'characters list has data': (r) => r.json().data.length > 0,
  });
  sleep(1);

  // Test 3: Get Characters with Pagination
  const paginatedRes = http.get(`${BASE_URL}/api/v1/characters?page=1&limit=10`);
  check(paginatedRes, {
    'paginated characters status is 200': (r) => r.status === 200,
    'paginated response has pagination metadata': (r) => r.json().pagination !== undefined,
  });
  sleep(1);

  // Test 4: Filter Characters by Element
  const filterRes = http.get(`${BASE_URL}/api/v1/characters?filter[element]=Fire`);
  check(filterRes, {
    'filter status is 200': (r) => r.status === 200,
  });
  sleep(1);

  // Test 5: Sort Characters
  const sortRes = http.get(`${BASE_URL}/api/v1/characters?sortBy=name&order=asc`);
  check(sortRes, {
    'sort status is 200': (r) => r.status === 200,
  });
  sleep(1);
}
