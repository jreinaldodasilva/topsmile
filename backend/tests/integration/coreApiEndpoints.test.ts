import request from 'supertest';
import express from 'express';
import { User } from '../../src/models/User';
import { Patient } from '../../src/models/Patient';
import { Appointment } from '../../src/models/Appointment';
import { createTestUser, createTestClinic, createTestPatient, generateAuthToken } from '../testHelpers';
import appointmentRoutes from '../../src/routes/appointments';
import patientRoutes from '../../src/routes/patients';
import { authenticate } from '../../src/middleware/auth';
import { errorHandler } from '../../src/middleware/errorHandler';

// Create test app with real middleware stack
const app = express();
app.use(express.json());
app.use('/api/appointments', authenticate, appointmentRoutes);
app.use('/api/patients', authenticate, patientRoutes);
app.use(errorHandler);

describe('Core API Endpoints Integration Tests', () => {
  let testUser: any;
  let testClinic: any;
  let authToken: string;

  beforeEach(async () => {
    // Clean database
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});

    // Create test data
    testClinic = await createTestClinic();
    testUser = await createTestUser({
      name: 'Test Admin',
      email: 'admin@example.com',
      password: 'AdminPass123!',
      role: 'admin',
      clinic: testClinic._id
    });

    authToken = generateAuthToken(
      testUser._id.toString(),
      testUser.role,
      testClinic._id.toString(),
      testUser.email
    );
  });

  describe('Patient API Endpoints', () => {
    describe('POST /api/patients', () => {
      it('should create patient with valid data', async () => {
        const patientData = {
          firstName: 'João',
          lastName: 'Silva',
          email: 'joao@example.com',
          phone: '(11) 99999-9999',
          dateOfBirth: '1990-01-01',
          gender: 'male',
          cpf: '123.456.789-00'
        };

        const response = await request(app)
          .post('/api/patients')
          .set('Authorization', `Bearer ${authToken}`)
          .send(patientData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.firstName).toBe(patientData.firstName);
        expect(response.body.data.lastName).toBe(patientData.lastName);
        expect(response.body.data.email).toBe(patientData.email);
        expect(response.body.data.status).toBe('active');
      });

      it('should return 400 for missing required fields', async () => {
        const incompleteData = {
          firstName: 'João'
          // Missing lastName, phone, etc.
        };

        const response = await request(app)
          .post('/api/patients')
          .set('Authorization', `Bearer ${authToken}`)
          .send(incompleteData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBeDefined();
      });

      it('should return 409 for duplicate phone number', async () => {
        const patientData = {
          firstName: 'João',
          lastName: 'Silva',
          email: 'joao@example.com',
          phone: '(11) 99999-9999'
        };

        // Create first patient
        await request(app)
          .post('/api/patients')
          .set('Authorization', `Bearer ${authToken}`)
          .send(patientData)
          .expect(201);

        // Try to create second patient with same phone
        const duplicateData = {
          ...patientData,
          firstName: 'Maria',
          email: 'maria@example.com'
        };

        const response = await request(app)
          .post('/api/patients')
          .set('Authorization', `Bearer ${authToken}`)
          .send(duplicateData)
          .expect(409);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('telefone');
      });

      it('should return 401 without authentication', async () => {
        const patientData = {
          firstName: 'João',
          lastName: 'Silva',
          phone: '(11) 99999-9999'
        };

        await request(app)
          .post('/api/patients')
          .send(patientData)
          .expect(401);
      });
    });

    describe('GET /api/patients', () => {
      beforeEach(async () => {
        // Create test patients
        const patients = [
          { firstName: 'João', lastName: 'Silva', email: 'joao@example.com', phone: '(11) 99999-9999' },
          { firstName: 'Maria', lastName: 'Santos', email: 'maria@example.com', phone: '(11) 88888-8888' },
          { firstName: 'Pedro', lastName: 'Oliveira', email: 'pedro@example.com', phone: '(11) 77777-7777' }
        ];

        for (const patient of patients) {
          await createTestPatient({
            ...patient,
            clinic: testClinic._id
          });
        }
      });

      it('should return list of patients', async () => {
        const response = await request(app)
          .get('/api/patients')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.patients).toHaveLength(3);
        expect(response.body.data.total).toBe(3);
      });

      it('should support pagination', async () => {
        const response = await request(app)
          .get('/api/patients?page=1&limit=2')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.data.patients).toHaveLength(2);
        expect(response.body.data.hasNext).toBe(true);
        expect(response.body.data.hasPrev).toBe(false);
      });

      it('should support search functionality', async () => {
        const response = await request(app)
          .get('/api/patients?search=João')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.data.patients).toHaveLength(1);
        expect(response.body.data.patients[0].firstName).toBe('João');
      });

      it('should filter by status', async () => {
        // Deactivate one patient
        const allPatients = await Patient.find({ clinic: testClinic._id });
        await Patient.findByIdAndUpdate(allPatients[0]._id, { status: 'inactive' });

        const activeResponse = await request(app)
          .get('/api/patients?status=active')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(activeResponse.body.data.patients).toHaveLength(2);

        const inactiveResponse = await request(app)
          .get('/api/patients?status=inactive')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(inactiveResponse.body.data.patients).toHaveLength(1);
      });
    });

    describe('GET /api/patients/:id', () => {
      let testPatient: any;

      beforeEach(async () => {
        testPatient = await createTestPatient({
          firstName: 'João',
          lastName: 'Silva',
          email: 'joao@example.com',
          phone: '(11) 99999-9999',
          clinic: testClinic._id
        });
      });

      it('should return patient by ID', async () => {
        const response = await request(app)
          .get(`/api/patients/${testPatient._id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.firstName).toBe('João');
        expect(response.body.data.lastName).toBe('Silva');
      });

      it('should return 404 for non-existent patient', async () => {
        const nonExistentId = '507f1f77bcf86cd799439011';
        
        const response = await request(app)
          .get(`/api/patients/${nonExistentId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);

        expect(response.body.success).toBe(false);
      });

      it('should return 400 for invalid patient ID', async () => {
        const response = await request(app)
          .get('/api/patients/invalid-id')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(400);

        expect(response.body.success).toBe(false);
      });
    });

    describe('PUT /api/patients/:id', () => {
      let testPatient: any;

      beforeEach(async () => {
        testPatient = await createTestPatient({
          firstName: 'João',
          lastName: 'Silva',
          email: 'joao@example.com',
          phone: '(11) 99999-9999',
          clinic: testClinic._id
        });
      });

      it('should update patient information', async () => {
        const updateData = {
          firstName: 'João Updated',
          lastName: 'Silva Updated',
          phone: '(11) 88888-8888'
        };

        const response = await request(app)
          .put(`/api/patients/${testPatient._id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.firstName).toBe(updateData.firstName);
        expect(response.body.data.lastName).toBe(updateData.lastName);
        expect(response.body.data.phone).toBe(updateData.phone);
      });

      it('should prevent duplicate phone numbers', async () => {
        // Create another patient
        await createTestPatient({
          firstName: 'Maria',
          lastName: 'Santos',
          email: 'maria@example.com',
          phone: '(11) 88888-8888',
          clinic: testClinic._id
        });

        // Try to update first patient with second patient's phone
        const response = await request(app)
          .put(`/api/patients/${testPatient._id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ phone: '(11) 88888-8888' })
          .expect(409);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('telefone');
      });

      it('should return 404 for non-existent patient', async () => {
        const nonExistentId = '507f1f77bcf86cd799439011';
        
        const response = await request(app)
          .put(`/api/patients/${nonExistentId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ firstName: 'Updated' })
          .expect(404);

        expect(response.body.success).toBe(false);
      });
    });

    describe('DELETE /api/patients/:id', () => {
      let testPatient: any;

      beforeEach(async () => {
        testPatient = await createTestPatient({
          firstName: 'João',
          lastName: 'Silva',
          email: 'joao@example.com',
          phone: '(11) 99999-9999',
          clinic: testClinic._id
        });
      });

      it('should soft delete patient (set status to inactive)', async () => {
        const response = await request(app)
          .delete(`/api/patients/${testPatient._id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);

        // Verify patient is marked as inactive
        const updatedPatient = await Patient.findById(testPatient._id);
        expect(updatedPatient?.status).toBe('inactive');
      });

      it('should return 404 for non-existent patient', async () => {
        const nonExistentId = '507f1f77bcf86cd799439011';
        
        const response = await request(app)
          .delete(`/api/patients/${nonExistentId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(404);

        expect(response.body.success).toBe(false);
      });
    });
  });

  describe('Appointment API Endpoints', () => {
    let testPatient: any;
    let testProvider: any;

    beforeEach(async () => {
      testPatient = await createTestPatient({
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@example.com',
        phone: '(11) 99999-9999',
        clinic: testClinic._id
      });

      testProvider = await createTestUser({
        name: 'Dr. Maria',
        email: 'dr.maria@example.com',
        password: 'DoctorPass123!',
        role: 'dentist',
        clinic: testClinic._id
      });
    });

    describe('POST /api/appointments', () => {
      it('should create appointment with valid data', async () => {
        const appointmentData = {
          patient: testPatient._id.toString(),
          provider: testProvider._id.toString(),
          appointmentType: '507f1f77bcf86cd799439011',
          scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          scheduledEnd: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
          notes: 'Regular checkup',
          priority: 'routine'
        };

        const response = await request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .send(appointmentData)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data.patient).toBe(appointmentData.patient);
        expect(response.body.data.provider).toBe(appointmentData.provider);
        expect(response.body.data.status).toBe('scheduled');
        expect(response.body.data.notes).toBe(appointmentData.notes);
      });

      it('should return 400 for missing required fields', async () => {
        const incompleteData = {
          patient: testPatient._id.toString()
          // Missing other required fields
        };

        const response = await request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .send(incompleteData)
          .expect(400);

        expect(response.body.success).toBe(false);
      });

      it('should return 400 for past appointment dates', async () => {
        const appointmentData = {
          patient: testPatient._id.toString(),
          provider: testProvider._id.toString(),
          appointmentType: '507f1f77bcf86cd799439011',
          scheduledStart: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
          scheduledEnd: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          notes: 'Past appointment'
        };

        const response = await request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .send(appointmentData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('passado');
      });

      it('should detect conflicting appointments', async () => {
        const baseTime = Date.now() + 24 * 60 * 60 * 1000;
        
        // Create first appointment
        const firstAppointment = {
          patient: testPatient._id.toString(),
          provider: testProvider._id.toString(),
          appointmentType: '507f1f77bcf86cd799439011',
          scheduledStart: new Date(baseTime).toISOString(),
          scheduledEnd: new Date(baseTime + 60 * 60 * 1000).toISOString()
        };

        await request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .send(firstAppointment)
          .expect(201);

        // Try to create overlapping appointment
        const overlappingAppointment = {
          ...firstAppointment,
          patient: (await createTestPatient({ 
            firstName: 'Maria', 
            lastName: 'Santos',
            email: 'maria@example.com',
            phone: '(11) 88888-8888',
            clinic: testClinic._id 
          }))._id.toString(),
          scheduledStart: new Date(baseTime + 30 * 60 * 1000).toISOString(), // 30 min overlap
          scheduledEnd: new Date(baseTime + 90 * 60 * 1000).toISOString()
        };

        const response = await request(app)
          .post('/api/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .send(overlappingAppointment)
          .expect(409);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('indisponível');
      });
    });

    describe('GET /api/appointments', () => {
      beforeEach(async () => {
        // Create test appointments
        const baseTime = Date.now() + 24 * 60 * 60 * 1000;
        
        for (let i = 0; i < 3; i++) {
          await Appointment.create({
            patient: testPatient._id,
            provider: testProvider._id,
            appointmentType: '507f1f77bcf86cd799439011',
            scheduledStart: new Date(baseTime + i * 2 * 60 * 60 * 1000),
            scheduledEnd: new Date(baseTime + (i * 2 + 1) * 60 * 60 * 1000),
            clinic: testClinic._id,
            createdBy: testUser._id,
            status: i === 0 ? 'scheduled' : i === 1 ? 'confirmed' : 'completed'
          });
        }
      });

      it('should return list of appointments', async () => {
        const response = await request(app)
          .get('/api/appointments')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveLength(3);
      });

      it('should filter appointments by status', async () => {
        const response = await request(app)
          .get('/api/appointments?status=scheduled')
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.data).toHaveLength(1);
        expect(response.body.data[0].status).toBe('scheduled');
      });

      it('should filter appointments by provider', async () => {
        const response = await request(app)
          .get(`/api/appointments?providerId=${testProvider._id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.data).toHaveLength(3);
        response.body.data.forEach((appointment: any) => {
          expect(appointment.provider).toBe(testProvider._id.toString());
        });
      });

      it('should filter appointments by date range', async () => {
        const startDate = new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString();
        const endDate = new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString();

        const response = await request(app)
          .get(`/api/appointments?startDate=${startDate}&endDate=${endDate}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);

        expect(response.body.data.length).toBeGreaterThan(0);
      });
    });

    describe('PUT /api/appointments/:id', () => {
      let testAppointment: any;

      beforeEach(async () => {
        testAppointment = await Appointment.create({
          patient: testPatient._id,
          provider: testProvider._id,
          appointmentType: '507f1f77bcf86cd799439011',
          scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
          scheduledEnd: new Date(Date.now() + 25 * 60 * 60 * 1000),
          clinic: testClinic._id,
          createdBy: testUser._id,
          status: 'scheduled'
        });
      });

      it('should update appointment status', async () => {
        const response = await request(app)
          .put(`/api/appointments/${testAppointment._id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ status: 'confirmed' })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe('confirmed');
      });

      it('should update appointment notes', async () => {
        const newNotes = 'Updated appointment notes';
        
        const response = await request(app)
          .put(`/api/appointments/${testAppointment._id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ notes: newNotes })
          .expect(200);

        expect(response.body.data.notes).toBe(newNotes);
      });

      it('should reschedule appointment', async () => {
        const newStart = new Date(Date.now() + 48 * 60 * 60 * 1000);
        const newEnd = new Date(Date.now() + 49 * 60 * 60 * 1000);

        const response = await request(app)
          .put(`/api/appointments/${testAppointment._id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            scheduledStart: newStart.toISOString(),
            scheduledEnd: newEnd.toISOString()
          })
          .expect(200);

        expect(new Date(response.body.data.scheduledStart)).toEqual(newStart);
        expect(new Date(response.body.data.scheduledEnd)).toEqual(newEnd);
        expect(response.body.data.rescheduleHistory).toBeDefined();
      });

      it('should return 404 for non-existent appointment', async () => {
        const nonExistentId = '507f1f77bcf86cd799439011';
        
        const response = await request(app)
          .put(`/api/appointments/${nonExistentId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ status: 'confirmed' })
          .expect(404);

        expect(response.body.success).toBe(false);
      });
    });

    describe('DELETE /api/appointments/:id', () => {
      let testAppointment: any;

      beforeEach(async () => {
        testAppointment = await Appointment.create({
          patient: testPatient._id,
          provider: testProvider._id,
          appointmentType: '507f1f77bcf86cd799439011',
          scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
          scheduledEnd: new Date(Date.now() + 25 * 60 * 60 * 1000),
          clinic: testClinic._id,
          createdBy: testUser._id,
          status: 'scheduled'
        });
      });

      it('should cancel appointment', async () => {
        const response = await request(app)
          .delete(`/api/appointments/${testAppointment._id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ reason: 'Patient request' })
          .expect(200);

        expect(response.body.success).toBe(true);

        // Verify appointment is cancelled
        const updatedAppointment = await Appointment.findById(testAppointment._id);
        expect(updatedAppointment).toBeDefined();
        expect(updatedAppointment!.status).toBe('cancelled');
        expect(updatedAppointment!.cancellationReason).toBe('Patient request');
      });

      it('should return 404 for non-existent appointment', async () => {
        const nonExistentId = '507f1f77bcf86cd799439011';
        
        const response = await request(app)
          .delete(`/api/appointments/${nonExistentId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ reason: 'Test' })
          .expect(404);

        expect(response.body.success).toBe(false);
      });
    });
  });

  describe('Cross-Entity Operations', () => {
    it('should handle patient with appointments deletion', async () => {
      // Create patient
      const patient = await createTestPatient({
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@example.com',
        phone: '(11) 99999-9999',
        clinic: testClinic._id
      });

      // Create appointment for patient
      await Appointment.create({
        patient: patient._id,
        provider: testUser._id,
        appointmentType: '507f1f77bcf86cd799439011',
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 25 * 60 * 60 * 1000),
        clinic: testClinic._id,
        createdBy: testUser._id,
        status: 'scheduled'
      });

      // Delete patient (should be soft delete)
      const response = await request(app)
        .delete(`/api/patients/${patient._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Patient should be inactive but appointment should still exist
      const updatedPatient = await Patient.findById(patient._id);
      expect(updatedPatient?.status).toBe('inactive');

      const appointment = await Appointment.findOne({ patient: patient._id });
      expect(appointment).toBeDefined();
    });

    it('should handle concurrent operations gracefully', async () => {
      const patient = await createTestPatient({
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@example.com',
        phone: '(11) 99999-9999',
        clinic: testClinic._id
      });

      // Try to update patient concurrently
      const updatePromises = Array(5).fill(null).map((_, index) =>
        request(app)
          .put(`/api/patients/${patient._id}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({ firstName: `Updated${index}` })
      );

      const results = await Promise.allSettled(updatePromises);

      // At least one should succeed
      const successes = results.filter(r => r.status === 'fulfilled' && (r.value as any).status === 200);
      expect(successes.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed JSON requests', async () => {
      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle very large request payloads', async () => {
      const largePayload = {
        firstName: 'x'.repeat(10000),
        lastName: 'Silva',
        phone: '(11) 99999-9999'
      };

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .send(largePayload)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle database connection errors', async () => {
      // Mock database error
      const originalFind = Patient.find;
      Patient.find = jest.fn().mockRejectedValue(new Error('Database connection lost'));

      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro interno do servidor');

      // Restore original method
      Patient.find = originalFind;
    });

    it('should handle invalid ObjectId formats', async () => {
      const response = await request(app)
        .get('/api/patients/invalid-object-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle missing authorization header', async () => {
      const response = await request(app)
        .get('/api/patients')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should handle expired tokens', async () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMDAwMX0.invalid';

      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});