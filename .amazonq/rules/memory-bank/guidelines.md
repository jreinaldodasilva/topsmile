# Development Guidelines

## Code Quality Standards

### TypeScript Configuration
- **Strict Mode**: Enabled across all packages (frontend, backend, shared types)
- **Explicit Types**: Always provide explicit return types for functions
- **No Any**: Avoid `any` type; use proper type definitions or `unknown` with type guards
- **Type Imports**: Use `import type` for type-only imports from `@topsmile/types`
- **Interface Over Type**: Prefer interfaces for object shapes, types for unions/intersections

### File Organization
- **File Headers**: Include relative path comment at top of files (e.g., `// backend/src/routes/providers.ts`)
- **Import Order**: External packages → Internal packages → Types → Relative imports
- **Export Pattern**: Use named exports; default exports only for React components and route modules
- **File Naming**: 
  - Components: PascalCase (e.g., `SignaturePad.tsx`)
  - Services/Utils: camelCase (e.g., `schedulingService.ts`)
  - Models: PascalCase (e.g., `Appointment.ts`)
  - Routes: lowercase (e.g., `providers.ts`)

### Code Formatting
- **Indentation**: 4 spaces (backend), 2 spaces (frontend)
- **Line Length**: Aim for 100-120 characters max
- **Semicolons**: Required
- **Quotes**: Single quotes for strings, double quotes for JSX attributes
- **Trailing Commas**: Use in multi-line objects and arrays

### Documentation Standards
- **JSDoc Comments**: Required for public APIs and complex functions
- **Swagger Documentation**: All API endpoints must have Swagger annotations
- **Inline Comments**: Use sparingly; prefer self-documenting code
- **Portuguese Messages**: All user-facing messages in Portuguese (Brazil)
- **English Code**: Variable names, function names, and comments in English

## Backend Patterns

### Route Structure (5/5 files follow this pattern)
```typescript
// Import order: express → middleware → services → validators → types
import express, { Request, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth';
import { serviceInstance } from '../services/serviceFile';
import { body, query, validationResult } from 'express-validator';
import type { TypeName } from '@topsmile/types';

const router: express.Router = express.Router();

// Apply authentication middleware globally
router.use(authenticate);

// Define validation rules as constants
const createValidation = [
  body('field').trim().isLength({ min: 2, max: 100 })
    .withMessage('Mensagem de erro em português'),
  // ... more validators
];

// Route handlers with Swagger documentation
/**
 * @swagger
 * /api/endpoint:
 *   post:
 *     summary: Descrição em português
 *     tags: [TagName]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', 
  authorize('super_admin', 'admin', 'manager'),
  createValidation,
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

      // Business logic
      const result = await serviceInstance.method(data);

      // Success response
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

export default router;
```

### Service Layer Patterns (5/5 files follow this pattern)

#### Transaction Handling
```typescript
// CRITICAL: Always use transactions for data modifications
async createWithTransaction(data: CreateData): Promise<SchedulingResult<T>> {
  // Skip transactions in test environment
  const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID;
  const session = isTestEnv ? null : await mongoose.startSession();

  try {
    if (!isTestEnv) {
      session!.startTransaction();
    }

    // Validate data first
    if (!data.requiredField) {
      throw new Error('Dados obrigatórios não fornecidos');
    }

    // Perform operations with session
    const result = await session
      ? Model.findById(id).session(session)
      : Model.findById(id);

    // Commit transaction
    if (!isTestEnv) {
      await session!.commitTransaction();
    }

    return { success: true, data: result };

  } catch (error) {
    // Rollback on error
    if (!isTestEnv && session) {
      await session.abortTransaction();
    }
    console.error('Error description:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro genérico'
    };
  } finally {
    // Always end session
    if (!isTestEnv && session) {
      session.endSession();
    }
  }
}
```

#### Result Type Pattern
```typescript
// Always return structured results for better error handling
export interface SchedulingResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
}
```

#### Performance Optimization
```typescript
// Use lean() queries for read-only operations
const data = await Model.find(query).lean();

// Use parallel processing for independent operations
const results = await Promise.all([
  operation1(),
  operation2(),
  operation3()
]);

// Implement safety limits for loops
let count = 0;
const maxIterations = 200;
while (condition && count < maxIterations) {
  // ... logic
  count++;
}
```

### Validation Patterns (5/5 files follow this pattern)

#### Express Validator Usage
```typescript
// Define validation arrays as constants
const createValidation = [
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('E-mail inválido'),
  
  body('phone')
    .optional()
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage('Telefone deve ter entre 10 e 15 caracteres'),
  
  body('specialties')
    .isArray({ min: 1 })
    .withMessage('Pelo menos uma especialidade é obrigatória'),
  
  body('specialties.*')
    .isIn(['option1', 'option2', 'option3'])
    .withMessage('Especialidade inválida'),
  
  // Time format validation
  body('workingHours.*.start')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Formato de horário inválido. Use HH:MM'),
  
  // MongoDB ID validation
  body('userId')
    .optional()
    .isMongoId()
    .withMessage('ID do usuário inválido')
];
```

#### Query Parameter Validation
```typescript
const searchValidation = [
  query('search')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Busca deve ter entre 1 e 100 caracteres'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número inteiro maior que 0'),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'email', 'createdAt', 'updatedAt'])
    .withMessage('Campo de ordenação inválido')
];
```

### Error Handling (5/5 files follow this pattern)
```typescript
// Always use try-catch in async route handlers
try {
  // Business logic
} catch (error: any) {
  console.error('Descriptive error message:', error);
  return res.status(500).json({
    success: false,
    message: error.message || 'Fallback error message in Portuguese'
  });
}

// Type-safe error checking
if (error instanceof Error) {
  return error.message;
}
return 'Unknown error';
```

### API Response Format (5/5 files follow this pattern)
```typescript
// Success response
{
  success: true,
  data: result,
  message?: 'Mensagem de sucesso',
  meta: {
    timestamp: new Date().toISOString(),
    requestId: (req as any).requestId
  }
}

// Error response
{
  success: false,
  message: 'Mensagem de erro em português',
  errors?: validationErrors
}

// Paginated response
{
  success: true,
  data: {
    items: results,
    total: totalCount,
    page: currentPage,
    totalPages: totalPages,
    hasNext: hasNextPage,
    hasPrev: hasPreviousPage
  }
}
```

## Frontend Patterns

### React Component Structure (5/5 files follow this pattern)
```typescript
// Import order: React → External libs → Internal components → Hooks → Types → Styles
import React, { useRef, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ComponentName } from '../components/ComponentName';
import { useCustomHook } from '../hooks/useCustomHook';
import type { TypeName } from '@topsmile/types';
import './ComponentName.css';

interface ComponentProps {
  onAction: (data: string) => void;
  onCancel: () => void;
  requiredProp: string;
  optionalProp?: number;
}

export const ComponentName: React.FC<ComponentProps> = ({ 
  onAction, 
  onCancel,
  requiredProp,
  optionalProp 
}) => {
  // Hooks first
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<Type>(initialValue);

  // Effects after state
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  // Event handlers
  const handleAction = (e: React.MouseEvent<HTMLElement>) => {
    // Handler logic
  };

  // Render
  return (
    <div className="component-name">
      {/* JSX */}
    </div>
  );
};
```

### State Management Patterns

#### TanStack Query for Server State
```typescript
// Query hook
const { data, isLoading, error } = useQuery({
  queryKey: ['resource', id],
  queryFn: () => apiService.getResource(id),
  staleTime: 5 * 60 * 1000, // 5 minutes
  retry: 3
});

// Mutation hook
const mutation = useMutation({
  mutationFn: (data: CreateData) => apiService.create(data),
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ['resource'] });
  },
  onError: (error) => {
    console.error('Error:', error);
  }
});
```

#### Zustand for Client State
```typescript
// Store definition
interface StoreState {
  data: DataType[];
  setData: (data: DataType[]) => void;
  clearData: () => void;
}

export const useStore = create<StoreState>((set) => ({
  data: [],
  setData: (data) => set({ data }),
  clearData: () => set({ data: [] })
}));
```

### Event Handler Patterns
```typescript
// Mouse events with proper typing
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  // Logic
};

// Canvas events
const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  // Use coordinates
};

// Form events
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Form logic
};
```

## Testing Patterns

### Mock Data Generation (5/5 files follow this pattern)
```typescript
import { faker } from '@faker-js/faker';
import type { TypeName } from '@topsmile/types';

// Generator function with overrides
export const generateMockEntity = (overrides = {}) => ({
  _id: faker.database.mongodbObjectId(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  isActive: faker.datatype.boolean({ probability: 0.9 }),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  ...overrides
});

// Brazilian-specific generators
export const generateBrazilianPhone = () => 
  faker.helpers.replaceSymbols('(##) #####-####');

export const generateBrazilianCPF = () => 
  faker.helpers.replaceSymbols('###.###.###-##');

// Utility for multiple items
export const generateMultiple = <T>(
  generator: (overrides?: any) => T, 
  count: number, 
  overrides = {}
) => {
  return Array.from({ length: count }, () => generator(overrides));
};
```

### Test Response Patterns
```typescript
// Success response
export const generateMockApiResponse = <T>(
  data: T, 
  success = true, 
  message?: string
) => ({
  success,
  data,
  message: message || (success ? 'Operação realizada com sucesso' : 'Erro na operação')
});

// Paginated response
export const generateMockPaginatedResponse = <T>(
  items: T[], 
  page = 1, 
  limit = 10
) => {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const paginatedItems = items.slice(startIndex, startIndex + limit);

  return {
    success: true,
    data: {
      items: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  };
};
```

## Common Idioms and Patterns

### Null Safety Checks (5/5 files use this pattern)
```typescript
// Early return pattern
if (!data) return;
if (!canvas) return;
if (!authReq.user?.clinicId) {
  return res.status(400).json({ success: false, message: 'Error' });
}

// Optional chaining
const value = object?.property?.nestedProperty;

// Nullish coalescing
const result = value ?? defaultValue;
```

### Array Handling
```typescript
// Handle string or array parameters
let specialties: string[] | undefined;
if (query.specialties) {
  if (typeof query.specialties === 'string') {
    specialties = [query.specialties];
  } else if (Array.isArray(query.specialties)) {
    specialties = query.specialties as string[];
  }
}

// Array element validation
body('specialties.*')
  .isIn(['option1', 'option2'])
  .withMessage('Invalid option');
```

### Date Handling
```typescript
// Use date-fns for date operations
import { startOfDay, endOfDay, addMinutes, format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// Date range queries
const query = {
  scheduledStart: {
    $gte: startOfDay(date),
    $lte: endOfDay(date)
  }
};

// Time parsing with timezone
const parseTimeToDate = (date: Date, timeString: string, timeZone: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const dateStr = format(date, 'yyyy-MM-dd');
  const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  const dateTimeStr = `${dateStr}T${timeStr}`;
  return parseISO(formatInTimeZone(new Date(dateTimeStr), timeZone, "yyyy-MM-dd'T'HH:mm:ssXXX"));
};
```

### Async Queue Processing (Email Service Pattern)
```typescript
class ServiceWithQueue {
  private queue: Task[] = [];
  private isProcessing: boolean = false;
  private readonly MAX_RETRIES = 5;
  private readonly RETRY_DELAY_MS = 5000;

  async addToQueue(task: Task): Promise<void> {
    this.queue.push({ ...task, retries: 0, lastAttempt: 0 });
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;
    while (this.queue.length > 0) {
      const task = this.queue[0];

      // Check retry timing
      if (Date.now() - task.lastAttempt < this.RETRY_DELAY_MS * Math.pow(2, task.retries)) {
        break;
      }

      const success = await this.processTask(task);

      if (success) {
        this.queue.shift();
      } else {
        task.retries++;
        task.lastAttempt = Date.now();
        if (task.retries >= this.MAX_RETRIES) {
          console.error(`Task failed after ${this.MAX_RETRIES} retries`);
          this.queue.shift();
        } else {
          this.queue.push(this.queue.shift()!);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.isProcessing = false;

    if (this.queue.length > 0) {
      setTimeout(() => this.processQueue(), this.RETRY_DELAY_MS);
    }
  }
}
```

## Security Best Practices

### Authentication & Authorization (5/5 files follow this pattern)
```typescript
// Apply authentication globally
router.use(authenticate);

// Role-based authorization per route
router.post('/', 
  authorize('super_admin', 'admin', 'manager'),
  validationMiddleware,
  handler
);

// Check clinic context
if (!authReq.user?.clinicId) {
  return res.status(400).json({
    success: false,
    message: 'Clínica não identificada'
  });
}
```

### Input Validation
```typescript
// Always validate and sanitize input
body('email').isEmail().normalizeEmail()
body('field').trim().escape()
body('id').isMongoId()

// Check validation results
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({
    success: false,
    message: 'Dados inválidos',
    errors: errors.array()
  });
}
```

### Environment Variables
```typescript
// Always provide fallbacks
const value = process.env.VAR_NAME || 'default-value';

// Check required variables
if (!process.env.REQUIRED_VAR) {
  throw new Error('REQUIRED_VAR is required');
}

// Environment-specific logic
if (process.env.NODE_ENV === 'production') {
  // Production logic
} else {
  // Development logic
}
```

## Performance Guidelines

### Database Queries
- Use `.lean()` for read-only operations (reduces memory by 50%)
- Implement pagination for all list endpoints (default limit: 20)
- Use indexes for frequently queried fields (50+ indexes in project)
- Batch operations when possible using `Promise.all()`
- Implement safety limits on loops (max 200 iterations)

### Frontend Optimization
- Lazy load components with React.lazy() and Suspense
- Use TanStack Query for automatic caching (5-minute stale time)
- Implement debouncing for search inputs
- Optimize re-renders with React.memo() for expensive components
- Target metrics: <1.2s initial load, <0.8s tab switch

### Memory Management
- Clean up event listeners in useEffect cleanup
- Clear intervals and timeouts
- Dispose of canvas contexts when unmounting
- Target: <100MB memory usage

## Accessibility Standards

### ARIA Attributes
```typescript
<button 
  aria-label="Descrição em português"
  aria-disabled={isDisabled}
  role="button"
>
  {children}
</button>
```

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Implement focus management for modals
- Use semantic HTML elements (button, nav, main, etc.)
- Test with screen readers

## Documentation Requirements

### Code Comments
- JSDoc for public APIs
- Inline comments only for complex logic
- Portuguese for user-facing strings
- English for code and technical comments

### API Documentation
- Swagger annotations for all endpoints
- Include request/response examples
- Document error codes
- Specify authentication requirements

### README Updates
- Update feature list when adding functionality
- Document new environment variables
- Update architecture diagrams if structure changes
- Keep dependency versions current
