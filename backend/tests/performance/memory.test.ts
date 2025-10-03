import { createTestPatient, createTestUser } from '../testHelpers';
import { Patient } from '../../src/models/Patient';

describe('Memory Performance Tests', () => {
  const getMemoryUsage = () => {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024),
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024)
    };
  };

  describe('Memory Usage Monitoring', () => {
    it('should not leak memory during patient operations', async () => {
      const initialMemory = getMemoryUsage();
      
      // Create and delete patients
      for (let i = 0; i < 100; i++) {
        const patient = await createTestPatient();
        await Patient.findById(patient._id);
        await Patient.deleteOne({ _id: patient._id });
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = getMemoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      // Memory increase should be less than 50MB
      expect(memoryIncrease).toBeLessThan(50);
    });

    it('should handle large result sets efficiently', async () => {
      const initialMemory = getMemoryUsage();
      
      // Create many patients
      const patients = await Promise.all(
        Array(50).fill(null).map(() => createTestPatient())
      );
      
      // Query all patients
      await Patient.find({ _id: { $in: patients.map(p => p._id) } });
      
      const finalMemory = getMemoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      // Memory increase should be reasonable
      expect(memoryIncrease).toBeLessThan(100);
    });
  });

  describe('Resource Cleanup', () => {
    it('should clean up database connections', async () => {
      const initialMemory = getMemoryUsage();
      
      // Perform multiple database operations
      for (let i = 0; i < 20; i++) {
        await createTestPatient();
        await Patient.find().limit(5);
      }
      
      // Allow time for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const finalMemory = getMemoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      expect(memoryIncrease).toBeLessThan(30);
    });
  });
});