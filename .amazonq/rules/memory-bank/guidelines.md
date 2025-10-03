# Development Guidelines & Patterns

## Code Quality Standards

### TypeScript Usage
- **Strict Type Safety**: All files use TypeScript with strict type checking enabled
- **Interface Definitions**: Extensive use of interfaces from `@topsmile/types` package for type consistency
- **Type Imports**: Proper separation of type imports using `import type` syntax
- **Generic Types**: Comprehensive use of generics for reusable components and services

### Code Structure Patterns
- **Barrel Exports**: Consistent use of index files for clean imports
- **Separation of Concerns**: Clear distinction between routes, services, models, and utilities
- **Dependency Injection**: Services are instantiated as singletons and exported for reuse
- **Error Boundaries**: Comprehensive error handling at all application layers

## Backend Development Patterns

### Express Route Architecture
```typescript
// Standard route pattern observed across all route files
router.post('/', 
    authorize('super_admin', 'admin', 'manager'),
    validationMiddleware, 
    async (req: Request, res: Response) => {
        const authReq = req as AuthenticatedRequest;
        try {
            // Validation check
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors.array()
                });
            }
            
            // Business logic
            const result = await service.method(data);
            
            // Consistent response format
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
```

### Validation Standards
- **Express Validator**: Comprehensive input validation using express-validator
- **Portuguese Messages**: All validation messages in Portuguese for user-facing errors
- **Chained Validation**: Multiple validation rules chained for complex fields
- **Custom Validators**: Custom validation logic for business-specific rules
- **Sanitization**: Input sanitization using `.trim()`, `.normalizeEmail()`, etc.

### Database Patterns
- **Mongoose ODM**: Consistent use of Mongoose for MongoDB operations
- **Schema Validation**: Comprehensive schema validation with custom error messages
- **Indexing Strategy**: Strategic database indexes for performance optimization
- **Transaction Support**: Proper transaction handling for data consistency
- **Lean Queries**: Use of `.lean()` for performance-critical read operations

### Service Layer Architecture
```typescript
// Standard service pattern with transaction support
async createModel(data: CreateData): Promise<SchedulingResult<Model>> {
    const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID;
    const session = isTestEnv ? null : await mongoose.startSession();

    try {
        if (!isTestEnv) {
            session!.startTransaction();
        }
        
        // Business logic with validation
        const result = await Model.create(data);
        
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
}
```

## Frontend Development Patterns

### Component Architecture
- **Functional Components**: Exclusive use of React functional components with hooks
- **Custom Hooks**: Business logic abstracted into reusable custom hooks
- **Context Providers**: State management using React Context for global state
- **Component Composition**: Modular component design with clear prop interfaces

### State Management
- **TanStack Query**: Server state management using React Query for API interactions
- **Local State**: Component-level state using useState for UI-specific data
- **Context State**: Global state using React Context for authentication and app-wide data
- **Form State**: Controlled components for form management

### Service Integration
```typescript
// Standard API service pattern
class ApiService {
    private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return response.json();
    }
}
```

## Testing Standards

### Test Structure
- **Comprehensive Coverage**: Unit, integration, and E2E testing strategies
- **Mock Data Generation**: Faker.js for realistic test data generation
- **Test Utilities**: Centralized test helpers and mock data generators
- **Environment Isolation**: Separate test configurations and databases

### Mock Data Patterns
```typescript
// Consistent mock data generation pattern
export const generateMockEntity = (overrides = {}) => ({
    _id: faker.database.mongodbObjectId(),
    name: faker.name.fullName(),
    // ... other fields
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides
});
```

### Test Scenarios
- **Authentication Tests**: Valid/invalid login scenarios
- **CRUD Operations**: Complete create, read, update, delete test coverage
- **Edge Cases**: Boundary conditions and error scenarios
- **Performance Tests**: Load testing for critical operations

## Error Handling Patterns

### Consistent Error Responses
```typescript
// Standard error response format
{
    success: false,
    message: 'User-friendly error message in Portuguese',
    errors?: ValidationError[], // For validation errors
    status?: number
}
```

### Error Logging
- **Structured Logging**: Consistent error logging with context information
- **Error Boundaries**: React error boundaries for graceful failure handling
- **Retry Logic**: Exponential backoff for transient failures

## Security Standards

### Authentication & Authorization
- **JWT Tokens**: Stateless authentication using JSON Web Tokens
- **Role-Based Access**: Granular permission system with role checking
- **Input Sanitization**: Comprehensive input validation and sanitization
- **CORS Configuration**: Proper cross-origin resource sharing setup

### Data Protection
- **Password Hashing**: bcrypt for secure password storage
- **Environment Variables**: Sensitive data stored in environment variables
- **Request Validation**: All inputs validated before processing

## Performance Optimization

### Database Optimization
- **Strategic Indexing**: Performance indexes on frequently queried fields
- **Query Optimization**: Lean queries and proper population strategies
- **Connection Pooling**: Efficient database connection management

### Frontend Optimization
- **Code Splitting**: Lazy loading for route-based components
- **Caching Strategy**: React Query for intelligent data caching
- **Bundle Optimization**: Webpack optimization for production builds

## Code Style Guidelines

### Naming Conventions
- **camelCase**: Variables, functions, and methods
- **PascalCase**: Components, classes, and interfaces
- **UPPER_SNAKE_CASE**: Constants and environment variables
- **kebab-case**: File names and CSS classes

### Documentation Standards
- **JSDoc Comments**: Comprehensive API documentation using JSDoc
- **Swagger Integration**: API documentation with Swagger/OpenAPI
- **README Files**: Clear setup and usage instructions
- **Type Definitions**: Self-documenting code through TypeScript types

### Import Organization
```typescript
// Standard import order
import express from 'express'; // External libraries
import { authenticate } from '../middleware/auth'; // Internal modules
import type { Provider } from '@topsmile/types'; // Type imports
```

## Internationalization

### Language Support
- **Portuguese Primary**: All user-facing text in Portuguese (Brazil)
- **Consistent Messaging**: Standardized error and success messages
- **Date/Time Formatting**: Brazilian locale formatting standards
- **Currency Handling**: Brazilian Real (BRL) formatting

## Development Workflow

### Code Quality Checks
- **ESLint**: Consistent code style enforcement
- **TypeScript**: Compile-time type checking
- **Prettier**: Automated code formatting
- **Pre-commit Hooks**: Quality checks before commits

### Testing Requirements
- **Test Coverage**: Minimum coverage thresholds for all modules
- **CI/CD Integration**: Automated testing in deployment pipeline
- **Performance Benchmarks**: Regular performance regression testing