import mongoose from 'mongoose';
import { createTestPatient, createTestUser } from '../testHelpers';
import { Patient } from '../../src/models/Patient';
import { User } from '../../src/models/User';
import { Appointment } from '../../src/models/Appointment';

describe('ACID Properties Tests', () => {
  describe('Atomicity', () => {
    it('should ensure all operations succeed or all fail', async () => {
      const patient = await createTestPatient();
      const provider = await createTestUser({ role: 'provider' });
      
      const session = await mongoose.startSession();
      
      try {
        await session.withTransaction(async () => {
          // Operation 1: Create appointment
          const appointment = new Appointment({
            patient: patient._id,
            provider: provider._id,
            scheduledStart: new Date(),
            scheduledEnd: new Date(Date.now() + 3600000),
            type: 'Consulta',
            status: 'scheduled'
          });
          await appointment.save({ session });
          
          // Operation 2: Update patient (this will fail)
          await Patient.findByIdAndUpdate(
            'invalid_id', // Invalid ID to force failure
            { firstName: 'Updated' },
            { session }
          );
        });
      } catch (error) {
        expect(error).toBeDefined();
      } finally {
        await session.endSession();
      }
      
      // Verify no appointment was created (atomicity)
      const appointments = await Appointment.find({ patient: patient._id });
      expect(appointments).toHaveLength(0);
    });
  });

  describe('Consistency', () => {
    it('should maintain data consistency across operations', async () => {
      const patient = await createTestPatient();
      const provider = await createTestUser({ role: 'provider' });
      
      const session = await mongoose.startSession();
      
      try {
        await session.withTransaction(async () => {
          // Create appointment
          const appointment = new Appointment({
            patient: patient._id,
            provider: provider._id,
            scheduledStart: new Date(),
            scheduledEnd: new Date(Date.now() + 3600000),
            type: 'Consulta',
            status: 'scheduled'
          });
          const savedAppointment = await appointment.save({ session });
          
          // Update patient's appointment count
          await Patient.findByIdAndUpdate(
            patient._id,
            { $inc: { appointmentCount: 1 } },
            { session }
          );
          
          // Update provider's appointment count
          await User.findByIdAndUpdate(
            provider._id,
            { $inc: { appointmentCount: 1 } },
            { session }
          );
        });
      } finally {
        await session.endSession();
      }
      
      // Verify consistency
      const appointment = await Appointment.findOne({ patient: patient._id });
      const updatedPatient = await Patient.findById(patient._id);
      const updatedProvider = await User.findById(provider._id);
      
      expect(appointment).toBeTruthy();
      expect(updatedPatient?.appointmentCount).toBe(1);
      expect(updatedProvider?.appointmentCount).toBe(1);
    });
  });

  describe('Isolation', () => {
    it('should isolate concurrent transactions', async () => {
      const patient = await createTestPatient({ appointmentCount: 0 });
      
      const incrementCount = async (amount: number) => {
        const session = await mongoose.startSession();
        try {
          return await session.withTransaction(async () => {
            const currentPatient = await Patient.findById(patient._id).session(session);
            const newCount = (currentPatient?.appointmentCount || 0) + amount;
            
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 10));
            
            return await Patient.findByIdAndUpdate(
              patient._id,
              { appointmentCount: newCount },
              { session, new: true }
            );
          });
        } finally {
          await session.endSession();
        }
      };
      
      // Run concurrent transactions
      await Promise.all([
        incrementCount(1),
        incrementCount(2),
        incrementCount(3)
      ]);
      
      const finalPatient = await Patient.findById(patient._id);
      expect(finalPatient?.appointmentCount).toBe(6); // 1 + 2 + 3
    });
  });

  describe('Durability', () => {
    it('should persist committed transactions', async () => {
      const patient = await createTestPatient();
      const provider = await createTestUser({ role: 'provider' });
      let appointmentId: string;
      
      const session = await mongoose.startSession();
      
      try {
        await session.withTransaction(async () => {
          const appointment = new Appointment({
            patient: patient._id,
            provider: provider._id,
            scheduledStart: new Date(),
            scheduledEnd: new Date(Date.now() + 3600000),
            type: 'Consulta',
            status: 'scheduled'
          });
          const saved = await appointment.save({ session });
          appointmentId = saved._id.toString();
        });
      } finally {
        await session.endSession();
      }
      
      // Verify persistence after transaction commit
      const persistedAppointment = await Appointment.findById(appointmentId);
      expect(persistedAppointment).toBeTruthy();
      expect(persistedAppointment?.status).toBe('scheduled');
    });
  });
});