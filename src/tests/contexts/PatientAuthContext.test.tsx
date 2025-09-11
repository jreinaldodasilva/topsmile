import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { PatientAuthProvider, usePatientAuth } from '../../contexts/PatientAuthContext';
import { BrowserRouter } from 'react-router-dom';

describe('PatientAuthContext', () => {
  const TestComponent = () => {
    const { login, logout, isAuthenticated, loading, error } = usePatientAuth();

    return (
      <div>
        <div data-testid="auth-status">
          {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
        </div>
        <div data-testid="loading-status">
          {loading ? 'Loading' : 'Not Loading'}
        </div>
        <div data-testid="error-message">
          {error || 'No Error'}
        </div>
        <button onClick={() => login('patient@example.com', 'password')}>
          Login
        </button>
        <button onClick={() => logout()}>
          Logout
        </button>
      </div>
    );
  };

  const setup = () => {
    render(
      <BrowserRouter>
        <PatientAuthProvider>
          <TestComponent />
        </PatientAuthProvider>
      </BrowserRouter>
    );
  };

  it('provides patient authentication context to children', () => {
    setup();
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('error-message')).toHaveTextContent('No Error');
  });

  it('renders login and logout buttons', () => {
    setup();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  it('handles patient login process', async () => {
    setup();

    const loginButton = screen.getByRole('button', { name: /Login/i });
    loginButton.click();

    // Check if loading state is set
    await waitFor(() => {
      expect(screen.getByTestId('loading-status')).toHaveTextContent('Loading');
    });
  });
});
