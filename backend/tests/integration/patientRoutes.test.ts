// Mock the authenticate middleware before importing routes
const mockAuthenticate = jest.fn((req: any, res: any, next: any) => {
  // This will be updated in beforeEach with actual test data
  req.user = {
    id: 'mock-user-id',
    email: 'test@example.com',
    role: 'admin',
    clinicId: 'mock-clinic-id'
  };
  next();
});

const mockAuthorize = jest.fn(() => (req: any, res: any, next: any) => next());

jest.mock('../../src/middleware/auth', () => ({
  authenticate: mockAuthenticate,
  authorize: mockAuthorize,
  AuthenticatedRequest: {}
}));

import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import patientRoutes from '../../src/routes/patients';
import { User } from '../../src/models/User';
import { Patient } from '../../src/models/Patient';
import { Clinic } from '../../src/models/Clinic';
import { generateAuthToken } from '../testHelpers';

let app: express.Application;
let testUser: any;
let testClinic: any;
let accessToken: string;

beforeAll(async () => {
  // Create test app
  app = express();
  app.use(express.json());

  // Use patient routes
  app.use('/api/patients', patientRoutes);

  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error'
    });
  });
});

beforeEach(async () => {
  // Clear all collections
  await User.deleteMany({});
  await Patient.deleteMany({});
  await Clinic.deleteMany({});

  // Create test clinic
  testClinic = await Clinic.create({
    name: 'Test Clinic',
    email: 'clinic@test.com',
    phone: '11999999999',
    address: {
      street: 'Test Street',
      number: '123',
      neighborhood: 'Test Neighborhood',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345-678',
    settings: {
      workingHours: {
        monday: { start: '08:00', end: '18:00', isWorking: true },
        tuesday: { start: '08:00', end: '18:00', isWorking: true },
        wednesday: { start: '08:00', end: '18:00', isWorking: true },
        thursday: { start: '08:00', end: '18:00', isWorking: true },
        friday: { start: '08:00', end: '18:00', isWorking: true },
        saturday: { start: '08:00', end: '12:00', isWorking: true },
        sunday: { start: '00:00', end: '00:00', isWorking: false }
      }
    }
    }
  });

  // Create test user
  testUser = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPassword123!',
    role: 'admin',
    clinic: testClinic._id,
    isActive: true
  });

  // Generate access token
  accessToken = generateAuthToken(
    testUser._id.toString(),
    testUser.role,
    testClinic._id.toString()
  );

  // Update mock to use actual test data
  mockAuthenticate.mockImplementation((req: any, res: any, next: any) => {
    req.user = {
      id: testUser._id.toString(),
      email: testUser.email,
      role: testUser.role,
      clinicId: testClinic._id.toString()
    };
    next();
  });
});

describe('Patient Routes Integration Tests', () => {
  describe('POST /api/patients', () => {
    it('should create a patient successfully', async () => {
      const patientData = {
        firstName: 'João',
        lastName: 'Silva',
        phone: '11999999999',
        email: 'joao@example.com',
        birthDate: '1990-01-01',
        gender: 'male',
        cpf: '529.982.247-25',
        address: {
          street: 'Rua das Flores',
          number: '123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567'
        },
        emergencyContact: {
          name: 'Maria Silva',
          phone: '11988888888',
          relationship: 'Esposa'
        },
        medicalHistory: {
          allergies: ['Penicilina'],
          medications: ['Losartana 50mg'],
          conditions: ['Hipertensão'],
          notes: 'Paciente com hipertensão controlada'
        }
      };

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patientData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe('João');
      expect(response.body.data.lastName).toBe('Silva');
      expect(response.body.data.phone).toBe('(11) 99999-9999');
      expect(response.body.data.email).toBe('joao@example.com');
      expect(response.body.data.status).toBe('active');
    });

    it('should return 400 for invalid data', async () => {
      const invalidData = {
        firstName: '', // Invalid: empty name
        phone: '123' // Invalid: too short
      };

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 for duplicate phone in same clinic', async () => {
      // Create first patient
      const patientData1 = {
        firstName: 'João',
        lastName: 'Silva',
        phone: '11999999999'
      };

      const firstResponse = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patientData1);

      // Ensure first patient was created successfully
      expect(firstResponse.status).toBe(201);

      // Try to create second patient with same phone
      const patientData2 = {
        firstName: 'Maria',
        lastName: 'Silva',
        phone: '11999999999'
      };

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(patientData2);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Já existe um paciente ativo com este telefone');
    });

    it('should create patient with minimal required data', async () => {
      const minimalData = {
        firstName: 'João',
        lastName: 'Silva',
        phone: '11999999999'
      };

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(minimalData);

                expect(response.status).toBe(201);
                expect(response.body.success).toBe(true);
                expect(response.body.data.firstName).toBe('João');
                expect(response.body.data.lastName).toBe('Silva');
      expect(response.body.data.phone).toBe('(11) 99999-9999');
    });
  });

  describe('GET /api/patients', () => {
    beforeEach(async () => {
      // Create test patients
      const patients = [
        {
          firstName: 'João',
          lastName: 'Silva',
          phone: '11999999999',
          email: 'joao@example.com',
          clinicId: testClinic._id.toString()
        },
        {
          firstName: 'Maria',
          lastName: 'Santos',
          phone: '11988888888',
          email: 'maria@example.com',
          clinicId: testClinic._id.toString()
        },
        {
          firstName: 'Pedro',
          lastName: 'Oliveira',
          phone: '11977777777',
          email: 'pedro@example.com',
          clinicId: testClinic._id.toString()
        }
      ];

      for (const patient of patients) {
        await Patient.create({
          ...patient,
          clinic: testClinic._id,
          status: 'active'
        });
      }
    });

    it('should return paginated list of patients', async () => {
      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.patients).toHaveLength(3);
      expect(response.body.data.total).toBe(3);
      expect(response.body.data.page).toBe(1);
      expect(response.body.data.hasNext).toBe(false);
      expect(response.body.data.hasPrev).toBe(false);
    });

    it('should search patients by name', async () => {
      const response = await request(app)
        .get('/api/patients?search=João')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.patients).toHaveLength(1);
      expect(response.body.data.patients[0].firstName).toBe('João');
    });

    it('should search patients by phone', async () => {
      const response = await request(app)
        .get('/api/patients?search=999999999')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.patients).toHaveLength(1);
      expect(response.body.data.patients[0].phone).toBe('(11) 99999-9999');
    });

    it('should search patients by email', async () => {
      const response = await request(app)
        .get('/api/patients?search=maria@example.com')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.patients).toHaveLength(1);
      expect(response.body.data.patients[0].email).toBe('maria@example.com');
    });

    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/patients?status=inactive')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.patients).toHaveLength(0);
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/patients?page=1&limit=2')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.patients).toHaveLength(2);
      expect(response.body.data.total).toBe(3);
      expect(response.body.data.page).toBe(1);
      expect(response.body.data.totalPages).toBe(2);
      expect(response.body.data.hasNext).toBe(true);
    });

    it('should sort results', async () => {
      const response = await request(app)
        .get('/api/patients?sortBy=name&sortOrder=desc')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.patients[0].firstName).toBe('João');
      expect(response.body.data.patients[0].lastName).toBe('Silva');
      expect(response.body.data.patients[1].name).toBe('Maria Santos');
      expect(response.body.data.patients[2].name).toBe('João Silva');
    });
  });

  describe('GET /api/patients/stats', () => {
    beforeEach(async () => {
      // Create test patients
      await Patient.create({
        firstName: 'João',
        lastName: 'Silva',
        phone: '11999999999',
        clinic: testClinic._id,
        status: 'active',
        medicalHistory: {
          allergies: ['Penicilina'],
          conditions: ['Hipertensão']
        }
      });

      await Patient.create({
        firstName: 'Maria',
        lastName: 'Santos',
        phone: '11988888888',
        clinic: testClinic._id,
        status: 'active'
      });

      // Create inactive patient
      await Patient.create({
        firstName: 'Pedro',
        lastName: 'Oliveira',
        phone: '11977777777',
        clinic: testClinic._id,
        status: 'inactive'
      });
    });

    it('should return patient statistics', async () => {
      const response = await request(app)
        .get('/api/patients/stats')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.total).toBe(3);
      expect(response.body.data.active).toBe(2);
      expect(response.body.data.inactive).toBe(1);
      expect(response.body.data.withMedicalHistory).toBe(1);
    });
  });

  describe('PATCH /api/patients/:id', () => {
    let testPatient: any;

    beforeEach(async () => {
      testPatient = await Patient.create({
        firstName: 'João',
        lastName: 'Silva',
        phone: '11999999999',
        email: 'joao@example.com',
        clinic: testClinic._id,
        status: 'active'
      });
    });

    it('should update patient successfully', async () => {
      const updateData = {
        firstName: 'João',
        lastName: 'Silva Santos',
        email: 'joao.santos@example.com'
      };

      const response = await request(app)
        .patch(`/api/patients/${testPatient._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Paciente atualizado com sucesso');
      expect(response.body.data.firstName).toBe('João');
      expect(response.body.data.lastName).toBe('Silva Santos');
      expect(response.body.data.email).toBe('joao.santos@example.com');
    });

    it('should return 404 for non-existent patient', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const updateData = { firstName: 'New', lastName: 'Name' };

      const response = await request(app)
        .patch(`/api/patients/${nonExistentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Paciente não encontrado');
    });
  });

  describe('PATCH /api/patients/:id/medical-history', () => {
    let testPatient: any;

    beforeEach(async () => {
      testPatient = await Patient.create({
        firstName: 'João',
        lastName: 'Silva',
        phone: '11999999999',
        clinic: testClinic._id,
        status: 'active'
      });
    });

    it('should update medical history successfully', async () => {
      const medicalHistory = {
        allergies: ['Penicilina', 'Aspirina'],
        medications: ['Losartana 50mg'],
        conditions: ['Hipertensão'],
        notes: 'Paciente com hipertensão controlada'
      };

      const response = await request(app)
        .patch(`/api/patients/${testPatient._id}/medical-history`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(medicalHistory);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Histórico médico atualizado com sucesso');
      expect(response.body.data.medicalHistory.allergies).toEqual(['Penicilina', 'Aspirina']);
      expect(response.body.data.medicalHistory.medications).toEqual(['Losartana 50mg']);
      expect(response.body.data.medicalHistory.conditions).toEqual(['Hipertensão']);
      expect(response.body.data.medicalHistory.notes).toBe('Paciente com hipertensão controlada');
    });

    it('should update partial medical history', async () => {
      const medicalHistory = {
        allergies: ['Penicilina']
      };

      const response = await request(app)
        .patch(`/api/patients/${testPatient._id}/medical-history`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(medicalHistory);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.medicalHistory.allergies).toEqual(['Penicilina']);
      expect(response.body.data.medicalHistory.medications).toEqual([]);
      expect(response.body.data.medicalHistory.conditions).toEqual([]);
      expect(response.body.data.medicalHistory.notes).toBe('');
    });
  });

  describe('PATCH /api/patients/:id/reactivate', () => {
    let inactivePatient: any;

    beforeEach(async () => {
      inactivePatient = await Patient.create({
        firstName: 'João',
        lastName: 'Silva',
        phone: '11999999999',
        clinic: testClinic._id,
        status: 'inactive'
      });
    });

    it('should reactivate patient successfully', async () => {
      const response = await request(app)
        .patch(`/api/patients/${inactivePatient._id}/reactivate`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Paciente reativado com sucesso');
      expect(response.body.data.status).toBe('active');
    });

    it('should return 404 for active patient', async () => {
      const activePatient = await Patient.create({
        firstName: 'Maria',
        lastName: 'Silva',
        phone: '11988888888',
        clinic: testClinic._id,
        status: 'active'
      });

      const response = await request(app)
        .patch(`/api/patients/${activePatient._id}/reactivate`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Paciente inativo não encontrado');
    });
  });

  describe('DELETE /api/patients/:id', () => {
    let testPatient: any;

    beforeEach(async () => {
      testPatient = await Patient.create({
        firstName: 'João',
        lastName: 'Silva',
        phone: '11999999999',
        clinic: testClinic._id,
        status: 'active'
      });
    });

    it('should delete patient successfully', async () => {
      const response = await request(app)
        .delete(`/api/patients/${testPatient._id}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Paciente excluído com sucesso');

      // Verify patient is marked as inactive
      const patient = await Patient.findById(testPatient._id);
      expect(patient?.status).toBe('inactive');
    });

    it('should return 404 for non-existent patient', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .delete(`/api/patients/${nonExistentId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Paciente não encontrado');
    });
  });
});
