import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/apiService';
import type { ContactFilters, Contact, Patient, Provider, Appointment } from '@topsmile/types';

// Query keys for consistent caching
export const queryKeys = {
  contacts: (filters?: ContactFilters) => ['contacts', filters],
  contact: (id: string) => ['contact', id],
  patients: (filters?: any) => ['patients', filters],
  patient: (id: string) => ['patient', id],
  providers: (filters?: any) => ['providers', filters],
  provider: (id: string) => ['provider', id],
  appointments: (filters?: any) => ['appointments', filters],
  appointment: (id: string) => ['appointment', id],
  dashboardStats: () => ['dashboard', 'stats'],
} as const;

// Contacts hooks
export const useContacts = (filters?: ContactFilters) => {
  return useQuery({
    queryKey: queryKeys.contacts(filters),
    queryFn: () => apiService.contacts.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
};

export const useContact = (id: string) => {
  return useQuery({
    queryKey: queryKeys.contact(id),
    queryFn: () => apiService.contacts.getOne(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Contact>) => apiService.contacts.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Contact> }) => 
      apiService.contacts.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
      queryClient.invalidateQueries({ queryKey: ['contact', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

// Patients hooks
export const usePatients = (filters?: any) => {
  return useQuery({
    queryKey: queryKeys.patients(filters),
    queryFn: () => apiService.patients.getAll(filters),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => apiService.patients.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
  });
};

// Dashboard hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.dashboardStats(),
    queryFn: () => apiService.dashboard.getStats(),
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
  });
};