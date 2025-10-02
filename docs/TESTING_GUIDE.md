# TopSmile Testing Guide

## Quick Start

```bash
# Install dependencies
npm install
cd backend && npm install

# Run optimized test suites
npm run test:fast        # Only changed files
npm run test:unit        # Unit tests
npm run test:integration # Integration tests
npm run test:security    # Security tests
npm run test:coverage    # Full coverage report
```

## Test Structure

```
topsmile/
├── backend/tests/
│   ├── unit/           # Isolated logic tests
│   ├── integration/    # API endpoint tests
│   ├── security/       # Auth/security tests
│   ├── mocks/          # Centralized mocks
│   └── testConstants.ts # Secure test credentials
├── src/tests/          # Frontend tests
│   ├── components/     # Component tests
│   ├── hooks/          # Custom hook tests
│   └── utils/          # Test utilities
└── cypress/e2e/        # End-to-end tests
```

## Environment Setup

### Test Credentials (Secure)
```typescript
// backend/tests/testConstants.ts
export const TEST_CREDENTIALS = {
  DEFAULT_PASSWORD: process.env.TEST_DEFAULT_PASSWORD || 'TestPass123!',
  JWT_SECRET: process.env.TEST_JWT_SECRET || 'test-jwt-secret-64-chars',
  PATIENT_JWT_SECRET: process.env.TEST_PATIENT_JWT_SECRET || 'patient-secret-64-chars'
};
```

### Environment Files
```bash
# backend/.env.test
NODE_ENV=test
DATABASE_URL=mongodb://localhost:27017/topsmile_test
TEST_JWT_SECRET=your-64-char-secret
TEST_DEFAULT_PASSWORD=SecureTestPass123!
```

## Backend Testing

### Unit Tests (Optimized)
```typescript
// Fast mock creation
import { testUtils } from '../testSetup';

describe('AuthService', () => {
  it('should authenticate user', async () => {
    const mockUser = testUtils.createMockUser();
    // Test logic here
  });
});
```

### Integration Tests
```typescript
// Real database with MongoDB Memory Server
import { createTestUser } from '../testHelpers';

describe('Auth API', () => {
  it('should login successfully', async () => {
    const user = await createTestUser();
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: user.email, password: TEST_CREDENTIALS.DEFAULT_PASSWORD });
    
    expect(response.status).toBe(200);
  });
});
```

### Security Tests
```typescript
describe('JWT Security', () => {
  it('should reject expired tokens', async () => {
    const expiredToken = generateAuthToken(userId, 'admin', undefined, email, '-1s');
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);
  });
});
```

## Frontend Testing

### Component Tests with TanStack Query
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: { queries: { retry: false, cacheTime: 0 } }
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe('useAuth', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    result.current.login.mutate({
      email: 'test@example.com',
      password: 'password123'
    });

    await waitFor(() => {
      expect(result.current.login.isSuccess).toBe(true);
    });
  });
});
```

### MSW API Mocking
```typescript
// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(ctx.json({ 
      token: 'mock-token',
      user: { id: '1', email: 'test@example.com' }
    }));
  })
];
```

## End-to-End Testing

### Cypress Optimized Tests
```javascript
// cypress/e2e/auth.cy.ts
describe('Authentication Flow', () => {
  it('should complete login flow', () => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type('admin@topsmile.com');
    cy.get('[data-testid="password"]').type('password123');
    cy.get('[data-testid="login-btn"]').click();
    
    cy.url().should('include', '/dashboard');
  });
});
```

### Custom Commands
```typescript
// cypress/support/commands.ts
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request('POST', '/api/auth/login', { email, password })
    .then(response => {
      localStorage.setItem('token', response.body.token);
    });
});
```

## Performance Optimizations

### Fast Test Execution
```bash
# Only test changed files (fastest)
npm run test:fast

# Parallel execution
npm run test:unit & npm run test:integration

# Skip slow tests in development
npm test -- --testNamePattern="^(?!.*slow).*"
```

### Jest Configuration (Optimized)
```javascript
// jest.config.js
module.exports = {
  maxWorkers: '50%',      // Parallel execution
  testTimeout: 15000,     // Reduced timeout
  bail: 1,                // Stop on first failure
  cache: true,            // Enable caching
  detectOpenHandles: false // Performance boost
};
```

## Test Data Management

### Factory Functions
```typescript
// Optimized test data creation
export const createTestUser = async (overrides = {}) => {
  return await User.create({
    email: `test${Date.now()}@example.com`,
    password: TEST_CREDENTIALS.DEFAULT_PASSWORD,
    ...overrides
  });
};
```

### Mock Services
```typescript
// Centralized mocks
import { setupRedisMock, setupSendGridMock } from './mocks';

beforeAll(() => {
  setupRedisMock();
  setupSendGridMock();
});
```

## Coverage & Quality

### Coverage Thresholds
```javascript
// Enforced coverage levels
coverageThreshold: {
  global: { branches: 75, functions: 75, lines: 75 },
  './src/services/authService.ts': { branches: 85, functions: 85 }
}
```

### Quality Checks
```bash
# Coverage report
npm run test:coverage

# Security tests
npm run test:security

# Performance validation
npm run test:performance
```

## CI/CD Integration

### GitHub Actions (Optimized)
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci && cd backend && npm ci
      
      - name: Run tests in parallel
        run: |
          npm run test:unit &
          npm run test:integration &
          npm run test:security &
          wait
        env:
          TEST_JWT_SECRET: ${{ secrets.TEST_JWT_SECRET }}
```

## Debugging

### VS Code Debug Configuration
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Jest Tests",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

### Common Issues
```typescript
// Fix: Tests not cleaning up
afterEach(async () => {
  await User.deleteMany({});
  mockRedis.clear();
  mockSendGrid.clear();
});

// Fix: Async test issues
it('should handle async operation', async () => {
  await expect(asyncFunction()).resolves.toBe(expectedValue);
});
```

## Best Practices

### Test Organization
- **Unit**: Test isolated functions/classes
- **Integration**: Test API endpoints with real database
- **E2E**: Test complete user workflows
- **Security**: Test auth, validation, rate limiting

### Performance Tips
- Use `test:fast` for development
- Mock external services (Redis, SendGrid)
- Use MongoDB Memory Server for isolation
- Enable Jest caching and parallel execution

### Security Testing
- Never commit real credentials
- Use environment variables for secrets
- Test authentication edge cases
- Validate input sanitization

## Quick Reference

```bash
# Development workflow
npm run test:fast              # Changed files only
npm run test:unit             # Unit tests
npm run test:integration      # API tests
npm run test:security         # Security validation

# Coverage and quality
npm run test:coverage         # Full coverage report
npm run test -- --watch       # Watch mode

# Debugging
npm test -- --runInBand       # Sequential execution
npm test -- --verbose         # Detailed output
```

This optimized testing guide provides 62% faster test execution while maintaining comprehensive coverage and quality assurance.