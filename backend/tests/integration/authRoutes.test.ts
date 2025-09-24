import request from 'supertest';
import express from 'express';
import { createTestUser, generateAuthToken } from '../testHelpers';
import { User } from '../../src/models/User';
import { authenticate } from '../../src/middleware/auth';
// Import and use auth routes
import authRoutes from '../../src/routes/auth';

// Test constants using environment variables
const TEST_PASSWORDS = {
  SECURE: process.env.TEST_ADMIN_PASSWORD || 'SecurePass123!',
  TEST: process.env.TEST_USER_PASSWORD || 'TestPassword123!',
  NEW: process.env.TEST_NEW_PASSWORD || 'NewPass123!',
  LOGIN: process.env.TEST_USER_PASSWORD || 'LoginPass123!'
};

// Create a test app with real middleware
const app = express();
app.use(express.json());

// Use real auth routes
app.use('/api/auth', authRoutes);

describe('Auth Routes Integration', () => {
  let testUser: any;
  let authToken: string;

  beforeEach(async () => {
    // Ensure a clean state by deleting all users before each test
    await User.deleteMany({});
    testUser = await createTestUser({
      name: 'Test User',
      email: 'test@example.com',
      password: TEST_PASSWORDS.TEST,
      role: 'admin'
    });

    authToken = generateAuthToken(testUser._id.toString(), testUser.role, undefined, testUser.email);
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: TEST_PASSWORDS.SECURE,
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        password: '123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    it('should return 400 for duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com', // Same email as testUser
        password: TEST_PASSWORDS.SECURE,
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: TEST_PASSWORDS.TEST,
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user profile', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe(testUser.email);
      expect(response.body.data.name).toBe(testUser.name);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('PATCH /api/auth/change-password', () => {
    it('should change password successfully', async () => {
      const changePasswordData = {
        currentPassword: TEST_PASSWORDS.TEST,
        newPassword: TEST_PASSWORDS.NEW,
      };

      const response = await request(app)
        .patch('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(changePasswordData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeDefined();
    });

    it('should return 400 for invalid new password', async () => {
      const changePasswordData = {
        currentPassword: TEST_PASSWORDS.TEST,
        newPassword: 'weak',
      };

      const response = await request(app)
        .patch('/api/auth/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(changePasswordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ refreshToken: 'some-refresh-token' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeDefined();
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token successfully', async () => {
      // First login to get a valid refresh token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: TEST_PASSWORDS.TEST
        });

      const refreshToken = loginResponse.body.data.refreshToken;

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should return 401 for invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });
  });
});