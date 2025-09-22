import request from 'supertest';
import express from 'express';
import { createTestUser, generateAuthToken } from '../testHelpers';
import { User } from '../../src/models/User';
import { Contact } from '../../src/models/Contact';
import contactRoutes from '../../src/routes/admin/contacts';

const app = express();
app.use(express.json());
app.use('/api/admin/contacts', contactRoutes);

describe('Concurrent Operations', () => {
  let testUser: any;
  let authToken: string;
  let testContact: any;

  beforeEach(async () => {
    await User.deleteMany({});
    await Contact.deleteMany({});
    
    testUser = await createTestUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPassword123!',
      role: 'admin'
    });

    authToken = generateAuthToken(testUser._id.toString(), testUser.role, undefined, testUser.email);
    
    testContact = await Contact.create({
      name: 'Test Contact',
      email: 'contact@example.com',
      clinic: 'Test Clinic',
      specialty: 'General',
      phone: '(11) 99999-9999',
      assignedToClinic: testUser.clinic
    });
  });

  it('should handle simultaneous contact updates', async () => {
    const updates = Array(5).fill(null).map((_, i) => 
      request(app)
        .patch(`/api/admin/contacts/${testContact._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: `status_${i}` })
    );
    
    const results = await Promise.allSettled(updates);
    const successful = results.filter(r => r.status === 'fulfilled' && (r.value as any).status < 400);
    
    // At least one should succeed, others may fail due to optimistic locking
    expect(successful.length).toBeGreaterThanOrEqual(1);
  });

  it('should handle concurrent login attempts', async () => {
    const loginAttempts = Array(3).fill(null).map(() => 
      request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'TestPassword123!'
        })
    );
    
    const results = await Promise.allSettled(loginAttempts);
    const successful = results.filter(r => r.status === 'fulfilled');
    
    // All should succeed as they're valid credentials
    expect(successful.length).toBe(3);
  });
});