import request from 'supertest';
import express from 'express';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { appointmentSchema, apiResponseSchema } from './schemas';
import { generateAuthToken } from '../testHelpers';

const ajv = new Ajv();
addFormats(ajv);

const validateAppointment = ajv.compile(appointmentSchema);
const validateApiResponse = ajv.compile(apiResponseSchema);

// Mock app for appointment contract testing
const app = express();
app.use(express.json());

app.get('/api/appointments', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        _id: '507f1f77bcf86cd799439013',
        patient: '507f1f77bcf86cd799439011',
        provider: '507f1f77bcf86cd799439012',
        scheduledStart: '2024-01-15T10:00:00.000Z',
        scheduledEnd: '2024-01-15T11:00:00.000Z',
        type: 'Consulta',
        status: 'scheduled',
        price: 15000,
        notes: 'Consulta de rotina',
        createdAt: '2024-01-01T10:00:00.000Z',
        updatedAt: '2024-01-01T10:00:00.000Z'
      }
    ],
    meta: {
      timestamp: '2024-01-01T10:00:00.000Z',
      requestId: 'req-125',
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        pages: 1
      }
    }
  });
});

app.post('/api/appointments', (req, res) => {
  const { patient, provider, scheduledStart, scheduledEnd, type } = req.body;
  
  res.status(201).json({
    success: true,
    data: {
      _id: '507f1f77bcf86cd799439014',
      patient,
      provider,
      scheduledStart,
      scheduledEnd,
      type,
      status: 'scheduled',
      price: 15000,
      notes: '',
      createdAt: '2024-01-01T10:00:00.000Z',
      updatedAt: '2024-01-01T10:00:00.000Z'
    },
    meta: {
      timestamp: '2024-01-01T10:00:00.000Z',
      requestId: 'req-126'
    }
  });
});

describe('Appointment API Contract Tests', () => {
  describe('GET /api/appointments', () => {
    it('should return appointments list matching contract', async () => {
      const token = generateAuthToken('user123', 'admin');
      
      const response = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Validate API response structure
      expect(validateApiResponse(response.body)).toBe(true);
      
      // Validate each appointment in the array
      expect(Array.isArray(response.body.data)).toBe(true);
      response.body.data.forEach((appointment: any) => {
        expect(validateAppointment(appointment)).toBe(true);
      });
      
      // Validate pagination metadata
      expect(response.body.meta.pagination).toBeDefined();
      expect(response.body.meta.pagination.page).toBe(1);
      expect(response.body.meta.pagination.total).toBeGreaterThanOrEqual(0);
    });
  });

  describe('POST /api/appointments', () => {
    it('should create appointment with valid data', async () => {
      const appointmentData = {
        patient: '507f1f77bcf86cd799439011',
        provider: '507f1f77bcf86cd799439012',
        scheduledStart: '2024-01-15T14:00:00.000Z',
        scheduledEnd: '2024-01-15T15:00:00.000Z',
        type: 'Limpeza',
        notes: 'Limpeza preventiva'
      };

      const token = generateAuthToken('user123', 'admin');

      const response = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send(appointmentData)
        .expect(201);

      // Validate response structure
      expect(validateApiResponse(response.body)).toBe(true);
      expect(validateAppointment(response.body.data)).toBe(true);
      
      // Validate appointment data
      expect(response.body.data.patient).toBe(appointmentData.patient);
      expect(response.body.data.provider).toBe(appointmentData.provider);
      expect(response.body.data.type).toBe(appointmentData.type);
      expect(response.body.data.status).toBe('scheduled');
    });
  });

  describe('Appointment Type Contract', () => {
    it('should only accept valid appointment types', async () => {
      const validTypes = ['Consulta', 'Limpeza', 'Tratamento de Canal', 'Extração', 'Ortodontia'];
      
      validTypes.forEach(type => {
        const appointment = {
          _id: '507f1f77bcf86cd799439015',
          patient: '507f1f77bcf86cd799439011',
          provider: '507f1f77bcf86cd799439012',
          scheduledStart: '2024-01-15T10:00:00.000Z',
          scheduledEnd: '2024-01-15T11:00:00.000Z',
          type,
          status: 'scheduled',
          createdAt: '2024-01-01T10:00:00.000Z',
          updatedAt: '2024-01-01T10:00:00.000Z'
        };

        expect(validateAppointment(appointment)).toBe(true);
      });
    });

    it('should reject invalid appointment types', async () => {
      const invalidAppointment = {
        _id: '507f1f77bcf86cd799439015',
        patient: '507f1f77bcf86cd799439011',
        provider: '507f1f77bcf86cd799439012',
        scheduledStart: '2024-01-15T10:00:00.000Z',
        scheduledEnd: '2024-01-15T11:00:00.000Z',
        type: 'Invalid Type',
        status: 'scheduled',
        createdAt: '2024-01-01T10:00:00.000Z',
        updatedAt: '2024-01-01T10:00:00.000Z'
      };

      expect(validateAppointment(invalidAppointment)).toBe(false);
    });
  });

  describe('Status Contract', () => {
    it('should only accept valid appointment statuses', async () => {
      const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'];
      
      validStatuses.forEach(status => {
        const appointment = {
          _id: '507f1f77bcf86cd799439015',
          patient: '507f1f77bcf86cd799439011',
          provider: '507f1f77bcf86cd799439012',
          scheduledStart: '2024-01-15T10:00:00.000Z',
          scheduledEnd: '2024-01-15T11:00:00.000Z',
          type: 'Consulta',
          status,
          createdAt: '2024-01-01T10:00:00.000Z',
          updatedAt: '2024-01-01T10:00:00.000Z'
        };

        expect(validateAppointment(appointment)).toBe(true);
      });
    });
  });
});