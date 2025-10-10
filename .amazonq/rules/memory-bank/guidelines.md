# Development Guidelines

## Code Quality Standards

### Formatting and Structure
- **Indentation**: 4 spaces (consistent across all files)
- **Line Length**: Keep lines under 120 characters where practical
- **File Organization**: Imports → Interfaces/Types → Class/Component → Exports
- **Blank Lines**: Use blank lines to separate logical sections

### Import Organization
Imports are grouped in this order:
1. External packages (React, third-party libraries)
2. Shared types from `@topsmile/types`
3. Internal modules (models, services, utils)
4. Relative imports (components, styles)
5. Type-only imports at the end

Example:
```typescript
import React, { useRef, useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Appointment as IAppointment, Provider as IProvider } from '@topsmile/types';
import { Provider } from '../../models/Provider';
import { schedulingService } from '../../services/scheduling';
import './Component.css';
```

### Naming Conventions
- **Variables/Functions**: camelCase (`getAvailableSlots`, `isDrawing`, `patientId`)
- **Classes/Components**: PascalCase (`SchedulingService`, `SignaturePad`, `PaymentService`)
- **Interfaces**: PascalCase with descriptive names (`TimeSlot`, `PaymentResult`, `InsuranceEstimate`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `RETRY_WINDOW_MINUTES`)
- **Private Methods**: camelCase with `private` keyword (`parseTimeToDate`, `initializeRetryState`)
- **Boolean Variables**: Prefix with `is`, `has`, `can` (`isEmpty`, `hasConflict`, `canRetry`)

### User-Facing Messages
- **Language**: All user-facing messages MUST be in Portuguese
- **Error Messages**: Clear, actionable, and user-friendly
- **Examples**:
  - ✅ `'Tipo de agendamento não encontrado'`
  - ✅ `'Horário não disponível'`
  - ✅ `'Profissional não trabalha neste dia'`
  - ❌ `'Appointment type not found'`

## TypeScript Standards

### Type Safety
- **Explicit Types**: Always define explicit return types for functions
- **Interface Definitions**: Define interfaces for all data structures
- **Type Imports**: Use type-only imports when importing only types
- **Avoid `any`**: Use specific types; if `any` is necessary, add a comment explaining why

Example:
```typescript
export interface TimeSlot {
    start: Date;
    end: Date;
    available: boolean;
    providerId: string;
    appointmentTypeId?: string;
    conflictReason?: string;
}

async getAvailableSlots(query: AvailabilityQuery): Promise<TimeSlot[]> {
    // Implementation
}
```

### Result Types Pattern
Use result wrapper types for operations that can fail:
```typescript
export interface SchedulingResult<T> {
    success: boolean;
    data?: T;
    error?: string;
    warnings?: string[];
}
```

### Type Assertions
- Use type assertions sparingly
- Prefer type guards over assertions
- Document why assertions are necessary

## Backend Development Patterns

### Service Layer Architecture
- **Base Service**: Extend `BaseService` for common CRUD operations
- **Service Classes**: Singleton pattern with exported instance
- **Method Organization**: Public methods first, private methods last

Example:
```typescript
class SchedulingService {
    async getAvailableSlots(query: AvailabilityQuery): Promise<TimeSlot[]> {
        // Public method
    }

    private async getProviderAppointments(providerId: string): Promise<IAppointment[]> {
        // Private helper method
    }
}

export const schedulingService = new SchedulingService();
```

### Database Operations

#### Transaction Handling
- **Test Environment**: Skip transactions when `NODE_ENV === 'test'` or `JEST_WORKER_ID` is set
- **Session Management**: Always use try-catch-finally with proper cleanup
- **Commit/Abort**: Commit on success, abort on error

Pattern:
```typescript
async createAppointment(data: CreateAppointmentData): Promise<SchedulingResult<IAppointment>> {
    const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID;
    const session = isTestEnv ? null : await mongoose.startSession();

    try {
        if (!isTestEnv) {
            session!.startTransaction();
        }
        
        // Database operations
        const result = await Model.create([data], session ? { session } : {});
        
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

#### Query Optimization
- **Lean Queries**: Use `.lean()` for read-only operations
- **Parallel Queries**: Use `Promise.all()` for independent queries
- **Selective Population**: Only populate needed fields
- **Indexes**: Ensure proper indexes for frequent queries

Example:
```typescript
const providers = await Provider.find(providerQuery).lean();

const providerSlotsPromises = providers.map(provider =>
    this.getProviderAvailableSlots(provider, appointmentType, targetDate)
);
const providerSlotsResults = await Promise.all(providerSlotsPromises);
```

### Mongoose Models

#### Schema Definition
- **Base Schema**: Use `baseSchemaFields` and `baseSchemaOptions` from base schema
- **Mixins**: Apply `clinicScopedFields` and `auditableFields` for common patterns
- **Validation**: Add validators at schema level with Portuguese error messages
- **Indexes**: Define compound indexes for common query patterns

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
    status: {
        type: String,
        enum: Object.values(AppointmentStatus),
        default: AppointmentStatus.SCHEDULED,
        index: true
    }
}, baseSchemaOptions as any);
```

#### Compound Indexes
Define indexes for frequent query patterns:
```typescript
AppointmentSchema.index({ 
    clinic: 1, 
    scheduledStart: 1, 
    status: 1 
}, { 
    name: 'clinic_schedule_status',
    background: true
});
```

#### Pre-save Middleware
- **Validation**: Validate business rules before save
- **Calculations**: Compute derived fields
- **Status Tracking**: Update timestamps based on status changes

Example:
```typescript
AppointmentSchema.pre('save', function(this: any, next) {
    if (this.scheduledStart >= this.scheduledEnd) {
        return next(new Error('Hora de início deve ser anterior à hora de término'));
    }
    
    if (this.isModified('status') && this.status === 'completed') {
        if (!this.completedAt) this.completedAt = new Date();
    }
    
    next();
});
```

#### Static Methods
Add custom query methods as static methods:
```typescript
AppointmentSchema.statics.findByTimeRange = function(
    clinicId: string, 
    startDate: Date, 
    endDate: Date
) {
    return this.aggregate([
        { $match: { clinic: new Types.ObjectId(clinicId) } },
        // ... aggregation pipeline
    ]);
};
```

### Error Handling

#### Error Messages
- **Portuguese**: All error messages in Portuguese
- **Descriptive**: Explain what went wrong and why
- **Actionable**: Suggest what the user can do

#### Error Logging
- **Console Errors**: Log errors with context
- **Error Propagation**: Return structured error responses

Example:
```typescript
try {
    // Operation
} catch (error) {
    console.error('Error creating appointment:', error);
    return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao criar agendamento'
    };
}
```

### Date and Time Handling
- **Library**: Use `date-fns` for date manipulation
- **Timezone**: Use `date-fns-tz` for timezone conversions
- **Parsing**: Validate time strings before parsing
- **Format**: Use ISO format for API communication

Example:
```typescript
import { startOfDay, endOfDay, addMinutes, format } from 'date-fns';
import { formatInTimeZone, parseISO } from 'date-fns-tz';

private parseTimeToDate(date: Date, timeString: string, timeZone: string): Date {
    const parts = timeString.split(':');
    if (parts.length !== 2) {
        throw new Error(`Invalid time format: ${timeString}`);
    }
    // ... validation and parsing
}
```

## Frontend Development Patterns

### React Components

#### Functional Components
- **Hooks**: Use React hooks (useState, useEffect, useRef, etc.)
- **TypeScript**: Define prop interfaces with `React.FC<Props>`
- **Destructuring**: Destructure props in function signature

Example:
```typescript
interface SignaturePadProps {
    onSave: (signatureUrl: string) => void;
    onCancel: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onCancel }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    // Component logic
};
```

#### State Management
- **Local State**: Use `useState` for component-specific state
- **Refs**: Use `useRef` for DOM references and mutable values
- **Effects**: Use `useEffect` for side effects and cleanup

#### Event Handlers
- **Naming**: Prefix with `handle` or use action verbs (`startDrawing`, `stopDrawing`)
- **Type Safety**: Use proper React event types (`React.MouseEvent<HTMLCanvasElement>`)

### Service Layer (Frontend)

#### Service Classes
- **Singleton Pattern**: Export single instance
- **Private State**: Use private properties for internal state
- **Async Methods**: All API calls are async

Example:
```typescript
class PaymentService {
    private stripe: Promise<Stripe | null>;
    private retryStates: Map<string, RetryState> = new Map();
    private readonly MAX_RETRIES = 3;

    constructor() {
        this.stripe = stripePromise;
    }

    async createPaymentIntent(data: PaymentData): Promise<PaymentResult> {
        // Implementation
    }
}

export const paymentService = new PaymentService();
```

#### API Communication
- **Fetch API**: Use native fetch with proper error handling
- **Credentials**: Include credentials for authenticated requests
- **Error Handling**: Catch and transform errors into user-friendly messages

Example:
```typescript
async createPaymentIntent(data: PaymentData): Promise<PaymentResult> {
    try {
        const response = await fetch('/api/payments/create-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
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
```

### Retry Logic Pattern
- **Exponential Backoff**: Increase delay between retries
- **Max Retries**: Limit number of retry attempts
- **State Tracking**: Track retry state per operation
- **Time Windows**: Set expiration for retry availability

Example:
```typescript
private readonly RETRY_INTERVALS = [1000, 2000, 5000]; // milliseconds

async retryPayment(clientSecret: string, retryId: string): Promise<PaymentResult> {
    const retryState = this.retryStates.get(retryId);
    
    if (!retryState || !retryState.canRetry) {
        return { success: false, error: 'Retry not available or expired' };
    }
    
    const interval = this.RETRY_INTERVALS[retryState.retryCount] || 5000;
    await new Promise(resolve => setTimeout(resolve, interval));
    
    retryState.retryCount++;
    return this.confirmPayment(clientSecret, paymentMethod, retryId);
}
```

## Common Patterns

### Validation Pattern
1. **Early Return**: Validate inputs first, return early on failure
2. **Descriptive Errors**: Provide specific error messages
3. **Type Guards**: Use TypeScript type guards for runtime validation

Example:
```typescript
if (!patientId || !providerId || !appointmentTypeId) {
    throw new Error('Dados obrigatórios não fornecidos');
}

const appointmentType = await AppointmentType.findById(appointmentTypeId);
if (!appointmentType) {
    throw new Error('Tipo de agendamento não encontrado');
}
```

### Null Safety Pattern
- **Null Checks**: Always check for null/undefined before accessing properties
- **Optional Chaining**: Use `?.` for safe property access
- **Nullish Coalescing**: Use `??` for default values

Example:
```typescript
const canvas = canvasRef.current;
if (!canvas) return;

const workingHours = provider.workingHours?.[dayOfWeek];
const bufferBefore = appointmentType.bufferBefore ?? provider.bufferTimeBefore ?? 0;
```

### Performance Optimization

#### Backend
- **Lean Queries**: Use `.lean()` for read-only data
- **Parallel Processing**: Use `Promise.all()` for independent operations
- **Pagination**: Limit query results for large datasets
- **Caching**: Cache frequently accessed data (Redis)
- **Indexes**: Ensure proper database indexes

#### Frontend
- **Lazy Loading**: Load components on demand
- **Memoization**: Use `useMemo` and `useCallback` for expensive computations
- **Debouncing**: Debounce user input for API calls
- **Code Splitting**: Split bundles by route

### Security Practices

#### Input Validation
- **Server-Side**: Always validate on server, never trust client
- **Sanitization**: Sanitize user input to prevent injection
- **Type Checking**: Use TypeScript and runtime validation

#### Authentication
- **JWT Tokens**: Use HttpOnly cookies for token storage
- **Session Management**: Implement refresh token rotation
- **Rate Limiting**: Limit login attempts and API calls

#### Data Protection
- **Sensitive Data**: Never log sensitive information
- **Encryption**: Encrypt sensitive data at rest
- **HTTPS**: Always use HTTPS in production

## Documentation Standards

### Code Comments
- **When to Comment**: Explain "why", not "what"
- **Complex Logic**: Document complex algorithms and business rules
- **TODOs**: Mark incomplete work with `// TODO:` or `// FIXME:`
- **Section Headers**: Use comments to separate logical sections

Example:
```typescript
// CRITICAL: Check availability within transaction to prevent race conditions
const availabilityCheck = await this.isTimeSlotAvailableWithSession(
    clinicId, providerId, scheduledStart, scheduledEnd, appointmentType, session
);
```

### JSDoc Comments
Use JSDoc for public methods:
```typescript
/**
 * Get available time slots for a specific date and appointment type
 * IMPROVED: Better error handling and performance
 */
async getAvailableSlots(query: AvailabilityQuery): Promise<TimeSlot[]> {
    // Implementation
}
```

### Interface Documentation
Document complex interfaces:
```typescript
export interface AvailabilityQuery {
    clinicId?: string;
    providerId?: string;
    appointmentTypeId: string;  // Required
    date: Date;                 // Target date for availability
    excludeAppointmentId?: string; // Exclude specific appointment (for rescheduling)
}
```

## Testing Guidelines

### Test Structure
- **Arrange-Act-Assert**: Organize tests in three sections
- **Descriptive Names**: Use descriptive test names
- **One Assertion**: Focus on one behavior per test

### Test Environment
- **Isolation**: Tests should be independent
- **Cleanup**: Clean up after each test
- **Mocking**: Mock external dependencies

### Coverage
- **Target**: 80% code coverage minimum
- **Critical Paths**: 100% coverage for critical business logic
- **Edge Cases**: Test error conditions and edge cases

## Git Commit Guidelines

### Commit Messages
- **Format**: `type(scope): description`
- **Types**: feat, fix, docs, style, refactor, test, chore
- **Description**: Clear, concise, imperative mood

Example:
```
feat(scheduling): add transaction support for appointments
fix(payment): handle network errors with retry logic
docs(api): update appointment endpoint documentation
```

## Performance Considerations

### Database
- **Indexes**: Create indexes for frequent queries
- **Aggregation**: Use aggregation pipeline for complex queries
- **Batch Operations**: Batch updates when possible
- **Connection Pooling**: Configure appropriate pool size

### API
- **Response Size**: Limit response payload size
- **Pagination**: Implement pagination for list endpoints
- **Caching**: Cache static and frequently accessed data
- **Compression**: Enable gzip compression

### Frontend
- **Bundle Size**: Monitor and optimize bundle size
- **Lazy Loading**: Load routes and components lazily
- **Image Optimization**: Optimize images and use appropriate formats
- **API Calls**: Minimize unnecessary API calls

## Accessibility Standards

### WCAG 2.1 AA Compliance
- **Semantic HTML**: Use proper HTML elements
- **ARIA Labels**: Add ARIA labels for screen readers
- **Keyboard Navigation**: Ensure keyboard accessibility
- **Color Contrast**: Maintain sufficient color contrast
- **Focus Indicators**: Visible focus indicators for interactive elements

Example:
```typescript
<button 
    onClick={save} 
    className="save-sig-btn" 
    disabled={isEmpty}
    aria-label="Assinar nota clínica"
>
    Assinar
</button>
```
