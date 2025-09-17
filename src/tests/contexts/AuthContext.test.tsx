import React from 'react';
import { screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import { useAuthState, useAuthActions } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import { render } from '../utils/test-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the API service
jest.mock('../../services/apiService', () => ({
  apiService: {
    auth: {
      login: jest.fn(),
      register: jest.fn(),
      me: jest.fn()
    }
  }
}));
jest.mock('../../services/http');

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    mockNavigate.mockClear();
  });

  afterEach(cleanup);

  const TestComponent = () => {
    const { isAuthenticated, loading, error, user } = useAuthState();
    const { login, register, logout, clearError, refreshUserData } = useAuthActions();

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
        <div data-testid="user-info">
          {user ? `User: ${user.name} (${user.role})` : 'No User'}
        </div>
        <button onClick={() => login('test@example.com', 'password')} disabled={loading}>
          Login
        </button>
        <button onClick={() => register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        })}>
          Register
        </button>
        <button onClick={() => logout()}>
          Logout
        </button>
        <button onClick={clearError}>
          Clear Error
        </button>
        <button onClick={refreshUserData}>
          Refresh User Data
        </button>
      </div>
    );
  };

  describe('Initial State', () => {
    it('provides authentication context to children', () => {
      render(<TestComponent />);
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
      expect(screen.getByTestId('loading-status')).toHaveTextContent('Loading'); // Initially loading
      expect(screen.getByTestId('error-message')).toHaveTextContent('No Error');
      expect(screen.getByTestId('user-info')).toHaveTextContent('No User');
    });

    it('renders all action buttons', () => {
      render(<TestComponent />);
      expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Clear Error/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Refresh User Data/i })).toBeInTheDocument();
    });
  });

  describe('Login Functionality', () => {
    it('handles successful login', async () => {
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin'
      };

      (apiService.auth.login as jest.Mock).mockResolvedValueOnce({
        success: true,
        data: {
          user: mockUser,
          accessToken: 'access-token',
          refreshToken: 'refresh-token'
        }
      });

      render(<TestComponent />);

      // Wait for initial loading to complete
      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
      });

      const loginButton = screen.getByRole('button', { name: /Login/i });
      fireEvent.click(loginButton);

      // Check loading state
      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Loading');
      });

      // Check success state
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      });
      await waitFor(() => {
        expect(screen.getByTestId('user-info')).toHaveTextContent('User: Test User (admin)');
      });
      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
      });

      expect(mockNavigate).toHaveBeenCalledWith('/admin');
      expect(localStorageMock.getItem('topsmile_access_token')).toBe('access-token');
      expect(localStorageMock.getItem('topsmile_refresh_token')).toBe('refresh-token');
    });

    it('handles login failure', async () => {
      (apiService.auth.login as jest.Mock).mockResolvedValueOnce({
        success: false,
        message: 'Invalid credentials'
      });

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
      });

      const loginButton = screen.getByRole('button', { name: /Login/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid credentials');
      });
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('handles network errors during login', async () => {
      (apiService.auth.login as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
      });

      const loginButton = screen.getByRole('button', { name: /Login/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Network error');
      });
    });

    it('disables login button while loading', async () => {
      (apiService.auth.login as jest.Mock).mockImplementation(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({ success: true, data: { user: { role: 'admin' } } });
          }, 100);
        });
      });

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
      });

      const loginButton = screen.getByRole('button', { name: /Login/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(loginButton).toBeDisabled();
      });

      await waitFor(() => {
        expect(loginButton).not.toBeDisabled();
      });
    });

    it('redirects to correct path based on user role', async () => {
      const testCases = [
        { role: 'admin', expectedPath: '/admin' },
        { role: 'dentist', expectedPath: '/admin/appointments' },
        { role: 'assistant', expectedPath: '/admin/appointments' },
        { role: 'manager', expectedPath: '/admin' },
        { role: 'patient', expectedPath: '/patient/dashboard' },
        { role: 'other', expectedPath: '/login' }
      ];

      for (const { role, expectedPath } of testCases) {
        mockNavigate.mockClear();

        (apiService.auth.login as jest.Mock).mockResolvedValueOnce({
          success: true,
          data: {
            user: { _id: 'user123', name: 'Test User', email: 'test@example.com', role },
            accessToken: 'access-token',
            refreshToken: 'refresh-token'
          }
        });

        render(<TestComponent />);

        await waitFor(() => {
          expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
        });

        const loginButton = screen.getByRole('button', { name: /Login/i });
        fireEvent.click(loginButton);

        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith(expectedPath);
        });
      }
    });
  });

  describe('Registration Functionality', () => {
    it('handles successful registration', async () => {
      const mockUser = {
        _id: 'user123',
        name: 'New User',
        email: 'new@example.com',
        role: 'dentist'
      };

      (apiService.auth.register as jest.Mock).mockResolvedValueOnce({
        success: true,
        data: {
          user: mockUser,
          accessToken: 'access-token',
          refreshToken: 'refresh-token'
        }
      });

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
      });

      const registerButton = screen.getByRole('button', { name: /Register/i });
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
        expect(screen.getByTestId('user-info')).toHaveTextContent('User: New User (dentist)');
      });

      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });

    it('handles registration failure', async () => {
      (apiService.auth.register as jest.Mock).mockResolvedValueOnce({
        success: false,
        message: 'Email already exists'
      });

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
      });

      const registerButton = screen.getByRole('button', { name: /Register/i });
      fireEvent.click(registerButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Email already exists');
      });
    });
  });

  describe('Logout Functionality', () => {
    it('handles logout successfully', async () => {
      // First login
      (apiService.auth.login as jest.Mock).mockResolvedValueOnce({
        success: true,
        data: {
          user: { _id: 'user123', name: 'Test User', email: 'test@example.com', role: 'admin' },
          accessToken: 'access-token',
          refreshToken: 'refresh-token'
        }
      });

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
      });

      const loginButton = screen.getByRole('button', { name: /Login/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      });

      // Now logout
      const logoutButton = screen.getByRole('button', { name: /Logout/i });
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
      });
      await waitFor(() => {
        expect(screen.getByTestId('user-info')).toHaveTextContent('No User');
      });

      expect(mockNavigate).toHaveBeenCalledWith('/login');
      expect(localStorageMock.getItem('topsmile_access_token')).toBeNull();
      expect(localStorageMock.getItem('topsmile_refresh_token')).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('clears error when clearError is called', async () => {
      (apiService.auth.login as jest.Mock).mockResolvedValueOnce({
        success: false,
        message: 'Login failed'
      });

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
      });

      const loginButton = screen.getByRole('button', { name: /Login/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toHaveTextContent('Login failed');
      });

      const clearErrorButton = screen.getByRole('button', { name: /Clear Error/i });
      fireEvent.click(clearErrorButton);

      expect(screen.getByTestId('error-message')).toHaveTextContent('No Error');
    });
  });

  describe('User Data Refresh', () => {
    it('refreshes user data successfully', async () => {
      // First login
      (apiService.auth.login as jest.Mock).mockResolvedValueOnce({
        success: true,
        data: {
          user: { _id: 'user123', name: 'Test User', email: 'test@example.com', role: 'admin' },
          accessToken: 'access-token',
          refreshToken: 'refresh-token'
        }
      });

      (apiService.auth.me as jest.Mock).mockResolvedValueOnce({
        success: true,
        data: { _id: 'user123', name: 'Updated User', email: 'test@example.com', role: 'admin' }
      });

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
      });

      const loginButton = screen.getByRole('button', { name: /Login/i });
      fireEvent.click(loginButton);

      await waitFor(() => {
        expect(screen.getByTestId('user-info')).toHaveTextContent('User: Test User (admin)');
      });

      // Refresh user data
      const refreshButton = screen.getByRole('button', { name: /Refresh User Data/i });
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(screen.getByTestId('user-info')).toHaveTextContent('User: Updated User (admin)');
      });
    });
  });

  describe('Initial Authentication Check', () => {
    it('verifies existing tokens on mount', async () => {
      localStorageMock.setItem('topsmile_access_token', 'existing-token');
      localStorageMock.setItem('topsmile_refresh_token', 'existing-refresh');

      (apiService.auth.me as jest.Mock).mockResolvedValueOnce({
        success: true,
        data: { _id: 'user123', name: 'Existing User', email: 'existing@example.com', role: 'admin' }
      });

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
        expect(screen.getByTestId('user-info')).toHaveTextContent('User: Existing User (admin)');
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
      });
    });

    it('handles invalid tokens on mount', async () => {
      localStorageMock.setItem('topsmile_access_token', 'invalid-token');

      (apiService.auth.me as jest.Mock).mockResolvedValueOnce({
        success: false,
        message: 'Invalid token'
      });

      render(<TestComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
      });
      await waitFor(() => {
        expect(screen.getByTestId('loading-status')).toHaveTextContent('Not Loading');
      });

      expect(localStorageMock.getItem('topsmile_access_token')).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('Context Hooks', () => {
    const queryClient = new QueryClient();
    it('throws error when useAuthState is used outside provider', () => {
      const TestHook = () => {
        useAuthState();
        return <div>Test</div>;
      };
      
      expect(() => render(<QueryClientProvider client={queryClient}><TestHook /></QueryClientProvider>)).toThrow('useAuthState must be used within an AuthProvider');
    });

    it('throws error when useAuthActions is used outside provider', () => {
      const TestHook = () => {
        useAuthActions();
        return <div>Test</div>;
      };

      expect(() => render(<QueryClientProvider client={queryClient}><TestHook /></QueryClientProvider>)).toThrow('useAuthActions must be used within an AuthProvider');
    });
  });
});
