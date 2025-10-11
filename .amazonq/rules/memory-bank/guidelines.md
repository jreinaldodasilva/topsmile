# TopSmile - Development Guidelines

## Code Quality Standards

### Indentation and Formatting
- **Indentation**: 4 spaces (consistent across all files)
- **Line Length**: Prefer lines under 120 characters
- **Semicolons**: Always use semicolons
- **Quotes**: Single quotes for strings, double quotes for JSX attributes
- **Trailing Commas**: Use in multi-line objects and arrays

### Naming Conventions
- **Variables/Functions**: camelCase (`appointmentType`, `createAppointment`)
- **Types/Interfaces/Classes**: PascalCase (`AppointmentType`, `AuthenticatedRequest`)
- **Constants**: UPPER_SNAKE_CASE (`TEST_CREDENTIALS`, `MAX_REFRESH_TOKENS`)
- **Files**: camelCase for utilities, PascalCase for components (`appointmentTypes.ts`, `AuthContext.tsx`)
- **Database Fields**: camelCase (`scheduledStart`, `clinicId`)

### Import Organization
Imports are grouped in this order:
1. External dependencies (React, Express, third-party libraries)
2. Type imports from `@topsmile/types`
3. Internal modules (services, middleware, utils)
4. Relative imports (components, hooks)
5. Type-only imports at the end

Example:
```typescript
import express, { Request, Response } from 'express';
import { authenticate, authorize } from '../../middleware/auth/auth';
import type { Appointment, AppointmentType } from '@topsmile/types';
import { appointmentTypeService } from '../../services/scheduling/appointmentTypeService';
import logger from '../../utils/logger';
```

### User-Facing Messages
- **Language**: All user-facing messages MUST be in Portuguese (Brazil)
- **Error Messages**: Clear, actionable, and user-friendly
- **Validation Messages**: Specific to the field and constraint
- **Success Messages**: Confirm the action completed

Examples:
```typescript
'Tipo de agendamento criado com sucesso'
'Nome deve ter entre 2 e 100 caracteres'
'Clínica não identificada'
'Erro ao criar tipo de agendamento'
```

## TypeScript Standards

### Type Safety
- **Explicit Types**: Use explicit types for function parameters and return values
- **Avoid `any`**: Use `unknown` or proper types instead
- **Type Guards**: Implement runtime type checking when needed
- **Shared Types**: Import from `@topsmile/types` for cross-boundary types

Example:
```typescript
// Good - explicit types
async function createAppointmentType(data: AppointmentTypeData): Promise<AppointmentType> {
    // implementation
}

// Bad - implicit any
async function createAppointmentType(data) {
    // implementation
}
```

### Interface vs Type
- **Interfaces**: For object shapes, especially when extending
- **Types**: For unions, intersections, and complex types
- **Shared Types**: Always use types from `@topsmile/types` package

### Type Imports
- Use `import type` for type-only imports to improve build performance
- Separate type imports from value imports

```typescript
import type { User, Patient, Appointment } from '@topsmile/types';
import { appointmentService } from '../../services/appointmentService';
```

## Backend Patterns

### Route Structure
Routes follow a consistent pattern:
1. Import dependencies
2. Create router
3. Apply middleware (authentication, authorization)
4. Define validation rules
5. Implement route handlers with Swagger documentation
6. Export router

Example:
```typescript
const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Validation rules
const createValidation = [
    body('name').trim().isLength({ min: 2, max: 100 }),
    // more validations
];

// Route handler with Swagger docs
/**
 * @swagger
 * /api/resource:
 *   post:
 *     summary: Create resource
 */
router.post('/', authorize('admin'), createValidation, async (req, res) => {
    // implementation
});
```

### Request Validation
- Use `express-validator` for all input validation
- Validate query parameters, body, and path parameters
- Return Portuguese error messages
- Check validation results before processing

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

### Response Format
All API responses follow a consistent structure:

**Success Response:**
```typescript
return res.status(200).json({
    success: true,
    data: result,
    meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
    }
});
```

**Error Response:**
```typescript
return res.status(400).json({
    success: false,
    message: 'Mensagem de erro em português'
});
```

**Paginated Response:**
```typescript
return res.json({
    success: true,
    data: {
        items: results,
        pagination: {
            page: 1,
            limit: 20,
            total: 100,
            pages: 5
        }
    }
});
```

### Error Handling
- Use try-catch blocks for all async operations
- Log errors with context using `logger.error()`
- Return user-friendly Portuguese error messages
- Include appropriate HTTP status codes

```typescript
try {
    const result = await service.operation();
    return res.json({ success: true, data: result });
} catch (error: any) {
    logger.error({ error }, 'Error description:');
    return res.status(400).json({
        success: false,
        message: error.message || 'Mensagem padrão de erro'
    });
}
```

### Authentication & Authorization
- Use `authenticate` middleware for protected routes
- Use `authorize(...roles)` for role-based access control
- Access user info via `(req as AuthenticatedRequest).user`
- Always verify `clinicId` for multi-tenant operations

```typescript
router.post('/',
    authenticate,
    authorize('super_admin', 'admin', 'manager'),
    async (req: Request, res: Response) => {
        const authReq = req as AuthenticatedRequest;
        if (!authReq.user?.clinicId) {
            return res.status(400).json({
                success: false,
                message: 'Clínica não identificada'
            });
        }
        // implementation
    }
);
```

## Database Patterns

### Mongoose Models
- Use schema mixins for common fields (`baseSchemaFields`, `clinicScopedFields`, `auditableFields`)
- Define indexes for frequently queried fields
- Use background indexes for large collections
- Implement pre-save hooks for validation and computed fields
- Add static methods for complex queries

Example:
```typescript
const AppointmentSchema = new Schema<IAppointment & Document>({
    ...baseSchemaFields,
    ...clinicScopedFields,
    ...auditableFields,
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Paciente é obrigatório'],
        index: true
    },
    // more fields
});

// Indexes
AppointmentSchema.index({ 
    clinic: 1, 
    scheduledStart: 1, 
    status: 1 
}, { 
    name: 'clinic_schedule_status',
    background: true
});

// Pre-save hook
AppointmentSchema.pre('save', function(next) {
    // validation and computed fields
    next();
});

// Static methods
AppointmentSchema.statics.findByTimeRange = function(clinicId, startDate, endDate) {
    // implementation
};
```

### Query Optimization
- Use aggregation pipelines for complex queries
- Populate related documents only when needed
- Project only required fields
- Use indexes for filtering and sorting
- Implement pagination for large result sets

### Data Validation
- Required fields with Portuguese error messages
- Min/max constraints with descriptive messages
- Custom validators for complex rules
- Enum validation for fixed value sets

## Frontend Patterns

### Component Structure
- Functional components with hooks
- Props interface defined at the top
- Destructure props in function signature
- Group related state with hooks
- Separate business logic into custom hooks

Example:
```typescript
interface PatientFormProps {
    patient?: Patient;
    onSubmit: (data: PatientData) => void;
    onCancel: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ 
    patient, 
    onSubmit, 
    onCancel 
}) => {
    const [formData, setFormData] = useState<PatientData>(initialData);
    const { errors, validate } = useFormValidation();
    
    // implementation
};
```

### State Management
- **Local State**: `useState` for component-specific state
- **Context**: Authentication, error handling, theme
- **Zustand**: Global application state (app store, clinical store)
- **TanStack Query**: Server state, caching, optimistic updates

### Custom Hooks
- Prefix with `use` (e.g., `usePatientForm`, `useAppointmentCalendar`)
- Encapsulate reusable logic
- Return objects with clear property names
- Handle cleanup in `useEffect`

### API Integration
- Use TanStack Query for data fetching
- Implement optimistic updates for better UX
- Handle loading and error states
- Use query keys for cache management

```typescript
const { data, isLoading, error } = useQuery({
    queryKey: ['patients', filters],
    queryFn: () => apiService.patients.list(filters)
});
```

### Error Handling
- Display user-friendly error messages in Portuguese
- Use toast notifications for feedback
- Implement error boundaries for component errors
- Log errors for debugging

## Testing Standards

### Test Organization
- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints and workflows
- **E2E Tests**: Complete user journeys
- **Accessibility Tests**: A11y compliance

### Test Structure
- Use `describe` blocks for grouping
- Clear test names describing behavior
- Arrange-Act-Assert pattern
- Mock external dependencies

Example:
```typescript
describe('PatientForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should submit valid patient data', async () => {
        // Arrange
        const mockSubmit = jest.fn();
        render(<PatientForm onSubmit={mockSubmit} />);
        
        // Act
        await userEvent.type(screen.getByLabelText(/nome/i), 'João Silva');
        await userEvent.click(screen.getByRole('button', { name: /salvar/i }));
        
        // Assert
        expect(mockSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ name: 'João Silva' })
        );
    });
});
```

### Mock Data
- Use `@faker-js/faker` for realistic test data
- Create reusable mock generators
- Override specific fields as needed
- Use Brazilian locale for phone, CPF, addresses

```typescript
export const generateMockPatient = (overrides = {}) => ({
    _id: faker.database.mongodbObjectId(),
    firstName: faker.name.firstName(),
    phone: faker.helpers.replaceSymbols('(##) #####-####'),
    // more fields
    ...overrides
});
```

## API Documentation

### Swagger/OpenAPI
- Document all endpoints with `@swagger` comments
- Include request/response schemas
- Specify authentication requirements
- Provide example values
- Use Portuguese descriptions

Example:
```typescript
/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Criar agendamento
 *     description: Cria um novo agendamento na clínica
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppointmentRequest'
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 */
```

## Security Best Practices

### Authentication
- JWT tokens with short expiration (15min access, 7 days refresh)
- HttpOnly cookies for token storage
- Refresh token rotation
- Redis-based token blacklist

### Input Validation
- Validate all user inputs
- Sanitize data to prevent XSS
- Use parameterized queries to prevent SQL/NoSQL injection
- Implement rate limiting

### Authorization
- Role-based access control (RBAC)
- Verify clinic ownership for multi-tenant operations
- Check permissions at route level
- Audit sensitive operations

### Data Protection
- Hash passwords with bcrypt
- Encrypt sensitive data at rest
- Use HTTPS in production
- Implement CSRF protection

## Performance Optimization

### Backend
- Use database indexes for frequent queries
- Implement caching with Redis
- Paginate large result sets
- Use aggregation pipelines for complex queries
- Compress responses with gzip

### Frontend
- Code splitting with lazy loading
- Optimize images and assets
- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Cache API responses with TanStack Query

## Logging

### Backend Logging
- Use Pino for structured logging
- Log levels: error, warn, info, debug
- Include context (requestId, userId, clinicId)
- Log errors with stack traces
- Avoid logging sensitive data

```typescript
logger.error({ error, userId, clinicId }, 'Error creating appointment');
logger.info({ appointmentId, status }, 'Appointment status updated');
```

### Frontend Logging
- Log errors to console in development
- Send errors to monitoring service in production
- Include user context and error details
- Implement performance monitoring

## Code Review Checklist

- [ ] Code follows naming conventions
- [ ] All user-facing messages in Portuguese
- [ ] TypeScript types are explicit and correct
- [ ] Input validation implemented
- [ ] Error handling with try-catch
- [ ] Authentication/authorization applied
- [ ] Database indexes for new queries
- [ ] Tests written and passing
- [ ] API documentation updated
- [ ] No sensitive data in logs
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
