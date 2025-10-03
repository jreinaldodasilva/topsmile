# Project Structure & Architecture

## Monorepo Organization
TopSmile follows a monorepo structure with clear separation between frontend, backend, and shared components:

```
topsmile/
├── src/                    # Frontend React application
├── backend/               # Node.js/Express API server
├── packages/types/        # Shared TypeScript type definitions
├── cypress/              # End-to-end testing
├── public/               # Static assets and PWA files
└── scripts/              # Build and utility scripts
```

## Frontend Architecture (`src/`)

### Component Structure
- **`components/`**: Reusable UI components organized by feature
  - `Admin/`: Administrative interface components
  - `Auth/`: Authentication and authorization components
  - `Payment/`: Stripe payment integration components
  - `UI/`: Generic UI components and design system
  - `Features/`: Feature-specific components (appointments, scheduling)

### Application Layers
- **`pages/`**: Route-level components and page layouts
- **`contexts/`**: React Context providers for state management
- **`hooks/`**: Custom React hooks for business logic
- **`services/`**: API communication and external service integration
- **`utils/`**: Utility functions and helpers

### Testing Infrastructure
- **`tests/`**: Comprehensive test suites
  - `components/`: Component unit tests
  - `integration/`: Integration test scenarios
  - `accessibility/`: A11y compliance testing
  - `performance/`: Performance benchmarking

## Backend Architecture (`backend/src/`)

### API Structure
- **`routes/`**: Express route handlers and endpoint definitions
- **`services/`**: Business logic and service layer
- **`models/`**: MongoDB/Mongoose data models
- **`middleware/`**: Authentication, validation, and security middleware
- **`config/`**: Database and application configuration

### Core Services
- **Appointment Management**: Scheduling, booking, and calendar integration
- **User Authentication**: JWT-based auth with role-based access control
- **Provider Management**: Staff scheduling and availability
- **Payment Processing**: Stripe integration for billing

### Testing Strategy
- **`tests/`**: Multi-layered testing approach
  - `unit/`: Service and model unit tests
  - `integration/`: API endpoint integration tests
  - `security/`: Security vulnerability testing
  - `performance/`: Load and performance testing

## Shared Architecture (`packages/`)

### Type System
- **`packages/types/`**: Centralized TypeScript definitions
  - Shared interfaces between frontend and backend
  - API contract definitions
  - Domain model types

## Key Architectural Patterns

### Frontend Patterns
- **Component Composition**: Modular, reusable component architecture
- **Context + Hooks**: State management without external libraries
- **Service Layer**: Abstracted API communication
- **Route-Based Code Splitting**: Lazy loading for performance

### Backend Patterns
- **Layered Architecture**: Clear separation of concerns (routes → services → models)
- **Middleware Pipeline**: Composable request processing
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Testable service architecture

### Cross-Cutting Concerns
- **Error Handling**: Centralized error management and logging
- **Authentication**: JWT-based security across all layers
- **Validation**: Schema validation using Zod
- **Testing**: Comprehensive test coverage at all levels

## Development Workflow
- **Monorepo Management**: Coordinated builds and dependency management
- **Type Safety**: End-to-end TypeScript coverage
- **CI/CD Pipeline**: Automated testing and deployment
- **Code Quality**: ESLint, Prettier, and automated code analysis