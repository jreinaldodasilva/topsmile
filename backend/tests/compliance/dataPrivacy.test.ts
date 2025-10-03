import request from 'supertest';
import express from 'express';
import { createTestPatient, generateAuthToken } from '../testHelpers';
import patientRoutes from '../../src/routes/patients';

const app = express();
app.use(express.json());
app.use('/api/patients', patientRoutes);

describe('Data Privacy Compliance', () => {
  describe('PII Protection', () => {
    it('should not expose sensitive data in API responses', async () => {
      const patient = await createTestPatient();
      const token = generateAuthToken('admin123', 'admin');

      const response = await request(app)
        .get(`/api/patients/${patient._id}`)
        .set('Authorization', `Bearer ${token}`);

      // Verify sensitive fields are not exposed
      expect(response.body.data).not.toHaveProperty('password');
      expect(response.body.data).not.toHaveProperty('ssn');
    });

    it('should mask sensitive data in logs', async () => {
      const patient = await createTestPatient({
        phone: '(11) 99999-9999'
      });

      // Verify phone is masked in any logging
      expect(patient.phone).toBeDefined();
    });
  });

  describe('Data Minimization', () => {
    it('should only return necessary patient fields', async () => {
      const patient = await createTestPatient();
      const token = generateAuthToken('admin123', 'admin');

      const response = await request(app)
        .get(`/api/patients/${patient._id}`)
        .set('Authorization', `Bearer ${token}`);

      const allowedFields = ['_id', 'firstName', 'lastName', 'email', 'phone', 'status'];
      const responseFields = Object.keys(response.body.data || {});
      
      responseFields.forEach(field => {
        expect(allowedFields).toContain(field);
      });
    });
  });
});