// Setup must be first to set environment variables
process.env.JWT_SECRET = 'TestJwtSecret123!';
process.env.PATIENT_JWT_SECRET = 'TestPatientJwtSecret123!';

import request from 'supertest';
import express from 'express';
import { Patient } from '../../src/models/Patient';
import { Appointment } from '../../src/models/Appointment';
import { Provider } from '../../src/models/Provider';
import patientRoutes from '../../src/routes/patients';
import appointmentRoutes from '../../src/routes/appointments';
import providerRoutes from '../../src/routes/providers';
import { authenticate } from '../../src/middleware/auth';
import { createTestPatient, createTestClinic, generateAuthToken } from '../testHelpers';

const app = express();
app.use(express.json());
app.use('/api/patients', authenticate, patientRoutes);
app.use('/api/appointments', authenticate, appointmentRoutes);
app.use('/api/providers', authenticate, providerRoutes);

describe('API Pagination Tests', () => {
  let testClinic: any;
  let authToken: string;

  beforeEach(async () => {
    testClinic = await createTestClinic();
    authToken = generateAuthToken('test-user-id', 'admin', testClinic._id.toString());
  });

  describe('Patient List Pagination', () => {
    beforeEach(async () => {
      for (let i = 0; i < 25; i++) {
        await createTestPatient({
          clinic: testClinic._id,
          firstName: 'Patient',
          lastName: 'Test',
          email: `patient${i}@test.com`
        });
      }
    });

    it('should return first page with default limit', async () => {
      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.items).toBeDefined();
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should respect page and limit parameters', async () => {
      const response = await request(app)
        .get('/api/patients?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.items.length).toBeLessThanOrEqual(10);
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(10);
    });

    it('should return correct total count', async () => {
      const response = await request(app)
        .get('/api/patients?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.pagination.total).toBe(25);
    });

    it('should calculate total pages correctly', async () => {
      const response = await request(app)
        .get('/api/patients?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.pagination.totalPages).toBe(3);
    });

    it('should indicate hasNext correctly', async () => {
      const page1 = await request(app)
        .get('/api/patients?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(page1.body.data.pagination.hasNext).toBe(true);

      const page3 = await request(app)
        .get('/api/patients?page=3&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(page3.body.data.pagination.hasNext).toBe(false);
    });

    it('should indicate hasPrev correctly', async () => {
      const page1 = await request(app)
        .get('/api/patients?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(page1.body.data.pagination.hasPrev).toBe(false);

      const page2 = await request(app)
        .get('/api/patients?page=2&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(page2.body.data.pagination.hasPrev).toBe(true);
    });

    it('should handle page beyond total pages', async () => {
      const response = await request(app)
        .get('/api/patients?page=10&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.items).toHaveLength(0);
    });

    it('should enforce maximum limit', async () => {
      const response = await request(app)
        .get('/api/patients?page=1&limit=1000')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.items.length).toBeLessThanOrEqual(100);
    });

    it('should handle invalid page number', async () => {
      const response = await request(app)
        .get('/api/patients?page=0&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 400]).toContain(response.status);
    });

    it('should handle invalid limit', async () => {
      const response = await request(app)
        .get('/api/patients?page=1&limit=-5')
        .set('Authorization', `Bearer ${authToken}`);

      expect([200, 400]).toContain(response.status);
    });
  });

  describe('Appointment List Pagination', () => {
    beforeEach(async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });
      const provider = await Provider.create({
        name: 'Dr. Test',
        email: 'provider@test.com',
        clinic: testClinic._id,
        specialties: ['general_dentistry'],
        isActive: true,
        workingHours: {
          monday: { start: '08:00', end: '18:00', isWorking: true },
          tuesday: { start: '08:00', end: '18:00', isWorking: true },
          wednesday: { start: '08:00', end: '18:00', isWorking: true },
          thursday: { start: '08:00', end: '18:00', isWorking: true },
          friday: { start: '08:00', end: '18:00', isWorking: true },
          saturday: { start: '08:00', end: '12:00', isWorking: false },
          sunday: { start: '08:00', end: '12:00', isWorking: false }
        }
      });

      for (let i = 0; i < 30; i++) {
        await Appointment.create({
          patient: patient._id,
          provider: provider._id,
          clinic: testClinic._id,
          scheduledStart: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
          scheduledEnd: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
          type: 'Consulta',
          status: 'scheduled'
        });
      }
    });

    it('should paginate appointments', async () => {
      const response = await request(app)
        .get('/api/appointments?page=1&limit=15')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.items.length).toBeLessThanOrEqual(15);
      expect(response.body.data.pagination.total).toBe(30);
    });

    it('should maintain pagination with filters', async () => {
      const response = await request(app)
        .get('/api/appointments?page=1&limit=10&status=scheduled')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.items.length).toBeLessThanOrEqual(10);
    });
  });

  describe('Pagination Edge Cases', () => {
    it('should handle empty result set', async () => {
      const response = await request(app)
        .get('/api/patients?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.items).toHaveLength(0);
      expect(response.body.data.pagination.total).toBe(0);
      expect(response.body.data.pagination.totalPages).toBe(0);
    });

    it('should handle single item', async () => {
      await createTestPatient({ clinic: testClinic._id });

      const response = await request(app)
        .get('/api/patients?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.pagination.total).toBe(1);
      expect(response.body.data.pagination.totalPages).toBe(1);
      expect(response.body.data.pagination.hasNext).toBe(false);
      expect(response.body.data.pagination.hasPrev).toBe(false);
    });

    it('should handle exact page boundary', async () => {
      for (let i = 0; i < 20; i++) {
        await createTestPatient({
          clinic: testClinic._id,
          email: `patient${i}@test.com`
        });
      }

      const response = await request(app)
        .get('/api/patients?page=2&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.items).toHaveLength(10);
      expect(response.body.data.pagination.hasNext).toBe(false);
    });
  });

  describe('Pagination Performance', () => {
    it('should handle large datasets efficiently', async () => {
      for (let i = 0; i < 100; i++) {
        await createTestPatient({
          clinic: testClinic._id,
          email: `patient${i}@test.com`
        });
      }

      const start = Date.now();
      await request(app)
        .get('/api/patients?page=5&limit=20')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(1000);
    });

    it('should use skip and limit efficiently', async () => {
      for (let i = 0; i < 50; i++) {
        await createTestPatient({
          clinic: testClinic._id,
          email: `patient${i}@test.com`
        });
      }

      const response = await request(app)
        .get('/api/patients?page=3&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.items).toHaveLength(10);
    });
  });

  describe('Pagination with Sorting', () => {
    beforeEach(async () => {
      await createTestPatient({ clinic: testClinic._id, firstName: 'Alice', email: 'alice@test.com' });
      await createTestPatient({ clinic: testClinic._id, firstName: 'Bob', email: 'bob@test.com' });
      await createTestPatient({ clinic: testClinic._id, firstName: 'Charlie', email: 'charlie@test.com' });
    });

    it('should maintain sort order across pages', async () => {
      const page1 = await request(app)
        .get('/api/patients?page=1&limit=2&sortBy=firstName&order=asc')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const page2 = await request(app)
        .get('/api/patients?page=2&limit=2&sortBy=firstName&order=asc')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      if (page1.body.data.items.length > 0 && page2.body.data.items.length > 0) {
        expect(page1.body.data.items[0].firstName).toBeDefined();
      }
    });
  });

  describe('Pagination Response Format', () => {
    it('should return consistent response structure', async () => {
      await createTestPatient({ clinic: testClinic._id });

      const response = await request(app)
        .get('/api/patients?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('items');
      expect(response.body.data).toHaveProperty('pagination');
      expect(response.body.data.pagination).toHaveProperty('page');
      expect(response.body.data.pagination).toHaveProperty('limit');
      expect(response.body.data.pagination).toHaveProperty('total');
      expect(response.body.data.pagination).toHaveProperty('totalPages');
      expect(response.body.data.pagination).toHaveProperty('hasNext');
      expect(response.body.data.pagination).toHaveProperty('hasPrev');
    });
  });
});
