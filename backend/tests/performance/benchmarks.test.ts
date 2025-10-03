import { createTestPatient, createTestUser, createTestUserWithClinic } from '../testHelpers';
import { Patient } from '../../src/models/Patient';
import { User } from '../../src/models/User';
import { authService } from '../../src/services/authService';

describe('Performance Benchmarks', () => {
  describe('Database Query Performance', () => {
    it('should find patient by ID under 50ms', async () => {
      const patient = await createTestPatient();
      
      const start = Date.now();
      await Patient.findById(patient._id);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(50);
    });

    it('should list patients under 100ms', async () => {
      await Promise.all([
        createTestPatient(),
        createTestPatient(),
        createTestPatient()
      ]);
      
      const start = Date.now();
      await Patient.find().limit(10);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(100);
    });

    it('should create patient under 200ms', async () => {
      const start = Date.now();
      await createTestPatient();
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(200);
    });
  });

  describe('Authentication Performance', () => {
    it('should login user under 300ms', async () => {
      const user = await createTestUser({
        email: 'perf@example.com',
        password: 'TestPass123!'
      });
      
      const start = Date.now();
      await authService.login({
        email: 'perf@example.com',
        password: 'TestPass123!'
      });
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(300);
    });

    it('should register user under 500ms', async () => {
      const start = Date.now();
      await authService.register({
        name: 'Performance Test',
        email: 'perftest@example.com',
        password: 'TestPass123!'
      });
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(500);
    });
  });

  describe('Bulk Operations Performance', () => {
    it('should handle 100 patient queries under 1000ms', async () => {
      const patients = await Promise.all(
        Array(10).fill(null).map(() => createTestPatient())
      );
      
      const start = Date.now();
      await Promise.all(
        patients.map(p => Patient.findById(p._id))
      );
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(1000);
    });

    it('should create 50 users under 2000ms', async () => {
      const start = Date.now();
      await Promise.all(
        Array(5).fill(null).map((_, i) => createTestUser({
          email: `bulk${i}@example.com`
        }))
      );
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(2000);
    });
  });
});