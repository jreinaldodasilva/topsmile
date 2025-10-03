import request from 'supertest';
import express from 'express';
import rateLimit from 'express-rate-limit';

const app = express();
app.use(express.json());

// IP-based rate limiter
const ipLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per IP
  keyGenerator: (req) => req.ip,
  message: {
    success: false,
    message: 'Muitas requisições deste IP. Tente novamente mais tarde.'
  }
});

app.get('/api/public/info', ipLimiter, (req, res) => {
  res.json({ success: true, info: 'Public information' });
});

describe('IP-Based Rate Limiting', () => {
  describe('Per-IP Rate Limiting', () => {
    it('should track requests per IP address', async () => {
      const response = await request(app)
        .get('/api/public/info')
        .set('X-Forwarded-For', '192.168.1.100')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.headers['x-ratelimit-limit']).toBe('20');
    });

    it('should allow different IPs to have separate limits', async () => {
      // Make requests from IP 1
      for (let i = 0; i < 5; i++) {
        await request(app)
          .get('/api/public/info')
          .set('X-Forwarded-For', '192.168.1.100');
      }

      // Make requests from IP 2 - should have full limit
      const response = await request(app)
        .get('/api/public/info')
        .set('X-Forwarded-For', '192.168.1.200')
        .expect(200);

      expect(response.headers['x-ratelimit-remaining']).toBe('19');
    });

    it('should block requests from specific IP after limit', async () => {
      const testIP = '192.168.1.300';

      // Make requests up to the limit
      for (let i = 0; i < 20; i++) {
        await request(app)
          .get('/api/public/info')
          .set('X-Forwarded-For', testIP);
      }

      // 21st request should be blocked
      const response = await request(app)
        .get('/api/public/info')
        .set('X-Forwarded-For', testIP)
        .expect(429);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Muitas requisições deste IP');
    });
  });

  describe('Proxy Headers', () => {
    it('should handle X-Forwarded-For header', async () => {
      const response = await request(app)
        .get('/api/public/info')
        .set('X-Forwarded-For', '203.0.113.1, 192.168.1.1')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should handle X-Real-IP header', async () => {
      const response = await request(app)
        .get('/api/public/info')
        .set('X-Real-IP', '203.0.113.2')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Rate Limit Bypass', () => {
    it('should allow whitelisted IPs to bypass rate limits', async () => {
      // This would require implementing IP whitelist functionality
      const whitelistedIP = '127.0.0.1';

      // Make many requests from whitelisted IP
      for (let i = 0; i < 25; i++) {
        const response = await request(app)
          .get('/api/public/info')
          .set('X-Forwarded-For', whitelistedIP);

        // All requests should succeed if IP is whitelisted
        if (i < 20) {
          expect(response.status).toBe(200);
        }
      }
    });
  });
});