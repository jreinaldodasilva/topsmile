import { appointmentService } from '../../../src/services/appointmentService';
import { Appointment } from '../../../src/models/Appointment';
import { createTestClinic, createTestPatient, createTestUser } from '../../testHelpers';
import { ValidationError, NotFoundError, ConflictError } from '../../../src/types/errors';

describe('AppointmentService', () => {
  let testClinic: any;
  let testPatient: any;
  let testProvider: any;

  beforeEach(async () => {
    testClinic = await createTestClinic();
    testPatient = await createTestPatient({ clinic: testClinic._id });
    testProvider = await createTestUser({ 
      role: 'provider', 
      clinic: testClinic._id,
      specialty: 'General Dentistry'
    });
  });

  describe('createAppointment', () => {
    it('should create appointment successfully', async () => {
      const appointmentData = {
        patient: testPatient._id.toString(),
        provider: testProvider._id.toString(),
        clinic: testClinic._id.toString(),
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // Tomorrow + 1 hour
        type: 'Consulta',
        notes: 'Consulta de rotina',
        price: 150
      };

      const result = await appointmentService.createAppointment(appointmentData);

      expect(result.success).toBe(true);
      expect(result.data.patient.toString()).toBe(testPatient._id.toString());
      expect(result.data.provider.toString()).toBe(testProvider._id.toString());
      expect(result.data.type).toBe(appointmentData.type);
      expect(result.data.status).toBe('scheduled');
    });

    it('should throw error for invalid data', async () => {
      const invalidData = {
        patient: '',
        provider: '',
        scheduledStart: new Date(),
        scheduledEnd: new Date()
      };

      await expect(appointmentService.createAppointment(invalidData))
        .rejects.toThrow(ValidationError);
    });

    it('should throw error for past appointment time', async () => {
      const appointmentData = {
        patient: testPatient._id.toString(),
        provider: testProvider._id.toString(),
        clinic: testClinic._id.toString(),
        scheduledStart: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        scheduledEnd: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        type: 'Consulta'
      };

      await expect(appointmentService.createAppointment(appointmentData))
        .rejects.toThrow(ValidationError);
    });
  });

  describe('getAppointmentById', () => {
    let testAppointment: any;

    beforeEach(async () => {
      const appointmentData = {
        patient: testPatient._id,
        provider: testProvider._id,
        clinic: testClinic._id,
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        type: 'Consulta',
        status: 'scheduled'
      };

      const result = await appointmentService.createAppointment(appointmentData);
      testAppointment = result.data;
    });

    it('should return appointment by ID', async () => {
      const appointment = await appointmentService.getAppointmentById(
        testAppointment._id.toString()
      );

      expect(appointment).toBeDefined();
      expect(appointment._id.toString()).toBe(testAppointment._id.toString());
      expect(appointment.patient).toBeDefined();
      expect(appointment.provider).toBeDefined();
    });

    it('should throw error for non-existent appointment', async () => {
      await expect(appointmentService.getAppointmentById('507f1f77bcf86cd799439011'))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('updateAppointment', () => {
    let testAppointment: any;

    beforeEach(async () => {
      const appointmentData = {
        patient: testPatient._id,
        provider: testProvider._id,
        clinic: testClinic._id,
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        type: 'Consulta',
        status: 'scheduled'
      };

      const result = await appointmentService.createAppointment(appointmentData);
      testAppointment = result.data;
    });

    it('should update appointment successfully', async () => {
      const updates = {
        notes: 'Updated notes',
        status: 'confirmed' as const,
        price: 200
      };

      const updatedAppointment = await appointmentService.updateAppointment(
        testAppointment._id.toString(),
        updates
      );

      expect(updatedAppointment.notes).toBe(updates.notes);
      expect(updatedAppointment.status).toBe(updates.status);
      expect(updatedAppointment.price).toBe(updates.price);
    });

    it('should throw error for non-existent appointment', async () => {
      const updates = { notes: 'Updated notes' };

      await expect(appointmentService.updateAppointment('507f1f77bcf86cd799439011', updates))
        .rejects.toThrow(NotFoundError);
    });
  });

  describe('cancelAppointment', () => {
    let testAppointment: any;

    beforeEach(async () => {
      const appointmentData = {
        patient: testPatient._id,
        provider: testProvider._id,
        clinic: testClinic._id,
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        type: 'Consulta',
        status: 'scheduled'
      };

      const result = await appointmentService.createAppointment(appointmentData);
      testAppointment = result.data;
    });

    it('should cancel appointment successfully', async () => {
      const reason = 'Patient requested cancellation';

      const cancelledAppointment = await appointmentService.cancelAppointment(
        testAppointment._id.toString(),
        reason
      );

      expect(cancelledAppointment.status).toBe('cancelled');
      expect(cancelledAppointment.cancellationReason).toBe(reason);
      expect(cancelledAppointment.cancelledAt).toBeDefined();
    });

    it('should throw error for already cancelled appointment', async () => {
      // First cancellation
      await appointmentService.cancelAppointment(
        testAppointment._id.toString(),
        'First cancellation'
      );

      // Second cancellation should fail
      await expect(appointmentService.cancelAppointment(
        testAppointment._id.toString(),
        'Second cancellation'
      )).rejects.toThrow(ConflictError);
    });
  });

  describe('getAppointmentsByPatient', () => {
    beforeEach(async () => {
      // Create multiple appointments for the patient
      const appointmentData1 = {
        patient: testPatient._id,
        provider: testProvider._id,
        clinic: testClinic._id,
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        type: 'Consulta',
        status: 'scheduled'
      };

      const appointmentData2 = {
        patient: testPatient._id,
        provider: testProvider._id,
        clinic: testClinic._id,
        scheduledStart: new Date(Date.now() + 48 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 48 * 60 * 60 * 1000 + 60 * 60 * 1000),
        type: 'Limpeza',
        status: 'confirmed'
      };

      await appointmentService.createAppointment(appointmentData1);
      await appointmentService.createAppointment(appointmentData2);
    });

    it('should return appointments for patient', async () => {
      const appointments = await appointmentService.getAppointmentsByPatient(
        testPatient._id.toString()
      );

      expect(appointments).toHaveLength(2);
      expect(appointments[0].patient.toString()).toBe(testPatient._id.toString());
      expect(appointments[1].patient.toString()).toBe(testPatient._id.toString());
    });

    it('should filter appointments by status', async () => {
      const scheduledAppointments = await appointmentService.getAppointmentsByPatient(
        testPatient._id.toString(),
        { status: 'scheduled' }
      );

      expect(scheduledAppointments).toHaveLength(1);
      expect(scheduledAppointments[0].status).toBe('scheduled');
    });
  });

  describe('getAppointmentsByProvider', () => {
    beforeEach(async () => {
      // Create multiple appointments for the provider
      const appointmentData1 = {
        patient: testPatient._id,
        provider: testProvider._id,
        clinic: testClinic._id,
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        type: 'Consulta',
        status: 'scheduled'
      };

      await appointmentService.createAppointment(appointmentData1);
    });

    it('should return appointments for provider', async () => {
      const appointments = await appointmentService.getAppointmentsByProvider(
        testProvider._id.toString()
      );

      expect(appointments).toHaveLength(1);
      expect(appointments[0].provider.toString()).toBe(testProvider._id.toString());
    });
  });

  describe('checkAvailability', () => {
    it('should return true for available time slot', async () => {
      const startTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000);

      const isAvailable = await appointmentService.checkAvailability(
        testProvider._id.toString(),
        startTime,
        endTime
      );

      expect(isAvailable).toBe(true);
    });

    it('should return false for conflicting time slot', async () => {
      const startTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endTime = new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000);

      // Create an appointment
      await appointmentService.createAppointment({
        patient: testPatient._id,
        provider: testProvider._id,
        clinic: testClinic._id,
        scheduledStart: startTime,
        scheduledEnd: endTime,
        type: 'Consulta',
        status: 'scheduled'
      });

      // Check availability for overlapping time
      const conflictingStart = new Date(startTime.getTime() + 30 * 60 * 1000); // 30 minutes later
      const conflictingEnd = new Date(endTime.getTime() + 30 * 60 * 1000); // 30 minutes later

      const isAvailable = await appointmentService.checkAvailability(
        testProvider._id.toString(),
        conflictingStart,
        conflictingEnd
      );

      expect(isAvailable).toBe(false);
    });
  });
});