import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/apiService';

const QUERY_KEYS = {
    all: ['booking'] as const,
    availability: (providerId: string, date: string) => [...QUERY_KEYS.all, 'availability', providerId, date] as const,
    slots: (providerId: string, appointmentTypeId: string, date: string) => 
        [...QUERY_KEYS.all, 'slots', providerId, appointmentTypeId, date] as const,
};

export const useAvailability = (providerId: string, date: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.availability(providerId, date),
        queryFn: async () => {
            const response = await apiService.availability.getSlots({ providerId, date });
            return response.data || [];
        },
        staleTime: 1 * 60 * 1000,
        enabled: !!providerId && !!date
    });
};

export const useTimeSlots = (providerId: string, appointmentTypeId: string, date: string) => {
    return useQuery({
        queryKey: QUERY_KEYS.slots(providerId, appointmentTypeId, date),
        queryFn: async () => {
            const response = await apiService.availability.getSlots({ providerId, appointmentTypeId, date });
            return response.data || [];
        },
        staleTime: 1 * 60 * 1000,
        enabled: !!providerId && !!appointmentTypeId && !!date
    });
};

export const useAvailableSlots = (clinicId: string, appointmentTypeId: string, date: string, providerId?: string) => {
    return useQuery({
        queryKey: [...QUERY_KEYS.all, 'available', clinicId, appointmentTypeId, date, providerId || ''],
        queryFn: async () => {
            const response = await apiService.availability.getSlots({
                clinicId,
                appointmentTypeId,
                date,
                providerId
            });
            return response.data || [];
        },
        staleTime: 1 * 60 * 1000,
        enabled: !!clinicId && !!appointmentTypeId && !!date
    });
};

export const useBookAppointment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await apiService.appointments.create(data);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['appointments'] });
            queryClient.invalidateQueries({ queryKey: ['booking'] });
        }
    });
};
