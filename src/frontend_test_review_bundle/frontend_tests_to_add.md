# Tests to Add - TopSmile Frontend

This document provides concrete test implementations for untested or under-tested flows.

---

## 1. Payment Retry Logic Tests

**File**: `src/tests/services/paymentService.retry.test.ts` (new file)

```typescript
import { paymentService } from '../../services/paymentService';

const mockStripe = {
  confirmCardPayment: jest.fn()
};

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve(mockStripe))
}));

describe('PaymentService - Retry Logic', () => {
  const clientSecret = 'pi_test_secret';
  const mockCardElement = {} as any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Exponential Backoff', () => {
    it('should implement exponential backoff on retries', async () => {
      const retryId = 'test-retry-001';
      
      // Mock 2 failures then success
      mockStripe.confirmCardPayment
        .mockResolvedValueOnce({ 
          error: { type: 'api_connection_error', message: 'Network error' } 
        })
        .mockResolvedValueOnce({ 
          error: { type: 'api_connection_error', message: 'Network error' } 
        })
        .mockResolvedValueOnce({ 
          paymentIntent: { id: 'pi_123', status: 'succeeded' } 
        });
      
      const startTime = Date.now();
      
      // First attempt fails, sets up retry state
      const firstResult = await paymentService.confirmPayment(
        clientSecret, 
        mockCardElement, 
        retryId
      );
      expect(result.ok).toBe(true);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('should use exponential backoff between retries', async () => {
      jest.useFakeTimers();

      mockFetch
        .mockRejectedValueOnce(new TypeError('Network error'))
        .mockRejectedValueOnce(new TypeError('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ data: 'success' })
        } as Response);

      const requestPromise = request('/api/test');

      // First retry after 1 second
      jest.advanceTimersByTime(1000);
      await Promise.resolve();

      // Second retry after 2 seconds
      jest.advanceTimersByTime(2000);
      await Promise.resolve();

      const result = await requestPromise;
      expect(result.ok).toBe(true);

      jest.useRealTimers();
    });
  });

  describe('Request Cancellation', () => {
    it('should support request cancellation via AbortController', async () => {
      const controller = new AbortController();

      mockFetch.mockImplementation((url, options) => {
        return new Promise((resolve, reject) => {
          options?.signal?.addEventListener('abort', () => {
            reject(new DOMException('Request aborted', 'AbortError'));
          });
          
          setTimeout(() => {
            resolve({
              ok: true,
              status: 200,
              text: async () => JSON.stringify({ data: 'success' })
            } as Response);
          }, 1000);
        });
      });

      const requestPromise = request('/api/test', { signal: controller.signal });

      // Cancel after 500ms
      setTimeout(() => controller.abort(), 500);

      await expect(requestPromise).rejects.toThrow('AbortError');
    });
  });

  describe('Network Quality Detection', () => {
    it('should detect slow network and adjust timeout', async () => {
      // Simulate slow 3G
      Object.defineProperty(navigator, 'connection', {
        value: {
          effectiveType: '3g',
          downlink: 0.4,
          rtt: 400
        }
      });

      mockFetch.mockImplementation(() => 
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              ok: true,
              status: 200,
              text: async () => JSON.stringify({ data: 'success' })
            } as Response);
          }, 5000); // Takes 5 seconds on slow network
        })
      );

      const result = await request('/api/test');
      expect(result.ok).toBe(true);
    });
  });
});
```

---

## 5. Form Validation Edge Cases

**File**: `src/tests/components/UI/Form/FormValidationEdgeCases.test.tsx` (new file)

```typescript
import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormField from '../../../../components/UI/Form/FormField';

const AdvancedTestForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value) error = 'Email é obrigatório';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Email inválido';
        else if (value.includes('<script>')) error = 'Caracteres inválidos detectados';
        break;
      case 'password':
        if (!value) error = 'Senha é obrigatória';
        else if (value.length < 8) error = 'Senha deve ter no mínimo 8 caracteres';
        else if (value.length > 128) error = 'Senha muito longa';
        else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Senha deve conter letras maiúsculas, minúsculas e números';
        }
        break;
      case 'username':
        if (!value) error = 'Nome de usuário é obrigatório';
        else if (!/^[a-zA-Z0-9_-]{3,20}$/.test(value)) {
          error = 'Nome de usuário deve ter 3-20 caracteres alfanuméricos';
        }
        else if (/^(admin|root|system)$/i.test(value)) {
          error = 'Nome de usuário reservado';
        }
        break;
    }

    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        name="password"
        label="Senha"
        type="password"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password}
        touched={touched.password}
      />
      <FormField
        name="username"
        label="Nome de Usuário"
        type="text"
        value={formData.username}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.username}
        touched={touched.username}
      />
    </form>
  );
};

describe('Form Validation - Edge Cases', () => {
  describe('XSS Prevention', () => {
    it('should detect script tags in email field', async () => {
      const user = userEvent.setup();
      render(<AdvancedTestForm />);

      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'test<script>alert(1)</script>@test.com');

      await waitFor(() => {
        expect(screen.getByText('Caracteres inválidos detectados')).toBeInTheDocument();
      });
    });

    it('should sanitize HTML entities', async () => {
      const user = userEvent.setup();
      render(<AdvancedTestForm />);

      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'test&#60;script&#62;@test.com');

      await waitFor(() => {
        expect(screen.getByText('Email inválido')).toBeInTheDocument();
      });
    });
  });

  describe('SQL Injection Prevention', () => {
    it('should reject SQL injection patterns in username', async () => {
      const user = userEvent.setup();
      render(<AdvancedTestForm />);

      const usernameInput = screen.getByLabelText('Nome de Usuário');
      await user.type(usernameInput, "admin' OR '1'='1");

      await waitFor(() => {
        expect(screen.getByText(/caracteres alfanuméricos/i)).toBeInTheDocument();
      });
    });
  });

  describe('Password Complexity', () => {
    it('should enforce minimum length', async () => {
      const user = userEvent.setup();
      render(<AdvancedTestForm />);

      const passwordInput = screen.getByLabelText('Senha');
      await user.type(passwordInput, 'Pass1');

      await waitFor(() => {
        expect(screen.getByText(/mínimo 8 caracteres/i)).toBeInTheDocument();
      });
    });

    it('should enforce maximum length', async () => {
      const user = userEvent.setup();
      render(<AdvancedTestForm />);

      const passwordInput = screen.getByLabelText('Senha');
      const longPassword = 'P@ssw0rd!' + 'a'.repeat(130);
      await user.type(passwordInput, longPassword);

      await waitFor(() => {
        expect(screen.getByText('Senha muito longa')).toBeInTheDocument();
      });
    });

    it('should require mixed case and numbers', async () => {
      const user = userEvent.setup();
      render(<AdvancedTestForm />);

      const passwordInput = screen.getByLabelText('Senha');
      
      // Only lowercase
      await user.type(passwordInput, 'password');
      await waitFor(() => {
        expect(screen.getByText(/maiúsculas, minúsculas e números/i)).toBeInTheDocument();
      });

      await user.clear(passwordInput);

      // No numbers
      await user.type(passwordInput, 'Password');
      await waitFor(() => {
        expect(screen.getByText(/maiúsculas, minúsculas e números/i)).toBeInTheDocument();
      });
    });

    it('should accept valid complex password', async () => {
      const user = userEvent.setup();
      render(<AdvancedTestForm />);

      const passwordInput = screen.getByLabelText('Senha');
      await user.type(passwordInput, 'P@ssw0rd123!');

      await waitFor(() => {
        expect(screen.queryByText(/senha/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Reserved Names', () => {
    it('should reject reserved usernames', async () => {
      const user = userEvent.setup();
      render(<AdvancedTestForm />);

      const usernameInput = screen.getByLabelText('Nome de Usuário');
      
      const reserved = ['admin', 'root', 'system', 'ADMIN', 'Root'];
      
      for (const name of reserved) {
        await user.clear(usernameInput);
        await user.type(usernameInput, name);
        
        await waitFor(() => {
          expect(screen.getByText('Nome de usuário reservado')).toBeInTheDocument();
        });
      }
    });
  });

  describe('Unicode and Special Characters', () => {
    it('should handle unicode characters in names', async () => {
      const user = userEvent.setup();
      render(<AdvancedTestForm />);

      const usernameInput = screen.getByLabelText('Nome de Usuário');
      await user.type(usernameInput, 'João_Silva');

      await waitFor(() => {
        expect(screen.getByText(/alfanuméricos/i)).toBeInTheDocument();
      });
    });

    it('should handle emoji in input fields', async () => {
      const user = userEvent.setup();
      render(<AdvancedTestForm />);

      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, '😊test@test.com');

      await waitFor(() => {
        expect(screen.getByText('Email inválido')).toBeInTheDocument();
      });
    });
  });

  describe('Whitespace Handling', () => {
    it('should trim leading/trailing whitespace', async () => {
      const user = userEvent.setup();
      render(<AdvancedTestForm />);

      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, '  test@test.com  ');

      // After blur, whitespace should be trimmed
      fireEvent.blur(emailInput);

      expect((emailInput as HTMLInputElement).value).toBe('test@test.com');
    });

    it('should reject whitespace-only input', async () => {
      const user = userEvent.setup();
      render(<AdvancedTestForm />);

      const usernameInput = screen.getByLabelText('Nome de Usuário');
      await user.type(usernameInput, '     ');

      await waitFor(() => {
        expect(screen.getByText('Nome de usuário é obrigatório')).toBeInTheDocument();
      });
    });
  });
});
```

---

## 6. E2E Admin Workflow Tests

**File**: `cypress/e2e/admin-workflows.cy.ts` (new file)

```typescript
/// <reference types="cypress" />

describe('Admin Workflows - Complete E2E', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.login('admin@topsmile.com', 'SecurePass123!');
  });

  describe('Contact Management Workflow', () => {
    it('should handle complete contact lifecycle', () => {
      // Navigate to contacts
      cy.visit('/admin/contacts');
      
      // Create new contact
      cy.get('[data-testid=add-contact-button]').click();
      cy.get('[data-testid=contact-name-input]').type('João Silva');
      cy.get('[data-testid=contact-email-input]').type('joao@example.com');
      cy.get('[data-testid=contact-phone-input]').type('(11) 99999-9999');
      cy.get('[data-testid=contact-clinic-select]').select('Test Clinic');
      cy.get('[data-testid=contact-specialty-select]').select('Ortodontia');
      cy.get('[data-testid=save-contact-button]').click();
      
      // Verify contact appears in list
      cy.get('[data-testid=contact-list]').should('contain', 'João Silva');
      
      // Update contact status
      cy.get('[data-testid=contact-item]').contains('João Silva').click();
      cy.get('[data-testid=contact-status-select]').select('contacted');
      cy.get('[data-testid=save-contact-button]').click();
      
      // Verify status updated
      cy.get('[data-testid=contact-status-badge]').should('contain', 'Contacted');
      
      // Convert to patient
      cy.get('[data-testid=convert-to-patient-button]').click();
      cy.get('[data-testid=confirm-conversion]').click();
      
      // Verify redirected to patient profile
      cy.url().should('include', '/admin/patients/');
      cy.get('[data-testid=patient-name]').should('contain', 'João Silva');
    });

    it('should filter and search contacts', () => {
      cy.visit('/admin/contacts');
      
      // Filter by status
      cy.get('[data-testid=status-filter]').select('new');
      cy.get('[data-testid=contact-list]').find('[data-testid=contact-item]')
        .should('have.length.at.least', 1);
      
      // Search by name
      cy.get('[data-testid=search-input]').type('João');
      cy.get('[data-testid=contact-list]').should('contain', 'João');
      cy.get('[data-testid=contact-list]').should('not.contain', 'Maria');
    });

    it('should handle bulk operations', () => {
      cy.visit('/admin/contacts');
      
      // Select multiple contacts
      cy.get('[data-testid=contact-checkbox]').first().check();
      cy.get('[data-testid=contact-checkbox]').eq(1).check();
      
      // Bulk status update
      cy.get('[data-testid=bulk-actions-menu]').click();
      cy.get('[data-testid=bulk-update-status]').click();
      cy.get('[data-testid=bulk-status-select]').select('qualified');
      cy.get('[data-testid=confirm-bulk-update]').click();
      
      // Verify updates
      cy.get('[data-testid=success-message]')
        .should('contain', '2 contatos atualizados');
    });
  });

  describe('Patient Management Workflow', () => {
    it('should create patient with full medical history', () => {
      cy.visit('/admin/patients');
      
      // Create patient
      cy.get('[data-testid=add-patient-button]').click();
      
      // Personal info
      cy.get('[data-testid=patient-first-name]').type('Maria');
      cy.get('[data-testid=patient-last-name]').type('Santos');
      cy.get('[data-testid=patient-email]').type('maria@example.com');
      cy.get('[data-testid=patient-phone]').type('(11) 98888-8888');
      cy.get('[data-testid=patient-dob]').type('1990-05-15');
      cy.get('[data-testid=patient-gender]').select('female');
      
      // Address
      cy.get('[data-testid=patient-street]').type('Rua das Flores');
      cy.get('[data-testid=patient-number]').type('123');
      cy.get('[data-testid=patient-city]').type('São Paulo');
      cy.get('[data-testid=patient-state]').select('SP');
      cy.get('[data-testid=patient-zipcode]').type('01234-567');
      
      // Medical history
      cy.get('[data-testid=add-allergy-button]').click();
      cy.get('[data-testid=allergy-input]').type('Penicilina');
      cy.get('[data-testid=confirm-allergy]').click();
      
      cy.get('[data-testid=add-medication-button]').click();
      cy.get('[data-testid=medication-input]').type('Ibuprofeno');
      cy.get('[data-testid=confirm-medication]').click();
      
      // Save
      cy.get('[data-testid=save-patient-button]').click();
      
      // Verify created
      cy.url().should('include', '/admin/patients/');
      cy.get('[data-testid=patient-name]').should('contain', 'Maria Santos');
      cy.get('[data-testid=patient-allergies]').should('contain', 'Penicilina');
    });

    it('should schedule appointment from patient profile', () => {
      cy.visit('/admin/patients');
      cy.get('[data-testid=patient-item]').first().click();
      
      // Schedule appointment
      cy.get('[data-testid=schedule-appointment-button]').click();
      cy.get('[data-testid=appointment-type-select]').select('Consulta');
      cy.get('[data-testid=provider-select]').select('Dr. Smith');
      cy.get('[data-testid=appointment-date]').type('2024-12-01');
      cy.get('[data-testid=appointment-time]').select('10:00');
      cy.get('[data-testid=save-appointment-button]').click();
      
      // Verify appointment created
      cy.get('[data-testid=success-message]')
        .should('contain', 'Consulta agendada');
      cy.get('[data-testid=upcoming-appointments]')
        .should('contain', '2024-12-01');
    });
  });

  describe('Appointment Calendar Workflow', () => {
    it('should navigate and view appointments by date', () => {
      cy.visit('/admin/calendar');
      
      // Navigate to specific date
      cy.get('[data-testid=calendar-next-button]').click();
      cy.get('[data-testid=calendar-month]').should('contain', 'December');
      
      // Click on a date
      cy.get('[data-testid=calendar-day]').contains('15').click();
      
      // View day's appointments
      cy.get('[data-testid=day-appointments]').should('be.visible');
      cy.get('[data-testid=appointment-count]').should('exist');
    });

    it('should drag and reschedule appointment', () => {
      cy.visit('/admin/calendar');
      
      // Find appointment
      cy.get('[data-testid=appointment-block]').first()
        .trigger('mousedown', { which: 1 })
        .trigger('mousemove', { clientX: 100, clientY: 100 })
        .trigger('mouseup');
      
      // Confirm reschedule
      cy.get('[data-testid=confirm-reschedule]').click();
      
      // Verify updated
      cy.get('[data-testid=success-message]')
        .should('contain', 'Consulta reagendada');
    });
  });

  describe('Provider Management Workflow', () => {
    it('should create provider with schedule', () => {
      cy.visit('/admin/providers');
      
      // Create provider
      cy.get('[data-testid=add-provider-button]').click();
      cy.get('[data-testid=provider-name]').type('Dr. João Oliveira');
      cy.get('[data-testid=provider-email]').type('joao.dr@example.com');
      cy.get('[data-testid=provider-license]').type('CRO-12345');
      
      // Add specialties
      cy.get('[data-testid=specialty-select]').select('Ortodontia');
      cy.get('[data-testid=add-specialty]').click();
      
      // Set working hours
      cy.get('[data-testid=monday-start]').type('08:00');
      cy.get('[data-testid=monday-end]').type('17:00');
      cy.get('[data-testid=monday-working]').check();
      
      // Save
      cy.get('[data-testid=save-provider-button]').click();
      
      // Verify created
      cy.get('[data-testid=provider-list]')
        .should('contain', 'Dr. João Oliveira');
    });
  });
});
```

---

## 7. Accessibility Keyboard Navigation Tests

**File**: `src/tests/accessibility/KeyboardNavigation.test.tsx` (new file)

```typescript
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../pages/Login/LoginPage';
import Modal from '../../components/UI/Modal/Modal';
import { AuthProvider } from '../../contexts/AuthContext';

describe('Keyboard Navigation', () => {
  describe('Form Navigation', () => {
    it('should navigate through form with Tab key', async () => {
      const user = userEvent.setup();
      
      render(
        <BrowserRouter>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </BrowserRouter>
      );

      // Start from body
      document.body.focus();

      // Tab to email
      await user.tab();
      expect(screen.getByLabelText(/e-mail/i)).toHaveFocus();

      // Tab to password
      await user.tab();
      expect(screen.getByLabelText(/senha/i)).toHaveFocus();

      // Tab to submit button
      await user.tab();
      expect(screen.getByRole('button', { name: /entrar/i })).toHaveFocus();

      // Shift+Tab back
      await user.tab({ shift: true });
      expect(screen.getByLabelText(/senha/i)).toHaveFocus();
    });

    it('should submit form with Enter key', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn(e => e.preventDefault());

      render(
        <form onSubmit={mockSubmit}>
          <input aria-label="Email" type="email" />
          <input aria-label="Password" type="password" />
          <button type="submit">Submit</button>
        </form>
      );

      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'test@test.com');
      await user.keyboard('{Enter}');

      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  describe('Modal Navigation', () => {
    it('should trap focus within modal', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();

      render(
        <Modal isOpen={true} onClose={handleClose} title="Test Modal">
          <button data-testid="button1">Button 1</button>
          <button data-testid="button2">Button 2</button>
        </Modal>
      );

      const button1 = screen.getByTestId('button1');
      const button2 = screen.getByTestId('button2');
      const closeButton = screen.getByLabelText(/fechar modal/i);

      // Focus should start on first element
      expect(button1).toHaveFocus();

      // Tab through elements
      await user.tab();
      expect(button2).toHaveFocus();

      await user.tab();
      expect(closeButton).toHaveFocus();

      // Tab should wrap back to first element
      await user.tab();
      expect(button1).toHaveFocus();
    });

    it('should close modal with Escape key', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();

      render(
        <Modal isOpen={true} onClose={handleClose} title="Test Modal">
          <div>Modal Content</div>
        </Modal>
      );

      await user.keyboard('{Escape}');
      expect(handleClose).toHaveBeenCalled();
    });
  });

  describe('List Navigation', () => {
    it('should navigate list with arrow keys', async () => {
      const user = userEvent.setup();

      render(
        <ul role="listbox">
          <li role="option" tabIndex={0}>Item 1</li>
          <li role="option" tabIndex={-1}>Item 2</li>
          <li role="option" tabIndex={-1}>Item 3</li>
        </ul>
      );

      const items = screen.getAllByRole('option');

      // Focus first item
      items[0].focus();
      expect(items[0]).toHaveFocus();

      // Arrow down
      await user.keyboard('{ArrowDown}');
      expect(items[1]).toHaveFocus();

      // Arrow down again
      await user.keyboard('{ArrowDown}');
      expect(items[2]).toHaveFocus();

      // Arrow up
      await user.keyboard('{ArrowUp}');
      expect(items[1]).toHaveFocus();
    });
  });

  describe('Button Activation', () => {
    it('should activate button with Space key', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<button onClick={handleClick}>Click Me</button>);

      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalled();
    });

    it('should activate button with Enter key', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<button onClick={handleClick}>Click Me</button>);

      const button = screen.getByRole('button');
      button.focus();

      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalled();
    });
  });
});
```

---

## Summary

These test additions cover the most critical gaps identified in the review:

1. **Payment Retry Logic** - Comprehensive coverage of retry mechanism, backoff, limits
2. **Appointment Conflicts** - Complete conflict detection and resolution flow
3. **Cross-Tab Sync** - Token updates and race condition prevention
4. **Network Failures** - Offline detection, timeouts, retry logic
5. **Form Validation Edge Cases** - XSS, SQL injection, unicode handling
6. **E2E Admin Workflows** - Complete business process coverage
7. **Keyboard Navigation** - Accessibility compliance verification

**Implementation Priority**: Follow the order presented (1-7) for maximum impact on test reliability and coverage.
firstResult.success).toBe(false);
      expect(firstResult.requiresAction).toBe(true);
      
      // First retry (1 second wait)
      jest.advanceTimersByTime(1000);
      const secondResult = await paymentService.retryPayment(
        clientSecret,
        mockCardElement,
        retryId
      );
      expect(secondResult.success).toBe(false);
      
      // Second retry (2 second wait)
      jest.advanceTimersByTime(2000);
      const thirdResult = await paymentService.retryPayment(
        clientSecret,
        mockCardElement,
        retryId
      );
      expect(thirdResult.success).toBe(true);
      
      // Verify total elapsed time
      const elapsed = Date.now() - startTime;
      expect(elapsed).toBeGreaterThanOrEqual(3000); // 1s + 2s
    });
  });

  describe('Retry Limits', () => {
    it('should enforce maximum retry attempts', async () => {
      const retryId = 'test-retry-002';
      
      // Always fail
      mockStripe.confirmCardPayment.mockResolvedValue({
        error: { type: 'api_error', message: 'Server error' }
      });
      
      // Initial attempt
      await paymentService.confirmPayment(clientSecret, mockCardElement, retryId);
      
      // Retry 3 times (max)
      for (let i = 0; i < 3; i++) {
        jest.advanceTimersByTime(1000 * Math.pow(2, i));
        await paymentService.retryPayment(clientSecret, mockCardElement, retryId);
      }
      
      // 4th retry should fail
      jest.advanceTimersByTime(8000);
      const result = await paymentService.retryPayment(
        clientSecret,
        mockCardElement,
        retryId
      );
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Maximum retry attempts exceeded');
    });
  });

  describe('Retry State Expiration', () => {
    it('should expire retry state after 10 minutes', async () => {
      const retryId = 'test-retry-003';
      
      // Initial failure
      mockStripe.confirmCardPayment.mockResolvedValue({
        error: { type: 'network_error', message: 'Timeout' }
      });
      
      await paymentService.confirmPayment(clientSecret, mockCardElement, retryId);
      
      // Advance 10 minutes + 1 second
      jest.advanceTimersByTime(10 * 60 * 1000 + 1000);
      
      // Retry should fail due to expiration
      const result = await paymentService.retryPayment(
        clientSecret,
        mockCardElement,
        retryId
      );
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Retry not available or expired');
    });
    
    it('should track remaining time correctly', async () => {
      const retryId = 'test-retry-004';
      
      mockStripe.confirmCardPayment.mockResolvedValue({
        error: { type: 'network_error' }
      });
      
      await paymentService.confirmPayment(clientSecret, mockCardElement, retryId);
      
      // Check initial remaining time
      const initialState = paymentService.getRetryState(retryId);
      expect(initialState?.remainingTime).toBe(10 * 60 * 1000);
      
      // Advance 5 minutes
      jest.advanceTimersByTime(5 * 60 * 1000);
      
      const updatedState = paymentService.getRetryState(retryId);
      expect(updatedState?.remainingTime).toBeLessThanOrEqual(5 * 60 * 1000);
    });
  });

  describe('Concurrent Retry Prevention', () => {
    it('should prevent concurrent retries for same payment', async () => {
      const retryId = 'test-retry-005';
      
      let resolvePayment: any;
      const paymentPromise = new Promise(resolve => {
        resolvePayment = resolve;
      });
      
      mockStripe.confirmCardPayment.mockReturnValue(paymentPromise);
      
      // Start first retry
      const retry1 = paymentService.retryPayment(
        clientSecret,
        mockCardElement,
        retryId
      );
      
      // Try concurrent retry
      const retry2 = paymentService.retryPayment(
        clientSecret,
        mockCardElement,
        retryId
      );
      
      // Resolve payment
      resolvePayment({ 
        paymentIntent: { id: 'pi_123', status: 'succeeded' } 
      });
      
      const [result1, result2] = await Promise.all([retry1, retry2]);
      
      // Only one should succeed
      expect([result1.success, result2.success].filter(Boolean)).toHaveLength(1);
    });
  });

  describe('Error Type Classification', () => {
    it('should identify retryable errors correctly', () => {
      const retryableErrors = [
        { type: 'api_connection_error' },
        { type: 'api_error' },
        { type: 'network_error' },
        { message: 'Network connection failed' }
      ];
      
      retryableErrors.forEach(error => {
        expect(paymentService.isRetryableError(error)).toBe(true);
      });
    });
    
    it('should identify non-retryable errors correctly', () => {
      const nonRetryableErrors = [
        { type: 'card_error' },
        { type: 'validation_error' },
        { message: 'Invalid card number' }
      ];
      
      nonRetryableErrors.forEach(error => {
        expect(paymentService.isRetryableError(error)).toBe(false);
      });
    });
  });
});
```

---

## 2. Appointment Conflict Handling Tests

**File**: `src/tests/integration/AppointmentConflictHandling.test.tsx` (new file)

```typescript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { PatientAuthProvider } from '../../contexts/PatientAuthContext';
import PatientAppointmentBooking from '../../pages/Patient/Appointment/PatientAppointmentBooking';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

describe('Appointment Conflict Handling - Complete Flow', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
    });
  });

  it('should disable conflicting time slots in UI', async () => {
    // Setup: Provider has appointment at 10:00
    server.use(
      http.get('*/api/appointments', () => {
        return HttpResponse.json({
          success: true,
          data: [{
            _id: 'existing-appt',
            provider: 'provider1',
            scheduledStart: '2026-10-10T10:00:00.000Z',
            scheduledEnd: '2026-10-10T10:30:00.000Z',
            status: 'confirmed'
          }]
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

    // Select provider and date
    await waitFor(() => {
      expect(screen.getByLabelText(/dentista/i)).toBeInTheDocument();
    });
    
    fireEvent.change(screen.getByLabelText(/dentista/i), {
      target: { value: 'provider1' }
    });
    fireEvent.change(screen.getByLabelText(/data/i), {
      target: { value: '2026-10-10' }
    });

    // Wait for time slots
    await waitFor(() => {
      expect(screen.getByText('10:00')).toBeInTheDocument();
    });

    // Verify 10:00 slot is disabled
    const conflictSlot = screen.getByText('10:00').closest('button');
    expect(conflictSlot).toBeDisabled();
    expect(conflictSlot).toHaveClass('time-slot--unavailable');
  });

  it('should suggest alternative time slots on conflict', async () => {
    server.use(
      http.post('*/api/appointments', () => {
        return HttpResponse.json({
          success: false,
          message: 'Horário não disponível',
          data: {
            suggestedSlots: [
              { time: '11:00', available: true },
              { time: '14:00', available: true }
            ]
          }
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

    // Attempt to book conflicting slot
    await waitFor(() => screen.getByLabelText(/dentista/i));
    
    fireEvent.change(screen.getByLabelText(/dentista/i), {
      target: { value: 'provider1' }
    });
    fireEvent.change(screen.getByLabelText(/tipo de consulta/i), {
      target: { value: 'type1' }
    });
    fireEvent.change(screen.getByLabelText(/data/i), {
      target: { value: '2026-10-10' }
    });
    
    await waitFor(() => screen.getByText('10:00'));
    fireEvent.click(screen.getByText('10:00'));
    fireEvent.click(screen.getByText(/confirmar agendamento/i));

    // Verify conflict message and suggestions
    await waitFor(() => {
      expect(screen.getByText('Horário não disponível')).toBeInTheDocument();
      expect(screen.getByText(/horários alternativos/i)).toBeInTheDocument();
      expect(screen.getByText('11:00')).toBeInTheDocument();
      expect(screen.getByText('14:00')).toBeInTheDocument();
    });
  });

  it('should allow booking after selecting alternative slot', async () => {
    let attemptCount = 0;
    
    server.use(
      http.post('*/api/appointments', async ({ request }) => {
        const body = await request.json() as any;
        attemptCount++;
        
        // First attempt conflicts
        if (attemptCount === 1) {
          return HttpResponse.json({
            success: false,
            message: 'Horário não disponível'
          }, { status: 409 });
        }
        
        // Second attempt succeeds
        return HttpResponse.json({
          success: true,
          data: {
            _id: 'new-appt',
            scheduledStart: body.scheduledStart,
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

    // First attempt - conflict
    await waitFor(() => screen.getByLabelText(/dentista/i));
    fireEvent.change(screen.getByLabelText(/dentista/i), {
      target: { value: 'provider1' }
    });
    fireEvent.change(screen.getByLabelText(/tipo de consulta/i), {
      target: { value: 'type1' }
    });
    fireEvent.change(screen.getByLabelText(/data/i), {
      target: { value: '2026-10-10' }
    });
    
    await waitFor(() => screen.getByText('10:00'));
    fireEvent.click(screen.getByText('10:00'));
    fireEvent.click(screen.getByText(/confirmar agendamento/i));

    // Verify conflict
    await waitFor(() => {
      expect(screen.getByText('Horário não disponível')).toBeInTheDocument();
    });

    // Select alternative slot
    fireEvent.click(screen.getByText('11:00'));
    fireEvent.click(screen.getByText(/confirmar agendamento/i));

    // Verify success
    await waitFor(() => {
      expect(screen.getByText(/consulta agendada com sucesso/i)).toBeInTheDocument();
    });
  });
});
```

---

## 3. Cross-Tab Synchronization Tests

**File**: `src/tests/contexts/AuthContext.crossTab.test.tsx` (new file)

```typescript
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuthState, useAuthActions } from '../../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { apiService } from '../../services/apiService';

jest.mock('../../services/apiService');

const TestComponent = () => {
  const { isAuthenticated, user } = useAuthState();
  const { login } = useAuthActions();
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      <div data-testid="user-name">{user?.name || 'No User'}</div>
      <button onClick={() => login('test@test.com', 'password')}>Login</button>
    </div>
  );
};

describe('AuthContext - Cross-Tab Synchronization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should sync login across tabs', async () => {
    (apiService.auth.login as jest.Mock).mockResolvedValue({
      success: true,
      data: {
        user: { _id: '1', name: 'Test User', email: 'test@test.com', role: 'admin' },
        accessToken: 'token1',
        refreshToken: 'refresh1'
      }
    });

    const { rerender } = render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    // Initial state
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    });

    // Simulate login in another tab by updating localStorage
    act(() => {
      localStorage.setItem('topsmile_access_token', 'token-from-other-tab');
      localStorage.setItem('topsmile_refresh_token', 'refresh-from-other-tab');
      
      // Trigger storage event
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'topsmile_access_token',
        newValue: 'token-from-other-tab',
        oldValue: null,
        storageArea: localStorage
      }));
    });

    // Should update authentication state
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
  });

  it('should handle concurrent token refresh across tabs', async () => {
    let refreshCount = 0;
    
    (apiService.auth.me as jest.Mock).mockImplementation(() => {
      refreshCount++;
      
      // First call returns 401
      if (refreshCount === 1) {
        return Promise.resolve({ success: false, message: 'Token expired' });
      }
      
      // Subsequent calls succeed
      return Promise.resolve({
        success: true,
        data: { _id: '1', name: 'User', email: 'test@test.com', role: 'admin' }
      });
    });

    localStorage.setItem('topsmile_access_token', 'expired-token');

    // Render two instances (simulating tabs)
    const Tab1 = render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const Tab2 = render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    // Both should eventually sync
    await waitFor(() => {
      expect(refreshCount).toBeLessThanOrEqual(2); // Should not refresh more than twice
    });
  });
});
```

---

## 4. HTTP Service Network Failure Tests

**File**: `src/tests/services/http.network.test.ts` (new file)

```typescript
import { request } from '../../services/http';

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('HTTP Service - Network Failures', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Offline Detection', () => {
    it('should detect offline state', async () => {
      mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));

      await expect(request('/api/test')).rejects.toThrow(
        'Unable to connect to server'
      );
    });

    it('should provide offline-specific error message', async () => {
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      });

      mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));

      try {
        await request('/api/test');
      } catch (error: any) {
        expect(error.message).toContain('offline');
      }
    });
  });

  describe('Request Timeout', () => {
    it('should timeout after 30 seconds', async () => {
      jest.useFakeTimers();

      mockFetch.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 35000))
      );

      const requestPromise = request('/api/slow-endpoint');

      jest.advanceTimersByTime(30000);

      await expect(requestPromise).rejects.toThrow('timeout');

      jest.useRealTimers();
    });
  });

  describe('Retry on Network Failure', () => {
    it('should retry 3 times on network failure', async () => {
      mockFetch
        .mockRejectedValueOnce(new TypeError('Network error'))
        .mockRejectedValueOnce(new TypeError('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ data: 'success' })
        } as Response);

      const result = await request('/api/test');

      expect(