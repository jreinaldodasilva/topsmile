import { useState, useCallback } from 'react';
import { useProviders, useDeleteProvider } from './queries';
import { useAuth } from '../contexts/AuthContext';
import type { Provider } from '@topsmile/types';


interface ProviderFilters {
    search?: string;
    specialty?: string;
    isActive?: boolean;
    page?: number;
    limit?: number;
}

export const useProviderManagement = () => {
    const { user } = useAuth();
    const [filters, setFilters] = useState<ProviderFilters>({
        search: '',
        specialty: '',
        isActive: true,
        page: 1,
        limit: 20
    });
    const [sort, setSort] = useState<Record<string, any>>({ createdAt: -1 });

    const { data, isLoading, error, refetch } = useProviders(user?.clinicId || '', { ...filters, sort });
    const deleteMutation = useDeleteProvider();

    const providers = Array.isArray(data) ? data : (data as any)?.providers || [];
    const total = Array.isArray(data) ? data.length : (data as any)?.total || 0;

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
    }, []);

    const handleFilterChange = useCallback((key: keyof ProviderFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    }, []);

    const handleDeleteProvider = useCallback(async (providerId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este profissional?')) {
            try {
                await deleteMutation.mutateAsync(providerId);
                console.log('Profissional excluído com sucesso');
            } catch (error) {
                console.error('Erro ao excluir profissional');
            }
        }
    }, [deleteMutation]);

    return {
        providers,
        loading: isLoading,
        error: error?.message || null,
        filters,
        sort,
        total,
        handleSearchChange,
        handleFilterChange,
        setSort,
        handleDeleteProvider,
        fetchProviders: refetch
    };
};
