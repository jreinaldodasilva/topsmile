import request from 'supertest';
import app from '../../../src/app';
import { User } from '../../../src/models/User';
import { Patient } from '../../../src/models/Patient';
import { authService } from '../../../src/services/auth/authService';
import { connectToDatabase, closeDatabase } from '../../helpers/testSetup';

describe('Patient Endpoints', () => {
  let authToken: string;
  let clinicId: string;

  beforeAll(async () => {
    await connectToDatabase();
    
    const user = await User.create({
      email: 'admin@test.com',
      password: 'hashedPassword',
      name: 'Admin',
      role: 'admin',
      clinicId: 'clinic123'
    });

    clinicId = user.clinicId;
    const loginResult = await authService.login('admin@test.com', 'hashedPassword');
    authToken = loginResult.accessToken;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Patient.deleteMany({});
    await closeDatabase();
  });

  describe('POST /api/patients', () => {
    it('should create patient', async () => {
      const patientData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '1234567890'
      };

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .send(patientData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe(patientData.firstName);
    });

    it('should reject unauthenticated request', async () => {
      await request(app)
        .post('/api/patients')
        .send({ firstName: 'Test' })
        .expect(401);
    });
  });

  describe('GET /api/patients', () => {
    it('should list patients', async () => {
      await Patient.create({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phone: '9876543210',
        clinic: clinicId
      });

      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.patients).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/patients/:id', () => {
    it('should get patient by id', async () => {
      const patient = await Patient.create({
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        phone: '5555555555',
        clinic: clinicId
      });

      const response = await request(app)
        .get(`/api/patients/${patient._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe('Bob');
    });
  });

  describe('PATCH /api/patients/:id', () => {
    it('should update patient', async () => {
      const patient = await Patient.create({
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice@example.com',
        phone: '1111111111',
        clinic: clinicId
      });

      const response = await request(app)
        .patch(`/api/patients/${patient._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ phone: '2222222222' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.phone).toBe('2222222222');
    });
  });
});
