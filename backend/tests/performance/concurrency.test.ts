import { createTestPatient, createTestUser } from '../testHelpers';
import { Patient } from '../../src/models/Patient';
import { AuthService } from '../../src/services/authService';

describe('Concurrency Performance Tests', () => {
  const authService = new AuthService();

  describe('Concurrent Database Operations', () => {
    it('should handle concurrent patient creation', async () => {
      const start = Date.now();
      
      const promises = Array(20).fill(null).map((_, i) => 
        createTestPatient({
          email: `concurrent${i}@example.com`
        })
      );
      
      const patients = await Promise.all(promises);
      const duration = Date.now() - start;
      
      expect(patients).toHaveLength(20);
      expect(duration).toBeLessThan(3000);
    });

    it('should handle concurrent patient queries', async () => {
      const patients = await Promise.all(
        Array(10).fill(null).map(() => createTestPatient())
      );
      
      const start = Date.now();
      
      const promises = patients.map(patient => 
        Patient.findById(patient._id)
      );
      
      const results = await Promise.all(promises);
      const duration = Date.now() - start;
      
      expect(results).toHaveLength(10);
      expect(results.every(r => r !== null)).toBe(true);
      expect(duration).toBeLessThan(500);
    });
  });

  describe('Concurrent Authentication', () => {
    it('should handle concurrent login attempts', async () => {
      const users = await Promise.all(
        Array(5).fill(null).map((_, i) => createTestUser({
          email: `auth${i}@example.com`,
          password: 'TestPass123!'
        }))
      );
      
      const start = Date.now();
      
      const promises = users.map(user => 
        authService.login(user.email, 'TestPass123!')
      );
      
      const results = await Promise.all(promises);
      const duration = Date.now() - start;
      
      expect(results).toHaveLength(5);
      expect(results.every(r => r.accessToken)).toBe(true);
      expect(duration).toBeLessThan(2000);
    });
  });

  describe('Race Condition Prevention', () => {
    it('should prevent duplicate patient creation', async () => {
      const email = 'duplicate@example.com';
      
      const promises = Array(5).fill(null).map(() => 
        createTestPatient({ email }).catch(() => null)
      );
      
      const results = await Promise.all(promises);
      const successfulCreations = results.filter(r => r !== null);
      
      // Only one should succeed due to unique email constraint
      expect(successfulCreations).toHaveLength(1);
    });
  });
});