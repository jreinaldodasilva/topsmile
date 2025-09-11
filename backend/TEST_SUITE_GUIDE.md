# Backend Test Suite Guide

## Overview

The TopSmile backend uses Jest as the testing framework with TypeScript support. The test suite includes both unit tests for individual services and integration tests for API endpoints.

## Test Structure

```
backend/tests/
├── setup.ts              # Global test setup (MongoDB Memory Server)
├── testHelpers.ts        # Helper functions for creating test data
├── unit/
│   └── services/         # Unit tests for service layer
│       ├── appointmentService.test.ts
│       ├── authService.test.ts
│       ├── contactService.test.ts
│       ├── patientService.test.ts
│       ├── providerService.test.ts
│       └── schedulingService.test.ts
└── integration/          # Integration tests for API routes
    ├── authRoutes.test.ts
    ├── patientRoutes.test.ts
    └── patientPortal.test.ts
```

## Test Configuration

### Jest Configuration (`jest.config.js`)

- **Preset**: `ts-jest` for TypeScript support
- **Environment**: Node.js
- **Test Roots**: `src/` and `tests/` directories
- **Coverage**: Excludes `app.ts`, `config/`, and type definition files
- **Setup**: `tests/setup.ts` runs before all tests
- **Timeout**: 30 seconds per test

### Global Setup (`tests/setup.ts`)

- Starts MongoDB Memory Server for isolated testing
- Connects Mongoose to in-memory database
- Clears all collections after each test
- Stops MongoDB Memory Server after all tests

## Running Tests

### Basic Test Execution

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test appointmentService.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create patient"
```

### Test Scripts

- `npm test`: Run all tests once
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests with coverage report

## Coverage Reports

Coverage reports are generated in multiple formats:

- **HTML Report**: `backend/coverage/lcov-report/index.html`
- **LCOV Format**: `backend/coverage/lcov.info`
- **Text Summary**: Console output

### Coverage Configuration

- Collects coverage from `src/**/*.ts`
- Excludes:
  - `src/app.ts` (entry point)
  - `src/config/**` (configuration files)
  - `src/**/*.d.ts` (type definitions)

## Writing Tests

### Unit Tests

Unit tests focus on individual service functions. Use the test helpers for consistent test data.

```typescript
import { patientService } from '../../src/services/patientService';
import { createTestPatient, createTestClinic } from '../testHelpers';

describe('PatientService', () => {
  describe('createPatient', () => {
    it('should create a patient successfully', async () => {
      const clinic = await createTestClinic();
      const patientData = {
        name: 'João Silva',
        phone: '+5511999999999',
        clinic: clinic._id
      };

      const result = await patientService.createPatient(patientData);

      expect(result.success).toBe(true);
      expect(result.data.name).toBe('João Silva');
    });
  });
});
```

### Integration Tests

Integration tests test complete API endpoints using supertest.

```typescript
import request from 'supertest';
import app from '../../src/app';
import { createTestUser } from '../testHelpers';

describe('Patient Routes', () => {
  it('should create patient via API', async () => {
    const user = await createTestUser();
    const token = generateAuthToken(user._id);

    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'João Silva',
        phone: '+5511999999999'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

## Test Helpers

The `testHelpers.ts` file provides utilities for creating test data:

### Database Setup
- `setupTestDB()`: Initialize test database
- `teardownTestDB()`: Clean up test database

### Test Data Creation
- `createTestUser()`: Create test user with default data
- `createTestClinic()`: Create test clinic with default data
- `createTestPatient()`: Create test patient with default data
- `createTestContact()`: Create test contact with default data

### Authentication
- `generateAuthToken()`: Generate mock JWT token for testing

## Best Practices

### 1. Test Isolation
- Each test should be independent
- Use unique data for each test
- Clean up after tests (handled by global setup)

### 2. Test Naming
- Use descriptive test names: `should create patient successfully`
- Group related tests in `describe` blocks
- Use `it` for individual test cases

### 3. Assertions
- Use specific matchers (`toBe`, `toEqual`, `toContain`)
- Test both success and error cases
- Verify data structure and types

### 4. Mocking
- Mock external dependencies (email services, external APIs)
- Use Jest mocks for service layer in integration tests
- Avoid mocking database operations in integration tests

### 5. Coverage Goals
- Aim for >80% code coverage
- Focus on critical business logic
- Cover error handling paths

## Common Patterns

### Testing Async Operations
```typescript
it('should handle async operations', async () => {
  const result = await someAsyncFunction();
  expect(result).toBeDefined();
});
```

### Testing Error Cases
```typescript
it('should handle errors gracefully', async () => {
  await expect(invalidOperation()).rejects.toThrow('Error message');
});
```

### Testing API Responses
```typescript
it('should return correct response format', async () => {
  const response = await request(app).get('/api/test');
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('success', true);
  expect(response.body).toHaveProperty('data');
});
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Errors**
   - Ensure MongoDB Memory Server is properly configured
   - Check for port conflicts

2. **Test Timeouts**
   - Increase timeout in `jest.config.js`
   - Check for hanging database connections

3. **Import Errors**
   - Verify TypeScript compilation
   - Check path aliases in `tsconfig.json`

### Debugging Tests

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test with debug info
npm test -- --testNamePattern="debug test" --verbose

# Use debugger in VS Code
// Add this to test file
debugger;
```

## CI/CD Integration

For continuous integration, add to your pipeline:

```yaml
- name: Run Backend Tests
  run: |
    cd backend
    npm install
    npm test -- --coverage --watchAll=false
    npm run lint
```

## Maintenance

### Adding New Tests

1. Create test file in appropriate directory (`unit/` or `integration/`)
2. Follow naming convention: `*.test.ts`
3. Import necessary dependencies and helpers
4. Write descriptive test cases
5. Run tests to ensure they pass

### Updating Test Helpers

When adding new models or services:

1. Add creation functions to `testHelpers.ts`
2. Update existing tests to use new helpers
3. Ensure backward compatibility

This guide should be updated as the test suite evolves and new patterns emerge.
