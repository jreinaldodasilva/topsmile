# TopSmile - Project Structure

## Repository Organization
TopSmile is a monorepo containing frontend, backend, and shared packages in a single repository.

```
topsmile/
├── src/                    # React frontend application
├── backend/               # Express API server
├── packages/types/        # Shared TypeScript types
├── cypress/              # E2E tests
├── scripts/              # Build and utility scripts
├── docs/                 # Documentation
└── public/               # Static assets
```

## Frontend Structure (`src/`)

### Core Directories
- **components/**: Reusable UI components organized by feature
  - `Admin/`: Administrative interface components
  - `Auth/`: Authentication forms and flows
  - `Booking/`: Appointment booking interface
  - `Calendar/`: Calendar and scheduling views
  - `Clinical/`: Dental charting, treatment plans, SOAP notes
  - `PatientPortal/`: Patient-facing portal components
  - `Payment/`: Stripe payment integration
  - `common/`: Shared UI components (buttons, modals, forms)
  - `UI/`: Base design system components

- **pages/**: Route-level page components
  - `Admin/`: Admin dashboard and management
  - `Calendar/`: Calendar views
  - `Patient/`: Patient portal pages
  - `Login/`: Authentication pages
  - `Home/`: Landing page

- **features/**: Feature-specific logic and state
  - `appointments/`: Appointment management
  - `auth/`: Authentication logic
  - `booking/`: Booking workflows
  - `clinical/`: Clinical features
  - `patients/`: Patient management
  - `providers/`: Provider management

- **hooks/**: Custom React hooks
  - `useApiQuery.ts`: API data fetching
  - `useForm.ts`: Form state management
  - `useAccessibility.ts`: A11y utilities
  - `useErrorHandler.ts`: Error handling
  - `usePerformanceMonitor.ts`: Performance tracking

- **contexts/**: React context providers
  - `AuthContext.tsx`: Authentication state
  - `ErrorContext.tsx`: Global error handling
  - `PatientAuthContext.tsx`: Patient portal auth

- **services/**: API communication layer
  - `apiService.ts`: Main API client
  - `http.ts`: HTTP client configuration
  - `paymentService.ts`: Stripe integration
  - `interceptors/`: Request/response interceptors

- **store/**: Zustand state management
  - `authStore.ts`: Authentication state
  - `clinicalStore.ts`: Clinical data state
  - `appStore.ts`: Global app state

- **layouts/**: Page layout components
  - `MainLayout/`: Public site layout
  - `DashboardLayout/`: Authenticated user layout
  - `PatientPortalLayout/`: Patient portal layout
  - `AuthLayout/`: Authentication pages layout

- **routes/**: Routing configuration
  - `index.tsx`: Route definitions and guards

- **tests/**: Frontend test suites
  - `accessibility/`: A11y tests
  - `components/`: Component tests
  - `hooks/`: Hook tests
  - `integration/`: Integration tests
  - `performance/`: Performance tests

- **styles/**: Global styles and design tokens
  - `tokens/`: Design system tokens
  - `global.css`: Global styles
  - `accessibility.css`: A11y styles

## Backend Structure (`backend/src/`)

### Core Directories
- **models/**: MongoDB/Mongoose schemas
  - `User.ts`: User accounts and authentication
  - `Patient.ts`: Patient records
  - `Appointment.ts`: Appointment scheduling
  - `Provider.ts`: Healthcare providers
  - `TreatmentPlan.ts`: Treatment planning
  - `DentalChart.ts`: Dental charting
  - `ClinicalNote.ts`: SOAP notes
  - `Insurance.ts`: Insurance information
  - `AuditLog.ts`: System audit trail
  - `Session.ts`: User sessions
  - `Waitlist.ts`: Appointment waitlist

- **routes/**: API endpoint definitions
  - `auth/`: Authentication endpoints
  - `scheduling/`: Appointment management
  - `patients/`: Patient CRUD operations
  - `providers/`: Provider management
  - `clinical/`: Clinical features
  - `payments/`: Payment processing
  - `admin/`: Administrative endpoints

- **middleware/**: Express middleware
  - `auth.ts`: JWT authentication
  - `roleBasedAccess.ts`: Permission checking
  - `validation.ts`: Request validation
  - `errorHandler.ts`: Error handling
  - `rateLimiter.ts`: Rate limiting
  - `auditLogger.ts`: Audit logging

- **services/**: Business logic layer
  - `emailService.ts`: Email notifications
  - `smsService.ts`: SMS notifications
  - `stripeService.ts`: Payment processing
  - `appointmentService.ts`: Appointment logic
  - `authService.ts`: Authentication logic
  - `auditService.ts`: Audit logging

- **validation/**: Request validation schemas
  - Zod schemas for request validation

- **config/**: Configuration files
  - Database connection
  - Environment variables
  - Service configurations

- **utils/**: Utility functions
  - Date/time helpers
  - Formatting utilities
  - Common helpers

- **tests/**: Backend test suites
  - `unit/`: Unit tests
  - `integration/`: Integration tests
  - `e2e/`: End-to-end tests
  - `performance/`: Load and performance tests
  - `fixtures/`: Test data

## Shared Packages (`packages/`)

### types/
Shared TypeScript type definitions used by both frontend and backend:
- Interface definitions
- Type guards
- Enums and constants
- API request/response types

## Testing Infrastructure

### Frontend Tests (`src/tests/`)
- Jest for unit and integration tests
- React Testing Library for component tests
- MSW for API mocking
- Jest-axe for accessibility testing

### Backend Tests (`backend/tests/`)
- Jest for unit and integration tests
- Supertest for API testing
- MongoDB Memory Server for database tests
- K6 for load testing

### E2E Tests (`cypress/`)
- Cypress for end-to-end testing
- Critical user flows
- Authentication flows
- Booking workflows

## Build and Deployment

### Scripts (`scripts/`)
- `migrate-types.js`: Type migration utilities
- `fix-type-imports.js`: Import path fixes
- `generate-secrets.js`: Secret generation
- `analyze-bundle.js`: Bundle analysis

### Configuration Files
- `package.json`: Frontend dependencies and scripts
- `backend/package.json`: Backend dependencies
- `tsconfig.json`: TypeScript configuration
- `jest.config.js`: Test configuration
- `cypress.config.ts`: E2E test configuration
- `craco.config.js`: Create React App overrides

## Architectural Patterns

### Frontend Architecture
- **Component-Based**: Modular React components
- **Feature-Sliced**: Features organized by domain
- **Layered**: Separation of UI, logic, and data
- **State Management**: Zustand for global state, React Query for server state
- **Routing**: React Router with protected routes

### Backend Architecture
- **MVC Pattern**: Models, routes (controllers), services
- **Layered**: Routes → Services → Models
- **Middleware Pipeline**: Authentication, validation, error handling
- **Repository Pattern**: Data access through Mongoose models

### Data Flow
1. **Frontend → Backend**: API calls via services
2. **Backend Processing**: Routes → Middleware → Services → Models
3. **Backend → Frontend**: JSON responses with standardized format
4. **State Management**: React Query caching + Zustand for UI state

### Security Layers
1. **Authentication**: JWT tokens with refresh mechanism
2. **Authorization**: Role-based access control middleware
3. **Validation**: Request validation at route level
4. **Audit**: Comprehensive logging of sensitive operations
5. **Rate Limiting**: Protection against abuse

## Key Relationships

### User → Patient
- Users can be linked to patient records
- Patients can have portal access via user accounts

### Appointment → Patient + Provider
- Appointments link patients with providers
- Include operatory and service information

### TreatmentPlan → Patient + Procedures
- Multi-phase treatment plans
- CDT code integration

### DentalChart → Patient
- Tooth-level annotations
- Versioned history

### ClinicalNote → Patient + Provider
- SOAP format notes
- Template-based entry

### Insurance → Patient
- Primary and secondary coverage
- Claim tracking
