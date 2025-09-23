# TopSmile Backend Tests

This directory contains comprehensive tests for the TopSmile backend API, covering both the original authentication system and the new patient portal functionality.

## Test Structure

```
tests/
├── unit/                    # Unit tests for individual components
│   ├── services/           # Service layer tests
│   │   ├── authService.test.ts
│   │   ├── patientAuthService.test.ts
│   │   ├── appointmentService.test.ts
│   │   ├── contactService.test.ts
│   │   ├── patientService.test.ts
│   │   ├── providerService.test.ts
│   │   └── schedulingService.test.ts
│   └── middleware/         # Middleware tests
│       └── patientAuth.test.ts
├── integration/            # Integration tests for API endpoints
│   ├── authRoutes.test.ts
│   ├── patientAuthRoutes.test.ts
│   ├── patientPortal.test.ts
│   ├── security.test.ts
│   ├── errorBoundary.test.ts
│   ├── performance.test.ts
│   └── concurrency.test.ts
├── setup.ts               # Test environment setup
├── testHelpers.ts         # Test utility functions
├── customMatchers.ts      # Custom Jest matchers
└── README.md             # This file
```

## Running Tests

### Prerequisites

1. **Node.js 18+** - Required for running the test suite
2. **MongoDB** - Optional (tests use MongoDB Memory Server by default)
3. **Redis** - Optional (some features may be limited without Redis)

### Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Using the Test Runner Script

The project includes a comprehensive test runner script:

```bash
# Make executable (first time only)
chmod +x run-tests.sh

# Run all tests
./run-tests.sh

# Run only unit tests
./run-tests.sh unit

# Run only integration tests
./run-tests.sh integration

# Run with coverage report
./run-tests.sh coverage
```

## Test Categories

### Unit Tests

Unit tests focus on testing individual components in isolation:

- **Service Tests**: Test business logic and data operations
- **Middleware Tests**: Test authentication, authorization, and request processing
- **Model Tests**: Test data validation and database operations

### Integration Tests

Integration tests verify that different components work together correctly:

- **Route Tests**: Test complete HTTP request/response cycles
- **Authentication Flow Tests**: Test login, registration, and token management
- **Patient Portal Tests**: Test patient-specific functionality
- **Security Tests**: Test security measures and vulnerability prevention
- **Performance Tests**: Test response times and resource usage

## Key Features Tested

### Authentication Systems

1. **Staff Authentication** (`authService.test.ts`, `authRoutes.test.ts`)
   - User registration and login
   - Password management
   - JWT token generation and validation
   - Role-based access control

2. **Patient Authentication** (`patientAuthService.test.ts`, `patientAuthRoutes.test.ts`)
   - Patient user registration (new patients and existing patient linking)
   - Secure login with account lockout protection
   - Separate JWT tokens for patient portal
   - Email verification workflow
   - Profile management

### Business Logic

1. **Appointment Management** (`appointmentService.test.ts`)
   - Appointment creation and scheduling
   - Availability checking
   - Appointment updates and cancellations
   - Provider and patient appointment queries

2. **Patient Management** (`patientService.test.ts`)
   - Patient record creation and updates
   - Medical history management
   - Contact information management

3. **Contact Management** (`contactService.test.ts`)
   - Lead capture and management
   - Contact form processing
   - Status tracking

### Security Features

1. **Input Validation**
   - SQL injection prevention
   - XSS protection
   - Data sanitization

2. **Rate Limiting**
   - Authentication attempt limiting
   - API request rate limiting
   - Contact form submission limiting

3. **Token Security**
   - JWT token validation
   - Refresh token rotation
   - Token blacklisting

## Test Data Management

### Test Helpers

The `testHelpers.ts` file provides utilities for creating test data:

```typescript
// Create test users
const user = await createTestUser({ role: 'admin' });
const userWithClinic = await createTestUserWithClinic();

// Create test patients
const patient = await createTestPatient();
const patientWithClinic = await createTestPatientWithClinic();

// Create realistic test data using Faker
const realisticPatient = await createRealisticPatient();
const realisticProvider = await createRealisticProvider();

// Generate authentication tokens
const authToken = generateAuthToken(userId, 'admin');
const patientToken = generatePatientAuthToken(patientUserId, patientId, clinicId, email);
```

### Database Management

Tests use MongoDB Memory Server for isolation:

- Each test suite gets a fresh database instance
- Data is automatically cleaned up between tests
- No external database dependencies required

### Security Considerations

To address security findings in the code review:

1. **No Hardcoded Credentials**: All test passwords use constants defined in `TEST_PASSWORDS`
2. **Secure Test Tokens**: JWT secrets are environment-specific
3. **Data Isolation**: Each test runs with isolated data
4. **Cleanup**: Sensitive data is properly cleaned up after tests

## Environment Variables

Tests use the following environment variables:

```bash
NODE_ENV=test
JWT_SECRET=test-jwt-secret-key-for-testing-only
PATIENT_JWT_SECRET=test-patient-jwt-secret-key-for-testing-only
```

## Coverage Reports

Test coverage reports are generated in multiple formats:

- **HTML Report**: `coverage/backend/lcov-report/index.html`
- **LCOV Format**: `coverage/backend/lcov.info`
- **JUnit XML**: `reports/junit-backend.xml`

### Coverage Thresholds

The project maintains high coverage standards:

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

## Debugging Tests

### Running Individual Tests

```bash
# Run a specific test file
npm test -- authService.test.ts

# Run tests matching a pattern
npm test -- --testNamePattern="should login"

# Run tests in a specific directory
npm test -- tests/unit/services/
```

### Debug Mode

```bash
# Run tests with debug output
DEBUG=* npm test

# Run with Node.js inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Common Issues

1. **Database Connection**: Ensure MongoDB Memory Server can start
2. **Port Conflicts**: Tests run on random ports to avoid conflicts
3. **Async Operations**: Use proper async/await patterns in tests
4. **Memory Leaks**: Tests automatically clean up resources

## Contributing

When adding new tests:

1. **Follow Naming Conventions**: Use descriptive test names
2. **Test Edge Cases**: Include both success and failure scenarios
3. **Use Test Helpers**: Leverage existing helper functions
4. **Maintain Coverage**: Ensure new code is properly tested
5. **Security First**: Use constants instead of hardcoded credentials

### Test Writing Guidelines

```typescript
describe('ServiceName', () => {
  describe('methodName', () => {
    it('should perform expected behavior successfully', async () => {
      // Arrange
      const testData = await createTestData();
      
      // Act
      const result = await service.method(testData);
      
      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should handle error conditions appropriately', async () => {
      // Arrange
      const invalidData = {};
      
      // Act & Assert
      await expect(service.method(invalidData))
        .rejects.toThrow(ValidationError);
    });
  });
});
```

## Continuous Integration

Tests are designed to run in CI/CD environments:

- **Deterministic**: Tests produce consistent results
- **Fast**: Optimized for quick feedback
- **Isolated**: No external dependencies
- **Comprehensive**: High coverage of critical paths

For more information about the TopSmile project, see the main project documentation.