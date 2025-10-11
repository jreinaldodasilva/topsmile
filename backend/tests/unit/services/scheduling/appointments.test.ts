import { schedulingService } from '../../../../src/services/scheduling/schedulingService';
import { Provider } from '../../../../src/models/Provider';
import { Patient } from '../../../../src/models/Patient';
import { AppointmentType } from '../../../../src/models/AppointmentType';
import { Clinic } from '../../../../src/models/Clinic';
import { addHours, startOfDay } from 'date-fns';

describe('SchedulingService - Appointments', () => {
    let clinic: any;
    let provider: any;
    let patient: any;
    let appointmentType: any;

    beforeEach(async () => {
        clinic = await Clinic.create({
            name: 'Test Clinic',
            email: 'clinic@test.com',
            phone: '1234567890',
            address: { street: 'Test St', city: 'Test City', state: 'TS', zipCode: '12345' }
        });

        provider = await Provider.create({
            name: 'Dr. Test',
            email: 'doctor@test.com',
            clinic: clinic._id,
            specialties: ['general'],
            workingHours: {
                monday: { start: '09:00', end: '17:00', isWorking: true },
                tuesday: { start: '09:00', end: '17:00', isWorking: true },
                wednesday: { start: '09:00', end: '17:00', isWorking: true },
                thursday: { start: '09:00', end: '17:00', isWorking: true },
                friday: { start: '09:00', end: '17:00', isWorking: true },
                saturday: { start: '09:00', end: '12:00', isWorking: false },
                sunday: { start: '09:00', end: '12:00', isWorking: false }
            },
            timeZone: 'America/Sao_Paulo'
        });

        patient = await Patient.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'patient@test.com',
            phone: '1234567890',
            clinic: clinic._id,
            address: { street: 'Test St', city: 'Test City', state: 'TS', zipCode: '12345' }
        });

        appointmentType = await AppointmentType.create({
            name: 'Consultation',
            duration: 60,
            clinic: clinic._id,
            category: 'consultation'
        });
    });

    describe('createAppointment', () => {
        it('should create appointment with valid data', async () => {
            const tomorrow = addHours(startOfDay(new Date()), 34);

            const result = await schedulingService.createAppointment({
                clinicId: clinic._id.toString(),
                patientId: patient._id.toString(),
                providerId: provider._id.toString(),
                appointmentTypeId: appointmentType._id.toString(),
                scheduledStart: tomorrow
            });

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data?.patient.toString()).toBe(patient._id.toString());
        });

        it('should reject missing required fields', async () => {
            const result = await schedulingService.createAppointment({
                clinicId: clinic._id.toString(),
                patientId: '',
                providerId: provider._id.toString(),
                appointmentTypeId: appointmentType._id.toString(),
                scheduledStart: new Date()
            });

            expect(result.success).toBe(false);
            expect(result.error).toContain('obrigatórios');
        });
    });

    describe('cancelAppointment', () => {
        it('should cancel existing appointment', async () => {
            const tomorrow = addHours(startOfDay(new Date()), 34);

            const created = await schedulingService.createAppointment({
                clinicId: clinic._id.toString(),
                patientId: patient._id.toString(),
                providerId: provider._id.toString(),
                appointmentTypeId: appointmentType._id.toString(),
                scheduledStart: tomorrow
            });

            const result = await schedulingService.cancelAppointment(
                created.data!._id.toString(),
                'Patient request'
            );

            expect(result.success).toBe(true);
            expect(result.data?.status).toBe('cancelled');
        });
    });
});
