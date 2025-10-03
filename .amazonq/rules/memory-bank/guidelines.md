# TopSmile - Development Guidelines

## Code Quality Standards

### Language & Type Safety
- **TypeScript Strict Mode**: All code uses TypeScript with strict type checking enabled
- **Explicit Type Annotations**: Function parameters, return types, and complex objects have explicit type definitions
- **Shared Types**: Common types are defined in `@topsmile/types` package and imported across frontend and backend
- **Type Imports**: Use `import type` for type-only imports to optimize bundle size

### Code Formatting
- **Indentation**: 2 spaces for all files (TypeScript, JavaScript, JSON)
- **Semicolons**: Always use semicolons to terminate statements
- **Quotes**: Single quotes for strings, except in JSON files
- **Line Length**: Keep lines under 120 characters when practical
- **Trailing Commas**: Use trailing commas in multi-line objects and arrays

### Naming Conventions
- **Variables & Functions**: camelCase (e.g., `createProvider`, `appointmentType`)
- **Classes & Interfaces**: PascalCase (e.g., `Provider`, `PaymentService`)
- **Constants**: UPPER_SNAKE_CASE for true constants (e.g., `MAX_RETRIES`, `RETRY_WINDOW_MINUTES`)
- **Private Methods**: Prefix with underscore is optional, use `private` keyword (e.g., `private initializeRetryState`)
- **Files**: camelCase for utilities, PascalCase for components (e.g., `paymentService.ts`, `PatientNavigation.tsx`)
- **Test Files**: Match source file name with `.test.ts` or `.test.tsx` suffix

### Documentation
- **JSDoc Comments**: Use for public APIs, complex functions, and exported utilities
- **Swagger/OpenAPI**: All backend routes documented with Swagger annotations
- **Inline Comments**: Explain "why" not "what" - use sparingly for complex logic
- **Portuguese Messages**: All user-facing messages, error messages, and validation messages in Portuguese

## Backend Patterns

### Architecture
- **Layered Structure**: Routes → Services → Models
- **Route Handlers**: Keep thin, delegate business logic to services
- **Service Layer**: Contains all business logic, data validation, and external service integration
- **Model Layer**: Mongoose schemas with validation, methods, and statics

### Route Patterns
```typescript
// Standard route structure
router.post('/',
  authenticate,                    // Authentication middleware
  authorize('admin', 'manager'),   // Authorization middleware
  validationRules,                 // Express-validator rules
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

      // Check clinic context
      if (!authReq.user?.clinicId) {
        return res.status(400).json({
          success: false,
          message: 'Clínica não identificada'
        });
      }

      // Call service layer
      const result = await service.method(data);

      // Return success response
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
        message: error.message || 'Erro ao processar requisição'
      });
    }
  }
);
```

### Validation Patterns
- **Express-validator**: Use for all input validation in routes
- **Validation Arrays**: Define reusable validation rule arrays
- **Portuguese Messages**: All validation error messages in Portuguese
- **Chained Validators**: Chain multiple validators with `.withMessage()` for custom errors

```typescript
const createValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('E-mail inválido'),
  
  body('specialties')
    .isArray({ min: 1 })
    .withMessage('Pelo menos uma especialidade é obrigatória')
];
```

### Service Layer Patterns
- **Error Handling**: Throw descriptive errors with Portuguese messages
- **Input Validation**: Validate IDs and required fields at service level
- **MongoDB ObjectId**: Validate with `mongoose.Types.ObjectId.isValid()`
- **Lean Queries**: Use `.lean()` for read-only operations to improve performance
- **Transactions**: Use MongoDB sessions for multi-document operations

```typescript
// Service method pattern
async createProvider(data: any): Promise<Provider> {
  // Validate required fields
  if (!data.name || !data.clinicId) {
    throw new Error('Nome e clínica são obrigatórios');
  }

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(data.clinicId)) {
    throw new Error('ID da clínica inválido');
  }

  // Check for duplicates
  const existing = await Provider.findOne({
    email: data.email,
    clinic: data.clinicId,
    isActive: true
  });

  if (existing) {
    throw new Error('Já existe um profissional ativo com este e-mail nesta clínica');
  }

  // Create and return
  const provider = await Provider.create(data);
  return provider;
}
```

### Database Patterns
- **Soft Deletes**: Use `isActive` flag instead of hard deletes
- **Timestamps**: All models have `createdAt` and `updatedAt` fields
- **Clinic Scoping**: Most queries filtered by `clinicId` for multi-tenancy
- **Populate**: Use `.populate()` for related documents, specify fields to optimize
- **Indexes**: Add indexes on frequently queried fields (clinic, email, status)

### Performance Optimization
- **Lean Queries**: Use `.lean()` to return plain JavaScript objects instead of Mongoose documents
- **Field Projection**: Select only needed fields in queries
- **Batch Operations**: Process multiple items in single database queries when possible
- **Caching**: Implement caching for frequently accessed data (e.g., `timeParseCache`)
- **Memory Management**: Clear caches periodically to prevent memory leaks
- **Query Limits**: Enforce maximum limits on date ranges and result sets

```typescript
// Optimized query pattern
const providers = await Provider.find(
  { clinic: clinicId, isActive: true },
  { name: 1, email: 1, specialties: 1 }  // Field projection
).lean().sort({ name: 1 });
```

### Error Handling
- **Try-Catch**: Wrap async operations in try-catch blocks
- **Descriptive Errors**: Throw errors with clear Portuguese messages
- **Error Logging**: Log errors with `console.error()` including context
- **HTTP Status Codes**: Use appropriate status codes (400, 401, 404, 500)
- **Consistent Response Format**: All responses follow `{ success, message, data, meta }` structure

## Frontend Patterns

### Component Structure
- **Functional Components**: Use function components with hooks
- **TypeScript Props**: Define prop interfaces for all components
- **Default Exports**: Components use default export
- **Named Exports**: Utilities and services use named exports

### State Management
- **React Context**: Use Context API for global state (auth, errors)
- **TanStack Query**: Use for server state management and caching
- **Local State**: Use `useState` for component-local state
- **Custom Hooks**: Extract reusable logic into custom hooks

### API Integration
```typescript
// Service pattern
class PaymentService {
  private stripe: Promise<Stripe | null>;
  private retryStates: Map<string, RetryState> = new Map();
  private readonly MAX_RETRIES = 3;

  async createPaymentIntent(data: PaymentData): Promise<PaymentResult> {
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('topsmile_access_token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create payment intent'
      };
    }
  }
}
```

### Error Handling
- **Try-Catch**: Wrap async operations
- **Type Guards**: Use `instanceof Error` to check error types
- **Fallback Values**: Provide fallback for error messages
- **User-Friendly Messages**: Display Portuguese error messages to users

## Testing Standards

### Test Structure
- **Describe Blocks**: Group related tests by feature/method
- **BeforeEach**: Set up test data in `beforeEach` hooks
- **Test Isolation**: Each test should be independent
- **Descriptive Names**: Test names clearly describe what is being tested

```typescript
describe('ProviderService', () => {
  let testClinic: any;
  let testUser: any;

  beforeEach(async () => {
    testClinic = await createTestClinic();
    testUser = await createTestUser({ clinic: testClinic._id });
  });

  describe('createProvider', () => {
    it('should create a new provider successfully', async () => {
      const providerData = {
        name: 'Dr. João Silva',
        email: 'joao.silva@example.com',
        specialties: ['general_dentistry'],
        clinicId: testClinic._id.toString()
      };

      const result = await providerService.createProvider(providerData);

      expect(result).toBeDefined();
      expect(result.name).toBe(providerData.name);
      expect(result.email).toBe(providerData.email);
    });

    it('should throw error for duplicate email in same clinic', async () => {
      // Test implementation
      await expect(
        providerService.createProvider(duplicateData)
      ).rejects.toThrow('Já existe um profissional ativo com este e-mail nesta clínica');
    });
  });
});
```

### Test Data Generation
- **Faker.js**: Use `@faker-js/faker` for generating realistic test data
- **Mock Factories**: Create factory functions for common test objects
- **Overrides Pattern**: Allow overriding specific fields in mock data

```typescript
export const generateMockProvider = (overrides = {}) => ({
  _id: faker.database.mongodbObjectId(),
  name: `Dr. ${faker.name.fullName()}`,
  email: faker.internet.email(),
  specialties: faker.helpers.arrayElements(['general_dentistry', 'orthodontics'], { min: 1, max: 3 }),
  isActive: faker.datatype.boolean({ probability: 0.95 }),
  ...overrides
});
```

### Assertions
- **Specific Assertions**: Use specific matchers (`toBe`, `toEqual`, `toHaveLength`)
- **Null Checks**: Check for `null` or `undefined` explicitly
- **Error Messages**: Verify exact error message text
- **Object Matching**: Use `toEqual` for object comparison, `toBe` for primitives

### Test Coverage
- **Happy Path**: Test successful operations
- **Error Cases**: Test validation errors, not found, duplicates
- **Edge Cases**: Test boundary conditions, empty arrays, null values
- **Integration**: Test full request/response cycles for APIs

## Common Patterns

### Async/Await
- Always use `async/await` instead of `.then()` chains
- Wrap in try-catch for error handling
- Use `Promise.all()` for parallel operations

### Date Handling
- **date-fns**: Primary library for date manipulation
- **Luxon**: Alternative for timezone-aware operations
- **ISO Format**: Store dates in ISO 8601 format
- **Timezone**: Default timezone is `America/Sao_Paulo`

### MongoDB Patterns
- **ObjectId Validation**: Always validate before querying
- **String Conversion**: Convert ObjectIds to strings with `.toString()`
- **Lean Queries**: Use for read-only operations
- **Populate**: Specify fields to populate for performance

### Security
- **Authentication**: JWT tokens stored in localStorage
- **Authorization**: Role-based access control with middleware
- **Input Sanitization**: Use express-mongo-sanitize and express-validator
- **CORS**: Configured for specific origins
- **Rate Limiting**: Applied to sensitive endpoints

### API Response Format
```typescript
// Success response
{
  success: true,
  message: 'Operação realizada com sucesso',
  data: { /* result data */ },
  meta: {
    timestamp: '2024-01-01T00:00:00.000Z',
    requestId: 'uuid'
  }
}

// Error response
{
  success: false,
  message: 'Erro ao processar requisição',
  errors: [/* validation errors */]
}

// Paginated response
{
  success: true,
  data: {
    items: [/* array of items */],
    pagination: {
      page: 1,
      limit: 20,
      total: 100,
      totalPages: 5,
      hasNext: true,
      hasPrev: false
    }
  }
}
```

## Best Practices

### Code Organization
- Keep files focused on single responsibility
- Extract reusable logic into utilities or services
- Group related functionality in directories
- Use barrel exports (index.ts) for cleaner imports

### Performance
- Minimize database queries with proper indexing
- Use pagination for large result sets
- Implement caching for frequently accessed data
- Lazy load components and routes
- Optimize bundle size with code splitting

### Maintainability
- Write self-documenting code with clear names
- Keep functions small and focused
- Avoid deep nesting (max 3-4 levels)
- Use early returns to reduce complexity
- Extract magic numbers into named constants

### Security
- Never commit credentials or secrets
- Validate all user input
- Sanitize data before database operations
- Use parameterized queries (Mongoose handles this)
- Implement proper authentication and authorization

### Accessibility
- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation works
- Test with screen readers
- Maintain sufficient color contrast

## Development Workflow

### Git Practices
- Write descriptive commit messages
- Keep commits focused and atomic
- Use feature branches
- Review code before merging

### Code Review
- Check for type safety
- Verify error handling
- Ensure tests are included
- Validate Portuguese messages
- Review performance implications

### Testing Strategy
- Write tests alongside code
- Aim for high coverage on critical paths
- Test error scenarios
- Use meaningful test data
- Keep tests fast and isolated
