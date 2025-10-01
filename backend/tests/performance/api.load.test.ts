import request from 'supertest';
import  app  from '../../src/app';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('API Load Tests', () => {
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

  describe('Concurrent Request Handling', () => {
    it('should handle 50 concurrent GET requests', async () => {
      const startTime = performance.now();
      
      const requests = Array.from({ length: 50 }, () =>
        request(app)
          .get('/api/patients')
          .set('Authorization', `Bearer ${authToken}`)
      );

      const responses = await Promise.all(requests);
      const endTime = performance.now();

      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });

      // Should complete within 5 seconds
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('should handle mixed read/write operations under load', async () => {
      const readRequests = Array.from({ length: 30 }, () =>
        request(app)
          .get('/api/patients')
          .set('Authorization', `Bearer ${authToken}`)
      );

      const writeRequests = Array.from({ length: 20 }, (_, i) =>
        request(app)
          .post('/api/patients')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            firstName: `LoadTest${i}`,
            lastName: 'Patient',
            email: `loadtest${i}@test.com`,
            phone: `555-${i.toString().padStart(4, '0')}`,
            dateOfBirth: '1990-01-01'
          })
      );

      const startTime = performance.now();
      const allResponses = await Promise.all([...readRequests, ...writeRequests]);
      const endTime = performance.now();

      // Check success rates
      const successfulReads = allResponses.slice(0, 30).filter(r => r.status === 200);
      const successfulWrites = allResponses.slice(30).filter(r => r.status === 201);

      expect(successfulReads.length).toBeGreaterThanOrEqual(25); // 83% success rate
      expect(successfulWrites.length).toBeGreaterThanOrEqual(15); // 75% success rate
      expect(endTime - startTime).toBeLessThan(10000); // 10 seconds max
    });
  });

  describe('Memory Usage Under Load', () => {
    it('should maintain stable memory usage during sustained load', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // Run 5 batches of 20 requests each
      for (let batch = 0; batch < 5; batch++) {
        const requests = Array.from({ length: 20 }, (_, i) =>
          request(app)
            .get('/api/patients?page=1&limit=10')
            .set('Authorization', `Bearer ${authToken}`)
        );

        await Promise.all(requests);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable (less than 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe('Response Time Benchmarks', () => {
    it('should maintain fast response times under load', async () => {
      const responseTimes: number[] = [];
      
      // Make 100 sequential requests to measure response time distribution
      for (let i = 0; i < 100; i++) {
        const startTime = performance.now();
        
        const response = await request(app)
          .get('/api/patients')
          .set('Authorization', `Bearer ${authToken}`);
        
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        responseTimes.push(responseTime);
        expect(response.status).toBe(200);
      }

      // Calculate percentiles
      responseTimes.sort((a, b) => a - b);
      const p50 = responseTimes[Math.floor(responseTimes.length * 0.5)];
      const p95 = responseTimes[Math.floor(responseTimes.length * 0.95)];
      const p99 = responseTimes[Math.floor(responseTimes.length * 0.99)];

      // Performance assertions
      expect(p50).toBeLessThan(100); // 50th percentile under 100ms
      expect(p95).toBeLessThan(500); // 95th percentile under 500ms
      expect(p99).toBeLessThan(1000); // 99th percentile under 1s
    });

    it('should handle authentication load efficiently', async () => {
      const loginRequests = Array.from({ length: 20 }, (_, i) =>
        request(app)
          .post('/api/auth/login')
          .send({
            email: `user${i}@test.com`,
            password: 'password123'
          })
      );

      const startTime = performance.now();
      const responses = await Promise.all(loginRequests);
      const endTime = performance.now();

      // Most should succeed (some may fail due to user not existing, that's ok)
      const avgResponseTime = (endTime - startTime) / responses.length;
      expect(avgResponseTime).toBeLessThan(200); // Average under 200ms per login
    });
  });

  describe('Error Handling Under Load', () => {
    it('should gracefully handle errors during high load', async () => {
      // Mix of valid and invalid requests
      const validRequests = Array.from({ length: 25 }, (_, i) =>
        request(app)
          .post('/api/patients')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            firstName: `Valid${i}`,
            lastName: 'Patient',
            email: `valid${i}@test.com`,
            phone: `555-${i.toString().padStart(4, '0')}`,
            dateOfBirth: '1990-01-01'
          })
      );

      const invalidRequests = Array.from({ length: 25 }, (_, i) =>
        request(app)
          .post('/api/patients')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            firstName: '', // Invalid - empty name
            lastName: 'Patient',
            email: `invalid${i}@test.com`
          })
      );

      const allRequests = [...validRequests, ...invalidRequests];
      const responses = await Promise.all(allRequests);

      const validResponses = responses.slice(0, 25);
      const invalidResponses = responses.slice(25);

      // Valid requests should mostly succeed
      const successfulValid = validResponses.filter(r => r.status === 201);
      expect(successfulValid.length).toBeGreaterThanOrEqual(20);

      // Invalid requests should all fail with proper error codes
      invalidResponses.forEach(response => {
        expect(response.status).toBe(400);
        expect(response.body.error).toBeDefined();
      });
    });

    it('should maintain error response consistency under load', async () => {
      const invalidRequests = Array.from({ length: 50 }, () =>
        request(app)
          .post('/api/patients')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            firstName: 'Test',
            lastName: 'User',
            email: 'invalid-email' // Invalid email format
          })
      );

      const responses = await Promise.all(invalidRequests);

      // All should return consistent error format
      responses.forEach(response => {
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('email');
      });
    });
  });

  describe('Database Connection Pool', () => {
    it('should handle connection pool exhaustion gracefully', async () => {
      // Create many long-running requests to exhaust connection pool
      const longRunningRequests = Array.from({ length: 100 }, () =>
        request(app)
          .get('/api/patients?delay=100') // Assuming we have a delay parameter for testing
          .set('Authorization', `Bearer ${authToken}`)
      );

      const startTime = performance.now();
      const responses = await Promise.all(longRunningRequests);
      const endTime = performance.now();

      // Most requests should complete successfully
      const successfulResponses = responses.filter(r => r.status === 200);
      expect(successfulResponses.length).toBeGreaterThanOrEqual(80); // 80% success rate

      // Should not take excessively long
      expect(endTime - startTime).toBeLessThan(30000); // 30 seconds max
    });
  });

  describe('Resource Cleanup', () => {
    it('should properly clean up resources after load test', async () => {
      const initialConnections = mongoose.connection.readyState;
      
      // Run intensive operations
      const requests = Array.from({ length: 100 }, (_, i) =>
        request(app)
          .get('/api/health')
      );

      await Promise.all(requests);

      // Connection should still be healthy
      expect(mongoose.connection.readyState).toBe(initialConnections);
      
      // No hanging promises or timers (this is more of a manual check)
      const finalMemory = process.memoryUsage();
      expect(finalMemory.heapUsed).toBeLessThan(200 * 1024 * 1024); // Under 200MB
    });
  });
});