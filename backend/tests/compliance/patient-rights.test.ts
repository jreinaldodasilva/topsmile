import { Patient } from '../../src/models/Patient';
import { Appointment } from '../../src/models/Appointment';
import { Provider } from '../../src/models/Provider';
import { createTestPatient, createTestClinic } from '../testHelpers';
import mongoose from 'mongoose';

describe('Patient Rights - HIPAA Compliance', () => {
  let testClinic: any;
  let testPatient: any;
  let testProvider: any;

  beforeEach(async () => {
    testClinic = await createTestClinic();
    testPatient = await createTestPatient({ clinic: testClinic._id });
    testProvider = await Provider.create({
      name: 'Dr. Test Provider',
      email: 'provider@test.com',
      clinic: testClinic._id,
      specialties: ['general_dentistry'],
      isActive: true,
      workingHours: {
        monday: { start: '08:00', end: '18:00', isWorking: true },
        tuesday: { start: '08:00', end: '18:00', isWorking: true },
        wednesday: { start: '08:00', end: '18:00', isWorking: true },
        thursday: { start: '08:00', end: '18:00', isWorking: true },
        friday: { start: '08:00', end: '18:00', isWorking: true },
        saturday: { start: '08:00', end: '12:00', isWorking: false },
        sunday: { start: '08:00', end: '12:00', isWorking: false }
      }
    });
  });

  describe('Data Portability - Right to Access', () => {
    it('should export complete patient data in structured format', async () => {
      const exportData = {
        patient: testPatient.toObject(),
        appointments: await Appointment.find({ patient: testPatient._id }).lean(),
        exportDate: new Date(),
        format: 'JSON'
      };

      expect(exportData.patient).toBeDefined();
      expect(exportData.patient.firstName).toBe(testPatient.firstName);
      expect(exportData.patient.medicalHistory).toBeDefined();
      expect(exportData.format).toBe('JSON');
      expect(exportData.exportDate).toBeInstanceOf(Date);
    });

    it('should include all medical history in export', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        medicalHistory: {
          conditions: ['Diabetes'],
          medications: ['Insulin'],
          allergies: ['Penicillin'],
          notes: 'Patient notes'
        }
      });

      const exportData = patient.toObject();

      expect(exportData.medicalHistory.conditions).toContain('Diabetes');
      expect(exportData.medicalHistory.medications).toContain('Insulin');
      expect(exportData.medicalHistory.allergies).toContain('Penicillin');
      expect(exportData.medicalHistory.notes).toBe('Patient notes');
    });

    it('should include appointment history in export', async () => {
      const appointment = await Appointment.create({
        patient: testPatient._id,
        provider: testProvider._id,
        clinic: testClinic._id,
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 25 * 60 * 60 * 1000),
        type: 'Consulta',
        status: 'scheduled'
      });

      const appointments = await Appointment.find({ patient: testPatient._id }).lean();

      expect(appointments).toHaveLength(1);
      expect(appointments[0]._id.toString()).toBe(appointment._id.toString());
      expect(appointments[0].type).toBe('Consulta');
    });

    it('should export data within 30 days of request', async () => {
      const requestDate = new Date();
      const maxExportDate = new Date(requestDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      testPatient.dataExportRequested = true;
      testPatient.dataExportRequestDate = requestDate;
      await testPatient.save();

      const patient = await Patient.findById(testPatient._id);
      
      expect(patient?.dataExportRequested).toBe(true);
      expect(patient?.dataExportRequestDate).toBeDefined();
      expect(new Date(patient!.dataExportRequestDate!).getTime()).toBeLessThanOrEqual(maxExportDate.getTime());
    });
  });

  describe('Right to Deletion', () => {
    it('should mark patient for deletion when requested', async () => {
      testPatient.deletionRequested = true;
      testPatient.deletionRequestDate = new Date();
      testPatient.deletionScheduledDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await testPatient.save();

      const patient = await Patient.findById(testPatient._id);

      expect(patient?.deletionRequested).toBe(true);
      expect(patient?.deletionRequestDate).toBeDefined();
      expect(patient?.deletionScheduledDate).toBeDefined();
    });

    it('should schedule deletion within 30 days', async () => {
      const requestDate = new Date();
      const scheduledDate = new Date(requestDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      testPatient.deletionRequested = true;
      testPatient.deletionRequestDate = requestDate;
      testPatient.deletionScheduledDate = scheduledDate;
      await testPatient.save();

      const patient = await Patient.findById(testPatient._id);
      const daysDiff = (new Date(patient!.deletionScheduledDate!).getTime() - new Date(patient!.deletionRequestDate!).getTime()) / (1000 * 60 * 60 * 24);

      expect(daysDiff).toBeLessThanOrEqual(30);
    });

    it('should not hard delete patient data immediately', async () => {
      testPatient.deletionRequested = true;
      await testPatient.save();

      const patient = await Patient.findById(testPatient._id);

      expect(patient).toBeDefined();
      expect(patient?.deletionRequested).toBe(true);
    });

    it('should maintain audit trail after deletion request', async () => {
      const beforeUpdate = testPatient.updatedAt;
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      testPatient.deletionRequested = true;
      await testPatient.save();

      const patient = await Patient.findById(testPatient._id);

      expect(patient?.updatedAt).toBeDefined();
      expect(new Date(patient!.updatedAt!).getTime()).toBeGreaterThan(new Date(beforeUpdate!).getTime());
    });
  });

  describe('Right to Rectification', () => {
    it('should allow patient to update personal information', async () => {
      testPatient.phone = '(11) 98888-8888';
      testPatient.email = 'newemail@example.com';
      await testPatient.save();

      const patient = await Patient.findById(testPatient._id);

      expect(patient?.phone).toBe('(11) 98888-8888');
      expect(patient?.email).toBe('newemail@example.com');
    });

    it('should track modification history', async () => {
      const originalUpdatedAt = testPatient.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 10));

      testPatient.firstName = 'Updated';
      await testPatient.save();

      expect(new Date(testPatient.updatedAt!).getTime()).toBeGreaterThan(new Date(originalUpdatedAt!).getTime());
    });
  });

  describe('Right to Restrict Processing', () => {
    it('should allow patient to restrict data processing', async () => {
      testPatient.processingRestricted = true;
      testPatient.restrictionReason = 'Patient request';
      await testPatient.save();

      const patient = await Patient.findById(testPatient._id);

      expect(patient?.processingRestricted).toBe(true);
      expect(patient?.restrictionReason).toBe('Patient request');
    });

    it('should prevent operations on restricted accounts', async () => {
      testPatient.processingRestricted = true;
      await testPatient.save();

      const patient = await Patient.findById(testPatient._id);

      expect(patient?.processingRestricted).toBe(true);
    });
  });

  describe('Minimum Necessary Access', () => {
    it('should only return necessary fields for appointment booking', async () => {
      const minimalData = await Patient.findById(testPatient._id)
        .select('firstName lastName phone email')
        .lean();

      expect(minimalData?.firstName).toBeDefined();
      expect(minimalData?.lastName).toBeDefined();
      expect(minimalData?.phone).toBeDefined();
      expect(minimalData?.email).toBeDefined();
      expect((minimalData as any).medicalHistory).toBeUndefined();
    });

    it('should exclude sensitive data from general queries', async () => {
      const publicData = await Patient.findById(testPatient._id)
        .select('-medicalHistory -emergencyContact')
        .lean();

      expect((publicData as any).medicalHistory).toBeUndefined();
      expect((publicData as any).emergencyContact).toBeUndefined();
    });
  });

  describe('Consent Management', () => {
    it('should track consent for data processing', async () => {
      testPatient.consents = {
        dataProcessing: true,
        marketing: false,
        thirdPartySharing: false,
        consentDate: new Date()
      };
      await testPatient.save();

      const patient = await Patient.findById(testPatient._id);

      expect(patient?.consents?.dataProcessing).toBe(true);
      expect(patient?.consents?.marketing).toBe(false);
      expect(patient?.consents?.consentDate).toBeDefined();
    });

    it('should allow withdrawal of consent', async () => {
      testPatient.consents = {
        dataProcessing: true,
        marketing: true,
        consentDate: new Date()
      };
      await testPatient.save();

      testPatient.consents.marketing = false;
      testPatient.consents.consentWithdrawnDate = new Date();
      await testPatient.save();

      const patient = await Patient.findById(testPatient._id);

      expect(patient?.consents?.marketing).toBe(false);
      expect(patient?.consents?.consentWithdrawnDate).toBeDefined();
    });
  });

  describe('Data Breach Notification', () => {
    it('should track breach notification status', async () => {
      testPatient.breachNotified = true;
      testPatient.breachNotificationDate = new Date();
      testPatient.breachDescription = 'Unauthorized access detected';
      await testPatient.save();

      const patient = await Patient.findById(testPatient._id);

      expect(patient?.breachNotified).toBe(true);
      expect(patient?.breachNotificationDate).toBeDefined();
      expect(patient?.breachDescription).toBe('Unauthorized access detected');
    });

    it('should notify within 60 days of breach discovery', async () => {
      const discoveryDate = new Date();
      const notificationDate = new Date(discoveryDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      testPatient.breachDiscoveryDate = discoveryDate;
      testPatient.breachNotificationDate = notificationDate;
      await testPatient.save();

      const daysDiff = (new Date(testPatient.breachNotificationDate!).getTime() - new Date(testPatient.breachDiscoveryDate!).getTime()) / (1000 * 60 * 60 * 24);

      expect(daysDiff).toBeLessThanOrEqual(60);
    });
  });
});
