# Project Structure

## Monorepo Organization

TopSmile uses a monorepo structure with three main packages:

```
topsmile/
├── src/                    # Frontend React application
├── backend/                # Backend Express API
└── packages/types/         # Shared TypeScript types
```

## Frontend Structure (`/src`)

### Core Directories
- **components/** - Reusable UI components organized by feature
  - `Admin/` - Admin dashboard components
  - `Auth/` - Authentication forms and flows
  - `Booking/` - Appointment booking interface
  - `Calendar/` - Calendar and scheduling views
  - `Clinical/` - Clinical workflows (notes, treatment plans, signatures)
  - `PatientPortal/` - Patient self-service components
  - `Payment/` - Payment processing UI
  - `common/` - Shared UI components (buttons, forms, modals)
  - `UI/` - Base UI primitives

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
  - `paymentService.ts` - Payment integration

- **contexts/** - React Context providers
  - `AuthContext.tsx` - Staff authentication state
  - `PatientAuthContext.tsx` - Patient authentication state
  - `ErrorContext.tsx` - Global error handling

- **store/** - Zustand state management
  - `appStore.ts` - Application state
  - `authStore.ts` - Authentication state
  - `clinicalStore.ts` - Clinical data state

- **hooks/** - Custom React hooks
  - `useApiQuery.ts` - API data fetching
  - `useForm.ts` - Form management
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
- **mocks/** - MSW mock service worker for testing

## Backend Structure (`/backend/src`)

### Core Directories
- **routes/** - Express route handlers
  - API endpoint definitions
  - Route-level middleware
  - Request validation

- **services/** - Business logic layer
  - `scheduling/` - Appointment scheduling logic
  - `clinical/` - Clinical workflows (treatment plans, notes)
  - `auth/` - Authentication services
  - `notification/` - Email/SMS notifications
  - `payment/` - Payment processing

- **models/** - Mongoose data models
  - `User.ts` - Staff users
  - `Patient.ts` - Patient records
  - `Provider.ts` - Provider profiles
  - `Appointment.ts` - Appointments
  - `Clinic.ts` - Clinic configuration
  - `RefreshToken.ts` - Token management

- **middleware/** - Express middleware
  - Authentication and authorization
  - Request validation
  - Error handling
  - Rate limiting
  - CSRF protection
  - Security headers

- **config/** - Configuration files
  - Database connection
  - Redis configuration
  - JWT settings
  - Email/SMS providers
  - Stripe integration

- **utils/** - Utility functions
  - Token management
  - Data validation
  - Error classes
  - Logging

- **validation/** - Input validation schemas
  - express-validator rules
  - Custom validators

- **types/** - Backend-specific TypeScript types
- **events/** - Event emitters and handlers
- **container/** - Dependency injection container

### Testing Structure
- **tests/** - Test suites
  - `unit/` - Unit tests for services and utilities
  - `integration/` - API integration tests
  - `e2e/` - End-to-end workflow tests
  - `performance/` - Load and performance tests
  - `fixtures/` - Test data and mocks
  - `helpers/` - Test utilities

## Shared Types (`/packages/types`)

Centralized TypeScript interfaces and types shared between frontend and backend:
- API request/response types
- Domain models
- Enums and constants
- Validation schemas

## Configuration Files

### Root Level
- `package.json` - Frontend dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `jest.config.js` - Jest test configuration
- `cypress.config.ts` - Cypress E2E configuration
- `.env` - Frontend environment variables

### Backend
- `backend/package.json` - Backend dependencies
- `backend/tsconfig.json` - Backend TypeScript config
- `backend/jest.config.js` - Backend test config
- `backend/.env` - Backend environment variables

## Architectural Patterns

### Frontend Architecture
- **Component-Based**: React functional components with hooks
- **State Management**: Zustand for global state, React Query for server state
- **Routing**: React Router 6 with lazy loading
- **API Layer**: Centralized API service with interceptors
- **Error Handling**: Error boundaries and context-based error management

### Backend Architecture
- **Layered Architecture**: Routes → Services → Models
- **Dependency Injection**: Container-based DI for services
- **Event-Driven**: Event emitters for cross-service communication
- **Repository Pattern**: Mongoose models as data repositories
- **Middleware Pipeline**: Express middleware for cross-cutting concerns

### Data Flow
1. **Frontend Request** → API Service → HTTP Client
2. **Backend Route** → Middleware (auth, validation) → Service Layer
3. **Service Layer** → Model/Database → Response
4. **Backend Response** → Frontend → State Update → UI Render

## Key Relationships

- **Frontend ↔ Backend**: REST API communication via HTTP
- **Frontend ↔ Shared Types**: Import types for type safety
- **Backend ↔ Shared Types**: Import types for validation
- **Backend ↔ MongoDB**: Mongoose ODM for data persistence
- **Backend ↔ Redis**: Caching and session management
- **Frontend ↔ Stripe**: Payment processing integration
