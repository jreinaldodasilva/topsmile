import request from 'supertest';
import express from 'express';
import authRoutes from '../../src/routes/auth';
import patientRoutes from '../../src/routes/patients';
import { createTestClinic } from '../helpers/factories';
import { authenticate } from '../../src/middleware/auth';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/patients', authenticate, patientRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Test app error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

describe('Patient Registration Flow', () => {
  it('should complete full registration flow', async () => {
    // 1. Register and login as admin with clinic
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'admin@clinic.com',
        password: 'AdminPass123!',
        clinic: {
          name: 'Test Clinic',
          phone: '(11) 99999-9999',
          address: {
            street: 'Rua Teste',
            number: '123',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234567'
          }
        }
      });

    if (registerResponse.status !== 201) {
      console.log('Registration failed:', registerResponse.body);
    }
    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.data).toBeDefined();
    const token = registerResponse.body.data.accessToken;

    // 2. Create patient
    const patientResponse = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        firstName: 'João',
        lastName: 'Silva',
        phone: '(11) 99999-9999',
        email: 'joao@example.com',
        address: {
          zipCode: '01310-100'
        }
      });

    expect(patientResponse.status).toBe(201);
    expect(patientResponse.body.data.firstName).toBe('João');

    // 3. Verify patient exists
    const listResponse = await request(app)
      .get('/api/patients')
      .set('Authorization', `Bearer ${token}`);

    expect(listResponse.body.data.patients).toHaveLength(1);
    expect(listResponse.body.data.total).toBe(1);
  });
});
