import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { createTestClinic } from '../testHelpers';
import { Patient } from '../../src/models/Patient';
import { PatientUser } from '../../src/models/PatientUser';
import patientAuthRoutes from '../../src/routes/patientAuth';

// Create a test app with real middleware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Disable rate limiting for tests
process.env.NODE_ENV = 'test';

// Use real patient auth routes
app.use('/api/patient-auth', patientAuthRoutes);

describe('Patient Auth Routes Integration', () => {
  let testClinic: any;

  beforeEach(async () => {
    testClinic = await createTestClinic();
  });

  describe('POST /api/patient-auth/register', () => {
    it('should register a new patient user successfully', async () => {
      const registrationData = {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@example.com',
        phone: '11999999999',
        password: process.env.TEST_USER_PASSWORD || 'SecurePass123!',
        clinicId: testClinic._id.toString(),
        dateOfBirth: '1990-01-01'
      };

      const response = await request(app)
        .post('/api/patient-auth/register')
        .send(registrationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.patient).toBeDefined();
      expect(response.body.data.patientUser).toBeDefined();
      expect(response.body.data.requiresEmailVerification).toBe(true);
      
      // Check cookies are set
      const cookies = response.headers['set-cookie'] as unknown as string[];
      expect(cookies).toBeDefined();
      expect(cookies.some((cookie: string) => cookie.includes('patientAccessToken'))).toBe(true);
      expect(cookies.some((cookie: string) => cookie.includes('patientRefreshToken'))).toBe(true);
    });

    it('should register with existing patient ID', async () => {
      // Create existing patient
      const existingPatient = new Patient({
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria@example.com',
        phone: '11888888888',
        clinic: testClinic._id,
        status: 'active',
        address: { zipCode: '00000-000' },
        medicalHistory: { allergies: [], medications: [], conditions: [], notes: '' }
      });
      await existingPatient.save();

      const registrationData = {
        patientId: existingPatient._id.toString(),
        email: 'maria.portal@example.com',
        password: process.env.TEST_USER_PASSWORD || 'SecurePass123!',
        clinicId: testClinic._id.toString()
      };

      const response = await request(app)
        .post('/api/patient-auth/register')
        .send(registrationData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.patient.id).toBe(existingPatient._id.toString());
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        firstName: '',
        lastName: '',
        email: 'invalid-email',
        password: '123',
        clinicId: 'invalid-id'
      };

      const response = await request(app)
        .post('/api/patient-auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 for duplicate email', async () => {
      const registrationData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'duplicate@example.com',
        phone: '11999999999',
        password: process.env.TEST_USER_PASSWORD || 'SecurePass123!',
        clinicId: testClinic._id.toString()
      };

      // First registration
      await request(app)
        .post('/api/patient-auth/register')
        .send(registrationData)
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/patient-auth/register')
        .send(registrationData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('e-mail');
    });
  });

  describe('POST /api/patient-auth/login', () => {
    let testPatientUser: any;

    beforeEach(async () => {
      const registrationData = {
        firstName: 'Login',
        lastName: 'Test',
        email: 'login@example.com',
        phone: '11999999999',
        password: process.env.TEST_USER_PASSWORD || 'LoginPass123!',
        clinicId: testClinic._id.toString()
      };

      const response = await request(app)
        .post('/api/patient-auth/register')
        .send(registrationData);

      testPatientUser = response.body.data.patientUser;
    });

    it('should login with correct credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: process.env.TEST_USER_PASSWORD || 'LoginPass123!'
      };

      const response = await request(app)
        .post('/api/patient-auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.patient).toBeDefined();
      expect(response.body.data.patientUser).toBeDefined();
      
      // Check cookies are set
      const cookies = response.headers['set-cookie'] as unknown as string[];
      expect(cookies).toBeDefined();
      expect(cookies.some((cookie: string) => cookie.includes('patientAccessToken'))).toBe(true);
    });

    it('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/patient-auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'WrongPassword!'
      };

      const response = await request(app)
        .post('/api/patient-auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('incorretos');
    });
  });

  describe('POST /api/patient-auth/refresh', () => {
    let refreshTokenCookie: string;

    beforeEach(async () => {
      const registrationData = {
        firstName: 'Refresh',
        lastName: 'Test',
        email: 'refresh@example.com',
        phone: '11999999999',
        password: process.env.TEST_USER_PASSWORD || 'RefreshPass123!',
        clinicId: testClinic._id.toString()
      };

      const response = await request(app)
        .post('/api/patient-auth/register')
        .send(registrationData);

      const cookies = response.headers['set-cookie'] as unknown as string[];
      refreshTokenCookie = cookies.find((cookie: string) => 
        cookie.includes('patientRefreshToken')
      ) || '';
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/patient-auth/refresh')
        .set('Cookie', refreshTokenCookie)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.expiresIn).toBeDefined();
      
      // Check new access token cookie is set
      const cookies = response.headers['set-cookie'] as unknown as string[];
      expect(cookies.some((cookie: string) => cookie.includes('patientAccessToken'))).toBe(true);
    });

    it('should return 401 for missing refresh token', async () => {
      const response = await request(app)
        .post('/api/patient-auth/refresh')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('obrigatório');
    });
  });

  describe('GET /api/patient-auth/me', () => {
    let accessTokenCookie: string;

    beforeEach(async () => {
      const registrationData = {
        firstName: 'Me',
        lastName: 'Test',
        email: 'me@example.com',
        phone: '11999999999',
        password: process.env.TEST_USER_PASSWORD || 'MePass123!',
        clinicId: testClinic._id.toString()
      };

      const response = await request(app)
        .post('/api/patient-auth/register')
        .send(registrationData);

      const cookies = response.headers['set-cookie'] as unknown as string[];
      accessTokenCookie = cookies.find((cookie: string) => 
        cookie.includes('patientAccessToken')
      ) || '';
    });

    it('should return current patient profile', async () => {
      const response = await request(app)
        .get('/api/patient-auth/me')
        .set('Cookie', accessTokenCookie)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.patient).toBeDefined();
      expect(response.body.data.patientUser).toBeDefined();
      expect(response.body.data.patientUser.email).toBe('me@example.com');
    });

    it('should return 401 for missing token', async () => {
      const response = await request(app)
        .get('/api/patient-auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/patient-auth/profile', () => {
    let accessTokenCookie: string;

    beforeEach(async () => {
      const registrationData = {
        firstName: 'Profile',
        lastName: 'Test',
        email: 'profile@example.com',
        phone: '11999999999',
        password: process.env.TEST_USER_PASSWORD || 'ProfilePass123!',
        clinicId: testClinic._id.toString()
      };

      const response = await request(app)
        .post('/api/patient-auth/register')
        .send(registrationData);

      const cookies = response.headers['set-cookie'] as unknown as string[];
      accessTokenCookie = cookies.find((cookie: string) => 
        cookie.includes('patientAccessToken')
      ) || '';
    });

    it('should update patient profile successfully', async () => {
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '11888888888',
        dateOfBirth: '1985-05-15'
      };

      const response = await request(app)
        .patch('/api/patient-auth/profile')
        .set('Cookie', accessTokenCookie)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe(updateData.firstName);
      expect(response.body.data.lastName).toBe(updateData.lastName);
      // Phone gets formatted by the model, so check for formatted version
      expect(response.body.data.phone).toBe('(11) 88888-8888');
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        firstName: '', // Empty name
        lastName: '',
        phone: 'invalid-phone'
      };

      const response = await request(app)
        .patch('/api/patient-auth/profile')
        .set('Cookie', accessTokenCookie)
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('PATCH /api/patient-auth/change-password', () => {
    let accessTokenCookie: string;

    beforeEach(async () => {
      const registrationData = {
        firstName: 'Password',
        lastName: 'Test',
        email: 'password@example.com',
        phone: '11999999999',
        password: process.env.TEST_OLD_PASSWORD || 'OldPass123!',
        clinicId: testClinic._id.toString()
      };

      const response = await request(app)
        .post('/api/patient-auth/register')
        .send(registrationData);

      const cookies = response.headers['set-cookie'] as unknown as string[];
      accessTokenCookie = cookies.find((cookie: string) => 
        cookie.includes('patientAccessToken')
      ) || '';
    });

    it('should change password successfully', async () => {
      const changePasswordData = {
        currentPassword: process.env.TEST_OLD_PASSWORD || 'OldPass123!',
        newPassword: process.env.TEST_NEW_PASSWORD || 'NewPass123!'
      };

      const response = await request(app)
        .patch('/api/patient-auth/change-password')
        .set('Cookie', accessTokenCookie)
        .send(changePasswordData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('sucesso');
    });

    it('should return 400 for weak new password', async () => {
      const changePasswordData = {
        currentPassword: process.env.TEST_OLD_PASSWORD || 'OldPass123!',
        newPassword: 'weak'
      };

      const response = await request(app)
        .patch('/api/patient-auth/change-password')
        .set('Cookie', accessTokenCookie)
        .send(changePasswordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/patient-auth/logout', () => {
    let accessTokenCookie: string;
    let refreshTokenCookie: string;

    beforeEach(async () => {
      const registrationData = {
        firstName: 'Logout',
        lastName: 'Test',
        email: 'logout@example.com',
        phone: '11999999999',
        password: process.env.TEST_USER_PASSWORD || 'LogoutPass123!',
        clinicId: testClinic._id.toString()
      };

      const response = await request(app)
        .post('/api/patient-auth/register')
        .send(registrationData);

      const cookies = response.headers['set-cookie'] as unknown as string[];
      accessTokenCookie = cookies.find((cookie: string) => 
        cookie.includes('patientAccessToken')
      ) || '';
      refreshTokenCookie = cookies.find((cookie: string) => 
        cookie.includes('patientRefreshToken')
      ) || '';
    });

    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/patient-auth/logout')
        .set('Cookie', [accessTokenCookie, refreshTokenCookie])
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('sucesso');
      
      // Check cookies are cleared
      const cookies = response.headers['set-cookie'] as unknown as string[];
      expect(cookies).toBeDefined();
      expect(cookies.some((cookie: string) => 
        cookie.includes('patientAccessToken') && (cookie.includes('Max-Age=0') || cookie.includes('Expires=Thu, 01 Jan 1970'))
      )).toBe(true);
    });
  });
});