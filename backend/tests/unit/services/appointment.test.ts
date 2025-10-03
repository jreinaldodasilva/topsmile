import { Appointment } from '../../../src/models/Appointment';
import { createTestClinic, createTestUser, createTestPatient, createTestProvider, createTestAppointmentType } from '../../helpers/factories';

describe('AppointmentService', () => {
  let testClinic: any;
  let testUser: any;
  let testPatient: any;
  let testProvider: any;
  let testAppointmentType: any;

  beforeEach(async () => {
    testClinic = await createTestClinic();
    testUser = await createTestUser(testClinic);
    testPatient = await createTestPatient(testClinic);
    testProvider = await createTestProvider(testClinic);
    testAppointmentType = await createTestAppointmentType(testClinic);
  });

  describe('createAppointment', () => {
    it('should create appointment with valid data', async () => {
      const appointment = await Appointment.create({
        patient: testPatient._id,
        provider: testProvider._id,
        clinic: testClinic._id,
        appointmentType: testAppointmentType._id,
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 25 * 60 * 60 * 1000),
        status: 'scheduled',
        createdBy: testUser._id
      });

      expect(appointment).toBeDefined();
      expect(appointment.status).toBe('scheduled');
    });

    it('should reject overlapping appointments', async () => {
      const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const end = new Date(Date.now() + 25 * 60 * 60 * 1000);

      await Appointment.create({
        patient: testPatient._id,
        provider: testProvider._id,
        clinic: testClinic._id,
        appointmentType: testAppointmentType._id,
        scheduledStart: start,
        scheduledEnd: end,
        status: 'scheduled',
        createdBy: testUser._id
      });

      await expect(
        Appointment.create({
          patient: testPatient._id,
          provider: testProvider._id,
          clinic: testClinic._id,
          appointmentType: testAppointmentType._id,
          scheduledStart: start,
          scheduledEnd: end,
          status: 'scheduled',
          createdBy: testUser._id
        })
      ).rejects.toThrow();
    });
  });
});
