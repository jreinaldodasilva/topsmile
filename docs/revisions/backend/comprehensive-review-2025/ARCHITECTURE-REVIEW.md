# Backend Architecture Review

**Review Date:** January 2025  
**Focus:** System architecture, design patterns, and code organization

---

## Architecture Overview

### Layered Architecture ✅

```
┌─────────────────────────────────────┐
│         API Layer (Routes)          │
│  - Express routes                   │
│  - Request validation               │
│  - Response formatting              │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      Middleware Layer               │
│  - Authentication                   │
│  - Authorization                    │
│  - Rate limiting                    │
│  - CSRF protection                  │
│  - Input sanitization               │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      Service Layer                  │
│  - Business logic                   │
│  - Transaction management           │
│  - External integrations            │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      Data Layer (Models)            │
│  - Mongoose schemas                 │
│  - Validation                       │
│  - Indexes                          │
└─────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────┐
│      Database (MongoDB)             │
│      Cache (Redis)                  │
└─────────────────────────────────────┘
```

**Grade: A**  
Clean separation of concerns with proper layering.

---

## Directory Structure

### Excellent Organization ✅

```
backend/src/
├── config/              # Configuration management
│   ├── clinical/        # Clinical-specific configs
│   ├── database/        # DB and Redis setup
│   ├── security/        # Security configs
│   ├── env.ts          # Environment validation
│   ├── logger.ts       # Pino logger setup
│   └── swagger.ts      # API documentation
│
├── middleware/          # Express middleware
│   ├── auth/           # Authentication
│   ├── security/       # Security middleware
│   ├── validation/     # Input validation
│   └── shared/         # Shared middleware
│
├── models/             # Mongoose models
│   ├── base/           # Base schemas
│   ├── mixins/         # Reusable schema mixins
│   └── *.ts           # Domain models
│
├── routes/             # API routes
│   ├── admin/          # Admin endpoints
│   ├── clinical/       # Clinical endpoints
│   ├── patient/        # Patient endpoints
│   ├── provider/       # Provider endpoints
│   ├── scheduling/     # Scheduling endpoints
│   ├── security/       # Security endpoints
│   ├── public/         # Public endpoints
│   └── v1/            # Versioned routes
│
├── services/           # Business logic
│   ├── admin/          # Admin services
│   ├── auth/           # Authentication services
│   ├── base/           # Base service class
│   ├── cache/          # Caching services
│   ├── clinical/       # Clinical services
│   ├── external/       # External integrations
│   ├── notification/   # Notifications
│   ├── patient/        # Patient services
│   ├── payment/        # Payment processing
│   ├── provider/       # Provider services
│   └── scheduling/     # Scheduling services
│
├── utils/              # Utility functions
│   ├── cache/          # Cache utilities
│   ├── errors/         # Error handling
│   └── validation/     # Validation helpers
│
├── validation/         # express-validator schemas
├── types/             # TypeScript types
├── container/         # Dependency injection
├── events/            # Event bus
└── app.ts            # Application entry point
```

**Grade: A**  
Excellent organization by feature and layer.

---

## Design Patterns

### 1. Service Layer Pattern ✅

**Implementation:**
```typescript
class SchedulingService {
    async createAppointment(data: CreateAppointmentData): Promise<SchedulingResult<IAppointment>> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            // Business logic
            await session.commitTransaction();
            return { success: true, data };
        } catch (error) {
            await session.abortTransaction();
            return { success: false, error: error.message };
        } finally {
            session.endSession();
        }
    }
}

export const schedulingService = new SchedulingService();
```

**Strengths:**
- Singleton pattern for services
- Transaction support
- Proper error handling
- Result wrapper pattern

**Grade: A**

---

### 2. Repository Pattern (via Mongoose) ✅

**Implementation:**
```typescript
// Static methods on models act as repositories
AppointmentSchema.statics.findByTimeRange = function(clinicId, startDate, endDate) {
    return this.aggregate([...]);
};

AppointmentSchema.statics.findAvailabilityConflicts = async function(...) {
    return this.find(query).populate(...);
};
```

**Strengths:**
- Encapsulates data access
- Reusable queries
- Proper use of aggregation
- Lean queries for performance

**Grade: A**

---

### 3. Middleware Chain Pattern ✅

**Implementation:**
```typescript
// app.ts
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(mongoSanitization);
app.use(csrfProtection);
app.use(checkDatabaseConnection);
app.use(authenticate);
app.use(authorize('admin'));
```

**Strengths:**
- Proper middleware ordering
- Reusable middleware
- Clear separation of concerns

**Grade: A**

---

### 4. Factory Pattern (Partial) 🟡

**Current:**
```typescript
// No factory pattern for creating complex objects
const appointment = new Appointment({ ... });
```

**Opportunity:**
```typescript
class AppointmentFactory {
    static createFromBooking(booking: BookingData): Appointment {
        // Complex creation logic
    }
}
```

**Grade: B** - Could benefit from factories for complex object creation

---

### 5. Strategy Pattern (Missing) 🟡

**Opportunity:**
```typescript
// Different notification strategies
interface NotificationStrategy {
    send(message: Message): Promise<void>;
}

class EmailStrategy implements NotificationStrategy { ... }
class SMSStrategy implements NotificationStrategy { ... }
class WhatsAppStrategy implements NotificationStrategy { ... }
```

**Grade: C** - No strategy pattern for varying behaviors

---

## Authentication Architecture

### Dual Authentication System ✅

```
┌─────────────────────────────────────┐
│      Staff Authentication           │
│  - JWT with 15min access token      │
│  - 7-day refresh token              │
│  - Role-based access control        │
│  - MFA support                      │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│     Patient Authentication          │
│  - JWT with 30min access token      │
│  - 30-day refresh token             │
│  - Patient-specific endpoints       │
│  - SMS verification                 │
└─────────────────────────────────────┘

         Both use:
┌─────────────────────────────────────┐
│  - HttpOnly cookies                 │
│  - Refresh token rotation           │
│  - Redis token blacklist            │
│  - Rate limiting                    │
│  - CSRF protection                  │
└─────────────────────────────────────┘
```

**Strengths:**
- Separate auth flows for different user types
- Proper token management
- Security best practices
- Scalable design

**Grade: A**

---

## Database Architecture

### Schema Design ✅

**Base Schema Pattern:**
```typescript
// base/baseSchema.ts
export const baseSchemaFields = {
    _id: { type: Schema.Types.ObjectId, auto: true },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true }
};

export const baseSchemaOptions = {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
};
```

**Mixin Pattern:**
```typescript
// mixins/clinicScopedMixin.ts
export const clinicScopedFields = {
    clinic: {
        type: Schema.Types.ObjectId,
        ref: 'Clinic',
        required: true,
        index: true
    }
};

// mixins/auditableMixin.ts
export const auditableFields = {
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
};
```

**Usage:**
```typescript
const AppointmentSchema = new Schema({
    ...baseSchemaFields,
    ...clinicScopedFields,
    ...auditableFields,
    // Model-specific fields
});
```

**Strengths:**
- DRY principle
- Consistent schema structure
- Reusable patterns
- Easy to maintain

**Grade: A**

---

### Index Strategy ✅

**Appointment Model - 15 Indexes:**

1. **Primary Scheduling** (Most Important)
   ```typescript
   { clinic: 1, scheduledStart: 1, status: 1 }
   ```

2. **Provider Availability** (Most Important)
   ```typescript
   { provider: 1, scheduledStart: 1, scheduledEnd: 1, status: 1 }
   ```

3. **Prevent Double-Booking** (Unique)
   ```typescript
   { provider: 1, scheduledStart: 1, scheduledEnd: 1 }
   // Partial filter: status not in ['cancelled', 'no_show']
   ```

4. **Patient History**
   ```typescript
   { patient: 1, scheduledStart: -1, status: 1 }
   ```

5. **Additional Indexes:**
   - Daily schedule view
   - Status-based queries
   - Operatory/Room availability
   - Recurring appointments
   - Follow-up tracking
   - Billing queries
   - Satisfaction tracking
   - Sync status

**Strengths:**
- Comprehensive coverage
- Compound indexes for common queries
- Partial indexes for constraints
- Background index creation

**Grade: A**

---

### Transaction Support ✅

**Implementation:**
```typescript
async createAppointment(data: CreateAppointmentData): Promise<SchedulingResult<IAppointment>> {
    const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID;
    const session = isTestEnv ? null : await mongoose.startSession();

    try {
        if (!isTestEnv) {
            session!.startTransaction();
        }
        
        // Critical operations within transaction
        const availabilityCheck = await this.isTimeSlotAvailableWithSession(
            clinicId, providerId, scheduledStart, scheduledEnd, 
            appointmentType, session, undefined
        );
        
        if (!availabilityCheck.available) {
            throw new Error(`Horário não disponível: ${availabilityCheck.reason}`);
        }
        
        const savedAppointment = await appointment.save({ session });
        
        if (!isTestEnv) {
            await session!.commitTransaction();
        }
        
        return { success: true, data: savedAppointment };
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

**Strengths:**
- Prevents race conditions
- ACID compliance
- Test environment handling
- Proper cleanup

**Grade: A**

---

## API Architecture

### Versioning Strategy ✅

**Implementation:**
```typescript
// API versioning middleware
app.use('/api', apiVersionMiddleware);

// Version-specific routes
app.use('/api/v1', v1Routes);

// Default routes (v1)
app.use('/api/auth', authRoutes);
app.use('/api/scheduling', schedulingRoutes);
```

**Strengths:**
- Supports multiple versions
- Backward compatibility
- Clear migration path

**Grade: A**

---

### Response Format ✅

**Consistent Structure:**
```typescript
// Success
{
    success: true,
    data: { ... },
    message?: string
}

// Error
{
    success: false,
    error: string,
    message?: string
}

// With warnings
{
    success: true,
    data: { ... },
    warnings: string[]
}
```

**Grade: A**

---

## Security Architecture

### Multi-Layer Security ✅

**Layer 1: Network**
- Helmet security headers
- CORS configuration
- Trust proxy settings

**Layer 2: Rate Limiting**
- Tiered rate limits
- Per-endpoint limits
- IP + email-based limiting

**Layer 3: Input Validation**
- express-validator
- MongoDB sanitization
- XSS prevention

**Layer 4: Authentication**
- JWT tokens
- Refresh token rotation
- Token blacklist

**Layer 5: Authorization**
- Role-based access control
- Resource-level permissions
- Clinic scoping

**Layer 6: Audit**
- Audit logging
- Request correlation IDs
- Activity tracking

**Grade: A**

---

## Scalability Considerations

### Horizontal Scaling ✅

**Stateless Design:**
- JWT tokens (no server-side sessions)
- Redis for shared state
- Database connection pooling

**Load Balancing Ready:**
- Trust proxy configuration
- Health check endpoints
- Graceful shutdown

**Grade: A**

---

### Caching Strategy 🟡

**Current:**
- Redis configured
- Token blacklist in Redis
- Limited query caching

**Opportunity:**
- Cache frequently accessed data
- Cache provider availability
- Cache appointment types
- Implement cache invalidation

**Grade: B** - Good foundation, needs expansion

---

## Event-Driven Architecture 🟡

**Current:**
```typescript
// events/EventBus.ts exists
class EventBus {
    // Event emitter implementation
}
```

**Usage:**
- Limited implementation
- Not widely used across services

**Opportunity:**
- Emit events for appointments (created, updated, cancelled)
- Decouple notification sending
- Audit trail events
- Analytics events

**Grade: C** - Infrastructure exists but underutilized

---

## Dependency Injection 🟡

**Current:**
```typescript
// container/ServiceContainer.ts exists
class ServiceContainer {
    // DI container implementation
}
```

**Usage:**
- Container exists but not consistently used
- Most services use singleton pattern
- Direct imports instead of DI

**Opportunity:**
- Use DI for all services
- Easier testing with mocks
- Better decoupling

**Grade: C** - Infrastructure exists but not adopted

---

## Error Handling

### Centralized Error Handling ✅

**Implementation:**
```typescript
// middleware/errorHandler.ts
export const errorHandler = (err, req, res, next) => {
    logger.error({ err, req }, 'Request error');
    
    if (err instanceof ValidationError) {
        return res.status(400).json({ success: false, error: err.message });
    }
    
    if (err instanceof AuthenticationError) {
        return res.status(401).json({ success: false, error: err.message });
    }
    
    // Generic error
    return res.status(500).json({ 
        success: false, 
        error: 'Erro interno do servidor' 
    });
};
```

**Custom Error Classes:**
```typescript
// utils/errors/errors.ts
export class AppError extends Error { ... }
export class ValidationError extends AppError { ... }
export class AuthenticationError extends AppError { ... }
export class AuthorizationError extends AppError { ... }
```

**Grade: A**

---

## Configuration Management

### Environment-Based Config ✅

**Implementation:**
```typescript
// config/env.ts
export const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    database: {
        url: process.env.DATABASE_URL || 'mongodb://localhost:27017/topsmile'
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '15m'
    },
    // ... more config
};

export const validateEnv = (): void => {
    // Validation logic
};
```

**Strengths:**
- Centralized configuration
- Environment validation
- Type-safe config
- Sensible defaults

**Grade: A**

---

## Monitoring & Observability

### Logging ✅

**Pino Logger:**
```typescript
// config/logger.ts
import pino from 'pino';

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: { colorize: true }
    }
});
```

**HTTP Logging:**
```typescript
import pinoHttp from 'pino-http';

const httpLogger = pinoHttp({ 
    logger,
    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
    }
});
```

**Issue:** 289 console.log statements still in code

**Grade: B** - Good infrastructure, inconsistent usage

---

### Health Checks ✅

**Endpoints:**
1. `/api/health` - Basic health
2. `/api/health/database` - Database health
3. `/api/health/metrics` - System metrics (admin only)

**Grade: A**

---

## Architecture Strengths

1. ✅ **Clean Layered Architecture** - Proper separation of concerns
2. ✅ **Excellent Security** - Multi-layer security approach
3. ✅ **Scalable Design** - Stateless, horizontally scalable
4. ✅ **Database Design** - Comprehensive indexes, transactions
5. ✅ **API Design** - Versioning, consistent responses
6. ✅ **Configuration** - Environment-based, validated
7. ✅ **Error Handling** - Centralized, custom error classes

---

## Architecture Weaknesses

1. 🟡 **Event-Driven** - Infrastructure exists but underutilized
2. 🟡 **Dependency Injection** - Container exists but not adopted
3. 🟡 **Caching** - Limited implementation
4. 🟡 **Logging** - Inconsistent (console vs Pino)
5. 🟡 **Strategy Pattern** - Missing for varying behaviors

---

## Recommendations

### High Priority
1. **Standardize Logging** - Replace all console.* with Pino
2. **Expand Caching** - Implement query result caching
3. **Adopt DI Container** - Use ServiceContainer consistently

### Medium Priority
1. **Event-Driven** - Emit events for key operations
2. **Factory Pattern** - For complex object creation
3. **Strategy Pattern** - For notification strategies

### Low Priority
1. **Architecture Diagrams** - Document system architecture
2. **ADR (Architecture Decision Records)** - Document key decisions

---

## Overall Architecture Grade: A-

**Excellent foundation with room for optimization in event-driven patterns and dependency injection.**
