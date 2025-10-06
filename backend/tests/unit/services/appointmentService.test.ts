// backend/tests/unit/services/appointmentService.test.ts
import { setupTestDB, teardownTestDB, clearTestDB } from '../../helpers/testSetup';
import { appointmentService } from '../../../src/services/appointmentService';
import { Appointment } from '../../../src/models/Appointment';
import { factories } from '../../helpers/factories';

describe('AppointmentService', () => {
    beforeAll(setupTestDB);
    afterAll(teardownTestDB);
    afterEach(clearTestDB);

    describe('createAppointment', () => {
        it('should create an appointment', async () => {
            const data = factories.appointment();
            const result = await appointmentService.createAppointment(data);

            expect(result).toBeDefined();
            expect(result.status).toBe('scheduled');
        });

        it('should throw ValidationError for missing required fields', async () => {
            await expect(
                appointmentService.createAppointment({} as any)
            ).rejects.toThrow('Todos os campos obrigatórios devem ser preenchidos');
        });

        it('should throw ValidationError for past date', async () => {
            const data = factories.appointment({
                scheduledStart: new Date('2020-01-01')
            });

            await expect(
                appointmentService.createAppointment(data)
            ).rejects.toThrow('Não é possível agendar no passado');
        });

        it('should throw ConflictError for overlapping appointments', async () => {
            const data = factories.appointment({
                scheduledStart: new Date('2025-12-01T10:00:00'),
                scheduledEnd: new Date('2025-12-01T11:00:00')
            });

            await appointmentService.createAppointment(data);

            const overlapping = factories.appointment({
                provider: data.provider,
                clinic: data.clinic,
                scheduledStart: new Date('2025-12-01T10:30:00'),
                scheduledEnd: new Date('2025-12-01T11:30:00')
            });

            await expect(
                appointmentService.createAppointment(overlapping)
            ).rejects.toThrow('Horário indisponível');
        });
    });

    describe('getAppointmentById', () => {
        it('should get appointment by id', async () => {
            const data = factories.appointment();
            const created = await appointmentService.createAppointment(data);
            const found = await appointmentService.getAppointmentById(
                created._id.toString(),
                data.clinic.toString()
            );

            expect(found).toBeDefined();
            expect(found._id.toString()).toBe(created._id.toString());
        });

        it('should return null for non-existent appointment', async () => {
            const found = await appointmentService.getAppointmentById(
                '507f1f77bcf86cd799439011',
                '507f1f77bcf86cd799439012'
            );

            expect(found).toBeNull();
        });
    });

    describe('checkAvailability', () => {
        it('should return true for available slot', async () => {
            const available = await appointmentService.checkAvailability(
                '507f1f77bcf86cd799439011',
                new Date('2025-12-01T10:00:00'),
                new Date('2025-12-01T11:00:00'),
                '507f1f77bcf86cd799439012'
            );

            expect(available).toBe(true);
        });

        it('should return false for unavailable slot', async () => {
            const data = factories.appointment({
                scheduledStart: new Date('2025-12-01T10:00:00'),
                scheduledEnd: new Date('2025-12-01T11:00:00')
            });

            await appointmentService.createAppointment(data);

            const available = await appointmentService.checkAvailability(
                data.provider.toString(),
                new Date('2025-12-01T10:30:00'),
                new Date('2025-12-01T11:30:00'),
                data.clinic.toString()
            );

            expect(available).toBe(false);
        });
    });

    describe('cancelAppointment', () => {
        it('should cancel appointment', async () => {
            const data = factories.appointment();
            const created = await appointmentService.createAppointment(data);
            const cancelled = await appointmentService.cancelAppointment(
                created._id.toString(),
                data.clinic.toString(),
                'Patient request'
            );

            expect(cancelled).toBeDefined();
            expect(cancelled.status).toBe('cancelled');
            expect(cancelled.cancellationReason).toBe('Patient request');
        });
    });

    describe('getAppointmentStats', () => {
        it('should return appointment statistics', async () => {
            const clinic = '507f1f77bcf86cd799439011';
            
            await appointmentService.createAppointment(factories.appointment({ clinic, status: 'scheduled' }));
            await appointmentService.createAppointment(factories.appointment({ clinic, status: 'completed' }));
            await appointmentService.createAppointment(factories.appointment({ clinic, status: 'cancelled' }));

            const stats = await appointmentService.getAppointmentStats(clinic);

            expect(stats.total).toBe(3);
            expect(stats.scheduled).toBe(1);
            expect(stats.completed).toBe(1);
            expect(stats.cancelled).toBe(1);
        });
    });
});
