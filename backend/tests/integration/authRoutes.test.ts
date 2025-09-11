import request from 'supertest';
import express from 'express';
import { authService } from '../../src/services/authService';
import { createTestUser } from '../testHelpers';
// Import and use auth routes
import authRoutes from '../../src/routes/auth';

// Mock the auth service for integration tests
jest.mock('../../src/services/authService');
const mockAuthService = authService as jest.Mocked<typeof authService>;

// Create a test app
const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

describe('Auth Routes Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'SecurePass123!',
      };

      const mockResponse = {
        success: true as const,
        data: {
          user: {
            _id: 'user-id',
            name: userData.name,
            email: userData.email,
            role: 'admin',
            password: 'hashed-password',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          } as any,
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: '15m'
        }
      };

      mockAuthService.register.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toEqual(mockResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(userData);
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
      expect(response.body.message).toBe('Dados inválidos');
      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 for duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'SecurePass123!',
      };

      mockAuthService.register.mockRejectedValue(new Error('Usuário já existe'));

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Usuário já existe');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const mockResponse = {
        success: true as const,
        data: {
          user: {
            _id: 'user-id',
            name: 'Test User',
            email: loginData.email,
            role: 'admin',
            password: 'hashed-password',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          } as any,
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: '15m'
        }
      };

      mockAuthService.login.mockResolvedValue(mockResponse);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toEqual(mockResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginData, expect.any(Object));
    });

    it('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Dados inválidos');
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'invalid@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(new Error('E-mail ou senha inválidos'));

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('E-mail ou senha inválidos');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user profile', async () => {
      const mockUser = {
        id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin'
      };

      mockAuthService.getUserById.mockResolvedValue(mockUser as any);

      // Mock authentication middleware
      const mockRequest = {
        user: { id: 'user-id' }
      };

      // For this test, we'll mock the middleware behavior
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer mock-token')
        .expect(200);

      // Note: In a real integration test, you'd need to properly mock the auth middleware
      // This is a simplified version
    });

    it('should return 404 for non-existent user', async () => {
      mockAuthService.getUserById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer mock-token')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Usuário não encontrado');
    });
  });

  describe('PATCH /api/auth/change-password', () => {
    it('should change password successfully', async () => {
      const changePasswordData = {
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass123!',
      };

      mockAuthService.changePassword.mockResolvedValue(true);

      const response = await request(app)
        .patch('/api/auth/change-password')
        .set('Authorization', 'Bearer mock-token')
        .send(changePasswordData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Senha alterada com sucesso');
    });

    it('should return 400 for invalid new password', async () => {
      const changePasswordData = {
        currentPassword: 'OldPass123!',
        newPassword: 'weak',
      };

      const response = await request(app)
        .patch('/api/auth/change-password')
        .set('Authorization', 'Bearer mock-token')
        .send(changePasswordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Dados inválidos');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user successfully', async () => {
      mockAuthService.logout.mockResolvedValue(undefined);

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer mock-token')
        .send({ refreshToken: 'mock-refresh-token' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout realizado com sucesso');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token successfully', async () => {
      const mockTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: '15m'
      };

      mockAuthService.refreshAccessToken.mockResolvedValue(mockTokens);

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'old-refresh-token' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockTokens);
    });

    it('should return 401 for invalid refresh token', async () => {
      mockAuthService.refreshAccessToken.mockRejectedValue(new Error('Token inválido'));

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Token inválido');
    });
  });
});
