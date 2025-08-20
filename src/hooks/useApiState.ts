// src/hooks/useApiState.ts
import { useState, useCallback } from 'react';

interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UseApiStateReturn<T> extends ApiState<T> {
    execute: (apiCall: () => Promise<T>) => Promise<T | null>;
    reset: () => void;
    setData: (data: T | null) => void;
    setError: (error: string | null) => void;
}

export function useApiState<T = any>(initialData: T | null = null): UseApiStateReturn<T> {
    const [state, setState] = useState<ApiState<T>>({
        data: initialData,
        loading: false,
        error: null
    });

    const execute = useCallback(async (apiCall: () => Promise<T>): Promise<T | null> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const result = await apiCall();
            setState(prev => ({ ...prev, data: result, loading: false }));
            return result;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            setState(prev => ({ ...prev, error: errorMessage, loading: false }));

            // Log error for debugging (remove in production)
            console.error('API Error:', error);

            return null;
        }
    }, []);

    const reset = useCallback(() => {
        setState({ data: initialData, loading: false, error: null });
    }, [initialData]);

    const setData = useCallback((data: T | null) => {
        setState(prev => ({ ...prev, data }));
    }, []);

    const setError = useCallback((error: string | null) => {
        setState(prev => ({ ...prev, error }));
    }, []);

    return {
        ...state,
        execute,
        reset,
        setData,
        setError
    };
}

// Specialized hook for dashboard data
export function useDashboard() {
    const {
        data: stats,
        loading,
        error,
        execute,
        reset
    } = useApiState();

    const fetchDashboardData = useCallback(async () => {
        const { apiService } = await import('../services/apiService');
        return execute(async () => {
            const response = await apiService.dashboard.getStats();
            return response.data;
        });
    }, [execute]);

    return {
        stats,
        loading,
        error,
        fetchDashboardData,
        reset
    };
}

// Hook for contact management
export function useContacts() {
    const {
        data: contactsData,
        loading,
        error,
        execute,
        setData,
        setError
    } = useApiState();

    const fetchContacts = useCallback(async (filters = {}) => {
        const { apiService } = await import('../services/apiService');
        return execute(async () => {
            const response = await apiService.contacts.getAll(filters);
            return response.data;
        });
    }, [execute]);

    const updateContact = useCallback(async (id: string, updates: any) => {
        const { apiService } = await import('../services/apiService');
        try {
            const response = await apiService.contacts.update(id, updates);

            // Update local data if we have contacts loaded
            interface Contact {
                id: string;
                [key: string]: any;
            }
            if (contactsData?.contacts) {
                const updatedContacts = (contactsData.contacts as Contact[]).map(contact =>
                    contact.id === id ? { ...contact, ...response.data } : contact
                );
                setData({
                    ...contactsData,
                    contacts: updatedContacts,
                    // Optionally preserve other keys like 'total'
                    total: contactsData.total,
                });
            }

            return response.data;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar contato';
            setError(errorMessage);
            throw error;
        }
    }, [contactsData, setData, setError]);

    const deleteContact = useCallback(async (id: string) => {
        const { apiService } = await import('../services/apiService');
        try {
            await apiService.contacts.delete(id);

            // Remove from local data if we have contacts loaded
            interface Contact {
                id: string;
                [key: string]: any;
            }
            if (contactsData?.contacts) {
                const updatedContacts = (contactsData.contacts as Contact[]).filter(contact => contact.id !== id);
                setData({
                    ...contactsData,
                    contacts: updatedContacts,
                    total: contactsData.total - 1
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir contato';
            setError(errorMessage);
            throw error;
        }
    }, [contactsData, setData, setError]);

    return {
        contactsData,
        loading,
        error,
        fetchContacts,
        updateContact,
        deleteContact
    };
}