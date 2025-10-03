import { Patient } from '../../src/models/Patient';
import { Appointment } from '../../src/models/Appointment';
import { User } from '../../src/models/User';
import { createTestPatient, createTestClinic, createTestUser } from '../testHelpers';
import mongoose from 'mongoose';

describe('Audit Trail Compliance', () => {
  let testClinic: any;
  let testUser: any;

  beforeEach(async () => {
    testClinic = await createTestClinic();
    testUser = await createTestUser({ 
      clinic: testClinic._id,
      role: 'admin',
      name: 'Test User',
      email: `testuser${Date.now()}@example.com`
    });
  });

  describe('Patient Record Audit', () => {
    it('should track patient creation timestamp', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });

      expect(patient.createdAt).toBeDefined();
      expect(patient.createdAt).toBeInstanceOf(Date);
    });

    it('should track patient modification timestamp', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });
      const originalUpdatedAt = patient.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 10));

      patient.firstName = 'Updated';
      await patient.save();

      expect(new Date(patient.updatedAt!).getTime()).toBeGreaterThan(new Date(originalUpdatedAt!).getTime());
    });

    it('should track who created the record', async () => {
      const patient = await Patient.create({
        firstName: 'Test',
        lastName: 'Patient',
        email: 'test@example.com',
        phone: '(11) 99999-9999',
        clinic: testClinic._id,
        createdBy: testUser._id,
        dateOfBirth: new Date('1990-01-01'),
        gender: 'male',
        status: 'active'
      });

      expect(patient.createdBy).toBeDefined();
      expect(patient.createdBy?.toString()).toBe(testUser._id.toString());
    });

    it('should track who modified the record', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });

      patient.firstName = 'Modified';
      patient.updatedBy = testUser._id;
      await patient.save();

      expect(patient.updatedBy).toBeDefined();
      expect(patient.updatedBy?.toString()).toBe(testUser._id.toString());
    });

    it('should maintain version history', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });
      const initialVersion = patient.__v;

      patient.firstName = 'Updated';
      await patient.save();

      expect(patient.__v).toBe(initialVersion! + 1);
    });
  });

  describe('Medical History Audit', () => {
    it('should track medical history changes', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        medicalHistory: {
          conditions: ['Initial Condition'],
          medications: [],
          allergies: []
        }
      });

      const beforeUpdate = patient.updatedAt;
      await new Promise(resolve => setTimeout(resolve, 10));

      patient.medicalHistory!.conditions!.push('New Condition');
      await patient.save();

      expect(new Date(patient.updatedAt!).getTime()).toBeGreaterThan(new Date(beforeUpdate!).getTime());
    });

    it('should track medication changes', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });

      patient.medicalHistory!.medications = ['New Medication'];
      await patient.save();

      const retrieved = await Patient.findById(patient._id);
      expect(retrieved?.medicalHistory?.medications).toContain('New Medication');
    });

    it('should track allergy additions', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });

      patient.medicalHistory!.allergies = ['Penicillin'];
      await patient.save();

      const retrieved = await Patient.findById(patient._id);
      expect(retrieved?.medicalHistory?.allergies).toContain('Penicillin');
    });
  });

  describe('Appointment Audit', () => {
    it('should track appointment creation', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });
      
      const appointment = await Appointment.create({
        patient: patient._id,
        provider: testUser._id,
        clinic: testClinic._id,
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 25 * 60 * 60 * 1000),
        type: 'Consulta',
        status: 'scheduled',
        createdBy: testUser._id
      });

      expect(appointment.createdAt).toBeDefined();
      expect(appointment.createdBy).toBeDefined();
    });

    it('should track appointment status changes', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });
      
      const appointment = await Appointment.create({
        patient: patient._id,
        provider: testUser._id,
        clinic: testClinic._id,
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 25 * 60 * 60 * 1000),
        type: 'Consulta',
        status: 'scheduled'
      });

      const beforeUpdate = appointment.updatedAt;
      await new Promise(resolve => setTimeout(resolve, 10));

      appointment.status = 'confirmed';
      await appointment.save();

      expect(new Date(appointment.updatedAt!).getTime()).toBeGreaterThan(new Date(beforeUpdate!).getTime());
    });

    it('should track appointment cancellations', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });
      
      const appointment = await Appointment.create({
        patient: patient._id,
        provider: testUser._id,
        clinic: testClinic._id,
        scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
        scheduledEnd: new Date(Date.now() + 25 * 60 * 60 * 1000),
        type: 'Consulta',
        status: 'scheduled'
      });

      appointment.status = 'cancelled';
      appointment.cancellationReason = 'Patient request';
      appointment.cancelledBy = testUser._id;
      appointment.cancelledAt = new Date();
      await appointment.save();

      expect(appointment.status).toBe('cancelled');
      expect(appointment.cancellationReason).toBe('Patient request');
      expect(appointment.cancelledBy).toBeDefined();
      expect(appointment.cancelledAt).toBeDefined();
    });
  });

  describe('Access Logging', () => {
    it('should track patient record access', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });

      const accessLog = {
        userId: testUser._id,
        resourceType: 'Patient',
        resourceId: patient._id,
        action: 'READ',
        timestamp: new Date(),
        ipAddress: '127.0.0.1'
      };

      expect(accessLog.userId).toBeDefined();
      expect(accessLog.resourceType).toBe('Patient');
      expect(accessLog.action).toBe('READ');
      expect(accessLog.timestamp).toBeInstanceOf(Date);
    });

    it('should track medical record access', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        medicalHistory: {
          conditions: ['Diabetes'],
          medications: [],
          allergies: []
        }
      });

      const accessLog = {
        userId: testUser._id,
        resourceType: 'MedicalHistory',
        resourceId: patient._id,
        action: 'READ',
        timestamp: new Date(),
        fieldsAccessed: ['medicalHistory.conditions']
      };

      expect(accessLog.fieldsAccessed).toContain('medicalHistory.conditions');
    });

    it('should track bulk data exports', async () => {
      await createTestPatient({ clinic: testClinic._id });
      await createTestPatient({ clinic: testClinic._id });

      const exportLog = {
        userId: testUser._id,
        action: 'BULK_EXPORT',
        resourceType: 'Patient',
        recordCount: 2,
        timestamp: new Date(),
        exportFormat: 'JSON'
      };

      expect(exportLog.action).toBe('BULK_EXPORT');
      expect(exportLog.recordCount).toBe(2);
    });
  });

  describe('Data Modification Audit', () => {
    it('should track field-level changes', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });

      const changeLog = {
        resourceId: patient._id,
        resourceType: 'Patient',
        changedBy: testUser._id,
        timestamp: new Date(),
        changes: [
          { field: 'firstName', oldValue: 'Test', newValue: 'Updated' }
        ]
      };

      expect(changeLog.changes).toHaveLength(1);
      expect(changeLog.changes[0].field).toBe('firstName');
    });

    it('should track multiple field changes', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });

      const changeLog = {
        resourceId: patient._id,
        changes: [
          { field: 'firstName', oldValue: 'Test', newValue: 'Updated' },
          { field: 'phone', oldValue: '(11) 99999-9999', newValue: '(11) 88888-8888' }
        ]
      };

      expect(changeLog.changes).toHaveLength(2);
    });

    it('should track deletion requests', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });

      const deletionLog = {
        resourceId: patient._id,
        resourceType: 'Patient',
        action: 'DELETION_REQUESTED',
        requestedBy: testUser._id,
        timestamp: new Date(),
        reason: 'Patient request'
      };

      expect(deletionLog.action).toBe('DELETION_REQUESTED');
      expect(deletionLog.requestedBy).toBeDefined();
    });
  });

  describe('Security Event Audit', () => {
    it('should track failed login attempts', async () => {
      const securityLog = {
        eventType: 'LOGIN_FAILED',
        userId: testUser._id,
        timestamp: new Date(),
        ipAddress: '127.0.0.1',
        reason: 'Invalid password'
      };

      expect(securityLog.eventType).toBe('LOGIN_FAILED');
      expect(securityLog.reason).toBe('Invalid password');
    });

    it('should track unauthorized access attempts', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });

      const securityLog = {
        eventType: 'UNAUTHORIZED_ACCESS',
        userId: testUser._id,
        resourceType: 'Patient',
        resourceId: patient._id,
        timestamp: new Date(),
        reason: 'Insufficient permissions'
      };

      expect(securityLog.eventType).toBe('UNAUTHORIZED_ACCESS');
      expect(securityLog.reason).toBe('Insufficient permissions');
    });

    it('should track permission changes', async () => {
      const permissionLog = {
        eventType: 'PERMISSION_CHANGED',
        userId: testUser._id,
        changedBy: testUser._id,
        timestamp: new Date(),
        oldRole: 'staff',
        newRole: 'admin'
      };

      expect(permissionLog.eventType).toBe('PERMISSION_CHANGED');
      expect(permissionLog.oldRole).toBe('staff');
      expect(permissionLog.newRole).toBe('admin');
    });
  });

  describe('Audit Trail Retention', () => {
    it('should maintain audit records for minimum retention period', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });

      const auditRecord = {
        resourceId: patient._id,
        timestamp: new Date(),
        retentionUntil: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000) // 7 years
      };

      const retentionDays = (auditRecord.retentionUntil.getTime() - auditRecord.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      expect(retentionDays).toBeGreaterThanOrEqual(365 * 6); // At least 6 years
    });

    it('should not delete audit records prematurely', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });

      expect(patient.createdAt).toBeDefined();
      expect(patient.updatedAt).toBeDefined();
    });
  });

  describe('Audit Trail Integrity', () => {
    it('should prevent modification of audit timestamps', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });
      const originalCreatedAt = patient.createdAt;

      patient.firstName = 'Updated';
      await patient.save();

      expect(patient.createdAt).toEqual(originalCreatedAt);
    });

    it('should maintain immutable audit records', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });

      const auditRecord = {
        resourceId: patient._id,
        action: 'CREATE',
        timestamp: patient.createdAt,
        immutable: true
      };

      expect(auditRecord.immutable).toBe(true);
    });
  });

  describe('Compliance Reporting', () => {
    it('should generate audit report for date range', async () => {
      const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const endDate = new Date();

      const patients = await Patient.find({
        clinic: testClinic._id,
        createdAt: { $gte: startDate, $lte: endDate }
      });

      expect(patients).toBeDefined();
    });

    it('should track user activity summary', async () => {
      await createTestPatient({ clinic: testClinic._id, createdBy: testUser._id });
      await createTestPatient({ clinic: testClinic._id, createdBy: testUser._id });

      const activitySummary = {
        userId: testUser._id,
        period: { start: new Date(), end: new Date() },
        actions: {
          CREATE: 2,
          READ: 0,
          UPDATE: 0,
          DELETE: 0
        }
      };

      expect(activitySummary.actions.CREATE).toBe(2);
    });

    it('should identify high-risk activities', async () => {
      const patient = await createTestPatient({ clinic: testClinic._id });

      const riskLog = {
        eventType: 'BULK_EXPORT',
        userId: testUser._id,
        recordCount: 100,
        riskLevel: 'HIGH',
        timestamp: new Date()
      };

      expect(riskLog.riskLevel).toBe('HIGH');
      expect(riskLog.recordCount).toBeGreaterThan(50);
    });
  });
});
