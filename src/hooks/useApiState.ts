// src/hooks/useApiState.ts
import { useState, useCallback } from 'react';
import type { Contact } from '../types/api';

/**
 * Lightweight reusable API state hook.
 * - execute takes an apiCall function and manages loading / error / data
 * - Designed to be simple and composable for specialized hooks below
 */

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiStateReturn<T> extends ApiState<T> {
  execute: (apiCall: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
}

export function useApiState<T = any>(initialData: T | null = null): UseApiStateReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null
  });

  const execute = useCallback(async (apiCall: () => Promise<T>): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      setState(prev => ({ ...prev, data: result, loading: false }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      console.error('API Error:', error);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setData,
    setError
  };
}

/* ---------- Specialized hooks that use the `apiService` shape ---------- */

export function useDashboard() {
  const { data: stats, loading, error, execute, reset, setData } = useApiState<any>(null);

  const fetchDashboardData = useCallback(async () => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    return execute(async () => {
      const response = await svc.dashboard.getStats();
      // UPDATED: Handle new backend response format
      if (response.success && response.data) {
        setData(response.data);
        return response.data;
      }
      throw new Error(response.message || 'Erro ao buscar dados do dashboard');
    });
  }, [execute, setData]);

  return {
    stats,
    loading,
    error,
    fetchDashboardData,
    reset
  };
}

export function useContacts() {
  // contactsData can be either an array of contacts or an envelope { contacts: Contact[], total?: number }
  type ContactsState = Contact[] | { contacts: Contact[]; total?: number } | null;

  const { data: contactsData, loading, error, execute, setData, setError } = useApiState<ContactsState>(null);

  const fetchContacts = useCallback(async (filters: Record<string, any> = {}, sort: Record<string, any> = {}) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    return execute(async () => {
      const response = await svc.contacts.getAll({ ...filters, ...sort });
      // normalize: if server returns array, keep array; else if returns envelope, return envelope
      return response.data ?? null;
    });
  }, [execute]);

  const updateContact = useCallback(async (id: string, updates: Partial<Contact>) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      const response = await svc.contacts.update(id, updates);
      const updated = response.data ?? null;

      // Update local state if present
      if (contactsData) {
        if (Array.isArray(contactsData)) {
          const updatedArr = (contactsData as Contact[]).map(c => ((c._id === id || (c as any).id === id) ? { ...c, ...(updated ?? {}) } : c));
          setData(updatedArr as unknown as ContactsState);
        } else if ('contacts' in (contactsData as any) && Array.isArray((contactsData as any).contacts)) {
          const env = contactsData as { contacts: Contact[]; total?: number };
          const updatedArr = env.contacts.map(c => ((c._id === id || (c as any).id === id) ? { ...c, ...(updated ?? {}) } : c));
          setData({ ...env, contacts: updatedArr } as ContactsState);
        }
      }

      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao atualizar contato';
      setError(msg);
      throw err;
    }
  }, [contactsData, setData, setError]);

  const deleteContact = useCallback(async (id: string) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      await svc.contacts.delete(id);

      if (contactsData) {
        if (Array.isArray(contactsData)) {
          const updatedArr = (contactsData as Contact[]).filter(c => (c._id !== id && (c as any).id !== id));
          setData(updatedArr as unknown as ContactsState);
        } else if ('contacts' in (contactsData as any) && Array.isArray((contactsData as any).contacts)) {
          const env = contactsData as { contacts: Contact[]; total?: number };
          const updatedArr = env.contacts.filter(c => (c._id !== id && (c as any).id !== id));
          setData({ ...env, contacts: updatedArr, total: typeof env.total === 'number' ? Math.max(0, env.total - 1) : env.total } as ContactsState);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir contato';
      setError(msg);
      throw err;
    }
  }, [contactsData, setData, setError]);

  const createContact = useCallback(async (contact: Omit<Contact, '_id' | 'createdAt' | 'updatedAt'>) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      const response = await svc.contacts.create(contact);
      const newContact = response.data ?? null;

      if (newContact && contactsData) {
        if (Array.isArray(contactsData)) {
          setData([newContact, ...contactsData] as unknown as ContactsState);
        } else if ('contacts' in (contactsData as any) && Array.isArray((contactsData as any).contacts)) {
          const env = contactsData as { contacts: Contact[]; total?: number };
          setData({ ...env, contacts: [newContact, ...env.contacts], total: typeof env.total === 'number' ? env.total + 1 : env.total } as ContactsState);
        }
      }

      return newContact;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar contato';
      setError(msg);
      throw err;
    }
  }, [contactsData, setData, setError]);

  return {
    contactsData,
    loading,
    error,
    fetchContacts,
    updateContact,
    deleteContact,
    createContact
  };
}

export function useAppointmentTypes() {
  const { data: appointmentTypes, loading, error, execute, setData, setError } = useApiState<any[]>([]);

  const fetchAppointmentTypes = useCallback(async (filters: Record<string, any> = {}) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    return execute(async () => {
      const response = await svc.appointmentTypes.getAll(filters);
      return response.data ?? [];
    });
  }, [execute]);

  const createAppointmentType = useCallback(async (appointmentType: any) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      const response = await svc.appointmentTypes.create(appointmentType);
      const newType = response.data ?? null;

      if (newType && appointmentTypes) {
        setData([newType, ...appointmentTypes]);
      }

      return newType;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar tipo de agendamento';
      setError(msg);
      throw err;
    }
  }, [appointmentTypes, setData, setError]);

  const updateAppointmentType = useCallback(async (id: string, updates: any) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      const response = await svc.appointmentTypes.update(id, updates);
      const updated = response.data ?? null;

      if (appointmentTypes) {
        const updatedArr = appointmentTypes.map((at: any) => (at._id === id || at.id === id ? { ...at, ...updated } : at));
        setData(updatedArr);
      }

      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao atualizar tipo de agendamento';
      setError(msg);
      throw err;
    }
  }, [appointmentTypes, setData, setError]);

  const deleteAppointmentType = useCallback(async (id: string) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      await svc.appointmentTypes.delete(id);

      if (appointmentTypes) {
        const updatedArr = appointmentTypes.filter((at: any) => at._id !== id && at.id !== id);
        setData(updatedArr);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir tipo de agendamento';
      setError(msg);
      throw err;
    }
  }, [appointmentTypes, setData, setError]);

  return {
    appointmentTypes,
    loading,
    error,
    fetchAppointmentTypes,
    createAppointmentType,
    updateAppointmentType,
    deleteAppointmentType
  };
}

export function useAppointments() {
  const { data: appointments, loading, error, execute, setData, setError } = useApiState<any[]>([]);

  const fetchAppointments = useCallback(async (filters: Record<string, any> = {}) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    return execute(async () => {
      const response = await svc.appointments.getAll(filters);
      return response.data ?? [];
    });
  }, [execute]);

  const createAppointment = useCallback(async (appointment: any) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      const response = await svc.appointments.create(appointment);
      const newAppointment = response.data ?? null;

      if (newAppointment && appointments) {
        setData([newAppointment, ...appointments]);
      }

      return newAppointment;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar agendamento';
      setError(msg);
      throw err;
    }
  }, [appointments, setData, setError]);

  const updateAppointment = useCallback(async (id: string, updates: any) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      const response = await svc.appointments.update(id, updates);
      const updated = response.data ?? null;

      if (appointments) {
        const updatedArr = appointments.map((appt: any) => (appt._id === id || appt.id === id ? { ...appt, ...updated } : appt));
        setData(updatedArr);
      }

      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao atualizar agendamento';
      setError(msg);
      throw err;
    }
  }, [appointments, setData, setError]);

  const deleteAppointment = useCallback(async (id: string) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      await svc.appointments.delete(id);

      if (appointments) {
        const updatedArr = appointments.filter((appt: any) => appt._id !== id && appt.id !== id);
        setData(updatedArr);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir agendamento';
      setError(msg);
      throw err;
    }
  }, [appointments, setData, setError]);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
  };
}

export function usePatients() {
  const { data: patients, loading, error, execute, setData, setError } = useApiState<any[]>([]);

  const fetchPatients = useCallback(async (filters: Record<string, any> = {}) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    return execute(async () => {
      const response = await svc.patients.getAll(filters);
      return response.data ?? [];
    });
  }, [execute]);

  const getPatient = useCallback(async (id: string) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    return execute(async () => {
      const response = await svc.patients.getOne(id);
      return response.data ?? null;
    });
  }, [execute]);

  const createPatient = useCallback(async (patient: any) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      const response = await svc.patients.create(patient);
      const newPatient = response.data ?? null;

      if (newPatient && patients) {
        setData([newPatient, ...patients]);
      }

      return newPatient;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar paciente';
      setError(msg);
      throw err;
    }
  }, [patients, setData, setError]);

  const updatePatient = useCallback(async (id: string, updates: any) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      const response = await svc.patients.update(id, updates);
      const updated = response.data ?? null;

      if (patients) {
        const updatedArr = patients.map((pt: any) => (pt._id === id || pt.id === id ? { ...pt, ...updated } : pt));
        setData(updatedArr);
      }

      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao atualizar paciente';
      setError(msg);
      throw err;
    }
  }, [patients, setData, setError]);

  const deletePatient = useCallback(async (id: string) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      await svc.patients.delete(id);

      if (patients) {
        const updatedArr = patients.filter((pt: any) => pt._id !== id && pt.id !== id);
        setData(updatedArr);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir paciente';
      setError(msg);
      throw err;
    }
  }, [patients, setData, setError]);

  return {
    patients,
    loading,
    error,
    fetchPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient
  };
}

export function useProviders() {
  const { data: providers, loading, error, execute, setData, setError } = useApiState<any[]>([]);

  const fetchProviders = useCallback(async (filters: Record<string, any> = {}) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    return execute(async () => {
      const response = await svc.providers.getAll(filters);
      return response.data ?? [];
    });
  }, [execute]);

  const getProvider = useCallback(async (id: string) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    return execute(async () => {
      const response = await svc.providers.getOne(id);
      return response.data ?? null;
    });
  }, [execute]);

  const createProvider = useCallback(async (provider: any) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      const response = await svc.providers.create(provider);
      const newProvider = response.data ?? null;

      if (newProvider && providers) {
        setData([newProvider, ...providers]);
      }

      return newProvider;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar profissional';
      setError(msg);
      throw err;
    }
  }, [providers, setData, setError]);

  const updateProvider = useCallback(async (id: string, updates: any) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      const response = await svc.providers.update(id, updates);
      const updated = response.data ?? null;

      if (providers) {
        const updatedArr = providers.map((prov: any) => (prov._id === id || prov.id === id ? { ...prov, ...updated } : prov));
        setData(updatedArr);
      }

      return updated;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao atualizar profissional';
      setError(msg);
      throw err;
    }
  }, [providers, setData, setError]);

  const deleteProvider = useCallback(async (id: string) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      await svc.providers.delete(id);

      if (providers) {
        const updatedArr = providers.filter((prov: any) => prov._id !== id && prov.id !== id);
        setData(updatedArr);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir profissional';
      setError(msg);
      throw err;
    }
  }, [providers, setData, setError]);

  return {
    providers,
    loading,
    error,
    fetchProviders,
    getProvider,
    createProvider,
    updateProvider,
    deleteProvider
  };
}

export function useForms() {
  const { data: formTemplates, loading: templatesLoading, error: templatesError, execute: executeTemplates, setData: setTemplates, setError: setTemplatesError } = useApiState<any[]>([]);
  const { data: formResponses, loading: responsesLoading, error: responsesError, execute: executeResponses, setData: setResponses, setError: setResponsesError } = useApiState<any[]>([]);

  const fetchFormTemplates = useCallback(async (filters: Record<string, any> = {}) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    return executeTemplates(async () => {
      const response = await svc.forms.templates.getAll(filters);
      return response.data ?? [];
    });
  }, [executeTemplates]);

  const createFormTemplate = useCallback(async (template: any) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      const response = await svc.forms.templates.create(template);
      const newTemplate = response.data ?? null;

      if (newTemplate && formTemplates) {
        setTemplates([newTemplate, ...formTemplates]);
      }

      return newTemplate;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar template de formulário';
      setTemplatesError(msg);
      throw err;
    }
  }, [formTemplates, setTemplates, setTemplatesError]);

  const fetchFormResponses = useCallback(async (filters: Record<string, any> = {}) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    return executeResponses(async () => {
      const response = await svc.forms.responses.getAll(filters);
      return response.data ?? [];
    });
  }, [executeResponses]);

  const createFormResponse = useCallback(async (response: any) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      const responseData = await svc.forms.responses.create(response);
      const newResponse = responseData.data ?? null;

      if (newResponse && formResponses) {
        setResponses([newResponse, ...formResponses]);
      }

      return newResponse;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao enviar resposta do formulário';
      setResponsesError(msg);
      throw err;
    }
  }, [formResponses, setResponses, setResponsesError]);

  return {
    formTemplates,
    templatesLoading,
    templatesError,
    fetchFormTemplates,
    createFormTemplate,
    formResponses,
    responsesLoading,
    responsesError,
    fetchFormResponses,
    createFormResponse
  };
}

export function useCalendar() {
  const { data: calendarEvents, loading, error, execute, setData, setError } = useApiState<any[]>([]);

  const fetchCalendarEvents = useCallback(async (filters: Record<string, any> = {}) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    return execute(async () => {
      const response = await svc.calendar.getEvents(filters);
      return response.data ?? [];
    });
  }, [execute]);

  const createCalendarEvent = useCallback(async (event: any) => {
    const mod = await import('../services/apiService');
    const svc = (mod as any).apiService ?? mod.default;
    try {
      const response = await svc.calendar.createEvent(event);
      const newEvent = response.data ?? null;

      if (newEvent && calendarEvents) {
        setData([newEvent, ...calendarEvents]);
      }

      return newEvent;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar evento no calendário';
      setError(msg);
      throw err;
    }
  }, [calendarEvents, setData, setError]);

  return {
    calendarEvents,
    loading,
    error,
    fetchCalendarEvents,
    createCalendarEvent
  };
}
