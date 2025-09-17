import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../../pages/Login/LoginPage';
import { useAuthActions, useAuthState } from '../../contexts/AuthContext';
import { render, screen } from '../utils/test-utils';

// Mock the AuthContext hooks
jest.mock('../../contexts/AuthContext', () => ({
  useAuthState: jest.fn(),
  useAuthActions: jest.fn(),
}));

describe('LoginPage', () => {
  const mockLogin = jest.fn();
  const mockClearError = jest.fn();

  beforeEach(() => {
    (useAuthState as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      isAuthenticated: false,
    });
    (useAuthActions as jest.Mock).mockReturnValue({
      login: mockLogin,
      clearError: mockClearError,
    });
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
  });

  it('allows user to type email and password', () => {
    render(<LoginPage />);
    const emailInput = screen.getByLabelText(/E-mail/i);
    const passwordInput = screen.getByLabelText(/Senha/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('toggles password visibility', () => {
    render(<LoginPage />);
    const passwordInput = screen.getByLabelText(/Senha/i);
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });

    // Initially password type is password
    expect(passwordInput).toHaveAttribute('type', 'password');

    fireEvent.click(toggleButton);

    // After click, type should be text
    expect(passwordInput).toHaveAttribute('type', 'text');

    fireEvent.click(toggleButton);

    // After second click, type should be password again
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('shows error message on login failure', async () => {
    (useAuthState as jest.Mock).mockReturnValue({
      loading: false,
      error: 'Invalid credentials',
      isAuthenticated: false,
    });

    render(<LoginPage />);

    const emailInput = screen.getByLabelText(/E-mail/i);
    const passwordInput = screen.getByLabelText(/Senha/i);
    const submitButton = screen.getByRole('button', { name: /Entrar/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('wrong@test.com', 'wrong');
    });

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
