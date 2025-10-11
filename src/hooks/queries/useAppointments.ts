import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';
import type { Appointment } from '@topsmile/types';

const QUERY_KEYS = {
    all: ['appointments'] as const,
    lists: () => [...QUERY_KEYS.all, 'list'] as const,
    list: (clinicId: string, filters?: any) => [...QUERY_KEYS.lists(), clinicId, filters] as const,
    details: () => [...QUERY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

export const useAppointments = (clinicId: string, filters?: any) => {
    return useQuery({
        queryKey: QUERY_KEYS.list(clinicId, filters),
        queryFn: async () => {
            const response = await apiService.appointments.getAll(filters);
            return response.data || [];
        },
        staleTime: 2 * 60 * 1000,
        enabled: !!clinicId
    });
};

export const useAppointment = (id: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.detail(id),
        queryFn: async () => {
            const response = await apiService.appointments.getOne(id);
            return response.data;
        },
        enabled: !!id
    });
};

export const useCreateAppointment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => apiService.appointments.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
        }
    });
};

export const useUpdateAppointment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) => 
            apiService.appointments.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
        }
    });
};

export const useCancelAppointment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
            const response = await apiService.appointments.update(id, { status: 'cancelled', notes: reason });
            return response;
        },
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.detail(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
        }
    });
};

export const usePatientAppointments = (patientId: string, options?: any) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.all, 'patient', patientId],
        queryFn: async () => {
            const response = await apiService.appointments.getAll({ patient: patientId });
            return response.data || [];
        },
        staleTime: 2 * 60 * 1000,
        enabled: !!patientId,
        ...options
    });
};
