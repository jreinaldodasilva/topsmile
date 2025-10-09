# TopSmile System Architecture Overview

**Document Version:** 1.0.0  
**Last Updated:** 2024-01-15  
**Status:** ✅ Complete

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [System Overview](#system-overview)
3. [Architecture Principles](#architecture-principles)
4. [Component Architecture](#component-architecture)
5. [Technology Stack](#technology-stack)
6. [Deployment Architecture](#deployment-architecture)
7. [Integration Patterns](#integration-patterns)
8. [Data Flow](#data-flow)
9. [Security Architecture](#security-architecture)
10. [Scalability & Performance](#scalability--performance)
11. [Improvement Recommendations](#improvement-recommendations)

---

## Executive Summary

TopSmile is a comprehensive dental clinic management system built on a modern monorepo architecture with React frontend, Express backend, and MongoDB database. The system implements dual authentication (staff and patient), multi-tenant clinic isolation, and integrates with third-party services for payments, notifications, and communications.

**Key Architectural Highlights:**
- **Monorepo Structure**: Unified codebase with shared types
- **Dual Authentication**: Separate auth systems for staff and patients
- **Multi-Tenant**: Clinic-scoped data isolation
- **Layered Architecture**: Clear separation of concerns
- **Event-Driven**: Decoupled operations via event bus
- **API Versioning**: Support for multiple API versions

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend (Port 3000)                                      │
│  ├─ Patient Portal                                               │
│  ├─ Staff Dashboard                                              │
│  └─ Admin Console                                                │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS/REST API
┌────────────────────────┴────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  Express Backend (Port 5000)                                     │
│  ├─ API Routes (v1)                                              │
│  ├─ Middleware Pipeline                                          │
│  ├─ Service Layer                                                │
│  └─ Event Bus                                                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────────┐
│                       DATA LAYER                                 │
├─────────────────────────────────────────────────────────────────┤
│  ├─ MongoDB (Primary Database)                                   │
│  └─ Redis (Cache & Sessions)                                     │
└─────────────────────────────────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│  ├─ Stripe (Payments)                                            │
│  ├─ SendGrid (Email)                                             │
│  └─ Twilio (SMS)                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### System Boundaries

**Internal Systems:**
- React Frontend Application
- Express Backend API
- MongoDB Database
- Redis Cache

**External Systems:**
- Stripe Payment Gateway
- SendGrid Email Service
- Twilio SMS Service
- Third-party OAuth providers (future)

---

## Architecture Principles

### 1. Separation of Concerns
- **Frontend**: UI/UX, state management, user interactions
- **Backend**: Business logic, data validation, security
- **Database**: Data persistence and integrity

### 2. Single Responsibility
- Each service handles one domain
- Routes delegate to services
- Services encapsulate business logic

### 3. DRY (Don't Repeat Yourself)
- Shared types in `/packages/types`
- Reusable middleware
- Common utility functions

### 4. Security by Design
- Authentication at every layer
- Input validation and sanitization
- CSRF protection
- Rate limiting

### 5. Scalability First
- Stateless API design
- Redis caching
- Database indexing
- Horizontal scaling ready

### 6. Testability
- Dependency injection
- Mock-friendly architecture
- Comprehensive test coverage

---

## Component Architecture

### Frontend Architecture

```
src/
├── components/          # Reusable UI components
│   ├── Admin/          # Admin-specific components
│   ├── Auth/           # Authentication components
│   ├── Booking/        # Appointment booking
│   ├── Clinical/       # Clinical workflows
│   ├── PatientPortal/  # Patient self-service
│   └── UI/             # Base UI elements
├── features/           # Feature modules
│   ├── appointments/   # Appointment management
│   ├── auth/           # Authentication logic
│   ├── patients/       # Patient management
│   └── providers/      # Provider management
├── services/           # API communication
│   ├── api/            # API service modules
│   ├── base/           # Base HTTP client
│   └── interceptors/   # Request/response interceptors
├── contexts/           # React Context providers
├── store/              # Zustand state management
├── hooks/              # Custom React hooks
├── layouts/            # Page layouts
└── routes/             # Route configuration
```

**Key Patterns:**
- **Component-Based**: Modular, reusable components
- **Feature Modules**: Domain-driven organization
- **Service Layer**: Centralized API communication
- **State Management**: Zustand for global state, React Query for server state
- **Layout System**: Role-based layouts

### Backend Architecture

```
backend/src/
├── routes/             # Express route handlers
│   ├── auth/           # Staff authentication
│   ├── patient-auth/   # Patient authentication
│   ├── scheduling/     # Appointments & scheduling
│   ├── clinical/       # Clinical workflows
│   ├── admin/          # Admin operations
│   └── v1/             # API version 1
├── services/           # Business logic layer
│   ├── auth/           # Authentication services
│   ├── scheduling/     # Scheduling logic
│   ├── clinical/       # Clinical services
│   └── external/       # Third-party integrations
├── models/             # Mongoose database models
│   ├── base/           # Base schemas
│   └── mixins/         # Reusable schema mixins
├── middleware/         # Express middleware
│   ├── auth/           # Authentication middleware
│   ├── security/       # Security middleware
│   └── validation/     # Input validation
├── config/             # Configuration files
├── utils/              # Utility functions
└── validation/         # Validation schemas
```

**Key Patterns:**
- **Layered Architecture**: Routes → Services → Models
- **Middleware Pipeline**: Composable middleware
- **Dependency Injection**: Container-based DI
- **Event-Driven**: Event bus for decoupled operations
- **Repository Pattern**: Data access through models

---

## Technology Stack

### Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI library |
| TypeScript | 4.9.5 | Type safety |
| React Router | 6.30.1 | Client-side routing |
| Zustand | 4.5.7 | State management |
| TanStack Query | 5.89.0 | Server state & caching |
| Framer Motion | 10.16.5 | Animations |
| Luxon | 3.7.1 | Date/time handling |
| Stripe React | 4.0.2 | Payment UI |

### Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | ≥18.0.0 | Runtime |
| Express | 4.21.2 | Web framework |
| TypeScript | 5.9.2 | Type safety |
| Mongoose | 8.18.0 | MongoDB ODM |
| Redis (ioredis) | 5.7.0 | Caching & sessions |
| JWT | 9.0.2 | Authentication |
| Bcrypt | 6.0.0 | Password hashing |
| Helmet | 7.2.0 | Security headers |
| Express Validator | 7.2.1 | Input validation |

### Database & Cache

| Technology | Purpose |
|------------|---------|
| MongoDB | Primary database |
| Redis | Cache, sessions, token blacklist |

### External Services

| Service | Purpose |
|---------|---------|
| Stripe | Payment processing |
| SendGrid | Email notifications |
| Twilio | SMS notifications |

### Development Tools

| Tool | Purpose |
|------|---------|
| Jest | Testing framework |
| Cypress | E2E testing |
| ESLint | Code linting |
| Swagger | API documentation |
| Pino | Logging |

---

## Deployment Architecture

### Current Deployment Model

```
┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer                           │
│                    (HTTPS Termination)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐       ┌───────▼────────┐
│  Frontend      │       │  Backend       │
│  (React SPA)   │       │  (Express API) │
│  Port 3000     │       │  Port 5000     │
└────────────────┘       └───────┬────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            ┌───────▼────────┐       ┌───────▼────────┐
            │  MongoDB       │       │  Redis         │
            │  (Primary DB)  │       │  (Cache)       │
            └────────────────┘       └────────────────┘
```

### Environment Configuration

**Development:**
- Local MongoDB instance
- Local Redis instance
- Hot reload enabled
- Debug logging
- Mock external services

**Staging:**
- Managed MongoDB (Atlas)
- Managed Redis
- Production-like configuration
- Integration testing
- Real external services (test mode)

**Production:**
- Managed MongoDB with replica sets
- Managed Redis with persistence
- Optimized builds
- Error logging only
- Real external services

### CI/CD Pipeline

```
┌──────────────┐
│  Git Push    │
└──────┬───────┘
       │
┌──────▼───────┐
│  GitHub      │
│  Actions     │
└──────┬───────┘
       │
       ├─────────────────┐
       │                 │
┌──────▼───────┐  ┌──────▼───────┐
│  Test Suite  │  │  Lint &      │
│  (Jest)      │  │  Type Check  │
└──────┬───────┘  └──────┬───────┘
       │                 │
       └────────┬────────┘
                │
         ┌──────▼───────┐
         │  Build       │
         │  (TypeScript)│
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │  Deploy      │
         │  (Staging)   │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │  E2E Tests   │
         │  (Cypress)   │
         └──────┬───────┘
                │
         ┌──────▼───────┐
         │  Deploy      │
         │  (Production)│
         └──────────────┘
```

---

## Integration Patterns

### API Communication

**Request Flow:**
```
Frontend → HTTP Client → Interceptors → Backend API → Middleware → Route → Service → Model → Database
```

**Response Flow:**
```
Database → Model → Service → Route → Middleware → Response Wrapper → Interceptors → HTTP Client → Frontend
```

### Authentication Flow

**Staff Authentication:**
```
1. User submits credentials
2. Backend validates credentials
3. Generate JWT access token (15min) + refresh token (7 days)
4. Store tokens in HttpOnly cookies
5. Return user data
6. Frontend stores user in context/store
```

**Patient Authentication:**
```
1. Patient submits credentials
2. Backend validates credentials
3. Generate JWT access token (30min) + refresh token (30 days)
4. Store tokens in HttpOnly cookies
5. Return patient data
6. Frontend stores patient in context/store
```

### Event-Driven Architecture

```typescript
// Event emission
eventBus.emit('appointment.created', { appointmentId, patientId });

// Event handling
eventBus.on('appointment.created', async (data) => {
  await emailService.sendAppointmentConfirmation(data);
  await smsService.sendAppointmentReminder(data);
});
```

### Third-Party Integration Pattern

```typescript
// Service abstraction
interface EmailService {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}

// Implementation
class SendGridEmailService implements EmailService {
  async sendEmail(to: string, subject: string, body: string) {
    // SendGrid-specific implementation
  }
}

// Usage
const emailService: EmailService = new SendGridEmailService();
```

---

## Data Flow

### Request/Response Cycle

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. HTTP Request
┌──────▼──────┐
│  Frontend   │
│  Service    │
└──────┬──────┘
       │ 2. API Call
┌──────▼──────┐
│  Backend    │
│  Route      │
└──────┬──────┘
       │ 3. Middleware
┌──────▼──────┐
│  Service    │
│  Layer      │
└──────┬──────┘
       │ 4. Database Query
┌──────▼──────┐
│  MongoDB    │
└──────┬──────┘
       │ 5. Data
┌──────▼──────┐
│  Service    │
│  Layer      │
└──────┬──────┘
       │ 6. Response
┌──────▼──────┐
│  Backend    │
│  Route      │
└──────┬──────┘
       │ 7. JSON Response
┌──────▼──────┐
│  Frontend   │
│  Service    │
└──────┬──────┘
       │ 8. State Update
┌──────▼──────┐
│   Browser   │
└─────────────┘
```

### State Management Flow

**Frontend State:**
```
User Action → Component → Hook → Service → API Call
                ↓
            State Update (Zustand/React Query)
                ↓
            Component Re-render
```

**Backend State:**
```
Request → Middleware → Route → Service → Model
                                  ↓
                            Database Query
                                  ↓
                            Cache Update (Redis)
                                  ↓
                            Response
```

---

## Security Architecture

### Defense in Depth

**Layer 1: Network Security**
- HTTPS/TLS encryption
- CORS configuration
- Helmet security headers
- Rate limiting

**Layer 2: Authentication**
- JWT with HttpOnly cookies
- Refresh token rotation
- Token blacklisting (Redis)
- Dual auth systems (staff/patient)

**Layer 3: Authorization**
- Role-based access control (RBAC)
- Permission matrix
- Clinic-scoped data isolation
- Route-level authorization

**Layer 4: Input Validation**
- express-validator schemas
- MongoDB sanitization
- XSS prevention (DOMPurify)
- SQL injection prevention

**Layer 5: Data Protection**
- Password hashing (bcrypt)
- Sensitive data encryption
- Secure session management
- CSRF protection

### Security Middleware Pipeline

```
Request
  ↓
Helmet (Security Headers)
  ↓
CORS (Origin Validation)
  ↓
Rate Limiter (DDoS Protection)
  ↓
Body Parser (Size Limits)
  ↓
MongoDB Sanitization
  ↓
CSRF Protection
  ↓
Authentication (JWT Validation)
  ↓
Authorization (Role Check)
  ↓
Route Handler
```

---

## Scalability & Performance

### Current Performance Characteristics

**Frontend:**
- Code splitting by route
- Lazy loading components
- React Query caching
- Optimized bundle size (~500KB gzipped)

**Backend:**
- Stateless API design
- Redis caching
- Database indexing
- Connection pooling

**Database:**
- Indexed queries
- Aggregation pipelines
- Lean queries for read-only operations
- Compound indexes for common queries

### Scalability Strategies

**Horizontal Scaling:**
- Stateless backend (can add more instances)
- Load balancer distribution
- Redis for shared session state
- MongoDB replica sets

**Vertical Scaling:**
- Increase server resources
- Optimize database queries
- Implement caching layers
- Use CDN for static assets

**Caching Strategy:**
```
Level 1: Browser Cache (static assets)
Level 2: React Query Cache (API responses)
Level 3: Redis Cache (frequently accessed data)
Level 4: MongoDB (persistent storage)
```

---

## Improvement Recommendations

### 🟥 Critical Improvements

1. **Implement API Gateway**
   - Centralize authentication
   - Rate limiting per user
   - Request/response transformation
   - **Impact**: High security, better performance
   - **Effort**: 2-3 weeks

2. **Add Database Replication**
   - MongoDB replica sets
   - Read/write splitting
   - Automatic failover
   - **Impact**: High availability
   - **Effort**: 1 week

3. **Implement Comprehensive Logging**
   - Structured logging (Pino)
   - Log aggregation (ELK/CloudWatch)
   - Error tracking (Sentry)
   - **Impact**: Better observability
   - **Effort**: 1-2 weeks

### 🟧 High Priority Improvements

4. **Microservices Extraction**
   - Extract payment service
   - Extract notification service
   - Extract scheduling service
   - **Impact**: Better scalability
   - **Effort**: 2-3 months

5. **Implement GraphQL**
   - Replace REST with GraphQL
   - Reduce over-fetching
   - Better type safety
   - **Impact**: Improved performance
   - **Effort**: 1-2 months

6. **Add Real-time Features**
   - WebSocket support
   - Real-time appointment updates
   - Live notifications
   - **Impact**: Better UX
   - **Effort**: 2-3 weeks

### 🟨 Medium Priority Improvements

7. **Implement Service Mesh**
   - Istio or Linkerd
   - Service-to-service encryption
   - Traffic management
   - **Impact**: Better security
   - **Effort**: 1 month

8. **Add Performance Monitoring**
   - APM tool (New Relic/DataDog)
   - Performance metrics
   - Bottleneck identification
   - **Impact**: Better performance
   - **Effort**: 1 week

9. **Implement Feature Flags**
   - LaunchDarkly or similar
   - A/B testing capability
   - Gradual rollouts
   - **Impact**: Better deployment
   - **Effort**: 1 week

### 🟩 Low Priority Improvements

10. **Add Internationalization (i18n)**
    - Multi-language support
    - Locale-specific formatting
    - **Impact**: Market expansion
    - **Effort**: 2-3 weeks

11. **Implement PWA Features**
    - Offline support
    - Push notifications
    - Install prompts
    - **Impact**: Better mobile UX
    - **Effort**: 1-2 weeks

---

## Related Documents

- [02-Frontend-Architecture.md](./02-Frontend-Architecture.md) - Detailed frontend architecture
- [03-Backend-Architecture.md](./03-Backend-Architecture.md) - Detailed backend architecture
- [04-Database-Schema.md](./04-Database-Schema.md) - Database design and schemas
- [09-Authentication-Authorization-Spec.md](../security/09-Authentication-Authorization-Spec.md) - Security details
- [18-Comprehensive-Improvement-Report.md](../improvements/18-Comprehensive-Improvement-Report.md) - Full improvement analysis

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2024-01-15 | Initial architecture documentation | TopSmile Team |

---

**Next Steps:**
1. Review detailed component architectures
2. Study authentication and security specifications
3. Implement critical improvements
4. Set up monitoring and logging
