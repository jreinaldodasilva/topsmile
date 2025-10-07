# TopSmile - Development Guidelines

## Code Quality Standards

### File Organization
- **Header Comments**: Include file path in header comments (e.g., `// backend/src/routes/appointmentTypes.ts`)
- **Import Order**: External packages first, then internal modules, then types
- **Type Imports**: Use `import type` for type-only imports from shared packages
- **Export Pattern**: Export singleton instances for services (e.g., `export const emailService = new EmailService()`)

### Naming Conventions
- **Files**: camelCase for TypeScript files (e.g., `appointmentTypes.ts`, `schedulingService.ts`)
- **Classes**: PascalCase (e.g., `EmailService`, `SchedulingService`)
- **Interfaces**: PascalCase with descriptive names (e.g., `TimeSlot`, `AvailabilityQuery`, `CreateAppointmentData`)
- **Constants**: UPPER_SNAKE_CASE for configuration arrays (e.g., `NOTE_TEMPLATES`, `MAX_EMAIL_RETRIES`)
- **Variables**: camelCase with descriptive names (e.g., `appointmentType`, `scheduledStart`, `isProcessingQueue`)
- **Private Methods**: Prefix with `private` keyword, use camelCase (e.g., `private createTransporter()`)
- **Boolean Variables**: Prefix with `is`, `has`, `should` (e.g., `isActive`, `hasConflict`, `allowOnlineBooking`)

### TypeScript Standards
- **Strict Mode**: Use TypeScript strict mode throughout
- **Type Safety**: Explicit return types for all functions and methods
- **Interface Over Type**: Prefer interfaces for object shapes
- **Enums**: Use string literal unions instead of enums (e.g., `'scheduled' | 'confirmed' | 'cancelled'`)
- **Optional Properties**: Use `?` for optional properties in interfaces
- **Type Assertions**: Avoid `any`, use proper typing or `unknown` with type guards
- **Generics**: Use generics for reusable patterns (e.g., `SchedulingResult<T>`, `generateMockApiResponse<T>`)

### Documentation Standards
- **Swagger/JSDoc**: Comprehensive API documentation with Swagger annotations
- **Portuguese Messages**: All user-facing messages in Portuguese (e.g., `'Dados inválidos'`, `'Agendamento não encontrado'`)
- **Comment Style**: Use `//` for single-line comments, `/* */` for multi-line
- **Method Documentation**: Document complex methods with purpose, parameters, and return values
- **IMPROVED/FIXED/ADDED Tags**: Use tags in comments to indicate code improvements (e.g., `// IMPROVED: Better error handling`)

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

// 4. Define validation rules
const createValidation = [
  body('field').trim().isLength({ min: 2, max: 100 })
    .withMessage('Portuguese error message'),
  // ... more validations
];

// 5. Define routes with Swagger documentation
/**
 * @swagger
 * /api/resource:
 *   post:
 *     summary: Portuguese summary
 *     description: Portuguese description
 *     tags: [Resource]
 *     security:
 *       - bearerAuth: []
 */
router.post('/',
  authorize('super_admin', 'admin', 'manager'),
  createValidation,
  async (req: Request, res: Response) => {
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

      // Success response
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
  }
);

// 6. Export router
export default router;
```

### Service Layer Patterns
```typescript
class ServiceName {
  // Private properties with readonly when applicable
  private readonly MAX_RETRIES = 5;
  private isProcessing: boolean = false;

  // Public methods with explicit return types
  async publicMethod(params: ParamsType): Promise<ResultType> {
    try {
      // Validation
      if (!params.required) {
        throw new Error('Portuguese error message');
      }

      // Use lean queries for performance
      const data = await Model.findById(id).lean();
      
      // Business logic
      const result = await this.processData(data);
      
      return result;
    } catch (error) {
      console.error('Error context:', error);
      throw error;
    }
  }

  // Private helper methods
  private async helperMethod(data: DataType): Promise<ProcessedType> {
    // Implementation
  }
}

// Export singleton instance
export const serviceName = new ServiceName();
```

### Transaction Handling Pattern
```typescript
async methodWithTransaction(): Promise<SchedulingResult<T>> {
  // Skip transactions in test environment
  const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID;
  const session = isTestEnv ? null : await mongoose.startSession();

  try {
    if (!isTestEnv) {
      session!.startTransaction();
    }

    // Database operations with session
    const result = await Model.findById(id).session(session);
    
    // More operations...
    
    if (!isTestEnv) {
      await session!.commitTransaction();
    }

    return { success: true, data: result };
  } catch (error) {
    if (!isTestEnv && session) {
      await session.abortTransaction();
    }
    console.error('Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro genérico'
    };
  } finally {
    if (!isTestEnv && session) {
      session.endSession();
    }
  }
}
```

### Error Handling Pattern
```typescript
// Consistent error response structure
try {
  // Operation
} catch (error: any) {
  console.error('Descriptive error context:', error);
  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Fallback Portuguese message'
  });
}

// Service layer error handling
throw new Error('Portuguese error message with context');
```

### Validation Patterns
```typescript
// express-validator for route validation
const validation = [
  body('field')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Portuguese validation message'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('E-mail inválido'),
  
  body('status')
    .isIn(['value1', 'value2', 'value3'])
    .withMessage('Status inválido'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número inteiro maior que 0')
];

// Check validation results
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({
    success: false,
    message: 'Dados inválidos',
    errors: errors.array()
  });
}
```

## Frontend Patterns

### Mock Data Generation
```typescript
// Use faker for realistic test data
export const generateMockEntity = (overrides = {}) => ({
  _id: faker.database.mongodbObjectId(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  // ... more fields
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides // Allow overriding any field
});

// Utility for generating multiple items
export const generateMultiple = <T>(
  generator: (overrides?: any) => T,
  count: number,
  overrides = {}
) => {
  return Array.from({ length: count }, () => generator(overrides));
};

// Brazilian-specific generators
export const generateBrazilianPhone = () => 
  faker.helpers.replaceSymbols('(##) #####-####');
export const generateBrazilianCPF = () => 
  faker.helpers.replaceSymbols('###.###.###-##');
```

### API Response Patterns
```typescript
// Success response
{
  success: true,
  data: result,
  message?: 'Portuguese success message',
  meta?: {
    timestamp: new Date().toISOString(),
    requestId: string
  }
}

// Error response
{
  success: false,
  message: 'Portuguese error message',
  errors?: ValidationError[]
}

// Paginated response
{
  success: true,
  data: {
    items: T[],
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number,
      hasNext: boolean,
      hasPrev: boolean
    }
  }
}
```

## Database Patterns

### Query Optimization
```typescript
// Use lean() for read-only queries
const data = await Model.find(query).lean();

// Use select() to limit fields
const data = await Model.find(query).select('name email').lean();

// Use populate() efficiently
const data = await Model.find(query)
  .populate('relation', 'field1 field2')
  .lean();

// Batch operations with Promise.all
const results = await Promise.all(
  items.map(item => processItem(item))
);
```

### Model Patterns
```typescript
// Consistent field naming
{
  _id: ObjectId,
  clinic: ObjectId, // Reference to clinic
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date,
  // ... entity-specific fields
}

// Working hours pattern
workingHours: {
  monday: { start: '08:00', end: '17:00', isWorking: true },
  tuesday: { start: '08:00', end: '17:00', isWorking: true },
  // ... other days
}

// Address pattern
address: {
  street: string,
  number: string,
  neighborhood: string,
  city: string,
  state: string,
  zipCode: string,
  country?: string
}
```

## Configuration Patterns

### Template Configuration
```typescript
// Export typed configuration arrays
export interface Template {
  id: string;
  name: string;
  type: 'type1' | 'type2' | 'type3';
  // ... template fields
}

export const TEMPLATES: Template[] = [
  {
    id: 'template_id',
    name: 'Portuguese Name',
    type: 'type1',
    // ... fields
  },
  // ... more templates
];

// Export helper functions
export const getTemplateById = (id: string): Template | undefined => {
  return TEMPLATES.find(t => t.id === id);
};

export const getTemplatesByType = (type: string): Template[] => {
  return TEMPLATES.filter(t => t.type === type);
};
```

## Testing Patterns

### Test Data Constants
```typescript
// Centralized test credentials
export const TEST_CREDENTIALS = {
  ADMIN_EMAIL: 'admin@test.com',
  ADMIN_PASSWORD: 'testpassword123'
};

// Test scenario generators
export const createTestScenarios = {
  validLogin: () => ({
    email: TEST_CREDENTIALS.ADMIN_EMAIL,
    password: TEST_CREDENTIALS.ADMIN_PASSWORD
  }),
  
  invalidLogin: () => ({
    email: 'invalid@example.com',
    password: 'wrongpassword'
  })
};
```

## Performance Patterns

### Async Queue Processing
```typescript
class QueueProcessor {
  private queue: Task[] = [];
  private isProcessing: boolean = false;
  private readonly MAX_RETRIES = 5;
  private readonly RETRY_DELAY_MS = 5000;

  async addToQueue(task: Task): Promise<void> {
    this.queue.push(task);
    this.processQueue(); // Trigger processing
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const task = this.queue[0];
      
      // Check retry timing
      if (Date.now() - task.lastAttempt < this.RETRY_DELAY_MS * Math.pow(2, task.retries)) {
        break;
      }

      const success = await this.processTask(task);
      
      if (success) {
        this.queue.shift();
      } else {
        task.retries++;
        task.lastAttempt = Date.now();
        if (task.retries >= this.MAX_RETRIES) {
          console.error(`Task failed after ${this.MAX_RETRIES} retries`);
          this.queue.shift();
        } else {
          this.queue.push(this.queue.shift()!);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.isProcessing = false;

    if (this.queue.length > 0) {
      setTimeout(() => this.processQueue(), this.RETRY_DELAY_MS);
    }
  }
}
```

## Security Patterns

### Authentication & Authorization
```typescript
// Apply authentication to all routes
router.use(authenticate);

// Apply role-based authorization to specific routes
router.post('/',
  authorize('super_admin', 'admin', 'manager'),
  validationRules,
  handler
);

// Access user from authenticated request
const authReq = req as AuthenticatedRequest;
const userId = authReq.user?.id;
const clinicId = authReq.user?.clinicId;
```

### Input Sanitization
```typescript
// Trim and validate all string inputs
body('field')
  .trim()
  .isLength({ min: 2, max: 100 })
  .withMessage('Message')

// Normalize emails
body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('E-mail inválido')

// Validate enums
body('status')
  .isIn(['value1', 'value2'])
  .withMessage('Status inválido')
```

## Common Idioms

### Date Handling
```typescript
// Use date-fns for date manipulation
import { startOfDay, endOfDay, addMinutes, format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// Parse time to date with timezone
const dateInTimeZoneString = formatInTimeZone(
  new Date(dateTimeStr),
  timeZone,
  "yyyy-MM-dd'T'HH:mm:ssXXX"
);
const date = parseISO(dateInTimeZoneString);

// Format dates for display
const formatted = format(date, 'HH:mm');
const dayOfWeek = format(date, 'EEEE').toLowerCase();
```

### Environment Configuration
```typescript
// Check environment
const isProduction = process.env.NODE_ENV === 'production';
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID;

// Use environment variables with fallbacks
const fromEmail = process.env.FROM_EMAIL || 'noreply@topsmile.com';
const adminEmail = process.env.ADMIN_EMAIL || 'contato@topsmile.com';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
```

### Logging
```typescript
// Descriptive console logging
console.log(`Operation completed successfully for ${identifier}`);
console.error('Error context with details:', error);

// Include context in error messages
throw new Error(`Operation failed for ${identifier}: ${reason}`);
```

## Code Review Checklist

- [ ] All user-facing messages in Portuguese
- [ ] Proper TypeScript typing (no `any` without justification)
- [ ] Error handling with try-catch blocks
- [ ] Input validation with express-validator
- [ ] Authentication and authorization applied
- [ ] Swagger documentation for API endpoints
- [ ] Consistent response structure (success, data, message, meta)
- [ ] Database queries optimized with lean() and select()
- [ ] Transactions used for multi-step operations
- [ ] Test environment checks for transaction handling
- [ ] Proper logging with context
- [ ] Environment variables with fallbacks
- [ ] File header comments with path
- [ ] Consistent naming conventions
- [ ] Export singleton instances for services
