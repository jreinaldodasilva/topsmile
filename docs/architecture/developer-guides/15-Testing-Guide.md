# TopSmile Testing Guide

**Version:** 1.0.0 | **Date:** 2024-01-15 | **Status:** ✅ Complete

---

## Testing Strategy

### Test Pyramid
```
        /\
       /E2E\      10% - End-to-end tests
      /------\
     /Integr.\   20% - Integration tests
    /----------\
   /   Unit     \ 70% - Unit tests
  /--------------\
```

### Coverage Targets
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

---

## Unit Testing

### Frontend Unit Tests (Jest + Testing Library)

**Component Test:**
```typescript
// AppointmentCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import AppointmentCard from './AppointmentCard';

describe('AppointmentCard', () => {
  const mockAppointment = {
    id: '1',
    patient: { name: 'John Doe' },
    scheduledStart: new Date('2024-01-15T10:00:00Z'),
    status: 'scheduled'
  };

  it('renders appointment details', () => {
    render(<AppointmentCard appointment={mockAppointment} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/10:00/)).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', () => {
    const handleEdit = jest.fn();
    render(<AppointmentCard appointment={mockAppointment} onEdit={handleEdit} />);
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    
    expect(handleEdit).toHaveBeenCalledWith('1');
  });
});
```

**Hook Test:**
```typescript
// useAppointments.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppointments } from './useAppointments';

describe('useAppointments', () => {
  it('fetches appointments successfully', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useAppointments(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(3);
  });
});
```

### Backend Unit Tests (Jest)

**Service Test:**
```typescript
// appointmentService.test.ts
import { appointmentService } from './appointmentService';
import { Appointment } from '@/models/Appointment';

jest.mock('@/models/Appointment');

describe('AppointmentService', () => {
  describe('createAppointment', () => {
    it('creates appointment successfully', async () => {
      const mockData = {
        patient: 'patient_id',
        provider: 'provider_id',
        scheduledStart: new Date()
      };

      (Appointment.create as jest.Mock).mockResolvedValue({
        _id: 'apt_id',
        ...mockData
      });

      const result = await appointmentService.createAppointment(mockData);

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('_id');
    });

    it('returns error for invalid data', async () => {
      (Appointment.create as jest.Mock).mockRejectedValue(
        new Error('Validation failed')
      );

      const result = await appointmentService.createAppointment({});

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
```

---

## Integration Testing

### API Integration Tests (Supertest)

```typescript
// appointments.integration.test.ts
import request from 'supertest';
import app from '@/app';
import { connectToDatabase, closeDatabase } from '@/test/helpers/database';

describe('Appointments API', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('POST /api/appointments', () => {
    it('creates appointment with valid data', async () => {
      const response = await request(app)
        .post('/api/appointments')
        .set('Cookie', authCookie)
        .send({
          patient: 'patient_id',
          provider: 'provider_id',
          scheduledStart: '2024-01-15T10:00:00Z',
          duration: 30
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
    });

    it('returns 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/appointments')
        .set('Cookie', authCookie)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('returns 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/appointments')
        .send({});

      expect(response.status).toBe(401);
    });
  });
});
```

---

## E2E Testing (Cypress)

### User Flow Test

```typescript
// appointment-booking.cy.ts
describe('Appointment Booking Flow', () => {
  beforeEach(() => {
    cy.login('patient@email.com', 'password');
  });

  it('books appointment successfully', () => {
    // Navigate to booking page
    cy.visit('/patient/appointments/new');

    // Select appointment type
    cy.get('[data-testid="appointment-type"]').select('Consultation');

    // Select provider
    cy.get('[data-testid="provider"]').select('Dr. Smith');

    // Select date
    cy.get('[data-testid="date-picker"]').click();
    cy.get('[data-date="2024-01-15"]').click();

    // Select time
    cy.get('[data-testid="time-slot-10:00"]').click();

    // Confirm booking
    cy.get('[data-testid="confirm-button"]').click();

    // Verify confirmation
    cy.contains('Agendamento confirmado').should('be.visible');
    cy.url().should('include', '/patient/appointments');
  });

  it('shows error for unavailable slot', () => {
    cy.visit('/patient/appointments/new');
    
    // Try to book unavailable slot
    cy.get('[data-testid="time-slot-14:00"]').should('be.disabled');
  });
});
```

---

## Test Utilities

### Test Helpers

```typescript
// test/helpers/database.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

export async function connectToDatabase() {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
}

export async function closeDatabase() {
  await mongoose.disconnect();
  await mongoServer.stop();
}

export async function clearDatabase() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}
```

### Mock Data Factories

```typescript
// test/factories/appointment.factory.ts
import { faker } from '@faker-js/faker';

export function createMockAppointment(overrides = {}) {
  return {
    id: faker.string.uuid(),
    patient: {
      id: faker.string.uuid(),
      name: faker.person.fullName()
    },
    provider: {
      id: faker.string.uuid(),
      name: faker.person.fullName()
    },
    scheduledStart: faker.date.future(),
    duration: 30,
    status: 'scheduled',
    ...overrides
  };
}
```

---

## Mocking Strategies

### API Mocking (MSW)

```typescript
// mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/appointments', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: [
          { id: '1', patient: 'John Doe', scheduledStart: '2024-01-15T10:00:00Z' }
        ]
      })
    );
  }),

  rest.post('/api/appointments', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        success: true,
        data: { id: '2', ...req.body }
      })
    );
  })
];
```

### Service Mocking

```typescript
// Mock entire service
jest.mock('@/services/appointmentService', () => ({
  appointmentService: {
    getAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({ id: '1' })
  }
}));

// Mock specific methods
const mockCreate = jest.spyOn(appointmentService, 'create');
mockCreate.mockResolvedValue({ id: '1' });
```

---

## Accessibility Testing

```typescript
// accessibility.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import AppointmentCard from './AppointmentCard';

expect.extend(toHaveNoViolations);

describe('AppointmentCard Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<AppointmentCard appointment={mockData} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## Performance Testing

### Load Testing (k6)

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
  },
};

export default function () {
  const res = http.get('http://localhost:5000/api/appointments');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
}
```

---

## Running Tests

### Frontend Tests
```bash
npm run test:frontend              # Run all tests
npm run test:frontend:watch        # Watch mode
npm run test:frontend:coverage     # With coverage
npm run test:a11y                  # Accessibility tests
```

### Backend Tests
```bash
npm run test:backend               # Run all tests
npm run test:backend:watch         # Watch mode
npm run test:backend:coverage      # With coverage
npm run test:backend:integration   # Integration only
```

### E2E Tests
```bash
npm run cy:open                    # Open Cypress UI
npm run cy:run                     # Run headless
npm run test:e2e                   # Run all E2E tests
```

### Performance Tests
```bash
npm run perf:load                  # Run k6 load tests
```

---

## CI/CD Testing

### GitHub Actions Workflow
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run test:ci
      - run: npm run test:e2e
```

---

## Improvement Recommendations

### 🟥 Critical
1. **Increase Test Coverage** - Target 80%+ (ongoing)
2. **Add Contract Testing** - Pact for API contracts (1 week)

### 🟧 High Priority
3. **Implement Visual Regression Testing** - Percy/Chromatic (1 week)
4. **Add Mutation Testing** - Stryker (1 week)
5. **Improve E2E Test Stability** - Reduce flakiness (ongoing)

---

**Related:** [13-Developer-Onboarding-Guide.md](./13-Developer-Onboarding-Guide.md), [14-Coding-Standards.md](./14-Coding-Standards.md)
