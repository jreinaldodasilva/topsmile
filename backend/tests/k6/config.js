// K6 Configuration for TopSmile Performance Tests

export const config = {
  baseUrl: __ENV.API_URL || 'http://localhost:5000',
  
  // Performance thresholds
  thresholds: {
    light: {
      http_req_duration: ['p(95)<200'],
      http_req_failed: ['rate<0.01'],
    },
    medium: {
      http_req_duration: ['p(95)<500'],
      http_req_failed: ['rate<0.05'],
    },
    heavy: {
      http_req_duration: ['p(95)<1000'],
      http_req_failed: ['rate<0.1'],
    }
  },

  // Load patterns
  stages: {
    smoke: [
      { duration: '30s', target: 1 },
    ],
    load: [
      { duration: '1m', target: 10 },
      { duration: '2m', target: 10 },
      { duration: '1m', target: 0 },
    ],
    stress: [
      { duration: '2m', target: 50 },
      { duration: '5m', target: 50 },
      { duration: '2m', target: 100 },
      { duration: '5m', target: 100 },
      { duration: '2m', target: 0 },
    ]
  }
};

// Test data
export const testData = {
  users: [
    { email: 'test1@example.com', password: 'TestPass123!' },
    { email: 'test2@example.com', password: 'TestPass123!' },
    { email: 'test3@example.com', password: 'TestPass123!' },
  ],
  
  appointments: {
    types: ['Consulta', 'Limpeza', 'Tratamento de Canal', 'Extração'],
    durations: [30, 60, 90, 120]
  }
};