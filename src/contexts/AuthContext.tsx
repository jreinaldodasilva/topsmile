// src/contexts/AuthContext.tsx - Refactored with BaseAuthContext
import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { logout as httpLogout, startTokenRefresh, stopTokenRefresh } from '../services/http';
import { SessionTimeoutModal } from '../components/common/SessionTimeoutModal';
import { useBaseAuth } from './BaseAuthContext';
import type { User, RegisterRequest } from '@topsmile/types';


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

  const auth = useBaseAuth<User>({
    checkAuth: async () => apiService.auth.me(),
    performLogin: async (email, password) => {
      const response = await apiService.auth.login(email, password);
      if (response.success) {
        startTokenRefresh();
      }
      return response;
    },
    performLogout: async () => {
      stopTokenRefresh();
      await httpLogout();
    },
    loginRoute: '/login',
    dashboardRoute: '/admin',
    logoutEventKey: 'default'
  });

  const login = useCallback(async (email: string, password: string, rememberMe: boolean = false): Promise<AuthResult> => {
    const result = await auth.login(email, password);
    if (result.success && auth.user) {
      const redirectPath = getRedirectPath(auth.user.role);
      navigate(redirectPath);
    }
    return result;
  }, [auth, navigate]);

  const register = useCallback(async (data: RegisterRequest): Promise<AuthResult> => {
    try {
      const response = await apiService.auth.register(data);
      if (response.success && response.data) {
        navigate('/admin');
        return { success: true, message: 'Conta criada com sucesso!' };
      }
      return { success: false, message: response.message || 'Erro ao criar conta' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Erro de rede. Tente novamente.' };
    }
  }, [navigate]);

  const stateValue: AuthStateContextType = { 
    isAuthenticated: auth.isAuthenticated, 
    user: auth.user,
    loading: auth.loading, 
    error: auth.error
  };

  const actionsValue: AuthActionsContextType = { 
    login, 
    register,
    logout: auth.logout,
    clearError: auth.clearError,
    refreshUserData: auth.refreshUserData
  };

  return (
    <AuthStateContext.Provider value={stateValue}>
      <AuthActionsContext.Provider value={actionsValue}>
        {children}
        <SessionTimeoutModal
          show={auth.showTimeoutWarning}
          onContinue={auth.handleContinueSession}
          onLogout={auth.handleLogoutFromModal}
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
