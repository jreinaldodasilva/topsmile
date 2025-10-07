# TopSmile - Project Structure

## Architecture Overview
TopSmile follows a monorepo structure with separate frontend (React) and backend (Express) applications, sharing common TypeScript types through a packages workspace.

## Directory Structure

```
topsmile/
├── src/                          # React frontend application
├── backend/                      # Express backend API
├── packages/types/               # Shared TypeScript types
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
  - `Booking/`: Appointment booking interface
  - `Calendar/`: Schedule and calendar views
  - `Clinical/`: Clinical documentation components
  - `PatientPortal/`: Patient-facing portal components
  - `Payment/`: Payment processing UI
  - `common/`: Shared utility components
  - `UI/`: Base UI components (buttons, inputs, modals)

- **pages/**: Route-level page components
  - `Admin/`: Admin dashboard and management pages
  - `Calendar/`: Calendar and scheduling pages
  - `Patient/`: Patient portal pages
  - `Login/`: Authentication pages
  - `Home/`: Landing and marketing pages

- **features/**: Feature-specific logic and components
  - `appointments/`: Appointment management
  - `auth/`: Authentication logic
  - `booking/`: Booking system
  - `clinical/`: Clinical features
  - `dashboard/`: Dashboard functionality
  - `patients/`: Patient management
  - `providers/`: Provider management

- **hooks/**: Custom React hooks
  - `useApiQuery.ts`: API data fetching
  - `useForm.ts`: Form state management
  - `useErrorHandler.ts`: Error handling
  - `useAccessibility.ts`: Accessibility features
  - `usePerformanceMonitor.ts`: Performance tracking

- **contexts/**: React context providers
  - `AuthContext.tsx`: Authentication state
  - `ErrorContext.tsx`: Error handling state
  - `PatientAuthContext.tsx`: Patient authentication

- **services/**: API communication layer
  - `apiService.ts`: Main API client
  - `http.ts`: HTTP client configuration
  - `paymentService.ts`: Payment processing
  - `interceptors/`: Request/response interceptors

- **store/**: Zustand state management
  - `authStore.ts`: Authentication state
  - `clinicalStore.ts`: Clinical data state
  - `appStore.ts`: Application state

- **layouts/**: Page layout components
  - `AuthLayout/`: Authentication pages layout
  - `DashboardLayout/`: Dashboard layout with navigation
  - `MainLayout/`: Public pages layout
  - `PatientPortalLayout/`: Patient portal layout

- **routes/**: Routing configuration
- **styles/**: Global styles and CSS variables
- **utils/**: Utility functions and helpers
- **tests/**: Frontend test suites

## Backend Structure (`backend/src/`)

### Core Directories
- **models/**: MongoDB/Mongoose data models
  - Core models: User, Patient, Appointment, Provider
  - Clinical models: DentalChart, TreatmentPlan, ClinicalNote
  - System models: AuditLog, Session, Notification
  - Supporting models: Insurance, Consent, Document

- **routes/**: Express route handlers
  - RESTful API endpoints organized by resource
  - Authentication, appointments, patients, providers
  - Clinical, insurance, notifications, payments

- **services/**: Business logic layer
  - `schedulingService.ts`: Appointment scheduling logic
  - `emailService.ts`: Email notifications
  - `smsService.ts`: SMS notifications
  - `auditService.ts`: Audit logging
  - `authService.ts`: Authentication logic

- **middleware/**: Express middleware
  - `auth.ts`: JWT authentication
  - `rbac.ts`: Role-based access control
  - `errorHandler.ts`: Error handling
  - `validation.ts`: Request validation
  - `rateLimiter.ts`: Rate limiting

- **config/**: Configuration files
  - Database configuration
  - Note templates
  - CDT codes
  - Environment settings

- **validation/**: Request validation schemas
  - Zod schemas for API validation
  - Input sanitization rules

- **types/**: Backend-specific TypeScript types
- **utils/**: Utility functions and helpers
- **tests/**: Backend test suites
  - `unit/`: Unit tests
  - `integration/`: Integration tests
  - `e2e/`: End-to-end API tests
  - `performance/`: Performance tests

## Shared Types (`packages/types/`)
- Common TypeScript interfaces and types
- Shared between frontend and backend
- Ensures type safety across the stack

## Testing Structure

### Frontend Tests (`src/tests/`)
- `components/`: Component unit tests
- `hooks/`: Hook tests
- `integration/`: Integration tests
- `accessibility/`: Accessibility tests
- `performance/`: Performance tests

### Backend Tests (`backend/tests/`)
- `unit/`: Service and utility tests
- `integration/`: API integration tests
- `e2e/`: End-to-end API tests
- `performance/`: Load and query performance tests

### E2E Tests (`cypress/`)
- `e2e/`: Cypress end-to-end tests
- Full user flow testing
- Cross-browser testing

## Documentation (`docs/`)
- `api/`: API documentation
- `architecture/`: Architecture diagrams and C4 models
- `user-flows/`: User journey documentation
- Implementation guides and checklists
- Security and deployment documentation

## Key Architectural Patterns

### Frontend Patterns
- **Component-Based Architecture**: Modular, reusable components
- **Feature-Based Organization**: Features grouped with related logic
- **Custom Hooks**: Reusable stateful logic
- **Context + Zustand**: Hybrid state management
- **Layout Components**: Consistent page structures
- **Service Layer**: Abstracted API communication

### Backend Patterns
- **MVC Architecture**: Models, routes (controllers), services
- **Service Layer**: Business logic separation
- **Middleware Pipeline**: Request processing chain
- **Repository Pattern**: Data access abstraction via Mongoose
- **Dependency Injection**: Service composition
- **Error Handling**: Centralized error management

### Data Flow
1. **Frontend Request**: Component → Hook → Service → API
2. **Backend Processing**: Route → Middleware → Service → Model
3. **Response**: Model → Service → Route → Frontend Service → Hook → Component

### Security Layers
1. **Authentication**: JWT tokens with refresh mechanism
2. **Authorization**: Role-based access control (RBAC)
3. **Validation**: Request validation at route level
4. **Sanitization**: Input sanitization middleware
5. **Rate Limiting**: API rate limiting
6. **Audit Logging**: Comprehensive activity tracking

## Build and Deployment
- **Development**: Concurrent frontend and backend servers
- **Build**: Separate TypeScript compilation for frontend and backend
- **Testing**: Jest (unit/integration), Cypress (E2E)
- **CI/CD**: GitHub Actions workflows for testing and deployment
