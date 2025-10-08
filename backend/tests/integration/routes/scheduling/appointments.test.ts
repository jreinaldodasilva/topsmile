// backend/tests/integration/routes/appointments.test.ts
import request from 'supertest';
import app from '../../../../src/app';
import { setupTestDB, teardownTestDB, clearTestDB } from '../../../helpers/testSetup';
import { createTestAppointment, createTestPatient, createTestProvider, createTestUser, createTestAppointmentType } from '../../../helpers/factories';
import jwt from 'jsonwebtoken';

describe('Appointment Routes', () => {
    let authToken: string;
    let clinicId: string;
    let userId: string;

    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    beforeEach(async () => {
        await clearTestDB();
        
        const user = await createTestUser({ role: 'admin' });
        userId = user._id.toString();
        clinicId = user.clinic?.toString() || '';
        
        authToken = jwt.sign(
            { id: userId, email: user.email, role: user.role, clinicId },
            process.env.JWT_SECRET || 'test-secret',
            { expiresIn: '1h' }
        );
    });

    describe('POST /api/appointments', () => {
        it('should create appointment with valid data', async () => {
            const patient = await createTestPatient({ clinic: clinicId });
            const provider = await createTestProvider({ clinic: clinicId });
            const appointmentType = await createTestAppointmentType({ clinic: clinicId });

            const response = await request(app)
                .post('/api/appointments')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    patient: patient._id,
                    provider: provider._id,
                    appointmentType: appointmentType._id,
                    scheduledStart: new Date(Date.now() + 86400000).toISOString(),
                    notes: 'Test appointment'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('_id');
        });

        it('should return 400 with invalid data', async () => {
            const response = await request(app)
                .post('/api/appointments')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    patient: 'invalid-id'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it('should return 401 without auth token', async () => {
            const response = await request(app)
                .post('/api/appointments')
                .send({});

            expect(response.status).toBe(401);
        });
    });

    describe('GET /api/appointments', () => {
        it('should return appointments for date range', async () => {
            const patient = await createTestPatient({ clinic: clinicId });
            const provider = await createTestProvider({ clinic: clinicId });
            const appointmentType = await createTestAppointmentType({ clinic: clinicId });
            
            await createTestAppointment({
                clinic: clinicId,
                patient: patient._id,
                provider: provider._id,
                appointmentType: appointmentType._id,
                createdBy: userId
            });

            const startDate = new Date();
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date();
            endDate.setHours(23, 59, 59, 999);

            const response = await request(app)
                .get('/api/appointments')
                .set('Authorization', `Bearer ${authToken}`)
                .query({
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should return 400 without required dates', async () => {
            const response = await request(app)
                .get('/api/appointments')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/appointments/:id', () => {
        it('should return appointment by id', async () => {
            const patient = await createTestPatient({ clinic: clinicId });
            const provider = await createTestProvider({ clinic: clinicId });
            const appointmentType = await createTestAppointmentType({ clinic: clinicId });
            
            const appointment = await createTestAppointment({
                clinic: clinicId,
                patient: patient._id,
                provider: provider._id,
                appointmentType: appointmentType._id,
                createdBy: userId
            });

            const response = await request(app)
                .get(`/api/appointments/${appointment._id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data._id).toBe(appointment._id.toString());
        });

        it('should return 404 for non-existent appointment', async () => {
            const response = await request(app)
                .get('/api/appointments/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${authToken}`);

            expect(response.status).toBe(404);
        });
    });

    describe('PATCH /api/appointments/:id/status', () => {
        it('should update appointment status', async () => {
            const patient = await createTestPatient({ clinic: clinicId });
            const provider = await createTestProvider({ clinic: clinicId });
            const appointmentType = await createTestAppointmentType({ clinic: clinicId });
            
            const appointment = await createTestAppointment({
                clinic: clinicId,
                patient: patient._id,
                provider: provider._id,
                appointmentType: appointmentType._id,
                createdBy: userId
            });

            const response = await request(app)
                .patch(`/api/appointments/${appointment._id}/status`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ status: 'confirmed' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe('confirmed');
        });

        it('should return 400 with invalid status', async () => {
            const patient = await createTestPatient({ clinic: clinicId });
            const provider = await createTestProvider({ clinic: clinicId });
            const appointmentType = await createTestAppointmentType({ clinic: clinicId });
            
            const appointment = await createTestAppointment({
                clinic: clinicId,
                patient: patient._id,
                provider: provider._id,
                appointmentType: appointmentType._id,
                createdBy: userId
            });

            const response = await request(app)
                .patch(`/api/appointments/${appointment._id}/status`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ status: 'invalid-status' });

            expect(response.status).toBe(400);
        });
    });
});
