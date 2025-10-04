# TopSmile - Development Guidelines

## Code Quality Standards

### File Headers and Comments
- Include file path in header comments: `// backend/src/routes/providers.ts`
- Use JSDoc comments for API documentation with Swagger annotations
- Portuguese language for user-facing messages and error strings
- English for code, variables, and technical documentation

### Naming Conventions
- **Variables/Functions**: camelCase (e.g., `createProviderValidation`, `scheduledStart`)
- **Types/Interfaces**: PascalCase (e.g., `IAppointment`, `TimeSlot`, `AvailabilityQuery`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `TEST_CREDENTIALS`, `ADMIN_EMAIL`)
- **Files**: camelCase for services/utilities, PascalCase for models/components
- **Database Fields**: camelCase (e.g., `scheduledStart`, `patientId`, `clinicId`)
- **Enum Values**: UPPER_SNAKE_CASE (e.g., `AppointmentStatus.SCHEDULED`)

### Code Formatting
- **Indentation**: 4 spaces (backend), 2 spaces (frontend)
- **Line Length**: Keep reasonable, break long validation chains
- **Semicolons**: Always use semicolons
- **Quotes**: Single quotes for strings
- **Trailing Commas**: Use in multi-line objects/arrays

### Error Handling
- Always use try-catch blocks in async functions
- Return structured error responses: `{ success: boolean, error?: string, data?: T }`
- Log errors with `console.error()` before returning
- Portuguese error messages for user-facing errors
- Include context in error messages (e.g., provider ID, appointment ID)

## Backend Patterns

### Route Structure
```typescript
// 1. Import dependencies
import express, { Request, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth';
import { body, query, validationResult } from 'express-validator';

// 2. Create router
const router: express.Router = express.Router();

// 3. Apply global middleware
router.use(authenticate);

// 4. Define validation rules as constants
const createValidation = [
    body('field').trim().isLength({ min: 2 }).withMessage('Mensagem em português')
];

// 5. Define routes with Swagger documentation
/**
 * @swagger
 * /api/resource:
 *   post:
 *     summary: Descrição em português
 */
router.post('/', authorize('admin'), createValidation, async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    try {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dados inválidos',
                errors: errors.array()
            });
        }
        
        // Business logic
        const result = await service.method(authReq.body);
        
        // Success response with metadata
        return res.status(201).json({
            success: true,
            message: 'Operação realizada com sucesso',
            data: result,
            meta: {
                timestamp: new Date().toISOString(),
                requestId: (authReq as any).requestId
            }
        });
    } catch (error: any) {
        console.error('Error description:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro genérico'
        });
    }
});

// 6. Export router
export default router;
```

### Mongoose Models
```typescript
// 1. Import dependencies
import mongoose, { Document, Schema, Types } from 'mongoose';
import { ModelType } from '@topsmile/types';

// 2. Define schema with comprehensive validation
const ModelSchema = new Schema<ModelType & Document>({
    field: {
        type: String,
        required: [true, 'Mensagem em português'],
        index: true,
        maxlength: [100, 'Mensagem de validação']
    },
    reference: {
        type: Schema.Types.ObjectId,
        ref: 'OtherModel',
        required: true,
        index: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret: any) {
            ret.id = ret._id;
            delete ret['_id'];
            delete ret['__v'];
            return ret;
        }
    }
});

// 3. Create compound indexes for performance
ModelSchema.index({ 
    field1: 1, 
    field2: 1, 
    field3: 1 
}, { 
    name: 'descriptive_index_name',
    background: true
});

// 4. Add pre-save middleware for validation/calculations
ModelSchema.pre('save', function(next) {
    // Validation logic
    if (this.startDate >= this.endDate) {
        return next(new Error('Mensagem de erro em português'));
    }
    
    // Calculations
    if (this.isModified('status')) {
        // Status-specific logic
    }
    
    next();
});

// 5. Add static methods for complex queries
ModelSchema.statics.customQuery = function(params) {
    return this.aggregate([
        { $match: { field: params.value } },
        { $lookup: { from: 'collection', localField: 'field', foreignField: '_id', as: 'joined' } },
        { $unwind: { path: '$joined', preserveNullAndEmptyArrays: true } }
    ]);
};

// 6. Export model
export const Model = mongoose.model<ModelType & Document>('Model', ModelSchema);
```

### Service Layer
```typescript
// 1. Define interfaces for type safety
export interface ServiceResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    warnings?: string[];
}

// 2. Create service class
class ServiceName {
    /**
     * Method with comprehensive error handling
     */
    async methodName(params: ParamsType): Promise<ServiceResult<ReturnType>> {
        // Skip transactions in test environment
        const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID;
        const session = isTestEnv ? null : await mongoose.startSession();
        
        try {
            if (!isTestEnv) {
                session!.startTransaction();
            }
            
            // Validate inputs
            if (!params.required) {
                throw new Error('Dados obrigatórios não fornecidos');
            }
            
            // Business logic with session support
            const result = await Model.findById(params.id)
                .session(session || undefined);
            
            if (!isTestEnv) {
                await session!.commitTransaction();
            }
            
            return { success: true, data: result };
            
        } catch (error) {
            if (!isTestEnv && session) {
                await session.abortTransaction();
            }
            console.error('Error in methodName:', error);
            
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Erro desconhecido'
            };
        } finally {
            if (!isTestEnv && session) {
                session.endSession();
            }
        }
    }
    
    /**
     * Private helper methods with lean queries for performance
     */
    private async helperMethod(id: string): Promise<Type[]> {
        return await Model.find({ field: id }).lean();
    }
}

// 3. Export singleton instance
export const serviceName = new ServiceName();
```

### Validation Patterns
- Use express-validator for input validation
- Define validation rules as constants before routes
- Portuguese validation messages
- Comprehensive validation: type, length, format, enum values
- Custom validators for complex logic
- Sanitization: trim(), normalizeEmail(), isMongoId()

## Frontend Patterns

### Test Structure
```typescript
// 1. Mock dependencies at top
const mockDependency = {
    method: jest.fn()
};

jest.mock('module', () => ({
    export: jest.fn(() => Promise.resolve(mockDependency))
}));

// 2. Setup test utilities
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        clear: () => { store = {}; }
    };
})();

// 3. Describe test suite
describe('ServiceName', () => {
    beforeEach(() => {
        mockDependency.method.mockClear();
        localStorageMock.clear();
        jest.clearAllTimers();
        jest.useFakeTimers();
    });
    
    afterEach(() => {
        jest.useRealTimers();
    });
    
    // 4. Group related tests
    describe('methodName', () => {
        it('should handle success case', async () => {
            // Arrange
            mockDependency.method.mockResolvedValueOnce({ success: true });
            
            // Act
            const result = await service.method();
            
            // Assert
            expect(result.success).toBe(true);
            expect(mockDependency.method).toHaveBeenCalledWith(
                expect.objectContaining({ field: 'value' })
            );
        });
        
        it('should handle error case', async () => {
            // Arrange
            mockDependency.method.mockRejectedValueOnce(new Error('Error'));
            
            // Act
            const result = await service.method();
            
            // Assert
            expect(result.success).toBe(false);
            expect(result.error).toBe('Error');
        });
    });
});
```

### Mock Data Generation
```typescript
// Use @faker-js/faker for realistic test data
import { faker } from '@faker-js/faker';

export const generateMockEntity = (overrides = {}) => ({
    _id: faker.database.mongodbObjectId(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
    status: faker.helpers.arrayElement(['active', 'inactive']),
    createdAt: faker.date.past().toISOString(),
    ...overrides
});

// Brazilian-specific generators
export const generateBrazilianPhone = () => faker.helpers.replaceSymbols('(##) #####-####');
export const generateBrazilianCPF = () => faker.helpers.replaceSymbols('###.###.###-##');
```

## Database Patterns

### Indexing Strategy
1. **Primary Queries**: Index fields used in WHERE clauses
2. **Compound Indexes**: Order by selectivity (most selective first)
3. **Sorting**: Include sort fields in indexes
4. **Unique Constraints**: Use partial filters for soft deletes
5. **Background Creation**: Always use `background: true` for production

### Common Index Patterns
```typescript
// Time-range queries
Schema.index({ clinic: 1, scheduledStart: 1, status: 1 });

// Availability checks
Schema.index({ provider: 1, scheduledStart: 1, scheduledEnd: 1, status: 1 });

// Prevent duplicates with partial filter
Schema.index(
    { provider: 1, scheduledStart: 1 },
    { 
        unique: true,
        partialFilterExpression: { status: { $nin: ['cancelled'] } }
    }
);
```

### Query Optimization
- Use `.lean()` for read-only queries (better performance)
- Use `.select()` to limit returned fields
- Populate only necessary fields: `.populate('field', 'name email')`
- Use aggregation for complex queries with joins
- Batch operations when possible

## API Response Patterns

### Success Response
```typescript
{
    success: true,
    data: result,
    message?: 'Mensagem de sucesso',
    meta: {
        timestamp: new Date().toISOString(),
        requestId: requestId
    }
}
```

### Error Response
```typescript
{
    success: false,
    message: 'Mensagem de erro em português',
    errors?: validationErrors,
    error?: errorDetails
}
```

### Paginated Response
```typescript
{
    success: true,
    data: {
        items: results,
        total: totalCount,
        page: currentPage,
        totalPages: totalPages,
        hasNext: hasNextPage,
        hasPrev: hasPreviousPage
    }
}
```

## Security Practices

### Authentication & Authorization
- Always use `authenticate` middleware on protected routes
- Use `authorize(...roles)` for role-based access
- Cast request to `AuthenticatedRequest` to access user data
- Validate `clinicId` from authenticated user, not request body
- Check resource ownership before operations

### Input Validation
- Validate all user inputs with express-validator
- Sanitize inputs: trim, normalizeEmail, escape HTML
- Use MongoDB sanitization: express-mongo-sanitize
- Validate ObjectIds with `isMongoId()`
- Whitelist allowed values with `isIn([])`

### Data Protection
- Never expose sensitive fields in responses
- Use `toJSON` transform to remove `_id`, `__v`, passwords
- Implement field-level access control
- Hash passwords with bcrypt
- Use JWT for stateless authentication

## Performance Best Practices

### Database
- Create indexes for all query patterns
- Use lean queries for read operations
- Implement pagination for large datasets
- Use aggregation for complex analytics
- Cache frequently accessed data with Redis

### API
- Implement rate limiting
- Use compression middleware
- Optimize payload sizes
- Implement request timeouts
- Use connection pooling

### Code
- Avoid N+1 queries with proper population
- Use Promise.all for parallel operations
- Implement exponential backoff for retries
- Clean up resources in finally blocks
- Use transactions for multi-document operations

## Testing Standards

### Test Coverage
- Unit tests for services and utilities
- Integration tests for API endpoints
- E2E tests for critical user flows
- Mock external dependencies (Stripe, email)
- Use in-memory MongoDB for tests

### Test Patterns
- Arrange-Act-Assert structure
- Clear test descriptions in Portuguese or English
- Mock timers for time-dependent tests
- Clean up state in beforeEach/afterEach
- Test both success and error cases
- Test edge cases and boundary conditions

## Documentation Standards

### Code Comments
- JSDoc for public APIs and complex functions
- Inline comments for non-obvious logic
- TODO comments with context and assignee
- Swagger annotations for API endpoints
- Portuguese for user-facing documentation

### API Documentation
- Use Swagger/OpenAPI annotations
- Document all parameters and responses
- Include example requests/responses
- Document error codes and meanings
- Keep documentation in sync with code

## Type Safety

### TypeScript Usage
- Use strict mode
- Define interfaces for all data structures
- Use type imports: `import type { Type } from 'module'`
- Avoid `any` - use `unknown` or proper types
- Use generics for reusable components
- Define result types for service methods

### Shared Types
- Store common types in `@topsmile/types` package
- Import types from shared package
- Keep frontend and backend types in sync
- Use enums for fixed value sets
- Document complex types with comments
