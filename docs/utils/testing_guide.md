# TopSmile Testing Guide

## Quick Start

```bash
# Install dependencies
npm install
cd backend && npm install

# Run all tests
npm run test:all

# Run specific test suites
npm run test:frontend        # Frontend unit tests
npm run test:backend         # Backend unit tests
npm run test:e2e            # End-to-end tests
```

## Test Structure

```
topsmile/
├── src/                    # Frontend tests
│   └── **/*.test.tsx
├── backend/tests/          # Backend tests
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── edge-cases/        # Edge case tests
└── cypress/e2e/           # E2E tests
```

## Environment Setup

### Required Environment Variables

Create `.env.test` files:

**Frontend (.env.test)**
```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_ENVIRONMENT=test
```

**Backend (backend/.env.test)**
```env
NODE_ENV=test
PORT=5001
DATABASE_URL=mongodb://localhost:27017/topsmile_test
JWT_SECRET=test-jwt-secret-min-32-chars-long
JWT_REFRESH_SECRET=test-refresh-secret-min-32-chars
REDIS_URL=redis://localhost:6380
```

### Test Database Setup

```bash
# Start test MongoDB (if using local)
mongod --port 27018 --dbpath ./test-db

# Start test Redis
redis-server --port 6380
```

## Frontend Testing

### Unit Tests
```bash
# Run with coverage
npm run test:coverage:frontend

# Watch mode
npm run test:watch:frontend

# Specific test file
npx jest src/components/Button.test.tsx
```

### Test Structure
```typescript
// Example: src/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### API Mocking with MSW
```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/appointments', (req, res, ctx) => {
    return res(ctx.json({ appointments: [] }));
  }),
];
```

## Backend Testing

### Unit Tests
```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suite
npx jest tests/unit/services/authService.test.ts
```

### Integration Tests
```bash
# Run integration tests only
npx jest tests/integration/

# Run specific integration test
npx jest tests/integration/authFlow.test.ts
```

### Test Structure
```typescript
// Example: backend/tests/unit/services/authService.test.ts
import { AuthService } from '../../../src/services/authService';
import { User } from '../../../src/models/User';

describe('AuthService', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('login', () => {
    it('should authenticate valid user', async () => {
      const user = await User.create({
        email: 'test@example.com',
        password: 'hashedPassword'
      });

      const result = await AuthService.login('test@example.com', 'password');
      expect(result.success).toBe(true);
      expect(result.token).toBeDefined();
    });
  });
});
```

### Database Testing
```typescript
// backend/tests/setup.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
```

## End-to-End Testing

### Cypress Setup
```bash
# Open Cypress GUI
npm run cy:open

# Run headless
npm run cy:run

# Run specific test
npx cypress run --spec "cypress/e2e/login.cy.js"
```

### Test Structure
```javascript
// cypress/e2e/login.cy.js
describe('Login Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login successfully', () => {
    cy.get('[data-testid="email-input"]').type('admin@topsmile.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.get('[data-testid="email-input"]').type('invalid@email.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="login-button"]').click();
    
    cy.get('[data-testid="error-message"]').should('contain', 'Invalid credentials');
  });
});
```

### Custom Commands
```typescript
// cypress/support/commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      createAppointment(data: any): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { email, password }
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
});
```

## Test Data Management

### Fixtures
```typescript
// backend/tests/fixtures/users.ts
export const testUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'Test123!',
    role: 'admin'
  },
  patient: {
    email: 'patient@test.com',
    password: 'Test123!',
    role: 'patient'
  }
};
```

### Factory Functions
```typescript
// backend/tests/factories/userFactory.ts
import { faker } from '@faker-js/faker';
import { User } from '../../src/models/User';

export const createUser = async (overrides = {}) => {
  return await User.create({
    email: faker.internet.email(),
    password: 'hashedPassword',
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    role: 'patient',
    ...overrides
  });
};
```

## Coverage Reports

### Generate Coverage
```bash
# Frontend coverage
npm run test:coverage:frontend

# Backend coverage
npm run test:coverage:backend

# Combined coverage
npm run test:coverage
```

### Coverage Thresholds
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### View Reports
```bash
# Frontend: open coverage/frontend/lcov-report/index.html
# Backend: open backend/coverage/backend/lcov-report/index.html
```

## CI/CD Integration

### GitHub Actions Example
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:5.0
        ports:
          - 27017:27017
      redis:
        image: redis:6
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          npm ci
          cd backend && npm ci
      
      - name: Run tests
        run: |
          npm run test:coverage:frontend
          npm run test:coverage:backend
          npm run test:e2e
```

## Performance Testing

### Load Testing with Artillery
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery run tests/load/api-load-test.yml
```

### Example Load Test
```yaml
# tests/load/api-load-test.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10

scenarios:
  - name: "Login and fetch appointments"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
      - get:
          url: "/api/appointments"
```

## Debugging Tests

### Frontend Debugging
```bash
# Debug with Chrome DevTools
npm test -- --inspect-brk

# Run single test in debug mode
npx jest --runInBand --no-cache src/components/Button.test.tsx
```

### Backend Debugging
```bash
# Debug with VS Code
node --inspect-brk node_modules/.bin/jest --runInBand

# Debug specific test
npx jest --runInBand tests/unit/services/authService.test.ts
```

### Cypress Debugging
```javascript
// Add breakpoints in tests
cy.get('[data-testid="button"]').click();
cy.debug(); // Pauses execution
cy.pause(); // Interactive pause
```

## Common Issues & Solutions

### Test Timeouts
```javascript
// Increase timeout for slow tests
jest.setTimeout(30000);

// Or per test
it('slow test', async () => {
  // test code
}, 30000);
```

### Database Connection Issues
```typescript
// Ensure proper cleanup
afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});
```

### Async Testing
```typescript
// Use async/await properly
it('should handle async operations', async () => {
  const result = await someAsyncFunction();
  expect(result).toBeDefined();
});
```

### Mock Cleanup
```typescript
// Clear mocks between tests
afterEach(() => {
  jest.clearAllMocks();
});
```

## Test Commands Reference

```bash
# Frontend
npm run test:frontend              # Run frontend tests
npm run test:watch:frontend        # Watch mode
npm run test:coverage:frontend     # With coverage

# Backend
npm run test:backend              # Run backend tests
npm run test:watch:backend        # Watch mode
npm run test:coverage:backend     # With coverage

# E2E
npm run cy:open                   # Open Cypress GUI
npm run cy:run                    # Run headless
npm run test:e2e                  # Run E2E tests

# All
npm run test:all                  # Run all tests
npm run test:coverage             # Generate all coverage
```

## Best Practices

1. **Test Isolation**: Each test should be independent
2. **Descriptive Names**: Use clear, descriptive test names
3. **AAA Pattern**: Arrange, Act, Assert
4. **Mock External Dependencies**: Don't test third-party services
5. **Test Edge Cases**: Include error scenarios and boundary conditions
6. **Keep Tests Fast**: Unit tests should run quickly
7. **Use Test Data Builders**: Create reusable test data factories
8. **Clean Up**: Always clean up after tests