# Tests to Add - TopSmile Frontend

## Critical Missing Tests

### 1. Authentication Flow Integration Test

```typescript
// src/tests/integration/AuthFlow.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import LoginPage from '../../pages/Login/LoginPage';
import Dashboard from '../../pages/Admin/Dashboard/Dashboard';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

describe('Authentication Flow Integration', () => {
  it('should handle complete login to dashboard flow', async () => {
    // Mock successful login
    server.use(
      http.post('*/api/auth/login', () => {
        return HttpResponse.json({
          success: true,
          data: {
            user: { _id: 'user1', name: 'Admin User', email: 'admin@test.com', role: 'admin' },
            accessToken: 'valid-token',
            refreshToken: 'valid-refresh'
          }
        });
      }),
      http.get('*/api/auth/me', () => {
        return HttpResponse.json({
          success: true,
          data: { _id: 'user1', name: 'Admin User', email: 'admin@test.com', role: 'admin' }
        });
      })
    );

    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Fill login form
    fireEvent.change(screen.getByLabelText(/e-mail/i), { 
      target: { value: 'admin@test.com' } 
    });
    fireEvent.change(screen.getByLabelText(/senha/i), { 
      target: { value: 'password123' } 
    });

    // Submit login
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // Verify navigation to admin dashboard
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });

    // Verify token storage
    expect(localStorage.getItem('topsmile_access_token')).toBe('valid-token');
    expect(localStorage.getItem('topsmile_refresh_token')).toBe('valid-refresh');
  });

  it('should handle token refresh seamlessly', async () => {
    // Mock expired token response
    let callCount = 0;
    server.use(
      http.get('*/api/auth/me', () => {
        callCount++;
        if (callCount === 1) {
          return HttpResponse.json({ success: false, message: 'Token expired' }, { status: 401 });
        }
        return HttpResponse.json({
          success: true,
          data: { _id: 'user1', name: 'Admin User', email: 'admin@test.com', role: 'admin' }
        });
      }),
      http.post('*/api/auth/refresh', () => {
        return HttpResponse.json({
          success: true,
          data: { accessToken: 'new-token', refreshToken: 'new-refresh' }
        });
      })
    );

    // Set initial expired token
    localStorage.setItem('topsmile_access_token', 'expired-token');
    localStorage.setItem('topsmile_refresh_token', 'valid-refresh');

    render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );

    // Should automatically refresh and show dashboard
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });

    // Verify new tokens were stored
    expect(localStorage.getItem('topsmile_access_token')).toBe('new-token');
  });
});
```

### 2. Error Boundary Test

```typescript
// src/tests/components/ErrorBoundary.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No Error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error for this test
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('should catch component errors and show fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/algo deu errado/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No Error')).toBeInTheDocument();
    expect(screen.queryByText(/algo deu errado/i)).not.toBeInTheDocument();
  });

  it('should reset error state when retry button is clicked', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/algo deu errado/i)).toBeInTheDocument();

    // Rerender without error
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    // Click retry
    fireEvent.click(screen.getByRole('button', { name: /tentar novamente/i }));

    expect(screen.getByText('No Error')).toBeInTheDocument();
  });
});
```

### 3. Patient Appointment Booking Integration Test

```typescript
// src/tests/integration/PatientAppointmentBooking.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { PatientAuthProvider } from '../../contexts/PatientAuthContext';
import PatientAppointmentBooking from '../../pages/Patient/Appointment/PatientAppointmentBooking';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

const mockPatientUser = {
  _id: 'patient1',
  patient: { _id: 'patient1', name: 'John Doe', phone: '11999999999' },
  email: 'john@example.com',
  isActive: true,
  emailVerified: true
};

describe('Patient Appointment Booking Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
    });

    // Mock providers API
    server.use(
      http.get('*/api/providers', () => {
        return HttpResponse.json({
          success: true,
          data: [
            { _id: 'provider1', name: 'Dr. Smith', specialties: ['General Dentistry'] },
            { _id: 'provider2', name: 'Dr. Jones', specialties: ['Orthodontics'] }
          ]
        });
      }),
      http.get('*/api/appointment-types', () => {
        return HttpResponse.json({
          success: true,
          data: [
            { _id: 'type1', name: 'Consultation', duration: 30, price: 100 },
            { _id: 'type2', name: 'Cleaning', duration: 45, price: 80 }
          ]
        });
      })
    );
  });

  it('should complete full appointment booking flow', async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));

    // Mock successful appointment creation
    server.use(
      http.post('*/api/appointments', () => {
        return HttpResponse.json({
          success: true,
          data: {
            _id: 'appt123',
            patient: 'patient1',
            provider: 'provider1',
            appointmentType: 'type1',
            scheduledStart: '2024-12-01T10:00:00.000Z',
            status: 'scheduled'
          }
        });
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PatientAuthProvider>
            <PatientAppointmentBooking />
          </PatientAuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Wait for providers to load
    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    // Select provider
    fireEvent.change(screen.getByLabelText(/dentista/i), {
      target: { value: 'provider1' }
    });

    // Select appointment type
    fireEvent.change(screen.getByLabelText(/tipo de consulta/i), {
      target: { value: 'type1' }
    });

    // Select date
    fireEvent.change(screen.getByLabelText(/data/i), {
      target: { value: '2024-12-01' }
    });

    // Wait for time slots to load
    await waitFor(() => {
      expect(screen.getByText('10:00')).toBeInTheDocument();
    });

    // Select time slot
    fireEvent.click(screen.getByText('10:00'));

    // Confirm booking
    fireEvent.click(screen.getByText(/confirmar agendamento/i));

    // Should navigate to appointments list with success message
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/patient/appointments', {
        state: { message: 'Consulta agendada com sucesso!' }
      });
    });
  });

  it('should handle booking conflicts gracefully', async () => {
    // Mock conflict response
    server.use(
      http.post('*/api/appointments', () => {
        return HttpResponse.json({
          success: false,
          message: 'Horário não disponível'
        }, { status: 409 });
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <PatientAuthProvider>
            <PatientAppointmentBooking />
          </PatientAuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Complete booking flow...
    await waitFor(() => {
      expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/dentista/i), { target: { value: 'provider1' } });
    fireEvent.change(screen.getByLabelText(/tipo de consulta/i), { target: { value: 'type1' } });
    fireEvent.change(screen.getByLabelText(/data/i), { target: { value: '2024-12-01' } });

    await waitFor(() => {
      expect(screen.getByText('10:00')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('10:00'));
    fireEvent.click(screen.getByText(/confirmar agendamento/i));

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText('Horário não disponível')).toBeInTheDocument();
    });
  });
});
```

### 4. Form Validation Real-time Test

```typescript
// src/tests/components/UI/Form/FormValidation.test.tsx
import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormField from '../../../components/UI/Form/FormField';

const TestForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'email':
        if (!value) error = 'Email é obrigatório';
        else if (!/\S+@\S+\.\S+/.test(value)) error = 'Email inválido';
        break;
      case 'phone':
        if (!value) error = 'Telefone é obrigatório';
        else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(value)) error = 'Formato: (11) 99999-9999';
        break;
      case 'name':
        if (!value) error = 'Nome é obrigatório';
        else if (value.length < 2) error = 'Nome deve ter pelo menos 2 caracteres';
        break;
    }
    
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  return (
    <form>
      <FormField
        name="email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        touched={touched.email}
      />
      <FormField
        name="phone"
        label="Telefone"
        type="tel"
        value={formData.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.phone}
        touched={touched.phone}
      />
      <FormField
        name="name"
        label="Nome"
        type="text"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        touched={touched.name}
      />
    </form>
  );
};

describe('Form Validation Real-time', () => {
  it('should validate email in real-time', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const emailInput = screen.getByLabelText('Email');

    // Type invalid email
    await user.type(emailInput, 'invalid-email');
    
    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument();
    });

    // Clear and type valid email
    await user.clear(emailInput);
    await user.type(emailInput, 'valid@email.com');

    await waitFor(() => {
      expect(screen.queryByText('Email inválido')).not.toBeInTheDocument();
    });
  });

  it('should validate phone format in real-time', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const phoneInput = screen.getByLabelText('Telefone');

    // Type invalid phone
    await user.type(phoneInput, '123456789');

    await waitFor(() => {
      expect(screen.getByText('Formato: (11) 99999-9999')).toBeInTheDocument();
    });

    // Clear and type valid phone
    await user.clear(phoneInput);
    await user.type(phoneInput, '(11) 99999-9999');

    await waitFor(() => {
      expect(screen.queryByText('Formato: (11) 99999-9999')).not.toBeInTheDocument();
    });
  });

  it('should only show errors after field is touched', async () => {
    render(<TestForm />);

    const nameInput = screen.getByLabelText('Nome');

    // Error should not be visible initially
    expect(screen.queryByText('Nome é obrigatório')).not.toBeInTheDocument();

    // Focus and blur without entering data
    fireEvent.focus(nameInput);
    fireEvent.blur(nameInput);

    // Now error should be visible
    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    });
  });
});
```

### 5. Accessibility Integration Test with axe-core

```typescript
// src/tests/accessibility/AccessibilityIntegration.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../pages/Login/LoginPage';
import Dashboard from '../../pages/Admin/Dashboard/Dashboard';
import PatientDashboard from '../../pages/Patient/Dashboard/PatientDashboard';
import { AuthProvider } from '../../contexts/AuthContext';
import { PatientAuthProvider } from '../../contexts/PatientAuthContext';

expect.extend(toHaveNoViolations);

describe('Accessibility Integration', () => {
  it('should have no accessibility violations on LoginPage', async () => {
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no accessibility violations on Dashboard', async () => {
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper keyboard navigation on forms', async () => {
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const emailInput = container.querySelector('input[type="email"]');
    const passwordInput = container.querySelector('input[type="password"]');
    const submitButton = container.querySelector('button[type="submit"]');

    // Check tab order
    expect(emailInput).toHaveAttribute('tabIndex', '0');
    expect(passwordInput).toHaveAttribute('tabIndex', '0');
    expect(submitButton).toHaveAttribute('tabIndex', '0');

    // Check ARIA attributes
    expect(emailInput).toHaveAttribute('aria-label');
    expect(passwordInput).toHaveAttribute('aria-label');
    expect(submitButton).toHaveAttribute('aria-label');
  });
});
```

### 6. Cypress E2E Test Example

```typescript
// cypress/e2e/authentication.cy.ts
describe('Authentication E2E Flow', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should complete login flow', () => {
    // Fill login form
    cy.get('[data-testid=email-input]').type('admin@topsmile.com');
    cy.get('[data-testid=password-input]').type('SecurePass123!');
    
    // Submit form
    cy.get('[data-testid=login-button]').click();
    
    // Should redirect to dashboard
    cy.url().should('include', '/admin');
    cy.get('[data-testid=dashboard-title]').should('contain', 'Dashboard');
    
    // Should store tokens
    cy.window().its('localStorage')
      .invoke('getItem', 'topsmile_access_token')
      .should('exist');
  });

  it('should handle login failure', () => {
    cy.get('[data-testid=email-input]').type('wrong@email.com');
    cy.get('[data-testid=password-input]').type('wrongpassword');
    cy.get('[data-testid=login-button]').click();
    
    cy.get('[data-testid=error-message]')
      .should('be.visible')
      .and('contain', 'E-mail ou senha inválidos');
  });

  it('should handle logout', () => {
    // Login first
    cy.login('admin@topsmile.com', 'SecurePass123!');
    
    // Logout
    cy.get('[data-testid=user-menu]').click();
    cy.get('[data-testid=logout-button]').click();
    
    // Should redirect to login
    cy.url().should('include', '/login');
    
    // Tokens should be cleared
    cy.window().its('localStorage')
      .invoke('getItem', 'topsmile_access_token')
      .should('not.exist');
  });
});

// cypress/e2e/patient-booking.cy.ts
describe('Patient Appointment Booking E2E', () => {
  beforeEach(() => {
    cy.patientLogin('patient@test.com', 'password123');
    cy.visit('/patient/appointments/new');
  });

  it('should book appointment successfully', () => {
    // Select provider
    cy.get('[data-testid=provider-select]').select('Dr. Smith');
    
    // Select appointment type
    cy.get('[data-testid=appointment-type-select]').select('Consultation');
    
    // Select date
    cy.get('[data-testid=date-input]').type('2024-12-01');
    
    // Wait for time slots to load and select one
    cy.get('[data-testid=time-slot-10:00]').click();
    
    // Add notes
    cy.get('[data-testid=notes-textarea]').type('First consultation');
    
    // Confirm booking
    cy.get('[data-testid=confirm-booking-button]').click();
    
    // Should show success message and redirect
    cy.get('[data-testid=success-message]')
      .should('contain', 'Consulta agendada com sucesso!');
    cy.url().should('include', '/patient/appointments');
  });
});
```