import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import LoginPage from '../../pages/Login/LoginPage';
import Dashboard from '../../components/Admin/Dashboard/Dashboard';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

describe('Authentication Flow Integration', () => {
  it('should handle complete login to dashboard flow', async () => {
    // Mock successful login
    server.use(
      http.post('*/api/auth/login', () => {
        return HttpResponse.json({
          success: true,
          data: {
            user: { _id: 'user1', name: 'Admin User', email: 'admin@topsmile.com', role: 'admin' },
            accessToken: 'valid-token',
            refreshToken: 'valid-refresh'
          }
        });
      }),
      http.get('*/api/auth/me', () => {
        return HttpResponse.json({
          success: true,
          data: { _id: 'user1', name: 'Admin User', email: 'admin@topsmile.com', role: 'admin' }
        });
      })
    );

    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate
    }));

    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    // Fill login form
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'admin@topsmile.com' }
    });
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'password123' }
    });

    // Submit login
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // Verify navigation to admin dashboard
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });

    // Verify token storage
    expect(localStorage.getItem('topsmile_access_token')).toBe('valid-token');
    expect(localStorage.getItem('topsmile_refresh_token')).toBe('valid-refresh');
  });

  it('should handle token refresh seamlessly', async () => {
    // Mock expired token response
    let callCount = 0;
    server.use(
      http.get('*/api/auth/me', () => {
        callCount++;
        if (callCount === 1) {
          return HttpResponse.json({ success: false, message: 'Token expired' }, { status: 401 });
        }
        return HttpResponse.json({
          success: true,
          data: { _id: 'user1', name: 'Admin User', email: 'admin@topsmile.com', role: 'admin' }
        });
      }),
      http.post('*/api/auth/refresh', () => {
        return HttpResponse.json({
          success: true,
          data: { accessToken: 'new-token', refreshToken: 'new-refresh' }
        });
      })
    );

    // Set initial expired token
    localStorage.setItem('topsmile_access_token', 'expired-token');
    localStorage.setItem('topsmile_refresh_token', 'valid-refresh');

    render(
      <BrowserRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </BrowserRouter>
    );

    // Should automatically refresh and show dashboard
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });

    // Verify new tokens were stored
    expect(localStorage.getItem('topsmile_access_token')).toBe('new-token');
  });
});
