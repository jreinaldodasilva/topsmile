import request from 'supertest';
import app from '../../../src/app';
import { User } from '../../../src/models/User';
import { connectToDatabase, closeDatabase } from '../../helpers/testSetup';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
        role: 'admin',
        clinicId: 'clinic123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
    });

    it('should reject duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'Password123!',
        name: 'Test User',
        role: 'admin',
        clinicId: 'clinic123'
      };

      await request(app).post('/api/auth/register').send(userData);

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const userData = {
        email: 'login@example.com',
        password: 'Password123!',
        name: 'Test User',
        role: 'admin',
        clinicId: 'clinic123'
      };

      await request(app).post('/api/auth/register').send(userData);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: userData.email, password: userData.password })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'wrong@example.com', password: 'wrongpass' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
