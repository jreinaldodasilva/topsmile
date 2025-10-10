// src/contexts/AuthContext.tsx - Updated for Backend Integration
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { logout as httpLogout, LOGOUT_EVENT, startTokenRefresh, stopTokenRefresh } from '../services/http';
import { useSessionTimeout } from '../hooks/useSessionTimeout';
import { SessionTimeoutModal } from '../components/common/SessionTimeoutModal';
import type { User, Provider, RegisterRequest } from '@topsmile/types';


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
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  const isAuthenticated = !loading && !!user;

  const performLogout = useCallback(async (reason?: string) => {
    try {
      // Stop token refresh
      stopTokenRefresh();
      
      // Clear local state first
      setUser(null);
      setShowTimeoutWarning(false);

      // SECURITY FIX: Tokens in httpOnly cookies only
      // No localStorage to clear

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

  // Session timeout tracking
  const { resetTimer } = useSessionTimeout({
    enabled: isAuthenticated,
    onWarning: () => setShowTimeoutWarning(true),
    onTimeout: () => performLogout('Sua sessão expirou por inatividade.')
  });

  // Reset timer on successful login
  useEffect(() => {
    if (isAuthenticated) {
      resetTimer();
    }
  }, [isAuthenticated, resetTimer]);

  // UPDATED: Enhanced initial authentication check with race condition prevention
  useEffect(() => {
    let isMounted = true;
    let authCheckInProgress = false;

    const verifyAuth = async () => {
      if (authCheckInProgress) return;
      authCheckInProgress = true;
      
      // SECURITY FIX: Rely on httpOnly cookies only
      try {
        const userResponse = await apiService.auth.me();

        if (!isMounted) return;

        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        if (!isMounted) return;
        setUser(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
        authCheckInProgress = false;
      }
    };

    verifyAuth();
    
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // SECURITY FIX: Tokens stored in httpOnly cookies by backend
  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false): Promise<AuthResult> => {
    try {
      setError(null);
      setLoading(true);

      const response = await apiService.auth.login(email, password);

      if (response.success && response.data) {
        const { user } = response.data;

        // Tokens automatically stored in httpOnly cookies by backend
        // No localStorage storage needed

        // Update state
        setUser(user);
        setLogoutReason(null);

        // Start proactive token refresh
        startTokenRefresh();

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

  // SECURITY FIX: Tokens stored in httpOnly cookies by backend
  const register = useCallback(async (data: RegisterRequest): Promise<AuthResult> => {
    try {
      setError(null);
      setLoading(true);

      const response = await apiService.auth.register(data);

      if (response.success && response.data) {
        const { user } = response.data;

        // Tokens automatically stored in httpOnly cookies by backend
        // No localStorage storage needed

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
      const timer = setTimeout(async () => {
        const { toast } = await import('../utils/toast');
        toast.warning(logoutReason);
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

  const handleContinueSession = useCallback(() => {
    setShowTimeoutWarning(false);
    resetTimer();
  }, [resetTimer]);

  const handleLogoutFromModal = useCallback(() => {
    setShowTimeoutWarning(false);
    performLogout('Você optou por sair.');
  }, [performLogout]);

  return (
    <AuthStateContext.Provider value={stateValue}>
      <AuthActionsContext.Provider value={actionsValue}>
        {children}
        <SessionTimeoutModal
          show={showTimeoutWarning}
          onContinue={handleContinueSession}
          onLogout={handleLogoutFromModal}
        />
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
