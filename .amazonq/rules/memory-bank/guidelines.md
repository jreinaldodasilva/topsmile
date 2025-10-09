# TopSmile - Development Guidelines

## Code Quality Standards

### Formatting and Structure
- **Indentation**: 4 spaces (consistent across all files)
- **Line Length**: Keep lines reasonable, break long chains for readability
- **File Headers**: Include descriptive comments at the top of files indicating purpose and location
- **Whitespace**: Use blank lines to separate logical sections within functions and classes

### Naming Conventions
- **Variables/Functions**: camelCase (e.g., `appointmentType`, `getAvailableSlots`)
- **Types/Interfaces/Classes**: PascalCase (e.g., `IAppointment`, `SchedulingService`)
- **Constants**: UPPER_SNAKE_CASE for exported constants (e.g., `CONSTANTS.APPOINTMENT.MIN_DURATION`)
- **Private Methods**: Prefix with underscore or use TypeScript private keyword (e.g., `private parseTimeToDate`)
- **Boolean Variables**: Use descriptive prefixes like `is`, `has`, `should` (e.g., `isActive`, `hasConflict`, `allowOnlineBooking`)

### Import Organization
Imports are grouped in the following order:
1. External packages (Express, Mongoose, date-fns, etc.)
2. Internal modules (middleware, services, models)
3. Type imports from @topsmile/types
4. Relative imports

Example:
```typescript
import express, { Request, Response } from 'express';
import { authenticate, authorize } from '../../middleware/auth/auth';
import { appointmentTypeService } from '../../services/scheduling/appointmentTypeService';
import { body, validationResult } from 'express-validator';
import type { Appointment, AppointmentType } from '@topsmile/types';
```

### User-Facing Messages
- **Language**: All user-facing messages MUST be in Portuguese (Brazil)
- **Error Messages**: Clear, actionable, and user-friendly
- **Success Messages**: Confirm the action taken
- **Validation Messages**: Specific about what's wrong and how to fix it

Examples:
```typescript
'Dados inválidos'
'Tipo de agendamento criado com sucesso'
'Nome deve ter entre 2 e 100 caracteres'
'Clínica não identificada'
```

## TypeScript Standards

### Type Safety
- **Explicit Types**: Use explicit types for function parameters and return values
- **Avoid `any`**: Only use `any` when absolutely necessary, document why
- **Type Imports**: Use `import type` for type-only imports
- **Shared Types**: Import domain types from `@topsmile/types` package
- **Interface Extensions**: Extend Document for Mongoose models

Example:
```typescript
async getAvailableSlots(query: AvailabilityQuery): Promise<TimeSlot[]> {
    // Implementation
}
```

### Type Definitions
- Define result interfaces for better type safety:
```typescript
export interface SchedulingResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    warnings?: string[];
}
```

- Use discriminated unions for query types:
```typescript
interface AppointmentMatchStage {
    clinic: Types.ObjectId;
    scheduledStart: { $gte: Date };
    status?: string | { $nin: string[] };
}
```

## Backend Architecture Patterns

### Route Structure
Routes follow a consistent pattern:
1. Import dependencies
2. Create router instance
3. Apply global middleware (authentication)
4. Define validation rules as constants
5. Define route handlers with Swagger documentation
6. Export router

Example:
```typescript
const router: express.Router = express.Router();
router.use(authenticate);

const createValidation = [
    body('name').trim().isLength({ min: 2, max: 100 }),
    // ... more validations
];

router.post('/', authorize('admin'), createValidation, async (req, res) => {
    // Handler implementation
});

export default router;
```

### Request Handling Pattern
Every route handler follows this structure:
1. Cast request to AuthenticatedRequest
2. Validate input with express-validator
3. Check clinic context
4. Call service layer
5. Return standardized response with metadata

Example:
```typescript
const authReq = req as AuthenticatedRequest;
try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors: errors.array()
        });
    }

    if (!authReq.user?.clinicId) {
        return res.status(400).json({
            success: false,
            message: 'Clínica não identificada'
        });
    }

    const result = await service.operation(data);

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
    console.error('Error:', error);
    return res.status(400).json({
        success: false,
        message: error.message || 'Erro ao processar requisição'
    });
}
```

### Service Layer Patterns

#### Transaction Handling
Services use transactions for data consistency, with test environment detection:
```typescript
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID;
const session = isTestEnv ? null : await mongoose.startSession();

try {
    if (!isTestEnv) {
        session!.startTransaction();
    }
    
    // Perform operations with session
    const result = await Model.operation().session(session);
    
    if (!isTestEnv) {
        await session!.commitTransaction();
    }
    
    return { success: true, data: result };
} catch (error) {
    if (!isTestEnv && session) {
        await session.abortTransaction();
    }
    return { success: false, error: error.message };
} finally {
    if (!isTestEnv && session) {
        session.endSession();
    }
}
```

#### Result Pattern
Services return structured results instead of throwing errors:
```typescript
export interface SchedulingResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    warnings?: string[];
}
```

#### Performance Optimization
- Use `.lean()` for read-only queries
- Process operations in parallel with `Promise.all()` when possible
- Implement safety limits (e.g., `maxSlots = 200`)
- Use efficient database queries with proper indexes

Example:
```typescript
const providerSlotsPromises = providers.map(provider =>
    this.getProviderAvailableSlots(provider, appointmentType, targetDate)
);
const providerSlotsResults = await Promise.all(providerSlotsPromises);
```

### Error Handling
- Use try-catch blocks for all async operations
- Log errors with `console.error()` including context
- Return user-friendly Portuguese error messages
- Include error details in development, sanitize in production

Example:
```typescript
try {
    // Operation
} catch (error) {
    console.error('Error creating appointment:', error);
    return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao criar agendamento'
    };
}
```

## Validation Patterns

### express-validator Usage
Validation rules are defined as arrays of validators:
```typescript
const createValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres'),
    
    body('duration')
        .isInt({ min: 15, max: 480 })
        .withMessage('Duração deve ser entre 15 minutos e 8 horas'),
    
    body('color')
        .matches(/^#[0-9A-F]{6}$/i)
        .withMessage('Cor deve estar no formato hexadecimal (#RRGGBB)')
];
```

### Reusable Validators
Common validations are centralized in `validation/common.ts`:
```typescript
export const mongoIdParam = (field: string = 'id') =>
    param(field).isMongoId().withMessage(`${field} inválido`);

export const emailValidation = (field: string = 'email', required: boolean = true) => {
    const validator = body(field)
        .trim()
        .toLowerCase()
        .isEmail()
        .withMessage('E-mail inválido');
    return required ? validator.notEmpty() : validator.optional();
};
```

### Validation Execution
Always check validation results before processing:
```typescript
const errors = validationResult(req);
if (!errors.isEmpty()) {
    return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
    });
}
```

## Database Patterns

### Model Definition
Models use mixins and base schemas for consistency:
```typescript
import { baseSchemaFields, baseSchemaOptions } from './base/baseSchema';
import { clinicScopedFields, auditableFields } from './mixins';

const Schema = new Schema<IModel & Document>({
    ...baseSchemaFields,
    ...clinicScopedFields,
    ...auditableFields,
    // Model-specific fields
}, baseSchemaOptions as any);
```

### Indexing Strategy
Indexes are created for common query patterns:
```typescript
// Primary queries - most important
Schema.index({ clinic: 1, scheduledStart: 1, status: 1 }, { 
    name: 'clinic_schedule_status',
    background: true 
});

// Prevent duplicates with partial filter
Schema.index(
    { provider: 1, scheduledStart: 1, scheduledEnd: 1 },
    {
        unique: true,
        partialFilterExpression: { status: { $nin: ['cancelled', 'no_show'] } }
    }
);
```

### Pre-save Middleware
Use pre-save hooks for automatic field updates:
```typescript
Schema.pre('save', function(this: any, next) {
    // Validation
    if (this.scheduledStart >= this.scheduledEnd) {
        return next(new Error('Hora de início deve ser anterior à hora de término'));
    }
    
    // Auto-calculations
    if (this.actualStart && this.actualEnd) {
        this.duration = Math.round((this.actualEnd.getTime() - this.actualStart.getTime()) / (1000 * 60));
    }
    
    // Status-based updates
    if (this.isModified('status')) {
        switch (this.status) {
            case 'completed':
                if (!this.completedAt) this.completedAt = new Date();
                break;
        }
    }
    
    next();
});
```

### Static Methods
Define reusable query methods as statics:
```typescript
Schema.statics.findByTimeRange = function(
    clinicId: string, 
    startDate: Date, 
    endDate: Date, 
    options = {}
) {
    return this.aggregate([
        { $match: { clinic: new Types.ObjectId(clinicId) } },
        { $lookup: { from: 'patients', localField: 'patient', foreignField: '_id', as: 'patientInfo' } },
        { $sort: { scheduledStart: 1 } }
    ]);
};
```

## Constants and Configuration

### Centralized Constants
All magic numbers and strings are defined in `config/constants.ts`:
```typescript
export const CONSTANTS = {
    APPOINTMENT: {
        MIN_DURATION: 15,
        MAX_DURATION: 480,
        SLOT_INTERVAL: 15,
    },
    VALIDATION: {
        NAME_MIN_LENGTH: 2,
        NAME_MAX_LENGTH: 100,
    },
    ERRORS: {
        UNAUTHORIZED: 'Não autorizado',
        NOT_FOUND: 'Não encontrado',
    }
} as const;
```

### Helper Functions
Provide utility functions alongside constants:
```typescript
export const isValidEmail = (email: string): boolean => {
    return CONSTANTS.REGEX.EMAIL.test(email) && 
           email.length <= CONSTANTS.VALIDATION.EMAIL_MAX_LENGTH;
};

export const formatBrazilianPhone = (phone: string): string => {
    const cleanPhone = phone.replace(/[^\\d]/g, '');
    if (cleanPhone.length === 11) {
        return `(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 7)}-${cleanPhone.substring(7)}`;
    }
    return phone;
};
```

## API Documentation

### Swagger/OpenAPI
Every route includes comprehensive Swagger documentation:
```typescript
/**
 * @swagger
 * /api/appointment-types:
 *   post:
 *     summary: Criar tipo de agendamento
 *     description: Cria um novo tipo de agendamento na clínica
 *     tags: [Appointment Types]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - duration
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *     responses:
 *       201:
 *         description: Tipo de agendamento criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
```

## Response Format Standards

### Success Response
```typescript
{
    success: true,
    message: 'Operação realizada com sucesso',
    data: { /* result data */ },
    meta: {
        timestamp: '2024-01-01T12:00:00.000Z',
        requestId: 'req-123'
    }
}
```

### Error Response
```typescript
{
    success: false,
    message: 'Erro ao processar requisição',
    errors: [/* validation errors if applicable */]
}
```

### Paginated Response
```typescript
{
    success: true,
    data: {
        items: [/* array of results */],
        pagination: {
            page: 1,
            limit: 20,
            total: 100,
            pages: 5
        }
    }
}
```

## Security Best Practices

### Authentication Middleware
- Apply `authenticate` middleware to all protected routes
- Use `authorize(...roles)` for role-based access control
- Always validate `clinicId` from authenticated user

Example:
```typescript
router.use(authenticate);
router.post('/', authorize('super_admin', 'admin', 'manager'), validation, handler);
```

### Input Sanitization
- Use `.trim()` on all string inputs
- Use `.toLowerCase()` for emails
- Validate all inputs with express-validator
- Use regex patterns for format validation

### Clinic Isolation
Always scope queries by clinic to ensure multi-tenancy:
```typescript
if (!authReq.user?.clinicId) {
    return res.status(400).json({
        success: false,
        message: 'Clínica não identificada'
    });
}

const query = {
    clinic: authReq.user.clinicId,
    // ... other filters
};
```

## Testing Patterns

### Test Environment Detection
Services detect test environment to skip transactions:
```typescript
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID;
```

### Mock Data
Use consistent test data patterns with proper types and realistic values.

## Code Comments

### When to Comment
- Complex business logic that isn't immediately obvious
- Workarounds or non-standard solutions
- Important performance considerations
- Security-critical sections

### Comment Style
```typescript
// IMPROVED: Better error handling and performance
// FIXED: Transaction handling for data consistency
// CRITICAL: Check availability within transaction to prevent race conditions
// NEW: Advanced features
// ADDED: Additional operations within transaction
```

## Performance Considerations

### Database Queries
- Use `.lean()` for read-only operations
- Implement proper indexes for common queries
- Use aggregation pipelines for complex queries
- Limit result sets with safety maximums

### Async Operations
- Use `Promise.all()` for parallel operations
- Avoid sequential awaits when operations are independent
- Implement timeouts for external service calls

### Caching
- Cache frequently accessed, rarely changing data
- Use Redis for session and token management
- Implement TTL-based cache invalidation

## Common Patterns Summary

1. **Route Handler**: authenticate → validate → check clinic → call service → return response
2. **Service Method**: start transaction → validate → perform operations → commit/rollback → return result
3. **Validation**: define rules array → apply to route → check results → return errors
4. **Error Handling**: try-catch → log error → return user-friendly message
5. **Response Format**: success/error flag → message → data → metadata
6. **Type Safety**: explicit types → shared types from @topsmile/types → avoid any
7. **Portuguese Messages**: all user-facing text in Portuguese (Brazil)
8. **Multi-tenancy**: always scope by clinicId from authenticated user
