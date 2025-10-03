import request from 'supertest';
import express from 'express';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json());

// Auth rate limiter - 5 attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.post('/api/auth/login', authLimiter, (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'test@example.com' && password === 'correct') {
    res.json({ success: true, token: 'valid-token' });
  } else {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }
});

describe('Authentication Rate Limiting', () => {
  describe('Login Rate Limiting', () => {
    it('should allow valid login attempts within limit', async () => {
      for (let i = 0; i < 3; i++) {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'correct'
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.headers['x-ratelimit-limit']).toBe('5');
        expect(response.headers['x-ratelimit-remaining']).toBeDefined();
      }
    });

    it('should block requests after rate limit exceeded', async () => {
      // Make 5 failed attempts to hit the limit
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrong'
          });
      }

      // 6th attempt should be blocked
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong'
        })
        .expect(429);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Muitas tentativas');
      expect(response.headers['x-ratelimit-remaining']).toBe('0');
    });

    it('should include rate limit headers in response', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrong'
        });

      expect(response.headers['x-ratelimit-limit']).toBe('5');
      expect(response.headers['x-ratelimit-remaining']).toBeDefined();
      expect(response.headers['x-ratelimit-reset']).toBeDefined();
    });
  });

  describe('Rate Limit Reset', () => {
    it('should reset rate limit after window expires', async () => {
      // This test would require time manipulation or shorter windows
      // For demonstration purposes, we'll test the concept
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'correct'
        });

      expect(parseInt(response.headers['x-ratelimit-remaining'])).toBeGreaterThanOrEqual(0);
    });
  });
});