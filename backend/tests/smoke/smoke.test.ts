import request from 'supertest';
import app from '../../src/app';

describe('Smoke Tests', () => {
  it('should return health check', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should return database health', async () => {
    const response = await request(app).get('/api/health/database');
    expect(response.status).toBeLessThan(503);
  });

  it('should return CSRF token', async () => {
    const response = await request(app).get('/api/csrf-token');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('csrfToken');
  });

  it('should handle 404', async () => {
    const response = await request(app).get('/api/nonexistent');
    expect(response.status).toBe(404);
  });

  it('should require auth for protected routes', async () => {
    const response = await request(app).get('/api/patients');
    expect(response.status).toBe(401);
  });
});
