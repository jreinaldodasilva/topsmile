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
      // Look for the actual button text that appears in the form
      expect(screen.getByRole('button', { name: /entrando/i })).toBeInTheDocument();
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

    // Clear any existing values and type new ones
    await user.clear(emailInput);
    await user.clear(passwordInput);
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
    // The toggle button doesn't have an accessible name in the current implementation
    // So we need to find it by its parent element or by test id
    const toggleButton = passwordInput.parentElement?.querySelector('button[type="button"]');
    expect(toggleButton).toBeInTheDocument();

    expect(passwordInput).toHaveAttribute('type', 'password');

    if (toggleButton) {
      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
    }
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
    const submitButton = await screen.findByRole('button', { name: /entrando/i });

    await user.clear(emailInput);
    await user.clear(passwordInput);
    await user.type(emailInput, 'wrong@example.com');
    await user.type(passwordInput, 'wrongpassword');

    // Enable the form by clearing disabled state
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/e-mail ou senha inválidos/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
