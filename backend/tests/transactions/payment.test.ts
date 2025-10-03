import mongoose from 'mongoose';
import { createTestPatient, createTestUser } from '../testHelpers';
import { Patient } from '../../src/models/Patient';
import { Appointment } from '../../src/models/Appointment';
import { mockStripe } from '../mocks/stripe.mock';

describe('Payment Transaction Tests', () => {
  beforeEach(() => {
    mockStripe.clear();
    mockStripe.simulateSuccess();
  });

  describe('Payment Processing Transactions', () => {
    it('should rollback appointment on payment failure', async () => {
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
            status: 'scheduled',
            price: 15000
          });
          await appointment.save({ session });
          
          // Simulate payment failure
          mockStripe.simulateFailure();
          await mockStripe.paymentIntents.create({
            amount: 15000,
            currency: 'brl'
          });
        });
      } catch (error) {
        expect(error).toBeDefined();
      } finally {
        await session.endSession();
      }
      
      // Verify appointment was not created
      const appointments = await Appointment.find({ patient: patient._id });
      expect(appointments).toHaveLength(0);
    });

    it('should commit appointment on successful payment', async () => {
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
            status: 'scheduled',
            price: 15000
          });
          const saved = await appointment.save({ session });
          appointmentId = saved._id.toString();
          
          // Process payment
          const paymentIntent = await mockStripe.paymentIntents.create({
            amount: 15000,
            currency: 'brl',
            metadata: {
              appointmentId: appointmentId
            }
          });
          
          // Update appointment with payment info
          await Appointment.findByIdAndUpdate(
            appointmentId,
            { 
              paymentIntentId: paymentIntent.id,
              paymentStatus: 'pending'
            },
            { session }
          );
        });
      } finally {
        await session.endSession();
      }
      
      // Verify appointment was created with payment info
      const appointment = await Appointment.findById(appointmentId);
      expect(appointment).toBeTruthy();
      expect(appointment?.paymentIntentId).toBeDefined();
      expect(appointment?.paymentStatus).toBe('pending');
    });
  });

  describe('Refund Transactions', () => {
    it('should handle appointment cancellation with refund', async () => {
      const patient = await createTestPatient();
      const provider = await createTestUser({ role: 'provider' });
      
      // Create paid appointment
      const appointment = await new Appointment({
        patient: patient._id,
        provider: provider._id,
        scheduledStart: new Date(),
        scheduledEnd: new Date(Date.now() + 3600000),
        type: 'Consulta',
        status: 'confirmed',
        price: 15000,
        paymentStatus: 'paid'
      }).save();
      
      const session = await mongoose.startSession();
      
      try {
        await session.withTransaction(async () => {
          // Cancel appointment
          await Appointment.findByIdAndUpdate(
            appointment._id,
            { 
              status: 'cancelled',
              paymentStatus: 'refunded'
            },
            { session }
          );
          
          // Update patient balance
          await Patient.findByIdAndUpdate(
            patient._id,
            { $inc: { accountBalance: 15000 } },
            { session }
          );
        });
      } finally {
        await session.endSession();
      }
      
      // Verify cancellation and refund
      const cancelledAppointment = await Appointment.findById(appointment._id);
      const updatedPatient = await Patient.findById(patient._id);
      
      expect(cancelledAppointment?.status).toBe('cancelled');
      expect(cancelledAppointment?.paymentStatus).toBe('refunded');
      expect(updatedPatient?.accountBalance).toBe(15000);
    });
  });
});