import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/apiService';
import type { Appointment, Provider, AppointmentType } from '@topsmile/types';


// Appointment Types
export const useAppointmentTypes = (query?: Record<string, any>) => {
  return useQuery({
    queryKey: ['appointmentTypes', query],
    queryFn: () => apiService.appointmentTypes.getAll(query),
  });
};

// Providers
export const useProviders = (query?: Record<string, any>) => {
  return useQuery({
    queryKey: ['providers', query],
    queryFn: () => apiService.providers.getAll(query),
  });
};

// Appointments
export const useAppointments = (query?: Record<string, any>, options?: any) => {
  return useQuery<any>({
    queryKey: ['appointments', query],
    queryFn: () => apiService.appointments.getAll(query),
    ...options,
  });
};

// Create Appointment Mutation
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appointment: any) => apiService.appointments.create(appointment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
