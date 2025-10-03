import { patientService } from '../../../src/services/patientService';
import { Patient } from '../../../src/models/Patient';
import { createTestClinic } from '../../helpers/factories';
import mongoose from 'mongoose';

describe('PatientService', () => {
  let testClinic: any;

  beforeEach(async () => {
    await Patient.deleteMany({});
    testClinic = await createTestClinic();
  });

  const validPatient = () => ({
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao@example.com',
    phone: '(11) 99999-9999',
    cpf: '111.444.777-35',
    address: {
      zipCode: '01310-100'
    },
    clinic: testClinic._id.toString()
  });

  describe('createPatient', () => {
    it('should create patient with valid data', async () => {
      const result = await patientService.createPatient(validPatient());
      expect(result.firstName).toBe('João');
      expect(result.status).toBe('active');
    });

    it('should reject duplicate phone in same clinic', async () => {
      await patientService.createPatient(validPatient());
      await expect(
        patientService.createPatient({ ...validPatient(), email: 'other@example.com' })
      ).rejects.toThrow('telefone');
    });

    it('should reject missing required fields', async () => {
      await expect(
        patientService.createPatient({ ...validPatient(), firstName: undefined as any })
      ).rejects.toThrow();
    });
  });

  describe('updatePatient', () => {
    it('should update patient data', async () => {
      const patient = await patientService.createPatient(validPatient());
      const updated = await patientService.updatePatient(
        patient._id!.toString(),
        testClinic._id.toString(),
        { firstName: 'Maria' }
      );
      expect(updated?.firstName).toBe('Maria');
    });
  });

  describe('searchPatients', () => {
    it('should find patients by name', async () => {
      await patientService.createPatient(validPatient());
      const result = await patientService.searchPatients({
        clinicId: testClinic._id.toString(),
        search: 'João'
      });
      expect(result.patients).toHaveLength(1);
    });
  });
});
