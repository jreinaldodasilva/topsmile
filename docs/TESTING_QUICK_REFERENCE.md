# Testing Quick Reference

## Quick Commands

### Run All Tests
```bash
npm test                    # All tests (frontend + backend)
npm run test:all           # Same as above
npm run test:ci            # CI mode (includes E2E)
```

### Frontend Tests
```bash
npm run test:frontend              # Run once
npm run test:frontend:watch        # Watch mode
npm run test:frontend:coverage     # With coverage
npm run test:frontend:ci           # CI mode
```

### Backend Tests
```bash
cd backend && npm test             # All tests
cd backend && npm run test:unit    # Unit tests only
cd backend && npm run test:integration  # Integration tests
cd backend && npm run test:coverage     # With coverage
```

### E2E Tests
```bash
npm run test:e2e           # Headless
npm run cy:open            # Interactive
```

## Test File Locations

```
Frontend Tests:
├── src/utils/*.test.ts              # Utility tests
├── src/hooks/*.test.ts              # Hook tests
├── src/components/**/*.test.tsx     # Component tests
├── src/services/**/*.test.ts        # Service tests
└── src/tests/                       # Integration tests

Backend Tests:
└── backend/tests/
    ├── unit/                        # Unit tests
    ├── integration/                 # Integration tests
    └── e2e/                         # E2E tests

E2E Tests:
└── cypress/e2e/                     # Cypress specs
```

## Writing Tests

### Frontend Component Test
```typescript
import { render, screen } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('should render', () => {
    render(<Component />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Frontend Hook Test
```typescript
import { renderHook, act } from '@testing-library/react';
import { useCustomHook } from './useCustomHook';

describe('useCustomHook', () => {
  it('should work', () => {
    const { result } = renderHook(() => useCustomHook());
    
    act(() => {
      result.current.doSomething();
    });
    
    expect(result.current.value).toBe('expected');
  });
});
```

### Backend Unit Test
```typescript
import { service } from '../src/services/service';

describe('Service', () => {
  it('should process data', async () => {
    const result = await service.method({ data: 'test' });
    
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });
});
```

### Backend Integration Test
```typescript
import request from 'supertest';
import app from '../src/app';

describe('POST /api/resource', () => {
  it('should create resource', async () => {
    const response = await request(app)
      .post('/api/resource')
      .send({ name: 'Test' })
      .expect(201);
    
    expect(response.body.success).toBe(true);
  });
});
```

## Coverage Commands

### View Coverage
```bash
# Frontend
npm run test:frontend:coverage
open coverage/frontend/lcov-report/index.html

# Backend
cd backend && npm run test:coverage
open coverage/lcov-report/index.html
```

### Coverage Thresholds
- **Target**: 70% for all metrics
- **Metrics**: Statements, Branches, Functions, Lines

## CI/CD

### Workflows
- **test.yml**: Runs all tests on push/PR
- **quality.yml**: Linting and type checking
- **pr-validation.yml**: PR-specific checks

### Before Pushing
```bash
npm run lint              # Check code style
npm run type-check        # Check types
npm run test:ci           # Run all tests
```

## Common Issues

### Tests Timeout
```typescript
// Increase timeout for specific test
it('slow test', async () => {
  // test code
}, 30000); // 30 seconds
```

### Async Issues
```typescript
// Use waitFor for async updates
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

### Mock Not Working
```typescript
// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
```

## Test Patterns

### AAA Pattern
```typescript
it('should do something', () => {
  // Arrange
  const input = { data: 'test' };
  
  // Act
  const result = doSomething(input);
  
  // Assert
  expect(result).toBe('expected');
});
```

### Test Factories
```typescript
const createUser = (overrides = {}) => ({
  id: '123',
  name: 'Test User',
  email: 'test@example.com',
  ...overrides
});
```

### Mock Services
```typescript
jest.mock('../services/api', () => ({
  get: jest.fn(),
  post: jest.fn()
}));
```

## Debugging Tests

### Run Single Test
```bash
npm test -- --testNamePattern="test name"
npm test -- path/to/test.test.ts
```

### Debug in VS Code
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-cache"],
  "console": "integratedTerminal"
}
```

### Verbose Output
```bash
npm test -- --verbose
```

## Resources

- [Testing Library Docs](https://testing-library.com/)
- [Jest Docs](https://jestjs.io/)
- [Cypress Docs](https://docs.cypress.io/)
- [Project Testing Guide](./ERROR_HANDLING_GUIDE.md)
