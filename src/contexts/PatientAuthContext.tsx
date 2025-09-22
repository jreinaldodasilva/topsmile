import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { patientLogout, LOGOUT_EVENT } from '../services/http';
import type { Provider } from '@topsmile/types';


interface PatientUser {
  _id: string;
  patient: {
    _id: string;
    name: string;
    email?: string;
    phone: string;
    birthDate?: string;
    gender?: string;
    address?: {
      street?: string;
      number?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
    medicalHistory?: {
      allergies?: string[];
      medications?: string[];
      conditions?: string[];
      notes?: string;
    };
  };
  email: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: string;
}

interface PatientAuthResult {
  success: boolean;
  message?: string;
}

export interface PatientAuthContextType {
  isAuthenticated: boolean;
  patientUser: PatientUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<PatientAuthResult>;
  register: (data: { patientId?: string; name: string; email: string; phone: string; password: string; clinicId: string }) => Promise<PatientAuthResult>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshPatientData: () => Promise<void>;
}

export const PatientAuthContext = createContext<PatientAuthContextType | undefined>(undefined);

export const PatientAuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [patientUser, setPatientUser] = useState<PatientUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !loading && !!patientUser;

  const performLogout = useCallback(async () => {
    try {
      setPatientUser(null);

      await patientLogout();
      navigate('/patient/login');
    } catch (error) {
      console.error('Patient logout error:', error);
      navigate('/patient/login');
    }
  }, [navigate]);

  // Initial authentication check
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const userResponse = await apiService.patientAuth.me();

        if (userResponse.success && userResponse.data?.patientUser) {
          setPatientUser(userResponse.data.patientUser);
        } else {
          setPatientUser(null);
        }
      } catch (err) {
        setPatientUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email: string, password: string): Promise<PatientAuthResult> => {
    try {
      setError(null);
      setLoading(true);

      const response = await apiService.patientAuth.login(email, password);

      if (response.success && response.data) {
        const { patientUser } = response.data;

        setPatientUser(patientUser);

        navigate('/patient/dashboard');
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

  const register = async (data: { patientId?: string; name: string; email: string; phone: string; password: string; clinicId: string }): Promise<PatientAuthResult> => {
    try {
      setError(null);
      setLoading(true);

      const response = await apiService.patientAuth.register(data);

      if (response.success && response.data) {
        const { patientUser } = response.data;

        if (patientUser) {
          setPatientUser(patientUser);
          navigate('/patient/dashboard');
        } else {
          navigate('/patient/login', {
            state: { message: 'Conta criada! Verifique seu e-mail para ativar a conta.' }
          });
        }

        return { success: true, message: response.message };
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

  const logout = async () => {
    await performLogout();
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshPatientData = async () => {
    try {
      const response = await apiService.patientAuth.me();
      if (response.success && response.data?.patientUser) {
        setPatientUser(response.data.patientUser);
      }
    } catch (error) {
      console.error('Failed to refresh patient data:', error);
    }
  };

  // Cross-tab sync
  useEffect(() => {
    const onLogout = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail.key === 'patient' && isAuthenticated) {
        setPatientUser(null);
        navigate('/patient/login');
      }
    };

    window.addEventListener(LOGOUT_EVENT, onLogout);
    return () => window.removeEventListener(LOGOUT_EVENT, onLogout);
  }, [navigate, isAuthenticated]);

  const value: PatientAuthContextType = {
    isAuthenticated,
    patientUser,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    refreshPatientData
  };

  return (
    <PatientAuthContext.Provider value={value}>
      {children}
    </PatientAuthContext.Provider>
  );
};

export const usePatientAuth = (): PatientAuthContextType => {
  const context = useContext(PatientAuthContext);
  if (!context) {
    throw new Error('usePatientAuth must be used within a PatientAuthProvider');
  }
  return context;
};