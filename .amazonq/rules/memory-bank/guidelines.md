# TopSmile - Development Guidelines

## Code Quality Standards

### File Headers and Comments
- Include file path comments at the top of files: `// backend/src/routes/providers.ts`
- Use descriptive comments for complex logic and business rules
- Document version changes and fixes: `// FIXED VERSION with Critical Configuration Improvements`
- Add inline comments for non-obvious code sections

### Naming Conventions
- **Variables/Functions**: camelCase (`createAppointmentModel`, `isTimeSlotAvailable`)
- **Classes/Types**: PascalCase (`SchedulingService`, `TimeSlot`, `AvailabilityQuery`)
- **Constants**: UPPER_SNAKE_CASE (`TEST_CREDENTIALS`, `ADMIN_EMAIL`)
- **Files**: camelCase for services/utilities, PascalCase for components
- **Database Models**: PascalCase (`AppointmentModel`, `ProviderModel`)
- **Interfaces**: PascalCase with descriptive names (`CreateAppointmentData`, `SchedulingResult`)

### Code Organization
- Group related validation rules together
- Separate concerns: routes, services, models, middleware
- Use barrel exports for cleaner imports
- Keep files focused on single responsibility
- Extract reusable logic into utility functions

### Portuguese Language Standard
- **All user-facing messages in Portuguese**: Error messages, validation messages, API responses
- **Code in English**: Variable names, function names, comments
- Examples:
  - ✅ `message: 'Profissional não encontrado'`
  - ✅ `withMessage('Nome deve ter entre 2 e 100 caracteres')`
  - ✅ `console.log('✅ Proxy trust enabled for production environment')`

## Backend Patterns

### Route Structure
```typescript
// Import dependencies
import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { body, query, validationResult } from 'express-validator';

// Define validation rules as constants
const createValidation = [
  body('field').trim().isLength({ min: 2, max: 100 })
    .withMessage('Portuguese error message'),
];

// Apply authentication to all routes
router.use(authenticate);

// Define routes with Swagger documentation
/**
 * @swagger
 * /api/endpoint:
 *   post:
 *     summary: Portuguese description
 */
router.post('/', 
  authorize('super_admin', 'admin', 'manager'),
  createValidation,
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    // Implementation
  }
);
```

### Service Layer Pattern
```typescript
class ServiceName {
  // Public methods for business logic
  async publicMethod(params): Promise<Result> {
    try {
      // Validation
      // Business logic
      // Database operations
      return { success: true, data };
    } catch (error) {
      console.error('Error description:', error);
      return { success: false, error: error.message };
    }
  }

  // Private helper methods
  private async helperMethod(params): Promise<Type> {
    // Implementation
  }
}

export const serviceName = new ServiceName();
```

### Transaction Handling
- Skip transactions in test environment: `const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID`
- Use sessions for critical operations: `const session = await mongoose.startSession()`
- Always commit or abort: `await session.commitTransaction()` / `await session.abortTransaction()`
- Clean up in finally block: `session.endSession()`
- Pass session to all database operations within transaction

### Error Handling
```typescript
try {
  // Operation
  return res.status(200).json({
    success: true,
    message: 'Portuguese success message',
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    }
  });
} catch (error: any) {
  console.error('Error context:', error);
  return res.status(400).json({
    success: false,
    message: error.message || 'Portuguese fallback message'
  });
}
```

### Validation Patterns
- Use express-validator for input validation
- Define validation arrays as constants
- Validate all user inputs before processing
- Use custom validators for complex rules
- Provide Portuguese error messages
- Check validation results: `const errors = validationResult(req)`

### API Response Format
```typescript
// Success response
{
  success: true,
  data: { /* result */ },
  message?: 'Optional message',
  meta: {
    timestamp: new Date().toISOString(),
    requestId: req.requestId
  }
}

// Error response
{
  success: false,
  message: 'Error description in Portuguese',
  errors?: [/* validation errors */]
}

// Paginated response
{
  success: true,
  data: {
    items: [],
    total: number,
    page: number,
    totalPages: number,
    hasNext: boolean,
    hasPrev: boolean
  }
}
```

### Database Queries
- Use `.lean()` for read-only queries to improve performance
- Use `.populate()` to include related documents
- Add indexes for frequently queried fields
- Use projection to limit returned fields
- Implement pagination for list endpoints

### Security Middleware
- Apply authentication: `router.use(authenticate)`
- Apply authorization: `authorize('super_admin', 'admin')`
- Validate clinic context: `if (!authReq.user?.clinicId) { return res.status(400)... }`
- Sanitize inputs with express-mongo-sanitize
- Apply rate limiting to sensitive endpoints
- Use CSRF protection for state-changing operations

## Frontend Patterns

### Component Structure
```typescript
import { useState, useEffect } from 'react';
import type { TypeName } from '@topsmile/types';

interface ComponentProps {
  prop: string;
}

export const ComponentName: React.FC<ComponentProps> = ({ prop }) => {
  // State declarations
  const [state, setState] = useState<Type>(initialValue);
  
  // Custom hooks
  const { method } = useCustomHook();
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  return (
    // JSX
  );
};
```

### Custom Hooks Pattern
```typescript
export const useHookName = (options: Options = {}) => {
  const { option1 = defaultValue } = options;
  
  const ref = useRef<Type | null>(null);
  
  const method = useCallback((params) => {
    // Implementation
  }, [dependencies]);
  
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, [dependencies]);
  
  return {
    method,
    // Other exports
  };
};
```

### Test Data Generation
- Use @faker-js/faker for realistic test data
- Create generator functions with overrides parameter
- Generate Brazilian-specific data (CPF, phone, zip code)
- Provide mock API response helpers
- Create test scenario builders

### Accessibility Patterns
- Provide ARIA labels and descriptions
- Implement keyboard navigation
- Support screen reader announcements
- Manage focus for modals and dialogs
- Check color contrast ratios
- Use semantic HTML elements

## Testing Standards

### Test Structure
```typescript
describe('Feature/Component', () => {
  beforeEach(() => {
    // Setup
  });
  
  afterEach(() => {
    // Cleanup
  });
  
  it('should describe expected behavior', async () => {
    // Arrange
    const input = generateMockData();
    
    // Act
    const result = await functionUnderTest(input);
    
    // Assert
    expect(result).toMatchObject(expected);
  });
});
```

### Mock Data Patterns
- Use faker for dynamic test data
- Provide override parameters for customization
- Generate realistic Brazilian data
- Create scenario builders for common cases
- Use consistent data structures

## Configuration Standards

### Environment Variables
- Validate required variables on startup
- Provide development defaults
- Use descriptive variable names
- Document all environment variables
- Fail fast in production if critical variables missing

### Middleware Configuration
- Apply security headers with helmet
- Configure CORS with multiple origins
- Implement tiered rate limiting
- Add request ID tracking
- Enable MongoDB sanitization
- Configure body parser limits

### Logging Standards
- Use pino for structured logging
- Log errors with context
- Include request IDs in logs
- Log rate limit violations
- Log security events
- Use appropriate log levels

## Performance Optimization

### Database Performance
- Use lean queries for read operations
- Implement proper indexing
- Use projection to limit fields
- Batch operations when possible
- Cache frequently accessed data
- Use connection pooling

### Query Optimization
- Avoid N+1 queries with populate
- Use aggregation for complex queries
- Implement pagination
- Limit result sets
- Use select to reduce payload

### Code Optimization
- Process items in parallel with Promise.all
- Implement safety limits (max iterations)
- Use efficient data structures
- Avoid unnecessary re-renders
- Lazy load components and routes

## Common Code Idioms

### Type Casting Pattern
```typescript
const authReq = req as AuthenticatedRequest;
const providerId = (provider._id as any).toString();
```

### Conditional Query Building
```typescript
const query: any = { baseField: value };
if (optionalParam) {
  query.optionalField = optionalParam;
}
```

### Array Parameter Handling
```typescript
let specialties: string[] | undefined;
if (req.query.specialties) {
  if (typeof req.query.specialties === 'string') {
    specialties = [req.query.specialties];
  } else if (Array.isArray(req.query.specialties)) {
    specialties = req.query.specialties as string[];
  }
}
```

### Date Parsing with Timezone
```typescript
const parseTimeToDate = (date: Date, timeString: string, timeZone: string): Date => {
  const parts = timeString.split(':');
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  const dateStr = format(date, 'yyyy-MM-dd');
  const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  const dateTimeStr = `${dateStr}T${timeStr}`;
  return parseISO(formatInTimeZone(new Date(dateTimeStr), timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX"));
};
```

### Result Type Pattern
```typescript
interface SchedulingResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
}
```

## Swagger Documentation

### Route Documentation Pattern
```typescript
/**
 * @swagger
 * /api/endpoint:
 *   method:
 *     summary: Brief description in Portuguese
 *     description: Detailed description in Portuguese
 *     tags: [TagName]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path/query
 *         name: paramName
 *         required: true/false
 *         schema:
 *           type: string
 *         description: Parameter description
 *     responses:
 *       200:
 *         description: Success description
 *       400:
 *         description: Error description
 */
```

## Import Organization

### Import Order
1. External dependencies (express, mongoose, etc.)
2. Type imports from @topsmile/types
3. Internal services and models
4. Middleware
5. Utilities and helpers

### Type Import Pattern
```typescript
import type { User, Patient, Appointment } from '@topsmile/types';
```

## Best Practices Summary

1. **Always validate inputs** before processing
2. **Use transactions** for critical multi-step operations
3. **Provide Portuguese messages** for all user-facing text
4. **Include request IDs** in API responses
5. **Log errors with context** for debugging
6. **Use lean queries** for better performance
7. **Implement proper error handling** with try-catch
8. **Apply authentication and authorization** to protected routes
9. **Generate realistic test data** with faker
10. **Document APIs** with Swagger annotations
11. **Check clinic context** for multi-tenant operations
12. **Use TypeScript strictly** for type safety
13. **Implement accessibility** features in frontend
14. **Optimize database queries** with indexes and projection
15. **Handle edge cases** and provide meaningful errors
