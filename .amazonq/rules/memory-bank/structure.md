# Project Structure

## Monorepo Organization
TopSmile is organized as a monorepo with three main packages:
- **Frontend** (root): React application for the user interface
- **Backend** (`/backend`): Express API server
- **Shared Types** (`/packages/types`): Common TypeScript types used across frontend and backend

## Frontend Structure (`/src`)

### Core Application
- `App.tsx` - Main application component with routing
- `index.tsx` - Application entry point
- `routes/` - Route definitions and navigation structure

### Component Architecture
- `components/` - Reusable UI components organized by feature
  - `Admin/` - Administrative interface components
  - `Auth/` - Authentication and login components
  - `Booking/` - Appointment booking flow
  - `Calendar/` - Calendar and scheduling views
  - `Clinical/` - Clinical workflow components
  - `PatientPortal/` - Patient-facing portal components
  - `Payment/` - Payment processing UI
  - `common/` - Shared utility components
  - `UI/` - Base UI component library
  - `lazy/` - Lazy-loaded component wrappers

### Feature Modules
- `features/` - Feature-specific logic and components
  - `appointments/` - Appointment management
  - `auth/` - Authentication flows
  - `booking/` - Booking workflows
  - `clinical/` - Clinical features
  - `dashboard/` - Dashboard views
  - `patients/` - Patient management
  - `providers/` - Provider management

### State Management
- `contexts/` - React Context providers (AuthContext, ErrorContext, PatientAuthContext)
- `store/` - Zustand stores (appStore, authStore, clinicalStore)
- `hooks/` - Custom React hooks for shared logic

### Services & API
- `services/` - API client and HTTP services
  - `base/` - Base service classes
  - `interceptors/` - Request/response interceptors
  - `apiService.ts` - Main API client
  - `paymentService.ts` - Payment integration

### Layouts
- `layouts/` - Page layout templates
  - `AuthLayout/` - Authentication pages layout
  - `DashboardLayout/` - Dashboard layout with navigation
  - `MainLayout/` - Public pages layout
  - `PatientPortalLayout/` - Patient portal layout

### Testing & Mocking
- `tests/` - Test suites (unit, integration, accessibility, performance)
- `mocks/` - MSW (Mock Service Worker) handlers for API mocking
- `__mocks__/` - Jest mocks

## Backend Structure (`/backend/src`)

### Application Core
- `app.ts` - Express application setup and configuration
- `container/` - Dependency injection container
- `events/` - Event emitters and handlers

### API Layer
- `routes/` - Express route handlers organized by domain
  - `provider/` - Provider-specific endpoints
  - `public/` - Public endpoints (forms, booking)
  - Route modules for appointments, patients, auth, etc.

### Business Logic
- `services/` - Business logic and service layer
  - `auth/` - Authentication and authorization services
  - Domain-specific services (appointments, patients, providers, etc.)

### Data Layer
- `models/` - Mongoose schemas and models
- `validation/` - Request validation schemas

### Configuration
- `config/` - Application configuration
  - `constants.ts` - Application constants
  - `security/` - Security configuration (permissions, roles)

### Infrastructure
- `middleware/` - Express middleware (auth, validation, error handling)
- `utils/` - Utility functions and helpers
- `types/` - Backend-specific TypeScript types

### Testing
- `tests/` - Test suites
  - `unit/` - Unit tests
  - `integration/` - Integration tests
  - `e2e/` - End-to-end tests
  - `performance/` - Performance tests
  - `fixtures/` - Test data fixtures
  - `helpers/` - Test utilities

## Shared Types (`/packages/types`)
- Common TypeScript interfaces and types
- Shared between frontend and backend
- Ensures type safety across the full stack

## Configuration Files
- `tsconfig.json` - TypeScript configuration (frontend)
- `backend/tsconfig.json` - TypeScript configuration (backend)
- `jest.config.js` - Jest test configuration
- `cypress.config.ts` - Cypress E2E test configuration
- `.env` files - Environment-specific configuration

## Build & Deployment
- `scripts/` - Build and utility scripts
- `.github/workflows/` - CI/CD pipelines (testing, deployment, security scans)
- `docs/` - Project documentation

## Architectural Patterns

### Frontend Architecture
- **Component-Based**: Modular React components with clear separation of concerns
- **Feature-Driven**: Features organized as self-contained modules
- **Layered Architecture**: Components → Hooks → Services → API
- **State Management**: Combination of Context API and Zustand for different use cases
- **Lazy Loading**: Code splitting for performance optimization

### Backend Architecture
- **Layered Architecture**: Routes → Services → Models
- **Dependency Injection**: Container-based DI for testability
- **Repository Pattern**: Data access abstraction through Mongoose models
- **Middleware Pipeline**: Request processing through composable middleware
- **Event-Driven**: Event emitters for cross-cutting concerns

### Cross-Cutting Concerns
- **Type Safety**: Shared types package ensures consistency
- **Error Handling**: Centralized error handling on both frontend and backend
- **Authentication**: JWT-based auth with refresh token rotation
- **Validation**: Schema-based validation (Zod on backend, custom validators on frontend)
- **Testing**: Comprehensive test coverage at all levels
