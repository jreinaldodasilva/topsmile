import React from 'react';
import { render, screen } from '@testing-library/react';
import RegisterPage from '../../pages/Login/RegisterPage';
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

describe('RegisterPage', () => {
  it('renders registration form fields', async () => {
    render(
      <TestWrapper>
        <RegisterPage />
      </TestWrapper>
    );

    // Check that form fields are rendered
    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nome da clínica/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/telefone/i)).toBeInTheDocument();

    // The button shows "Criando conta..." when loading/disabled
    expect(screen.getByRole('button', { name: /criando conta/i })).toBeInTheDocument();
  });
});
