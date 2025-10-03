import mongoose from 'mongoose';
import { Patient } from '../../src/models/Patient';
import { createTestPatient, createTestClinic } from '../testHelpers';

const getRawPatientData = async (patientId: any) => {
  return await mongoose.connection.db!
    .collection('patients')
    .findOne({ _id: new mongoose.Types.ObjectId(patientId) });
};

describe('Medical Records Compliance', () => {
  let testClinic: any;

  beforeEach(async () => {
    testClinic = await createTestClinic();
  });

  describe('Data Encryption at Rest', () => {
    it('should encrypt medical history conditions', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        medicalHistory: {
          conditions: ['Diabetes Type 2', 'Hypertension'],
          medications: [],
          allergies: []
        }
      });

      const rawData = await getRawPatientData(patient._id);

      const rawString = JSON.stringify(rawData);
      expect(rawString).not.toContain('Diabetes Type 2');
      expect(rawString).not.toContain('Hypertension');
    });

    it('should encrypt medications list', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        medicalHistory: {
          conditions: [],
          medications: ['Metformin 500mg', 'Lisinopril 10mg'],
          allergies: []
        }
      });

      const rawData = await getRawPatientData(patient._id);

      const rawString = JSON.stringify(rawData);
      expect(rawString).not.toContain('Metformin');
      expect(rawString).not.toContain('Lisinopril');
    });

    it('should encrypt allergy information', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        medicalHistory: {
          conditions: [],
          medications: [],
          allergies: ['Penicillin', 'Latex']
        }
      });

      const rawData = await getRawPatientData(patient._id);

      const rawString = JSON.stringify(rawData);
      expect(rawString).not.toContain('Penicillin');
      expect(rawString).not.toContain('Latex');
    });

    it('should encrypt clinical notes', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        medicalHistory: {
          conditions: [],
          medications: [],
          allergies: [],
          notes: 'Patient has severe anxiety about dental procedures'
        }
      });

      const rawData = await getRawPatientData(patient._id);

      const rawString = JSON.stringify(rawData);
      expect(rawString).not.toContain('anxiety');
      expect(rawString).not.toContain('dental procedures');
    });
  });

  describe('Data Decryption', () => {
    it('should decrypt medical history when accessed through model', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        medicalHistory: {
          conditions: ['Asthma'],
          medications: ['Albuterol'],
          allergies: ['Ibuprofen']
        }
      });

      const retrieved = await Patient.findById(patient._id);

      expect(retrieved?.medicalHistory?.conditions).toContain('Asthma');
      expect(retrieved?.medicalHistory?.medications).toContain('Albuterol');
      expect(retrieved?.medicalHistory?.allergies).toContain('Ibuprofen');
    });
  });

  describe('Audit Trail for Medical Records', () => {
    it('should track creation timestamp', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        medicalHistory: {
          conditions: ['Test Condition'],
          medications: [],
          allergies: []
        }
      });

      expect(patient.createdAt).toBeDefined();
      expect(patient.createdAt).toBeInstanceOf(Date);
    });

    it('should track modification timestamp', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        medicalHistory: {
          conditions: ['Initial Condition'],
          medications: [],
          allergies: []
        }
      });

      const initialUpdatedAt = patient.updatedAt!;

      await new Promise(resolve => setTimeout(resolve, 10));

      patient.medicalHistory!.conditions!.push('New Condition');
      await patient.save();

      expect(patient.updatedAt).toBeDefined();
      expect(new Date(patient.updatedAt!).getTime()).toBeGreaterThan(new Date(initialUpdatedAt).getTime());
    });
  });

  describe('Treatment Plan Security', () => {
    it('should not expose treatment details in plain text', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        medicalHistory: {
          conditions: [],
          medications: [],
          allergies: [],
          notes: 'Requires root canal on tooth #14, crown placement scheduled'
        }
      });

      const rawData = await getRawPatientData(patient._id);

      const rawString = JSON.stringify(rawData);
      expect(rawString).not.toContain('root canal');
      expect(rawString).not.toContain('crown placement');
    });
  });

  describe('Cross-Clinic Data Isolation', () => {
    it('should not allow access to patients from different clinics', async () => {
      const clinic1 = await createTestClinic();
      const clinic2 = await createTestClinic();

      const patient1 = await createTestPatient({
        clinic: clinic1._id,
        firstName: 'Patient',
        lastName: 'One'
      });

      const patient2 = await createTestPatient({
        clinic: clinic2._id,
        firstName: 'Patient',
        lastName: 'Two'
      });

      const clinic1Patients = await Patient.find({ clinic: clinic1._id });
      const clinic2Patients = await Patient.find({ clinic: clinic2._id });

      expect(clinic1Patients).toHaveLength(1);
      expect(clinic2Patients).toHaveLength(1);
      expect(clinic1Patients[0]._id.toString()).toBe(patient1._id!.toString());
      expect(clinic2Patients[0]._id.toString()).toBe(patient2._id!.toString());
    });
  });

  describe('Emergency Contact Protection', () => {
    it('should encrypt emergency contact information', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        emergencyContact: {
          name: 'Maria Silva',
          phone: '(11) 98765-4321',
          relationship: 'Spouse'
        }
      });

      const rawData = await getRawPatientData(patient._id);

      const rawString = JSON.stringify(rawData);
      expect(rawString).not.toContain('Maria Silva');
      expect(rawString).not.toContain('98765-4321');
    });
  });
});
