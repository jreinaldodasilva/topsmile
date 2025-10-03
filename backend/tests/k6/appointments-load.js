import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '2m', target: 30 },
    { duration: '1m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:5000';
const AUTH_TOKEN = __ENV.AUTH_TOKEN || 'test-token';

export default function () {
  const params = {
    headers: {
      'Authorization': `Bearer ${AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
  };

  // Test appointment listing
  const listRes = http.get(`${BASE_URL}/api/appointments`, params);
  
  check(listRes, {
    'appointments list status is 200': (r) => r.status === 200,
    'appointments list response time < 300ms': (r) => r.timings.duration < 300,
  });

  // Test appointment creation
  const appointmentPayload = JSON.stringify({
    patientId: '507f1f77bcf86cd799439011',
    providerId: '507f1f77bcf86cd799439012',
    scheduledStart: new Date(Date.now() + 86400000).toISOString(),
    scheduledEnd: new Date(Date.now() + 90000000).toISOString(),
    type: 'Consulta',
    notes: 'Load test appointment'
  });

  const createRes = http.post(`${BASE_URL}/api/appointments`, appointmentPayload, params);
  
  check(createRes, {
    'appointment creation response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(2);
}