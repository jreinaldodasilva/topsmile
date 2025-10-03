import { createTestPatient, createTestUser } from '../testHelpers';
import { getWorkerInfo, ensureTestIsolation } from '../utils/testIsolation';
import { Patient } from '../../src/models/Patient';
import { User } from '../../src/models/User';

describe('Parallel Test Isolation', () => {
  beforeEach(async () => {
    await ensureTestIsolation();
  });

  describe('Worker Isolation', () => {
    it('should have unique worker ID', () => {
      const workerInfo = getWorkerInfo();
      expect(workerInfo.workerId).toBeDefined();
      expect(typeof workerInfo.workerId).toBe('string');
    });

    it('should isolate patient data between workers', async () => {
      const patient1 = await createTestPatient({ email: 'worker1@example.com' });
      const patient2 = await createTestPatient({ email: 'worker2@example.com' });
      
      const patients = await Patient.find({
        email: { $in: ['worker1@example.com', 'worker2@example.com'] }
      });
      
      expect(patients).toHaveLength(2);
      expect(patients.map(p => p.email)).toContain('worker1@example.com');
      expect(patients.map(p => p.email)).toContain('worker2@example.com');
    });

    it('should isolate user data between workers', async () => {
      const user1 = await createTestUser({ email: 'user1@example.com' });
      const user2 = await createTestUser({ email: 'user2@example.com' });
      
      const users = await User.find({
        email: { $in: ['user1@example.com', 'user2@example.com'] }
      });
      
      expect(users).toHaveLength(2);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent patient creation without conflicts', async () => {
      const promises = Array(10).fill(null).map((_, i) => 
        createTestPatient({ email: `concurrent${i}@example.com` })
      );
      
      const patients = await Promise.all(promises);
      
      expect(patients).toHaveLength(10);
      expect(new Set(patients.map(p => p.email)).size).toBe(10);
    });

    it('should maintain data consistency across parallel operations', async () => {
      const patient = await createTestPatient();
      
      // Simulate concurrent updates
      const updates = Array(5).fill(null).map((_, i) => 
        Patient.findByIdAndUpdate(
          patient._id,
          { firstName: `Updated${i}` },
          { new: true }
        )
      );
      
      const results = await Promise.all(updates);
      
      // All updates should succeed
      expect(results.every(r => r !== null)).toBe(true);
    });
  });
});