// src/contexts/BaseAuthContext.tsx - Shared auth logic
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGOUT_EVENT } from '../services/http';
import { useSessionTimeout } from '../hooks/useSessionTimeout';

interface BaseAuthUser {
    _id?: string;
    id?: string;
    email: string;
    name?: string;
    role?: string;
}

interface AuthConfig<T extends BaseAuthUser> {
    checkAuth: () => Promise<{ success: boolean; data?: T }>;
    performLogin: (email: string, password: string) => Promise<{ success: boolean; data?: any; message?: string }>;
    performLogout: () => Promise<void>;
    loginRoute: string;
    dashboardRoute: string;
    logoutEventKey: string;
}

export function useBaseAuth<T extends BaseAuthUser>(config: AuthConfig<T>) {
    const navigate = useNavigate();
    const [user, setUser] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
    const isMountedRef = useRef(true);
    const authCheckDoneRef = useRef(false);

    const isAuthenticated = !loading && !!user;

    const handleLogout = useCallback(
        async (reason?: string) => {
            try {
                setUser(null);
                setShowTimeoutWarning(false);
                await config.performLogout();
                if (reason) {
                    setError(reason);
                }
                navigate(config.loginRoute);
            } catch (err) {
                console.error('Logout error:', err);
                navigate(config.loginRoute);
            }
        },
        [navigate, config]
    );

    // Session timeout
    const { resetTimer } = useSessionTimeout({
        enabled: isAuthenticated,
        onWarning: () => setShowTimeoutWarning(true),
        onTimeout: () => handleLogout('Sua sessão expirou por inatividade.')
    });

    useEffect(() => {
        if (isAuthenticated) {
            resetTimer();
        }
    }, [isAuthenticated, resetTimer]);

    // Initial auth check - only once on mount
    useEffect(() => {
        if (authCheckDoneRef.current) return;
        authCheckDoneRef.current = true;

        const verifyAuth = async () => {
            try {
                const response = await config.checkAuth();

                if (!isMountedRef.current) return;

                if (response.success && response.data) {
                    setUser(response.data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                if (!isMountedRef.current) return;
                setUser(null);
            } finally {
                if (isMountedRef.current) {
                    setLoading(false);
                }
            }
        };

        verifyAuth();

        return () => {
            isMountedRef.current = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = useCallback(
        async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
            try {
                setError(null);
                setLoading(true);

                const response = await config.performLogin(email, password);

                if (response.success && response.data) {
                    setUser(response.data.user || response.data.patientUser);
                    navigate(config.dashboardRoute);
                    return { success: true };
                } else {
                    const errorMsg = response.message || 'E-mail ou senha inválidos';
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
        },
        [navigate, config]
    );

    const logout = useCallback(
        async (reason?: string) => {
            await handleLogout(reason);
        },
        [handleLogout]
    );

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const refreshUserData = useCallback(async () => {
        try {
            const response = await config.checkAuth();
            if (response.success && response.data) {
                setUser(response.data);
            }
        } catch (err) {
            console.error('Failed to refresh user data:', err);
        }
    }, [config]);

    // Cross-tab logout sync
    useEffect(() => {
        const onLogout = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail.key === config.logoutEventKey && isAuthenticated) {
                setUser(null);
                setError('Sua sessão expirou ou você foi desconectado em outra aba.');
                navigate(config.loginRoute);
            }
        };

        window.addEventListener(LOGOUT_EVENT, onLogout);
        return () => window.removeEventListener(LOGOUT_EVENT, onLogout);
    }, [navigate, isAuthenticated, config]);

    // Show logout reason
    useEffect(() => {
        if (error && !loading && !isAuthenticated) {
            const timer = setTimeout(async () => {
                const { toast } = await import('../utils/toast');
                toast.warning(error);
                setError(null);
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [error, loading, isAuthenticated]);

    const handleContinueSession = useCallback(() => {
        setShowTimeoutWarning(false);
        resetTimer();
    }, [resetTimer]);

    const handleLogoutFromModal = useCallback(() => {
        setShowTimeoutWarning(false);
        handleLogout('Você optou por sair.');
    }, [handleLogout]);

    return {
        user,
        isAuthenticated,
        loading,
        error,
        showTimeoutWarning,
        login,
        logout,
        clearError,
        refreshUserData,
        handleContinueSession,
        handleLogoutFromModal
    };
}
