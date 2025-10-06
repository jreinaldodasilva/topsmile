# TopSmile - Development Guidelines

## Code Quality Standards

### TypeScript Configuration
- **Strict Mode**: TypeScript strict mode enabled across the project
- **Type Safety**: Explicit types required, avoid `any` unless absolutely necessary
- **Import Types**: Use type imports from `@topsmile/types` for shared interfaces
- **Type Annotations**: Function parameters and return types must be explicitly typed

### Code Formatting
- **Indentation**: 4 spaces for TypeScript/JavaScript files
- **Line Length**: Aim for 120 characters maximum
- **Semicolons**: Required at end of statements
- **Quotes**: Single quotes for strings, double quotes in JSX
- **Trailing Commas**: Used in multi-line objects and arrays
- **Arrow Functions**: Preferred over function expressions

### Naming Conventions
- **Files**: camelCase for utilities, PascalCase for components/models
- **Components**: PascalCase (e.g., `PatientNavigation.tsx`)
- **Services**: camelCase with 'Service' suffix (e.g., `schedulingService`)
- **Models**: PascalCase matching entity name (e.g., `Patient.ts`)
- **Interfaces**: PascalCase with 'I' prefix for type definitions (e.g., `IPatient`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Variables**: camelCase for local variables and parameters
- **Private Methods**: Prefix with underscore is not used; rely on TypeScript `private` keyword

### Documentation Standards
- **JSDoc Comments**: Required for all public APIs and complex functions
- **Swagger Documentation**: All API endpoints documented with @swagger tags
- **Portuguese Messages**: User-facing messages in Portuguese (Brazilian)
- **English Code**: Code, variables, and internal comments in English
- **Inline Comments**: Used sparingly, only for complex logic explanation

## Backend Patterns

### Route Structure
```typescript
// Standard route pattern
router.METHOD("/path", 
  authenticate,                    // Authentication middleware
  authorize('role1', 'role2'),    // Authorization middleware
  validationMiddleware,            // Request validation
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    try {
      // Business logic via service layer
      const result = await service.method(authReq.user!.clinicId!, params);
      
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
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
  }
);
```

### Response Format
All API responses follow consistent structure:
```typescript
// Success response
{
  success: true,
  data: <result>,
  meta: {
    timestamp: string,
    requestId: string
  }
}

// Error response
{
  success: false,
  error: string,
  message?: string,
  errors?: ValidationError[]
}

// Paginated response
{
  success: true,
  data: {
    items: <array>,
    pagination: {
      page: number,
      limit: number,
      total: number,
      pages: number,
      hasNext: boolean,
      hasPrev: boolean
    }
  },
  meta: { ... }
}
```

### Service Layer Pattern
```typescript
class ServiceName {
  /**
   * Method description
   * IMPROVED/FIXED/ADDED tags indicate recent changes
   */
  async methodName(params: ParamsType): Promise<ResultType> {
    // Transaction handling for critical operations
    const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID;
    const session = isTestEnv ? null : await mongoose.startSession();
    
    try {
      if (!isTestEnv) {
        session!.startTransaction();
      }
      
      // Validation
      if (!requiredParam) {
        throw new Error('Mensagem de erro em português');
      }
      
      // Business logic with session support
      const result = await Model.findById(id).session(session);
      
      if (!isTestEnv) {
        await session!.commitTransaction();
      }
      
      return {
        success: true,
        data: result
      };
      
    } catch (error) {
      if (!isTestEnv && session) {
        await session.abortTransaction();
      }
      console.error('Error context:', error);
      
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
}

export const serviceName = new ServiceName();
```

### Model Patterns
```typescript
// Schema definition with validation
const ModelSchema = new Schema<IModel & Document>({
  ...baseSchemaFields,           // Timestamps and soft delete
  ...clinicScopedFields,         // Multi-tenancy support
  
  fieldName: {
    type: String,
    required: [true, 'Mensagem de erro em português'],
    trim: true,
    minlength: [2, 'Mensagem de validação'],
    maxlength: [100, 'Mensagem de validação'],
    validate: {
      validator: (value: string) => /regex/.test(value),
      message: 'Mensagem de validação em português'
    }
  }
}, {
  ...baseSchemaOptions,
  toJSON: { virtuals: true }
});

// Pre-save hooks for data normalization
ModelSchema.pre('save', function(next) {
  // Normalize data (phone, CPF, etc.)
  next();
});

// Virtual fields
ModelSchema.virtual('computedField').get(function() {
  return this.field1 + this.field2;
});

// Optimized compound indexes
ModelSchema.index({ clinic: 1, field1: 1, field2: 1 }, { 
  name: 'descriptive_index_name', 
  background: true 
});

export const Model = mongoose.model<IModel & Document>('Model', ModelSchema);
```

### Validation Patterns
```typescript
// Express-validator usage
const validationRules = [
  body('fieldName')
    .isMongoId()
    .withMessage('Mensagem de erro em português'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('E-mail inválido'),
  
  body('phone')
    .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato brasileiro'),
  
  body('optional')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Campo muito longo')
];

// Validation check in route
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({
    success: false,
    message: 'Dados inválidos',
    errors: errors.array()
  });
}
```

### Custom Validators
```typescript
// Brazilian-specific validators
const validateCPF = (cpf: string | undefined): boolean => {
  if (cpf == null) return true; // Optional field
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }
  // CPF validation algorithm
  // ... (checksum validation)
  return true;
};

const validateBrazilianPhone = (phone: string | undefined): boolean => {
  if (phone == null) return false;
  const cleanPhone = phone.replace(/[^\d]/g, '');
  const isMobile = cleanPhone.length === 11;
  const isLandline = cleanPhone.length === 10;
  if (!(isMobile || isLandline)) return false;
  const areaCode = parseInt(cleanPhone.substring(0, 2));
  return areaCode >= 11 && areaCode <= 99;
};

const validateBrazilianZipCode = (zipCode: string | undefined): boolean => {
  if (zipCode == null) return true;
  return /^\d{5}-?\d{3}$/.test(zipCode);
};
```

### Error Handling
```typescript
// Consistent error handling pattern
try {
  // Operation
} catch (err: any) {
  console.error('Descriptive error context:', err);
  return res.status(statusCode).json({
    success: false,
    error: err.message
  });
}

// Service layer error handling
catch (error) {
  console.error('Error context:', error);
  return {
    success: false,
    error: error instanceof Error ? error.message : 'Fallback message'
  };
}
```

## Frontend Patterns

### Component Structure
```typescript
// Functional component with TypeScript
interface ComponentProps {
  prop1: string;
  prop2?: number;
  onAction: (data: DataType) => void;
}

export const ComponentName: React.FC<ComponentProps> = ({ 
  prop1, 
  prop2 = defaultValue,
  onAction 
}) => {
  // Hooks at top
  const [state, setState] = useState<StateType>(initialValue);
  const { data, isLoading, error } = useApiQuery<DataType>('/api/endpoint');
  
  // Event handlers
  const handleAction = useCallback((event: React.MouseEvent) => {
    // Handler logic
    onAction(data);
  }, [data, onAction]);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Early returns for loading/error states
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  // Main render
  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};
```

### State Management
```typescript
// Zustand store pattern
interface StoreState {
  data: DataType[];
  selectedItem: DataType | null;
  isLoading: boolean;
  error: string | null;
}

interface StoreActions {
  setData: (data: DataType[]) => void;
  selectItem: (item: DataType | null) => void;
  clearError: () => void;
}

export const useStore = create<StoreState & StoreActions>((set) => ({
  // Initial state
  data: [],
  selectedItem: null,
  isLoading: false,
  error: null,
  
  // Actions
  setData: (data) => set({ data }),
  selectItem: (item) => set({ selectedItem: item }),
  clearError: () => set({ error: null })
}));
```

### API Service Pattern
```typescript
// Service class with retry logic
class ServiceName {
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_INTERVALS = [1000, 2000, 5000];
  
  async method(params: ParamsType): Promise<ResultType> {
    try {
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(params)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error context:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error message'
      };
    }
  }
  
  // Retry logic for critical operations
  async retryMethod(params: ParamsType, retryCount: number = 0): Promise<ResultType> {
    if (retryCount >= this.MAX_RETRIES) {
      return { success: false, error: 'Maximum retry attempts exceeded' };
    }
    
    const interval = this.RETRY_INTERVALS[retryCount] || 5000;
    await new Promise(resolve => setTimeout(resolve, interval));
    
    return this.method(params);
  }
}

export const serviceName = new ServiceName();
```

### Custom Hooks
```typescript
// Reusable hook pattern
export const useCustomHook = <T>(initialValue: T) => {
  const [state, setState] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const performAction = useCallback(async (params: ParamsType) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiCall(params);
      setState(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return { state, isLoading, error, performAction };
};
```

## Database Patterns

### Multi-Tenancy
- All models include `clinic` field for data isolation
- Queries always filter by `clinicId` from authenticated user
- Indexes include `clinic` as first field in compound indexes

### Indexing Strategy
```typescript
// Compound indexes for common queries
Schema.index({ clinic: 1, status: 1, date: -1 }, { 
  name: 'clinic_status_date', 
  background: true 
});

// Unique indexes with clinic scope
Schema.index({ clinic: 1, email: 1 }, { 
  unique: true, 
  sparse: true,
  name: 'clinic_email_unique'
});

// Text indexes for search
Schema.index({ 
  firstName: 'text', 
  lastName: 'text', 
  email: 'text' 
}, { 
  name: 'patient_search' 
});
```

### Query Optimization
```typescript
// Use lean() for read-only queries
const results = await Model.find(query).lean();

// Select only needed fields
const results = await Model.find(query)
  .select('field1 field2 field3')
  .lean();

// Populate with field selection
const results = await Model.find(query)
  .populate('relation', 'name email')
  .lean();

// Parallel queries for better performance
const [data1, data2] = await Promise.all([
  Model1.find(query1).lean(),
  Model2.find(query2).lean()
]);
```

## Security Patterns

### Authentication Flow
1. JWT tokens stored in localStorage
2. Access token (15min) + Refresh token (7 days)
3. Token refresh on 401 responses
4. Automatic logout on refresh failure

### Authorization Checks
```typescript
// Route-level authorization
router.post('/endpoint', 
  authenticate,
  authorize('admin', 'manager'),
  handler
);

// Permission-based checks
if (!hasPermission(user.role, 'patients:write')) {
  return res.status(403).json({ 
    success: false, 
    error: 'Acesso negado' 
  });
}

// Clinic-scoped data access
if (resource.clinic.toString() !== user.clinicId) {
  return res.status(403).json({ 
    success: false, 
    error: 'Acesso negado' 
  });
}
```

### Input Sanitization
- All user inputs validated with express-validator
- MongoDB queries sanitized with express-mongo-sanitize
- HTML content sanitized with DOMPurify
- File uploads validated for type and size

## Testing Patterns

### Unit Tests
```typescript
describe('ServiceName', () => {
  describe('methodName', () => {
    it('should return expected result for valid input', async () => {
      const result = await service.method(validParams);
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
    
    it('should handle error case appropriately', async () => {
      const result = await service.method(invalidParams);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
```

### Integration Tests
```typescript
describe('API Endpoint', () => {
  it('should create resource successfully', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .set('Authorization', `Bearer ${token}`)
      .send(validData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject(expectedShape);
  });
});
```

## Performance Optimization

### Code Splitting
```typescript
// Lazy load components
const ComponentName = lazy(() => import('./ComponentName'));

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ComponentName />
</Suspense>
```

### Memoization
```typescript
// Memoize expensive computations
const memoizedValue = useMemo(() => {
  return expensiveComputation(data);
}, [data]);

// Memoize callbacks
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### Query Optimization
- Use TanStack Query for automatic caching
- Implement pagination for large datasets
- Use lean() queries for read-only operations
- Batch database operations when possible

## Common Idioms

### Date Handling
```typescript
// Use date-fns for date operations
import { format, addMinutes, startOfDay, endOfDay } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// Format dates consistently
const formatted = format(date, 'yyyy-MM-dd HH:mm:ss');

// Timezone-aware operations
const dateInTz = formatInTimeZone(date, timezone, 'yyyy-MM-dd HH:mm:ss');
```

### Async Operations
```typescript
// Parallel operations
const results = await Promise.all([
  operation1(),
  operation2(),
  operation3()
]);

// Sequential with error handling
for (const item of items) {
  try {
    await processItem(item);
  } catch (error) {
    console.error(`Failed to process ${item.id}:`, error);
    // Continue or break based on requirements
  }
}
```

### Type Guards
```typescript
// Type narrowing
function isErrorResponse(response: any): response is ErrorResponse {
  return response && typeof response.error === 'string';
}

if (isErrorResponse(result)) {
  // TypeScript knows result is ErrorResponse here
  console.error(result.error);
}
```

## Frequently Used Annotations

### Swagger/OpenAPI
```typescript
/**
 * @swagger
 * /api/endpoint:
 *   post:
 *     summary: Descrição em português
 *     description: Descrição detalhada em português
 *     tags: [TagName]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [field1, field2]
 *             properties:
 *               field1:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
```

### JSDoc Comments
```typescript
/**
 * Method description
 * IMPROVED: Recent enhancement description
 * FIXED: Bug fix description
 * ADDED: New feature description
 * 
 * @param param1 - Parameter description
 * @param param2 - Parameter description
 * @returns Return value description
 * @throws Error description
 */
```

## Best Practices Summary

1. **Always validate input** - Use express-validator on backend, form validation on frontend
2. **Handle errors gracefully** - Consistent error responses, user-friendly messages in Portuguese
3. **Use transactions** - For critical operations that modify multiple documents
4. **Optimize queries** - Use indexes, lean queries, field selection, and pagination
5. **Type everything** - Explicit TypeScript types, avoid `any`
6. **Test thoroughly** - Unit tests for logic, integration tests for APIs, E2E for flows
7. **Document APIs** - Swagger annotations for all endpoints
8. **Secure by default** - Authentication, authorization, input validation, sanitization
9. **Performance matters** - Code splitting, memoization, lazy loading, caching
10. **Consistent patterns** - Follow established patterns for maintainability
