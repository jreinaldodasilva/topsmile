# Development Guidelines

## Code Quality Standards

### TypeScript Usage
- **Strict Typing**: All code uses TypeScript with explicit type annotations
- **Interface Definitions**: Shared types defined in `@topsmile/types` package
- **Type Safety**: Avoid `any` types; use proper type guards and assertions
- **Null Safety**: Use optional chaining (`?.`) and nullish coalescing (`??`)

### Code Formatting
- **Indentation**: 2 spaces for all files
- **Semicolons**: Required at end of statements
- **Quotes**: Single quotes for strings, double quotes in JSX
- **Line Length**: Keep lines reasonable, break long statements
- **Trailing Commas**: Used in multi-line objects and arrays

### Naming Conventions
- **Variables/Functions**: camelCase (e.g., `handleSubmit`, `formData`)
- **Components**: PascalCase (e.g., `ContactList`, `AppointmentForm`)
- **Interfaces/Types**: PascalCase (e.g., `AuthResponse`, `TokenPayload`)
- **Constants**: UPPER_SNAKE_CASE for true constants (e.g., `JWT_SECRET`)
- **Files**: Match component/module name (e.g., `ContactList.tsx`, `authService.ts`)
- **CSS Classes**: kebab-case (e.g., `contact-list`, `form-group`)

### Documentation
- **JSDoc Comments**: Used for public APIs and complex functions
- **Swagger/OpenAPI**: Backend routes documented with `@swagger` annotations
- **Inline Comments**: Explain "why" not "what" for complex logic
- **Portuguese**: User-facing messages and documentation in Portuguese (Brazilian)
- **English**: Code, variables, and technical comments in English

## Architectural Patterns

### Backend Patterns

#### Layered Architecture
```
Routes → Services → Models
```
- **Routes**: Handle HTTP requests, validation, authentication
- **Services**: Business logic, orchestration, transactions
- **Models**: Data schemas, database operations

#### Route Structure
```typescript
// Standard pattern for all routes
router.use(authenticate); // Apply auth middleware
router.get('/', async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  try {
    // Validate query parameters
    // Call service layer
    // Return standardized response
    return res.json({ 
      success: true, 
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (authReq as any).requestId
      }
    });
  } catch (err: any) {
    console.error('Error:', err);
    return res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});
```

#### Response Format
All API responses follow this structure:
```typescript
{
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
  errors?: ValidationError[];
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: PaginationInfo;
  };
}
```

#### Error Handling
- Custom error classes: `AppError`, `ValidationError`, `UnauthorizedError`, `ConflictError`, `NotFoundError`
- Centralized error handling middleware
- Consistent error messages in Portuguese
- Never expose sensitive information in errors

#### Validation Pattern
```typescript
// express-validator for request validation
const validation = [
  body('field').isString().withMessage('Mensagem de erro'),
  body('email').isEmail().withMessage('E-mail inválido')
];

router.post('/', validation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: errors.array()
    });
  }
  // Process request
});
```

#### Authentication & Authorization
```typescript
// Apply authentication middleware
router.use(authenticate);

// Role-based authorization
router.delete('/:id', authorize('super_admin', 'admin'), handler);

// Patient authentication
router.get('/patient', authenticatePatient, requirePatientEmailVerification, handler);
```

#### Service Layer Pattern
```typescript
class ServiceName {
  private readonly CONFIG_VALUE: string;

  constructor() {
    // Initialize configuration
    this.CONFIG_VALUE = process.env.VALUE || 'default';
  }

  async methodName(params: Type): Promise<ReturnType> {
    try {
      // Validate inputs
      if (!params.required) {
        throw new ValidationError('Message');
      }

      // Business logic
      const result = await Model.operation();

      return result;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error:', error);
      throw new AppError('Error message', 500);
    }
  }
}

export const serviceName = new ServiceName();
```

### Frontend Patterns

#### Component Structure
```typescript
// Functional components with TypeScript
interface ComponentProps {
  prop: Type;
  onAction?: (data: Type) => void;
}

const Component: React.FC<ComponentProps> = React.memo(({ prop, onAction }) => {
  // State hooks
  const [state, setState] = useState<Type>(initialValue);
  
  // Custom hooks
  const { data, isLoading, error } = useCustomHook();
  
  // Callbacks with useCallback
  const handleAction = useCallback((param: Type) => {
    // Logic
  }, [dependencies]);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Render
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
});

export default Component;
```

#### State Management
- **Local State**: `useState` for component-specific state
- **Global State**: Zustand stores for app-wide state
- **Server State**: TanStack Query for API data
- **Context**: React Context for auth and error boundaries

#### Data Fetching Pattern
```typescript
// Custom hooks with TanStack Query
export const useResource = (filters: Filters) => {
  return useQuery({
    queryKey: ['resource', filters],
    queryFn: () => apiService.resource.getAll(filters)
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateParams) => 
      apiService.resource.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resource'] });
    }
  });
};
```

#### Form Handling
```typescript
// Controlled forms with validation
const [formData, setFormData] = useState<FormType>(initialState);
const [errors, setErrors] = useState<Record<string, string>>({});

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
  
  // Clear error on change
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};

const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};
  
  if (!formData.required) {
    newErrors.required = 'Campo obrigatório';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  try {
    await apiService.resource.create(formData);
  } catch (error) {
    setErrors({ submit: error.message });
  }
};
```

#### API Service Pattern
```typescript
// Centralized API calls
export const apiService = {
  resource: {
    getAll: async (filters?: Filters) => {
      const response = await http.get('/resource', { params: filters });
      return response.data;
    },
    
    create: async (data: CreateData) => {
      const response = await http.post('/resource', data);
      return response.data;
    },
    
    update: async (id: string, data: UpdateData) => {
      const response = await http.patch(`/resource/${id}`, data);
      return response.data;
    },
    
    delete: async (id: string) => {
      const response = await http.delete(`/resource/${id}`);
      return response.data;
    }
  }
};
```

## Common Code Idioms

### Backend Idioms

#### Environment Configuration
```typescript
// Centralized config with validation
export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/db'
  }
};

export const validateEnv = (): void => {
  const errors: string[] = [];
  if (env.nodeEnv === 'production' && !process.env.JWT_SECRET) {
    errors.push('JWT_SECRET required in production');
  }
  if (errors.length > 0) {
    throw new Error('Invalid environment configuration');
  }
};
```

#### Token Generation & Verification
```typescript
// JWT with proper typing
interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role: string;
}

private generateAccessToken(payload: TokenPayload): string {
  const options: SignOptions = {
    expiresIn: this.ACCESS_TOKEN_EXPIRES,
    issuer: 'topsmile-api',
    audience: 'topsmile-client',
    algorithm: 'HS256'
  };
  return jwt.sign(payload, this.JWT_SECRET, options);
}

async verifyAccessToken(token: string): Promise<TokenPayload> {
  try {
    const payload = jwt.verify(token, this.JWT_SECRET, {
      issuer: 'topsmile-api',
      audience: 'topsmile-client',
      algorithms: ['HS256']
    });
    
    if (typeof payload === 'string') {
      throw new UnauthorizedError('Invalid token format');
    }
    
    return payload as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expired');
    }
    throw new UnauthorizedError('Invalid token');
  }
}
```

#### Database Population
```typescript
// Mongoose populate pattern
const result = await Model.findById(id)
  .populate('relation', 'field1 field2')
  .populate('otherRelation', 'name email');
```

#### Pagination
```typescript
// Standard pagination pattern
const page = parseInt(req.query.page as string, 10) || 1;
const limit = parseInt(req.query.limit as string, 10) || 10;

const results = await Model.find(query)
  .limit(limit)
  .skip((page - 1) * limit)
  .sort({ createdAt: -1 });

const total = await Model.countDocuments(query);

return {
  data: results,
  pagination: {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1
  }
};
```

### Frontend Idioms

#### Conditional Rendering
```typescript
// Loading states
{isLoading && <LoadingSkeleton />}
{error && <ErrorBanner message={error.message} />}
{data && <DataDisplay data={data} />}

// Empty states
{items.length === 0 && (
  <div className="empty-state">
    <p>No items found</p>
  </div>
)}
```

#### Event Handlers with useCallback
```typescript
// Memoized callbacks to prevent re-renders
const handleAction = useCallback((id: string) => {
  // Action logic
}, [dependencies]);

const handleSubmit = useCallback(async (data: FormData) => {
  try {
    await mutation.mutateAsync(data);
  } catch (error) {
    console.error('Error:', error);
  }
}, [mutation]);
```

#### Type Guards
```typescript
// Runtime type checking
const isResponseType = (data: any): data is ResponseType => {
  return data && typeof data === 'object' && 'field' in data;
};

const result = isResponseType(data) ? data.field : defaultValue;
```

#### Date Formatting
```typescript
// Consistent date handling
const formattedDate = new Date(dateString).toLocaleDateString('pt-BR');
const isoDate = new Date(dateString).toISOString();
const dateTimeLocal = new Date(dateString).toISOString().slice(0, 16);
```

## Security Best Practices

### Backend Security
- **Helmet**: Security headers middleware
- **CORS**: Configured for specific origins
- **Rate Limiting**: Applied to all routes
- **Input Sanitization**: MongoDB injection prevention
- **CSRF Protection**: Token-based CSRF protection
- **Password Hashing**: bcrypt with salt rounds
- **JWT Secrets**: Minimum 64 characters in production
- **Token Blacklisting**: Revoked tokens tracked in Redis
- **Secure Cookies**: httpOnly, secure flags in production

### Frontend Security
- **XSS Prevention**: React's built-in escaping
- **CSRF Tokens**: Included in state-changing requests
- **Secure Storage**: Sensitive data not in localStorage
- **Input Validation**: Client-side validation before submission
- **Error Messages**: No sensitive information exposed

## Testing Patterns

### Backend Testing
- **Unit Tests**: Service layer logic
- **Integration Tests**: API endpoints with test database
- **E2E Tests**: Full user flows
- **Test Fixtures**: Reusable test data
- **MongoDB Memory Server**: In-memory database for tests

### Frontend Testing
- **Component Tests**: React Testing Library
- **Hook Tests**: Custom hook testing
- **Integration Tests**: User interaction flows
- **Accessibility Tests**: jest-axe for a11y
- **MSW**: Mock Service Worker for API mocking

## Performance Optimization

### Backend
- **Database Indexes**: Proper indexing on query fields
- **Query Optimization**: Selective field population
- **Caching**: Redis for frequently accessed data
- **Connection Pooling**: MongoDB connection management
- **Async Operations**: Non-blocking I/O

### Frontend
- **Code Splitting**: Lazy loading with React.lazy
- **Memoization**: React.memo, useMemo, useCallback
- **Query Caching**: TanStack Query automatic caching
- **Bundle Optimization**: Tree shaking, minification
- **Image Optimization**: Proper formats and sizes

## Accessibility Standards

- **Semantic HTML**: Proper element usage
- **ARIA Labels**: aria-label, aria-describedby
- **Keyboard Navigation**: Tab order, focus management
- **Screen Reader Support**: Meaningful labels and descriptions
- **Color Contrast**: WCAG AA compliance
- **Focus Indicators**: Visible focus states
- **Error Announcements**: aria-live regions

## Internationalization

- **User Messages**: Portuguese (Brazilian)
- **Date Formats**: pt-BR locale
- **Currency**: Brazilian Real (R$)
- **Timezone**: America/Sao_Paulo default
- **Code/Technical**: English for maintainability
