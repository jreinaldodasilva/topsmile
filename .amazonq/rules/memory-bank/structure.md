# TopSmile - Project Structure

## Architecture Overview
TopSmile follows a monorepo structure with separate frontend and backend applications, plus shared type definitions. The architecture is a classic client-server model with React frontend and Express backend.

## Directory Structure

```
topsmile/
├── src/                          # React frontend application
│   ├── components/               # Reusable UI components
│   │   ├── Admin/               # Admin-specific components
│   │   ├── Auth/                # Authentication components
│   │   ├── Payment/             # Payment processing UI
│   │   ├── UI/                  # Generic UI components
│   │   └── ...                  # Feature-specific components
│   ├── pages/                   # Route-level page components
│   │   ├── Admin/               # Admin dashboard pages
│   │   ├── Patient/             # Patient portal pages
│   │   ├── Calendar/            # Scheduling interface
│   │   └── ...                  # Other page components
│   ├── contexts/                # React Context providers
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API communication layer
│   ├── providers/               # App-level providers (Query, etc.)
│   ├── mocks/                   # MSW mock handlers
│   ├── tests/                   # Frontend test suites
│   ├── styles/                  # Global styles and CSS variables
│   └── utils/                   # Utility functions
│
├── backend/                     # Express backend API
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   ├── middleware/         # Express middleware
│   │   ├── models/             # MongoDB/Mongoose models
│   │   ├── routes/             # API route handlers
│   │   ├── services/           # Business logic layer
│   │   ├── types/              # Backend-specific types
│   │   ├── utils/              # Utility functions
│   │   └── app.ts              # Express app entry point
│   ├── tests/                  # Backend test suites
│   │   ├── unit/               # Unit tests
│   │   ├── integration/        # Integration tests
│   │   ├── e2e/                # End-to-end tests
│   │   └── fixtures/           # Test data fixtures
│   └── scripts/                # Build and utility scripts
│
├── packages/types/              # Shared TypeScript types
│   └── src/                    # Type definitions used by both frontend and backend
│
├── cypress/                     # E2E testing framework
│   ├── e2e/                    # Cypress test specs
│   └── support/                # Cypress commands and setup
│
├── public/                      # Static assets
├── docs/                        # Documentation and prompts
├── scripts/                     # Root-level utility scripts
└── reports/                     # Test and coverage reports
```

## Core Components and Relationships

### Frontend Architecture
- **Component Layer**: Organized by feature (Admin, Auth, Payment) and generic UI components
- **Page Layer**: Route-level components that compose smaller components
- **Context Layer**: Global state management (AuthContext, ErrorContext, PatientAuthContext)
- **Service Layer**: API communication abstraction (apiService, paymentService)
- **Provider Layer**: App-level providers including TanStack Query for data fetching

### Backend Architecture
- **Route Layer**: Express route handlers defining API endpoints
- **Service Layer**: Business logic separated from route handlers
- **Model Layer**: Mongoose schemas defining data structure
- **Middleware Layer**: Authentication, validation, error handling
- **Config Layer**: Database, environment, and service configurations

### Shared Types
- **packages/types**: Centralized TypeScript definitions shared between frontend and backend
- Ensures type safety across the full stack
- Includes models for Appointment, Patient, Provider, User, etc.

## Architectural Patterns

### Frontend Patterns
- **Component Composition**: Small, reusable components composed into larger features
- **Custom Hooks**: Encapsulated logic (useApiQuery, useAccessibility, usePerformanceMonitor)
- **Context API**: Global state management for authentication and errors
- **TanStack Query**: Server state management with caching and synchronization
- **Lazy Loading**: Code splitting with React.lazy for performance

### Backend Patterns
- **MVC-like Structure**: Routes → Services → Models separation
- **Middleware Chain**: Authentication, validation, sanitization, error handling
- **Service Layer**: Business logic abstraction from HTTP concerns
- **Repository Pattern**: Mongoose models act as data access layer
- **Dependency Injection**: Services receive dependencies for testability

### Data Flow
1. **Frontend Request**: Component → Service → API call
2. **Backend Processing**: Route → Middleware → Service → Model → Database
3. **Response**: Database → Model → Service → Route → Frontend
4. **State Update**: TanStack Query cache → Component re-render

## Key Integrations
- **MongoDB**: Primary database via Mongoose ODM
- **Redis**: Caching and session management
- **Stripe**: Payment processing integration
- **JWT**: Authentication token management
- **MSW**: API mocking for testing
- **Cypress**: E2E testing framework
