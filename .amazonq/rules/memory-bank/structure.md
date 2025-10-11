# TopSmile - Project Structure

## Architecture Overview
TopSmile follows a monorepo structure with separate frontend and backend applications sharing common TypeScript types. The architecture emphasizes separation of concerns, modularity, and maintainability.

## Directory Structure

```
topsmile/
├── src/                          # Frontend React application
├── backend/                      # Backend Express API
├── packages/types/               # Shared TypeScript types
├── docs/                         # Comprehensive documentation
├── cypress/                      # E2E tests
├── scripts/                      # Build and utility scripts
└── .github/workflows/            # CI/CD pipelines
```

## Frontend Structure (`/src`)

### Core Directories
- **components/**: Reusable UI components organized by feature
  - `Admin/`: Admin-specific components
  - `Auth/`: Authentication forms and flows
  - `Booking/`: Appointment booking interface
  - `Calendar/`: Calendar and scheduling views
  - `Clinical/`: Clinical workflow components
  - `PatientPortal/`: Patient-facing portal components
  - `Payment/`: Payment processing UI
  - `common/`: Shared UI elements (buttons, inputs, modals)
  - `UI/`: Base design system components

- **features/**: Feature modules with co-located logic
  - `appointments/`: Appointment management
  - `auth/`: Authentication logic
  - `booking/`: Booking workflows
  - `clinical/`: Clinical features
  - `dashboard/`: Dashboard views
  - `patients/`: Patient management
  - `providers/`: Provider management

- **services/**: API communication layer
  - `api/`: Feature-specific API services
  - `base/`: Base HTTP client configuration
  - `interceptors/`: Request/response interceptors

- **contexts/**: React Context providers
  - `AuthContext.tsx`: Staff authentication
  - `PatientAuthContext.tsx`: Patient authentication
  - `ErrorContext.tsx`: Global error handling

- **store/**: Zustand state management
  - `appStore.ts`: Global application state
  - `clinicalStore.ts`: Clinical workflow state

- **hooks/**: Custom React hooks
  - Form management, API queries, accessibility, performance monitoring

- **layouts/**: Page layout components
  - `MainLayout/`: Public pages
  - `DashboardLayout/`: Staff dashboard
  - `PatientPortalLayout/`: Patient portal
  - `AuthLayout/`: Authentication pages

- **routes/**: Route definitions and configuration

- **utils/**: Utility functions
  - Formatters, error handlers, validators, loggers

- **styles/**: Global styles and design tokens

- **tests/**: Frontend test suites
  - `accessibility/`: A11y tests
  - `components/`: Component tests
  - `integration/`: Integration tests
  - `performance/`: Performance tests

## Backend Structure (`/backend/src`)

### Core Directories
- **routes/**: API route handlers organized by domain
  - `auth/`: Authentication endpoints
  - `patient-auth/`: Patient authentication
  - `appointments/`: Appointment management
  - `patients/`: Patient CRUD operations
  - `providers/`: Provider management
  - `scheduling/`: Scheduling logic
  - `clinical/`: Clinical workflows
  - `admin/`: Administrative endpoints

- **services/**: Business logic layer
  - Domain-specific services implementing core functionality
  - Separated from route handlers for testability

- **models/**: Mongoose data models
  - `User.ts`: Staff users
  - `Patient.ts`: Patient records
  - `Provider.ts`: Provider profiles
  - `Appointment.ts`: Appointments
  - `Clinic.ts`: Clinic configuration
  - `RefreshToken.ts`: Token management

- **middleware/**: Express middleware
  - `auth.ts`: Authentication verification
  - `validation.ts`: Input validation
  - `errorHandler.ts`: Centralized error handling
  - `rateLimiter.ts`: Rate limiting
  - `csrf.ts`: CSRF protection

- **config/**: Configuration files
  - Database, Redis, JWT, email, SMS, Stripe setup
  - `swagger.ts`: API documentation configuration

- **utils/**: Utility functions
  - Token management, encryption, validation helpers

- **validation/**: Input validation schemas
  - express-validator schemas for request validation

- **types/**: Backend-specific TypeScript types

- **tests/**: Backend test suites
  - `unit/`: Unit tests
  - `integration/`: API integration tests
  - `e2e/`: End-to-end tests
  - `performance/`: Load and performance tests
  - `fixtures/`: Test data
  - `helpers/`: Test utilities

## Shared Types (`/packages/types`)
- Common TypeScript interfaces and types
- Shared between frontend and backend
- Ensures type consistency across the stack

## Documentation (`/docs`)
- **architecture/**: System design and architecture diagrams
- **components/**: Component interaction details
- **developer-guides/**: Onboarding and coding standards
- **flows/**: User journey and data flow diagrams
- **security/**: Authentication and security specifications
- **operations/**: Deployment and monitoring guides
- **revisions/**: Code review reports and changelogs

## Key Architectural Patterns

### Frontend Patterns
- **Component-Based Architecture**: Modular, reusable components
- **Feature Modules**: Co-located components, hooks, and logic
- **Context + Zustand**: Global state management with React Context for auth, Zustand for app state
- **Custom Hooks**: Encapsulated logic for reusability
- **Service Layer**: Centralized API communication
- **Layout Components**: Consistent page structure

### Backend Patterns
- **Layered Architecture**: Routes → Services → Models
- **Middleware Pipeline**: Authentication, validation, error handling
- **Repository Pattern**: Data access through Mongoose models
- **Dependency Injection**: Service container for testability
- **Event-Driven**: Event emitters for cross-cutting concerns
- **API Versioning**: Support for multiple API versions

### Data Flow
1. **Frontend Request**: Component → Hook → Service → API
2. **Backend Processing**: Route → Middleware → Service → Model
3. **Response**: Model → Service → Route → Frontend Service → Hook → Component

### Security Layers
- JWT authentication at route level
- Input validation middleware
- Data sanitization
- CSRF protection
- Rate limiting
- Redis-based token blacklist

## Integration Points
- **MongoDB**: Primary data store
- **Redis**: Session management, caching, token blacklist
- **Stripe**: Payment processing
- **Twilio**: SMS notifications
- **Nodemailer**: Email notifications
- **Swagger**: API documentation
