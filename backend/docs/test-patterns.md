# Test Patterns and Examples

## Common Test Patterns

### 1. API Endpoint Testing Pattern

```typescript
describe('Patient API Endpoints', () => {
  let authToken: string;
  let testPatient: any;

  beforeEach(async () => {
    const user = await createTestUser({ role: 'admin' });
    authToken = generateAuthToken(user._id, user.role);
    testPatient = await createTestPatient();
  });

  describe('GET /api/patients/:id', () => {
    it('should return patient data for authorized user', async () => {
      const response = await request(app)
        .get(`/api/patients/${testPatient._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.firstName).toBe(testPatient.firstName);
    });

    it('should return 401 for unauthorized access', async () => {
      await request(app)
        .get(`/api/patients/${testPatient._id}`)
        .expect(401);
    });
  });
});
```

### 2. Service Layer Testing Pattern

```typescript
describe('PatientService', () => {
  let patientService: PatientService;

  beforeEach(() => {
    patientService = new PatientService();
  });

  describe('createPatient', () => {
    it('should create patient with encrypted medical data', async () => {
      const patientData = {
        firstName: 'João',
        lastName: 'Silva',
        medicalHistory: {
          conditions: ['Diabetes'],
          allergies: ['Penicillin']
        }
      };

      const result = await patientService.createPatient(patientData);

      expect(result.success).toBe(true);
      expect(result.data.firstName).toBe('João');
      
      // Verify medical data is encrypted
      const rawPatient = await Patient.findById(result.data._id).lean();
      expect(JSON.stringify(rawPatient)).not.toContain('Diabetes');
    });
  });
});
```

### 3. Authentication Testing Pattern

```typescript
describe('Authentication Flow', () => {
  describe('Login Process', () => {
    it('should authenticate valid credentials', async () => {
      const user = await createTestUser({
        email: 'test@example.com',
        password: 'ValidPass123!'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'ValidPass123!'
        })
        .expect(200);

      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expectValidToken(response.body.data.accessToken);
    });

    it('should reject invalid credentials', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid@example.com',
          password: 'WrongPassword'
        })
        .expect(401);
    });
  });
});
```

### 4. Transaction Testing Pattern

```typescript
describe('Appointment Booking Transaction', () => {
  it('should handle concurrent booking attempts', async () => {
    const patient1 = await createTestPatient();
    const patient2 = await createTestPatient();
    const provider = await createTestUser({ role: 'provider' });
    
    const appointmentTime = new Date(Date.now() + 86400000);

    const bookingPromises = [
      bookAppointment(patient1._id, provider._id, appointmentTime),
      bookAppointment(patient2._id, provider._id, appointmentTime)
    ];

    const results = await Promise.allSettled(bookingPromises);
    
    // Only one booking should succeed
    const successful = results.filter(r => r.status === 'fulfilled');
    expect(successful).toHaveLength(1);
  });
});
```

### 5. Performance Testing Pattern

```typescript
describe('Performance Benchmarks', () => {
  it('should handle bulk patient queries efficiently', async () => {
    // Create test data
    const patients = await Promise.all(
      Array(100).fill(null).map(() => createTestPatient())
    );

    const { duration, operationsPerSecond } = await measurePerformance(
      () => Patient.find({ _id: { $in: patients.map(p => p._id) } }),
      10
    );

    expectPerformance({ duration, operationsPerSecond }, {
      maxDuration: 1000,
      minOpsPerSecond: 5
    });
  });
});
```

### 6. Security Testing Pattern

```typescript
describe('Input Validation Security', () => {
  it('should prevent XSS attacks in patient data', async () => {
    const maliciousData = {
      firstName: '<script>alert("xss")</script>',
      lastName: 'Silva',
      email: 'test@example.com'
    };

    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${authToken}`)
      .send(maliciousData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.errors).toBeDefined();
  });
});
```

### 7. HIPAA Compliance Testing Pattern

```typescript
describe('HIPAA Compliance', () => {
  it('should audit patient data access', async () => {
    const patient = await createTestPatient();
    const user = await createTestUser({ role: 'admin' });
    const token = generateAuthToken(user._id, user.role);

    await request(app)
      .get(`/api/patients/${patient._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // Verify audit log entry was created
    const auditLogs = await AuditLog.find({
      resourceType: 'Patient',
      resourceId: patient._id,
      userId: user._id
    });

    expect(auditLogs).toHaveLength(1);
    expect(auditLogs[0].action).toBe('READ');
  });
});
```

### 8. Payment Testing Pattern

```typescript
describe('Payment Processing', () => {
  beforeEach(() => {
    mockStripe.clear();
    mockStripe.simulateSuccess();
  });

  it('should process appointment payment successfully', async () => {
    const appointment = await createTestAppointment({
      price: 15000
    });

    const paymentIntent = await mockStripe.paymentIntents.create({
      amount: appointment.price,
      currency: 'brl',
      metadata: {
        appointmentId: appointment._id.toString()
      }
    });

    expect(paymentIntent.amount).toBe(15000);
    expect(paymentIntent.currency).toBe('brl');
    expect(paymentIntent.status).toBe('requires_confirmation');
  });
});
```

### 9. Error Handling Pattern

```typescript
describe('Error Handling', () => {
  it('should handle database connection errors gracefully', async () => {
    // Simulate database disconnection
    await mongoose.disconnect();

    const response = await request(app)
      .get('/api/patients')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(500);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('erro interno');

    // Reconnect for cleanup
    await mongoose.connect(mongoUri);
  });
});
```

### 10. Mock Data Pattern

```typescript
describe('Realistic Test Data', () => {
  it('should create realistic patient data for testing', async () => {
    const patient = await createRealisticPatient({
      age: 35,
      specialty: 'Ortodontia'
    });

    expect(patient.firstName).toBeDefined();
    expect(patient.email).toBeValidEmail();
    expect(patient.phone).toBeValidPhone();
    expect(patient.dateOfBirth).toBeInstanceOf(Date);
    expect(patient.medicalHistory.allergies).toBeInstanceOf(Array);
  });
});
```

## Test Organization Best Practices

### File Structure
```
tests/
├── unit/           # Isolated component tests
├── integration/    # API and service integration
├── security/       # Security vulnerability tests
├── compliance/     # HIPAA and regulatory tests
├── performance/    # Benchmarks and load tests
├── transactions/   # Database transaction tests
├── payments/       # Payment processing tests
├── mocks/          # Mock implementations
└── utils/          # Test utilities and helpers
```

### Naming Conventions
- Test files: `*.test.ts`
- Mock files: `*.mock.ts`
- Utility files: `*Utils.ts`
- Test descriptions in Portuguese for user-facing features
- English for technical/internal functionality