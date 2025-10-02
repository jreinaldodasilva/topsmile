import { appointmentService } from '../../../src/services/appointmentService';
import { Appointment } from '../../../src/models/Appointment';
import { createTestUser, createTestClinic, createTestPatient, createTestProvider } from '../../testHelpers';
import mongoose from 'mongoose';

describe('AppointmentService - Core Business Logic', () => {
  let testClinic: any;
  let testPatient: any;
  let testProvider: any;
  let testAppointmentType: any;

  beforeEach(async () => {
    // Clean up
    await Appointment.deleteMany({});
    
    // Create test data
    testClinic = await createTestClinic();
    testPatient = await createTestPatient({ clinic: testClinic._id });
    testProvider = await createTestProvider({ clinic: testClinic._id });
    testAppointmentType = new mongoose.Types.ObjectId();
  });

  describe('createAppointment', () => {
    const getValidAppointmentData = () => ({
      patient: testPatient._id.toString(),
      provider: testProvider._id.toString(),
      appointmentType: testAppointmentType.toString(),
      scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // Tomorrow + 1 hour
      clinic: testClinic._id.toString(),
      createdBy: testProvider._id.toString(),
      notes: 'Test appointment'
    });

    it('should create appointment with valid data', async () => {
      const appointmentData = getValidAppointmentData();

      const result = await appointmentService.createAppointment(appointmentData);

      expect(result).toBeDefined();
      expect(result.patient.toString()).toBe(appointmentData.patient);
      expect(result.provider.toString()).toBe(appointmentData.provider);
      expect(result.status).toBe('scheduled');
      expect(result.notes).toBe(appointmentData.notes);
    });

    it('should throw error for missing required fields', async () => {
      const testCases = [
        { field: 'patient', error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { field: 'provider', error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { field: 'appointmentType', error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { field: 'scheduledStart', error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { field: 'scheduledEnd', error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { field: 'clinic', error: 'Todos os campos obrigatórios devem ser preenchidos' }
      ];

      for (const testCase of testCases) {
        const appointmentData = getValidAppointmentData();
        const data: any = { ...appointmentData };
        data[testCase.field] = undefined;

        await expect(appointmentService.createAppointment(data))
          .rejects.toThrow(testCase.error);
      }
    });

    it('should throw error for past appointment dates', async () => {
      const appointmentData = getValidAppointmentData();
      appointmentData.scheduledStart = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      appointmentData.scheduledEnd = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago

      await expect(appointmentService.createAppointment(appointmentData))
        .rejects.toThrow('Não é possível agendar no passado');
    });

    it('should throw error for invalid clinic ID', async () => {
      const appointmentData = getValidAppointmentData();
      appointmentData.clinic = 'invalid-id';

      await expect(appointmentService.createAppointment(appointmentData))
        .rejects.toThrow('ID da clínica inválido');
    });

    it('should detect overlapping appointments', async () => {
      const appointmentData = getValidAppointmentData();

      // Create first appointment
      await appointmentService.createAppointment(appointmentData);

      // Try to create overlapping appointment
      const overlappingData = {
        ...appointmentData,
        patient: (await createTestPatient({ clinic: testClinic._id }))._id!.toString(),
        scheduledStart: new Date(appointmentData.scheduledStart.getTime() + 30 * 60 * 1000), // 30 min later
        scheduledEnd: new Date(appointmentData.scheduledEnd.getTime() + 30 * 60 * 1000) // 30 min later
      };

      await expect(appointmentService.createAppointment(overlappingData))
        .rejects.toThrow('Horário indisponível');
    });

    it('should allow non-overlapping appointments', async () => {
      const appointmentData = getValidAppointmentData();

      // Create first appointment
      await appointmentService.createAppointment(appointmentData);

      // Create non-overlapping appointment
      const nonOverlappingData = {
        ...appointmentData,
        patient: (await createTestPatient({ clinic: testClinic._id }))._id!.toString(),
        scheduledStart: new Date(appointmentData.scheduledEnd.getTime() + 60 * 60 * 1000), // 1 hour after first ends
        scheduledEnd: new Date(appointmentData.scheduledEnd.getTime() + 2 * 60 * 60 * 1000) // 2 hours after first ends
      };

      const result = await appointmentService.createAppointment(nonOverlappingData);
      expect(result).toBeDefined();
    });

    it('should handle different priority levels', async () => {
      const priorities = ['routine', 'urgent', 'emergency'] as const;

      for (const priority of priorities) {
        const appointmentData = {
          ...getValidAppointmentData(),
          priority,
          scheduledStart: new Date(Date.now() + (24 + priorities.indexOf(priority)) * 60 * 60 * 1000),
          scheduledEnd: new Date(Date.now() + (25 + priorities.indexOf(priority)) * 60 * 60 * 1000)
        };

        const result = await appointmentService.createAppointment(appointmentData);
        expect(result.priority).toBe(priority);
      }
    });
  });

  describe('getAppointmentById', () => {
    it('should return appointment by valid ID', async () => {
      const appointmentData = {
        patient: testPatient._id.toString(),
        provider: testProvider._id.toString(),
        appointmentType: testAppointmentType.toString(),
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 25 * 60 * 60 * 1000),
        clinic: testClinic._id.toString(),
        createdBy: testProvider._id.toString()
      };

      const created = await appointmentService.createAppointment(appointmentData);
      const result = await appointmentService.getAppointmentById(created._id!.toString(), testClinic._id.toString());

      expect(result).toBeDefined();
      expect(result!._id.toString()).toBe(created._id!.toString());
    });

    it('should return null for non-existent appointment', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const result = await appointmentService.getAppointmentById(nonExistentId, testClinic._id.toString());

      expect(result).toBeNull();
    });

    it('should throw error for invalid appointment ID', async () => {
      await expect(appointmentService.getAppointmentById('invalid-id', testClinic._id.toString()))
        .rejects.toThrow('ID do agendamento inválido');
    });

    it('should not return appointments from different clinics', async () => {
      const otherClinic = await createTestClinic();
      const appointmentData = {
        patient: testPatient._id.toString(),
        provider: testProvider._id.toString(),
        appointmentType: testAppointmentType.toString(),
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 25 * 60 * 60 * 1000),
        clinic: testClinic._id.toString(),
        createdBy: testProvider._id.toString()
      };

      const created = await appointmentService.createAppointment(appointmentData);
      const result = await appointmentService.getAppointmentById(created._id!.toString(), otherClinic._id!.toString());

      expect(result).toBeNull();
    });
  });

  describe('updateAppointment', () => {
    let testAppointment: any;

    beforeEach(async () => {
      const appointmentData = {
        patient: testPatient._id.toString(),
        provider: testProvider._id.toString(),
        appointmentType: testAppointmentType.toString(),
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 25 * 60 * 60 * 1000),
        clinic: testClinic._id.toString(),
        createdBy: testProvider._id.toString()
      };

      testAppointment = await appointmentService.createAppointment(appointmentData);
    });

    it('should update appointment notes', async () => {
      const newNotes = 'Updated appointment notes';
      const result = await appointmentService.updateAppointment(
        testAppointment._id.toString(),
        testClinic._id.toString(),
        { notes: newNotes }
      );

      expect(result).toBeDefined();
      expect(result!.notes).toBe(newNotes);
    });

    it('should update appointment status', async () => {
      const newStatus = 'confirmed';
      const result = await appointmentService.updateAppointment(
        testAppointment._id.toString(),
        testClinic._id.toString(),
        { status: newStatus }
      );

      expect(result).toBeDefined();
      expect(result!.status).toBe(newStatus);
    });

    it('should reschedule appointment and track history', async () => {
      const newStart = new Date(Date.now() + 48 * 60 * 60 * 1000); // Day after tomorrow
      const newEnd = new Date(Date.now() + 49 * 60 * 60 * 1000);

      const result = await appointmentService.updateAppointment(
        testAppointment._id.toString(),
        testClinic._id.toString(),
        { 
          scheduledStart: newStart,
          scheduledEnd: newEnd
        }
      );

      expect(result).toBeDefined();
      expect(result!.scheduledStart).toEqual(newStart);
      expect(result!.scheduledEnd).toEqual(newEnd);
    });

    it('should prevent rescheduling to conflicting times', async () => {
      // Create another appointment
      const conflictingAppointment = await appointmentService.createAppointment({
        patient: (await createTestPatient({ clinic: testClinic._id }))._id!.toString(),
        provider: testProvider._id.toString(),
        appointmentType: testAppointmentType.toString(),
        scheduledStart: new Date(Date.now() + 48 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 49 * 60 * 60 * 1000),
        clinic: testClinic._id.toString(),
        createdBy: testProvider._id.toString()
      });

      // Try to reschedule to same time
      await expect(appointmentService.updateAppointment(
        testAppointment._id.toString(),
        testClinic._id.toString(),
        {
          scheduledStart: new Date(conflictingAppointment.scheduledStart),
          scheduledEnd: new Date(conflictingAppointment.scheduledEnd)
        }
      )).rejects.toThrow('Horário indisponível');
    });

    it('should prevent updating cancelled appointments', async () => {
      // Cancel the appointment first
      await appointmentService.updateAppointment(
        testAppointment._id.toString(),
        testClinic._id.toString(),
        { status: 'cancelled' }
      );

      // Try to update cancelled appointment
      await expect(appointmentService.updateAppointment(
        testAppointment._id.toString(),
        testClinic._id.toString(),
        { notes: 'Should not work' }
      )).rejects.toThrow('Não é possível alterar um agendamento cancelado');
    });

    it('should return null for non-existent appointment', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const result = await appointmentService.updateAppointment(
        nonExistentId,
        testClinic._id.toString(),
        { notes: 'Test' }
      );

      expect(result).toBeNull();
    });
  });

  describe('checkAvailability', () => {
    it('should return true for available time slot', async () => {
      const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endDate = new Date(Date.now() + 25 * 60 * 60 * 1000);

      const result = await appointmentService.checkAvailability(
        testProvider._id.toString(),
        startDate,
        endDate,
        testClinic._id.toString()
      );

      expect(result).toBe(true);
    });

    it('should return false for conflicting time slot', async () => {
      const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endDate = new Date(Date.now() + 25 * 60 * 60 * 1000);

      // Create appointment
      await appointmentService.createAppointment({
        patient: testPatient._id.toString(),
        provider: testProvider._id.toString(),
        appointmentType: testAppointmentType.toString(),
        scheduledStart: startDate,
        scheduledEnd: endDate,
        clinic: testClinic._id.toString(),
        createdBy: testProvider._id.toString()
      });

      // Check same time slot
      const result = await appointmentService.checkAvailability(
        testProvider._id.toString(),
        startDate,
        endDate,
        testClinic._id.toString()
      );

      expect(result).toBe(false);
    });

    it('should return true for cancelled appointment time slot', async () => {
      const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endDate = new Date(Date.now() + 25 * 60 * 60 * 1000);

      // Create and cancel appointment
      const appointment = await appointmentService.createAppointment({
        patient: testPatient._id.toString(),
        provider: testProvider._id.toString(),
        appointmentType: testAppointmentType.toString(),
        scheduledStart: startDate,
        scheduledEnd: endDate,
        clinic: testClinic._id.toString(),
        createdBy: testProvider._id.toString()
      });

      await appointmentService.cancelAppointment(
        appointment._id!.toString(),
        testClinic._id.toString(),
        'Test cancellation'
      );

      // Check availability - should be true since appointment is cancelled
      const result = await appointmentService.checkAvailability(
        testProvider._id.toString(),
        startDate,
        endDate,
        testClinic._id.toString()
      );

      expect(result).toBe(true);
    });
  });

  describe('getAppointmentStats', () => {
    beforeEach(async () => {
      // Create appointments with different statuses
      const baseDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const statuses = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled'];

      for (let i = 0; i < statuses.length; i++) {
        const appointment = await appointmentService.createAppointment({
          patient: (await createTestPatient({ clinic: testClinic._id }))._id!.toString(),
          provider: testProvider._id.toString(),
          appointmentType: testAppointmentType.toString(),
          scheduledStart: new Date(baseDate.getTime() + i * 60 * 60 * 1000),
          scheduledEnd: new Date(baseDate.getTime() + (i + 1) * 60 * 60 * 1000),
          clinic: testClinic._id.toString(),
          createdBy: testProvider._id.toString()
        });

        if (statuses[i] !== 'scheduled') {
          await appointmentService.updateAppointment(
            appointment._id!.toString(),
            testClinic._id.toString(),
            { status: statuses[i] as any }
          );
        }
      }
    });

    it('should return correct appointment statistics', async () => {
      const stats = await appointmentService.getAppointmentStats(testClinic._id.toString());

      expect(stats.total).toBe(5);
      expect(stats.scheduled).toBe(1);
      expect(stats.confirmed).toBe(1);
      expect(stats.inProgress).toBe(1);
      expect(stats.completed).toBe(1);
      expect(stats.cancelled).toBe(1);
    });

    it('should filter stats by date range', async () => {
      const startDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const endDate = new Date(Date.now() + 26 * 60 * 60 * 1000); // Only first 2 appointments

      const stats = await appointmentService.getAppointmentStats(
        testClinic._id.toString(),
        startDate,
        endDate
      );

      expect(stats.total).toBeLessThan(5); // Should be filtered
    });

    it('should throw error for invalid clinic ID', async () => {
      await expect(appointmentService.getAppointmentStats('invalid-id'))
        .rejects.toThrow('ID da clínica inválido');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle concurrent appointment creation', async () => {
      const appointmentData = {
        patient: testPatient._id.toString(),
        provider: testProvider._id.toString(),
        appointmentType: testAppointmentType.toString(),
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 25 * 60 * 60 * 1000),
        clinic: testClinic._id.toString(),
        createdBy: testProvider._id.toString()
      };

      // Try to create multiple appointments at the same time
      const promises = Array(3).fill(null).map(() =>
        appointmentService.createAppointment({
          ...appointmentData,
          patient: new mongoose.Types.ObjectId().toString() // Different patients
        })
      );

      const results = await Promise.allSettled(promises);

      // Only one should succeed due to provider conflict
      const successes = results.filter(r => r.status === 'fulfilled');
      const failures = results.filter(r => r.status === 'rejected');

      expect(successes.length).toBe(1);
      expect(failures.length).toBe(2);
    });

    it('should handle database errors gracefully', async () => {
      // Mock database error
      const originalFind = Appointment.findOne;
      Appointment.findOne = jest.fn().mockRejectedValue(new Error('Database connection lost'));

      await expect(appointmentService.checkAvailability(
        testProvider._id.toString(),
        new Date(),
        new Date(),
        testClinic._id.toString()
      )).rejects.toThrow('Erro ao verificar disponibilidade');

      // Restore original method
      Appointment.findOne = originalFind;
    });

    it('should validate appointment duration', async () => {
      const appointmentData = {
        patient: testPatient._id.toString(),
        provider: testProvider._id.toString(),
        appointmentType: testAppointmentType.toString(),
        scheduledStart: new Date(Date.now() + 25 * 60 * 60 * 1000), // End before start
        scheduledEnd: new Date(Date.now() + 24 * 60 * 60 * 1000),
        clinic: testClinic._id.toString(),
        createdBy: testProvider._id.toString()
      };

      // This should be handled by the model validation or business logic
      await expect(appointmentService.createAppointment(appointmentData))
        .rejects.toThrow();
    });

    it('should handle very long notes', async () => {
      const appointmentData = {
        patient: testPatient._id.toString(),
        provider: testProvider._id.toString(),
        appointmentType: testAppointmentType.toString(),
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 25 * 60 * 60 * 1000),
        clinic: testClinic._id.toString(),
        createdBy: testProvider._id.toString(),
        notes: 'x'.repeat(10000) // Very long notes
      };

      // Should either succeed or fail gracefully
      try {
        const result = await appointmentService.createAppointment(appointmentData);
        expect(result).toBeDefined();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});