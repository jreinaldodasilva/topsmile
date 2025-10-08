# TopSmile Project Structure

## Architecture Overview
TopSmile follows a monorepo structure with a React frontend, Express backend, and shared TypeScript types package. The architecture emphasizes type safety, modularity, and separation of concerns.

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
  - `Admin/`: Admin panel components
  - `Auth/`: Authentication components
  - `Booking/`: Appointment booking components
  - `Calendar/`: Calendar and scheduling components
  - `Clinical/`: Clinical documentation components
  - `PatientPortal/`: Patient self-service components
  - `Payment/`: Payment processing components
  - `common/`: Shared UI components
  - `UI/`: Base UI components (buttons, inputs, modals)
  - `lazy/`: Lazy-loaded component wrappers

- **pages/**: Route-level page components
  - `Admin/`: Admin dashboard pages
  - `Calendar/`: Calendar view pages
  - `Patient/`: Patient management pages
  - `Login/`: Authentication pages
  - `Home/`: Landing and home pages

- **features/**: Feature-specific logic and components
  - `appointments/`: Appointment management
  - `auth/`: Authentication logic
  - `booking/`: Booking workflow
  - `clinical/`: Clinical features
  - `patients/`: Patient management
  - `providers/`: Provider management

- **hooks/**: Custom React hooks
  - `useAccessibility.ts`: Accessibility utilities
  - `useApiQuery.ts`: API query wrapper
  - `useErrorHandler.ts`: Error handling
  - `useForm.ts`: Form management
  - `usePerformanceMonitor.ts`: Performance tracking
  - `useSessionTimeout.ts`: Session management

- **services/**: API communication layer
  - `apiService.ts`: Main API service
  - `http.ts`: HTTP client configuration
  - `paymentService.ts`: Payment processing
  - `base/`: Base service classes
  - `interceptors/`: Request/response interceptors

- **store/**: Zustand state management
  - `appStore.ts`: Global application state
  - `authStore.ts`: Authentication state
  - `clinicalStore.ts`: Clinical data state

- **contexts/**: React context providers
  - `AuthContext.tsx`: Authentication context
  - `ErrorContext.tsx`: Error handling context
  - `PatientAuthContext.tsx`: Patient portal authentication

- **layouts/**: Page layout components
  - `AuthLayout/`: Authentication pages layout
  - `DashboardLayout/`: Dashboard layout with navigation
  - `MainLayout/`: Main application layout
  - `PatientPortalLayout/`: Patient portal layout

- **routes/**: Routing configuration
- **styles/**: Global styles and CSS variables
- **utils/**: Utility functions
- **tests/**: Frontend test suites

## Backend Structure (`backend/src/`)

### Core Directories
- **models/**: MongoDB/Mongoose data models
  - Patient, Appointment, User, Provider models
  - Clinical data models (DentalChart, TreatmentPlan, ClinicalNote)
  - Payment and insurance models
  - 11 total database models with 50+ optimized indexes

- **routes/**: Express route handlers
  - RESTful API endpoints
  - Authentication routes
  - Patient, appointment, clinical routes
  - 20+ API endpoints

- **services/**: Business logic layer
  - Service classes for each domain
  - External service integrations (Stripe, Twilio)
  - Email and notification services

- **middleware/**: Express middleware
  - Authentication and authorization
  - CSRF protection
  - Rate limiting
  - Input validation
  - Error handling
  - Audit logging

- **config/**: Configuration files
  - Database configuration
  - Security settings
  - Permission definitions (8 roles, 11 permissions)
  - External service configuration

- **types/**: Backend-specific TypeScript types
- **validation/**: Input validation schemas
- **utils/**: Utility functions

### Backend Testing (`backend/tests/`)
- **unit/**: Unit tests for services and utilities
- **integration/**: Integration tests for API endpoints
- **e2e/**: End-to-end API tests
- **performance/**: Performance and load tests
- **fixtures/**: Test data and fixtures
- **helpers/**: Test utilities

## Shared Types Package (`packages/types/`)

The `@topsmile/types` package provides shared TypeScript definitions used across frontend and backend:

- **patient.ts**: Patient-related types
- **appointment.ts**: Appointment types
- **clinical.ts**: Clinical data types (dental charts, treatment plans, notes)
- **common.ts**: Common/shared types
- **index.ts**: Type exports

This ensures end-to-end type safety across the entire stack.

## Documentation Structure (`docs/`)

- **api/**: API endpoint documentation
- **architecture/**: C4 diagrams and architecture documentation
- **env_variables/**: Environment setup guides
- **implementations/**: Implementation summaries and plans
- **reviews/**: Code reviews and quality assessments
- **user-flows/**: User workflow documentation
- Root-level guides: User guides, admin training, deployment checklists

## Testing Structure

### Frontend Tests (`src/tests/`)
- **accessibility/**: WCAG 2.1 AA compliance tests
- **components/**: Component unit tests
- **contexts/**: Context provider tests
- **hooks/**: Custom hook tests
- **integration/**: Integration tests
- **pages/**: Page component tests
- **performance/**: Performance tests
- **services/**: API service tests
- **utils/**: Utility function tests

### E2E Tests (`cypress/e2e/`)
- Authentication flows
- Appointment booking
- Patient management
- Critical user flows
- Performance tests
- Regression tests

## Key Architectural Patterns

### Frontend Patterns
- **Component-Based Architecture**: Modular, reusable components
- **Feature-Based Organization**: Features grouped by domain
- **Lazy Loading**: Code splitting for optimal performance
- **State Management**: Zustand for client state, TanStack Query for server state
- **Type Safety**: Strict TypeScript with shared types

### Backend Patterns
- **Layered Architecture**: Routes → Services → Models
- **Middleware Pipeline**: Authentication, validation, error handling
- **Repository Pattern**: Mongoose models as data access layer
- **Service Layer**: Business logic separated from routes
- **Dependency Injection**: Services injected into routes

### Security Patterns
- **Token-Based Authentication**: JWT with refresh tokens
- **Role-Based Access Control**: Granular permissions
- **CSRF Protection**: Global protection on all routes
- **Input Validation**: Client and server-side validation
- **Audit Logging**: Comprehensive activity tracking

## Build and Deployment

### Scripts (`scripts/`)
- `analyze-bundle.js`: Bundle size analysis
- `fix-type-imports.js`: Type import fixes
- `generate-env-secrets.js`: Environment secret generation
- `generate-secrets.js`: JWT secret generation
- `integration-test.sh`: Integration test runner
- `security-test.sh`: Security test runner

### Configuration Files
- `package.json`: Frontend dependencies and scripts
- `backend/package.json`: Backend dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `jest.config.js`: Jest test configuration
- `cypress.config.ts`: Cypress E2E configuration
- `.lighthouserc.json`: Lighthouse performance configuration

## External Integrations
- **Stripe**: Payment processing
- **Twilio**: SMS notifications
- **Nodemailer**: Email delivery
- **MongoDB**: Document database
- **Redis**: Caching and session storage
