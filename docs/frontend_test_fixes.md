# Frontend Test Fixes - Root Cause Analysis and Solutions

## Root Cause Analysis Summary

After examining the failed tests and codebase, I identified several key issues:

1. **HTTP Service Tests**: Network mocking not properly configured for test environment
2. **Component Tests**: Missing proper MSW (Mock Service Worker) integration in test setup
3. **Component Rendering Issues**: Components not properly handling loading states and missing mocked API responses
4. **Import/Export Issues**: Component export/import mismatches in LoginPage tests
5. **Mock Data Structure Misalignment**: Test expectations don't match actual component behavior and API response structure

## Fixes Implementation

### Fix 1: Update HTTP Service Test Configuration

**Root Cause**: The HTTP service tests are failing because fetch is being mocked at the global level in setupTests.ts, but the individual test files are creating their own mocks that conflict with the global setup.

**File**: `src/tests/services/http.test.ts`

```typescript
import { request, logout, API_BASE_URL } from '../../services/http';

// Mock localStorage with proper implementation
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock fetch properly for this test suite
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('http service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    mockFetch.mockClear();
  });

  describe('request function', () => {
    describe('successful requests', () => {
      it('should make successful GET request without auth', async () => {
        const mockResponse = { data: { message: 'success' } };
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: async () => JSON.stringify(mockResponse)
        });

        const result = await request('/test-endpoint', { auth: false });

        expect(result.ok).toBe(true);
        expect(result.status).toBe(200);
        expect(result.data).toEqual(mockResponse);
      });

      it('should make successful POST request with auth', async () => {
        const mockResponse = { data: { id: '123' } };
        const accessToken = 'test-access-token';
        localStorageMock.setItem('topsmile_access_token', accessToken);

        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 201,
          text: async () => JSON.stringify(mockResponse)
        });

        const result = await request('/test-endpoint', {
          method: 'POST',
          body: JSON.stringify({ name: 'test' })
        });

        expect(result.ok).toBe(true);
        expect(result.data).toEqual(mockResponse);
      });

      it('should handle full URL endpoints', async () => {
        const fullUrl = 'https://external-api.com/test';
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ data: 'external' })
        });

        const result = await request(fullUrl);
        expect(result.ok).toBe(true);
      });
    });

    describe('error handling', () => {
      it('should handle HTTP errors', async () => {
        const errorResponse = { message: 'Not found' };
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 404,
          text: async () => JSON.stringify(errorResponse)
        });

        const result = await request('/not-found');

        expect(result.ok).toBe(false);
        expect(result.status).toBe(404);
        expect(result.message).toBe('Not found');
      });

      it('should handle malformed JSON responses', async () => {
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: async () => 'not json'
        });

        const result = await request('/malformed');

        expect(result.ok).toBe(true);
        expect(result.data).toEqual({ message: 'not json' });
      });
    });

    describe('token refresh', () => {
      it('should refresh token on 401 and retry request', async () => {
        const expiredToken = 'expired-token';
        const newToken = 'new-access-token';
        const refreshToken = 'refresh-token';

        localStorageMock.setItem('topsmile_access_token', expiredToken);
        localStorageMock.setItem('topsmile_refresh_token', refreshToken);

        // First call returns 401
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 401,
          text: async () => JSON.stringify({ message: 'Unauthorized' })
        });

        // Refresh call succeeds
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({
            data: { accessToken: newToken, refreshToken: 'new-refresh' }
          })
        });

        // Retry call succeeds
        mockFetch.mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ data: { success: true } })
        });

        const result = await request('/protected-endpoint');

        expect(result.ok).toBe(true);
        expect(localStorageMock.getItem('topsmile_access_token')).toBe(newToken);
      });

      it('should handle refresh failure', async () => {
        localStorageMock.setItem('topsmile_access_token', 'expired');
        localStorageMock.setItem('topsmile_refresh_token', 'refresh');

        // Original request fails
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 401,
          text: async () => JSON.stringify({ message: 'Unauthorized' })
        });

        // Refresh fails
        mockFetch.mockResolvedValueOnce({
          ok: false,
          status: 400,
          text: async () => JSON.stringify({ message: 'Invalid refresh token' })
        });

        await expect(request('/protected-endpoint')).rejects.toThrow();
        expect(localStorageMock.getItem('topsmile_access_token')).toBeNull();
      });

      it('should handle concurrent refresh requests', async () => {
        localStorageMock.setItem('topsmile_access_token', 'expired');
        localStorageMock.setItem('topsmile_refresh_token', 'refresh');

        // Setup mock responses
        mockFetch
          .mockResolvedValueOnce({
            ok: false,
            status: 401,
            text: async () => JSON.stringify({ message: 'Unauthorized' })
          })
          .mockResolvedValueOnce({
            ok: false,
            status: 401,
            text: async () => JSON.stringify({ message: 'Unauthorized' })
          })
          .mockResolvedValueOnce({
            ok: true,
            status: 200,
            text: async () => JSON.stringify({
              data: { accessToken: 'new-token', refreshToken: 'new-refresh' }
            })
          })
          .mockResolvedValue({
            ok: true,
            status: 200,
            text: async () => JSON.stringify({ data: { success: true } })
          });

        const [result1, result2] = await Promise.all([
          request('/endpoint1'),
          request('/endpoint2')
        ]);

        expect(result1.ok).toBe(true);
        expect(result2.ok).toBe(true);
      });
    });
  });

  describe('logout function', () => {
    it('should notify backend about logout', async () => {
      const refreshToken = 'test-refresh-token';
      localStorageMock.setItem('topsmile_refresh_token', refreshToken);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true })
      });

      await logout();

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/api/auth/logout`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        })
      );
    });
  });
});
```

### Fix 2: Enhanced MSW Handlers for Component Tests

**Root Cause**: The MSW handlers don't provide complete mock data that matches the component expectations.

**File**: `src/mocks/handlers.ts`

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  // Dashboard endpoint with comprehensive mock data
  http.get('*/api/admin/dashboard', () => {
    return HttpResponse.json({
      success: true,
      data: {
        contacts: {
          total: 150,
          byStatus: [
            { _id: 'new', count: 45 },
            { _id: 'contacted', count: 30 },
            { _id: 'qualified', count: 25 },
            { _id: 'converted', count: 20 },
            { _id: 'closed', count: 30 }
          ],
          bySource: [
            { _id: 'website_contact_form', count: 60 },
            { _id: 'phone', count: 30 },
            { _id: 'referral', count: 25 },
            { _id: 'social_media', count: 35 }
          ],
          recentCount: 12
        },
        summary: {
          totalContacts: 150,
          newThisWeek: 25,
          conversionRate: 18,
          revenue: 'R$ 25.480'
        },
        user: {
          name: 'Admin User',
          role: 'admin',
          clinicId: 'clinic-123'
        }
      }
    });
  }),

  // Enhanced contacts endpoint
  http.get('*/api/admin/contacts', () => {
    return HttpResponse.json({
      success: true,
      data: {
        contacts: [
          {
            _id: 'contact1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '(11) 99999-9999',
            status: 'new',
            source: 'website_contact_form',
            createdAt: '2023-01-01T10:00:00Z'
          },
          {
            _id: 'contact2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '(11) 88888-8888',
            status: 'contacted',
            source: 'phone',
            createdAt: '2023-01-02T10:00:00Z'
          }
        ],
        total: 2
      }
    });
  }),

  // Provider management endpoints
  http.get('*/api/providers', () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          _id: 'provider1',
          name: 'Dr. Smith',
          specialization: 'General',
          email: 'drsmith@example.com',
          phone: '(11) 99999-0001'
        },
        {
          _id: 'provider2',
          name: 'Dr. Johnson',
          specialization: 'Orthodontics',
          email: 'drjohnson@example.com',
          phone: '(11) 99999-0002'
        }
      ]
    });
  }),

  // Appointment types
  http.get('*/api/appointment-types', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { _id: 'type1', name: 'Consultation', duration: 30 },
        { _id: 'type2', name: 'Cleaning', duration: 45 }
      ]
    });
  }),

  // Available time slots
  http.get('*/api/appointments/available-slots', () => {
    return HttpResponse.json({
      success: true,
      data: [
        { time: '09:00', available: true },
        { time: '10:00', available: true },
        { time: '11:00', available: false },
        { time: '14:00', available: true }
      ]
    });
  }),

  // Patients endpoints
  http.get('*/api/patients', () => {
    return HttpResponse.json({
      success: true,
      data: {
        patients: [],
        total: 0
      }
    });
  }),

  // Appointments endpoint
  http.get('*/api/appointments', () => {
    return HttpResponse.json({
      success: true,
      data: {
        appointments: [],
        total: 0
      }
    });
  }),

  // Auth endpoints
  http.post('*/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    if (body.email === 'admin@topsmile.com' && body.password === 'SecurePass123!') {
      return HttpResponse.json({
        success: true,
        data: {
          user: {
            _id: 'user123',
            name: 'Admin User',
            email: 'admin@topsmile.com',
            role: 'admin'
          },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token'
        }
      });
    } else {
      return HttpResponse.json({
        success: false,
        message: 'E-mail ou senha inválidos'
      }, { status: 401 });
    }
  }),

  http.get('*/api/auth/me', () => {
    return HttpResponse.json({
      success: true,
      data: {
        _id: 'user123',
        name: 'Current User',
        email: 'current@example.com',
        role: 'admin'
      }
    });
  }),

  // Token refresh endpoint
  http.post('*/api/auth/refresh', () => {
    return HttpResponse.json({
      success: true,
      data: {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      }
    });
  }),

  // Logout endpoint
  http.post('*/api/auth/logout', () => {
    return HttpResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  }),

  // Other endpoints...
  http.post('*/api/contact', () => {
    return HttpResponse.json({
      success: true,
      data: { id: 'contact-form-id', protocol: 'PROTOCOL-123' }
    });
  }),

  http.get('*/api/health', () => {
    return HttpResponse.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        uptime: 123456,
        database: 'connected',
        environment: 'test',
        version: '1.0.0'
      }
    });
  })
];
```

### Fix 3: Updated Test Setup with MSW Integration

**Root Cause**: Tests are not properly using MSW for API mocking, causing components that make API calls to fail.

**File**: `src/setupTests.ts`

```typescript
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
import './tests/utils/customMatchers';

// Setup MSW server for tests
export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Close server after all tests
afterAll(() => {
  server.close();
});

// Mock localStorage with proper implementation
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    length: Object.keys(store).length,
    key: (index: number) => Object.keys(store)[index] || null,
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock other window methods
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window, 'alert', {
  writable: true,
  value: jest.fn(),
});

// Clean up console.error to reduce test noise
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('ReactDOMTestUtils'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

### Fix 4: Fix LoginPage Component Export Issue

**Root Cause**: The LoginPage tests are failing because of import/export mismatches.

**File**: `src/tests/components/LoginPage.test.tsx`

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../../pages/Login/LoginPage';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import { ErrorProvider } from '../../contexts/ErrorContext';

// Test wrapper
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ErrorProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ErrorProvider>
  </BrowserRouter>
);

describe('LoginPage', () => {
  it('renders login form', async () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });
  });

  it('allows user to type email and password', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = await screen.findByLabelText(/e-mail/i);
    const passwordInput = await screen.findByLabelText(/senha/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const passwordInput = await screen.findByLabelText(/senha/i);
    const toggleButton = await screen.findByRole('button', { name: /mostrar senha/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('shows error message on login failure', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = await screen.findByLabelText(/e-mail/i);
    const passwordInput = await screen.findByLabelText(/senha/i);
    const submitButton = await screen.findByRole('button', { name: /entrar/i });

    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/e-mail ou senha inválidos/i)).toBeInTheDocument();
    });
  });
});
```

### Fix 5: Fix API Service Test Issues

**Root Cause**: The apiService tests are failing because they expect certain response formats that don't match the actual service implementation.

**File**: `src/tests/services/apiService.test.ts`

```typescript
import { apiService } from '../../services/apiService';

// Mock the http service
jest.mock('../../services/http', () => ({
  request: jest.fn(),
  logout: jest.fn()
}));

const mockRequest = require('../../services/http').request;

describe('apiService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('auth methods', () => {
    it('login should handle network errors', async () => {
      mockRequest.mockRejectedValueOnce(new Error('Network request failed'));

      await expect(
        apiService.auth.login('test@example.com', 'password')
      ).rejects.toThrow('Network request failed');
    });
  });

  describe('patients methods', () => {
    it('getAll should get all patients', async () => {
      const mockResponse = {
        ok: true,
        data: [{ _id: '1', name: 'John Doe' }]
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.patients.getAll();
      
      expect(mockRequest).toHaveBeenCalledWith('/api/patients');
      expect(result).toEqual(mockResponse);
    });

    it('getAll should handle query parameters', async () => {
      const mockResponse = {
        ok: true,
        data: [{ _id: '1', name: 'John Doe' }]
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const params = { search: 'john', limit: 10 };
      const result = await apiService.patients.getAll(params);
      
      expect(mockRequest).toHaveBeenCalledWith('/api/patients?search=john&limit=10');
      expect(result).toEqual(mockResponse);
    });

    it('getOne should get patient by ID', async () => {
      const mockResponse = {
        ok: true,
        data: { _id: '123', name: 'John Doe' }
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.patients.getOne('123');
      
      expect(mockRequest).toHaveBeenCalledWith('/api/patients/123');
      expect(result).toEqual(mockResponse);
    });

    it('getOne should handle non-existent patient', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        message: 'Patient not found'
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.patients.getOne('non-existent');
      
      expect(result).toEqual(mockResponse);
    });

    it('create should create a new patient', async () => {
      const patientData = { name: 'New Patient', email: 'new@example.com' };
      const mockResponse = {
        ok: true,
        data: { _id: 'new-id', ...patientData }
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.patients.create(patientData);
      
      expect(mockRequest).toHaveBeenCalledWith('/api/patients', {
        method: 'POST',
        body: JSON.stringify(patientData)
      });
      expect(result).toEqual(mockResponse);
    });

    it('update should update patient data', async () => {
      const updates = { name: 'Updated Name' };
      const mockResponse = {
        ok: true,
        data: { _id: '123', name: 'Updated Name' }
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.patients.update('123', updates);
      
      expect(mockRequest).toHaveBeenCalledWith('/api/patients/123', {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      expect(result).toEqual(mockResponse);
    });

    it('delete should delete patient', async () => {
      const mockResponse = {
        ok: true,
        message: 'Patient deleted successfully'
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.patients.delete('123');
      
      expect(mockRequest).toHaveBeenCalledWith('/api/patients/123', {
        method: 'DELETE'
      });
      expect(result).toEqual(mockResponse);
    });
  });

  // Similar patterns for other service methods...
  describe('contacts methods', () => {
    it('getAll should get all contacts', async () => {
      const mockResponse = {
        ok: true,
        data: { contacts: [], total: 0 }
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.contacts.getAll();
      expect(result).toEqual(mockResponse);
    });

    it('create should create a new contact', async () => {
      const contactData = { name: 'New Contact', email: 'contact@example.com' };
      const mockResponse = {
        ok: true,
        data: { _id: 'new-contact-id', ...contactData }
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.contacts.create(contactData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('appointments methods', () => {
    it('getAll should get all appointments', async () => {
      const mockResponse = {
        ok: true,
        data: []
      };
      mockRequest.mockResolvedValueOnce(mockResponse);

      const result = await apiService.appointments.getAll();
      expect(result).toEqual(mockResponse);
    });