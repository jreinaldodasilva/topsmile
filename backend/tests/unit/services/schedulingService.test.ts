import { schedulingService, CreateAppointmentData, AvailabilityQuery } from '../../../src/services/schedulingService';
import { Appointment } from '../../../src/models/Appointment';
import { Provider } from '../../../src/models/Provider';
import { AppointmentType } from '../../../src/models/AppointmentType';

jest.mock('../../../src/models/Appointment');
jest.mock('../../../src/models/Provider');
jest.mock('../../../src/models/AppointmentType');

const mockAppointment = Appointment as jest.Mocked<typeof Appointment>;
const mockProvider = Provider as jest.Mocked<typeof Provider>;
const mockAppointmentType = AppointmentType as jest.Mocked<typeof AppointmentType>;

// Helper to mock chained calls like findById().session() and findById().lean()
function mockFindByIdWithSessionAndLean(mockModel: any, returnValue: any) {
  const mockSession = jest.fn().mockReturnThis();
  const mockLean = jest.fn().mockResolvedValue(returnValue);
  const mockExec = jest.fn().mockResolvedValue(returnValue);

  mockModel.findById = jest.fn(() => ({
    session: mockSession,
    lean: mockLean,
    exec: mockExec
  }));

  mockSession.mockReturnValue({
    lean: mockLean,
    exec: mockExec
  });

  return { mockSession, mockLean, mockExec };
}

// Helper to mock find().session() and find().lean()
function mockFindWithSessionAndLean(mockModel: any, returnValue: any) {
  const mockSession = jest.fn().mockReturnThis();
  const mockLean = jest.fn().mockResolvedValue(returnValue);
  const mockSort = jest.fn().mockReturnThis();
  const mockSkip = jest.fn().mockReturnThis();
  const mockLimit = jest.fn().mockReturnThis();
  const mockPopulate = jest.fn().mockReturnThis();
  const mockExec = jest.fn().mockResolvedValue(returnValue);

  mockModel.find = jest.fn(() => ({
    session: mockSession,
    lean: mockLean,
    sort: mockSort,
    skip: mockSkip,
    limit: mockLimit,
    populate: mockPopulate,
    exec: mockExec
  }));

  mockSession.mockReturnValue({
    lean: mockLean,
    sort: mockSort,
    skip: mockSkip,
    limit: mockLimit,
    populate: mockPopulate,
    exec: mockExec
  });

  mockLean.mockReturnValue({
    sort: mockSort,
    skip: mockSkip,
    limit: mockLimit,
    populate: mockPopulate,
    exec: mockExec
  });

  mockSort.mockReturnValue({
    skip: mockSkip,
    limit: mockLimit,
    populate: mockPopulate,
    exec: mockExec
  });

  mockSkip.mockReturnValue({
    limit: mockLimit,
    populate: mockPopulate,
    exec: mockExec
  });

  mockLimit.mockReturnValue({
    populate: mockPopulate,
    exec: mockExec
  });

  mockPopulate.mockReturnValue({
    exec: mockExec
  });

  return { mockSession, mockLean, mockSort, mockSkip, mockLimit, mockPopulate, mockExec };
}

describe('SchedulingService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createAppointment', () => {
    it('should create appointment successfully', async () => {
      const appointmentData = {
        clinicId: 'clinic-id',
        patientId: 'patient-id',
        providerId: 'provider-id',
        appointmentTypeId: 'type-id',
        scheduledStart: new Date('2024-01-01T10:00:00Z'),
        notes: 'Test appointment',
        priority: 'routine' as const,
        createdBy: 'user-id'
      };

      const mockAppointmentTypeData = {
        _id: 'type-id',
        duration: 60,
        requiresApproval: false,
        bufferBefore: 15,
        bufferAfter: 15
      };

      const mockProviderData = {
        _id: 'provider-id',
        isActive: true,
        workingHours: {
          monday: { isWorking: true, start: '09:00', end: '17:00' }
        },
        timeZone: 'America/Sao_Paulo'
      };

      const mockSavedAppointment = {
        ...appointmentData,
        scheduledEnd: new Date('2024-01-01T11:00:00Z'),
        status: 'confirmed',
        _id: 'appointment-id'
      };

      // Mock the chained calls properly
      mockFindByIdWithSessionAndLean(mockAppointmentType, mockAppointmentTypeData);
      mockFindByIdWithSessionAndLean(mockProvider, mockProviderData);
      mockFindWithSessionAndLean(mockAppointment, []); // No conflicts
      mockAppointment.prototype.save = jest.fn().mockResolvedValue(mockSavedAppointment);

      const result = await schedulingService.createAppointment(appointmentData);

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe('confirmed');
    });

    it('should return error for invalid appointment type', async () => {
      const appointmentData = {
        clinicId: 'clinic-id',
        patientId: 'patient-id',
        providerId: 'provider-id',
        appointmentTypeId: 'invalid-type',
        scheduledStart: new Date()
      };

      mockFindByIdWithSessionAndLean(mockAppointmentType, null);

      const result = await schedulingService.createAppointment(appointmentData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Tipo de agendamento não encontrado');
    });

    it('should return error for inactive provider', async () => {
      const appointmentData = {
        clinicId: 'clinic-id',
        patientId: 'patient-id',
        providerId: 'provider-id',
        appointmentTypeId: 'type-id',
        scheduledStart: new Date()
      };

      const mockAppointmentTypeData = {
        _id: 'type-id',
        duration: 60,
        requiresApproval: false
      };

      const mockProviderData = {
        _id: 'provider-id',
        isActive: false
      };

      mockFindByIdWithSessionAndLean(mockAppointmentType, mockAppointmentTypeData);
      mockFindByIdWithSessionAndLean(mockProvider, mockProviderData);

      const result = await schedulingService.createAppointment(appointmentData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Profissional não encontrado ou inativo');
    });

    it('should return error for time conflict', async () => {
      const appointmentData = {
        clinicId: 'clinic-id',
        patientId: 'patient-id',
        providerId: 'provider-id',
        appointmentTypeId: 'type-id',
        scheduledStart: new Date('2024-01-01T10:00:00Z')
      };

      const mockAppointmentTypeData = {
        _id: 'type-id',
        duration: 60,
        requiresApproval: false,
        bufferBefore: 15,
        bufferAfter: 15
      };

      const mockProviderData = {
        _id: 'provider-id',
        isActive: true,
        workingHours: {
          monday: { isWorking: true, start: '09:00', end: '17:00' }
        },
        timeZone: 'America/Sao_Paulo'
      };

      const conflictingAppointment = {
        _id: 'conflict-id',
        scheduledStart: new Date('2024-01-01T09:30:00Z'),
        scheduledEnd: new Date('2024-01-01T10:30:00Z'),
        status: 'confirmed'
      };

      mockFindByIdWithSessionAndLean(mockAppointmentType, mockAppointmentTypeData);
      mockFindByIdWithSessionAndLean(mockProvider, mockProviderData);
      mockFindWithSessionAndLean(mockAppointment, [conflictingAppointment]);

      const result = await schedulingService.createAppointment(appointmentData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Horário não disponível');
    });
  });

  describe('rescheduleAppointment', () => {
    it('should reschedule appointment successfully', async () => {
      const appointmentId = 'appointment-id';
      const newStart = new Date('2024-01-01T14:00:00Z');
      const reason = 'Patient requested change';
      const rescheduleBy = 'patient' as const;

      const mockAppointmentData = {
        _id: appointmentId,
        provider: 'provider-id',
        appointmentType: 'type-id',
        scheduledStart: new Date('2024-01-01T10:00:00Z'),
        scheduledEnd: new Date('2024-01-01T11:00:00Z'),
        rescheduleHistory: [],
        save: jest.fn().mockResolvedValue({
          _id: appointmentId,
          scheduledStart: newStart,
          scheduledEnd: new Date('2024-01-01T15:00:00Z'),
          status: 'scheduled'
        })
      };

      const mockAppointmentTypeData = {
        _id: 'type-id',
        duration: 60,
        bufferBefore: 15,
        bufferAfter: 15
      };

      mockFindByIdWithSessionAndLean(mockAppointment, mockAppointmentData);
      mockFindByIdWithSessionAndLean(mockAppointmentType, mockAppointmentTypeData);
      mockFindWithSessionAndLean(mockAppointment, []); // No conflicts

      const result = await schedulingService.rescheduleAppointment(appointmentId, newStart, reason, rescheduleBy);

      expect(result.success).toBe(true);
      expect(result.data?.scheduledStart).toEqual(newStart);
      expect(result.data?.status).toBe('scheduled');
      expect(mockAppointmentData.rescheduleHistory).toHaveLength(1);
    });

    it('should return error for non-existent appointment', async () => {
      mockFindByIdWithSessionAndLean(mockAppointment, null);

      const result = await schedulingService.rescheduleAppointment(
        'non-existent-id',
        new Date(),
        'Test reason',
        'clinic'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Agendamento não encontrado');
    });
  });

  describe('cancelAppointment', () => {
    it('should cancel appointment successfully', async () => {
      const appointmentId = 'appointment-id';
      const reason = 'Patient cancelled';

      const mockAppointmentData = {
        _id: appointmentId,
        status: 'confirmed',
        save: jest.fn().mockResolvedValue({
          _id: appointmentId,
          status: 'cancelled',
          cancellationReason: reason
        })
      };

      mockAppointment.findById.mockResolvedValue(mockAppointmentData as any);

      const result = await schedulingService.cancelAppointment(appointmentId, reason);

      expect(result.success).toBe(true);
      expect(result.data?.status).toBe('cancelled');
      expect(result.data?.cancellationReason).toBe(reason);
    });

    it('should prevent cancelling completed appointment', async () => {
      const mockAppointmentData = {
        _id: 'appointment-id',
        status: 'completed'
      };

      mockAppointment.findById.mockResolvedValue(mockAppointmentData as any);

      const result = await schedulingService.cancelAppointment('appointment-id', 'Test reason');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Não é possível cancelar um agendamento já concluído');
    });
  });

  describe('getAvailableSlots', () => {
    it('should return available time slots', async () => {
      const query = {
        clinicId: 'clinic-id',
        providerId: 'provider-id',
        appointmentTypeId: 'type-id',
        date: new Date('2024-01-01'),
        excludeAppointmentId: 'exclude-id'
      };

      const mockAppointmentTypeData = {
        _id: 'type-id',
        duration: 60,
        bufferBefore: 15,
        bufferAfter: 15
      };

      const mockProviderData = {
        _id: 'provider-id',
        clinic: 'clinic-id',
        isActive: true,
        workingHours: {
          monday: { isWorking: true, start: '09:00', end: '17:00' }
        },
        timeZone: 'America/Sao_Paulo',
        bufferTimeBefore: 0,
        bufferTimeAfter: 0
      };

      mockFindByIdWithSessionAndLean(mockAppointmentType, mockAppointmentTypeData);
      mockFindWithSessionAndLean(mockProvider, [mockProviderData]);
      mockFindWithSessionAndLean(mockAppointment, []); // No existing appointments

      const result = await schedulingService.getAvailableSlots(query);

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('start');
      expect(result[0]).toHaveProperty('end');
      expect(result[0]).toHaveProperty('available');
      expect(result[0].available).toBe(true);
    });

    it('should return empty array for non-existent appointment type', async () => {
      const query = {
        clinicId: 'clinic-id',
        appointmentTypeId: 'non-existent-type',
        date: new Date()
      };

      mockAppointmentType.findById.mockResolvedValue(null);

      const result = await schedulingService.getAvailableSlots(query);

      expect(result).toEqual([]);
    });

    it('should return empty array when no providers available', async () => {
      const query = {
        clinicId: 'clinic-id',
        appointmentTypeId: 'type-id',
        date: new Date()
      };

      const mockAppointmentTypeData = {
        _id: 'type-id',
        duration: 60
      };

      mockAppointmentType.findById.mockResolvedValue(mockAppointmentTypeData as any);
      mockProvider.find.mockResolvedValue([]); // No providers

      const result = await schedulingService.getAvailableSlots(query);

      expect(result).toEqual([]);
    });
  });

  describe('getAppointments', () => {
    it('should return appointments within date range', async () => {
      const clinicId = 'clinic-id';
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-01T23:59:59Z');

      const mockAppointments = [
        {
          _id: '1',
          scheduledStart: new Date('2024-01-01T10:00:00Z'),
          scheduledEnd: new Date('2024-01-01T11:00:00Z'),
          status: 'confirmed',
          patient: { name: 'João Silva' },
          provider: { name: 'Dr. Maria' },
          appointmentType: { name: 'Consulta', duration: 60 }
        }
      ];

      const mockQuery = {
        find: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockAppointments)
      };

      mockAppointment.find.mockReturnValue(mockQuery as any);

      const result = await schedulingService.getAppointments(clinicId, startDate, endDate);

      expect(result).toEqual(mockAppointments);
      expect(mockQuery.find).toHaveBeenCalledWith({
        clinic: clinicId,
        scheduledStart: {
          $gte: startDate,
          $lte: endDate
        }
      });
    });

    it('should filter by provider and status', async () => {
      const clinicId = 'clinic-id';
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-01T23:59:59Z');
      const providerId = 'provider-id';
      const status = 'confirmed';

      const mockQuery = {
        find: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      };

      mockAppointment.find.mockReturnValue(mockQuery as any);

      await schedulingService.getAppointments(clinicId, startDate, endDate, providerId, status);

      expect(mockQuery.find).toHaveBeenCalledWith({
        clinic: clinicId,
        scheduledStart: {
          $gte: startDate,
          $lte: endDate
        },
        provider: providerId,
        status: status
      });
    });
  });

  describe('getAppointmentConflicts', () => {
    it('should return no conflicts when slot is available', async () => {
      const providerId = 'provider-id';
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');
      const appointmentTypeId = 'type-id';

      const mockAppointmentTypeData = {
        _id: 'type-id',
        bufferBefore: 15,
        bufferAfter: 15
      };

      mockFindByIdWithSessionAndLean(mockAppointmentType, mockAppointmentTypeData);
      mockFindWithSessionAndLean(mockAppointment, []); // No conflicting appointments

      const result = await schedulingService.getAppointmentConflicts(providerId, startDate, endDate, appointmentTypeId);

      expect(result.hasConflict).toBe(false);
      expect(result.conflictingAppointments).toBeUndefined();
    });

    it('should return conflicts when appointments overlap', async () => {
      const providerId = 'provider-id';
      const startDate = new Date('2024-01-01T10:00:00Z');
      const endDate = new Date('2024-01-01T11:00:00Z');
      const appointmentTypeId = 'type-id';

      const mockAppointmentTypeData = {
        _id: 'type-id',
        bufferBefore: 15,
        bufferAfter: 15
      };

      const conflictingAppointment = {
        _id: 'conflict-id',
        scheduledStart: new Date('2024-01-01T10:30:00Z'),
        scheduledEnd: new Date('2024-01-01T11:30:00Z'),
        status: 'confirmed'
      };

      mockAppointmentType.findById.mockResolvedValue(mockAppointmentTypeData as any);
      mockAppointment.find.mockResolvedValue([conflictingAppointment]);

      const result = await schedulingService.getAppointmentConflicts(providerId, startDate, endDate, appointmentTypeId);

      expect(result.hasConflict).toBe(true);
      expect(result.conflictingAppointments).toHaveLength(1);
      expect(result.reason).toContain('conflito');
    });
  });

  describe('getProviderUtilization', () => {
    it('should calculate provider utilization correctly', async () => {
      const providerId = 'provider-id';
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-07'); // 7 days

      const mockAppointments = [
        { status: 'completed' },
        { status: 'scheduled' },
        { status: 'cancelled' },
        { status: 'no_show' }
      ];

      mockAppointment.find.mockResolvedValue(mockAppointments);

      const result = await schedulingService.getProviderUtilization(providerId, startDate, endDate);

      expect(result).toHaveProperty('totalSlots');
      expect(result).toHaveProperty('bookedSlots');
      expect(result).toHaveProperty('utilizationRate');
      expect(result).toHaveProperty('appointments');
      expect(result.appointments.completed).toBe(1);
      expect(result.appointments.scheduled).toBe(1);
      expect(result.appointments.cancelled).toBe(1);
      expect(result.appointments.noShow).toBe(1);
    });
  });
});
