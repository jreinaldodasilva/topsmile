# Project Structure

## Architecture Overview
TopSmile follows a monorepo structure with separate frontend (React) and backend (Express) applications, plus a shared types package for end-to-end type safety.

## Root Directory Structure

```
topsmile/
├── src/                    # React frontend application
├── backend/                # Express backend API
├── packages/types/         # Shared TypeScript types (@topsmile/types)
├── cypress/                # End-to-end tests
├── docs/                   # Project documentation
├── public/                 # Static assets
├── scripts/                # Build and utility scripts
└── reports/                # Test and coverage reports
```

## Frontend Structure (`src/`)

### Core Directories
- **components/**: Reusable UI components organized by feature
  - `Admin/`: User management, system settings
  - `Auth/`: Login, registration, MFA components
  - `Booking/`: Online appointment booking
  - `Calendar/`: Scheduling and calendar views
  - `Clinical/`: Dental charts, treatment plans, SOAP notes
  - `PatientPortal/`: Patient self-service components
  - `Payment/`: Stripe integration, invoicing
  - `common/`: Shared UI components (buttons, modals, forms)
  - `UI/`: Design system components
  - `lazy/`: Lazy-loaded component wrappers

- **pages/**: Route-level page components
  - `Admin/`: Administrative pages
  - `Calendar/`: Scheduling interface
  - `Patient/`: Patient management pages (including PatientDetail)
  - `Login/`: Authentication pages
  - `Home/`: Landing page

- **features/**: Feature-specific business logic
  - `appointments/`: Appointment management logic
  - `auth/`: Authentication and authorization
  - `booking/`: Online booking workflows
  - `clinical/`: Clinical data management
  - `patients/`: Patient data operations
  - `providers/`: Provider management

- **hooks/**: Custom React hooks
  - `useApiQuery.ts`: API data fetching
  - `useApiState.ts`: API state management
  - `useErrorHandler.ts`: Error handling
  - `useForm.ts`: Form state and validation
  - `usePerformanceMonitor.ts`: Performance tracking
  - `useAccessibility.ts`: A11y utilities

- **services/**: API communication layer
  - `apiService.ts`: Core API client
  - `http.ts`: HTTP client configuration
  - `paymentService.ts`: Payment processing
  - `base/`: Base service classes
  - `interceptors/`: Request/response interceptors

- **store/**: Zustand state management
  - `authStore.ts`: Authentication state
  - `clinicalStore.ts`: Clinical data state
  - `appStore.ts`: Global application state

- **contexts/**: React context providers
  - `AuthContext.tsx`: Authentication context
  - `ErrorContext.tsx`: Error handling context
  - `PatientAuthContext.tsx`: Patient portal authentication

- **layouts/**: Page layout components
  - `MainLayout/`: Public pages layout
  - `DashboardLayout/`: Staff dashboard layout
  - `AuthLayout/`: Authentication pages layout
  - `PatientPortalLayout/`: Patient portal layout

- **routes/**: Routing configuration
  - `index.tsx`: Route definitions and protection

- **utils/**: Utility functions
  - `errors.ts`: Error handling utilities
  - `logger.ts`: Logging utilities
  - `performanceMonitor.ts`: Performance tracking
  - `lazyImports.ts`: Dynamic imports

- **tests/**: Frontend test suites
  - `accessibility/`: A11y tests
  - `components/`: Component tests
  - `integration/`: Integration tests
  - `performance/`: Performance tests

## Backend Structure (`backend/src/`)

### Core Directories
- **models/**: MongoDB/Mongoose data models (11 models)
  - `User.ts`: User accounts and authentication
  - `Patient.ts`: Patient records
  - `Appointment.ts`: Appointment scheduling
  - `DentalChart.ts`: Dental charting data
  - `TreatmentPlan.ts`: Treatment plans
  - `ClinicalNote.ts`: SOAP notes
  - `MedicalHistory.ts`: Patient medical history
  - `Provider.ts`: Healthcare providers
  - `Payment.ts`: Payment transactions
  - `AuditLog.ts`: Security audit logs
  - `Session.ts`: User sessions

- **routes/**: Express route handlers (20+ endpoints)
  - `auth.ts`: Authentication endpoints
  - `patients.ts`: Patient management
  - `appointments.ts`: Appointment scheduling
  - `providers.ts`: Provider management
  - `clinical.ts`: Clinical data endpoints
  - `payments.ts`: Payment processing

- **services/**: Business logic layer
  - `authService.ts`: Authentication logic
  - `schedulingService.ts`: Scheduling algorithms
  - `emailService.ts`: Email notifications
  - `smsService.ts`: SMS notifications
  - `paymentService.ts`: Payment processing

- **middleware/**: Express middleware
  - `auth.ts`: JWT authentication
  - `rbac.ts`: Role-based access control
  - `csrf.ts`: CSRF protection
  - `validation.ts`: Input validation
  - `errorHandler.ts`: Error handling
  - `rateLimiter.ts`: Rate limiting
  - `audit.ts`: Audit logging

- **config/**: Configuration files
  - `database.ts`: MongoDB connection
  - `redis.ts`: Redis configuration
  - `swagger.ts`: API documentation

- **validation/**: Input validation schemas
  - Zod schemas for request validation

- **tests/**: Backend test suites
  - `unit/`: Unit tests
  - `integration/`: Integration tests
  - `e2e/`: End-to-end API tests
  - `performance/`: Performance tests

## Shared Types Package (`packages/types/`)

### Purpose
Provides end-to-end type safety between frontend and backend with shared TypeScript definitions.

### Structure
- `src/index.ts`: Type exports
- `src/patient.ts`: Patient-related types
- `src/appointment.ts`: Appointment types
- `src/clinical.ts`: Clinical data types
- `src/common.ts`: Common/shared types

### Usage
```typescript
import { Patient, Appointment, DentalChart } from '@topsmile/types';
```

## Documentation Structure (`docs/`)

### Categories
- **api/**: API endpoint documentation
- **architecture/**: System architecture (C4 diagrams, data flow)
- **implementations/**: Implementation guides and summaries
- **reviews/**: Code reviews, performance analysis, security audits
- **user-flows/**: User workflow documentation
- **env_variables/**: Environment configuration guides

### Key Documents
- `API_INTEGRATION_GUIDE.md`: Complete API reference
- `COMPONENT_USAGE_GUIDE.md`: Component documentation
- `USER_GUIDE_PATIENT_MANAGEMENT.md`: User guide (Portuguese)
- `ADMIN_TRAINING_GUIDE.md`: Admin training (Portuguese)
- `SECURITY_AUDIT_REPORT.md`: Security assessment
- `DEPLOYMENT_CHECKLIST_PATIENT_MODULE.md`: Production deployment

## Testing Structure

### Frontend Tests (`src/tests/`)
- Unit tests with Jest and Testing Library
- Integration tests for feature workflows
- Accessibility tests with jest-axe
- Performance tests with custom monitoring

### Backend Tests (`backend/tests/`)
- Unit tests for services and utilities
- Integration tests for API endpoints
- E2E tests for complete workflows
- Performance tests with k6

### E2E Tests (`cypress/`)
- Critical user flows
- Authentication workflows
- Appointment booking
- Patient management
- Error handling scenarios

## Build and Configuration

### Root Configuration
- `package.json`: Frontend dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `jest.config.js`: Jest test configuration
- `cypress.config.ts`: Cypress E2E configuration
- `craco.config.js`: Create React App overrides

### Backend Configuration
- `backend/package.json`: Backend dependencies
- `backend/tsconfig.json`: Backend TypeScript config
- `backend/jest.config.js`: Backend test config

### Environment Files
- `.env`: Frontend environment variables
- `backend/.env`: Backend environment variables
- `.env.example`: Example configurations
- `.env.production.example`: Production examples

## Key Architectural Patterns

### Frontend Patterns
- **Component-Based Architecture**: Modular, reusable components
- **Feature-Based Organization**: Features grouped by domain
- **Lazy Loading**: Code splitting for performance
- **State Management**: Zustand for client state, TanStack Query for server state
- **Error Boundaries**: Graceful error handling
- **Context Providers**: Shared state and functionality

### Backend Patterns
- **Layered Architecture**: Routes → Services → Models
- **Middleware Pipeline**: Authentication, validation, error handling
- **Service Layer**: Business logic separation
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Service composition

### Database Design
- **11 MongoDB Collections**: Normalized data structure
- **50+ Optimized Indexes**: Query performance
- **Referential Integrity**: Mongoose population and validation
- **Audit Trail**: Comprehensive change tracking
