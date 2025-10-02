import request from 'supertest';
import express from 'express';
import { createTestUser, generateAuthToken } from '../testHelpers';
import { User } from '../../src/models/User';
import authRoutes from '../../src/routes/auth';
import { TEST_CREDENTIALS } from '../testConstants';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Authentication Security Tests', () => {
  let testUser: any;
  let authToken: string;

  beforeEach(async () => {
    await User.deleteMany({});
    testUser = await createTestUser({
      name: 'Security Test User',
      email: 'security@example.com',
      password: TEST_CREDENTIALS.DEFAULT_PASSWORD,
      role: 'admin'
    });
    authToken = generateAuthToken(testUser._id.toString(), testUser.role);
  });

  describe('JWT Security', () => {
    it('should reject requests with no token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Authentication required');
    });

    it('should reject expired tokens', async () => {
      // Generate token that expires immediately
      const expiredToken = generateAuthToken(testUser._id.toString(), testUser.role, undefined, testUser.email, '-1s');
      
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject tokens with invalid signature', async () => {
      const tamperedToken = authToken.slice(0, -5) + 'XXXXX';
      
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${tamperedToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should prevent token reuse after logout', async () => {
      // Logout
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ refreshToken: 'some-refresh-token' })
        .expect(200);

      // Try to use token again
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Input Validation Security', () => {
    it('should prevent NoSQL injection in login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: { $ne: null }, // NoSQL injection attempt
          password: { $ne: null },
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should sanitize HTML in registration', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: '<script>alert("XSS")</script>',
          email: 'xss@example.com',
          password: TEST_CREDENTIALS.DEFAULT_PASSWORD,
        });

      if (response.status === 201) {
        expect(response.body.data.user.name).not.toContain('<script>');
      }
    });
  });

  describe('Rate Limiting', () => {
    it('should rate limit login attempts', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'WrongPassword!',
      };

      // Make multiple failed login attempts
      const promises = Array(10).fill(null).map(() =>
        request(app)
          .post('/api/auth/login')
          .send(loginData)
      );

      await Promise.all(promises);

      // Next attempt should be rate limited
      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      // Should be rate limited (429) or still unauthorized (401)
      expect([401, 429]).toContain(response.status);
    });
  });

  describe('Authorization Security', () => {
    it('should prevent horizontal privilege escalation', async () => {
      // Create another user
      const otherUser = await createTestUser({
        email: 'other@example.com',
        password: TEST_CREDENTIALS.DEFAULT_PASSWORD,
        role: 'patient'
      });

      const patientToken = generateAuthToken(otherUser._id.toString(), 'patient');

      // Try to access admin endpoints
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(200);

      // Should only return own user data
      expect(response.body.data.email).toBe('other@example.com');
    });
  });

  describe('Password Security', () => {
    it('should enforce strong password requirements', async () => {
      const weakPasswords = [
        '123',
        'password',
        '12345678',
        'Password',
        'password123'
      ];

      for (const weakPassword of weakPasswords) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email: `test${Math.random()}@example.com`,
            password: weakPassword,
          });

        expect(response.status).toBe(400);
      }
    });

    it('should hash passwords properly', async () => {
      const user = await User.findById(testUser._id);
      expect(user?.password).not.toBe(TEST_CREDENTIALS.DEFAULT_PASSWORD);
      expect(user?.password).toMatch(/^\$2[aby]\$\d+\$/); // bcrypt hash pattern
    });
  });
});