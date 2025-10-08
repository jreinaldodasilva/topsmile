# Project Structure

## Architecture Overview
TopSmile follows a monorepo structure with a clear separation between frontend (React), backend (Express), and shared types package. The architecture emphasizes type safety, modularity, and maintainability.

## Directory Structure

```
topsmile/
├── src/                          # React frontend application
├── backend/                      # Express backend API
├── packages/types/               # Shared TypeScript types (@topsmile/types)
├── cypress/                      # End-to-end tests
├── docs/                         # Project documentation
├── scripts/                      # Build and utility scripts
└── public/                       # Static assets
```

## Frontend Structure (`src/`)

### Core Directories
- **components/**: Reusable UI components organized by feature
  - `Admin/`: Administrative interface components
  - `Auth/`: Authentication forms and flows
  - `Booking/`: Appointment booking components
  - `Calendar/`: Scheduling calendar views
  - `Clinical/`: Dental charting, treatment plans, SOAP notes
  - `PatientPortal/`: Patient self-service components
  - `common/`: Shared UI elements (buttons, forms, modals)
  - `UI/`: Base design system components
  - `lazy/`: Lazy-loaded component wrappers

- **pages/**: Route-level page components
  - `Admin/`: Admin dashboard and management pages
  - `Patient/`: Patient management and detail pages
  - `Calendar/`: Scheduling interface
  - `Login/`: Authentication pages
  - `Home/`: Landing and marketing pages

- **features/**: Feature-specific logic and state
  - `appointments/`: Appointment management logic
  - `auth/`: Authentication state and flows
  - `booking/`: Online booking logic
  - `clinical/`: Clinical data management
  - `patients/`: Patient data operations
  - `providers/`: Provider management

- **hooks/**: Custom React hooks
  - `useApiQuery.ts`: API data fetching
  - `useForm.ts`: Form state management
  - `useErrorHandler.ts`: Error handling
  - `usePerformanceMonitor.ts`: Performance tracking
  - `useAccessibility.ts`: A11y utilities

- **services/**: API communication layer
  - `apiService.ts`: Core API client
  - `http.ts`: HTTP utilities and interceptors
  - `paymentService.ts`: Stripe integration
  - `base/`: Base service classes
  - `interceptors/`: Request/response interceptors

- **store/**: Zustand state management
  - `authStore.ts`: Authentication state
  - `appStore.ts`: Global application state
  - `clinicalStore.ts`: Clinical data state

- **contexts/**: React context providers
  - `AuthContext.tsx`: Authentication context
  - `PatientAuthContext.tsx`: Patient portal auth
  - `ErrorContext.tsx`: Global error handling

- **layouts/**: Page layout components
  - `MainLayout/`: Public site layout
  - `DashboardLayout/`: Admin dashboard layout
  - `PatientPortalLayout/`: Patient portal layout
  - `AuthLayout/`: Authentication pages layout

- **routes/**: Routing configuration
- **styles/**: Global styles and design tokens
- **utils/**: Utility functions and helpers
- **tests/**: Frontend test suites
- **mocks/**: MSW mock handlers for testing

## Backend Structure (`backend/src/`)

### Core Directories
- **models/**: MongoDB/Mongoose data models (11 models)
  - User, Patient, Appointment, Provider
  - DentalChart, TreatmentPlan, ClinicalNote
  - MedicalHistory, Insurance, Payment, AuditLog

- **routes/**: Express route handlers (20+ endpoints)
  - `auth/`: Authentication endpoints
  - `patients/`: Patient CRUD operations
  - `appointments/`: Scheduling endpoints
  - `clinical/`: Clinical data endpoints
  - `scheduling/`: Advanced scheduling features

- **services/**: Business logic layer
  - `auth/`: Authentication services (JWT, MFA, sessions)
  - `clinical/`: Clinical data services
  - `scheduling/`: Appointment scheduling logic
  - `notification/`: Email and SMS services
  - `payment/`: Stripe payment processing

- **middleware/**: Express middleware
  - Authentication and authorization
  - CSRF protection
  - Rate limiting
  - Input validation
  - Error handling
  - Audit logging

- **config/**: Configuration files
  - Database connection
  - External service configuration
  - CDT codes and clinical data
  - Security settings

- **validation/**: Input validation schemas (Zod)
- **types/**: Backend-specific TypeScript types
- **utils/**: Utility functions and helpers

### Backend Testing (`backend/tests/`)
- **unit/**: Unit tests for services and utilities
- **integration/**: API integration tests
- **e2e/**: End-to-end workflow tests
- **performance/**: Load and performance tests
- **fixtures/**: Test data and factories
- **helpers/**: Test utilities and setup

## Shared Types Package (`packages/types/`)

### Purpose
Provides end-to-end type safety between frontend and backend through shared TypeScript definitions.

### Structure
- `index.ts`: Type exports
- `patient.ts`: Patient-related types
- `appointment.ts`: Appointment types
- `clinical.ts`: Clinical data types (dental charts, treatment plans, SOAP notes)
- `common.ts`: Common/shared types (API responses, pagination, errors)

### Usage
Both frontend and backend import from `@topsmile/types` to ensure type consistency across the stack.

## Testing Structure

### Frontend Tests (`src/tests/`)
- **components/**: Component unit tests
- **hooks/**: Custom hook tests
- **integration/**: Feature integration tests
- **accessibility/**: WCAG compliance tests
- **performance/**: Performance benchmarks
- **utils/**: Utility function tests

### E2E Tests (`cypress/e2e/`)
- Authentication flows
- Appointment booking
- Patient management
- Critical user workflows
- Error handling scenarios
- Performance testing

## Documentation (`docs/`)
- **API_INTEGRATION_GUIDE.md**: Complete API reference
- **COMPONENT_USAGE_GUIDE.md**: Component documentation
- **USER_GUIDE_PATIENT_MANAGEMENT.md**: User guide (Portuguese)
- **ADMIN_TRAINING_GUIDE.md**: Admin training (Portuguese)
- **SECURITY_AUDIT_REPORT.md**: Security assessment
- **DEPLOYMENT_CHECKLIST_PATIENT_MODULE.md**: Production deployment
- **QUICK_REFERENCE.md**: Developer quick reference
- **reviews/**: Code reviews and analysis reports

## Key Architectural Patterns

### Monorepo Structure
- Workspace-based package management
- Shared types package for type safety
- Coordinated versioning across packages

### Layered Architecture
- **Presentation Layer**: React components and pages
- **State Management**: Zustand stores and React Query
- **Service Layer**: API communication and business logic
- **Data Layer**: MongoDB models and Redis cache

### Type Safety
- End-to-end TypeScript coverage
- Shared types between frontend and backend
- Strict type checking enabled
- Zod validation schemas

### Security Architecture
- JWT with automatic refresh (every 13 minutes)
- Token blacklist and rotation
- CSRF protection on all routes
- Role-based access control (8 roles, 11 permissions)
- Comprehensive audit logging

### Performance Optimization
- Lazy loading for code splitting
- React Query for server state caching
- Redis for session and data caching
- 50+ optimized database indexes
- Bundle size optimization
