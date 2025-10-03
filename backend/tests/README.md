# Optimized Test Structure

## Directory Organization

```
tests-new/
├── unit/                    # Fast, isolated unit tests
│   ├── services/           # Business logic tests
│   ├── middleware/         # Middleware tests
│   └── utils/              # Utility function tests
├── integration/            # API integration tests
│   ├── routes/            # Route handler tests
│   └── flows/             # Multi-step user flows
├── e2e/                   # End-to-end tests (critical paths only)
├── helpers/               # Shared test utilities
├── fixtures/              # Test data
└── setup.ts              # Global test setup

```

## Test Categories

### Unit Tests (tests-new/unit/)
- **Purpose**: Test individual functions/methods in isolation
- **Speed**: Very fast (<1s per file)
- **Coverage**: Services, middleware, utilities
- **Files**: 
  - `services/patient.test.ts` - Patient service logic
  - `services/appointment.test.ts` - Appointment service logic
  - `services/auth.test.ts` - Authentication service
  - `middleware/auth.test.ts` - Auth middleware
  - `utils/validation.test.ts` - Validation utilities

### Integration Tests (tests-new/integration/)
- **Purpose**: Test API endpoints with real database
- **Speed**: Medium (1-5s per file)
- **Coverage**: Routes, database interactions
- **Files**:
  - `routes/auth.test.ts` - Auth endpoints
  - `routes/patients.test.ts` - Patient CRUD
  - `routes/appointments.test.ts` - Appointment CRUD
  - `flows/booking.test.ts` - Complete booking flow

### E2E Tests (tests-new/e2e/)
- **Purpose**: Test critical user journeys
- **Speed**: Slow (5-30s per file)
- **Coverage**: Complete workflows
- **Files**:
  - `patient-registration.test.ts` - New patient signup
  - `appointment-booking.test.ts` - Book appointment flow

## Removed Test Categories

### ❌ Deleted (Redundant/Over-engineered)
- **Contract tests** - Unnecessary for monorepo
- **K6 load tests** - Move to separate performance testing
- **Analytics tests** - Not core functionality
- **Parallel test infrastructure** - Jest handles this
- **Multiple auth test files** - Consolidated into one
- **Multiple performance test files** - Use integration tests
- **Compliance tests** - Consolidated into patient tests
- **Edge case files** - Integrated into main tests
- **Transaction tests** - Covered by integration tests
- **Rate limiting tests** - Move to integration

## Running Tests

```bash
# All tests
npm test

# Unit tests only (fast)
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests (slow)
npm run test:e2e

# Watch mode
npm run test:watch
```

## Test Principles

1. **Keep it Simple**: One test file per service/route
2. **Fast Feedback**: Unit tests should run in <10s total
3. **Realistic Data**: Use valid test data (CPF, emails, etc.)
4. **Clean Setup**: Use beforeEach for test isolation
5. **Clear Names**: Test names describe behavior, not implementation
