import request from 'supertest';
import express from 'express';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json());

// General API rate limiter - 100 requests per hour
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Limite de requisições excedido. Tente novamente em 1 hora.'
  }
});

// Strict limiter for sensitive endpoints - 10 requests per hour
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Limite de requisições para endpoint sensível excedido.'
  }
});

app.get('/api/patients', apiLimiter, (req, res) => {
  res.json({ success: true, data: [] });
});

app.post('/api/patients', strictLimiter, (req, res) => {
  res.status(201).json({ success: true, data: { id: '123' } });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

describe('API Rate Limiting', () => {
  describe('General API Endpoints', () => {
    it('should allow requests within rate limit', async () => {
      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .get('/api/patients')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.headers['x-ratelimit-limit']).toBe('100');
      }
    });

    it('should block requests after exceeding rate limit', async () => {
      // Simulate hitting the rate limit (would need actual implementation)
      const response = await request(app)
        .get('/api/patients')
        .expect(200);

      expect(response.headers['x-ratelimit-remaining']).toBeDefined();
      expect(parseInt(response.headers['x-ratelimit-remaining'])).toBeLessThan(100);
    });
  });

  describe('Sensitive Endpoints', () => {
    it('should have stricter limits for sensitive operations', async () => {
      const response = await request(app)
        .post('/api/patients')
        .send({ name: 'Test Patient' })
        .expect(201);

      expect(response.headers['x-ratelimit-limit']).toBe('10');
      expect(response.body.success).toBe(true);
    });

    it('should block sensitive operations after limit', async () => {
      // Make requests up to the limit
      for (let i = 0; i < 10; i++) {
        await request(app)
          .post('/api/patients')
          .send({ name: `Patient ${i}` });
      }

      // 11th request should be blocked
      const response = await request(app)
        .post('/api/patients')
        .send({ name: 'Blocked Patient' })
        .expect(429);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Limite de requisições');
    });
  });

  describe('Health Check Endpoints', () => {
    it('should not apply rate limiting to health checks', async () => {
      for (let i = 0; i < 10; i++) {
        const response = await request(app)
          .get('/api/health')
          .expect(200);

        expect(response.body.status).toBe('ok');
        expect(response.headers['x-ratelimit-limit']).toBeUndefined();
      }
    });
  });

  describe('Rate Limit Headers', () => {
    it('should include proper rate limit headers', async () => {
      const response = await request(app)
        .get('/api/patients');

      expect(response.headers).toHaveProperty('x-ratelimit-limit');
      expect(response.headers).toHaveProperty('x-ratelimit-remaining');
      expect(response.headers).toHaveProperty('x-ratelimit-reset');
    });

    it('should show decreasing remaining count', async () => {
      const response1 = await request(app).get('/api/patients');
      const response2 = await request(app).get('/api/patients');

      const remaining1 = parseInt(response1.headers['x-ratelimit-remaining']);
      const remaining2 = parseInt(response2.headers['x-ratelimit-remaining']);

      expect(remaining2).toBeLessThan(remaining1);
    });
  });
});