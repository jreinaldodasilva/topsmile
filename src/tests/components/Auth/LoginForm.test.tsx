import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../../../components/Auth/LoginForm/LoginForm';
import { AuthProvider } from '../../../contexts/AuthContext';

// Mock the auth context
const mockLogin = jest.fn();
const mockClearError = jest.fn();

jest.mock('../../../contexts/AuthContext', () => ({
  useAuthState: () => ({
    loading: false,
    error: null,
    user: null,
    isAuthenticated: false
  }),
  useAuthActions: () => ({
    login: mockLogin,
    clearError: mockClearError
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderLoginForm = () => {
    return render(
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    );
  };

  describe('Rendering', () => {
    it('should render all form elements', () => {
      renderLoginForm();

      expect(screen.getByText('TopSmile Admin')).toBeInTheDocument();
      expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
      expect(screen.getByText(/primeira vez no topsmile/i)).toBeInTheDocument();
    });

    it('should render password toggle button', () => {
      renderLoginForm();

      const passwordToggle = screen.getByRole('button', { name: /🙈/ });
      expect(passwordToggle).toBeInTheDocument();
    });

    it('should render register link', () => {
      renderLoginForm();

      const registerLink = screen.getByRole('link', { name: /criar conta/i });
      expect(registerLink).toBeInTheDocument();
      expect(registerLink).toHaveAttribute('href', '/register');
    });
  });

  describe('Form Interaction', () => {
    it('should update email input value', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/e-mail/i);
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should update password input value', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const passwordInput = screen.getByLabelText(/senha/i);
      await user.type(passwordInput, 'password123');

      expect(passwordInput).toHaveValue('password123');
    });

    it('should toggle password visibility', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const passwordInput = screen.getByLabelText(/senha/i);
      const toggleButton = screen.getByRole('button', { name: /🙈/ });

      expect(passwordInput).toHaveAttribute('type', 'password');

      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(screen.getByRole('button', { name: /👁️/ })).toBeInTheDocument();

      await user.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should call login function on form submission', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.click(submitButton);

      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should prevent form submission with empty fields', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const submitButton = screen.getByRole('button', { name: /entrar/i });
      await user.click(submitButton);

      // HTML5 validation should prevent submission
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should show loading state when submitting', () => {
      // Mock loading state
      jest.doMock('../../../contexts/AuthContext', () => ({
        useAuthState: () => ({
          loading: true,
          error: null,
          user: null,
          isAuthenticated: false
        }),
        useAuthActions: () => ({
          login: mockLogin,
          clearError: mockClearError
        }),
        AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
      }));

      renderLoginForm();

      expect(screen.getByText('Entrando...')).toBeInTheDocument();
      expect(screen.getByLabelText(/e-mail/i)).toBeDisabled();
      expect(screen.getByLabelText(/senha/i)).toBeDisabled();
      expect(screen.getByRole('button', { name: /entrando/i })).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when login fails', () => {
      // Mock error state
      jest.doMock('../../../contexts/AuthContext', () => ({
        useAuthState: () => ({
          loading: false,
          error: 'Credenciais inválidas',
          user: null,
          isAuthenticated: false
        }),
        useAuthActions: () => ({
          login: mockLogin,
          clearError: mockClearError
        }),
        AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
      }));

      renderLoginForm();

      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument();
    });

    it('should clear error on component unmount', () => {
      const { unmount } = renderLoginForm();

      unmount();

      expect(mockClearError).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);

      expect(emailInput).toHaveAttribute('id', 'email');
      expect(passwordInput).toHaveAttribute('id', 'password');
    });

    it('should have proper input types', () => {
      renderLoginForm();

      expect(screen.getByLabelText(/e-mail/i)).toHaveAttribute('type', 'email');
      expect(screen.getByLabelText(/senha/i)).toHaveAttribute('type', 'password');
    });

    it('should have required attributes', () => {
      renderLoginForm();

      expect(screen.getByLabelText(/e-mail/i)).toBeRequired();
      expect(screen.getByLabelText(/senha/i)).toBeRequired();
    });

    it('should have proper placeholders', () => {
      renderLoginForm();

      expect(screen.getByLabelText(/e-mail/i)).toHaveAttribute('placeholder', 'seu@email.com');
      expect(screen.getByLabelText(/senha/i)).toHaveAttribute('placeholder', 'Sua senha');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support tab navigation', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const toggleButton = screen.getByRole('button', { name: /🙈/ });
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.tab();
      expect(emailInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(toggleButton).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });

    it('should submit form on Enter key', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');
      await user.keyboard('{Enter}');

      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long email addresses', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const longEmail = 'a'.repeat(100) + '@example.com';
      const emailInput = screen.getByLabelText(/e-mail/i);

      await user.type(emailInput, longEmail);
      expect(emailInput).toHaveValue(longEmail);
    });

    it('should handle special characters in password', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const specialPassword = 'P@ssw0rd!#$%';
      const passwordInput = screen.getByLabelText(/senha/i);

      await user.type(passwordInput, specialPassword);
      expect(passwordInput).toHaveValue(specialPassword);
    });

    it('should handle rapid form submissions', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);
      const submitButton = screen.getByRole('button', { name: /entrar/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      // Rapid clicks
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      // Should only call login once due to loading state
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Validation', () => {
    it('should show browser validation for invalid email', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/e-mail/i);
      const passwordInput = screen.getByLabelText(/senha/i);

      await user.type(emailInput, 'invalid-email');
      await user.type(passwordInput, 'password123');

      // Try to submit
      fireEvent.submit(screen.getByRole('form'));

      // Browser validation should prevent submission
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it('should handle paste operations', async () => {
      const user = userEvent.setup();
      renderLoginForm();

      const emailInput = screen.getByLabelText(/e-mail/i);

      await user.click(emailInput);
      await user.paste('pasted@example.com');

      expect(emailInput).toHaveValue('pasted@example.com');
    });
  });
});