# TopSmile - Development Guidelines

## Code Quality Standards

### TypeScript Usage
- **Strict Mode**: All code uses TypeScript strict mode
- **Type Safety**: Explicit types for function parameters and return values
- **Type Imports**: Use `import type` for type-only imports from `@topsmile/types`
- **No Any**: Avoid `any` type; use proper typing or `unknown` with type guards
- **Interface vs Type**: Prefer `interface` for object shapes, `type` for unions/intersections

### Code Formatting
- **Indentation**: 2 spaces (no tabs)
- **Semicolons**: Required at end of statements
- **Quotes**: Single quotes for strings (except JSON)
- **Line Length**: Keep lines under 100 characters when practical
- **Trailing Commas**: Use in multi-line arrays and objects

### Naming Conventions
- **Files**: camelCase for utilities, PascalCase for components (e.g., `emailService.ts`, `LoginPage.tsx`)
- **Components**: PascalCase (e.g., `PatientDashboard`, `AppointmentCard`)
- **Functions**: camelCase (e.g., `createAppointment`, `validateEmail`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_EMAIL_RETRIES`, `ROLE_HIERARCHY`)
- **Interfaces**: PascalCase, no "I" prefix (e.g., `User`, `ResourcePermissions`)
- **Types**: PascalCase (e.g., `UserRole`, `EmailTask`)
- **Private Methods**: camelCase with `private` keyword (e.g., `private processQueue()`)

### Documentation
- **JSDoc Comments**: Use for public APIs and complex functions
- **Swagger/OpenAPI**: Document all API endpoints with `@swagger` tags
- **Portuguese Messages**: All user-facing messages in Portuguese (BR)
- **Code Comments**: Explain "why" not "what" - code should be self-documenting

## Backend Patterns

### API Route Structure
```typescript
// Standard pattern observed in appointments.ts
router.method("/path", 
  middleware1,
  middleware2,
  validationArray,
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }
      
      // Business logic
      const result = await service.method(params);
      
      // Success response
      return res.status(200).json({
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (authReq as any).requestId
        }
      });
    } catch (err: any) {
      console.error('Error description:', err);
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }
);
```

### Response Format
All API responses follow this structure:
```typescript
// Success response
{
  success: true,
  data: any,
  meta?: {
    timestamp: string,
    requestId?: string,
    pagination?: {
      page: number,
      limit: number,
      total: number,
      pages: number,
      hasNext: boolean,
      hasPrev: boolean
    }
  }
}

// Error response
{
  success: false,
  message?: string,
  error?: string,
  code?: string,
  errors?: ValidationError[],
  details?: any
}
```

### Validation Pattern
- Use `express-validator` for request validation
- Define validation arrays before routes
- Validate early, return 400 with detailed errors
- Portuguese error messages

```typescript
const validationArray = [
  body('field')
    .isType()
    .withMessage('Mensagem de erro em português'),
  body('optional')
    .optional()
    .isType()
];
```

### Authentication & Authorization
- All protected routes use `authenticate` middleware
- Role-based access with `authorize(...roles)` middleware
- Resource permissions with `requirePermission(resource, action)`
- Clinic isolation with `requireSameClinic()`
- Patient routes use `authenticatePatient` + `requirePatientEmailVerification`

### Error Handling
- Try-catch blocks in all async route handlers
- Log errors with `console.error()` including context
- Return appropriate HTTP status codes (400, 401, 403, 404, 500)
- Include error messages in response
- Never expose sensitive information in errors

### Service Layer Pattern
```typescript
class ServiceName {
  private property: Type;
  private readonly CONSTANT = value;
  
  constructor() {
    // Initialization
  }
  
  private privateMethod(): ReturnType {
    // Internal logic
  }
  
  async publicMethod(params: Type): Promise<ReturnType> {
    // Business logic
    // Call private methods
    // Return result
  }
}

export const serviceName = new ServiceName();
```

### Async Queue Pattern
- Use queues for non-critical async operations (emails, notifications)
- Implement retry logic with exponential backoff
- Track retry attempts and max retries
- Process queue in background without blocking requests
- Example: `emailService` with `emailQueue` and `processQueue()`

### Database Patterns
- Use Mongoose models for MongoDB
- Populate related documents with `.populate()`
- Select specific fields to minimize data transfer
- Check clinic access before operations
- Use indexes for frequently queried fields

## Frontend Patterns

### Component Structure
```typescript
import React from 'react';
import { useHook } from '../hooks/useHook';
import type { ComponentProps } from '@topsmile/types';

interface Props {
  prop1: string;
  prop2?: number;
}

const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // Hooks at top
  const { data, loading } = useHook();
  
  // Event handlers
  const handleEvent = () => {
    // Logic
  };
  
  // Render logic
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### Accessibility Requirements
- **WCAG 2.1 AA Compliance**: All components must meet accessibility standards
- **Semantic HTML**: Use proper HTML5 elements (header, nav, main, section, article)
- **ARIA Attributes**: Add `aria-label`, `aria-labelledby`, `aria-describedby` where needed
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Tab Order**: Logical tab order with `tabIndex="0"` for focusable elements
- **Focus Management**: Visible focus indicators, focus traps for modals
- **Screen Readers**: Use `aria-live` regions for dynamic content
- **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Form Labels**: Every input has associated label or `aria-label`
- **Heading Hierarchy**: Proper h1-h6 structure without skipping levels

### Testing Patterns
```typescript
describe('Component/Feature Name', () => {
  it('should describe expected behavior', async () => {
    // Arrange
    const { container } = render(
      <Provider>
        <Component />
      </Provider>
    );
    
    // Act
    const element = container.querySelector('selector');
    
    // Assert
    expect(element).toHaveAttribute('expected');
  });
  
  it('should have no accessibility violations', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### State Management
- **React Query**: Server state, caching, and data fetching
- **Zustand**: Global UI state (auth, app settings)
- **React Context**: Scoped state (auth, errors)
- **Local State**: Component-specific state with `useState`

### API Integration
- Use centralized `apiService` for all API calls
- Handle loading, error, and success states
- Use React Query for automatic caching and refetching
- Type API responses with shared types from `@topsmile/types`

## Security Practices

### Authentication
- JWT tokens with refresh mechanism
- Secure token storage (httpOnly cookies preferred)
- Token expiration and renewal
- Multi-factor authentication (MFA) support
- Session management with device tracking

### Authorization
- Role-based access control (RBAC)
- Resource-level permissions
- Clinic-level data isolation
- Ownership verification for user resources

### Input Validation
- Validate all user input on backend
- Sanitize HTML content with DOMPurify
- Prevent MongoDB injection with express-mongo-sanitize
- Use parameterized queries
- Validate file uploads

### Security Headers
- Helmet.js for security headers
- CORS configuration
- CSRF protection with csurf
- Rate limiting with express-rate-limit
- Content Security Policy (CSP)

### Data Protection
- Hash passwords with bcrypt (10+ rounds)
- Never log sensitive data (passwords, tokens, PII)
- Encrypt sensitive data at rest
- Use HTTPS in production
- Audit logging for sensitive operations

## Performance Optimization

### Backend
- Database indexing for frequent queries
- Connection pooling (MongoDB, Redis)
- Caching with Redis
- Pagination for large datasets
- Lazy loading of related documents
- Rate limiting to prevent abuse

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Bundle size monitoring
- Memoization with React.memo, useMemo, useCallback
- Virtual scrolling for long lists
- Debouncing/throttling for expensive operations

## Internationalization

### Language
- **Primary Language**: Portuguese (Brazil)
- **User Messages**: All UI text in Portuguese
- **Error Messages**: Portuguese with technical details
- **API Documentation**: English (Swagger/OpenAPI)
- **Code Comments**: English
- **Variable Names**: English

### Date/Time
- Use `date-fns` or `luxon` for date manipulation
- Store dates in UTC
- Display dates in user's timezone
- Format dates according to Brazilian standards (DD/MM/YYYY)

## Git Workflow

### Commit Messages
- Use conventional commits format
- Write in English
- Be descriptive but concise
- Reference issue numbers when applicable

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `fix/*`: Bug fixes
- `refactor/*`: Code refactoring

## Testing Requirements

### Coverage Targets
- Unit tests: >80% coverage
- Integration tests: Critical paths
- E2E tests: User workflows
- Accessibility tests: All components

### Test Organization
- Co-locate tests with source files or in `tests/` directory
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Mock external dependencies
- Use test fixtures for consistent data

## Common Patterns

### Error Handling
```typescript
try {
  const result = await operation();
  return result;
} catch (err: any) {
  console.error('Context:', err);
  throw new CustomError('User message', err);
}
```

### Async/Await
- Always use async/await over promises
- Handle errors with try-catch
- Avoid callback hell
- Use Promise.all() for parallel operations

### Type Guards
```typescript
function isType(value: unknown): value is Type {
  return typeof value === 'object' && value !== null && 'property' in value;
}
```

### Shared Types
- Import from `@topsmile/types` package
- Never duplicate type definitions
- Use type imports: `import type { User } from '@topsmile/types'`
- Run `npm run migrate-types` to check for issues

## Code Review Checklist

- [ ] TypeScript strict mode compliance
- [ ] Proper error handling
- [ ] Input validation
- [ ] Security considerations
- [ ] Accessibility compliance
- [ ] Test coverage
- [ ] Documentation (JSDoc, Swagger)
- [ ] Portuguese user messages
- [ ] No console.log in production code
- [ ] Proper type imports from @topsmile/types
- [ ] Response format consistency
- [ ] Authentication/authorization checks
