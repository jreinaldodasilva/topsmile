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
        appointmentType: 'Consulta',
        notes: 'Consulta de rotina',
        createdBy: testProvider._id.toString()
      };

      const result = await appointmentService.createAppointment(appointmentData);

      expect(result.patient.toString()).toBe(testPatient._id.toString());
      expect(result.provider.toString()).toBe(testProvider._id.toString());
      expect(result.appointmentType).toBe(appointmentData.appointmentType);
      expect(result.status).toBe('scheduled');
    });

    it('should throw error for invalid data', async () => {
      const invalidData = {
        patient: '',
        provider: '',
        scheduledStart: new Date(),
        scheduledEnd: new Date(),
        appointmentType: 'Consulta',
        clinic: testClinic._id.toString(),
        createdBy: testProvider._id.toString()
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
        appointmentType: 'Consulta',
        createdBy: testProvider._id.toString()
      };

      await expect(appointmentService.createAppointment(appointmentData))
        .rejects.toThrow(ValidationError);
    });
  });

  describe('getAppointmentById', () => {
    let testAppointment: any;

    beforeEach(async () => {
      const appointmentData = {
        patient: testPatient._id.toString(),
        provider: testProvider._id.toString(),
        clinic: testClinic._id.toString(),
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        appointmentType: 'Consulta',
        createdBy: testProvider._id.toString()
      };

      const result = await appointmentService.createAppointment(appointmentData);
      testAppointment = result;
    });

    it('should return appointment by ID', async () => {
      const appointment = await appointmentService.getAppointmentById(
        testAppointment._id.toString(),
        testClinic._id.toString()
      );

      expect(appointment).toBeDefined();
      expect(appointment!._id!.toString()).toBe(testAppointment._id.toString());
      expect(appointment!.patient).toBeDefined();
      expect(appointment!.provider).toBeDefined();
    });

    it('should throw error for non-existent appointment', async () => {
      const appointment = await appointmentService.getAppointmentById(
        '507f1f77bcf86cd799439011',
        testClinic._id.toString()
      );
      expect(appointment).toBeNull();
    });
  });

  describe('updateAppointment', () => {
    let testAppointment: any;

    beforeEach(async () => {
      const appointmentData = {
        patient: testPatient._id.toString(),
        provider: testProvider._id.toString(),
        clinic: testClinic._id.toString(),
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        appointmentType: 'Consulta',
        createdBy: testProvider._id.toString()
      };

      const result = await appointmentService.createAppointment(appointmentData);
      testAppointment = result;
    });

    it('should update appointment successfully', async () => {
      const updates = {
        notes: 'Updated notes',
        status: 'confirmed' as const
      };

      const updatedAppointment = await appointmentService.updateAppointment(
        testAppointment._id.toString(),
        testClinic._id.toString(),
        updates
      );

      expect(updatedAppointment!.notes).toBe(updates.notes);
      expect(updatedAppointment!.status).toBe(updates.status);
    });

    it('should throw error for non-existent appointment', async () => {
      const updates = { notes: 'Updated notes' };

      const result = await appointmentService.updateAppointment(
        '507f1f77bcf86cd799439011',
        testClinic._id.toString(),
        updates
      );
      expect(result).toBeNull();
    });
  });

  describe('cancelAppointment', () => {
    let testAppointment: any;

    beforeEach(async () => {
      const appointmentData = {
        patient: testPatient._id.toString(),
        provider: testProvider._id.toString(),
        clinic: testClinic._id.toString(),
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        appointmentType: 'Consulta',
        createdBy: testProvider._id.toString()
      };

      const result = await appointmentService.createAppointment(appointmentData);
      testAppointment = result;
    });

    it('should cancel appointment successfully', async () => {
      const reason = 'Patient requested cancellation';

      const cancelledAppointment = await appointmentService.cancelAppointment(
        testAppointment._id.toString(),
        testClinic._id.toString(),
        reason
      );

      expect(cancelledAppointment!.status).toBe('cancelled');
      expect(cancelledAppointment!.cancellationReason).toBe(reason);
    });

    it('should throw error for already cancelled appointment', async () => {
      // First cancellation
      await appointmentService.cancelAppointment(
        testAppointment._id.toString(),
        testClinic._id.toString(),
        'First cancellation'
      );

      // Second cancellation should fail
      await expect(appointmentService.cancelAppointment(
        testAppointment._id.toString(),
        testClinic._id.toString(),
        'Second cancellation'
      )).rejects.toThrow();
    });
  });

  describe('getAppointments', () => {
    beforeEach(async () => {
      // Create multiple appointments for the patient
      const appointmentData1 = {
        patient: testPatient._id.toString(),
        provider: testProvider._id.toString(),
        clinic: testClinic._id.toString(),
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        appointmentType: 'Consulta',
        createdBy: testProvider._id.toString()
      };

      const appointmentData2 = {
        patient: testPatient._id.toString(),
        provider: testProvider._id.toString(),
        clinic: testClinic._id.toString(),
        scheduledStart: new Date(Date.now() + 48 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 48 * 60 * 60 * 1000 + 60 * 60 * 1000),
        appointmentType: 'Limpeza',
        createdBy: testProvider._id.toString()
      };

      await appointmentService.createAppointment(appointmentData1);
      await appointmentService.createAppointment(appointmentData2);
    });

    it('should return appointments for clinic', async () => {
      const appointments = await appointmentService.getAppointments(
        testClinic._id.toString()
      );

      expect(appointments).toHaveLength(2);
      expect(appointments[0].patient.toString()).toBe(testPatient._id.toString());
      expect(appointments[1].patient.toString()).toBe(testPatient._id.toString());
    });

    it('should filter appointments by status', async () => {
      const scheduledAppointments = await appointmentService.getAppointments(
        testClinic._id.toString(),
        { status: 'scheduled' }
      );

      expect(scheduledAppointments).toHaveLength(2);
      expect(scheduledAppointments[0].status).toBe('scheduled');
    });
  });

  describe('getAppointmentsByProvider', () => {
    beforeEach(async () => {
      // Create multiple appointments for the provider
      const appointmentData1 = {
        patient: testPatient._id.toString(),
        provider: testProvider._id.toString(),
        clinic: testClinic._id.toString(),
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
        appointmentType: 'Consulta',
        createdBy: testProvider._id.toString()
      };

      await appointmentService.createAppointment(appointmentData1);
    });

    it('should return appointments for provider', async () => {
      const appointments = await appointmentService.getAppointments(
        testClinic._id.toString(),
        { providerId: testProvider._id.toString() }
      );

      expect(appointments).toHaveLength(1);
      expect(appointments[0].provider.toString()).toBe(testProvider._id.toString());
    });
  });
});nst appointments = await appointmentService.getAppointmentsByProvider(
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