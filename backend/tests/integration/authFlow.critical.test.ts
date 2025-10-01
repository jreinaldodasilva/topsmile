import request from 'supertest';
import express from 'express';
import { User } from '../../src/models/User';
import { RefreshToken } from '../../src/models/RefreshToken';
import authRoutes from '../../src/routes/auth';
import { errorHandler } from '../../src/middleware/errorHandler';

// Create test app with real middleware stack
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(errorHandler);

describe('Critical Authentication Flow Integration Tests', () => {
  beforeEach(async () => {
    // Clean database before each test
    await User.deleteMany({});
    await RefreshToken.deleteMany({});
  });

  describe('Complete Authentication Flow', () => {
    it('should complete full registration -> login -> refresh -> logout flow', async () => {
      const userData = {
        name: 'Integration Test User',
        email: 'integration@example.com',
        password: 'SecurePass123!'
      };

      // 1. Register
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.data.user.email).toBe(userData.email);
      expect(registerResponse.body.data.accessToken).toBeDefined();
      expect(registerResponse.body.data.refreshToken).toBeDefined();

      const { accessToken, refreshToken } = registerResponse.body.data;

      // 2. Verify access token works
      const meResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(meResponse.body.data.email).toBe(userData.email);

      // 3. Login with same credentials
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
      const newRefreshToken = loginResponse.body.data.refreshToken;

      // 4. Refresh access token
      const refreshResponse = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: newRefreshToken })
        .expect(200);

      expect(refreshResponse.body.data.accessToken).toBeDefined();
      expect(refreshResponse.body.data.refreshToken).toBeDefined();
      expect(refreshResponse.body.data.refreshToken).not.toBe(newRefreshToken); // Token rotation

      // 5. Logout
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${refreshResponse.body.data.accessToken}`)
        .send({ refreshToken: refreshResponse.body.data.refreshToken })
        .expect(200);

      expect(logoutResponse.body.success).toBe(true);

      // 6. Verify old refresh token no longer works
      await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: refreshResponse.body.data.refreshToken })
        .expect(401);
    });

    it('should handle password change flow correctly', async () => {
      const userData = {
        name: 'Password Change User',
        email: 'passchange@example.com',
        password: 'OldPass123!'
      };

      // Register user
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const { accessToken } = registerResponse.body.data;

      // Change password
      const newPassword = 'NewPass123!';
      await request(app)
        .patch('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          currentPassword: userData.password,
          newPassword
        })
        .expect(200);

      // Old password should not work
      await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(401);

      // New password should work
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: newPassword
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });

    it('should handle password reset flow correctly', async () => {
      const userData = {
        name: 'Password Reset User',
        email: 'reset@example.com',
        password: 'OldPass123!'
      };

      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Request password reset
      const forgotResponse = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: userData.email })
        .expect(200);

      expect(forgotResponse.body.success).toBe(true);

      // Get reset token from database (in real app, this would be sent via email)
      const user = await User.findOne({ email: userData.email }).select('+passwordResetToken');
      expect(user?.passwordResetToken).toBeDefined();

      // Generate the original token (before hashing)
      // Note: In real implementation, you'd get this from email
      // For testing, we'll create a new reset request to get the token
      const consoleLogSpy = jest.spyOn(console, 'log');
      await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: userData.email });

      // Extract token from console log (this is test-specific)
      const logCalls = consoleLogSpy.mock.calls;
      const tokenLog = logCalls.find(call => 
        call[0]?.includes('Password reset token for')
      );
      
      if (!tokenLog) {
        throw new Error('Reset token not found in logs');
      }

      const resetToken = tokenLog[0].split(': ')[1];
      consoleLogSpy.mockRestore();

      // Reset password with token
      const newPassword = 'ResetPass123!';
      await request(app)
        .post(`/api/auth/reset-password/${resetToken}`)
        .send({ newPassword })
        .expect(200);

      // Old password should not work
      await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        })
        .expect(401);

      // New password should work
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: newPassword
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });
  });

  describe('Security and Error Handling', () => {
    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle extremely large payloads', async () => {
      const largePayload = {
        name: 'x'.repeat(10000),
        email: 'large@example.com',
        password: 'Pass123!'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(largePayload)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle concurrent registration attempts with same email', async () => {
      const userData = {
        name: 'Concurrent User',
        email: 'concurrent@example.com',
        password: 'Pass123!'
      };

      // Make concurrent registration requests
      const promises = Array(5).fill(null).map(() =>
        request(app)
          .post('/api/auth/register')
          .send(userData)
      );

      const results = await Promise.allSettled(promises);

      // Only one should succeed (201), others should fail (409)
      const successes = results.filter(r => 
        r.status === 'fulfilled' && r.value.status === 201
      );
      const conflicts = results.filter(r => 
        r.status === 'fulfilled' && r.value.status === 409
      );

      expect(successes.length).toBe(1);
      expect(conflicts.length).toBe(4);
    });

    it('should handle database connection errors gracefully', async () => {
      // Mock database error
      const originalFindOne = User.findOne;
      User.findOne = jest.fn().mockRejectedValue(new Error('Database connection lost'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Pass123!'
        })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro interno do servidor');

      // Restore original method
      User.findOne = originalFindOne;
    });

    it('should validate input sanitization', async () => {
      const maliciousData = {
        name: '<script>alert("xss")</script>',
        email: 'test@example.com',
        password: 'Pass123!'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(maliciousData)
        .expect(201);

      // Name should be sanitized
      expect(response.body.data.user.name).not.toContain('<script>');
    });

    it('should handle missing required fields', async () => {
      const testCases = [
        { email: 'test@example.com' }, // Missing password
        { password: 'Pass123!' }, // Missing email
        {}, // Missing both
        { email: '', password: 'Pass123!' }, // Empty email
        { email: 'test@example.com', password: '' } // Empty password
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/auth/login')
          .send(testCase)
          .expect(400);

        expect(response.body.success).toBe(false);
      }
    });

    it('should handle invalid email formats', async () => {
      const invalidEmails = [
        'not-an-email',
        '@example.com',
        'test@',
        'test..test@example.com',
        'test@example',
        'test@.com'
      ];

      for (const email of invalidEmails) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Test User',
            email,
            password: 'Pass123!'
          })
          .expect(400);

        expect(response.body.success).toBe(false);
      }
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce login rate limits', async () => {
      const loginData = {
        email: 'ratelimit@example.com',
        password: 'wrongpassword'
      };

      // Make multiple failed login attempts
      const promises = Array(6).fill(null).map(() =>
        request(app)
          .post('/api/auth/login')
          .send(loginData)
      );

      const results = await Promise.all(promises);

      // Last request should be rate limited (429)
      const rateLimited = results.some(r => r.status === 429);
      expect(rateLimited).toBe(true);
    });

    it('should enforce registration rate limits', async () => {
      // Make multiple registration attempts
      const promises = Array(4).fill(null).map((_, index) =>
        request(app)
          .post('/api/auth/register')
          .send({
            name: `User ${index}`,
            email: `user${index}@example.com`,
            password: 'Pass123!'
          })
      );

      const results = await Promise.all(promises);

      // Last request should be rate limited (429)
      const rateLimited = results.some(r => r.status === 429);
      expect(rateLimited).toBe(true);
    });
  });

  describe('Token Validation Edge Cases', () => {
    it('should reject tokens with null bytes', async () => {
      const tokenWithNull = 'Bearer token\x00with\x00nulls';

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', tokenWithNull)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should handle very long authorization headers', async () => {
      const longToken = 'Bearer ' + 'a'.repeat(10000);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', longToken)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should handle authorization header with special characters', async () => {
      const specialChars = 'Bearer token-with-special-chars!@#$%^&*()';

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', specialChars)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Session Management', () => {
    it('should handle logout from all devices', async () => {
      const userData = {
        name: 'Multi Device User',
        email: 'multidevice@example.com',
        password: 'Pass123!'
      };

      // Register user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Create multiple sessions (login multiple times)
      const loginPromises = Array(3).fill(null).map(() =>
        request(app)
          .post('/api/auth/login')
          .send({
            email: userData.email,
            password: userData.password
          })
      );

      const loginResults = await Promise.all(loginPromises);
      const tokens = loginResults.map(r => r.body.data);

      // Logout from all devices using first token
      await request(app)
        .post('/api/auth/logout-all')
        .set('Authorization', `Bearer ${tokens[0].accessToken}`)
        .expect(200);

      // All refresh tokens should be invalid now
      for (const token of tokens) {
        await request(app)
          .post('/api/auth/refresh')
          .send({ refreshToken: token.refreshToken })
          .expect(401);
      }
    });

    it('should handle expired access tokens gracefully', async () => {
      // Create an expired token
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMDAwMX0.invalid';

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Token');
    });
  });
});