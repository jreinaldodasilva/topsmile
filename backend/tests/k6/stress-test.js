import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'],
    http_req_failed: ['rate<0.1'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:5000';

export default function () {
  const endpoints = [
    '/api/auth/login',
    '/api/patients',
    '/api/providers',
    '/api/appointments'
  ];

  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  
  let response;
  if (endpoint === '/api/auth/login') {
    response = http.post(`${BASE_URL}${endpoint}`, JSON.stringify({
      email: 'test@example.com',
      password: 'TestPass123!'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    response = http.get(`${BASE_URL}${endpoint}`, {
      headers: { 'Authorization': 'Bearer test-token' }
    });
  }

  check(response, {
    'status is not 500': (r) => r.status !== 500,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });
}