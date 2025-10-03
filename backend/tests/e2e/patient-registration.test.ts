import request from 'supertest';
import express from 'express';
import authRoutes from '../../src/routes/auth';
import patientRoutes from '../../src/routes/patients';
import { createTestClinic } from '../helpers/factories';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);

describe('Patient Registration Flow', () => {
  it('should complete full registration flow', async () => {
    const clinic = await createTestClinic();

    // 1. Admin creates patient account
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@clinic.com',
        password: 'AdminPass123!'
      });

    const token = loginResponse.body.accessToken;

    // 2. Create patient
    const patientResponse = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'João',
        lastName: 'Silva',
        phone: '(11) 99999-9999',
        email: 'joao@example.com'
      });

    expect(patientResponse.status).toBe(201);
    expect(patientResponse.body.data.firstName).toBe('João');

    // 3. Verify patient exists
    const listResponse = await request(app)
      .get('/api/patients')
      .set('Authorization', `Bearer ${token}`);

    expect(listResponse.body.data).toHaveLength(1);
  });
});
