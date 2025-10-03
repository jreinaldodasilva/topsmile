import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { generateAuthToken } from '../testHelpers';
import { TEST_CREDENTIALS } from '../testConstants';

const app = express();
app.use(express.json());

// Mock auth middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }
  
  try {
    jwt.verify(token, TEST_CREDENTIALS.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

app.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Protected resource' });
});

describe('Authentication Security', () => {
  describe('JWT Token Validation', () => {
    it('should reject requests without token', async () => {
      const response = await request(app)
        .get('/protected')
        .expect(401);

      expect(response.body.message).toBe('Token required');
    });

    it('should reject invalid tokens', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });

    it('should accept valid tokens', async () => {
      const token = generateAuthToken('user123', 'admin');
      
      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toBe('Protected resource');
    });

    it('should reject expired tokens', async () => {
      const expiredToken = jwt.sign(
        { userId: 'user123', role: 'admin' },
        TEST_CREDENTIALS.JWT_SECRET,
        { expiresIn: '-1h' }
      );

      const response = await request(app)
        .get('/protected')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });
  });

  describe('Authorization Header Security', () => {
    it('should handle malformed authorization headers', async () => {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Malformed header')
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });

    it('should handle missing Bearer prefix', async () => {
      const token = generateAuthToken('user123', 'admin');
      
      const response = await request(app)
        .get('/protected')
        .set('Authorization', token)
        .expect(401);

      expect(response.body.message).toBe('Invalid token');
    });
  });
});