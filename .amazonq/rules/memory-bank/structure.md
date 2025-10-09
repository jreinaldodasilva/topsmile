# Project Structure

## Monorepo Organization
TopSmile is organized as a monorepo with three main packages:
- **Frontend** (root): React-based web application
- **Backend** (backend/): Express API server
- **Shared Types** (packages/types/): Common TypeScript type definitions

## Frontend Structure (`/src`)

### Core Application
- **App.tsx**: Main application component and routing setup
- **index.tsx**: Application entry point
- **routes/**: Route definitions and navigation configuration

### Components (`/src/components`)
- **Admin/**: Administrative interface components (Contacts, Forms, Dashboard)
- **Auth/**: Authentication UI (Login, Registration)
- **Booking/**: Appointment booking interface
- **Calendar/**: Calendar views and scheduling components
- **Clinical/**: Clinical workflow components
- **PatientPortal/**: Patient-facing portal components
- **Payment/**: Payment processing UI
- **common/**: Reusable UI components
- **UI/**: Base UI component library
- **lazy/**: Lazy-loaded component wrappers

### State Management
- **contexts/**: React Context providers (AuthContext, ErrorContext, PatientAuthContext)
- **store/**: Zustand state stores (appStore, authStore, clinicalStore)
- **hooks/**: Custom React hooks for shared logic

### Features (`/src/features`)
Feature-based organization for domain logic:
- **appointments/**: Appointment management logic
- **auth/**: Authentication flows
- **booking/**: Booking workflows
- **clinical/**: Clinical operations
- **dashboard/**: Dashboard functionality
- **patients/**: Patient management
- **providers/**: Provider management

### Services & API
- **services/**: API client services (apiService, http, paymentService)
- **services/interceptors/**: HTTP request/response interceptors
- **services/base/**: Base service configurations

### Layouts
- **AuthLayout/**: Layout for authentication pages
- **DashboardLayout/**: Layout for admin dashboard
- **MainLayout/**: Main application layout
- **PatientPortalLayout/**: Layout for patient portal

### Testing & Mocks
- **mocks/**: MSW (Mock Service Worker) handlers for testing
- **tests/**: Comprehensive test suites (unit, integration, accessibility, performance)

## Backend Structure (`/backend/src`)

### Core API
- **app.ts**: Express application setup and middleware configuration
- **routes/**: API route handlers organized by domain
  - **scheduling/**: Appointment scheduling endpoints
  - **auth/**: Authentication endpoints
  - **patients/**: Patient management endpoints
  - **clinical/**: Clinical data endpoints

### Business Logic
- **services/**: Business logic layer
  - **auth/**: Authentication services (authService)
  - Domain-specific service modules

### Data Layer
- **models/**: Mongoose schemas and models for MongoDB
- **types/**: Backend-specific TypeScript types
- **validation/**: Request validation schemas

### Infrastructure
- **config/**: Configuration management (env.ts, database, etc.)
- **middleware/**: Express middleware (auth, error handling, security)
- **utils/**: Utility functions and helpers

### Testing
- **tests/**: Backend test suites
  - **unit/**: Unit tests
  - **integration/**: Integration tests
  - **e2e/**: End-to-end tests
  - **performance/**: Performance and load tests
  - **fixtures/**: Test data fixtures
  - **helpers/**: Test utilities

## Shared Types Package (`/packages/types`)
Centralized TypeScript type definitions shared between frontend and backend:
- Common domain models
- API request/response types
- Shared enums and constants

## Configuration Files

### Build & Development
- **package.json**: Frontend dependencies and scripts
- **backend/package.json**: Backend dependencies and scripts
- **tsconfig.json**: TypeScript configuration
- **craco.config.js**: Create React App configuration override
- **jest.config.js**: Jest testing configuration

### Testing
- **cypress.config.ts**: Cypress E2E testing configuration
- **cypress/**: E2E test specifications
- **.lighthouserc.json**: Lighthouse performance testing

### CI/CD
- **.github/workflows/**: GitHub Actions workflows
  - **pr-validation.yml**: Pull request validation
  - **quality.yml**: Code quality checks
  - **test.yml**: Automated testing

### Environment
- **.env.example**: Environment variable templates
- **.env.production.example**: Production environment template

## Architectural Patterns

### Frontend Architecture
- **Component-Based**: React components with functional programming
- **Feature-Driven**: Domain logic organized by feature modules
- **State Management**: Combination of Zustand stores and React Context
- **API Layer**: Centralized API services with TanStack Query for data fetching
- **Lazy Loading**: Code splitting for performance optimization

### Backend Architecture
- **Layered Architecture**: Routes → Services → Models
- **RESTful API**: Standard REST endpoints with Express
- **Middleware Pipeline**: Security, authentication, validation, error handling
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based with role-based access control

### Cross-Cutting Concerns
- **Type Safety**: Shared TypeScript types across frontend and backend
- **Error Handling**: Centralized error handling with custom error classes
- **Logging**: Structured logging with Pino
- **Security**: Helmet, CORS, rate limiting, CSRF protection
- **Testing**: Comprehensive test coverage at all levels
