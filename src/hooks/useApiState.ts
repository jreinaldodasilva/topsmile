import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { apiService } from '../services/apiService';
import type { Contact, ContactFilters, ContactListResponse, Appointment, AppointmentType, Patient, Provider, FormTemplate, FormResponse } from '../services/apiService';
import type { CalendarEvent } from '../types/api';

/* ---------- React Query Hooks ---------- */

// Contacts
export function useContacts(filters?: ContactFilters, options?: Omit<UseQueryOptions<ContactListResponse | null, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['contacts', filters],
    queryFn: async () => {
      const response = await apiService.contacts.getAll(filters);
      if (response.success) {
        return response.data || null;
      }
      throw new Error(response.message || 'Failed to fetch contacts');
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    ...options,
  });
}

export function useCreateContact(options?: UseMutationOptions<any, Error, Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newContact: Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>) => apiService.contacts.create(newContact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    ...options,
  });
}

export function useUpdateContact(options?: UseMutationOptions<any, Error, { id: string; data: Partial<Contact> }, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Contact> }) =>
      apiService.contacts.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    ...options,
  });
}

export function useDeleteContact(options?: UseMutationOptions<any, Error, string, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.contacts.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    ...options,
  });
}

// Dashboard
export function useDashboard(options?: Omit<UseQueryOptions<any, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const response = await apiService.dashboard.getStats();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Erro ao buscar dados do dashboard');
    },
    ...options,
  });
}

// Appointment Types
export function useAppointmentTypes(filters?: Record<string, any>, options?: Omit<UseQueryOptions<AppointmentType[] | undefined, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['appointmentTypes', filters],
    queryFn: async () => {
      const response = await apiService.appointmentTypes.getAll(filters);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch appointment types');
    },
    ...options,
  });
}

export function useCreateAppointmentType(options?: UseMutationOptions<any, Error, Partial<AppointmentType>, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newType: Partial<AppointmentType>) => apiService.appointmentTypes.create(newType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointmentTypes'] });
    },
    ...options,
  });
}

export function useUpdateAppointmentType(options?: UseMutationOptions<any, Error, { id: string; data: Partial<AppointmentType> }, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AppointmentType> }) => apiService.appointmentTypes.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointmentTypes'] });
    },
    ...options,
  });
}

export function useDeleteAppointmentType(options?: UseMutationOptions<any, Error, string, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.appointmentTypes.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointmentTypes'] });
    },
    ...options,
  });
}

// Appointments
export function useAppointments(filters?: Record<string, any>, options?: Omit<UseQueryOptions<Appointment[] | undefined, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: async () => {
      const response = await apiService.appointments.getAll(filters);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch appointments');
    },
    ...options,
  });
}

export function useCreateAppointment(options?: UseMutationOptions<any, Error, Partial<Appointment>, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newAppointment: Partial<Appointment>) => apiService.appointments.create(newAppointment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    ...options,
  });
}

export function useUpdateAppointment(options?: UseMutationOptions<any, Error, { id: string; data: Partial<Appointment> }, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) => apiService.appointments.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    ...options,
  });
}

export function useDeleteAppointment(options?: UseMutationOptions<any, Error, string, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.appointments.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    ...options,
  });
}

// Patients
export function usePatients(filters?: Record<string, any>, options?: Omit<UseQueryOptions<Patient[] | undefined, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: async () => {
      const response = await apiService.patients.getAll(filters);
      if (response.success) {
        if (Array.isArray(response.data!)) {
          return response.data!;
        } else {
          return response.data!.patients;
        }
      }
      throw new Error(response.message || 'Failed to fetch patients');
    },
    ...options,
  });
}

export function usePatient(id: string, options?: Omit<UseQueryOptions<Patient | undefined, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      const response = await apiService.patients.getOne(id);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch patient');
    },
    enabled: !!id,
    ...options,
  });
}

export function useCreatePatient(options?: UseMutationOptions<any, Error, Partial<Patient>, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPatient: Partial<Patient>) => apiService.patients.create(newPatient),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    ...options,
  });
}

export function useUpdatePatient(options?: UseMutationOptions<any, Error, { id: string; data: Partial<Patient> }, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Patient> }) => apiService.patients.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patient', id] });
    },
    ...options,
  });
}

export function useDeletePatient(options?: UseMutationOptions<any, Error, string, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.patients.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
    },
    ...options,
  });
}

// Providers
export function useProviders(filters?: Record<string, any>, options?: Omit<UseQueryOptions<Provider[] | undefined, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['providers', filters],
    queryFn: async () => {
      const response = await apiService.providers.getAll(filters);
      if (response.success) {
        if (Array.isArray(response.data!)) {
          return response.data!;
        } else {
          return response.data!.providers;
        }
      }
      throw new Error(response.message || 'Failed to fetch providers');
    },
    ...options,
  });
}

export function useProvider(id: string, options?: Omit<UseQueryOptions<Provider | undefined, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['provider', id],
    queryFn: async () => {
      const response = await apiService.providers.getOne(id);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch provider');
    },
    enabled: !!id,
    ...options,
  });
}

export function useCreateProvider(options?: UseMutationOptions<any, Error, Partial<Provider>, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newProvider: Partial<Provider>) => apiService.providers.create(newProvider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
    ...options,
  });
}

export function useUpdateProvider(options?: UseMutationOptions<any, Error, { id: string; data: Partial<Provider> }, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Provider> }) => apiService.providers.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      queryClient.invalidateQueries({ queryKey: ['provider', id] });
    },
    ...options,
  });
}

export function useDeleteProvider(options?: UseMutationOptions<any, Error, string, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiService.providers.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
    ...options,
  });
}

// Forms
export function useFormTemplates(filters?: Record<string, any>, options?: Omit<UseQueryOptions<FormTemplate[] | undefined, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['formTemplates', filters],
    queryFn: async () => {
      const response = await apiService.forms.templates.getAll();
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch form templates');
    },
    ...options,
  });
}

export function useCreateFormTemplate(options?: UseMutationOptions<any, Error, Partial<FormTemplate>, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newTemplate: Partial<FormTemplate>) => apiService.forms.templates.create(newTemplate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formTemplates'] });
    },
    ...options,
  });
}

export function useFormResponses(filters?: Record<string, any>, options?: Omit<UseQueryOptions<FormResponse[] | undefined, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['formResponses', filters],
    queryFn: async () => {
      const response = await apiService.forms.responses.getAll(filters);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch form responses');
    },
    ...options,
  });
}

export function useCreateFormResponse(options?: UseMutationOptions<any, Error, { templateId: string; patientId: string; answers: { [key: string]: string } }, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newResponse: { templateId: string; patientId: string; answers: { [key: string]: string } }) => apiService.forms.responses.create(newResponse),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formResponses'] });
    },
    ...options,
  });
}

// Calendar
export function useCalendarEvents(filters?: Record<string, any>, options?: Omit<UseQueryOptions<CalendarEvent[] | undefined, Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: ['calendarEvents', filters],
    queryFn: async () => {
      const response = await apiService.calendar.getEvents(filters);
      if (response.success) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch calendar events');
    },
    ...options,
  });
}

export function useCreateCalendarEvent(options?: UseMutationOptions<any, Error, Partial<CalendarEvent>, unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newEvent: Partial<CalendarEvent>) => apiService.calendar.createEvent(newEvent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
    },
    ...options,
  });
}