import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Patient } from '../../src/models/Patient';
import { Appointment } from '../../src/models/Appointment';

describe('Database Performance Tests', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
  });

  describe('Query Performance', () => {
    it('should handle large dataset queries under 500ms', async () => {
      // Create 1000 patients
      const patients = Array.from({ length: 1000 }, (_, i) => ({
        firstName: `Patient${i}`,
        lastName: `Test${i}`,
        email: `patient${i}@test.com`,
        phone: `555-000${i.toString().padStart(4, '0')}`,
        dateOfBirth: new Date(1990, 0, 1),
        clinicId: 'clinic1'
      }));

      await Patient.insertMany(patients);

      const startTime = performance.now();
      const result = await Patient.find({ clinicId: 'clinic1' }).limit(50);
      const endTime = performance.now();

      expect(result).toHaveLength(50);
      expect(endTime - startTime).toBeLessThan(500);
    });

    it('should handle complex aggregation queries efficiently', async () => {
      // Create test data
      const patients = await Patient.insertMany([
        { firstName: 'John', lastName: 'Doe', email: 'john@test.com', phone: '555-0001', dateOfBirth: new Date(1990, 0, 1), clinicId: 'clinic1' },
        { firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com', phone: '555-0002', dateOfBirth: new Date(1985, 5, 15), clinicId: 'clinic1' }
      ]);

      const appointments = Array.from({ length: 100 }, (_, i) => ({
        patientId: patients[i % 2]._id,
        providerId: 'provider1',
        appointmentDate: new Date(2024, 0, i + 1),
        duration: 30,
        type: 'checkup',
        status: 'scheduled',
        clinicId: 'clinic1'
      }));

      await Appointment.insertMany(appointments);

      const startTime = performance.now();
      const stats = await Appointment.aggregate([
        { $match: { clinicId: 'clinic1' } },
        { $group: { _id: '$patientId', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
      const endTime = performance.now();

      expect(stats).toHaveLength(2);
      expect(endTime - startTime).toBeLessThan(200);
    });

    it('should handle concurrent database operations', async () => {
      const operations = Array.from({ length: 10 }, (_, i) => 
        Patient.create({
          firstName: `Concurrent${i}`,
          lastName: 'Test',
          email: `concurrent${i}@test.com`,
          phone: `555-100${i}`,
          dateOfBirth: new Date(1990, 0, 1),
          clinicId: 'clinic1'
        })
      );

      const startTime = performance.now();
      const results = await Promise.all(operations);
      const endTime = performance.now();

      expect(results).toHaveLength(10);
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  describe('Memory Usage', () => {
    it('should not leak memory during bulk operations', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Perform bulk operations
      for (let batch = 0; batch < 5; batch++) {
        const patients = Array.from({ length: 100 }, (_, i) => ({
          firstName: `Batch${batch}Patient${i}`,
          lastName: 'Test',
          email: `batch${batch}patient${i}@test.com`,
          phone: `555-${batch}${i.toString().padStart(3, '0')}`,
          dateOfBirth: new Date(1990, 0, 1),
          clinicId: 'clinic1'
        }));

        await Patient.insertMany(patients);
        await Patient.deleteMany({ firstName: { $regex: `^Batch${batch}` } });
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be minimal (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });
  });

  describe('Connection Handling', () => {
    it('should handle connection timeouts gracefully', async () => {
      // Mock connection timeout
      const originalTimeout = mongoose.connection.db?.serverConfig?.options?.socketTimeoutMS;
      
      try {
        // Set very short timeout
        if (mongoose.connection.db?.serverConfig?.options) {
          mongoose.connection.db.serverConfig.options.socketTimeoutMS = 1;
        }

        const startTime = performance.now();
        
        try {
          await Patient.find({}).maxTimeMS(100);
        } catch (error) {
          const endTime = performance.now();
          expect(endTime - startTime).toBeLessThan(200);
          expect(error).toBeDefined();
        }
      } finally {
        // Restore original timeout
        if (mongoose.connection.db?.serverConfig?.options && originalTimeout) {
          mongoose.connection.db.serverConfig.options.socketTimeoutMS = originalTimeout;
        }
      }
    });
  });
});