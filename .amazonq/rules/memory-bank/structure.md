# TopSmile - Project Structure

## Architecture Overview
TopSmile follows a monorepo structure with separate frontend and backend applications, plus shared type definitions. The architecture is a client-server model with React frontend communicating with Express REST API backend.

## Directory Structure

```
topsmile/
├── src/                          # React frontend application
│   ├── components/               # Reusable UI components
│   │   ├── Admin/               # Admin-specific components
│   │   ├── Auth/                # Authentication components
│   │   ├── Payment/             # Stripe payment components
│   │   ├── UI/                  # Generic UI components
│   │   └── ...                  # Feature-specific components
│   ├── pages/                   # Route-level page components
│   │   ├── Admin/               # Admin dashboard pages
│   │   ├── Patient/             # Patient portal pages
│   │   ├── Calendar/            # Appointment calendar
│   │   └── ...                  # Other pages
│   ├── contexts/                # React Context providers
│   │   ├── AuthContext.tsx      # Authentication state
│   │   └── PatientAuthContext.tsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAccessibility.ts  # Accessibility utilities
│   │   ├── useApiQuery.ts       # API data fetching
│   │   └── useApiState.ts       # API state management
│   ├── services/                # API communication layer
│   │   ├── apiService.ts        # Main API client
│   │   ├── http.ts              # HTTP utilities
│   │   └── paymentService.ts    # Stripe integration
│   ├── mocks/                   # MSW mock handlers
│   ├── tests/                   # Frontend test suites
│   └── utils/                   # Utility functions
│
├── backend/                     # Express API server
│   ├── src/
│   │   ├── routes/              # API route handlers
│   │   │   ├── providers.ts     # Provider endpoints
│   │   │   ├── appointments.ts  # Appointment endpoints
│   │   │   └── patients.ts      # Patient endpoints
│   │   ├── services/            # Business logic layer
│   │   │   ├── schedulingService.ts
│   │   │   └── ...
│   │   ├── models/              # MongoDB schemas
│   │   ├── middleware/          # Express middleware
│   │   ├── config/              # Configuration files
│   │   ├── utils/               # Backend utilities
│   │   └── app.ts               # Express app entry
│   ├── tests/                   # Backend test suites
│   │   ├── unit/                # Unit tests
│   │   ├── integration/         # Integration tests
│   │   └── e2e/                 # End-to-end tests
│   └── docs/                    # Backend documentation
│
├── packages/types/              # Shared TypeScript types
│   └── src/                     # Type definitions
│
├── cypress/                     # E2E test suite
│   ├── e2e/                     # Cypress test specs
│   └── support/                 # Cypress utilities
│
├── public/                      # Static assets
├── scripts/                     # Build and utility scripts
└── docs/                        # Project documentation
```

## Core Components

### Frontend Architecture
- **Component Layer**: Reusable React components with TypeScript
- **Page Layer**: Route-level components for different views
- **State Management**: React Context + TanStack Query for server state
- **API Layer**: Centralized API service with HTTP client
- **Routing**: React Router v6 with protected routes
- **Styling**: CSS modules with global variables

### Backend Architecture
- **Route Layer**: Express route handlers with validation
- **Service Layer**: Business logic and data operations
- **Model Layer**: Mongoose schemas for MongoDB
- **Middleware Layer**: Authentication, validation, error handling
- **Configuration**: Environment-based config management

### Shared Types
- Centralized TypeScript definitions in `packages/types`
- Imported by both frontend and backend
- Ensures type consistency across the stack

## Architectural Patterns

### Frontend Patterns
- **Component Composition**: Small, reusable components
- **Custom Hooks**: Encapsulated logic for reusability
- **Context Providers**: Global state management
- **Query Hooks**: TanStack Query for server state
- **Lazy Loading**: Code splitting for performance

### Backend Patterns
- **RESTful API**: Standard HTTP methods and status codes
- **Service Layer**: Separation of business logic from routes
- **Middleware Chain**: Request processing pipeline
- **Error Handling**: Centralized error middleware
- **Validation**: Express-validator for input validation

### Data Flow
1. User interaction in React component
2. API call through service layer
3. HTTP request to Express backend
4. Route handler validates and processes
5. Service layer executes business logic
6. MongoDB operations through Mongoose
7. Response sent back to frontend
8. TanStack Query updates cache
9. React component re-renders with new data

## Key Relationships

- **Frontend ↔ Backend**: REST API over HTTP
- **Backend ↔ Database**: Mongoose ODM with MongoDB
- **Backend ↔ Cache**: Redis for session and data caching
- **Frontend ↔ Payment**: Stripe.js for payment processing
- **Both ↔ Types**: Shared TypeScript definitions
