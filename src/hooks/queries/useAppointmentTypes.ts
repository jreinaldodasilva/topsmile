import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';
import type { AppointmentType } from '@topsmile/types';

const QUERY_KEYS = {
    all: ['appointmentTypes'] as const,
    lists: () => [...QUERY_KEYS.all, 'list'] as const,
    list: (clinicId: string) => [...QUERY_KEYS.lists(), clinicId] as const,
};

export const useAppointmentTypes = (clinicId: string) => {
    return useQuery<AppointmentType[]>({
        queryKey: QUERY_KEYS.list(clinicId),
        queryFn: async () => {
            const response = await apiService.appointmentTypes.getAll();
            return response.data || [];
        },
        staleTime: 10 * 60 * 1000
    });
};

export const useCreateAppointmentType = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await apiService.appointmentTypes.getAll();
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
        }
    });
};
