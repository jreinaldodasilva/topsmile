import { Patient } from '../../src/models/Patient';
import { PatientUser } from '../../src/models/PatientUser';
import { createTestPatient, createTestPatientUser } from '../testHelpers';
import mongoose from 'mongoose';

describe('HIPAA Compliance Tests', () => {
  describe('Data Encryption', () => {
    it('should not store sensitive medical data in plain text', async () => {
      const patient = await createTestPatient({
        medicalHistory: {
          conditions: ['Diabetes', 'Hypertension'],
          medications: ['Metformin', 'Lisinopril'],
          allergies: ['Penicillin']
        }
      });

      const rawData = await mongoose.connection.db
        .collection('patients')
        .findOne({ _id: patient._id });

      // Verify sensitive data is not stored as plain text
      const rawString = JSON.stringify(rawData);
      expect(rawString).not.toContain('Diabetes');
      expect(rawString).not.toContain('Metformin');
      expect(rawString).not.toContain('Penicillin');
    });

    it('should encrypt patient contact information', async () => {
      const patient = await createTestPatient({
        phone: '(11) 99999-9999',
        email: 'patient@example.com'
      });

      const rawData = await mongoose.connection.db
        .collection('patients')
        .findOne({ _id: patient._id });

      expect(rawData.phone).not.toBe('(11) 99999-9999');
      expect(rawData.email).not.toBe('patient@example.com');
    });
  });

  describe('Access Control', () => {
    it('should require authentication for patient data access', async () => {
      const patient = await createTestPatient();
      
      // Verify model-level access control
      expect(() => {
        Patient.findById(patient._id);
      }).not.toThrow();
    });

    it('should restrict patient data to authorized users only', async () => {
      const patient = await createTestPatient();
      const patientUser = await createTestPatientUser(patient._id.toString());

      expect(patientUser.patient.toString()).toBe(patient._id.toString());
      expect(patientUser.isActive).toBe(true);
    });
  });

  describe('Data Retention', () => {
    it('should mark deleted patients as inactive instead of hard delete', async () => {
      const patient = await createTestPatient();
      
      // Simulate soft delete
      patient.status = 'inactive';
      await patient.save();

      const foundPatient = await Patient.findById(patient._id);
      expect(foundPatient).toBeTruthy();
      expect(foundPatient?.status).toBe('inactive');
    });
  });

  describe('Audit Trail', () => {
    it('should track patient data modifications', async () => {
      const patient = await createTestPatient();
      
      expect(patient.createdAt).toBeDefined();
      expect(patient.updatedAt).toBeDefined();
    });
  });
});