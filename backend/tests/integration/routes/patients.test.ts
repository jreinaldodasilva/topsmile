import request from 'supertest';
import express from 'express';
import patientRoutes from '../../../src/routes/patients';
import { createTestClinic, createTestUser } from '../../helpers/factories';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use('/api/patients', patientRoutes);

describe('Patient Routes', () => {
  let testClinic: any;
  let authToken: string;

  beforeEach(async () => {
    testClinic = await createTestClinic();
    const user = await createTestUser(testClinic);
    authToken = jwt.sign(
      { 
        userId: user._id.toString(), 
        email: user.email,
        role: 'admin', 
        clinicId: testClinic._id.toString() 
      },
      process.env.JWT_SECRET || 'test-secret',
      {
        issuer: 'topsmile-api',
        audience: 'topsmile-client',
        algorithm: 'HS256'
      }
    );
  });

  describe('POST /api/patients', () => {
    it('should create patient', async () => {
      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'João',
          lastName: 'Silva',
          phone: '(11) 99999-9999',
          email: 'joao@example.com',
          address: {
            zipCode: '01310-100'
          }
        });

      expect(response.status).toBe(201);
      expect(response.body.data.firstName).toBe('João');
    });

    it('should reject duplicate phone', async () => {
      const patientData = {
        firstName: 'João',
        lastName: 'Silva',
        phone: '(11) 99999-9999',
        email: 'joao@example.com',
        address: {
          zipCode: '01310-100'
        }
      };

      await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .send(patientData);

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ ...patientData, email: 'other@example.com' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/patients', () => {
    it('should list patients', async () => {
      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.patients).toBeInstanceOf(Array);
    });
  });
});
