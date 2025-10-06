# TopSmile Refactoring - Quick Start Guide

## Immediate Actions (Week 1)

### Day 1: Backend Route Consolidation

#### 1. Create Route Groups

```bash
# Create new directory structure
mkdir -p backend/src/routes/clinical
mkdir -p backend/src/routes/scheduling
mkdir -p backend/src/routes/patient
mkdir -p backend/src/routes/security
```

#### 2. Consolidate Clinical Routes

**File**: `backend/src/routes/clinical/index.ts`

```typescript
import { Router } from 'express';
import dentalChartsRoutes from './dentalCharts';
import clinicalNotesRoutes from './clinicalNotes';
import prescriptionsRoutes from './prescriptions';
import treatmentPlansRoutes from './treatmentPlans';

const router = Router();

router.use('/dental-charts', dentalChartsRoutes);
router.use('/clinical-notes', clinicalNotesRoutes);
router.use('/prescriptions', prescriptionsRoutes);
router.use('/treatment-plans', treatmentPlansRoutes);

export default router;
```

**Move files**:
```bash
mv backend/src/routes/dentalCharts.ts backend/src/routes/clinical/
mv backend/src/routes/clinicalNotes.ts backend/src/routes/clinical/
mv backend/src/routes/prescriptions.ts backend/src/routes/clinical/
mv backend/src/routes/treatmentPlans.ts backend/src/routes/clinical/
```

#### 3. Update app.ts

**File**: `backend/src/app.ts`

```typescript
// Replace individual imports
import clinicalRoutes from './routes/clinical';
import schedulingRoutes from './routes/scheduling';
import patientRoutes from './routes/patient';
import securityRoutes from './routes/security';

// Replace individual route mounts
app.use('/api/clinical', authenticate, clinicalRoutes);
app.use('/api/scheduling', authenticate, schedulingRoutes);
app.use('/api/patients', authenticate, patientRoutes);
app.use('/api/security', authenticate, securityRoutes);
```

### Day 2: Create Base Service Class

#### 1. Create Base Service

**File**: `backend/src/services/base/BaseService.ts`

```typescript
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { AppError } from '../../utils/errors';

export interface PaginationOptions {
    page?: number;
    limit?: number;
    sort?: string;
}

export interface PaginatedResult<T> {
    items: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export abstract class BaseService<T extends Document> {
    constructor(protected model: Model<T>) {}

    async findById(id: string): Promise<T | null> {
        try {
            return await this.model.findById(id).lean();
        } catch (error) {
            throw new AppError(`Erro ao buscar ${this.model.modelName}`, 500);
        }
    }

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOne(filter).lean();
        } catch (error) {
            throw new AppError(`Erro ao buscar ${this.model.modelName}`, 500);
        }
    }

    async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
        try {
            return await this.model.find(filter).lean();
        } catch (error) {
            throw new AppError(`Erro ao listar ${this.model.modelName}`, 500);
        }
    }

    async paginate(
        filter: FilterQuery<T>,
        options: PaginationOptions = {}
    ): Promise<PaginatedResult<T>> {
        const { page = 1, limit = 20, sort = '-createdAt' } = options;
        const skip = (page - 1) * limit;

        try {
            const [items, total] = await Promise.all([
                this.model.find(filter).sort(sort).skip(skip).limit(limit).lean(),
                this.model.countDocuments(filter)
            ]);

            return {
                items,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page * limit < total,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            throw new AppError(`Erro ao paginar ${this.model.modelName}`, 500);
        }
    }

    async create(data: Partial<T>): Promise<T> {
        try {
            const doc = new this.model(data);
            return await doc.save();
        } catch (error) {
            throw new AppError(`Erro ao criar ${this.model.modelName}`, 500);
        }
    }

    async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
        try {
            return await this.model.findByIdAndUpdate(id, data, { 
                new: true,
                runValidators: true 
            }).lean();
        } catch (error) {
            throw new AppError(`Erro ao atualizar ${this.model.modelName}`, 500);
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await this.model.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new AppError(`Erro ao deletar ${this.model.modelName}`, 500);
        }
    }

    async softDelete(id: string): Promise<T | null> {
        try {
            return await this.model.findByIdAndUpdate(
                id,
                { isDeleted: true, deletedAt: new Date() },
                { new: true }
            ).lean();
        } catch (error) {
            throw new AppError(`Erro ao deletar ${this.model.modelName}`, 500);
        }
    }

    async count(filter: FilterQuery<T> = {}): Promise<number> {
        try {
            return await this.model.countDocuments(filter);
        } catch (error) {
            throw new AppError(`Erro ao contar ${this.model.modelName}`, 500);
        }
    }

    async exists(filter: FilterQuery<T>): Promise<boolean> {
        try {
            const count = await this.model.countDocuments(filter).limit(1);
            return count > 0;
        } catch (error) {
            throw new AppError(`Erro ao verificar ${this.model.modelName}`, 500);
        }
    }
}
```

#### 2. Create Custom Error Classes

**File**: `backend/src/utils/errors.ts`

```typescript
export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public code?: string,
        public details?: any
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: any) {
        super(message, 400, 'VALIDATION_ERROR', details);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} não encontrado`, 404, 'NOT_FOUND');
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Não autorizado') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Acesso negado') {
        super(message, 403, 'FORBIDDEN');
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, 'CONFLICT');
    }
}
```

#### 3. Refactor One Service

**File**: `backend/src/services/dentalChartService.ts`

```typescript
import { BaseService } from './base/BaseService';
import { DentalChart } from '../models/DentalChart';
import { NotFoundError } from '../utils/errors';

class DentalChartService extends BaseService<typeof DentalChart> {
    constructor() {
        super(DentalChart);
    }

    async getByPatientId(patientId: string) {
        const chart = await this.findOne({ patient: patientId });
        if (!chart) {
            throw new NotFoundError('Ficha odontológica');
        }
        return chart;
    }

    async updateTooth(chartId: string, toothNumber: number, data: any) {
        const chart = await this.findById(chartId);
        if (!chart) {
            throw new NotFoundError('Ficha odontológica');
        }

        // Business logic here
        return await this.update(chartId, {
            $set: { [`teeth.${toothNumber}`]: data }
        });
    }
}

export const dentalChartService = new DentalChartService();
```

### Day 3: Frontend Component Consolidation

#### 1. Create Common Form Components

**File**: `src/components/common/Form/FormField.tsx`

```typescript
import React from 'react';
import { Input } from '../Input';
import { Select } from '../Select';
import './FormField.css';

interface FormFieldProps {
    name: string;
    label: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
    value: any;
    error?: string;
    options?: Array<{ value: string; label: string }>;
    required?: boolean;
    disabled?: boolean;
    onChange: (name: string, value: any) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
    name,
    label,
    type = 'text',
    value,
    error,
    options,
    required,
    disabled,
    onChange
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        onChange(name, e.target.value);
    };

    return (
        <div className="form-field">
            <label htmlFor={name} className="form-field__label">
                {label}
                {required && <span className="form-field__required">*</span>}
            </label>

            {type === 'select' ? (
                <Select
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    error={!!error}
                >
                    <option value="">Selecione...</option>
                    {options?.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </Select>
            ) : type === 'textarea' ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    className={`form-field__textarea ${error ? 'form-field__textarea--error' : ''}`}
                />
            ) : (
                <Input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={handleChange}
                    disabled={disabled}
                    error={!!error}
                />
            )}

            {error && <span className="form-field__error">{error}</span>}
        </div>
    );
};
```

#### 2. Create useForm Hook

**File**: `src/hooks/common/useForm.ts`

```typescript
import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
    initialValues: T;
    onSubmit: (values: T) => Promise<void>;
    validate?: (values: T) => Partial<Record<keyof T, string>>;
}

export function useForm<T extends Record<string, any>>({
    initialValues,
    onSubmit,
    validate
}: UseFormOptions<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = useCallback((name: keyof T, value: any) => {
        setValues(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    }, [errors]);

    const handleSubmit = useCallback(async (e?: React.FormEvent) => {
        e?.preventDefault();

        // Validate
        if (validate) {
            const validationErrors = validate(values);
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
        }

        // Submit
        setIsSubmitting(true);
        try {
            await onSubmit(values);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [values, validate, onSubmit]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
    }, [initialValues]);

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        reset,
        setValues,
        setErrors
    };
}
```

### Day 4: Database Index Optimization

#### 1. Audit Current Indexes

```bash
# Create script to analyze indexes
cat > backend/scripts/analyze-indexes.js << 'EOF'
const mongoose = require('mongoose');
require('dotenv').config();

async function analyzeIndexes() {
    await mongoose.connect(process.env.DATABASE_URL);
    
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
        console.log(`\n=== ${collection.name} ===`);
        
        const indexes = await mongoose.connection.db
            .collection(collection.name)
            .indexes();
        
        console.log('Indexes:', indexes.length);
        
        for (const index of indexes) {
            const stats = await mongoose.connection.db
                .collection(collection.name)
                .aggregate([{ $indexStats: {} }])
                .toArray();
            
            const indexStat = stats.find(s => s.name === index.name);
            console.log(`  ${index.name}: ${indexStat?.accesses?.ops || 0} operations`);
        }
    }
    
    await mongoose.disconnect();
}

analyzeIndexes().catch(console.error);
EOF

node backend/scripts/analyze-indexes.js
```

#### 2. Remove Unused Indexes

**Example**: If an index has 0 operations after 30 days:

```typescript
// In model file, remove or comment out unused index
// AppointmentSchema.index({ oldField: 1 }); // UNUSED - Remove
```

#### 3. Add Missing Compound Indexes

**File**: `backend/src/models/Appointment.ts`

```typescript
// Add compound indexes for common queries
AppointmentSchema.index(
    { clinicId: 1, scheduledStart: 1, status: 1 },
    { name: 'clinic_schedule_status', background: true }
);

AppointmentSchema.index(
    { provider: 1, scheduledStart: 1, scheduledEnd: 1 },
    { name: 'provider_availability', background: true }
);

AppointmentSchema.index(
    { patient: 1, scheduledStart: -1 },
    { name: 'patient_history', background: true }
);
```

### Day 5: Testing Infrastructure

#### 1. Set Up Test Helpers

**File**: `backend/tests/helpers/testSetup.ts`

```typescript
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

export async function setupTestDB() {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
}

export async function teardownTestDB() {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    if (mongoServer) {
        await mongoServer.stop();
    }
}

export async function clearTestDB() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
}
```

#### 2. Create Test Factories

**File**: `backend/tests/factories/index.ts`

```typescript
import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';

export const factories = {
    appointment: (overrides = {}) => ({
        patient: new Types.ObjectId(),
        provider: new Types.ObjectId(),
        clinicId: new Types.ObjectId(),
        scheduledStart: faker.date.future(),
        scheduledEnd: faker.date.future(),
        status: 'scheduled',
        ...overrides
    }),

    patient: (overrides = {}) => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: '(11) 98765-4321',
        dateOfBirth: faker.date.past({ years: 30 }),
        clinicId: new Types.ObjectId(),
        ...overrides
    }),

    provider: (overrides = {}) => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        specialty: 'Dentista',
        clinicId: new Types.ObjectId(),
        ...overrides
    })
};
```

#### 3. Write First Test

**File**: `backend/tests/unit/services/dentalChartService.test.ts`

```typescript
import { setupTestDB, teardownTestDB, clearTestDB } from '../../helpers/testSetup';
import { dentalChartService } from '../../../src/services/dentalChartService';
import { DentalChart } from '../../../src/models/DentalChart';
import { factories } from '../../factories';

describe('DentalChartService', () => {
    beforeAll(setupTestDB);
    afterAll(teardownTestDB);
    afterEach(clearTestDB);

    describe('create', () => {
        it('should create a dental chart', async () => {
            const data = factories.dentalChart();
            const chart = await dentalChartService.create(data);

            expect(chart).toBeDefined();
            expect(chart.patient.toString()).toBe(data.patient.toString());
        });
    });

    describe('getByPatientId', () => {
        it('should get chart by patient ID', async () => {
            const data = factories.dentalChart();
            await dentalChartService.create(data);

            const chart = await dentalChartService.getByPatientId(data.patient.toString());

            expect(chart).toBeDefined();
            expect(chart.patient.toString()).toBe(data.patient.toString());
        });

        it('should throw NotFoundError if chart does not exist', async () => {
            await expect(
                dentalChartService.getByPatientId('507f1f77bcf86cd799439011')
            ).rejects.toThrow('Ficha odontológica não encontrado');
        });
    });
});
```

---

## Quick Wins (Immediate Impact)

### 1. Enable Response Compression

**File**: `backend/src/app.ts`

```typescript
import compression from 'compression';

app.use(compression());
```

### 2. Add Request Timeout

```typescript
app.use((req, res, next) => {
    req.setTimeout(30000); // 30 seconds
    res.setTimeout(30000);
    next();
});
```

### 3. Implement Query Result Caching

**File**: `backend/src/utils/cache.ts`

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function cacheQuery<T>(
    key: string,
    queryFn: () => Promise<T>,
    ttl = 300
): Promise<T> {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);

    const result = await queryFn();
    await redis.setex(key, ttl, JSON.stringify(result));
    return result;
}

export async function invalidateCache(pattern: string) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
        await redis.del(...keys);
    }
}
```

### 4. Add Frontend Code Splitting

**File**: `src/App.tsx`

```typescript
import { lazy, Suspense } from 'react';
import { Loading } from './components/common/Loading';

const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const Calendar = lazy(() => import('./pages/Calendar'));
const PatientPortal = lazy(() => import('./pages/Patient/Portal'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/patient" element={<PatientPortal />} />
            </Routes>
        </Suspense>
    );
}
```

---

## Verification Checklist

After completing Week 1:

- [ ] Routes consolidated into domain groups
- [ ] BaseService class created and tested
- [ ] At least 2 services refactored to use BaseService
- [ ] Custom error classes implemented
- [ ] Common form components created
- [ ] useForm hook implemented
- [ ] Database indexes analyzed
- [ ] At least 3 unused indexes removed
- [ ] Test infrastructure set up
- [ ] At least 5 unit tests written
- [ ] Response compression enabled
- [ ] Query caching implemented
- [ ] Code splitting added to main routes

---

## Next Steps

After Week 1, proceed to:
1. **Week 2**: Complete backend refactoring (all services, middleware)
2. **Week 3**: Frontend component refactoring
3. **Week 4**: State management optimization
4. **Week 5**: Database optimization and testing
5. **Week 6**: Documentation and final cleanup

See [REFACTORING_PLAN.md](./REFACTORING_PLAN.md) for complete details.
