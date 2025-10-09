# TopSmile - Project Structure

## Monorepo Organization

TopSmile uses a monorepo structure with three main packages:

```
topsmile/
├── src/                    # Frontend React application
├── backend/                # Backend Express API server
├── packages/types/         # Shared TypeScript types
├── cypress/                # E2E tests
├── docs/                   # Documentation
├── scripts/                # Build and utility scripts
└── .github/workflows/      # CI/CD pipelines
```

## Frontend Structure (`/src`)

### Core Directories
- **components/** - Reusable UI components organized by feature
  - `Admin/` - Admin dashboard components
  - `Auth/` - Authentication forms and flows
  - `Booking/` - Appointment booking interface
  - `Calendar/` - Calendar and scheduling views
  - `Clinical/` - Clinical workflow components
  - `PatientPortal/` - Patient self-service components
  - `Payment/` - Payment processing UI
  - `common/` - Shared UI components
  - `UI/` - Base UI elements (buttons, inputs, modals)

- **features/** - Feature modules with business logic
  - `appointments/` - Appointment management
  - `auth/` - Authentication logic
  - `booking/` - Booking workflows
  - `clinical/` - Clinical features
  - `dashboard/` - Dashboard views
  - `patients/` - Patient management
  - `providers/` - Provider management

- **services/** - API communication layer
  - `api/` - API service modules
  - `base/` - Base HTTP client
  - `interceptors/` - Request/response interceptors
  - `apiService.ts` - Main API service
  - `paymentService.ts` - Stripe integration

- **contexts/** - React Context providers
  - `AuthContext.tsx` - Staff authentication state
  - `PatientAuthContext.tsx` - Patient authentication state
  - `ErrorContext.tsx` - Global error handling

- **store/** - Zustand state management
  - `authStore.ts` - Authentication state
  - `appStore.ts` - Application state
  - `clinicalStore.ts` - Clinical data state

- **hooks/** - Custom React hooks
  - `useApiQuery.ts` - API data fetching
  - `useForm.ts` - Form handling
  - `useErrorHandler.ts` - Error handling
  - `useAccessibility.ts` - Accessibility features
  - `usePerformanceMonitor.ts` - Performance tracking

- **layouts/** - Page layout components
  - `MainLayout/` - Public pages layout
  - `DashboardLayout/` - Staff dashboard layout
  - `PatientPortalLayout/` - Patient portal layout
  - `AuthLayout/` - Authentication pages layout

- **routes/** - Route configuration and definitions
- **pages/** - Page components mapped to routes
- **styles/** - Global styles and CSS variables
- **utils/** - Utility functions and helpers
- **mocks/** - MSW mock handlers for testing

## Backend Structure (`/backend/src`)

### Core Directories
- **routes/** - Express route handlers organized by domain
  - `auth/` - Staff authentication endpoints
  - `patientAuth/` - Patient authentication endpoints
  - `scheduling/` - Appointment and scheduling routes
  - `patients/` - Patient management routes
  - `providers/` - Provider management routes
  - `clinics/` - Clinic configuration routes
  - `payments/` - Payment processing routes

- **services/** - Business logic layer
  - `auth/` - Authentication services
  - `scheduling/` - Scheduling and appointment logic
  - `patients/` - Patient management logic
  - `providers/` - Provider management logic
  - `notifications/` - Email and SMS notifications
  - `payments/` - Payment processing logic

- **models/** - Mongoose database models
  - `User.ts` - Staff user model
  - `Patient.ts` - Patient model
  - `Provider.ts` - Provider model
  - `Appointment.ts` - Appointment model
  - `Clinic.ts` - Clinic configuration model
  - `RefreshToken.ts` - Token management model

- **middleware/** - Express middleware
  - `auth.ts` - Authentication middleware
  - `validation.ts` - Request validation
  - `errorHandler.ts` - Error handling
  - `rateLimiter.ts` - Rate limiting
  - `csrf.ts` - CSRF protection
  - `sanitization.ts` - Input sanitization

- **validation/** - express-validator schemas
  - `auth.ts` - Authentication validation
  - `appointment.ts` - Appointment validation
  - `patient.ts` - Patient validation
  - `common.ts` - Shared validation rules

- **config/** - Configuration files
  - `database.ts` - MongoDB connection
  - `redis.ts` - Redis configuration
  - `constants.ts` - Application constants
  - `swagger.ts` - API documentation

- **utils/** - Utility functions
  - `jwt.ts` - JWT token utilities
  - `logger.ts` - Logging configuration
  - `errors.ts` - Custom error classes
  - `validators.ts` - Custom validators

- **container/** - Dependency injection container
- **events/** - Event emitters and handlers
- **types/** - Backend-specific TypeScript types

## Shared Types (`/packages/types`)

Centralized TypeScript interfaces and types shared between frontend and backend:
- API request/response types
- Domain models (User, Patient, Provider, Appointment, etc.)
- Enums and constants
- Utility types

## Testing Structure

### Frontend Tests (`/src/tests`)
- `components/` - Component unit tests
- `hooks/` - Custom hook tests
- `services/` - API service tests
- `contexts/` - Context provider tests
- `integration/` - Integration tests
- `accessibility/` - A11y compliance tests
- `performance/` - Performance tests

### Backend Tests (`/backend/tests`)
- `unit/` - Unit tests for services and utilities
- `integration/` - API endpoint integration tests
- `e2e/` - End-to-end workflow tests
- `performance/` - Load and performance tests
- `fixtures/` - Test data and fixtures
- `helpers/` - Test utilities

### E2E Tests (`/cypress`)
- `e2e/` - Cypress test specifications
- `support/` - Custom commands and utilities

## Documentation (`/docs`)

- **architecture/** - System architecture documentation
  - Database schema and indexes
  - Authentication flows
  - Security best practices
  - System architecture diagrams

- **api/** - API documentation
  - Swagger setup and configuration

- **review/** - Code review reports
  - Architecture reviews
  - Security audits
  - Action plans

- **phase2/** and **phase3/** - Feature development documentation

## CI/CD Pipelines (`.github/workflows`)

- `test.yml` - Automated testing on PR and push
- `coverage.yml` - Code coverage reporting
- `quality.yml` - Code quality checks (linting, type-checking)
- `security-scan.yml` - Security vulnerability scanning
- `deploy.yml` - Deployment automation

## Architectural Patterns

### Frontend Architecture
- **Component-Based**: Modular React components with clear responsibilities
- **Feature Modules**: Business logic organized by domain features
- **State Management**: Zustand for global state, React Query for server state
- **Service Layer**: Centralized API communication with interceptors
- **Layout System**: Reusable layouts for different user roles
- **Route Protection**: Role-based route guards

### Backend Architecture
- **Layered Architecture**: Routes → Services → Models
- **Dependency Injection**: Container-based DI for testability
- **Middleware Pipeline**: Composable middleware for cross-cutting concerns
- **Event-Driven**: Event emitters for decoupled operations
- **Repository Pattern**: Data access abstraction through Mongoose models
- **Validation Layer**: Centralized input validation with express-validator

### Data Flow
1. **Frontend Request** → API Service → HTTP Client → Backend Route
2. **Backend Route** → Middleware (auth, validation) → Service Layer
3. **Service Layer** → Business Logic → Model/Database
4. **Response** → Service → Route → Frontend → State Update → UI Render

### Security Layers
1. **Network**: CORS, Helmet, Rate Limiting
2. **Authentication**: JWT with HttpOnly cookies, dual auth systems
3. **Authorization**: Role-based access control (RBAC)
4. **Input**: Validation, sanitization, CSRF protection
5. **Data**: Encryption at rest, secure password hashing
