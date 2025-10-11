import { useQuery } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';

const QUERY_KEYS = {
    all: ['clinics'] as const,
    detail: (id: string) => [...QUERY_KEYS.all, 'detail', id] as const,
};

export const useClinic = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.detail(id),
        queryFn: () => apiService.clinics.getById(id),
        staleTime: 15 * 60 * 1000,
        enabled: !!id
    });
};
