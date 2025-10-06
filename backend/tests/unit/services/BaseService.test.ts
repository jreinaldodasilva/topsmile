// backend/tests/unit/services/BaseService.test.ts
import { setupTestDB, teardownTestDB, clearTestDB } from '../../helpers/testSetup';
import { BaseService } from '../../../src/services/base/BaseService';
import { Patient } from '../../../src/models/Patient';
import { factories } from '../../helpers/factories';

class TestPatientService extends BaseService<any> {
    constructor() {
        super(Patient);
    }
}

describe('BaseService', () => {
    let service: TestPatientService;

    beforeAll(setupTestDB);
    afterAll(teardownTestDB);
    afterEach(clearTestDB);

    beforeEach(() => {
        service = new TestPatientService();
    });

    describe('create', () => {
        it('should create a document', async () => {
            const data = factories.patient();
            const result = await service.create(data);

            expect(result).toBeDefined();
            expect(result.firstName).toBe(data.firstName);
        });
    });

    describe('findById', () => {
        it('should find document by id', async () => {
            const data = factories.patient();
            const created = await service.create(data);
            const found = await service.findById(created._id.toString());

            expect(found).toBeDefined();
            expect(found.firstName).toBe(data.firstName);
        });

        it('should return null for non-existent id', async () => {
            const found = await service.findById('507f1f77bcf86cd799439011');
            expect(found).toBeNull();
        });
    });

    describe('findAll', () => {
        it('should find all documents', async () => {
            await service.create(factories.patient());
            await service.create(factories.patient());

            const results = await service.findAll();
            expect(results).toHaveLength(2);
        });

        it('should filter documents', async () => {
            const clinic = '507f1f77bcf86cd799439011';
            await service.create(factories.patient({ clinic }));
            await service.create(factories.patient());

            const results = await service.findAll({ clinic });
            expect(results).toHaveLength(1);
        });
    });

    describe('paginate', () => {
        it('should paginate results', async () => {
            for (let i = 0; i < 25; i++) {
                await service.create(factories.patient());
            }

            const result = await service.paginate({}, { page: 1, limit: 10 });

            expect(result.items).toHaveLength(10);
            expect(result.pagination.total).toBe(25);
            expect(result.pagination.totalPages).toBe(3);
            expect(result.pagination.hasNext).toBe(true);
            expect(result.pagination.hasPrev).toBe(false);
        });
    });

    describe('update', () => {
        it('should update document', async () => {
            const data = factories.patient();
            const created = await service.create(data);
            const updated = await service.update(created._id.toString(), { firstName: 'Updated' });

            expect(updated).toBeDefined();
            expect(updated.firstName).toBe('Updated');
        });
    });

    describe('delete', () => {
        it('should delete document', async () => {
            const data = factories.patient();
            const created = await service.create(data);
            const deleted = await service.delete(created._id.toString());

            expect(deleted).toBe(true);

            const found = await service.findById(created._id.toString());
            expect(found).toBeNull();
        });
    });

    describe('count', () => {
        it('should count documents', async () => {
            await service.create(factories.patient());
            await service.create(factories.patient());

            const count = await service.count();
            expect(count).toBe(2);
        });
    });

    describe('exists', () => {
        it('should return true if document exists', async () => {
            const data = factories.patient({ email: 'test@example.com' });
            await service.create(data);

            const exists = await service.exists({ email: 'test@example.com' });
            expect(exists).toBe(true);
        });

        it('should return false if document does not exist', async () => {
            const exists = await service.exists({ email: 'nonexistent@example.com' });
            expect(exists).toBe(false);
        });
    });
});
