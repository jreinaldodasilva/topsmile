// src/contexts/AuthContext.tsx - Updated for Backend Integration
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { logout as httpLogout, hasTokens, getRefreshToken, getAccessToken, setTokens, LOGOUT_EVENT } from '../services/http';
import type { User } from '../types/api';

interface AuthResult {
  success: boolean;
  message?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: (reason?: string) => Promise<void>;
  clearError: () => void;
  refreshUserData: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  clinic?: {
    name: string;
    phone: string;
    address: {
      street: string;
      number?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
  };
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoutReason, setLogoutReason] = useState<string | null>(null);

  const isAuthenticated = !loading && !!accessToken && !!user;

  const performLogout = useCallback(async (reason?: string) => {
    try {
      // Clear local state first
      setAccessToken(null);
      setUser(null);

      // Notify backend and clear tokens for the default context
      await httpLogout('default');

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
      try {
        // Check if a refresh token exists for the default context.
        if (!hasTokens('default')) {
          setLoading(false);
          return;
        }

        // The request function in http.ts will handle automatic token refresh
        const userResponse = await apiService.auth.me();

        if (userResponse.success && userResponse.data) {
          // After a successful request, the new access token is in our store.
          setAccessToken(getAccessToken('default'));
          setUser(userResponse.data);
        } else {
          // If fetching user fails, logout
          await performLogout('Sessão inválida. Faça login novamente.');
        }
      } catch (err) {
        console.error('Initial auth check failed:', err);
        await performLogout('Erro na verificação de autenticação.');
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [performLogout]);

  // UPDATED: Enhanced login function with secure token storage
  const login = async (email: string, password: string, rememberMe: boolean = false): Promise<AuthResult> => {
    try {
      setError(null);
      setLoading(true);

      const response = await apiService.auth.login(email, password);

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;

        // Store tokens using our secure mechanism for the default context
        setTokens(accessToken, refreshToken, 'default');

        // Update state
        setAccessToken(accessToken);
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
  };

  // ADDED: Register function with secure token storage
  const register = async (data: RegisterData): Promise<AuthResult> => {
    try {
      setError(null);
      setLoading(true);

      const response = await apiService.auth.register(data);

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;

        // Store tokens using our secure mechanism for the default context
        setTokens(accessToken, refreshToken, 'default');

        // Update state
        setAccessToken(accessToken);
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
  };

  // UPDATED: Enhanced logout with backend notification
  const logout = async (reason?: string) => {
    await performLogout(reason);
  };

  // ADDED: Clear error function
  const clearError = () => {
    setError(null);
  };

  // ADDED: Refresh user data function
  const refreshUserData = async () => {
    try {
      if (!accessToken) return;
      
      const response = await apiService.auth.me();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  // UPDATED: Cross-tab sync using custom event
  useEffect(() => {
    const onLogout = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.key === 'default' && isAuthenticated) {
        setAccessToken(null);
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

  // ADDED: Periodic token validation (optional)
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        await apiService.auth.me();
      } catch (error) {
        console.warn('Periodic token validation failed:', error);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated, performLogout]);

  const value: AuthContextType = { 
    isAuthenticated, 
    accessToken, 
    user,
    loading, 
    error,
    login, 
    register,
    logout,
    clearError,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
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
    default:
      return '/admin';
  }
}
