// src/contexts/AuthContext.tsx - Updated for Backend Integration
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { logout as httpLogout, LOGOUT_EVENT } from '../services/http';
import type { User, RegisterRequest } from '../types/api';

interface AuthResult {
  success: boolean;
  message?: string;
}

export interface AuthStateContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface AuthActionsContextType {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthResult>;
  register: (data: RegisterRequest) => Promise<AuthResult>;
  logout: (reason?: string) => Promise<void>;
  clearError: () => void;
  refreshUserData: () => Promise<void>;
}

export const AuthStateContext = createContext<AuthStateContextType | undefined>(undefined);
export const AuthActionsContext = createContext<AuthActionsContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoutReason, setLogoutReason] = useState<string | null>(null);

  const isAuthenticated = !loading && !!user;

  const performLogout = useCallback(async (reason?: string) => {
    try {
      // Clear local state first
      setUser(null);

      // Remove tokens from localStorage
      localStorage.removeItem('topsmile_access_token');
      localStorage.removeItem('topsmile_refresh_token');

      // Notify backend and clear tokens for the default context
      await httpLogout();

      if (reason) {
        setLogoutReason(reason);
      }

      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to login even if backend call fails
      navigate('/login');
    }
  }, [navigate]);

  // UPDATED: Enhanced initial authentication check
  useEffect(() => {
    const verifyAuth = async () => {
      const hadTokens = !!localStorage.getItem('topsmile_access_token');
      try {
        const userResponse = await apiService.auth.me();

        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
        } else {
          setUser(null);
          // Clear invalid tokens
          localStorage.removeItem('topsmile_access_token');
          localStorage.removeItem('topsmile_refresh_token');
          // Navigate to login if tokens were present but invalid
          if (hadTokens) navigate('/login');
        }
      } catch (err) {
        setUser(null);
        // Clear invalid tokens on error
        localStorage.removeItem('topsmile_access_token');
        localStorage.removeItem('topsmile_refresh_token');
        // Navigate to login if tokens were present but invalid
        if (hadTokens) navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [navigate]);

  // UPDATED: Enhanced login function with secure token storage
  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false): Promise<AuthResult> => {
    try {
      setError(null);
      setLoading(true);

      const response = await apiService.auth.login(email, password);

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;

        // Store tokens securely
        localStorage.setItem('topsmile_access_token', accessToken);
        localStorage.setItem('topsmile_refresh_token', refreshToken);

        // Update state
        setUser(user);
        setLogoutReason(null);

        // Navigate to appropriate page based on user role
        const redirectPath = getRedirectPath(user.role);
        navigate(redirectPath);

        return { success: true };
      } else {
        let errorMsg = response.message || 'E-mail ou senha inválidos';
        const errorData = response as any;
        if (errorData.data?.errors && Array.isArray(errorData.data.errors)) {
          errorMsg = errorData.data.errors.map((err: any) => err.msg || err.message).join(', ');
        }
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Erro de rede. Tente novamente.';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // ADDED: Register function with secure token storage
  const register = useCallback(async (data: RegisterRequest): Promise<AuthResult> => {
    try {
      setError(null);
      setLoading(true);

      const response = await apiService.auth.register(data);

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;

        // Store tokens securely
        localStorage.setItem('topsmile_access_token', accessToken);
        localStorage.setItem('topsmile_refresh_token', refreshToken);

        // Update state
        setUser(user);

        // Navigate to dashboard
        navigate('/admin');

        return { success: true, message: 'Conta criada com sucesso!' };
      } else {
        let errorMsg = response.message || 'Erro ao criar conta';
        const errorData = response as any;
        if (errorData.data?.errors && Array.isArray(errorData.data.errors)) {
          errorMsg = errorData.data.errors.map((err: any) => err.msg || err.message).join(', ');
        }
        setError(errorMsg);
        return { success: false, message: errorMsg };
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Erro de rede. Tente novamente.';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // UPDATED: Enhanced logout with backend notification
  const logout = useCallback(async (reason?: string) => {
    await performLogout(reason);
  }, [performLogout]);

  // ADDED: Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ADDED: Refresh user data function
  const refreshUserData = useCallback(async () => {
    try {
      const response = await apiService.auth.me();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, []);

  // UPDATED: Cross-tab sync using custom event
  useEffect(() => {
    const onLogout = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.key === 'default' && isAuthenticated) {
        setUser(null);
        setLogoutReason('Sua sessão expirou ou você foi desconectado em outra aba.');
        navigate('/login');
      }
    };

    window.addEventListener(LOGOUT_EVENT, onLogout);
    return () => window.removeEventListener(LOGOUT_EVENT, onLogout);
  }, [navigate, isAuthenticated]);

  // Show logout reason after redirect
  useEffect(() => {
    if (logoutReason && !loading && !isAuthenticated) {
      const timer = setTimeout(() => {
        alert(logoutReason);
        setLogoutReason(null);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [logoutReason, loading, isAuthenticated]);

  const stateValue: AuthStateContextType = { 
    isAuthenticated, 
    user,
    loading, 
    error
  };

  const actionsValue: AuthActionsContextType = { 
    login, 
    register,
    logout,
    clearError,
    refreshUserData
  };

  return (
    <AuthStateContext.Provider value={stateValue}>
      <AuthActionsContext.Provider value={actionsValue}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = (): AuthStateContextType => {
  const context = useContext(AuthStateContext);
  if (!context) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return context;
};

export const useAuthActions = (): AuthActionsContextType => {
  const context = useContext(AuthActionsContext);
  if (!context) {
    throw new Error('useAuthActions must be used within an AuthProvider');
  }
  return context;
};

function getRedirectPath(role?: string): string {
  switch (role) {
    case 'super_admin':
    case 'admin':
    case 'manager':
      return '/admin';
    case 'dentist':
      return '/admin/appointments';
    case 'assistant':
      return '/admin/appointments';
    case 'patient':
      return '/patient/dashboard';
    default:
      return '/login';
  }
}
