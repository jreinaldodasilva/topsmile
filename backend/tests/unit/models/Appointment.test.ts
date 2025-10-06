// backend/tests/unit/models/Appointment.test.ts
import { Appointment } from '../../../src/models/Appointment';
import { setupTestDB, teardownTestDB, clearTestDB } from '../../helpers/testSetup';
import { createTestPatient, createTestProvider, createTestAppointmentType } from '../../helpers/factories';
import { faker } from '@faker-js/faker';

describe('Appointment Model', () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    beforeEach(async () => {
        await clearTestDB();
    });

    describe('Validation', () => {
        it('should create appointment with valid data', async () => {
            const patient = await createTestPatient();
            const provider = await createTestProvider();
            const appointmentType = await createTestAppointmentType();

            const appointment = new Appointment({
                patient: patient._id,
                clinic: faker.database.mongodbObjectId(),
                provider: provider._id,
                appointmentType: appointmentType._id,
                scheduledStart: new Date(),
                scheduledEnd: new Date(Date.now() + 3600000),
                createdBy: faker.database.mongodbObjectId()
            });

            await expect(appointment.save()).resolves.toBeDefined();
        });

        it('should fail without required fields', async () => {
            const appointment = new Appointment({});

            await expect(appointment.save()).rejects.toThrow();
        });

        it('should validate scheduledEnd after scheduledStart', async () => {
            const patient = await createTestPatient();
            const provider = await createTestProvider();
            const appointmentType = await createTestAppointmentType();

            const appointment = new Appointment({
                patient: patient._id,
                clinic: faker.database.mongodbObjectId(),
                provider: provider._id,
                appointmentType: appointmentType._id,
                scheduledStart: new Date(),
                scheduledEnd: new Date(Date.now() - 3600000),
                createdBy: faker.database.mongodbObjectId()
            });

            await expect(appointment.save()).rejects.toThrow();
        });
    });

    describe('Pre-save hooks', () => {
        it('should calculate duration when actualStart and actualEnd are set', async () => {
            const patient = await createTestPatient();
            const provider = await createTestProvider();
            const appointmentType = await createTestAppointmentType();

            const appointment = new Appointment({
                patient: patient._id,
                clinic: faker.database.mongodbObjectId(),
                provider: provider._id,
                appointmentType: appointmentType._id,
                scheduledStart: new Date(),
                scheduledEnd: new Date(Date.now() + 3600000),
                actualStart: new Date(),
                actualEnd: new Date(Date.now() + 1800000),
                createdBy: faker.database.mongodbObjectId()
            });

            await appointment.save();

            expect(appointment.duration).toBe(30);
        });

        it('should set checkedInAt when status changes to checked_in', async () => {
            const patient = await createTestPatient();
            const provider = await createTestProvider();
            const appointmentType = await createTestAppointmentType();

            const appointment = new Appointment({
                patient: patient._id,
                clinic: faker.database.mongodbObjectId(),
                provider: provider._id,
                appointmentType: appointmentType._id,
                scheduledStart: new Date(),
                scheduledEnd: new Date(Date.now() + 3600000),
                status: 'checked_in',
                createdBy: faker.database.mongodbObjectId()
            });

            await appointment.save();

            expect(appointment.checkedInAt).toBeDefined();
        });

        it('should set completedAt when status changes to completed', async () => {
            const patient = await createTestPatient();
            const provider = await createTestProvider();
            const appointmentType = await createTestAppointmentType();

            const appointment = new Appointment({
                patient: patient._id,
                clinic: faker.database.mongodbObjectId(),
                provider: provider._id,
                appointmentType: appointmentType._id,
                scheduledStart: new Date(),
                scheduledEnd: new Date(Date.now() + 3600000),
                status: 'completed',
                createdBy: faker.database.mongodbObjectId()
            });

            await appointment.save();

            expect(appointment.completedAt).toBeDefined();
        });
    });

    describe('Indexes', () => {
        it('should have compound index on clinic, scheduledStart, and status', async () => {
            const indexes = Appointment.schema.indexes();
            const hasIndex = indexes.some(idx => 
                idx[0].clinic === 1 && idx[0].scheduledStart === 1 && idx[0].status === 1
            );

            expect(hasIndex).toBe(true);
        });

        it('should have compound index on provider and scheduledStart', async () => {
            const indexes = Appointment.schema.indexes();
            const hasIndex = indexes.some(idx => 
                idx[0].provider === 1 && idx[0].scheduledStart === 1
            );

            expect(hasIndex).toBe(true);
        });
    });
});
