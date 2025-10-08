// backend/tests/unit/services/providerService.test.ts
import { providerService } from '../../../src/services/provider';
import { setupTestDB, teardownTestDB, clearTestDB } from '../../../helpers/testSetup';
import { createTestProvider } from '../../../helpers/factories';
import { faker } from '@faker-js/faker';

describe('ProviderService', () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    beforeEach(async () => {
        await clearTestDB();
    });

    describe('createProvider', () => {
        it('should create provider with valid data', async () => {
            const providerData = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                phone: '(11) 98765-4321',
                specialties: ['Orthodontics'],
                clinicId: faker.database.mongodbObjectId()
            };

            const provider = await providerService.createProvider(providerData);

            expect(provider).toBeDefined();
            expect(provider.name).toBe(providerData.name);
            expect(provider.email).toBe(providerData.email.toLowerCase());
        });

        it('should throw error with missing required fields', async () => {
            await expect(
                providerService.createProvider({} as any)
            ).rejects.toThrow();
        });

        it('should set default working hours', async () => {
            const providerData = {
                name: faker.person.fullName(),
                specialties: ['General Dentistry'],
                clinicId: faker.database.mongodbObjectId()
            };

            const provider = await providerService.createProvider(providerData);

            expect(provider.workingHours).toBeDefined();
            expect(provider.workingHours?.monday).toBeDefined();
        });
    });

    describe('getProviderById', () => {
        it('should return provider by id', async () => {
            const created = await createTestProvider();
            const clinicId = created.clinic?.toString() || '';

            const provider = await providerService.getProviderById(created._id.toString(), clinicId);

            expect(provider).toBeDefined();
            expect(provider?._id.toString()).toBe(created._id.toString());
        });

        it('should return null for non-existent provider', async () => {
            const provider = await providerService.getProviderById(
                faker.database.mongodbObjectId(),
                faker.database.mongodbObjectId()
            );

            expect(provider).toBeNull();
        });
    });

    describe('updateProvider', () => {
        it('should update provider data', async () => {
            const created = await createTestProvider();
            const clinicId = created.clinic?.toString() || '';
            const newName = faker.person.fullName();

            const updated = await providerService.updateProvider(
                created._id.toString(),
                clinicId,
                { name: newName }
            );

            expect(updated).toBeDefined();
            expect(updated?.name).toBe(newName);
        });

        it('should return null for non-existent provider', async () => {
            const updated = await providerService.updateProvider(
                faker.database.mongodbObjectId(),
                faker.database.mongodbObjectId(),
                { name: faker.person.fullName() }
            );

            expect(updated).toBeNull();
        });
    });

    describe('deleteProvider', () => {
        it('should soft delete provider', async () => {
            const created = await createTestProvider();
            const clinicId = created.clinic?.toString() || '';

            const result = await providerService.deleteProvider(created._id.toString(), clinicId);

            expect(result).toBe(true);
        });

        it('should return false for non-existent provider', async () => {
            const result = await providerService.deleteProvider(
                faker.database.mongodbObjectId(),
                faker.database.mongodbObjectId()
            );

            expect(result).toBe(false);
        });
    });

    describe('searchProviders', () => {
        it('should return paginated providers', async () => {
            const clinicId = faker.database.mongodbObjectId();
            
            await Promise.all([
                createTestProvider({ clinic: clinicId }),
                createTestProvider({ clinic: clinicId }),
                createTestProvider({ clinic: clinicId })
            ]);

            const result = await providerService.searchProviders({
                clinicId,
                page: 1,
                limit: 10
            });

            expect(result.providers).toHaveLength(3);
            expect(result.total).toBe(3);
        });

        it('should filter by specialty', async () => {
            const clinicId = faker.database.mongodbObjectId();
            
            await createTestProvider({ clinic: clinicId, specialties: ['Orthodontics'] });
            await createTestProvider({ clinic: clinicId, specialties: ['Endodontics'] });

            const result = await providerService.searchProviders({
                clinicId,
                specialties: ['Orthodontics'],
                page: 1,
                limit: 10
            });

            expect(result.providers).toHaveLength(1);
            expect(result.providers[0].specialties).toContain('Orthodontics');
        });
    });

    describe('getProviderStats', () => {
        it('should return provider statistics', async () => {
            const clinicId = faker.database.mongodbObjectId();
            
            await Promise.all([
                createTestProvider({ clinic: clinicId, isActive: true }),
                createTestProvider({ clinic: clinicId, isActive: true }),
                createTestProvider({ clinic: clinicId, isActive: false })
            ]);

            const stats = await providerService.getProviderStats(clinicId);

            expect(stats.total).toBe(3);
            expect(stats.active).toBe(2);
            expect(stats.inactive).toBe(1);
        });
    });
});
