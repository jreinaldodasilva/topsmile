import request from 'supertest';
import express from 'express';
import authRoutes from '../../../src/routes/auth';
import { createTestClinic, createTestUser } from '../../helpers/factories';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  let testClinic: any;

  beforeEach(async () => {
    testClinic = await createTestClinic();
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      await createTestUser(testClinic, {
        email: 'test@example.com',
        password: 'Password123!'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrong'
        });

      expect(response.status).toBe(401);
    });
  });
});
