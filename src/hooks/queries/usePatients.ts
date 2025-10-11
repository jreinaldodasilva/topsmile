import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';
import type { Patient, CreatePatientDTO } from '@topsmile/types';

const QUERY_KEYS = {
    all: ['patients'] as const,
    lists: () => [...QUERY_KEYS.all, 'list'] as const,
    list: (clinicId: string, filters?: any) => [...QUERY_KEYS.lists(), clinicId, filters] as const,
    details: () => [...QUERY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

export const usePatients = (clinicId: string, filters?: any) => {
    return useQuery({
        queryKey: QUERY_KEYS.list(clinicId, filters),
        queryFn: () => apiService.patients.list(clinicId, filters),
        staleTime: 5 * 60 * 1000,
        enabled: !!clinicId
    });
};

export const usePatient = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.detail(id),
        queryFn: () => apiService.patients.getById(id),
        enabled: !!id
    });
};

export const useCreatePatient = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: CreatePatientDTO) => apiService.patients.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
        }
    });
};

export const useUpdatePatient = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Patient> }) => 
            apiService.patients.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
        }
    });
};

export const useDeletePatient = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (id: string) => apiService.patients.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
        }
    });
};
