import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuthState, useAuthActions } from '../AuthContext';
import { apiService } from '../../services/apiService';

jest.mock('../../services/apiService');
jest.mock('../../services/http');
jest.useFakeTimers();

const TestComponent = () => {
    const { isAuthenticated, user } = useAuthState();
    const { login, logout } = useAuthActions();

    return (
        <div>
            <div data-testid="auth-status">{isAuthenticated ? 'authenticated' : 'not-authenticated'}</div>
            <div data-testid="user">{user?.email || 'no-user'}</div>
            <button onClick={() => login('test@example.com', 'password')}>Login</button>
            <button onClick={() => logout()}>Logout</button>
        </div>
    );
};

describe('AuthContext Session Timeout', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should show timeout warning after 28 minutes', async () => {
        (apiService.auth.me as jest.Mock).mockResolvedValue({
            success: true,
            data: { email: 'test@example.com', role: 'admin' }
        });

        render(
            <BrowserRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
        });

        act(() => {
            jest.advanceTimersByTime(28 * 60 * 1000);
        });

        await waitFor(() => {
            expect(screen.getByText('Sessão Expirando')).toBeInTheDocument();
        });
    });

    it('should logout after 30 minutes of inactivity', async () => {
        (apiService.auth.me as jest.Mock).mockResolvedValue({
            success: true,
            data: { email: 'test@example.com', role: 'admin' }
        });

        render(
            <BrowserRouter>
                <AuthProvider>
                    <TestComponent />
                </AuthProvider>
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
        });

        act(() => {
            jest.advanceTimersByTime(30 * 60 * 1000);
        });

        await waitFor(() => {
            expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
        });
    });
});
