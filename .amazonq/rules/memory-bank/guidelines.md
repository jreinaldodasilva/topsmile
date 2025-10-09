# Development Guidelines

## Code Quality Standards

### File Organization
- **Path Comments**: Every file starts with a path comment indicating its location (e.g., `// backend/src/routes/providers.ts`)
- **Import Grouping**: Imports are organized in logical groups:
  1. External dependencies (express, dotenv, etc.)
  2. Internal middleware and utilities
  3. Models and services
  4. Type imports from @topsmile/types
- **Export Pattern**: Use `export default router` for route files, named exports for services and utilities

### Code Formatting
- **Indentation**: 4 spaces for indentation (consistent across all files)
- **Line Length**: Keep lines reasonable, break long validation chains into multiple lines
- **Spacing**: Blank lines separate logical sections (imports, constants, route handlers)
- **Semicolons**: Always use semicolons at statement ends
- **Quotes**: Single quotes for strings, except in JSON

### Naming Conventions
- **Variables/Functions**: camelCase (e.g., `createProvider`, `authService`, `tokenPayload`)
- **Constants**: UPPER_SNAKE_CASE for configuration constants (e.g., `JWT_SECRET`, `ACCESS_TOKEN_EXPIRES`)
- **Types/Interfaces**: PascalCase (e.g., `TokenPayload`, `AuthResponse`, `DeviceInfo`)
- **Files**: camelCase for TypeScript files (e.g., `authService.ts`, `providers.ts`)
- **Folders**: kebab-case or camelCase (e.g., `auth/`, `provider/`)
- **Mock Data**: Prefix with `mock` (e.g., `mockFormTemplates`, `mockFormResponses`)

### Documentation Standards
- **Swagger/OpenAPI**: All API endpoints documented with @swagger JSDoc comments
- **Inline Comments**: Explain complex logic, security considerations, and business rules
- **TODO/FIXME**: Use `// FIXED:` prefix for resolved issues, document what was fixed
- **Portuguese Messages**: All user-facing messages in Portuguese (error messages, validation messages, success messages)

## TypeScript Patterns

### Type Safety
- **Explicit Types**: Always define interfaces for complex objects (TokenPayload, AuthResponse, DeviceInfo)
- **Type Imports**: Use `import type` for type-only imports from @topsmile/types
- **Type Guards**: Validate types at runtime, especially for JWT payloads
- **Avoid `any`**: Use proper typing; when unavoidable, add comment explaining why
- **Type Assertions**: Use type assertions sparingly, prefer type guards

### Interface Design
```typescript
// Extend JwtPayload for custom token data
export interface TokenPayload extends JwtPayload {
    userId: string;
    email: string;
    role: string;
    clinicId?: string;
}

// Clear response structure
export interface AuthResponse {
    success: true;
    data: {
        user: IUser;
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
    };
}
```

### Error Handling
- **Custom Error Classes**: Use AppError, ValidationError, UnauthorizedError, ConflictError, NotFoundError
- **Try-Catch Pattern**: Wrap async operations in try-catch blocks
- **Error Re-throwing**: Re-throw custom errors, wrap unexpected errors
- **Graceful Degradation**: Non-critical operations (like cleanup) should not throw
```typescript
try {
    // Operation
} catch (error) {
    if (error instanceof AppError) {
        throw error; // Re-throw custom errors
    }
    console.error('Unexpected error:', error);
    throw new AppError('Erro interno', 500);
}
```

## API Route Patterns

### Route Structure
```typescript
const router: express.Router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Define validation rules as constants
const createValidation = [
    body('field').trim().isLength({ min: 2, max: 100 })
        .withMessage('Mensagem em português'),
    // More validations...
];

// Route handlers with Swagger docs
/**
 * @swagger
 * /api/resource:
 *   post:
 *     summary: Descrição em português
 *     tags: [ResourceTag]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', 
    authorize('super_admin', 'admin'),
    createValidation,
    async (req: Request, res: Response) => {
        const authReq = req as AuthenticatedRequest;
        try {
            // Validate
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors.array()
                });
            }
            
            // Business logic
            const result = await service.operation(authReq.body);
            
            // Success response
            return res.status(201).json({
                success: true,
                message: 'Criado com sucesso',
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
                message: error.message || 'Erro ao processar'
            });
        }
    }
);

export default router;
```

### Request Validation
- **express-validator**: Use for all input validation
- **Validation Arrays**: Define validation rules as constants before routes
- **Chaining**: Chain validation methods for readability
- **Custom Validators**: Use `.custom()` for complex validation logic
- **Error Messages**: Always provide Portuguese error messages with `.withMessage()`
- **Sanitization**: Use `.trim()`, `.normalizeEmail()`, etc.

### Response Format
All API responses follow consistent structure:
```typescript
// Success response
{
    success: true,
    data: { /* result data */ },
    meta: {
        timestamp: new Date().toISOString(),
        requestId: (authReq as any).requestId
    }
}

// Error response
{
    success: false,
    message: 'Mensagem de erro em português',
    errors?: [ /* validation errors */ ]
}

// List response with pagination
{
    success: true,
    data: {
        items: [ /* array of items */ ],
        total: 100,
        page: 1,
        totalPages: 10,
        hasNext: true,
        hasPrev: false
    },
    meta: { /* metadata */ }
}
```

### Authentication & Authorization
- **Middleware Order**: `authenticate` → `authorize(roles)` → validation → handler
- **AuthenticatedRequest**: Cast `req` to `AuthenticatedRequest` to access `user` property
- **Clinic Scoping**: Always check `authReq.user?.clinicId` for multi-tenant operations
- **Role-Based Access**: Use `authorize()` middleware with role names

## Service Layer Patterns

### Service Class Structure
```typescript
class ServiceName {
    private readonly CONFIG_VALUE: string;
    
    constructor() {
        // Initialize configuration from environment
        this.CONFIG_VALUE = process.env.CONFIG_VALUE || 'default';
        
        // Validate critical configuration at startup
        if (!this.CONFIG_VALUE) {
            throw new Error('CONFIG_VALUE is required');
        }
    }
    
    // Private helper methods
    private helperMethod(): void {
        // Implementation
    }
    
    // Public service methods
    async publicMethod(data: DataType): Promise<ResultType> {
        try {
            // Validation
            if (!data.field) {
                throw new ValidationError('Campo obrigatório');
            }
            
            // Business logic
            const result = await this.helperMethod();
            
            return result;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error('Error:', error);
            throw new AppError('Erro interno', 500);
        }
    }
}

// Export singleton instance
export const serviceName = new ServiceName();
```

### Security Best Practices
- **Token Validation**: Always validate JWT structure and required fields
- **Token Blacklisting**: Check blacklist before accepting tokens
- **Password Hashing**: Use bcrypt with proper salt rounds
- **Token Rotation**: Revoke old refresh tokens when issuing new ones
- **Rate Limiting**: Implement for authentication endpoints
- **Input Sanitization**: Sanitize all user inputs
- **SQL Injection Prevention**: Use parameterized queries (Mongoose handles this)
- **XSS Prevention**: Sanitize HTML content
- **CSRF Protection**: Use CSRF tokens for state-changing operations

### Token Management
```typescript
// Generate tokens with explicit options
const options: SignOptions = {
    expiresIn: this.ACCESS_TOKEN_EXPIRES,
    issuer: 'topsmile-api',
    audience: 'topsmile-client',
    algorithm: 'HS256'
};

// Verify with matching options
const payload = jwt.verify(token, secret, {
    issuer: 'topsmile-api',
    audience: 'topsmile-client',
    algorithms: ['HS256']
});

// Type-safe payload handling
if (typeof payload === 'string') {
    throw new UnauthorizedError('Formato de token inválido');
}
const typedPayload = payload as TokenPayload;
```

## Configuration Management

### Constants Organization
- **Centralized Constants**: All magic numbers and strings in `config/constants.ts`
- **Grouped by Domain**: TOKEN, RATE_LIMIT, PAGINATION, APPOINTMENT, etc.
- **Type Safety**: Export as `const` and provide type definitions
- **Helper Functions**: Provide validation and formatting helpers
- **Environment Variables**: Use `process.env` with fallback defaults
- **Feature Flags**: Use environment variables for feature toggles

### Constants Pattern
```typescript
export const CONSTANTS = {
    TOKEN: {
        ACCESS_EXPIRES: '15m',
        REFRESH_EXPIRES_DAYS: 7,
        MIN_SECRET_LENGTH: 64,
    },
    VALIDATION: {
        NAME_MIN_LENGTH: 2,
        NAME_MAX_LENGTH: 100,
        EMAIL_MAX_LENGTH: 254,
    },
    ERRORS: {
        UNAUTHORIZED: 'Não autorizado',
        VALIDATION_ERROR: 'Dados inválidos',
    },
    REGEX: {
        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        PHONE_BR: /^\d{10,11}$/,
    },
} as const;

// Helper functions
export const isValidEmail = (email: string): boolean => {
    return CONSTANTS.REGEX.EMAIL.test(email);
};
```

## Validation Patterns

### Express Validator Usage
```typescript
// Comprehensive validation with all checks
body('email')
    .optional()                          // Make field optional
    .isEmail()                          // Type validation
    .normalizeEmail()                   // Sanitization
    .withMessage('E-mail inválido'),    // Error message

body('specialties')
    .isArray({ min: 1 })                // Array validation
    .withMessage('Pelo menos uma especialidade é obrigatória'),

body('specialties.*')                   // Array element validation
    .isIn(['value1', 'value2'])
    .withMessage('Especialidade inválida'),

body('workingHours.*.start')            // Nested object validation
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Formato de horário inválido. Use HH:MM'),

query('page')                           // Query parameter validation
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número inteiro maior que 0'),
```

### Custom Validators
```typescript
query('specialties')
    .optional()
    .custom((value) => {
        if (typeof value === 'string') {
            return true; // Single value
        }
        if (Array.isArray(value)) {
            return value.every(s => typeof s === 'string');
        }
        return false;
    })
    .withMessage('Especialidades inválidas'),
```

## Database Patterns

### Model Usage
- **Mongoose Models**: Use Mongoose for MongoDB operations
- **Population**: Use `.populate()` for related documents
- **Projection**: Use `.select()` to include/exclude fields
- **Lean Queries**: Use `.lean()` for read-only operations (better performance)
- **Transactions**: Use transactions for multi-document operations

### Query Patterns
```typescript
// Find with filters and pagination
const result = await Model.find(filters)
    .populate('relatedField', 'field1 field2')
    .select('-excludedField')
    .sort({ field: 'asc' })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

// Update with validation
const updated = await Model.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
);

// Soft delete pattern
await Model.findByIdAndUpdate(id, { isActive: false });
```

## Testing Patterns

### Mock Data
- **Prefix with mock**: All mock data variables start with `mock` prefix
- **Realistic Data**: Use realistic Portuguese data for testing
- **Type Safety**: Mock data should match TypeScript interfaces
- **Separate Files**: Keep mock data in separate files or at top of test files

## Common Idioms

### Async/Await Pattern
```typescript
async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    try {
        // Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ /* error */ });
        }
        
        // Business logic
        const result = await service.method();
        
        // Success response
        return res.json({ success: true, data: result });
    } catch (error: any) {
        console.error('Error:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}
```

### Clinic Scoping Pattern
```typescript
// Always validate clinic context
if (!authReq.user?.clinicId) {
    return res.status(400).json({
        success: false,
        message: 'Clínica não identificada'
    });
}

// Include clinic in queries
const filters = {
    clinicId: authReq.user.clinicId,
    // other filters...
};
```

### Pagination Transform Pattern
```typescript
// Transform service result to frontend format
const transformedResult = {
    items: result.items,
    total: result.total,
    page: result.page,
    totalPages: result.totalPages,
    hasNext: result.page < result.totalPages,
    hasPrev: result.page > 1
};
```

## Security Annotations

### Common Security Patterns
- `// SECURITY FIX:` - Marks security improvements
- `// FIXED:` - Marks resolved issues with explanation
- Token validation with explicit algorithm specification
- Password hashing before database storage
- Token blacklisting for logout
- Rate limiting on sensitive endpoints
- Input sanitization and validation
- CSRF protection for state-changing operations

## Code Review Checklist

Before committing code, ensure:
- [ ] All user-facing messages are in Portuguese
- [ ] Validation rules have error messages
- [ ] API endpoints have Swagger documentation
- [ ] Error handling follows try-catch pattern
- [ ] Custom errors are used appropriately
- [ ] Types are properly defined (no `any` without justification)
- [ ] Authentication/authorization middleware is applied
- [ ] Clinic scoping is implemented for multi-tenant operations
- [ ] Response format follows standard structure
- [ ] Constants are used instead of magic numbers/strings
- [ ] Sensitive data is not logged
- [ ] Database queries are optimized
- [ ] Code follows naming conventions
