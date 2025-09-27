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
