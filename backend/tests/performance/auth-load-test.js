import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:5000';

export default function () {
  // Login
  const loginRes = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify({
    email: 'test@example.com',
    password: 'TestPassword123!'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login has token': (r) => r.cookies.accessToken !== undefined,
  });

  sleep(1);

  // Get user profile
  const cookies = loginRes.cookies;
  const meRes = http.get(`${BASE_URL}/api/auth/me`, {
    cookies: cookies,
  });

  check(meRes, {
    'me status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // Logout
  const logoutRes = http.post(`${BASE_URL}/api/auth/logout`, null, {
    cookies: cookies,
  });

  check(logoutRes, {
    'logout status is 200': (r) => r.status === 200,
  });

  sleep(1);
}
