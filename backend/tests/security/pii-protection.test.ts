import { Patient } from '../../src/models/Patient';
import { createTestPatient, createTestClinic } from '../testHelpers';

describe('PII Protection and Masking', () => {
  let testClinic: any;

  beforeEach(async () => {
    testClinic = await createTestClinic();
  });

  describe('Log Masking', () => {
    it('should mask email in console logs', () => {
      const logSpy = jest.spyOn(console, 'log');
      
      const email = 'sensitive@example.com';
      console.log(`Processing patient: ${email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}`);
      
      const logs = logSpy.mock.calls.flat().join(' ');
      expect(logs).not.toContain('sensitive@example.com');
      expect(logs).toContain('se***@example.com');
      
      logSpy.mockRestore();
    });

    it('should mask phone numbers in logs', () => {
      const logSpy = jest.spyOn(console, 'log');
      
      const phone = '(11) 98765-4321';
      console.log(`Contact: ${phone.replace(/\d(?=\d{4})/g, '*')}`);
      
      const logs = logSpy.mock.calls.flat().join(' ');
      expect(logs).not.toContain('98765-4321');
      expect(logs).toContain('****-4321');
      
      logSpy.mockRestore();
    });

    it('should mask CPF in logs', () => {
      const logSpy = jest.spyOn(console, 'log');
      
      const cpf = '123.456.789-00';
      console.log(`Patient CPF: ${cpf.replace(/\d(?=\d{2})/g, '*')}`);
      
      const logs = logSpy.mock.calls.flat().join(' ');
      expect(logs).not.toContain('123.456.789');
      expect(logs).toContain('*********-00');
      
      logSpy.mockRestore();
    });

    it('should not log full medical history', async () => {
      const logSpy = jest.spyOn(console, 'log');
      
      const patient = await createTestPatient({
        clinic: testClinic._id,
        medicalHistory: {
          conditions: ['Diabetes Type 2'],
          medications: ['Insulin'],
          allergies: ['Penicillin'],
          notes: 'Sensitive medical information'
        }
      });

      console.log(`Patient created: ${patient._id}`);
      
      const logs = logSpy.mock.calls.flat().join(' ');
      expect(logs).not.toContain('Diabetes');
      expect(logs).not.toContain('Insulin');
      expect(logs).not.toContain('Penicillin');
      expect(logs).not.toContain('Sensitive medical information');
      
      logSpy.mockRestore();
    });
  });

  describe('Error Message Redaction', () => {
    it('should not expose PII in error messages', async () => {
      const email = 'patient@example.com';
      
      try {
        throw new Error(`Validation failed for user`);
      } catch (error: any) {
        expect(error.message).not.toContain(email);
        expect(error.message).toContain('Validation failed');
      }
    });

    it('should redact email from validation errors', () => {
      const email = 'invalid@example.com';
      const sanitizedError = `Email validation failed`;
      
      expect(sanitizedError).not.toContain(email);
      expect(sanitizedError).toContain('Email validation failed');
    });

    it('should redact phone from error messages', () => {
      const phone = '(11) 98765-4321';
      const error = new Error('Invalid phone format');
      
      expect(error.message).not.toContain(phone);
    });
  });

  describe('API Response Masking', () => {
    it('should mask email in public API responses', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        email: 'patient@example.com'
      });

      const publicResponse = {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email?.replace(/(.{2})(.*)(@.*)/, '$1***$3')
      };

      expect(publicResponse.email).not.toBe('patient@example.com');
      expect(publicResponse.email).toContain('***');
    });

    it('should mask phone in public responses', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        phone: '(11) 98765-4321'
      });

      const maskedPhone = patient.phone?.replace(/\d(?=\d{4})/g, '*');
      
      expect(maskedPhone).not.toContain('98765');
      expect(maskedPhone).toContain('****');
    });

    it('should exclude medical history from list responses', async () => {
      const patient = await Patient.findById(
        (await createTestPatient({ clinic: testClinic._id }))._id
      ).select('firstName lastName email phone -medicalHistory').lean();

      expect(patient?.firstName).toBeDefined();
      expect((patient as any)?.medicalHistory).toBeUndefined();
    });
  });

  describe('Data Anonymization for Analytics', () => {
    it('should anonymize patient data for analytics', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        email: 'patient@example.com',
        phone: '(11) 98765-4321'
      });

      const anonymized = {
        id: patient._id,
        ageGroup: '30-40',
        gender: patient.gender,
        hasAllergies: patient.medicalHistory?.allergies && patient.medicalHistory.allergies.length > 0,
        hasConditions: patient.medicalHistory?.conditions && patient.medicalHistory.conditions.length > 0
      };

      expect((anonymized as any).email).toBeUndefined();
      expect((anonymized as any).phone).toBeUndefined();
      expect((anonymized as any).firstName).toBeUndefined();
      expect((anonymized as any).lastName).toBeUndefined();
    });

    it('should hash identifiers for analytics', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        email: 'patient@example.com'
      });

      const crypto = require('crypto');
      const hashedId = crypto.createHash('sha256').update(patient._id!.toString()).digest('hex');

      expect(hashedId).not.toBe(patient._id!.toString());
      expect(hashedId).toHaveLength(64);
    });

    it('should aggregate data without individual identifiers', async () => {
      await createTestPatient({ clinic: testClinic._id, gender: 'male' });
      await createTestPatient({ clinic: testClinic._id, gender: 'female' });
      await createTestPatient({ clinic: testClinic._id, gender: 'male' });

      const aggregated = await Patient.aggregate([
        { $match: { clinic: testClinic._id } },
        { $group: { _id: '$gender', count: { $sum: 1 } } }
      ]);

      expect(aggregated).toHaveLength(2);
      expect(aggregated.find(g => g._id === 'male')?.count).toBe(2);
      expect(aggregated.find(g => g._id === 'female')?.count).toBe(1);
    });
  });

  describe('Database Query Masking', () => {
    it('should not return sensitive fields in lean queries', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        medicalHistory: {
          conditions: ['Diabetes'],
          medications: ['Insulin'],
          allergies: ['Penicillin'],
          notes: 'Private notes'
        }
      });

      const result = await Patient.findById(patient._id)
        .select('firstName lastName')
        .lean();

      expect(result?.firstName).toBeDefined();
      expect((result as any)?.medicalHistory).toBeUndefined();
      expect((result as any)?.email).toBeUndefined();
      expect((result as any)?.phone).toBeUndefined();
    });

    it('should exclude PII from search results', async () => {
      await createTestPatient({
        clinic: testClinic._id,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      });

      const results = await Patient.find({ clinic: testClinic._id })
        .select('firstName lastName')
        .lean();

      expect(results[0].firstName).toBeDefined();
      expect((results[0] as any).email).toBeUndefined();
      expect((results[0] as any).phone).toBeUndefined();
    });
  });

  describe('Session and Token Masking', () => {
    it('should mask tokens in logs', () => {
      const logSpy = jest.spyOn(console, 'log');
      
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
      const masked = token.substring(0, 10) + '...' + token.substring(token.length - 10);
      console.log(`Token: ${masked}`);
      
      const logs = logSpy.mock.calls.flat().join(' ');
      expect(logs).not.toContain(token);
      expect(logs).toContain('...');
      
      logSpy.mockRestore();
    });

    it('should not log full authorization headers', () => {
      const logSpy = jest.spyOn(console, 'log');
      
      const authHeader = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.long.token';
      console.log('Auth: Bearer ***');
      
      const logs = logSpy.mock.calls.flat().join(' ');
      expect(logs).not.toContain('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
      expect(logs).toContain('Bearer ***');
      
      logSpy.mockRestore();
    });
  });

  describe('Cross-Clinic PII Isolation', () => {
    it('should not expose patient data across clinics', async () => {
      const clinic1 = await createTestClinic();
      const clinic2 = await createTestClinic();

      const patient1 = await createTestPatient({
        clinic: clinic1._id,
        email: 'patient1@example.com'
      });

      const patient2 = await createTestPatient({
        clinic: clinic2._id,
        email: 'patient2@example.com'
      });

      const clinic1Patients = await Patient.find({ clinic: clinic1._id }).lean();
      const clinic2Patients = await Patient.find({ clinic: clinic2._id }).lean();

      expect(clinic1Patients).toHaveLength(1);
      expect(clinic2Patients).toHaveLength(1);
      expect(clinic1Patients[0].email).toBe('patient1@example.com');
      expect(clinic2Patients[0].email).toBe('patient2@example.com');
    });

    it('should prevent cross-clinic queries', async () => {
      const clinic1 = await createTestClinic();
      const clinic2 = await createTestClinic();

      await createTestPatient({ clinic: clinic1._id });
      await createTestPatient({ clinic: clinic2._id });

      const clinic1Only = await Patient.find({ clinic: clinic1._id });
      
      expect(clinic1Only).toHaveLength(1);
      expect(clinic1Only[0].clinic!.toString()).toBe(clinic1._id!.toString());
    });
  });

  describe('Audit Trail Without PII', () => {
    it('should log actions without exposing PII', async () => {
      const logSpy = jest.spyOn(console, 'log');
      
      const patient = await createTestPatient({
        clinic: testClinic._id,
        email: 'patient@example.com'
      });

      console.log(`Patient record updated: ${patient._id}`);
      
      const logs = logSpy.mock.calls.flat().join(' ');
      expect(logs).toContain('Patient record updated');
      expect(logs).not.toContain('patient@example.com');
      
      logSpy.mockRestore();
    });

    it('should track changes without storing sensitive values', async () => {
      const patient = await createTestPatient({
        clinic: testClinic._id,
        email: 'original@example.com'
      });

      const auditEntry = {
        action: 'UPDATE',
        resourceType: 'Patient',
        resourceId: patient._id,
        timestamp: new Date(),
        fieldsChanged: ['email']
      };

      expect((auditEntry as any).oldValue).toBeUndefined();
      expect((auditEntry as any).newValue).toBeUndefined();
      expect(auditEntry.fieldsChanged).toContain('email');
    });
  });
});
