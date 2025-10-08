# TopSmile Development Guidelines

## Code Quality Standards

### TypeScript Configuration
- **Strict Mode**: Enabled across frontend and backend
- **Explicit Return Types**: All functions must declare return types
- **No Implicit Any**: Avoid `any` type; use proper type definitions
- **Type Imports**: Use `import type` for type-only imports from `@topsmile/types`
- **Shared Types**: Always use types from `@topsmile/types` package for cross-stack consistency

### File Headers
- Include file path comment at the top: `// backend/src/routes/auth.ts`
- Helps with navigation and debugging in large codebases

### Naming Conventions
- **Files**: camelCase for utilities, PascalCase for components/models
- **Variables/Functions**: camelCase (e.g., `getUserById`, `authService`)
- **Types/Interfaces**: PascalCase (e.g., `User`, `ApiResult`, `AuthenticatedRequest`)
- **Constants**: UPPER_SNAKE_CASE for true constants (e.g., `MAX_ATTEMPTS`)
- **Enums**: PascalCase with UPPER_CASE values (e.g., `AppointmentStatus.SCHEDULED`)

### Code Formatting
- **Indentation**: 2 spaces (no tabs)
- **Line Length**: Aim for 100-120 characters max
- **Semicolons**: Required at end of statements
- **Quotes**: Single quotes for strings, double quotes for JSX attributes
- **Trailing Commas**: Use in multi-line objects/arrays

## Backend Development Patterns

### Route Structure
```typescript
// Express router with validation and rate limiting
const router: express.Router = express.Router();

// Rate limiter configuration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Portuguese error message' }
});

// Validation rules using express-validator
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 }).trim().escape()
];

// Route handler with proper error handling
router.post('/login', authLimiter, loginValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }
    
    const result = await authService.login(req.body);
    
    return res.json({
      success: true,
      data: result.data,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    });
  } catch (error) {
    next(error);
    return;
  }
});
```

### Input Validation & Sanitization
- **Always validate**: Use express-validator for all user inputs
- **Sanitize inputs**: Use `.trim()`, `.escape()`, `.normalizeEmail()`
- **Portuguese messages**: All validation messages in Portuguese
- **Chain validators**: Combine multiple validation rules
- **Custom validators**: Use `.matches()` for regex patterns

### Response Format
```typescript
// Success response
{
  success: true,
  data: { /* payload */ },
  meta: {
    timestamp: new Date().toISOString(),
    requestId: req.requestId
  }
}

// Error response
{
  success: false,
  message: 'Portuguese error message',
  errors?: validationErrors
}
```

### Cookie Management
```typescript
// Set secure cookies for tokens
res.cookie('accessToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000 // 15 minutes
});
```

### Mongoose Model Patterns

#### Schema Definition
```typescript
// Use base schema fields and mixins
const AppointmentSchema = new Schema<IAppointment & Document>({
  ...baseSchemaFields,
  ...clinicScopedFields,
  ...auditableFields,
  
  // Field with validation
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Portuguese error message'],
    index: true
  },
  
  // Enum field
  status: {
    type: String,
    enum: Object.values(AppointmentStatus),
    default: AppointmentStatus.SCHEDULED,
    index: true
  },
  
  // String with validation
  notes: {
    type: String,
    maxlength: [1000, 'Portuguese error message']
  }
}, baseSchemaOptions);
```

#### Performance Indexes
```typescript
// Compound indexes for common queries
AppointmentSchema.index({ 
  clinic: 1, 
  scheduledStart: 1, 
  status: 1 
}, { 
  name: 'clinic_schedule_status',
  background: true
});

// Unique constraint with partial filter
AppointmentSchema.index(
  { provider: 1, scheduledStart: 1, scheduledEnd: 1 },
  {
    unique: true,
    partialFilterExpression: { 
      status: { $nin: ['cancelled', 'no_show'] } 
    }
  }
);
```

#### Pre-save Middleware
```typescript
AppointmentSchema.pre('save', function(next) {
  // Validation
  if (this.scheduledStart >= this.scheduledEnd) {
    return next(new Error('Portuguese error message'));
  }
  
  // Auto-calculations
  if (this.actualStart && this.actualEnd) {
    this.duration = Math.round(
      (this.actualEnd.getTime() - this.actualStart.getTime()) / (1000 * 60)
    );
  }
  
  // Status change handling
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

#### Static Methods with Aggregation
```typescript
AppointmentSchema.statics.findByTimeRange = function(
  clinicId: string,
  startDate: Date,
  endDate: Date,
  options = {}
) {
  return this.aggregate([
    { $match: { /* query */ } },
    { $lookup: { /* join */ } },
    { $unwind: { path: '$field', preserveNullAndEmptyArrays: true } },
    { $project: { /* fields */ } },
    { $sort: { scheduledStart: 1 } }
  ]);
};
```

### Error Handling
- **Try-catch blocks**: Wrap all async operations
- **Pass to middleware**: Use `next(error)` for error handling
- **Explicit returns**: Always return after sending response
- **Custom errors**: Use custom error classes (NotFoundError, UnauthorizedError)

## Frontend Development Patterns

### API Service Structure
```typescript
// Hierarchical API service organization
export const apiService = {
  appointments: {
    getAll: async (query?: Record<string, any>) => { /* ... */ },
    getOne: async (id: string) => { /* ... */ },
    create: async (payload: CreateAppointmentDTO) => { /* ... */ },
    update: async (id: string, payload: Partial<Appointment>) => { /* ... */ }
  },
  patients: { /* ... */ },
  providers: { /* ... */ }
};
```

### API Request Pattern
```typescript
async function getAppointment(id: string): Promise<ApiResult<Appointment>> {
  const res = await request<Appointment>(
    `/api/appointments/${encodeURIComponent(id)}`
  );
  
  if (res.ok && res.data) {
    return { success: true, data: res.data, message: res.message };
  }
  
  return { success: res.ok, data: res.data, message: res.message };
}
```

### URL Encoding
- **Always encode**: Use `encodeURIComponent()` for URL parameters
- **Query strings**: Build query strings with proper encoding
```typescript
const qs = query
  ? '?' + Object.entries(query)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&')
  : '';
```

### React Hooks Patterns

#### Custom Hook Structure
```typescript
export const useAccessibility = (options: AccessibilityOptions = {}) => {
  // Destructure options with defaults
  const {
    announcePageChanges = true,
    manageFocus = true,
    trapFocus = false
  } = options;
  
  // Refs for state management
  const focusTrapRef = useRef<HTMLElement | null>(null);
  
  // Memoized callbacks
  const announceToScreenReader = useCallback((message: string) => {
    // Implementation
  }, []);
  
  // Effects with cleanup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { /* ... */ };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dependencies]);
  
  // Return public API
  return {
    announceToScreenReader,
    focusElement,
    skipToMain
  };
};
```

#### Hook Best Practices
- **useCallback**: Memoize functions passed as props or used in effects
- **useRef**: For DOM references and mutable values that don't trigger re-renders
- **Cleanup functions**: Always return cleanup in useEffect when adding listeners
- **Dependency arrays**: Include all external dependencies

## Security Patterns

### Authentication & Authorization
- **JWT tokens**: Access token (15 min) + Refresh token (7 days)
- **HTTP-only cookies**: Store tokens in secure cookies
- **CSRF protection**: Global CSRF middleware on all routes
- **Rate limiting**: Apply to authentication endpoints
- **Role-based access**: Use permission system from `config/permissions.ts`

### Permission Checking
```typescript
// 8 roles with granular permissions
export const rolePermissions: Record<string, Permission[]> = {
  super_admin: [/* all permissions */],
  admin: [/* most permissions */],
  dentist: ['patients:read', 'clinical:write', /* ... */],
  receptionist: ['appointments:write', 'billing:read']
};

// Helper functions
hasPermission(role, 'patients:write');
hasAnyPermission(role, ['patients:read', 'patients:write']);
hasAllPermissions(role, ['clinical:read', 'clinical:write']);
```

### Input Sanitization
- **DOMPurify**: Use for HTML content sanitization
- **express-mongo-sanitize**: Prevent MongoDB injection
- **Validation first**: Always validate before sanitizing
- **Escape output**: Use `.escape()` in validators

## Accessibility Standards

### WCAG 2.1 AA Compliance
- **Keyboard navigation**: All interactive elements accessible via keyboard
- **Screen reader support**: Proper ARIA labels and live regions
- **Focus management**: Visible focus indicators and logical tab order
- **Color contrast**: Minimum 4.5:1 ratio for text
- **Skip links**: Alt+S to skip to main content

### ARIA Patterns
```typescript
// Announce to screen readers
announceToScreenReader('Portuguese message', 'polite');

// Focus management
focusElement('#main-content');

// Focus trap for modals
enableFocusTrap(modalElement);
disableFocusTrap();

// ARIA attributes
setAriaLabel(element, 'Portuguese label');
setAriaExpanded(element, true);
```

### Keyboard Shortcuts
- **Alt + S**: Skip to main content
- **Alt + M**: Open main menu
- **Alt + H**: Go to home
- **Tab/Shift+Tab**: Navigate focusable elements
- **Escape**: Close modals/dialogs

## Testing Standards

### Test Coverage Targets
- **Frontend**: 85%+ coverage
- **Backend**: 90%+ coverage
- **E2E**: Critical user flows

### Test Organization
```
tests/
├── unit/          # Isolated unit tests
├── integration/   # API integration tests
├── e2e/           # End-to-end flows
├── performance/   # Load and performance tests
├── fixtures/      # Test data
└── helpers/       # Test utilities
```

## Performance Optimization

### Database Query Optimization
- **Indexes**: Create compound indexes for common queries
- **Aggregation**: Use aggregation pipeline for complex queries
- **Projection**: Only select needed fields
- **Pagination**: Implement for large result sets
- **Background indexes**: Use `background: true` for production

### Frontend Performance
- **Code splitting**: Lazy load routes and components
- **Memoization**: Use React.memo, useMemo, useCallback
- **Bundle analysis**: Monitor bundle size with webpack-bundle-analyzer
- **Performance targets**: <1.2s initial load, <0.8s tab switch

## Internationalization

### Portuguese Messages
- **All user-facing text**: Must be in Portuguese (pt-BR)
- **Error messages**: Portuguese validation and error messages
- **API responses**: Portuguese success/error messages
- **UI labels**: Portuguese labels and descriptions
- **Date/time**: Use Luxon with pt-BR locale

### Message Examples
```typescript
// Validation messages
'Nome deve ter entre 2 e 100 caracteres'
'Digite um e-mail válido'
'Senha deve ter pelo menos 6 caracteres'

// Error messages
'Dados inválidos'
'Usuário não autenticado'
'Muitas tentativas de login'

// Success messages
'Senha alterada com sucesso'
'Logout realizado com sucesso'
```

## Documentation Standards

### Code Comments
- **Swagger/JSDoc**: Document all API endpoints
- **Complex logic**: Explain non-obvious implementations
- **TODOs**: Use `// TODO:` for future improvements
- **Type annotations**: Let TypeScript types serve as documentation

### Swagger Documentation
```typescript
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login
 *     description: Autentica um usuário e retorna tokens de acesso
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
```

## Git Workflow

### Commit Messages
- Use conventional commits format
- Write in English for commits
- Be descriptive and concise

### Branch Strategy
- `main`: Production-ready code
- Feature branches: `feature/feature-name`
- Bug fixes: `fix/bug-description`
- Pull requests required for merging

## Environment Configuration

### Environment Variables
- **Never commit**: .env files excluded from git
- **Examples provided**: .env.example for reference
- **Validation**: Validate required env vars on startup
- **Secrets rotation**: Regular rotation of JWT secrets

### Required Variables
```bash
# Backend
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/topsmile
REDIS_URL=redis://localhost:6379
JWT_SECRET=min-32-chars
JWT_REFRESH_SECRET=min-32-chars

# Frontend
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Code Review Checklist

- [ ] TypeScript strict mode compliance
- [ ] Proper error handling with try-catch
- [ ] Input validation and sanitization
- [ ] Portuguese user-facing messages
- [ ] Proper indexes on database queries
- [ ] Security best practices followed
- [ ] Accessibility standards met
- [ ] Tests written and passing
- [ ] No console.logs in production code
- [ ] Documentation updated
