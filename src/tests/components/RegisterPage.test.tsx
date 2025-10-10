import React from 'react';
import { fireEvent } from '@testing-library/react';
import RegisterPage from '../../pages/Login/RegisterPage';
import { render, screen } from '../utils/test-utils';
import type { User } from '@topsmile/types';

describe('RegisterPage', () => {
    it('renders registration form fields', () => {
        render(<RegisterPage />);
        expect(screen.getByLabelText(/Nome Completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Senha/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirmar Senha/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Criar Conta/i })).toBeInTheDocument();
    });

    it('allows user to type in form fields', () => {
        render(<RegisterPage />);
        const nameInput = screen.getByLabelText(/Nome Completo/i);
        const emailInput = screen.getByLabelText(/E-mail/i);
        const passwordInput = screen.getByLabelText(/^Senha/i);
        const confirmPasswordInput = screen.getByLabelText(/Confirmar Senha/i);

        fireEvent.change(nameInput, { target: { value: 'Test User' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

        expect(nameInput).toHaveValue('Test User');
        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
        expect(confirmPasswordInput).toHaveValue('password123');
    });
});
