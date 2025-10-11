import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';
import type { Provider } from '@topsmile/types';

const QUERY_KEYS = {
    all: ['providers'] as const,
    lists: () => [...QUERY_KEYS.all, 'list'] as const,
    list: (clinicId: string, filters?: any) => [...QUERY_KEYS.lists(), clinicId, filters] as const,
    details: () => [...QUERY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

export const useProviders = (clinicId: string, filters?: any) => {
    return useQuery({
        queryKey: QUERY_KEYS.list(clinicId, filters),
        queryFn: () => apiService.providers.list(clinicId, filters),
        staleTime: 10 * 60 * 1000,
        enabled: !!clinicId
    });
};

export const useProvider = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.detail(id),
        queryFn: () => apiService.providers.getById(id),
        enabled: !!id
    });
};

export const useCreateProvider = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => apiService.providers.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
        }
    });
};

export const useUpdateProvider = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Provider> }) => 
            apiService.providers.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
        }
    });
};

export const useDeleteProvider = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => apiService.providers.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
        }
    });
};
