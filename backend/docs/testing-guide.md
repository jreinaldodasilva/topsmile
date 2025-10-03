# TopSmile Backend Testing Guide

## Overview

This guide covers testing practices for the TopSmile dental clinic management system, with special focus on medical data handling and HIPAA compliance.

## Test Types

### Unit Tests (`tests/unit/`)
Test individual components in isolation.

```typescript
// Example: Service unit test
describe('AuthService', () => {
  it('should hash password during registration', async () => {
    const result = await authService.register({
      email: 'test@example.com',
      password: 'TestPass123!',
      name: 'Test User'
    });
    
    expect(result.user.password).not.toBe('TestPass123!');
  });
});
```

### Integration Tests (`tests/integration/`)
Test API endpoints and service interactions.

```typescript
// Example: API integration test
describe('POST /api/patients', () => {
  it('should create patient with valid data', async () => {
    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${token}`)
      .send(validPatientData)
      .expect(201);
      
    expect(response.body.data.firstName).toBe('João');
  });
});
```

### Security Tests (`tests/security/`)
Validate security measures and vulnerability prevention.

```typescript
// Example: Security test
describe('Authentication Security', () => {
  it('should reject expired tokens', async () => {
    const expiredToken = generateExpiredToken();
    
    await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);
  });
});
```

## Medical Data Testing

### HIPAA Compliance (`tests/compliance/`)
Ensure medical data protection.

```typescript
describe('Patient Data Encryption', () => {
  it('should not store medical data in plain text', async () => {
    const patient = await createTestPatient({
      medicalHistory: { conditions: ['Diabetes'] }
    });
    
    const rawData = await mongoose.connection.db
      .collection('patients')
      .findOne({ _id: patient._id });
    
    expect(JSON.stringify(rawData)).not.toContain('Diabetes');
  });
});
```

### Payment Testing (`tests/payments/`)
Validate payment processing with Stripe.

```typescript
describe('Payment Processing', () => {
  it('should create payment intent for appointment', async () => {
    const intent = await mockStripe.paymentIntents.create({
      amount: 15000,
      currency: 'brl'
    });
    
    expect(intent.status).toBe('requires_confirmation');
  });
});
```

## Performance Testing

### Benchmarks (`tests/performance/`)
Measure operation performance.

```typescript
describe('Database Performance', () => {
  it('should find patient under 50ms', async () => {
    const start = Date.now();
    await Patient.findById(patientId);
    const duration = Date.now() - start;
    
    expect(duration).toBeLessThan(50);
  });
});
```

### Load Testing (`tests/k6/`)
Test system under load with k6.

```bash
# Run authentication load test
npm run test:k6:auth

# Run stress test
npm run test:k6:stress
```

## Transaction Testing

### Database Transactions (`tests/transactions/`)
Validate ACID properties and rollback scenarios.

```typescript
describe('Appointment Booking Transaction', () => {
  it('should rollback on payment failure', async () => {
    const session = await mongoose.startSession();
    
    try {
      await session.withTransaction(async () => {
        await createAppointment(session);
        throw new Error('Payment failed'); // Force rollback
      });
    } catch (error) {
      // Verify rollback occurred
      const appointments = await Appointment.find();
      expect(appointments).toHaveLength(0);
    }
  });
});
```

## Test Utilities

### Helper Functions
Use test helpers for consistent data creation.

```typescript
// Create test patient
const patient = await createTestPatient({
  firstName: 'João',
  email: 'joao@example.com'
});

// Generate auth token
const token = generateAuthToken(userId, 'admin');

// Create realistic test data
const patient = await createRealisticPatient();
```

### Custom Matchers
Use domain-specific assertions.

```typescript
expect(appointment).toBeValidAppointment();
expect(user.email).toBeValidEmail();
expect(response).toHaveSecurityHeaders();
```

## Running Tests

### Basic Commands
```bash
# All tests
npm test

# Parallel execution
npm run test:parallel

# Specific test types
npm run test:unit
npm run test:integration
npm run test:security
npm run test:compliance

# Performance tests
npm run test:benchmarks
npm run test:k6

# Fast tests (changed files only)
npm run test:fast
```

### Test Scripts
```bash
# Run all test types
./run-tests.sh all

# Run specific category
./run-tests.sh unit
./run-tests.sh compliance
./run-tests.sh parallel
```

## Best Practices

### Test Structure
- Use descriptive test names in Portuguese for user-facing scenarios
- Follow AAA pattern: Arrange, Act, Assert
- One assertion per test when possible
- Clean up test data after each test

### Medical Data
- Never use real patient data in tests
- Test data encryption and access controls
- Validate audit logging for data access
- Test data retention policies

### Security
- Test authentication and authorization
- Validate input sanitization
- Test rate limiting and CSRF protection
- Verify security headers

### Performance
- Set performance thresholds for critical operations
- Test concurrent operations
- Monitor memory usage
- Validate transaction isolation

### Error Handling
- Test both success and failure scenarios
- Validate error messages in Portuguese
- Test edge cases and boundary conditions
- Ensure graceful degradation

## Continuous Integration

### Pre-commit Hooks
```bash
# Install pre-commit hooks
npm run prepare

# Manual pre-commit check
npm run lint && npm run type-check && npm run test:fast
```

### CI Pipeline
```yaml
# Example GitHub Actions
- name: Run Tests
  run: |
    npm run test:ci
    npm run test:compliance
    npm run test:security
```

## Troubleshooting

### Common Issues
- **Database connection errors**: Ensure MongoDB Memory Server is running
- **Timeout errors**: Increase test timeout for slow operations
- **Memory leaks**: Use `--detectOpenHandles` to find unclosed resources
- **Parallel test conflicts**: Ensure proper test isolation

### Debug Commands
```bash
# Run with debug output
DEBUG=* npm test

# Run single test file
npm test -- tests/unit/services/authService.test.ts

# Run with coverage
npm run test:coverage
```