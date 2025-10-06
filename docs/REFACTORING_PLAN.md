# TopSmile - Comprehensive Refactoring Plan

## Executive Summary

After implementing 16 weeks of enhancements (67% of the 24-week plan), the TopSmile codebase requires strategic refactoring to:
- **Consolidate** 11 new models, 20+ routes, 40+ components
- **Optimize** database queries and API performance
- **Standardize** code patterns and architecture
- **Improve** maintainability and testability
- **Reduce** technical debt accumulated during rapid development

**Estimated Timeline**: 4-6 weeks
**Priority**: High - Required before Phase 5-6 implementation

---

## 1. Backend Refactoring

### 1.1 Route Consolidation

**Current State**: 30+ individual route files with inconsistent patterns

**Issues**:
- Duplicate validation logic across routes
- Inconsistent error handling patterns
- Mixed authentication/authorization approaches
- Scattered business logic in route handlers

**Refactoring Strategy**:

```typescript
// backend/src/routes/index.ts - Centralized route registry
import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';

// Group routes by domain
import authRoutes from './auth';
import clinicalRoutes from './clinical'; // Consolidate clinical-related routes
import schedulingRoutes from './scheduling'; // Consolidate appointment-related routes
import patientRoutes from './patient'; // Consolidate patient-related routes
import adminRoutes from './admin';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes with authentication
router.use('/clinical', authenticate, clinicalRoutes);
router.use('/scheduling', authenticate, schedulingRoutes);
router.use('/patients', authenticate, patientRoutes);
router.use('/admin', authenticate, authorize('admin', 'super_admin'), adminRoutes);

export default router;
```

**Action Items**:
1. **Create domain-based route groups**:
   - `routes/clinical/index.ts` - Consolidate: dentalCharts, clinicalNotes, prescriptions, treatmentPlans
   - `routes/scheduling/index.ts` - Consolidate: appointments, calendar, operatories, waitlist, booking
   - `routes/patient/index.ts` - Consolidate: patients, patientAuth, medicalHistory, insurance, family, documents
   - `routes/security/index.ts` - Consolidate: mfa, smsVerification, passwordPolicy, sessions, auditLogs

2. **Extract common validation schemas**:
```typescript
// backend/src/validation/schemas/common.ts
export const mongoIdSchema = param('id').isMongoId().withMessage('ID inválido');
export const paginationSchema = [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 })
];
```

3. **Standardize route structure**:
```typescript
// backend/src/routes/clinical/dentalCharts.ts
import { Router } from 'express';
import { validate } from '../../middleware/validation';
import { dentalChartSchemas } from '../../validation/schemas/dentalChart';
import { dentalChartController } from '../../controllers/dentalChart';

const router = Router();

router.get('/', validate(dentalChartSchemas.list), dentalChartController.list);
router.post('/', validate(dentalChartSchemas.create), dentalChartController.create);
router.get('/:id', validate(dentalChartSchemas.get), dentalChartController.get);
router.put('/:id', validate(dentalChartSchemas.update), dentalChartController.update);
router.delete('/:id', validate(dentalChartSchemas.delete), dentalChartController.delete);

export default router;
```

### 1.2 Service Layer Refactoring

**Current State**: 18 service files with mixed responsibilities

**Issues**:
- Business logic scattered between routes and services
- Duplicate database queries
- Inconsistent error handling
- Missing transaction management in critical operations

**Refactoring Strategy**:

```typescript
// backend/src/services/base/BaseService.ts
import { Model, Document, FilterQuery } from 'mongoose';

export abstract class BaseService<T extends Document> {
    constructor(protected model: Model<T>) {}

    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).lean();
    }

    async findAll(filter: FilterQuery<T> = {}, options = {}): Promise<T[]> {
        return this.model.find(filter, null, options).lean();
    }

    async create(data: Partial<T>): Promise<T> {
        const doc = new this.model(data);
        return doc.save();
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return this.model.findByIdAndUpdate(id, data, { new: true }).lean();
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.findByIdAndDelete(id);
        return !!result;
    }

    async paginate(filter: FilterQuery<T>, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.model.find(filter).skip(skip).limit(limit).lean(),
            this.model.countDocuments(filter)
        ]);

        return {
            items,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
        };
    }
}
```

**Action Items**:
1. Create `BaseService` class with common CRUD operations
2. Refactor existing services to extend `BaseService`
3. Extract transaction logic to `TransactionManager` utility
4. Consolidate duplicate query patterns
5. Implement service-level caching with Redis

### 1.3 Model Optimization

**Current State**: 22 models with 50+ indexes

**Issues**:
- Redundant indexes causing write performance degradation
- Missing compound indexes for common queries
- Inconsistent schema validation
- Duplicate field definitions across models

**Refactoring Strategy**:

```typescript
// backend/src/models/base/BaseSchema.ts
import { Schema, SchemaDefinition } from 'mongoose';

export const baseSchemaFields: SchemaDefinition = {
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date }
};

export const createBaseSchema = <T>(definition: SchemaDefinition<T>) => {
    return new Schema({
        ...definition,
        ...baseSchemaFields
    }, {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
                if (ret.isDeleted) delete ret.isDeleted;
                return ret;
            }
        }
    });
};
```

**Action Items**:
1. **Audit and optimize indexes**:
   - Remove redundant single-field indexes covered by compound indexes
   - Add missing compound indexes for frequent queries
   - Use partial indexes for conditional queries

2. **Consolidate common fields**:
   - Extract `baseSchemaFields` (timestamps, soft delete)
   - Create `auditableFields` mixin (createdBy, updatedBy)
   - Create `clinicScopedFields` mixin (clinicId with index)

3. **Standardize validation**:
```typescript
// backend/src/models/validators/common.ts
export const emailValidator = {
    validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: 'Email inválido'
};

export const phoneValidator = {
    validator: (v: string) => /^\(\d{2}\) \d{4,5}-\d{4}$/.test(v),
    message: 'Telefone inválido'
};
```

### 1.4 Middleware Consolidation

**Current State**: Multiple middleware files with overlapping concerns

**Refactoring Strategy**:

```typescript
// backend/src/middleware/index.ts - Single middleware registry
export { authenticate, authorize } from './auth';
export { validate, validationResult } from './validation';
export { errorHandler, asyncHandler } from './errorHandler';
export { auditLogger } from './auditLogger';
export { rateLimiter } from './rateLimiter';
export { csrfProtection, mongoSanitization } from './security';
```

**Action Items**:
1. Create unified validation middleware
2. Consolidate rate limiting strategies
3. Standardize error response format
4. Extract audit logging to separate concern

---

## 2. Frontend Refactoring

### 2.1 Component Architecture

**Current State**: 40+ components with mixed patterns

**Issues**:
- Duplicate form logic across components
- Inconsistent state management
- Mixed presentation and business logic
- Large component files (>500 lines)

**Refactoring Strategy**:

```typescript
// src/components/common/Form/FormBuilder.tsx
interface FormBuilderProps<T> {
    schema: FormSchema<T>;
    initialValues: T;
    onSubmit: (values: T) => Promise<void>;
    validationSchema?: ValidationSchema<T>;
}

export function FormBuilder<T>({ schema, initialValues, onSubmit }: FormBuilderProps<T>) {
    // Centralized form logic
    const { values, errors, handleChange, handleSubmit } = useForm({
        initialValues,
        onSubmit,
        validationSchema
    });

    return (
        <form onSubmit={handleSubmit}>
            {schema.fields.map(field => (
                <FormField
                    key={field.name}
                    field={field}
                    value={values[field.name]}
                    error={errors[field.name]}
                    onChange={handleChange}
                />
            ))}
        </form>
    );
}
```

**Action Items**:
1. **Create reusable form components**:
   - `FormBuilder` - Generic form renderer
   - `FormField` - Smart field component with validation
   - `FormSection` - Grouped fields with collapsible sections

2. **Extract business logic to hooks**:
```typescript
// src/hooks/clinical/useDentalChart.ts
export function useDentalChart(patientId: string) {
    const queryClient = useQueryClient();

    const { data: chart, isLoading } = useQuery({
        queryKey: ['dentalChart', patientId],
        queryFn: () => apiService.getDentalChart(patientId)
    });

    const updateTooth = useMutation({
        mutationFn: (data: ToothUpdate) => apiService.updateTooth(patientId, data),
        onSuccess: () => queryClient.invalidateQueries(['dentalChart', patientId])
    });

    return { chart, isLoading, updateTooth };
}
```

3. **Consolidate component structure**:
```
src/components/
├── common/           # Shared UI components
│   ├── Form/
│   ├── Table/
│   ├── Modal/
│   └── Layout/
├── features/         # Feature-specific components
│   ├── Clinical/
│   │   ├── DentalChart/
│   │   ├── TreatmentPlan/
│   │   └── ClinicalNotes/
│   ├── Scheduling/
│   │   ├── Calendar/
│   │   ├── Appointments/
│   │   └── Booking/
│   └── Patient/
│       ├── Profile/
│       ├── Insurance/
│       └── Documents/
└── layouts/          # Page layouts
    ├── AdminLayout/
    ├── PatientLayout/
    └── PublicLayout/
```

### 2.2 State Management Optimization

**Current State**: Mixed Context API and TanStack Query usage

**Refactoring Strategy**:

```typescript
// src/store/index.ts - Centralized state management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    // UI State
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    
    // User State
    user: User | null;
    permissions: Permission[];
    
    // Actions
    setSidebarOpen: (open: boolean) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    setUser: (user: User | null) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            sidebarOpen: true,
            theme: 'light',
            user: null,
            permissions: [],
            
            setSidebarOpen: (open) => set({ sidebarOpen: open }),
            setTheme: (theme) => set({ theme }),
            setUser: (user) => set({ user })
        }),
        { name: 'topsmile-app-state' }
    )
);
```

**Action Items**:
1. Migrate global state from Context to Zustand
2. Keep TanStack Query for server state
3. Create domain-specific stores (clinical, scheduling, patient)
4. Implement optimistic updates for better UX

### 2.3 API Service Consolidation

**Current State**: Multiple service files with duplicate logic

**Refactoring Strategy**:

```typescript
// src/services/api/BaseApiService.ts
export class BaseApiService<T> {
    constructor(private endpoint: string) {}

    async getAll(params?: Record<string, any>): Promise<T[]> {
        const response = await http.get(this.endpoint, { params });
        return response.data;
    }

    async getById(id: string): Promise<T> {
        const response = await http.get(`${this.endpoint}/${id}`);
        return response.data;
    }

    async create(data: Partial<T>): Promise<T> {
        const response = await http.post(this.endpoint, data);
        return response.data;
    }

    async update(id: string, data: Partial<T>): Promise<T> {
        const response = await http.put(`${this.endpoint}/${id}`, data);
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await http.delete(`${this.endpoint}/${id}`);
    }
}

// Usage
export const dentalChartService = new BaseApiService<DentalChart>('/api/dental-charts');
export const treatmentPlanService = new BaseApiService<TreatmentPlan>('/api/treatment-plans');
```

**Action Items**:
1. Create `BaseApiService` with common CRUD operations
2. Consolidate error handling in HTTP interceptors
3. Implement request/response transformers
4. Add retry logic for failed requests

---

## 3. Database Optimization

### 3.1 Index Audit and Optimization

**Current State**: 50+ indexes across 22 models

**Action Items**:

1. **Analyze index usage**:
```javascript
// Run in MongoDB shell
db.appointments.aggregate([
    { $indexStats: {} }
]).forEach(stat => {
    print(`Index: ${stat.name}, Ops: ${stat.accesses.ops}`);
});
```

2. **Remove unused indexes**:
   - Indexes with 0 operations after 30 days
   - Redundant single-field indexes

3. **Add missing compound indexes**:
```typescript
// Example: Appointment queries
AppointmentSchema.index({ 
    clinicId: 1, 
    scheduledStart: 1, 
    status: 1 
}, { 
    name: 'clinic_schedule_status',
    background: true 
});
```

4. **Optimize existing indexes**:
   - Reorder compound index fields by selectivity
   - Add partial filters for conditional queries
   - Use sparse indexes for optional fields

### 3.2 Query Optimization

**Current Issues**:
- N+1 query problems in populated fields
- Missing pagination in large datasets
- Inefficient aggregation pipelines

**Action Items**:

1. **Implement query result caching**:
```typescript
// backend/src/utils/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function cacheQuery<T>(
    key: string,
    queryFn: () => Promise<T>,
    ttl = 300 // 5 minutes
): Promise<T> {
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);

    const result = await queryFn();
    await redis.setex(key, ttl, JSON.stringify(result));
    return result;
}
```

2. **Optimize population**:
```typescript
// Before: Multiple queries
const appointments = await Appointment.find({ clinicId })
    .populate('patient')
    .populate('provider')
    .populate('appointmentType');

// After: Single aggregation
const appointments = await Appointment.aggregate([
    { $match: { clinicId: new ObjectId(clinicId) } },
    { $lookup: { from: 'patients', localField: 'patient', foreignField: '_id', as: 'patient' } },
    { $lookup: { from: 'providers', localField: 'provider', foreignField: '_id', as: 'provider' } },
    { $unwind: '$patient' },
    { $unwind: '$provider' }
]);
```

3. **Add pagination everywhere**:
```typescript
// Standardized pagination helper
export async function paginateQuery<T>(
    model: Model<T>,
    filter: FilterQuery<T>,
    page = 1,
    limit = 20
) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        model.find(filter).skip(skip).limit(limit).lean(),
        model.countDocuments(filter)
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
}
```

---

## 4. Code Quality Improvements

### 4.1 TypeScript Strict Mode

**Current State**: TypeScript with loose configuration

**Action Items**:

1. **Enable strict mode**:
```json
// tsconfig.json
{
    "compilerOptions": {
        "strict": true,
        "noImplicitAny": true,
        "strictNullChecks": true,
        "strictFunctionTypes": true,
        "strictBindCallApply": true,
        "strictPropertyInitialization": true,
        "noImplicitThis": true,
        "alwaysStrict": true
    }
}
```

2. **Fix type errors incrementally**:
   - Start with utility functions
   - Move to services
   - Then routes and controllers
   - Finally components

3. **Remove `any` types**:
```typescript
// Before
function processData(data: any) { ... }

// After
interface ProcessableData {
    id: string;
    value: number;
}
function processData(data: ProcessableData) { ... }
```

### 4.2 Error Handling Standardization

**Current State**: Inconsistent error handling patterns

**Refactoring Strategy**:

```typescript
// backend/src/utils/errors.ts
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
```

**Action Items**:
1. Create custom error classes
2. Implement global error handler
3. Standardize error responses
4. Add error logging with context

### 4.3 Testing Infrastructure

**Current State**: Minimal test coverage

**Action Items**:

1. **Set up test infrastructure**:
```typescript
// backend/tests/helpers/testSetup.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

export async function setupTestDB() {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
}

export async function teardownTestDB() {
    await mongoose.disconnect();
    await mongoServer.stop();
}

export async function clearTestDB() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
}
```

2. **Create test factories**:
```typescript
// backend/tests/factories/appointment.factory.ts
import { faker } from '@faker-js/faker';

export const createAppointment = (overrides = {}) => ({
    patient: faker.database.mongodbObjectId(),
    provider: faker.database.mongodbObjectId(),
    clinicId: faker.database.mongodbObjectId(),
    scheduledStart: faker.date.future(),
    scheduledEnd: faker.date.future(),
    status: 'scheduled',
    ...overrides
});
```

3. **Implement test coverage goals**:
   - Services: 80% coverage
   - Routes: 70% coverage
   - Models: 60% coverage
   - Components: 70% coverage

---

## 5. Performance Optimization

### 5.1 Backend Performance

**Action Items**:

1. **Implement caching strategy**:
```typescript
// Cache frequently accessed data
const CACHE_TTL = {
    PROVIDERS: 3600,      // 1 hour
    APPOINTMENT_TYPES: 3600,
    CLINIC_SETTINGS: 1800, // 30 minutes
    USER_PERMISSIONS: 900  // 15 minutes
};
```

2. **Add database connection pooling**:
```typescript
// backend/src/config/database.ts
mongoose.connect(process.env.DATABASE_URL, {
    maxPoolSize: 10,
    minPoolSize: 2,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 5000
});
```

3. **Implement request batching**:
```typescript
// Batch multiple requests into single database query
export async function batchLoadPatients(ids: string[]) {
    const patients = await Patient.find({ _id: { $in: ids } }).lean();
    return ids.map(id => patients.find(p => p._id.toString() === id));
}
```

### 5.2 Frontend Performance

**Action Items**:

1. **Implement code splitting**:
```typescript
// src/App.tsx
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const Calendar = lazy(() => import('./pages/Calendar'));
const PatientPortal = lazy(() => import('./pages/Patient/Portal'));
```

2. **Optimize bundle size**:
   - Remove unused dependencies
   - Use tree-shaking
   - Implement dynamic imports

3. **Add performance monitoring**:
```typescript
// src/utils/performance.ts
export function measurePerformance(name: string, fn: () => void) {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`${name}: ${end - start}ms`);
}
```

---

## 6. Documentation Updates

### 6.1 API Documentation

**Action Items**:
1. Update Swagger documentation for all endpoints
2. Add request/response examples
3. Document error codes and meanings
4. Create Postman collection

### 6.2 Code Documentation

**Action Items**:
1. Add JSDoc comments to all public APIs
2. Document complex business logic
3. Create architecture decision records (ADRs)
4. Update README with new structure

---

## 7. Implementation Timeline

### Week 1-2: Backend Refactoring
- [ ] Route consolidation
- [ ] Service layer refactoring
- [ ] Model optimization
- [ ] Middleware consolidation

### Week 3-4: Frontend Refactoring
- [ ] Component architecture
- [ ] State management optimization
- [ ] API service consolidation
- [ ] Performance optimization

### Week 5: Database & Testing
- [ ] Index optimization
- [ ] Query optimization
- [ ] Test infrastructure setup
- [ ] Initial test coverage

### Week 6: Quality & Documentation
- [ ] TypeScript strict mode
- [ ] Error handling standardization
- [ ] Documentation updates
- [ ] Code review and cleanup

---

## 8. Success Metrics

### Performance Metrics
- [ ] API response time < 200ms (p95)
- [ ] Database query time < 50ms (p95)
- [ ] Frontend bundle size < 500KB (gzipped)
- [ ] Lighthouse score > 90

### Code Quality Metrics
- [ ] Test coverage > 70%
- [ ] TypeScript strict mode enabled
- [ ] Zero ESLint errors
- [ ] Code duplication < 5%

### Maintainability Metrics
- [ ] Average file size < 300 lines
- [ ] Cyclomatic complexity < 10
- [ ] Documentation coverage > 80%
- [ ] Technical debt ratio < 5%

---

## 9. Risk Mitigation

### Risks
1. **Breaking changes** - Refactoring may introduce bugs
2. **Timeline overrun** - Scope may expand during refactoring
3. **Team disruption** - Ongoing feature development may be blocked

### Mitigation Strategies
1. **Incremental refactoring** - Refactor one module at a time
2. **Comprehensive testing** - Add tests before refactoring
3. **Feature flags** - Use flags to enable/disable refactored code
4. **Code reviews** - Mandatory reviews for all refactoring PRs
5. **Rollback plan** - Maintain ability to revert changes

---

## 10. Next Steps

1. **Review and approve** this refactoring plan
2. **Create GitHub issues** for each refactoring task
3. **Assign priorities** to refactoring tasks
4. **Set up feature branch** for refactoring work
5. **Begin Week 1 tasks** with backend route consolidation

---

## Appendix A: File Structure After Refactoring

```
topsmile/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/        # NEW: Separate controllers from routes
│   │   ├── middleware/
│   │   ├── models/
│   │   │   ├── base/          # NEW: Base classes and mixins
│   │   │   └── validators/    # NEW: Shared validators
│   │   ├── routes/
│   │   │   ├── clinical/      # NEW: Grouped routes
│   │   │   ├── scheduling/
│   │   │   ├── patient/
│   │   │   ├── security/
│   │   │   └── index.ts       # NEW: Route registry
│   │   ├── services/
│   │   │   ├── base/          # NEW: Base service class
│   │   │   └── ...
│   │   ├── utils/
│   │   │   ├── cache.ts       # NEW: Caching utilities
│   │   │   ├── errors.ts      # NEW: Custom error classes
│   │   │   └── pagination.ts  # NEW: Pagination helper
│   │   └── validation/        # NEW: Centralized validation
│   │       └── schemas/
│   └── tests/
│       ├── factories/         # NEW: Test data factories
│       └── helpers/           # NEW: Test utilities
│
├── src/
│   ├── components/
│   │   ├── common/            # Renamed from UI
│   │   ├── features/          # NEW: Feature-specific components
│   │   └── layouts/           # NEW: Page layouts
│   ├── hooks/
│   │   ├── clinical/          # NEW: Domain-specific hooks
│   │   ├── scheduling/
│   │   └── patient/
│   ├── services/
│   │   └── api/
│   │       ├── BaseApiService.ts  # NEW: Base API service
│   │       └── ...
│   ├── store/                 # NEW: Zustand stores
│   └── utils/
│
└── packages/
    └── types/
        └── src/
            ├── models/        # NEW: Organized by domain
            ├── dtos/          # NEW: Data transfer objects
            └── api/           # NEW: API types
```

---

## Appendix B: Refactoring Checklist

### Backend
- [ ] Consolidate routes into domain groups
- [ ] Create BaseService class
- [ ] Refactor all services to extend BaseService
- [ ] Extract validation schemas
- [ ] Optimize database indexes
- [ ] Implement caching layer
- [ ] Add transaction management
- [ ] Standardize error handling
- [ ] Create custom error classes
- [ ] Add comprehensive logging

### Frontend
- [ ] Create FormBuilder component
- [ ] Extract business logic to hooks
- [ ] Consolidate component structure
- [ ] Migrate to Zustand for global state
- [ ] Create BaseApiService
- [ ] Implement code splitting
- [ ] Optimize bundle size
- [ ] Add performance monitoring
- [ ] Standardize error handling
- [ ] Create loading states

### Testing
- [ ] Set up test infrastructure
- [ ] Create test factories
- [ ] Add unit tests for services
- [ ] Add integration tests for routes
- [ ] Add component tests
- [ ] Achieve 70% code coverage
- [ ] Set up CI/CD pipeline
- [ ] Add E2E tests for critical flows

### Documentation
- [ ] Update API documentation
- [ ] Add JSDoc comments
- [ ] Create architecture diagrams
- [ ] Update README
- [ ] Create migration guide
- [ ] Document breaking changes
- [ ] Create developer onboarding guide
- [ ] Update deployment guide
