import request from 'supertest';
import app from '../../../src/app';
import { User } from '../../../src/models/User';
import { Appointment } from '../../../src/models/Appointment';
import { authService } from '../../../src/services/auth/authService';
import { connectToDatabase, closeDatabase } from '../../helpers/testSetup';

describe('Appointment Endpoints', () => {
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
    await Appointment.deleteMany({});
    await closeDatabase();
  });

  describe('GET /api/scheduling/appointments', () => {
    it('should list appointments', async () => {
      const response = await request(app)
        .get('/api/scheduling/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ startDate: '2024-01-01', endDate: '2024-12-31' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });

    it('should require date parameters', async () => {
      const response = await request(app)
        .get('/api/scheduling/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/scheduling/appointments', () => {
    it('should create appointment', async () => {
      const appointmentData = {
        patient: 'patient123',
        provider: 'provider123',
        appointmentType: 'type123',
        scheduledStart: new Date('2024-12-01T10:00:00Z').toISOString()
      };

      const response = await request(app)
        .post('/api/scheduling/appointments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(appointmentData)
        .expect(201);

      expect(response.body.success).toBe(true);
    });
  });

  describe('PATCH /api/scheduling/appointments/:id/status', () => {
    it('should update appointment status', async () => {
      const appointment = await Appointment.create({
        patient: 'patient123',
        provider: 'provider123',
        appointmentType: 'type123',
        scheduledStart: new Date('2024-12-01T10:00:00Z'),
        scheduledEnd: new Date('2024-12-01T11:00:00Z'),
        clinic: clinicId,
        status: 'scheduled'
      });

      const response = await request(app)
        .patch(`/api/scheduling/appointments/${appointment._id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'confirmed' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('confirmed');
    });
  });
});
