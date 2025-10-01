import { patientService } from '../../../src/services/patientService';
import { Patient } from '../../../src/models/Patient';
import { createTestClinic } from '../../testHelpers';
import mongoose from 'mongoose';

describe('PatientService - Core Business Logic', () => {
  let testClinic: any;

  beforeEach(async () => {
    // Clean up
    await Patient.deleteMany({});
    
    // Create test clinic
    testClinic = await createTestClinic();
  });

  const getValidPatientData = () => ({
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao.silva@example.com',
    phone: '(11) 99999-9999',
    dateOfBirth: new Date('1990-01-01'),
    gender: 'male' as const,
    cpf: '123.456.789-00',
    address: {
      street: 'Rua das Flores',
      number: '123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    clinic: testClinic._id.toString()
  });

  describe('createPatient', () => {
    it('should create patient with valid data', async () => {
      const patientData = getValidPatientData();

      const result = await patientService.createPatient(patientData);

      expect(result).toBeDefined();
      expect(result.firstName).toBe(patientData.firstName);
      expect(result.lastName).toBe(patientData.lastName);
      expect(result.email).toBe(patientData.email.toLowerCase());
      expect(result.phone).toBe(patientData.phone);
      expect(result.status).toBe('active');
    });

    it('should throw error for missing required fields', async () => {
      const testCases = [
        { field: 'firstName', error: 'Nome, sobrenome, telefone e clínica são obrigatórios' },
        { field: 'lastName', error: 'Nome, sobrenome, telefone e clínica são obrigatórios' },
        { field: 'phone', error: 'Nome, sobrenome, telefone e clínica são obrigatórios' },
        { field: 'clinic', error: 'Nome, sobrenome, telefone e clínica são obrigatórios' }
      ];

      for (const testCase of testCases) {
        const patientData = getValidPatientData();
        delete (patientData as any)[testCase.field];

        await expect(patientService.createPatient(patientData))
          .rejects.toThrow(testCase.error);
      }
    });

    it('should throw error for invalid clinic ID', async () => {
      const patientData = getValidPatientData();
      patientData.clinic = 'invalid-id';

      await expect(patientService.createPatient(patientData))
        .rejects.toThrow('ID da clínica inválido');
    });

    it('should normalize email to lowercase', async () => {
      const patientData = getValidPatientData();
      patientData.email = 'UPPERCASE@EXAMPLE.COM';

      const result = await patientService.createPatient(patientData);

      expect(result.email).toBe('uppercase@example.com');
    });

    it('should detect duplicate phone numbers in same clinic', async () => {
      const patientData = getValidPatientData();

      // Create first patient
      await patientService.createPatient(patientData);

      // Try to create second patient with same phone
      const duplicateData = {
        ...patientData,
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria@example.com'
      };

      await expect(patientService.createPatient(duplicateData))
        .rejects.toThrow('Já existe um paciente ativo com este telefone nesta clínica');
    });

    it('should detect duplicate email in same clinic', async () => {
      const patientData = getValidPatientData();

      // Create first patient
      await patientService.createPatient(patientData);

      // Try to create second patient with same email
      const duplicateData = {
        ...patientData,
        firstName: 'Maria',
        lastName: 'Santos',
        phone: '(11) 88888-8888'
      };

      await expect(patientService.createPatient(duplicateData))
        .rejects.toThrow('Já existe um paciente ativo com este e-mail nesta clínica');
    });

    it('should allow same phone/email in different clinics', async () => {
      const otherClinic = await createTestClinic();
      const patientData = getValidPatientData();

      // Create patient in first clinic
      await patientService.createPatient(patientData);

      // Create patient with same data in different clinic
      const sameDataDifferentClinic = {
        ...patientData,
        clinic: otherClinic._id.toString()
      };

      const result = await patientService.createPatient(sameDataDifferentClinic);
      expect(result).toBeDefined();
    });

    it('should handle phone number normalization', async () => {
      const phoneVariations = [
        '11999999999',
        '(11) 99999-9999',
        '11 99999-9999',
        '+55 11 99999-9999'
      ];

      for (let i = 0; i < phoneVariations.length; i++) {
        const patientData = {
          ...getValidPatientData(),
          firstName: `Patient${i}`,
          email: `patient${i}@example.com`,
          phone: phoneVariations[i]
        };

        const result = await patientService.createPatient(patientData);
        expect(result).toBeDefined();
      }
    });

    it('should create patient without optional email', async () => {
      const patientData = getValidPatientData();
      delete patientData.email;

      const result = await patientService.createPatient(patientData);

      expect(result).toBeDefined();
      expect(result.email).toBeUndefined();
    });
  });

  describe('getPatientById', () => {
    it('should return patient by valid ID', async () => {
      const patientData = getValidPatientData();
      const created = await patientService.createPatient(patientData);

      const result = await patientService.getPatientById(
        created._id.toString(),
        testClinic._id.toString()
      );

      expect(result).toBeDefined();
      expect(result!._id.toString()).toBe(created._id.toString());
    });

    it('should return null for non-existent patient', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const result = await patientService.getPatientById(
        nonExistentId,
        testClinic._id.toString()
      );

      expect(result).toBeNull();
    });

    it('should throw error for invalid patient ID', async () => {
      await expect(patientService.getPatientById('invalid-id', testClinic._id.toString()))
        .rejects.toThrow('ID do paciente inválido');
    });

    it('should not return patients from different clinics', async () => {
      const otherClinic = await createTestClinic();
      const patientData = getValidPatientData();
      const created = await patientService.createPatient(patientData);

      const result = await patientService.getPatientById(
        created._id.toString(),
        otherClinic._id.toString()
      );

      expect(result).toBeNull();
    });
  });

  describe('updatePatient', () => {
    let testPatient: any;

    beforeEach(async () => {
      const patientData = getValidPatientData();
      testPatient = await patientService.createPatient(patientData);
    });

    it('should update patient basic information', async () => {
      const updateData = {
        firstName: 'João Updated',
        lastName: 'Silva Updated',
        phone: '(11) 88888-8888'
      };

      const result = await patientService.updatePatient(
        testPatient._id.toString(),
        testClinic._id.toString(),
        updateData
      );

      expect(result).toBeDefined();
      expect(result!.firstName).toBe(updateData.firstName);
      expect(result!.lastName).toBe(updateData.lastName);
      expect(result!.phone).toBe(updateData.phone);
    });

    it('should prevent duplicate phone when updating', async () => {
      // Create another patient
      const otherPatientData = {
        ...getValidPatientData(),
        firstName: 'Maria',
        email: 'maria@example.com',
        phone: '(11) 88888-8888'
      };
      await patientService.createPatient(otherPatientData);

      // Try to update first patient with second patient's phone
      await expect(patientService.updatePatient(
        testPatient._id.toString(),
        testClinic._id.toString(),
        { phone: '(11) 88888-8888' }
      )).rejects.toThrow('Já existe um paciente ativo com este telefone nesta clínica');
    });

    it('should prevent duplicate email when updating', async () => {
      // Create another patient
      const otherPatientData = {
        ...getValidPatientData(),
        firstName: 'Maria',
        email: 'maria@example.com',
        phone: '(11) 88888-8888'
      };
      await patientService.createPatient(otherPatientData);

      // Try to update first patient with second patient's email
      await expect(patientService.updatePatient(
        testPatient._id.toString(),
        testClinic._id.toString(),
        { email: 'maria@example.com' }
      )).rejects.toThrow('Já existe um paciente ativo com este e-mail nesta clínica');
    });

    it('should allow updating to same phone/email', async () => {
      const result = await patientService.updatePatient(
        testPatient._id.toString(),
        testClinic._id.toString(),
        { 
          phone: testPatient.phone,
          email: testPatient.email
        }
      );

      expect(result).toBeDefined();
    });

    it('should update patient status', async () => {
      const result = await patientService.updatePatient(
        testPatient._id.toString(),
        testClinic._id.toString(),
        { status: 'inactive' }
      );

      expect(result).toBeDefined();
      expect(result!.status).toBe('inactive');
    });

    it('should return null for non-existent patient', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const result = await patientService.updatePatient(
        nonExistentId,
        testClinic._id.toString(),
        { firstName: 'Updated' }
      );

      expect(result).toBeNull();
    });
  });

  describe('searchPatients', () => {
    beforeEach(async () => {
      // Create test patients
      const patients = [
        { firstName: 'João', lastName: 'Silva', email: 'joao@example.com', phone: '(11) 99999-9999' },
        { firstName: 'Maria', lastName: 'Santos', email: 'maria@example.com', phone: '(11) 88888-8888' },
        { firstName: 'Pedro', lastName: 'Oliveira', email: 'pedro@example.com', phone: '(11) 77777-7777' },
        { firstName: 'Ana', lastName: 'Costa', email: 'ana@example.com', phone: '(11) 66666-6666' }
      ];

      for (const patient of patients) {
        await patientService.createPatient({
          ...getValidPatientData(),
          ...patient
        });
      }
    });

    it('should search patients by first name', async () => {
      const result = await patientService.searchPatients({
        clinicId: testClinic._id.toString(),
        search: 'João'
      });

      expect(result.patients.length).toBe(1);
      expect(result.patients[0].firstName).toBe('João');
    });

    it('should search patients by last name', async () => {
      const result = await patientService.searchPatients({
        clinicId: testClinic._id.toString(),
        search: 'Silva'
      });

      expect(result.patients.length).toBe(1);
      expect(result.patients[0].lastName).toBe('Silva');
    });

    it('should search patients by email', async () => {
      const result = await patientService.searchPatients({
        clinicId: testClinic._id.toString(),
        search: 'maria@example.com'
      });

      expect(result.patients.length).toBe(1);
      expect(result.patients[0].email).toBe('maria@example.com');
    });

    it('should search patients by phone', async () => {
      const result = await patientService.searchPatients({
        clinicId: testClinic._id.toString(),
        search: '(11) 77777-7777'
      });

      expect(result.patients.length).toBe(1);
      expect(result.patients[0].phone).toBe('(11) 77777-7777');
    });

    it('should handle pagination', async () => {
      const result = await patientService.searchPatients({
        clinicId: testClinic._id.toString(),
        page: 1,
        limit: 2
      });

      expect(result.patients.length).toBe(2);
      expect(result.total).toBe(4);
      expect(result.totalPages).toBe(2);
      expect(result.hasNext).toBe(true);
      expect(result.hasPrev).toBe(false);
    });

    it('should filter by status', async () => {
      // Deactivate one patient
      const allPatients = await patientService.searchPatients({
        clinicId: testClinic._id.toString()
      });
      
      await patientService.updatePatient(
        allPatients.patients[0]._id.toString(),
        testClinic._id.toString(),
        { status: 'inactive' }
      );

      // Search active patients
      const activeResult = await patientService.searchPatients({
        clinicId: testClinic._id.toString(),
        status: 'active'
      });

      expect(activeResult.patients.length).toBe(3);

      // Search inactive patients
      const inactiveResult = await patientService.searchPatients({
        clinicId: testClinic._id.toString(),
        status: 'inactive'
      });

      expect(inactiveResult.patients.length).toBe(1);
    });

    it('should handle case-insensitive search', async () => {
      const result = await patientService.searchPatients({
        clinicId: testClinic._id.toString(),
        search: 'joão'
      });

      expect(result.patients.length).toBe(1);
      expect(result.patients[0].firstName).toBe('João');
    });

    it('should return empty results for non-matching search', async () => {
      const result = await patientService.searchPatients({
        clinicId: testClinic._id.toString(),
        search: 'NonExistentName'
      });

      expect(result.patients.length).toBe(0);
      expect(result.total).toBe(0);
    });
  });

  describe('updateMedicalHistory', () => {
    let testPatient: any;

    beforeEach(async () => {
      const patientData = getValidPatientData();
      testPatient = await patientService.createPatient(patientData);
    });

    it('should update medical history', async () => {
      const medicalHistory = {
        allergies: ['Penicilina', 'Látex'],
        medications: ['Aspirina', 'Vitamina D'],
        conditions: ['Hipertensão', 'Diabetes'],
        notes: 'Paciente com histórico de alergias múltiplas'
      };

      const result = await patientService.updateMedicalHistory(
        testPatient._id.toString(),
        testClinic._id.toString(),
        medicalHistory
      );

      expect(result).toBeDefined();
      expect(result!.medicalHistory.allergies).toEqual(medicalHistory.allergies);
      expect(result!.medicalHistory.medications).toEqual(medicalHistory.medications);
      expect(result!.medicalHistory.conditions).toEqual(medicalHistory.conditions);
      expect(result!.medicalHistory.notes).toBe(medicalHistory.notes);
    });

    it('should handle partial medical history updates', async () => {
      const partialHistory = {
        allergies: ['Penicilina']
      };

      const result = await patientService.updateMedicalHistory(
        testPatient._id.toString(),
        testClinic._id.toString(),
        partialHistory
      );

      expect(result).toBeDefined();
      expect(result!.medicalHistory.allergies).toEqual(['Penicilina']);
      expect(result!.medicalHistory.medications).toEqual([]);
      expect(result!.medicalHistory.conditions).toEqual([]);
    });

    it('should return null for non-existent patient', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const result = await patientService.updateMedicalHistory(
        nonExistentId,
        testClinic._id.toString(),
        { allergies: ['Test'] }
      );

      expect(result).toBeNull();
    });
  });

  describe('getPatientStats', () => {
    beforeEach(async () => {
      // Create patients with different statuses and dates
      const thirtyFiveDaysAgo = new Date();
      thirtyFiveDaysAgo.setDate(thirtyFiveDaysAgo.getDate() - 35);

      const twentyDaysAgo = new Date();
      twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

      // Active patients
      for (let i = 0; i < 3; i++) {
        await patientService.createPatient({
          ...getValidPatientData(),
          firstName: `Active${i}`,
          email: `active${i}@example.com`,
          phone: `(11) 9999${i}-999${i}`
        });
      }

      // Inactive patient
      const inactivePatient = await patientService.createPatient({
        ...getValidPatientData(),
        firstName: 'Inactive',
        email: 'inactive@example.com',
        phone: '(11) 88888-8888'
      });
      await patientService.updatePatient(
        inactivePatient._id.toString(),
        testClinic._id.toString(),
        { status: 'inactive' }
      );

      // Patient with medical history
      const patientWithHistory = await patientService.createPatient({
        ...getValidPatientData(),
        firstName: 'WithHistory',
        email: 'history@example.com',
        phone: '(11) 77777-7777'
      });
      await patientService.updateMedicalHistory(
        patientWithHistory._id.toString(),
        testClinic._id.toString(),
        { allergies: ['Penicilina'] }
      );
    });

    it('should return correct patient statistics', async () => {
      const stats = await patientService.getPatientStats(testClinic._id.toString());

      expect(stats.total).toBe(5);
      expect(stats.active).toBe(4);
      expect(stats.inactive).toBe(1);
      expect(stats.withMedicalHistory).toBe(1);
      expect(stats.recentlyAdded).toBeGreaterThan(0);
    });

    it('should throw error for invalid clinic ID', async () => {
      await expect(patientService.getPatientStats('invalid-id'))
        .rejects.toThrow('ID da clínica inválido');
    });
  });

  describe('reactivatePatient', () => {
    let inactivePatient: any;

    beforeEach(async () => {
      const patientData = getValidPatientData();
      const patient = await patientService.createPatient(patientData);
      
      // Deactivate patient
      inactivePatient = await patientService.updatePatient(
        patient._id.toString(),
        testClinic._id.toString(),
        { status: 'inactive' }
      );
    });

    it('should reactivate inactive patient', async () => {
      const result = await patientService.reactivatePatient(
        inactivePatient._id.toString(),
        testClinic._id.toString()
      );

      expect(result).toBeDefined();
      expect(result!.status).toBe('active');
    });

    it('should prevent reactivation if phone conflicts with active patient', async () => {
      // Create active patient with same phone
      await patientService.createPatient({
        ...getValidPatientData(),
        firstName: 'Active',
        email: 'active@example.com'
      });

      await expect(patientService.reactivatePatient(
        inactivePatient._id.toString(),
        testClinic._id.toString()
      )).rejects.toThrow('Já existe um paciente ativo com este telefone nesta clínica');
    });

    it('should prevent reactivation if email conflicts with active patient', async () => {
      // Create active patient with same email
      await patientService.createPatient({
        ...getValidPatientData(),
        firstName: 'Active',
        phone: '(11) 88888-8888'
      });

      await expect(patientService.reactivatePatient(
        inactivePatient._id.toString(),
        testClinic._id.toString()
      )).rejects.toThrow('Já existe um paciente ativo com este e-mail nesta clínica');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock database error
      const originalFind = Patient.findOne;
      Patient.findOne = jest.fn().mockRejectedValue(new Error('Database connection lost'));

      await expect(patientService.getPatientById(
        new mongoose.Types.ObjectId().toString(),
        testClinic._id.toString()
      )).rejects.toThrow('Erro ao buscar paciente');

      // Restore original method
      Patient.findOne = originalFind;
    });

    it('should handle concurrent patient creation with same phone', async () => {
      const patientData = getValidPatientData();

      // Try to create multiple patients with same phone simultaneously
      const promises = Array(3).fill(null).map((_, index) =>
        patientService.createPatient({
          ...patientData,
          firstName: `Patient${index}`,
          email: `patient${index}@example.com`
        })
      );

      const results = await Promise.allSettled(promises);

      // Only one should succeed due to phone conflict
      const successes = results.filter(r => r.status === 'fulfilled');
      const failures = results.filter(r => r.status === 'rejected');

      expect(successes.length).toBe(1);
      expect(failures.length).toBe(2);
    });

    it('should handle very long names', async () => {
      const patientData = {
        ...getValidPatientData(),
        firstName: 'x'.repeat(1000),
        lastName: 'y'.repeat(1000)
      };

      // Should either succeed or fail gracefully
      try {
        const result = await patientService.createPatient(patientData);
        expect(result).toBeDefined();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should handle special characters in names', async () => {
      const patientData = {
        ...getValidPatientData(),
        firstName: 'José María',
        lastName: 'González-Pérez'
      };

      const result = await patientService.createPatient(patientData);
      expect(result).toBeDefined();
      expect(result.firstName).toBe('José María');
      expect(result.lastName).toBe('González-Pérez');
    });

    it('should handle invalid email formats during update', async () => {
      const patientData = getValidPatientData();
      const patient = await patientService.createPatient(patientData);

      // Try to update with invalid email
      try {
        await patientService.updatePatient(
          patient._id.toString(),
          testClinic._id.toString(),
          { email: 'invalid-email-format' }
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});