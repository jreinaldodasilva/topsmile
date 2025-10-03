import request from 'supertest';
import express from 'express';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { userSchema, apiResponseSchema, errorResponseSchema } from './schemas';

const ajv = new Ajv();
addFormats(ajv);

const validateUser = ajv.compile(userSchema);
const validateApiResponse = ajv.compile(apiResponseSchema);
const validateErrorResponse = ajv.compile(errorResponseSchema);

// Mock auth app
const app = express();
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@example.com' && password === 'correct') {
    res.json({
      success: true,
      data: {
        user: {
          _id: '507f1f77bcf86cd799439016',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          isActive: true,
          createdAt: '2024-01-01T10:00:00.000Z',
          updatedAt: '2024-01-01T10:00:00.000Z'
        },
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'refresh-token-123',
        expiresIn: 3600
      },
      meta: {
        timestamp: '2024-01-01T10:00:00.000Z',
        requestId: 'req-127'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciais inválidas'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Dados obrigatórios não fornecidos',
      errors: [
        { field: 'name', message: 'Nome é obrigatório', code: 'REQUIRED' }
      ]
    });
  }
  
  res.status(201).json({
    success: true,
    data: {
      user: {
        _id: '507f1f77bcf86cd799439017',
        name,
        email,
        role: 'patient',
        isActive: true,
        createdAt: '2024-01-01T10:00:00.000Z',
        updatedAt: '2024-01-01T10:00:00.000Z'
      },
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'refresh-token-124'
    },
    meta: {
      timestamp: '2024-01-01T10:00:00.000Z',
      requestId: 'req-128'
    }
  });
});

describe('Authentication API Contract Tests', () => {
  describe('POST /api/auth/login', () => {
    it('should return login response matching contract', async () => {
      const loginData = {
        email: 'admin@example.com',
        password: 'correct'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      // Validate API response structure
      expect(validateApiResponse(response.body)).toBe(true);
      
      // Validate user data structure
      expect(validateUser(response.body.data.user)).toBe(true);
      
      // Validate login-specific contract requirements
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.expiresIn).toBeGreaterThan(0);
      
      // Validate user fields
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.user.role).toBeDefined();
      expect(response.body.data.user.isActive).toBe(true);
    });

    it('should return error for invalid credentials', async () => {
      const invalidLogin = {
        email: 'admin@example.com',
        password: 'wrong'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(invalidLogin)
        .expect(401);

      // Validate error response structure
      expect(validateErrorResponse(response.body)).toBe(true);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Credenciais inválidas');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should create user with valid registration data', async () => {
      const registrationData = {
        name: 'João Silva',
        email: 'joao@example.com',
        password: 'SecurePass123!'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(registrationData)
        .expect(201);

      // Validate response structure
      expect(validateApiResponse(response.body)).toBe(true);
      expect(validateUser(response.body.data.user)).toBe(true);
      
      // Validate registration-specific requirements
      expect(response.body.data.user.name).toBe(registrationData.name);
      expect(response.body.data.user.email).toBe(registrationData.email);
      expect(response.body.data.user.role).toBe('patient');
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should return validation errors for incomplete data', async () => {
      const incompleteData = {
        email: 'test@example.com'
        // Missing name and password
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteData)
        .expect(400);

      // Validate error response structure
      expect(validateErrorResponse(response.body)).toBe(true);
      
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeInstanceOf(Array);
    });
  });

  describe('Token Contract Validation', () => {
    it('should validate JWT token structure', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'correct'
        });

      const { accessToken } = response.body.data;
      
      // JWT should have 3 parts separated by dots
      const tokenParts = accessToken.split('.');
      expect(tokenParts).toHaveLength(3);
      
      // Each part should be base64 encoded
      tokenParts.forEach(part => {
        expect(part).toMatch(/^[A-Za-z0-9_-]+$/);
      });
    });
  });

  describe('User Role Contract', () => {
    it('should only return valid user roles', async () => {
      const validRoles = ['admin', 'provider', 'patient', 'super_admin'];
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'correct'
        });

      expect(validRoles).toContain(response.body.data.user.role);
    });

    it('should reject invalid user roles in schema validation', async () => {
      const invalidUser = {
        _id: '507f1f77bcf86cd799439018',
        name: 'Test User',
        email: 'test@example.com',
        role: 'invalid_role', // Invalid role
        isActive: true,
        createdAt: '2024-01-01T10:00:00.000Z',
        updatedAt: '2024-01-01T10:00:00.000Z'
      };

      expect(validateUser(invalidUser)).toBe(false);
      expect(validateUser.errors).toBeDefined();
    });
  });
});