# TopSmile - Project Structure

## Architecture Overview
TopSmile follows a monorepo structure with separate frontend and backend applications, sharing common TypeScript types through a local package.

## Directory Structure

```
topsmile/
├── src/                          # React frontend application
├── backend/                      # Express API server
├── packages/types/               # Shared TypeScript types
├── cypress/                      # End-to-end tests
├── public/                       # Static assets
├── scripts/                      # Build and utility scripts
└── docs/                         # Documentation
```

## Frontend Structure (`src/`)

### Core Application
- `App.tsx` - Main application component with routing
- `index.tsx` - Application entry point
- `setupTests.ts` - Test configuration

### Components (`src/components/`)
- `Admin/` - Administrative interface components
- `Auth/` - Authentication forms and flows
- `Payment/` - Stripe payment integration components
- `UI/` - Reusable UI components (buttons, modals, forms)
- `Header/`, `Footer/` - Layout components
- `Hero/`, `Features/`, `Testimonials/` - Landing page sections
- `Notifications/` - Toast and notification system
- `ErrorBoundary/` - Error handling wrapper

### Pages (`src/pages/`)
- `Admin/` - Admin dashboard and management
- `Patient/` - Patient portal and booking
- `Calendar/` - Appointment scheduling interface
- `Login/` - Authentication pages
- `Home/` - Landing page
- `Contact/`, `Pricing/`, `Features/` - Marketing pages

### State Management
- `contexts/` - React Context providers
  - `AuthContext.tsx` - User authentication state
  - `PatientAuthContext.tsx` - Patient-specific auth
  - `ErrorContext.tsx` - Global error handling
- `providers/` - Third-party provider wrappers
  - `QueryProvider.tsx` - TanStack Query configuration

### Data Layer
- `services/` - API communication
  - `apiService.ts` - Core API client
  - `http.ts` - HTTP utilities
  - `paymentService.ts` - Stripe integration
- `hooks/` - Custom React hooks
  - `useApiQuery.ts` - API data fetching
  - `useApiState.ts` - API state management
  - `useAccessibility.ts` - A11y utilities
  - `usePerformanceMonitor.ts` - Performance tracking

### Testing (`src/tests/`)
- `components/` - Component unit tests
- `integration/` - Integration tests
- `accessibility/` - A11y compliance tests
- `performance/` - Performance benchmarks
- `utils/` - Test utilities and mock data

### Styling
- `styles/` - Global CSS and variables
- `assets/` - Images and static resources

### Mocking
- `mocks/` - MSW (Mock Service Worker) handlers
- `__mocks__/` - Module mocks

## Backend Structure (`backend/`)

### Application Core (`backend/src/`)
- `app.ts` - Express application setup

### Configuration (`backend/src/config/`)
- Database connection
- Environment variables
- Third-party service configuration

### API Layer (`backend/src/routes/`)
- RESTful route definitions
- Request validation
- Route-level middleware

### Business Logic (`backend/src/services/`)
- Core business logic
- Data processing
- External service integration
- `availabilityService.ts` - Provider scheduling logic

### Data Models (`backend/src/models/`)
- Mongoose schemas
- Data validation
- Model methods and statics

### Middleware (`backend/src/middleware/`)
- Authentication verification
- Authorization checks
- Request validation
- Error handling
- Rate limiting

### Utilities (`backend/src/utils/`)
- Helper functions
- Common utilities
- Logging configuration

### Type Definitions (`backend/src/types/`)
- Backend-specific TypeScript types
- Request/Response interfaces

### Testing (`backend/tests/`)
- `unit/` - Unit tests for services, models, utilities
- `integration/` - API endpoint integration tests
- `security/` - Security and vulnerability tests
- `performance/` - Load and performance tests
- `payments/` - Payment processing tests
- `compliance/` - HIPAA and regulatory compliance tests
- `contract/` - API contract tests (Pact)
- `k6/` - Load testing scripts
- `edge-cases/` - Edge case scenarios
- `transactions/` - Database transaction tests
- `rate-limiting/` - Rate limit tests
- `analytics/` - Analytics functionality tests
- `mocks/` - Test mocks and fixtures
- `utils/` - Test helpers and utilities

## Shared Types (`packages/types/`)
- Common TypeScript interfaces
- Shared between frontend and backend
- Ensures type consistency across the stack

## End-to-End Tests (`cypress/`)
- `e2e/` - User flow tests
  - Authentication flows
  - Appointment booking
  - Patient portal
  - Performance tests
- `support/` - Cypress configuration and commands

## Build & Deployment
- `scripts/` - Build automation and utilities
- `.github/workflows/` - CI/CD pipelines
- Configuration files at root level

## Key Architectural Patterns

### Frontend Patterns
- **Component-Based Architecture**: Modular React components
- **Context + Hooks**: State management without Redux
- **TanStack Query**: Server state management and caching
- **Lazy Loading**: Code splitting for performance
- **MSW**: API mocking for development and testing

### Backend Patterns
- **Layered Architecture**: Routes → Services → Models
- **Middleware Pipeline**: Request processing chain
- **Service Layer**: Business logic separation
- **Repository Pattern**: Data access abstraction via Mongoose
- **JWT Authentication**: Stateless authentication

### Testing Strategy
- **Unit Tests**: Jest for isolated component/function testing
- **Integration Tests**: API endpoint testing with Supertest
- **E2E Tests**: Cypress for full user flows
- **Performance Tests**: K6 for load testing
- **Contract Tests**: Pact for API contract validation

### Data Flow
1. User interaction in React component
2. API call via service layer (apiService.ts)
3. TanStack Query manages caching and state
4. Backend route receives request
5. Middleware validates and authenticates
6. Service layer processes business logic
7. Model layer interacts with MongoDB
8. Response flows back through the stack
