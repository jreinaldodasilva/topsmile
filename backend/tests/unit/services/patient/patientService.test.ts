// backend/tests/unit/services/patientService.test.ts
import { patientService } from '../../../src/services/patient';
import { Patient } from '../../../src/models/Patient';
import { setupTestDB, teardownTestDB, clearTestDB } from '../../../helpers/testSetup';
import { createTestPatient } from '../../../helpers/factories';
import { faker } from '@faker-js/faker';

describe('PatientService', () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    beforeEach(async () => {
        await clearTestDB();
    });

    describe('createPatient', () => {
        it('should create patient with valid data', async () => {
            const patientData = {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                phone: '(11) 98765-4321',
                clinic: faker.database.mongodbObjectId()
            };

            const patient = await patientService.createPatient(patientData);

            expect(patient).toBeDefined();
            expect(patient.firstName).toBe(patientData.firstName);
            expect(patient.lastName).toBe(patientData.lastName);
            expect(patient.email).toBe(patientData.email.toLowerCase());
        });

        it('should throw error with missing required fields', async () => {
            await expect(
                patientService.createPatient({} as any)
            ).rejects.toThrow();
        });

        it('should normalize phone number', async () => {
            const patientData = {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                phone: '11987654321',
                clinic: faker.database.mongodbObjectId()
            };

            const patient = await patientService.createPatient(patientData);

            expect(patient.phone).toMatch(/^\(\d{2}\) \d{5}-\d{4}$/);
        });
    });

    describe('getPatientById', () => {
        it('should return patient by id', async () => {
            const created = await createTestPatient();
            const clinicId = created.clinic?.toString() || '';

            const patient = await patientService.getPatientById(created._id.toString(), clinicId);

            expect(patient).toBeDefined();
            expect(patient?._id.toString()).toBe(created._id.toString());
        });

        it('should return null for non-existent patient', async () => {
            const patient = await patientService.getPatientById(
                faker.database.mongodbObjectId(),
                faker.database.mongodbObjectId()
            );

            expect(patient).toBeNull();
        });

        it('should throw error with invalid id', async () => {
            await expect(
                patientService.getPatientById('invalid-id', faker.database.mongodbObjectId())
            ).rejects.toThrow();
        });
    });

    describe('updatePatient', () => {
        it('should update patient data', async () => {
            const created = await createTestPatient();
            const clinicId = created.clinic?.toString() || '';
            const newEmail = faker.internet.email();

            const updated = await patientService.updatePatient(
                created._id.toString(),
                clinicId,
                { email: newEmail }
            );

            expect(updated).toBeDefined();
            expect(updated?.email).toBe(newEmail.toLowerCase());
        });

        it('should return null for non-existent patient', async () => {
            const updated = await patientService.updatePatient(
                faker.database.mongodbObjectId(),
                faker.database.mongodbObjectId(),
                { email: faker.internet.email() }
            );

            expect(updated).toBeNull();
        });
    });

    describe('deletePatient', () => {
        it('should soft delete patient', async () => {
            const created = await createTestPatient();
            const clinicId = created.clinic?.toString() || '';

            const result = await patientService.deletePatient(created._id.toString(), clinicId);

            expect(result).toBe(true);

            const patient = await Patient.findById(created._id);
            expect(patient?.status).toBe('inactive');
        });

        it('should return false for non-existent patient', async () => {
            const result = await patientService.deletePatient(
                faker.database.mongodbObjectId(),
                faker.database.mongodbObjectId()
            );

            expect(result).toBe(false);
        });
    });

    describe('searchPatients', () => {
        it('should return paginated patients', async () => {
            const clinicId = faker.database.mongodbObjectId();
            
            await Promise.all([
                createTestPatient({ clinic: clinicId }),
                createTestPatient({ clinic: clinicId }),
                createTestPatient({ clinic: clinicId })
            ]);

            const result = await patientService.searchPatients({
                clinicId,
                page: 1,
                limit: 10
            });

            expect(result.patients).toHaveLength(3);
            expect(result.total).toBe(3);
            expect(result.page).toBe(1);
        });

        it('should filter by search term', async () => {
            const clinicId = faker.database.mongodbObjectId();
            const searchName = 'John';
            
            await createTestPatient({ clinic: clinicId, firstName: searchName });
            await createTestPatient({ clinic: clinicId, firstName: 'Jane' });

            const result = await patientService.searchPatients({
                clinicId,
                search: searchName,
                page: 1,
                limit: 10
            });

            expect(result.patients).toHaveLength(1);
            expect(result.patients[0].firstName).toBe(searchName);
        });

        it('should filter by status', async () => {
            const clinicId = faker.database.mongodbObjectId();
            
            await createTestPatient({ clinic: clinicId, status: 'active' });
            await createTestPatient({ clinic: clinicId, status: 'inactive' });

            const result = await patientService.searchPatients({
                clinicId,
                status: 'active',
                page: 1,
                limit: 10
            });

            expect(result.patients).toHaveLength(1);
            expect(result.patients[0].status).toBe('active');
        });
    });

    describe('updateMedicalHistory', () => {
        it('should update medical history', async () => {
            const created = await createTestPatient();
            const clinicId = created.clinic?.toString() || '';
            const allergies = ['Penicillin', 'Latex'];

            const updated = await patientService.updateMedicalHistory(
                created._id.toString(),
                clinicId,
                { allergies }
            );

            expect(updated).toBeDefined();
            expect(updated?.medicalHistory?.allergies).toEqual(allergies);
        });
    });

    describe('getPatientStats', () => {
        it('should return patient statistics', async () => {
            const clinicId = faker.database.mongodbObjectId();
            
            await Promise.all([
                createTestPatient({ clinic: clinicId, status: 'active' }),
                createTestPatient({ clinic: clinicId, status: 'active' }),
                createTestPatient({ clinic: clinicId, status: 'inactive' })
            ]);

            const stats = await patientService.getPatientStats(clinicId);

            expect(stats.total).toBe(3);
            expect(stats.active).toBe(2);
            expect(stats.inactive).toBe(1);
        });
    });
});
