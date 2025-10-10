import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { patientLogout } from '../services/http';
import { SessionTimeoutModal } from '../components/common/SessionTimeoutModal';
import { useBaseAuth } from './BaseAuthContext';

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
    register: (data: {
        patientId?: string;
        name: string;
        email: string;
        phone: string;
        password: string;
        clinicId: string;
    }) => Promise<PatientAuthResult>;
    logout: () => Promise<void>;
    clearError: () => void;
    refreshPatientData: () => Promise<void>;
}

export const PatientAuthContext = createContext<PatientAuthContextType | undefined>(undefined);

export const PatientAuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();

    const auth = useBaseAuth<PatientUser>({
        checkAuth: async () => {
            const response = await apiService.patientAuth.me();
            return {
                success: response.success,
                data: response.data?.patientUser
            };
        },
        performLogin: async (email, password) => apiService.patientAuth.login(email, password),
        performLogout: async () => {
            await patientLogout();
        },
        loginRoute: '/patient/login',
        dashboardRoute: '/patient/dashboard',
        logoutEventKey: 'patient'
    });

    const login = useCallback((email: string, password: string) => auth.login(email, password), [auth]);

    const register = useCallback(
        async (data: {
            patientId?: string;
            name: string;
            email: string;
            phone: string;
            password: string;
            clinicId: string;
        }): Promise<PatientAuthResult> => {
            const response = await apiService.patientAuth.register(data);
            if (response.success && response.data?.patientUser) {
                navigate('/patient/dashboard');
            } else if (response.success) {
                navigate('/patient/login', { state: { message: 'Conta criada! Verifique seu e-mail.' } });
            }
            return {
                success: response.success,
                message: response.message || (response.success ? 'Conta criada!' : 'Erro ao criar conta')
            };
        },
        [navigate]
    );

    const value: PatientAuthContextType = {
        isAuthenticated: auth.isAuthenticated,
        patientUser: auth.user,
        loading: auth.loading,
        error: auth.error,
        login,
        register,
        logout: auth.logout,
        clearError: auth.clearError,
        refreshPatientData: auth.refreshUserData
    };

    return (
        <PatientAuthContext.Provider value={value}>
            {children}
            <SessionTimeoutModal
                show={auth.showTimeoutWarning}
                onContinue={auth.handleContinueSession}
                onLogout={auth.handleLogoutFromModal}
            />
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
