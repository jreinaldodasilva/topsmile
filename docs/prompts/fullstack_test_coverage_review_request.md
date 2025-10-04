# Test Coverage Analysis - TopSmile Repository

## Objective
Identify gaps in test coverage, prioritize critical paths requiring tests, and provide concrete test implementation examples to improve reliability and confidence.

## Scope
- Backend API endpoints and business logic
- Frontend components and user interactions
- Integration tests for critical workflows
- Edge cases and error handling
- Authentication and authorization flows

## Analysis Checklist

### 1. Coverage Assessment
- [ ] Run coverage reports for all packages
- [ ] Identify untested critical paths
- [ ] Find code with zero test coverage
- [ ] Check coverage for error handling branches
- [ ] Verify edge case coverage
- [ ] Assess integration test coverage

### 2. Critical Path Identification
- [ ] Authentication/login flows
- [ ] User registration and onboarding
- [ ] Core business logic functions
- [ ] Payment processing (if applicable)
- [ ] Data persistence operations
- [ ] API endpoint handlers
- [ ] Authorization checks

### 3. Test Quality Evaluation
- [ ] Check for meaningful assertions (not just "doesn't crash")
- [ ] Verify proper mocking strategies
- [ ] Assess test independence (no shared state)
- [ ] Check for flaky tests
- [ ] Verify test naming conventions
- [ ] Review test organization

### 4. Missing Test Categories
- [ ] Unit tests for business logic
- [ ] Integration tests for API endpoints
- [ ] E2E tests for user workflows
- [ ] Error handling tests
- [ ] Security/authorization tests
- [ ] Performance/load tests (if applicable)

## Deliverable Format

Create `TEST_COVERAGE_REPORT.md` with:

```markdown
# Test Coverage Analysis Report

## Executive Summary
- Overall test coverage: [X%]
- Critical paths tested: [Y%]
- High-priority gaps: [Z]
- Estimated effort to reach 80%: [hours]
- Test framework: Jest/Vitest/Mocha + Supertest/Testing Library

## Coverage Metrics

| Package | Statements | Branches | Functions | Lines | Status |
|---------|------------|----------|-----------|-------|--------|
| Backend | 35% | 28% | 40% | 35% | ❌ Critical |
| Frontend | 42% | 35% | 45% | 42% | ⚠️ Low |
| Shared | 65% | 55% | 70% | 65% | ✅ Acceptable |
| **Overall** | **42%** | **35%** | **47%** | **42%** | ❌ **Below Target** |

**Target**: 80% coverage on critical paths, 60% overall

---

## Critical Gaps

### GAP-001: Authentication Flow (CRITICAL)
**Coverage**: 0% ❌
**Risk**: Security vulnerabilities undetected
**Priority**: P0 (Immediate)

**Missing Tests**:
1. ✗ Successful login with valid credentials
2. ✗ Failed login with invalid credentials
3. ✗ JWT token generation and validation
4. ✗ Token expiration handling
5. ✗ Password reset flow
6. ✗ Session management

**Concrete Test Example**:
```typescript
// backend/src/modules/auth/__tests__/auth.service.test.ts
import { AuthService } from '../auth.service';
import { UserRepository } from '../../users/user.repository';
import { JwtService } from '../jwt.service';
import bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepo: jest.Mocked<UserRepository>;
  let mockJwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    mockUserRepo = {
      findByEmail: jest.fn(),
    } as any;
    
    mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as any;

    authService = new AuthService(mockUserRepo, mockJwtService);
  });

  describe('login', () => {
    it('should return JWT token for valid credentials', async () => {
      // Arrange
      const email = 'user@example.com';
      const password = 'password123';
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const mockUser = {
        id: '1',
        email,
        password: hashedPassword,
        role: 'user',
      };

      mockUserRepo.findByEmail.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock.jwt.token');

      // Act
      const result = await authService.login(email, password);

      // Assert
      expect(result).toEqual({
        token: 'mock.jwt.token',
        user: {
          id: '1',
          email,
          role: 'user',
        },
      });
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(email);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        userId: '1',
        email,
        role: 'user',
      });
    });

    it('should throw error for invalid email', async () => {
      // Arrange
      mockUserRepo.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(
        authService.login('wrong@example.com', 'password')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for incorrect password', async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash('correct', 10);
      mockUserRepo.findByEmail.mockResolvedValue({
        id: '1',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'user',
      } as any);

      // Act & Assert
      await expect(
        authService.login('user@example.com', 'wrong-password')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should not expose whether email or password was wrong', async () => {
      // Security test: same error message for both cases
      mockUserRepo.findByEmail.mockResolvedValue(null);

      const error1 = await authService.login('wrong@example.com', 'pass')
        .catch(e => e.message);

      mockUserRepo.findByEmail.mockResolvedValue({
        id: '1',
        email: 'user@example.com',
        password: await bcrypt.hash('correct', 10),
        role: 'user',
      } as any);

      const error2 = await authService.login('user@example.com', 'wrong')
        .catch(e => e.message);

      expect(error1).toBe(error2); // Same error message
    });
  });
});
```

**Integration Test Example**:
```typescript
// backend/src/modules/auth/__tests__/auth.integration.test.ts
import request from 'supertest';
import { app } from '../../../app';
import { db } from '../../../database';

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.disconnect();
  });

  beforeEach(async () => {
    await db.users.deleteMany({});
  });

  it('should return 200 and JWT token for valid credentials', async () => {
    // Arrange
    await db.users.create({
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10),
      role: 'user',
    });

    // Act
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
    expect(response.body.user).toMatchObject({
      email: 'test@example.com',
      role: 'user',
    });
    expect(response.body.user).not.toHaveProperty('password'); // Should not expose password
  });

  it('should return 401 for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'wrong',
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid credentials');
  });

  it('should return 400 for missing fields', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com' }); // Missing password

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('password');
  });

  it('should rate limit login attempts', async () => {
    // Make 10 failed login attempts
    const requests = Array(10).fill(null).map(() =>
      request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' })
    );

    await Promise.all(requests);

    // 11th attempt should be rate limited
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' });

    expect(response.status).toBe(429); // Too Many Requests
  });
});
```

---

### GAP-002: Authorization Middleware (CRITICAL)
**Coverage**: 15% ❌
**Risk**: Unauthorized access to protected resources
**Priority**: P0 (Immediate)

**Missing Tests**:
1. ✗ Valid JWT allows access
2. ✗ Expired JWT is rejected
3. ✗ Invalid JWT is rejected
4. ✗ Missing JWT is rejected
5. ✗ Role-based access control
6. ✗ Permission checks

**Concrete Test Example**:
```typescript
// backend/src/middleware/__tests__/auth.middleware.test.ts
import { authMiddleware } from '../auth.middleware';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

describe('authMiddleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should call next() for valid JWT token', () => {
    // Arrange
    const token = jwt.sign(
      { userId: '123', role: 'user' },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );
    mockReq.headers = { authorization: `Bearer ${token}` };

    // Act
    authMiddleware(mockReq as Request, mockRes as Response, mockNext);

    // Assert
    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toMatchObject({
      userId: '123',
      role: 'user',
    });
  });

  it('should return 401 if no token provided', () => {
    // Act
    authMiddleware(mockReq as Request, mockRes as Response, mockNext);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Authentication required',
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 for expired token', () => {
    // Arrange
    const token = jwt.sign(
      { userId: '123' },
      process.env.JWT_SECRET!,
      { expiresIn: '-1h' } // Expired 1 hour ago
    );
    mockReq.headers = { authorization: `Bearer ${token}` };

    // Act
    authMiddleware(mockReq as Request, mockRes as Response, mockNext);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Token expired',
    });
  });

  it('should return 401 for invalid token signature', () => {
    // Arrange
    const token = jwt.sign(
      { userId: '123' },
      'wrong-secret'
    );
    mockReq.headers = { authorization: `Bearer ${token}` };

    // Act
    authMiddleware(mockReq as Request, mockRes as Response, mockNext);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Invalid token',
    });
  });
});
```

---

### GAP-003: API Error Handling (HIGH)
**Coverage**: 20% ⚠️
**Risk**: Unhandled errors crash server
**Priority**: P1 (High)

**Missing Tests**:
1. ✗ Database connection errors
2. ✗ Validation errors
3. ✗ 404 Not Found responses
4. ✗ 500 Internal Server Error handling
5. ✗ Error response format consistency

**Concrete Test Example**:
```typescript
// backend/src/middleware/__tests__/errorHandler.test.ts
import { errorHandler } from '../errorHandler.middleware';
import { Request, Response, NextFunction } from 'express';

describe('Error Handler Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('should handle ValidationError with 400 status', () => {
    // Arrange
    const error = new ValidationError('Email is required');

    // Act
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Validation Error',
      message: 'Email is required',
      code: 'VALIDATION_ERROR',
    });
  });

  it('should handle NotFoundError with 404 status', () => {
    // Arrange
    const error = new NotFoundError('User not found');

    // Act
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Not Found',
      message: 'User not found',
      code: 'NOT_FOUND',
    });
  });

  it('should not expose stack traces in production', () => {
    // Arrange
    process.env.NODE_ENV = 'production';
    const error = new Error('Database connection failed');
    error.stack = 'Error: Database\n  at file.ts:10:5';

    // Act
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    // Assert
    const response = (mockRes.json as jest.Mock).mock.calls[0][0];
    expect(response).not.toHaveProperty('stack');
  });

  it('should include stack traces in development', () => {
    // Arrange
    process.env.NODE_ENV = 'development';
    const error = new Error('Test error');

    // Act
    errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

    // Assert
    const response = (mockRes.json as jest.Mock).mock.calls[0][0];
    expect(response).toHaveProperty('stack');
  });
});
```

---

## Frontend Testing Gaps

### GAP-004: Critical React Components (HIGH)
**Coverage**: 25% ⚠️
**Components Needing Tests**: 15 critical components

**Example: Login Form Component**:
```typescript
// frontend/src/features/auth/__tests__/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../LoginForm';
import { authApi } from '../../../api/auth';

jest.mock('../../../api/auth');

describe('LoginForm', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render email and password inputs', () => {
    render(<LoginForm onSuccess={mockOnSuccess} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    render(<LoginForm onSuccess={mockOnSuccess} />);

    const submitButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    expect(authApi.login).not.toHaveBeenCalled();
  });

  it('should call onSuccess after successful login', async () => {
    // Arrange
    (authApi.login as jest.Mock).mockResolvedValue({
      token: 'mock-token',
      user: { id: '1', email: 'test@example.com' },
    });

    render(<LoginForm onSuccess={mockOnSuccess} />);

    // Act
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    // Assert
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith({
        token: 'mock-token',
        user: { id: '1', email: 'test@example.com' },
      });
    });
  });

  it('should display error message on login failure', async () => {
    // Arrange
    (authApi.login as jest.Mock).mockRejectedValue(
      new Error('Invalid credentials')
    );

    render(<LoginForm onSuccess={mockOnSuccess} />);

    // Act
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should disable submit button while loading', async () => {
    // Arrange
    (authApi.login as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    render(<LoginForm onSuccess={mockOnSuccess} />);

    // Act
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    
    const submitButton = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submitButton);

    // Assert
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
  });
});
```

---

## E2E Test Recommendations

### Critical User Flows (Cypress/Playwright)

```typescript
// e2e/tests/auth-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('user can register, login, and logout', async ({ page }) => {
    // Registration
    await page.goto('/register');
    await page.fill('[name="email"]', 'newuser@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="confirmPassword"]', 'SecurePass123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome')).toBeVisible();

    // Logout
    await page.click('[aria-label="User menu"]');
    await page.click('text=Logout');
    await expect(page).toHaveURL('/login');

    // Login with registered account
    await page.fill('[name="email"]', 'newuser@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
  });

  test('user cannot access protected pages without auth', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('text=Please log in')).toBeVisible();
  });

  test('displays error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'wrong@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL('/login'); // Still on login page
  });
});
```

---

## Test Prioritization Matrix

| Test Area | Current Coverage | Risk | Effort | Priority |
|-----------|------------------|------|--------|----------|
| Auth flows | 0% | Critical | 4h | P0 🔴 |
| Authorization middleware | 15% | Critical | 3h | P0 🔴 |
| API error handling | 20% | High | 3h | P1 🟠 |
| Payment processing | 0% | High | 6h | P1 🟠 |
| User CRUD operations | 30% | Medium | 4h | P2 🟡 |
| Data validation | 45% | Medium | 2h | P2 🟡 |
| UI components | 25% | Medium | 8h | P2 🟡 |
| Utility functions | 65% | Low | 2h | P3 🟢 |

---

## Edge Cases Requiring Tests

### Backend Edge Cases
```typescript
// Examples of edge cases to test

describe('Edge Cases', () => {
  it('should handle concurrent requests to same resource', async () => {
    // Test race conditions
  });

  it('should handle malformed JSON in request body', async () => {
    const response = await request(app)
      .post('/api/users')
      .send('{"invalid json}')
      .set('Content-Type', 'application/json');

    expect(response.status).toBe(400);
  });

  it('should handle extremely large request payloads', async () => {
    const largePayload = 'x'.repeat(10 * 1024 * 1024); // 10MB
    const response = await request(app)
      .post('/api/upload')
      .send({ data: largePayload });

    expect(response.status).toBe(413); // Payload Too Large
  });

  it('should handle database connection loss gracefully', async () => {
    // Mock database connection failure
    jest.spyOn(db, 'query').mockRejectedValue(
      new Error('Connection lost')
    );

    const response = await request(app).get('/api/users');

    expect(response.status).toBe(503); // Service Unavailable
    expect(response.body.error).toContain('temporarily unavailable');
  });

  it('should handle null/undefined values in required fields', async () => {
    const testCases = [
      { email: null, password: 'test' },
      { email: undefined, password: 'test' },
      { email: '', password: 'test' },
    ];

    for (const data of testCases) {
      const response = await request(app)
        .post('/api/auth/login')
        .send(data);

      expect(response.status).toBe(400);
    }
  });
});
```

### Frontend Edge Cases
```typescript
describe('UI Edge Cases', () => {
  it('should handle slow network responses', async () => {
    // Mock slow API
    server.use(
      rest.get('/api/users', async (req, res, ctx) => {
        await delay(5000); // 5 second delay
        return res(ctx.json([]));
      })
    );

    render(<UserList />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    }, { timeout: 6000 });
  });

  it('should handle network errors gracefully', async () => {
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res.networkError('Network error');
      })
    );

    render(<UserList />);

    await waitFor(() => {
      expect(screen.getByText(/unable to connect/i)).toBeInTheDocument();
    });
  });

  it('should prevent double-submission', async () => {
    const mockSubmit = jest.fn().mockResolvedValue({});
    
    render(<PaymentForm onSubmit={mockSubmit} />);

    const submitButton = screen.getByRole('button', { name: /pay/i });
    
    // Click multiple times rapidly
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1); // Only once!
    });
  });
});
```

---

## Performance/Load Testing Recommendations

### Backend Load Tests (using Artillery)

```yaml
# artillery-config.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Spike test"

scenarios:
  - name: "User login flow"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "password123"
          capture:
            - json: "$.token"
              as: "token"
      - get:
          url: "/api/users/profile"
          headers:
            Authorization: "Bearer {{ token }}"
```

### Frontend Performance Tests

```typescript
// frontend/src/__tests__/performance.test.tsx
import { render } from '@testing-library/react';
import { LargeDataTable } from '../components/LargeDataTable';

describe('Performance Tests', () => {
  it('should render 1000 rows in under 2 seconds', () => {
    const mockData = Array(1000).fill(null).map((_, i) => ({
      id: i,
      name: `User ${i}`,
      email: `user${i}@example.com`,
    }));

    const startTime = performance.now();
    render(<LargeDataTable data={mockData} />);
    const endTime = performance.now();

    const renderTime = endTime - startTime;
    expect(renderTime).toBeLessThan(2000); // 2 seconds
  });

  it('should handle rapid state updates without lag', async () => {
    const { rerender } = render(<SearchBox />);

    const startTime = performance.now();
    
    // Simulate rapid typing
    for (let i = 0; i < 50; i++) {
      rerender(<SearchBox query={`test query ${i}`} />);
    }

    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(1000);
  });
});
```

---

## Test Organization Recommendations

### Current Issues
- ❌ Tests scattered across multiple locations
- ❌ Inconsistent naming conventions
- ❌ No clear test categories
- ❌ Missing test utilities/helpers

### Recommended Structure

```
packages/
├── backend/
│   ├── src/
│   │   └── modules/
│   │       └── users/
│   │           ├── user.service.ts
│   │           └── __tests__/
│   │               ├── user.service.test.ts      # Unit tests
│   │               └── user.integration.test.ts  # Integration tests
│   └── tests/
│       ├── fixtures/          # Test data
│       ├── helpers/           # Test utilities
│       └── setup.ts           # Global setup
├── frontend/
│   ├── src/
│   │   └── features/
│   │       └── auth/
│   │           ├── LoginForm.tsx
│   │           └── __tests__/
│   │               └── LoginForm.test.tsx
│   └── tests/
│       ├── mocks/             # MSW handlers
│       ├── utils/             # Testing utilities
│       └── setup.ts
└── e2e/
    ├── tests/
    │   ├── auth.spec.ts
    │   ├── user-management.spec.ts
    │   └── checkout.spec.ts
    └── fixtures/
```

---

## Test Infrastructure Setup

### Required Dependencies

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@playwright/test": "^1.40.0",
    "jest": "^29.7.0",
    "supertest": "^6.3.0",
    "ts-jest": "^29.1.0",
    "msw": "^2.0.0",
    "artillery": "^2.0.0"
  }
}
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
  coverageThresholds: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
    // Higher thresholds for critical paths
    './src/modules/auth/**/*.ts': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
```

---

## Roadmap to 80% Coverage

### Phase 1: Critical Paths (Week 1) - Priority P0
- [ ] Authentication flows (login, register, logout)
- [ ] Authorization middleware
- [ ] Error handling middleware
- [ ] API endpoint security tests
- **Target**: 50% coverage on critical paths

### Phase 2: Core Business Logic (Week 2) - Priority P1
- [ ] User management operations
- [ ] Data validation logic
- [ ] Payment processing (if applicable)
- [ ] Core API endpoints
- **Target**: 70% overall coverage

### Phase 3: UI Components (Week 3) - Priority P2
- [ ] Critical React components
- [ ] Form validation
- [ ] User interaction flows
- [ ] Error states
- **Target**: 60% frontend coverage

### Phase 4: Integration & E2E (Week 4) - Priority P2
- [ ] End-to-end user workflows
- [ ] API integration tests
- [ ] Database integration tests
- **Target**: 80% overall coverage

### Phase 5: Edge Cases & Performance (Week 5) - Priority P3
- [ ] Edge case scenarios
- [ ] Error boundary tests
- [ ] Performance benchmarks
- [ ] Load testing
- **Target**: 85%+ coverage, all critical paths tested

---

## Continuous Testing Strategy

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:changed",
      "pre-push": "npm run test:coverage"
    }
  }
}
```

### CI/CD Integration
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm ci
      - name: Run unit tests
        run: npm run test:unit
      - name: Run integration tests
        run: npm run test:integration
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          fail_ci_if_error: true
```

---

## Success Metrics

- ✅ All P0 critical paths have >80% coverage
- ✅ All P1 high-priority areas have >60% coverage
- ✅ Zero flaky tests in CI/CD
- ✅ Test execution time <5 minutes for unit tests
- ✅ Integration tests complete in <10 minutes
- ✅ E2E tests complete in <15 minutes
- ✅ Coverage reports generated automatically
- ✅ Tests run on every commit

---

## Assumptions Made
- Test framework: Jest + Testing Library + Playwright
- Database: Can be seeded/reset between tests
- API is RESTful (adjust for GraphQL if needed)
- Team has time for 4-week testing sprint
- CI/CD pipeline is available
```

## Output Files

1. `TEST_COVERAGE_REPORT.md` - Main report
2. `test_recommendations.json`:
```json
{
  "summary": {
    "currentCoverage": 0.42,
    "targetCoverage": 0.80,
    "criticalPathsCovered": 0.15,
    "estimatedEffort": "80 hours",
    "priorityGaps": 15
  },
  "gaps": [
    {
      "id": "GAP-001",
      "title": "Authentication Flow",
      "coverage": 0.0,
      "risk": "Critical",
      "priority": "P0",
      "testTypes": ["unit", "integration", "e2e"],
      "estimatedEffort": "4 hours",
      "exampleProvided": true
    }
  ],
  "roadmap": {
    "phase1": {
      "duration": "1 week",
      "priority": "P0",
      "targetCoverage": 0.50,
      "tasks": ["auth flows", "authorization", "error handling"]
    }
  }
}
```
3. `tests_to_add/` - Directory with concrete test files
4. `coverage_baseline.json` - Current coverage snapshot

## Commands to Run

```bash
# Generate coverage report
npm run test:coverage

# Run only unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Find untested files
npx jest --coverage --collectCoverageFrom='src/**/*.ts' --coverageReporters=json-summary

# Run tests for specific module
npm run test -- --testPathPattern=auth
```

## Success Criteria
- All critical gaps identified with concrete test examples
- Tests are copy-paste ready (minimal modification needed)
- Clear roadmap with realistic timelines
- Prioritization based on risk, not just coverage %
- Tests follow best practices (AAA pattern, proper mocking, meaningful assertions)