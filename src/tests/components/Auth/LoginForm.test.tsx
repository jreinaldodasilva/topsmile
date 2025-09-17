import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AuthStateContext, AuthActionsContext, AuthStateContextType, AuthActionsContextType } from '../../../contexts/AuthContext';
import LoginForm from '../../../components/Auth/LoginForm/LoginForm';
import { BrowserRouter } from 'react-router-dom';

const mockLogin = jest.fn();
const mockClearError = jest.fn();

const renderLoginForm = (stateValue: Partial<AuthStateContextType> = {}, actionsValue: Partial<AuthActionsContextType> = {}) => {
  return render(
    <BrowserRouter>
      <AuthStateContext.Provider value={{ isAuthenticated: false, user: null, loading: false, error: null, ...stateValue }}>
        <AuthActionsContext.Provider value={{ login: mockLogin, clearError: mockClearError, logout: jest.fn(), register: jest.fn(), refreshUserData: jest.fn(), ...actionsValue }}>
          <LoginForm />
        </AuthActionsContext.Provider>
      </AuthStateContext.Provider>
    </BrowserRouter>
  );
};

describe('LoginForm', () => {
  beforeEach(() => {
    mockLogin.mockClear();
    mockClearError.mockClear();
  });

  it('renders email and password fields', () => {
    renderLoginForm({});
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('allows typing in fields', () => {
    renderLoginForm({});
    const emailInput = screen.getByLabelText('E-mail') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password');
  });

  it('toggles password visibility', () => {
    renderLoginForm({});
    const passwordInput = screen.getByLabelText('Senha') as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: /🙈/i });

    expect(passwordInput.type).toBe('password');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('calls login on form submission', () => {
    renderLoginForm({});
    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: 'Entrar' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });
    fireEvent.click(submitButton);

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('displays an error message', () => {
    renderLoginForm({ error: 'Invalid credentials' });
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('disables form when loading', () => {
    renderLoginForm({ loading: true });
    expect(screen.getByLabelText('E-mail')).toBeDisabled();
    expect(screen.getByLabelText('Senha')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Entrando...' })).toBeDisabled();
  });

  it('clears error on unmount', () => {
    const { unmount } = renderLoginForm({});
    unmount();
    expect(mockClearError).toHaveBeenCalledTimes(1);
  });
});
