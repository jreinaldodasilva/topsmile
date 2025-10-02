# Testing Strategy - TopSmile

## Overview

This document outlines the comprehensive testing strategy for the TopSmile dental clinic management system, covering unit tests, integration tests, end-to-end tests, and security testing.

## Test Pyramid

```
       /\
      /E2E\        10% - Critical user flows
     /______\
    /        \
   /Integration\ 30% - API endpoints, DB interactions  
  /____________\
 /              \
/  Unit Tests    \ 60% - Business logic, utilities
/________________\
```

## Coverage Goals

- **Overall**: 70%+ (Target: 80%)
- **Critical paths**: 90%+
- **Services**: 80%+
- **Authentication**: 90%+
- **Utilities**: 95%+

## Test Types

### Unit Tests (60%)
**Purpose**: Test individual functions/methods in isolation
**Tools**: Jest + TypeScript
**Speed**: <30 seconds for all tests
**Location**: `backend/tests/unit/`, `src/tests/components/`

**Coverage**:
- Business logic services
- Utility functions
- Model methods
- React components
- Custom hooks

### Integration Tests (30%)
**Purpose**: Test API endpoints with database
**Tools**: Jest + Supertest + MongoDB Memory Server
**Speed**: <2 minutes for all tests
**Location**: `backend/tests/integration/`

**Coverage**:
- Auth endpoints (`/api/auth/*`)
- Appointment endpoints (`/api/appointments/*`)
- Patient endpoints (`/api/patients/*`)
- Provider endpoints
- Database transactions
- Redis cache integration

### End-to-End Tests (10%)
**Purpose**: Test complete user workflows
**Tools**: Cypress
**Speed**: <10 minutes for critical flows
**Location**: `cypress/e2e/`

**Coverage**:
- Patient registration and login
- Appointment booking flow
- Admin dashboard operations
- Password reset flow
- Session management

## Security Testing

### Authentication Security
- JWT token validation
- Token expiration handling
- Refresh token rotation
- Session hijacking prevention

### Authorization Security
- Role-based access control
- Horizontal privilege escalation
- Resource-level permissions

### Input Validation Security
- NoSQL injection prevention
- XSS protection
- CSRF token validation
- Rate limiting enforcement

## Mock Strategy

### When to Mock
- External services (SendGrid, payment gateways)
- Slow operations (file I/O, network calls)
- Non-deterministic functions (Date.now(), Math.random())
- Redis cache operations

### When NOT to Mock
- Your own code (test real implementation)
- Database (use MongoDB Memory Server)
- Simple utilities
- Core business logic

## Test Data Management

### Test Constants
All test credentials and secrets are managed through `backend/tests/testConstants.ts`:
- Environment variable based
- Secure defaults for development
- Validation for CI/production

### Test Factories
Use factory functions for creating test data:
```typescript
const user = await createTestUser({
  email: 'test@example.com',
  role: 'admin'
});
```

### Database Cleanup
- MongoDB Memory Server for isolation
- Automatic cleanup between tests
- Transaction rollback for integration tests

## Running Tests

### Backend Tests
```bash
cd backend

# All tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Security tests only
npm test -- --testPathPattern=security

# Specific test file
npm test -- auth.test.ts
```

### Frontend Tests
```bash
# All tests
npm run test:frontend

# With coverage
npm run test:coverage:frontend

# Watch mode
npm run test:watch:frontend
```

### E2E Tests
```bash
# Interactive mode
npm run cy:open

# Headless mode
npm run cy:run

# Specific spec
npx cypress run --spec "cypress/e2e/auth.cy.ts"
```

## CI/CD Integration

### GitHub Actions
- Tests run on every PR and push
- Parallel execution for different test types
- Coverage reports uploaded to Codecov
- Security tests as separate job
- E2E tests with real services

### Coverage Requirements
- PR cannot merge if coverage drops below threshold
- Critical files have higher coverage requirements
- Coverage trends tracked over time

## Test Quality Standards

### Test Structure (AAA Pattern)
```typescript
it('should create user with valid data', async () => {
  // Arrange
  const userData = {
    email: 'test@example.com',
    password: TEST_CREDENTIALS.DEFAULT_PASSWORD
  };

  // Act
  const user = await createUser(userData);

  // Assert
  expect(user.email).toBe('test@example.com');
  expect(user.password).not.toBe(userData.password); // Should be hashed
});
```

### Test Naming
- Use descriptive test names
- Format: "should [expected behavior] when [condition]"
- Include edge cases in description

### Test Independence
- Each test should be independent
- No shared state between tests
- Proper cleanup in `afterEach`

## Performance Testing

### Load Testing
- API endpoint performance under load
- Database query performance
- Concurrent user handling
- Memory leak detection

### Tools
- Artillery for load testing
- Clinic.js for performance profiling
- Custom benchmarks for critical paths

## Debugging Tests

### Common Issues
1. **MongoDB Memory Server not starting**
   ```bash
   rm -rf ~/.cache/mongodb-memory-server
   npm install -D mongodb-memory-server
   ```

2. **Jest not exiting**
   - Check for open handles (DB connections, timers)
   - Ensure proper cleanup in `afterAll`

3. **Flaky E2E tests**
   - Use `cy.wait()` for elements, not fixed timeouts
   - Implement proper retry strategies

### Debug Mode
```bash
# Backend tests with debugging
npm test -- --detectOpenHandles --forceExit

# Frontend tests with debugging
npm test -- --verbose --no-cache

# Cypress debugging
npx cypress run --headed --no-exit
```

## Maintenance

### Regular Tasks
- Review and update test coverage monthly
- Identify and fix flaky tests
- Update test data and mocks
- Performance benchmark tracking

### Test Metrics Dashboard
Track these metrics weekly:
- Test coverage percentage
- Test execution time
- Flaky test count
- Failed test trends
- Security test results

## Best Practices

### DO
- Write tests before fixing bugs
- Test edge cases and error conditions
- Use meaningful test data
- Keep tests simple and focused
- Mock external dependencies

### DON'T
- Test implementation details
- Write tests that depend on each other
- Use production data in tests
- Ignore failing tests
- Skip security testing

## Security Considerations

### Test Environment Security
- Use environment variables for secrets
- Never commit real credentials
- Isolate test databases
- Secure CI/CD pipeline secrets

### Test Data Security
- Use fake but realistic data
- Avoid PII in test fixtures
- Encrypt sensitive test data
- Regular security test reviews