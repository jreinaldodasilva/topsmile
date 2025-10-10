import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { apiService } from '../services/apiService';
import type { Appointment, Provider, AppointmentType, ApiResult, CreateAppointmentDTO } from '@topsmile/types';

// Appointment Types
export const useAppointmentTypes = (query?: Record<string, any>) => {
  return useQuery<ApiResult<AppointmentType[]>>({
    queryKey: ['appointmentTypes', query],
    queryFn: () => apiService.appointmentTypes.getAll(query),
  });
};

// Providers
export const useProviders = (query?: Record<string, any>) => {
  return useQuery<ApiResult<Provider[]>>({
    queryKey: ['providers', query],
    queryFn: () => apiService.providers.getAll(query),
  });
};

// Appointments
export const useAppointments = (
  query?: Record<string, any>, 
  options?: Omit<UseQueryOptions<ApiResult<Appointment[]>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<ApiResult<Appointment[]>>({
    queryKey: ['appointments', query],
    queryFn: () => apiService.appointments.getAll(query),
    ...options,
  });
};

// Create Appointment Mutation
export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResult<Appointment>, Error, Partial<CreateAppointmentDTO>>({
    mutationFn: (appointment) => apiService.appointments.create(appointment as CreateAppointmentDTO),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
