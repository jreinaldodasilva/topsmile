import mongoose from 'mongoose';
import { createTestPatient, createTestUser } from '../testHelpers';
import { Patient } from '../../src/models/Patient';
import { User } from '../../src/models/User';
import { Appointment } from '../../src/models/Appointment';

describe('Appointment Transaction Tests', () => {
  describe('Transaction Rollback', () => {
    it('should rollback appointment creation on patient update failure', async () => {
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
          await appointment.save({ session });
          
          // Force failure by updating with invalid data
          await Patient.findByIdAndUpdate(
            patient._id,
            { $set: { email: null } }, // This should fail validation
            { session, runValidators: true }
          );
        });
      } catch (error) {
        // Transaction should rollback
        expect(error).toBeDefined();
      } finally {
        await session.endSession();
      }
      
      // Verify no appointment was created
      const appointments = await Appointment.find({ patient: patient._id });
      expect(appointments).toHaveLength(0);
    });

    it('should commit successful appointment booking transaction', async () => {
      const patient = await createTestPatient();
      const provider = await createTestUser({ role: 'provider' });
      
      const session = await mongoose.startSession();
      let appointmentId: string;
      
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
          appointmentId = savedAppointment._id.toString();
          
          // Update patient last appointment
          await Patient.findByIdAndUpdate(
            patient._id,
            { lastAppointment: savedAppointment._id },
            { session }
          );
        });
      } finally {
        await session.endSession();
      }
      
      // Verify appointment was created
      const appointment = await Appointment.findById(appointmentId);
      expect(appointment).toBeTruthy();
      
      // Verify patient was updated
      const updatedPatient = await Patient.findById(patient._id);
      expect(updatedPatient?.lastAppointment?.toString()).toBe(appointmentId);
    });
  });

  describe('Concurrent Booking Prevention', () => {
    it('should prevent double booking with transactions', async () => {
      const patient1 = await createTestPatient();
      const patient2 = await createTestPatient();
      const provider = await createTestUser({ role: 'provider' });
      
      const appointmentTime = new Date(Date.now() + 86400000);
      const endTime = new Date(appointmentTime.getTime() + 3600000);
      
      const bookAppointment = async (patientId: string) => {
        const session = await mongoose.startSession();
        try {
          return await session.withTransaction(async () => {
            // Check for conflicts
            const conflict = await Appointment.findOne({
              provider: provider._id,
              scheduledStart: { $lt: endTime },
              scheduledEnd: { $gt: appointmentTime },
              status: { $ne: 'cancelled' }
            }).session(session);
            
            if (conflict) {
              throw new Error('Time slot already booked');
            }
            
            const appointment = new Appointment({
              patient: patientId,
              provider: provider._id,
              scheduledStart: appointmentTime,
              scheduledEnd: endTime,
              type: 'Consulta',
              status: 'scheduled'
            });
            
            return await appointment.save({ session });
          });
        } finally {
          await session.endSession();
        }
      };
      
      // Attempt concurrent bookings
      const results = await Promise.allSettled([
        bookAppointment(patient1._id.toString()),
        bookAppointment(patient2._id.toString())
      ]);
      
      // Only one should succeed
      const successful = results.filter(r => r.status === 'fulfilled');
      const failed = results.filter(r => r.status === 'rejected');
      
      expect(successful).toHaveLength(1);
      expect(failed).toHaveLength(1);
    });
  });
});