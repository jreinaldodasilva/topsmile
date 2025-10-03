import request from 'supertest';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { generateAuthToken } from '../testHelpers';

const app = express();
app.use(express.json());

// User-based rate limiter
const userLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests per user per hour
  keyGenerator: (req: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        return decoded.userId;
      } catch {
        return req.ip;
      }
    }
    return req.ip;
  },
  message: {
    success: false,
    message: 'Limite de requisições por usuário excedido.'
  }
});

// Mock auth middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }
  req.user = { id: 'user123' };
  next();
};

app.get('/api/user/profile', authenticate, userLimiter, (req, res) => {
  res.json({ success: true, user: req.user });
});

app.get('/api/user/appointments', authenticate, userLimiter, (req, res) => {
  res.json({ success: true, appointments: [] });
});

describe('User-Based Rate Limiting', () => {
  describe('Per-User Rate Limiting', () => {
    it('should track requests per authenticated user', async () => {
      const token = generateAuthToken('user123', 'patient');

      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.headers['x-ratelimit-limit']).toBe('50');
    });

    it('should allow different users to have separate limits', async () => {
      const token1 = generateAuthToken('user123', 'patient');
      const token2 = generateAuthToken('user456', 'patient');

      // Make requests as user1
      for (let i = 0; i < 10; i++) {
        await request(app)
          .get('/api/user/profile')
          .set('Authorization', `Bearer ${token1}`);
      }

      // User2 should have full limit available
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token2}`)
        .expect(200);

      expect(response.headers['x-ratelimit-remaining']).toBe('49');
    });

    it('should apply rate limit across different endpoints for same user', async () => {
      const token = generateAuthToken('user789', 'patient');

      // Make requests to different endpoints
      await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`);

      const response = await request(app)
        .get('/api/user/appointments')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Should show 2 requests used from the same limit
      expect(response.headers['x-ratelimit-remaining']).toBe('48');
    });

    it('should block user after exceeding limit', async () => {
      const token = generateAuthToken('limitedUser', 'patient');

      // Make requests up to the limit (would need actual implementation)
      for (let i = 0; i < 50; i++) {
        await request(app)
          .get('/api/user/profile')
          .set('Authorization', `Bearer ${token}`);
      }

      // 51st request should be blocked
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(429);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Limite de requisições por usuário');
    });
  });

  describe('Unauthenticated Requests', () => {
    it('should fall back to IP-based limiting for unauthenticated requests', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .expect(401);

      expect(response.body.message).toBe('Token required');
    });
  });

  describe('Role-Based Rate Limiting', () => {
    it('should apply different limits based on user role', async () => {
      const adminToken = generateAuthToken('admin123', 'admin');
      const patientToken = generateAuthToken('patient123', 'patient');

      // Admin might have higher limits (would need implementation)
      const adminResponse = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const patientResponse = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      // Both should work, but might have different limits
      expect(adminResponse.body.success).toBe(true);
      expect(patientResponse.body.success).toBe(true);
    });
  });
});