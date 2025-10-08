# Development Guidelines

## Code Quality Standards

### TypeScript Strict Mode
- All code must pass strict type checking
- Explicit return types required for functions
- No `any` type usage - use proper types from `@topsmile/types` or define new ones
- Use type imports with `import type` for type-only imports
- Leverage shared types from `@topsmile/types` package for consistency

### File Organization
- One primary export per file (class, service, or router)
- Group related imports together (external, internal, types)
- Import order: external packages → internal modules → types → models
- Use absolute imports for shared packages (`@topsmile/types`)
- Use relative imports for local modules

### Naming Conventions
- **Files**: camelCase for services/utilities, PascalCase for components/models
- **Variables/Functions**: camelCase (e.g., `patientAuthService`, `createAppointment`)
- **Classes/Interfaces**: PascalCase (e.g., `PatientAuthService`, `CDTCode`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `ACCESS_TOKEN_EXPIRES`, `CDT_CODES`)
- **Private methods**: prefix with underscore (e.g., `_generateToken`)
- **Route handlers**: descriptive names matching HTTP method + resource

### Documentation Standards
- **Swagger/JSDoc**: All API endpoints must have Swagger documentation
- **Portuguese messages**: All user-facing messages in Portuguese (BR)
- **English code**: Code, variables, and comments in English
- **Inline comments**: Explain complex logic, not obvious code
- **FIXED/IMPROVED comments**: Mark significant fixes or improvements

## Backend Patterns

### Express Route Structure
```typescript
// Import dependencies
import express, { Request, Response } from "express";
import { authenticate, authorize, AuthenticatedRequest } from "../../middleware/auth";
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Validation arrays defined before routes
const validationRules = [
  body('field').isString().withMessage('Mensagem em português'),
  // ... more rules
];

// Route with Swagger documentation
/**
 * @swagger
 * /api/resource:
 *   post:
 *     summary: Descrição em português
 *     tags: [ResourceTag]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", validationRules, async (req: Request, res: Response) => {
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

    // Business logic via service layer
    const result = await service.method(authReq.body);

    // Consistent response format
    return res.status(201).json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (authReq as any).requestId
      }
    });
  } catch (err: any) {
    console.error('Error description:', err);
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

export default router;
```

### Service Layer Pattern
```typescript
import { ValidationError, UnauthorizedError, NotFoundError, AppError } from '../../utils/errors/errors';

class ServiceName {
  private readonly CONSTANT_VALUE = process.env.ENV_VAR || 'default';

  // Private helper methods
  private helperMethod(): string {
    // Implementation
  }

  // Public service methods
  async publicMethod(data: InputType): Promise<OutputType> {
    try {
      // Input validation
      if (!data.required) {
        throw new ValidationError('Campo obrigatório');
      }

      // Business logic
      const result = await this.helperMethod();

      return result;
    } catch (error) {
      // Re-throw known errors
      if (error instanceof AppError) {
        throw error;
      }
      
      // Log and wrap unknown errors
      console.error('Service error:', error);
      throw new AppError('Erro ao processar', 500);
    }
  }
}

export const serviceName = new ServiceName();
```

### Error Handling Pattern
- Use custom error classes: `ValidationError`, `UnauthorizedError`, `NotFoundError`, `ConflictError`, `AppError`
- Always catch errors in route handlers
- Re-throw `AppError` instances, wrap unknown errors
- Log errors with `console.error` before responding
- Return consistent error response format:
```typescript
{
  success: false,
  message: 'Mensagem de erro em português',
  error: err.message // Optional, for development
}
```

### Response Format Pattern
All API responses follow this structure:
```typescript
// Success response
{
  success: true,
  data: { /* response data */ },
  meta: {
    timestamp: '2024-01-01T00:00:00.000Z',
    requestId: 'uuid-v4'
  }
}

// Error response
{
  success: false,
  message: 'Mensagem de erro',
  errors: [ /* validation errors */ ] // Optional
}

// Paginated response
{
  success: true,
  data: {
    items: [ /* array of items */ ],
    pagination: {
      page: 1,
      limit: 10,
      total: 100,
      pages: 10,
      hasNext: true,
      hasPrev: false
    }
  }
}
```

### Authentication & Authorization
- Use `authenticate` middleware for all protected routes
- Use `authorize(...roles)` for role-based access control
- Cast `req` to `AuthenticatedRequest` to access `req.user`
- Separate patient authentication: `authenticatePatient`, `PatientAuthenticatedRequest`
- Check clinic access: `appointment.clinic.toString() !== authReq.user!.clinicId`
- JWT secrets: separate for staff (`JWT_SECRET`) and patients (`PATIENT_JWT_SECRET`)

### Validation Pattern
- Use `express-validator` for input validation
- Define validation arrays before route handlers
- Portuguese error messages in validation rules
- Check validation results at start of handler
- Return 400 with validation errors array

### Database Patterns
- Use Mongoose models with TypeScript interfaces
- Populate related documents in queries: `.populate('field', 'selectedFields')`
- Use lean queries for read-only operations: `.lean()`
- Index frequently queried fields (50+ optimized indexes)
- Use transactions for multi-document operations
- Check document existence before operations
- Verify clinic/user ownership before modifications

## Frontend Patterns

### Component Structure
```typescript
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { TypeName } from '@topsmile/types';
import './ComponentName.css';

interface ComponentProps {
  prop1: string;
  prop2?: number;
}

export const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // State hooks
  const [localState, setLocalState] = useState<string>('');

  // Query hooks
  const { data, isLoading, error } = useQuery({
    queryKey: ['resource', prop1],
    queryFn: () => apiService.getResource(prop1)
  });

  // Mutation hooks
  const mutation = useMutation({
    mutationFn: apiService.createResource,
    onSuccess: () => {
      // Handle success
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });

  // Effect hooks
  useEffect(() => {
    // Side effects
  }, [prop1]);

  // Event handlers
  const handleAction = () => {
    mutation.mutate({ data: localState });
  };

  // Loading state
  if (isLoading) return <div>Carregando...</div>;

  // Error state
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};
```

### State Management
- **TanStack Query**: Server state (API data, caching, synchronization)
- **Zustand**: Client state (UI state, user preferences, global app state)
- **React Context**: Authentication, error handling, theme
- **Local State**: Component-specific UI state with `useState`

### Custom Hooks Pattern
```typescript
import { useState, useEffect } from 'react';

export const useCustomHook = (param: string) => {
  const [state, setState] = useState<Type>(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Hook logic
  }, [param]);

  return { state, loading, error };
};
```

### Testing Patterns
- **Custom matchers**: Use domain-specific matchers from `customMatchers.ts`
- **Test structure**: Arrange-Act-Assert pattern
- **Mock data**: Use `@faker-js/faker` for test data generation
- **API mocking**: Use MSW (Mock Service Worker) for API mocking
- **Accessibility**: Use `jest-axe` for a11y testing
- **Coverage targets**: 85% frontend, 90% backend

## Security Patterns

### Environment Variables
- Never commit `.env` files to git
- Use `.env.example` for documentation
- Validate required env vars on startup (see `validateEnv()` in app.ts)
- Minimum 64 characters for JWT secrets (32-byte hex)
- Different secrets for staff and patient tokens in production

### Token Management
- Access tokens: 15 minutes expiration
- Refresh tokens: 7 days expiration, stored in database
- Token rotation: revoke old refresh token when issuing new one
- Token blacklist: track revoked tokens in Redis
- Proactive refresh: refresh tokens every 13 minutes on frontend

### CSRF Protection
- Global CSRF protection on all state-changing operations (POST, PUT, PATCH, DELETE)
- Skip CSRF for GET, HEAD, OPTIONS
- Skip CSRF for specific endpoints (refresh, logout, csrf-token)
- Include `X-CSRF-Token` header in requests

### Input Sanitization
- MongoDB sanitization: `express-mongo-sanitize` on all requests
- Body parser limits: 10MB max, 100 parameters max
- Validation: client-side and server-side validation
- DOMPurify: sanitize HTML content

### Rate Limiting
- Auth endpoints: 10 requests per 15 minutes (production)
- Password reset: 3 requests per hour
- Contact form: 5 submissions per 15 minutes
- General API: 100 requests per 15 minutes (production)
- Key by email for auth, by IP for others

## Configuration Patterns

### Middleware Order (app.ts)
1. Trust proxy configuration
2. Security headers (helmet)
3. CORS configuration
4. Database connection
5. Rate limiting
6. Request ID tracking
7. Body parsers (JSON, URL-encoded)
8. Cookie parser
9. MongoDB sanitization
10. CSRF token endpoint
11. CSRF protection (state-changing operations)
12. Database connection check
13. Response wrapper
14. Audit logging
15. Route mounting
16. Error handler
17. 404 handler

### Logging Pattern
- Use Pino for structured logging
- HTTP request logging with `pino-http`
- Log levels: error (500+), warn (400+), info (200+)
- Console.error for errors before responding
- Include request ID in logs
- Avoid logging sensitive data (passwords, tokens)

### Health Check Endpoints
- `/api/health` - Basic health check with uptime and memory
- `/api/health/database` - Database connection and query performance
- `/api/health/metrics` - System metrics (admin only)

## Common Code Idioms

### Async/Await Pattern
```typescript
// Always use try-catch with async/await
try {
  const result = await asyncOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new AppError('Erro ao processar', 500);
}
```

### Null/Undefined Checks
```typescript
// Use optional chaining and nullish coalescing
const value = obj?.property ?? 'default';

// Check existence before operations
if (!document) {
  throw new NotFoundError('Documento não encontrado');
}
```

### Array Operations
```typescript
// Use functional methods (map, filter, reduce)
const filtered = items.filter(item => item.status === 'active');
const mapped = items.map(item => ({ id: item._id, name: item.name }));

// Use Array.from for iterables
const entries = Array.from(formData.entries());
```

### Date Handling
```typescript
// Use Luxon for date manipulation
import { DateTime } from 'luxon';

const date = DateTime.now();
const formatted = date.toISO();

// Use date-fns for simple operations
import { addDays, format } from 'date-fns';

const futureDate = addDays(new Date(), 7);
```

### Object Destructuring
```typescript
// Destructure props and parameters
const { firstName, lastName, email } = patient;

// Use rest operator for remaining properties
const { _id, ...updateData } = req.body;
```

## Performance Optimization

### Frontend
- Lazy load components with `React.lazy()` and `Suspense`
- Use `React.memo()` for expensive components
- Debounce search inputs and API calls
- Optimize images (WebP format, responsive sizes)
- Code splitting by route
- Bundle size monitoring with webpack-bundle-analyzer

### Backend
- Use database indexes for frequently queried fields
- Populate only required fields: `.populate('field', 'name email')`
- Use `.lean()` for read-only queries (faster)
- Cache frequently accessed data in Redis
- Batch database operations when possible
- Use connection pooling for MongoDB

### Query Optimization
- Limit result sets with pagination
- Project only needed fields: `.select('field1 field2')`
- Use compound indexes for multi-field queries
- Avoid N+1 queries with proper population
- Monitor slow queries with query analysis tools

## Accessibility Standards

### WCAG 2.1 AA Compliance
- All interactive elements must be keyboard accessible
- Proper ARIA labels and roles
- Color contrast ratio ≥ 4.5:1 for text
- Focus indicators visible on all interactive elements
- Screen reader friendly content
- Form validation with accessible error messages

### Testing
- Use `jest-axe` for automated a11y testing
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Custom matchers: `toBeAccessible()` for element validation

## Best Practices Summary

### DO
✅ Use TypeScript strict mode everywhere
✅ Import types from `@topsmile/types` package
✅ Write Portuguese user-facing messages
✅ Validate input on both client and server
✅ Use custom error classes for error handling
✅ Follow consistent response format
✅ Document all API endpoints with Swagger
✅ Write tests for new features (85%+ coverage)
✅ Use environment variables for configuration
✅ Implement proper error boundaries
✅ Log errors before responding
✅ Use middleware for cross-cutting concerns
✅ Separate business logic into service layer

### DON'T
❌ Use `any` type in TypeScript
❌ Commit `.env` files or secrets to git
❌ Skip input validation
❌ Return different response formats
❌ Use default JWT secrets in production
❌ Log sensitive data (passwords, tokens)
❌ Skip error handling in async functions
❌ Mix business logic in route handlers
❌ Use same JWT secret for staff and patients
❌ Skip CSRF protection on state-changing operations
❌ Ignore accessibility requirements
❌ Write English user-facing messages
❌ Skip database connection checks
