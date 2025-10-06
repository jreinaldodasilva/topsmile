// backend/tests/unit/models/Patient.test.ts
import { Patient } from '../../../src/models/Patient';
import { setupTestDB, teardownTestDB, clearTestDB } from '../../helpers/testSetup';
import { faker } from '@faker-js/faker';

describe('Patient Model', () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    beforeEach(async () => {
        await clearTestDB();
    });

    describe('Validation', () => {
        it('should create patient with valid data', async () => {
            const patient = new Patient({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                phone: '(11) 98765-4321',
                clinic: faker.database.mongodbObjectId()
            });

            await expect(patient.save()).resolves.toBeDefined();
        });

        it('should fail without required fields', async () => {
            const patient = new Patient({});

            await expect(patient.save()).rejects.toThrow();
        });

        it('should validate phone format', async () => {
            const patient = new Patient({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                phone: 'invalid-phone',
                clinic: faker.database.mongodbObjectId()
            });

            await expect(patient.save()).rejects.toThrow();
        });

        it('should validate email format', async () => {
            const patient = new Patient({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                phone: '(11) 98765-4321',
                email: 'invalid-email',
                clinic: faker.database.mongodbObjectId()
            });

            await expect(patient.save()).rejects.toThrow();
        });

        it('should validate CPF format', async () => {
            const patient = new Patient({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                phone: '(11) 98765-4321',
                cpf: 'invalid-cpf',
                clinic: faker.database.mongodbObjectId()
            });

            await expect(patient.save()).rejects.toThrow();
        });
    });

    describe('Pre-save hooks', () => {
        it('should normalize phone number', async () => {
            const patient = new Patient({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                phone: '11987654321',
                clinic: faker.database.mongodbObjectId()
            });

            await patient.save();

            expect(patient.phone).toMatch(/^\(\d{2}\) \d{5}-\d{4}$/);
        });

        it('should normalize CPF', async () => {
            const patient = new Patient({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                phone: '(11) 98765-4321',
                cpf: '12345678901',
                clinic: faker.database.mongodbObjectId()
            });

            await patient.save();

            expect(patient.cpf).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
        });

        it('should normalize ZIP code', async () => {
            const patient = new Patient({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                phone: '(11) 98765-4321',
                clinic: faker.database.mongodbObjectId(),
                address: {
                    zipCode: '12345678'
                }
            });

            await patient.save();

            expect(patient.address?.zipCode).toBe('12345-678');
        });

        it('should trim medical history arrays', async () => {
            const patient = new Patient({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                phone: '(11) 98765-4321',
                clinic: faker.database.mongodbObjectId(),
                medicalHistory: {
                    allergies: ['  Penicillin  ', '', '  Latex  ']
                }
            });

            await patient.save();

            expect(patient.medicalHistory?.allergies).toEqual(['Penicillin', 'Latex']);
        });
    });

    describe('Virtual fields', () => {
        it('should generate fullName virtual', async () => {
            const patient = new Patient({
                firstName: 'John',
                lastName: 'Doe',
                phone: '(11) 98765-4321',
                clinic: faker.database.mongodbObjectId()
            });

            await patient.save();

            expect(patient.toJSON().fullName).toBe('John Doe');
        });
    });

    describe('Indexes', () => {
        it('should have compound index on clinic and status', async () => {
            const indexes = Patient.schema.indexes();
            const hasIndex = indexes.some(idx => 
                idx[0].clinic === 1 && idx[0].status === 1
            );

            expect(hasIndex).toBe(true);
        });
    });
});
