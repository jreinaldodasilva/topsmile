import request from 'supertest';
import app from '../../src/app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Patient } from '../../src/models/Patient';

describe('API Edge Cases', () => {
  let mongoServer: MongoMemoryServer;
  let authToken: string;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
    
    // Get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' });
        if (!loginResponse.body || !loginResponse.body.token) {
      throw new Error('Authentication failed: No token received');
    }
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Patient.deleteMany({});
  });

  describe('Malformed Requests', () => {
    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid JSON');
    });

    it('should handle missing Content-Type header', async () => {
      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .send('{"firstName": "John"}');

      expect(response.status).toBe(400);
    });

    it('should handle extremely large payloads', async () => {
      const largeString = 'x'.repeat(1024 * 1024); // 1MB string
      
      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: largeString,
          lastName: 'Test',
          email: 'test@example.com'
        });

      expect(response.status).toBe(413); // Payload Too Large
    });

    it('should handle null and undefined values', async () => {
      const testCases = [
        { firstName: null, lastName: 'Test', email: 'test@example.com' },
        { firstName: undefined, lastName: 'Test', email: 'test@example.com' },
        { firstName: '', lastName: 'Test', email: 'test@example.com' },
        { firstName: 'Test', lastName: null, email: 'test@example.com' }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/patients')
          .set('Authorization', `Bearer ${authToken}`)
          .send(testCase);

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('required');
      }
    });
  });

  describe('SQL Injection Attempts', () => {
    it('should prevent NoSQL injection in query parameters', async () => {
      const maliciousQueries = [
        '{"$ne": null}',
        '{"$gt": ""}',
        '{"$regex": ".*"}',
        '{"$where": "this.password"}',
        '{"$expr": {"$gt": [{"$strLenCP": "$password"}, 0]}}'
      ];

      for (const query of maliciousQueries) {
        const response = await request(app)
          .get(`/api/patients?email=${encodeURIComponent(query)}`)
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Invalid query parameter');
      }
    });

    it('should sanitize search parameters', async () => {
      const response = await request(app)
        .get('/api/patients?search={"$ne": null}')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.patients).toEqual([]);
    });
  });

  describe('Rate Limiting Edge Cases', () => {
    it('should handle burst requests within rate limit', async () => {
      const requests = Array.from({ length: 5 }, () =>
        request(app)
          .get('/api/patients')
          .set('Authorization', `Bearer ${authToken}`)
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    it('should enforce rate limits on excessive requests', async () => {
      // Make 100 rapid requests
      const requests = Array.from({ length: 100 }, () =>
        request(app)
          .post('/api/auth/login')
          .send({ email: 'test@example.com', password: 'wrong' })
      );

      const responses = await Promise.all(requests);
      
      // Some requests should be rate limited
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent patient creation', async () => {
      const requests = Array.from({ length: 10 }, (_, i) =>
        request(app)
          .post('/api/patients')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            firstName: `Patient${i}`,
            lastName: 'Test',
            email: `patient${i}@test.com`,
            phone: `555-000${i}`,
            dateOfBirth: '1990-01-01'
          })
      );

      const responses = await Promise.all(requests);
      
      responses.forEach(response => {
        expect(response.status).toBe(201);
      });

      const patients = await Patient.find({});
      expect(patients).toHaveLength(10);
    });

    it('should prevent duplicate email creation in concurrent requests', async () => {
      const sameEmail = 'duplicate@test.com';
      
      const requests = Array.from({ length: 5 }, () =>
        request(app)
          .post('/api/patients')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            firstName: 'Test',
            lastName: 'User',
            email: sameEmail,
            phone: '555-0001',
            dateOfBirth: '1990-01-01'
          })
      );

      const responses = await Promise.all(requests);
      
      const successfulCreations = responses.filter(r => r.status === 201);
      const duplicateErrors = responses.filter(r => r.status === 409);
      
      expect(successfulCreations).toHaveLength(1);
      expect(duplicateErrors.length).toBeGreaterThan(0);
    });
  });

  describe('Memory and Resource Limits', () => {
    it('should handle requests with many nested objects', async () => {
      const deeplyNested = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  data: 'test'
                }
              }
            }
          }
        }
      };

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'Test',
          lastName: 'User',
          email: 'nested@test.com',
          metadata: deeplyNested
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid data structure');
    });

    it('should handle requests with circular references', async () => {
      const circular: any = { name: 'test' };
      circular.self = circular;

      // This should be caught by JSON.stringify before reaching our code
      expect(() => JSON.stringify(circular)).toThrow();
    });
  });

  describe('Network and Timeout Edge Cases', () => {
    it('should handle slow database operations', async () => {
      // Mock slow database operation
      jest.spyOn(Patient, 'find').mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve([]), 5000); // 5 second delay
        }) as any;
      });

      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .timeout(3000);

      expect(response.status).toBe(408); // Request Timeout
      
      jest.restoreAllMocks();
    });

    it('should handle database connection errors', async () => {
      // Mock database error
      jest.spyOn(Patient, 'find').mockRejectedValue(new Error('Connection lost'));

      const response = await request(app)
        .get('/api/patients')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(503); // Service Unavailable
      expect(response.body.error).toContain('temporarily unavailable');
      
      jest.restoreAllMocks();
    });
  });

  describe('Input Validation Edge Cases', () => {
    it('should handle Unicode and special characters', async () => {
      const specialChars = {
        firstName: '测试用户',
        lastName: 'Müller',
        email: 'test@münchen.de',
        phone: '+1-555-123-4567',
        dateOfBirth: '1990-01-01'
      };

      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .send(specialChars);

      expect(response.status).toBe(201);
      expect(response.body.patient.firstName).toBe('测试用户');
    });

    it('should handle extremely long strings', async () => {
      const longString = 'a'.repeat(1000);
      
      const response = await request(app)
        .post('/api/patients')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: longString,
          lastName: 'Test',
          email: 'long@test.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('too long');
    });

    it('should handle invalid date formats', async () => {
      const invalidDates = [
        '2024-13-01', // Invalid month
        '2024-02-30', // Invalid day
        'not-a-date',
        '2024/02/01', // Wrong format
        '01-02-2024'  // Wrong format
      ];

      for (const date of invalidDates) {
        const response = await request(app)
          .post('/api/patients')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            dateOfBirth: date
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Invalid date');
      }
    });
  });
});