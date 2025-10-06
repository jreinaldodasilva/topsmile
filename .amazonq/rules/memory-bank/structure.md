# TopSmile - Project Structure

## Repository Organization
TopSmile is a monorepo containing frontend, backend, and shared type packages.

```
topsmile/
├── src/                    # React frontend application
├── backend/               # Express API server
├── packages/types/        # Shared TypeScript types
├── cypress/              # E2E tests
├── docs/                 # Comprehensive documentation
├── scripts/              # Build and utility scripts
└── public/               # Static assets
```

## Frontend Structure (`src/`)

### Core Directories
- **components/**: Reusable UI components organized by feature
  - `Admin/`: Administrative interfaces
  - `Auth/`: Authentication components
  - `Booking/`: Appointment booking flows
  - `Calendar/`: Scheduling and calendar views
  - `Clinical/`: Dental charting, treatment plans, SOAP notes
  - `PatientPortal/`: Patient-facing portal components
  - `Payment/`: Stripe integration and payment flows
  - `common/`: Shared components (buttons, forms, modals)
  - `UI/`: Base UI primitives
  - `lazy/`: Code-split lazy-loaded components

- **pages/**: Route-level page components
  - `Admin/`: Admin dashboard and management
  - `Calendar/`: Calendar and scheduling pages
  - `Patient/`: Patient portal pages
  - `Login/`: Authentication pages
  - `Home/`: Landing and marketing pages

- **features/**: Feature-based modules with co-located logic
  - `appointments/`: Appointment management
  - `auth/`: Authentication logic
  - `booking/`: Booking workflows
  - `clinical/`: Clinical features
  - `dashboard/`: Dashboard views
  - `patients/`: Patient management
  - `providers/`: Provider management

- **hooks/**: Custom React hooks
  - `useApiQuery.ts`: API data fetching
  - `useApiState.ts`: API state management
  - `useErrorHandler.ts`: Error handling
  - `useForm.ts`: Form management
  - `useAccessibility.ts`: A11y utilities
  - `usePerformanceMonitor.ts`: Performance tracking

- **services/**: API communication layer
  - `base/`: Base service classes
  - `interceptors/`: Request/response interceptors
  - `apiService.ts`: Main API client
  - `paymentService.ts`: Stripe integration

- **store/**: Zustand state management
  - `appStore.ts`: Global app state
  - `authStore.ts`: Authentication state
  - `clinicalStore.ts`: Clinical data state

- **contexts/**: React Context providers
  - `AuthContext.tsx`: Authentication context
  - `ErrorContext.tsx`: Error handling context
  - `PatientAuthContext.tsx`: Patient portal auth

- **layouts/**: Page layout components
  - `MainLayout/`: Public site layout
  - `DashboardLayout/`: Admin dashboard layout
  - `AuthLayout/`: Authentication pages layout
  - `PatientPortalLayout/`: Patient portal layout

- **routes/**: Routing configuration
- **styles/**: Global styles and CSS variables
- **utils/**: Utility functions
- **mocks/**: MSW mock handlers for testing
- **tests/**: Frontend test suites

## Backend Structure (`backend/src/`)

### Core Directories
- **models/**: MongoDB/Mongoose models
  - `Patient.ts`: Patient data model
  - `Appointment.ts`: Appointment scheduling
  - `Provider.ts`: Healthcare provider model
  - `User.ts`: User authentication
  - `TreatmentPlan.ts`: Treatment planning
  - `DentalChart.ts`: Dental charting
  - `ClinicalNote.ts`: SOAP notes
  - `Insurance.ts`: Insurance management
  - `Payment.ts`: Payment records
  - `AuditLog.ts`: Audit trail
  - `Session.ts`: User sessions

- **routes/**: Express route handlers organized by domain
  - `auth/`: Authentication endpoints
  - `scheduling/`: Appointment and calendar routes
  - `clinical/`: Clinical data endpoints
  - `patients/`: Patient management
  - `providers/`: Provider management
  - `payments/`: Payment processing
  - `admin/`: Administrative functions

- **services/**: Business logic layer
  - `schedulingService.ts`: Appointment logic
  - `authService.ts`: Authentication logic
  - `clinicalService.ts`: Clinical workflows
  - `paymentService.ts`: Payment processing
  - `notificationService.ts`: Email/SMS notifications

- **middleware/**: Express middleware
  - `auth.ts`: JWT authentication
  - `rbac.ts`: Role-based access control
  - `validation.ts`: Request validation
  - `errorHandler.ts`: Error handling
  - `rateLimiter.ts`: Rate limiting
  - `audit.ts`: Audit logging

- **config/**: Configuration files
  - `database.ts`: MongoDB connection
  - `redis.ts`: Redis configuration
  - `permissions.ts`: RBAC permissions
  - `stripe.ts`: Stripe configuration

- **validation/**: Request validation schemas
- **types/**: Backend-specific TypeScript types
- **utils/**: Utility functions

- **tests/**: Backend test suites
  - `unit/`: Unit tests
  - `integration/`: Integration tests
  - `e2e/`: End-to-end tests
  - `performance/`: Load and performance tests

## Shared Types (`packages/types/`)
- Shared TypeScript interfaces and types
- Used by both frontend and backend
- Ensures type consistency across the stack

## Testing Structure
- **Frontend tests**: `src/tests/`
  - Component tests with Testing Library
  - Hook tests
  - Integration tests
  - Accessibility tests
  - Performance tests

- **Backend tests**: `backend/tests/`
  - Unit tests for services and utilities
  - Integration tests for API endpoints
  - E2E tests for complete workflows
  - Performance tests with k6

- **E2E tests**: `cypress/`
  - Critical user flows
  - Authentication flows
  - Appointment booking
  - Payment processing
  - Regression tests

## Documentation (`docs/`)
Comprehensive documentation including:
- Implementation summaries
- Quick reference guides
- Deployment checklists
- Refactoring plans
- Testing guidelines
- Architecture documentation
- API documentation

## Architectural Patterns

### Frontend Architecture
- **Component-Based**: Modular React components with clear responsibilities
- **Feature-Based Organization**: Co-located feature logic
- **State Management**: Zustand for global state, React Query for server state
- **Code Splitting**: Lazy loading for performance optimization
- **Error Boundaries**: Graceful error handling
- **Accessibility First**: WCAG 2.1 AA compliance

### Backend Architecture
- **Layered Architecture**: Routes → Services → Models
- **RESTful API**: Standard HTTP methods and status codes
- **Middleware Pipeline**: Authentication, validation, error handling
- **Service Layer**: Business logic separation
- **Repository Pattern**: Data access abstraction via Mongoose models
- **Event-Driven**: Background jobs with BullMQ

### Data Flow
1. **Frontend Request** → API Service → HTTP Client
2. **Backend Route** → Middleware (auth, validation) → Controller
3. **Service Layer** → Business Logic → Model Operations
4. **Database** → MongoDB/Redis → Response
5. **Backend Response** → Frontend → State Update → UI Render

### Security Layers
- JWT authentication with refresh tokens
- Role-based access control (RBAC)
- Request validation and sanitization
- Rate limiting and DDoS protection
- CSRF protection
- Audit logging
- Session management
