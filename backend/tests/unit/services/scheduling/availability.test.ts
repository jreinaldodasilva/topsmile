import { schedulingService } from '../../../../src/services/scheduling/schedulingService';
import { Provider } from '../../../../src/models/Provider';
import { AppointmentType } from '../../../../src/models/AppointmentType';
import { Clinic } from '../../../../src/models/Clinic';
import { startOfDay, addHours } from 'date-fns';

describe('SchedulingService - Availability', () => {
    let clinic: any;
    let provider: any;
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

        appointmentType = await AppointmentType.create({
            name: 'Consultation',
            duration: 60,
            clinic: clinic._id,
            category: 'consultation'
        });
    });

    describe('getAvailableSlots', () => {
        it('should return available slots for working day', async () => {
            const monday = startOfDay(new Date());
            monday.setDate(monday.getDate() + (1 - monday.getDay() + 7) % 7);

            const slots = await schedulingService.getAvailableSlots({
                clinicId: clinic._id.toString(),
                providerId: provider._id.toString(),
                appointmentTypeId: appointmentType._id.toString(),
                date: monday
            });

            expect(slots.length).toBeGreaterThan(0);
            expect(slots[0].available).toBe(true);
            expect(slots[0].providerId).toBe(provider._id.toString());
        });

        it('should return empty for non-working day', async () => {
            const sunday = startOfDay(new Date());
            sunday.setDate(sunday.getDate() + (7 - sunday.getDay()));

            const slots = await schedulingService.getAvailableSlots({
                clinicId: clinic._id.toString(),
                providerId: provider._id.toString(),
                appointmentTypeId: appointmentType._id.toString(),
                date: sunday
            });

            expect(slots.length).toBe(0);
        });
    });
});
