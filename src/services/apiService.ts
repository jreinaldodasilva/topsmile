// src/services/apiService.ts - Updated for Backend Integration
import { request } from './http';
import { toBackendPatient, fromBackendPatient } from '../utils/mappers';
import { toBackendAppointment, fromBackendAppointment, toBackendContact, fromBackendContact, toBackendProvider, fromBackendProvider } from '../utils/mappers-expanded';
import type {
  ApiResult,
  Contact,
  ContactFilters,
  ContactListResponse,
  DashboardStats,
  User,
  Patient,
  Appointment,
  Provider,
  Clinic,
  AppointmentType,
  CreateFormResponse
} from '../types/api';

export type { ApiResult, Contact, ContactFilters, ContactListResponse, DashboardStats, User, Patient, Appointment, Provider, Clinic, AppointmentType };



export interface FormTemplate {
  _id: string;
  title: string;
  questions: Array<{
    id: string;
    label: string;
    type: string;
    required?: boolean;
    options?: Array<{ value: string; label: string }>;
    // Add other question fields as needed
  }>;
}

export interface FormResponse {
  _id: string;
  templateId: string;
  patientId: string;
  answers: { [key: string]: string };
  submittedAt: string;
}

// UPDATED: Appointments API methods with proper mapping
async function getAppointments(query?: Record<string, any>): Promise<ApiResult<Appointment[]>> {
  const qs = query
    ? '?' + Object.entries(query)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';

  const res = await request<Appointment[]>(`/api/appointments${qs}`);
  if (res.ok && res.data) {
    return { success: true, data: res.data, message: res.message };
  }
  return { success: res.ok, data: res.data, message: res.message };
}

async function getAppointment(id: string): Promise<ApiResult<Appointment>> {
  const res = await request<any>(`/api/appointments/${encodeURIComponent(id)}`);
  if (res.ok && res.data) {
    return { success: true, data: fromBackendAppointment(res.data), message: res.message };
  }
  return { success: res.ok, data: res.data, message: res.message };
}

async function createAppointment(payload: Partial<Appointment>): Promise<ApiResult<Appointment>> {
  const backendPayload = toBackendAppointment(payload as any);

  const res = await request('/api/appointments', {
    method: 'POST',
    body: JSON.stringify(backendPayload)
  });
  if (res.ok && res.data) {
    return { success: true, data: fromBackendAppointment(res.data), message: res.message };
  }
  return { success: res.ok, data: res.data, message: res.message };
}

async function updateAppointment(id: string, payload: Partial<Appointment>): Promise<ApiResult<Appointment>> {
  const backendPayload = toBackendAppointment(payload as any);

  const res = await request(`/api/appointments/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(backendPayload)
  });
  if (res.ok && res.data) {
    return { success: true, data: fromBackendAppointment(res.data), message: res.message };
  }
  return { success: res.ok, data: res.data, message: res.message };
}

// UPDATED: Contact methods with mapping
async function getContact(id: string): Promise<ApiResult<any>> {
  const res = await request<any>(`/api/admin/contacts/${encodeURIComponent(id)}`);
  if (res.ok && res.data) {
    return { success: true, data: fromBackendContact(res.data), message: res.message };
  }
  return { success: res.ok, data: res.data, message: res.message };
}

async function createContact(payload: Partial<any>): Promise<ApiResult<any>> {
  const backendPayload = toBackendContact(payload as any);
  const res = await request('/api/admin/contacts', {
    method: 'POST',
    body: JSON.stringify(backendPayload)
  });
  if (res.ok && res.data) {
    return { success: true, data: fromBackendContact(res.data), message: res.message };
  }
  return { success: res.ok, data: res.data, message: res.message };
}

async function updateContact(id: string, payload: Partial<any>): Promise<ApiResult<any>> {
  const backendPayload = toBackendContact(payload as any);
  const res = await request(`/api/admin/contacts/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(backendPayload)
  });
  if (res.ok && res.data) {
    return { success: true, data: fromBackendContact(res.data), message: res.message };
  }
  return { success: res.ok, data: res.data, message: res.message };
}

// UPDATED: Provider methods with mapping
async function getProvider(id: string): Promise<ApiResult<Provider>> {
  const res = await request<any>(`/api/providers/${encodeURIComponent(id)}`);
  if (res.ok && res.data) {
    return { success: true, data: fromBackendProvider(res.data), message: res.message };
  }
  return { success: res.ok, data: res.data, message: res.message };
}

async function createProvider(payload: Partial<Provider>): Promise<ApiResult<Provider>> {
  const backendPayload = toBackendProvider(payload);
  const res = await request<Provider>(`/api/providers`, {
    method: 'POST',
    body: JSON.stringify(backendPayload),
  });
  if (res.ok && res.data) {
    return { success: true, data: fromBackendProvider(res.data), message: res.message };
  }
  return { success: res.ok, data: res.data, message: res.message };
}

async function updateProvider(id: string, payload: Partial<Provider>): Promise<ApiResult<Provider>> {
  const backendPayload = toBackendProvider(payload);
  const res = await request<Provider>(`/api/providers/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(backendPayload),
  });
  if (res.ok && res.data) {
    return { success: true, data: fromBackendProvider(res.data), message: res.message };
  }
  return { success: res.ok, data: res.data, message: res.message };
}

// UPDATED: Patient methods with mapping
async function getPatient(id: string): Promise<ApiResult<any>> {
  const res = await request<any>(`/api/patients/${encodeURIComponent(id)}`);
  if (res.ok && res.data) {
    return { success: true, data: fromBackendPatient(res.data), message: res.message };
  }
  return { success: res.ok, data: res.data, message: res.message };
}

async function createPatient(payload: Partial<any>): Promise<ApiResult<any>> {
  const backendPayload = toBackendPatient(payload);

  const res = await request<any>(`/api/patients`, {
    method: 'POST',
    body: JSON.stringify(backendPayload),
  });
  if (res.ok && res.data) {
    return { success: true, data: fromBackendPatient(res.data), message: res.message };
  }
  return { success: res.ok, data: res.data, message: res.message };
}

async function updatePatient(id: string, payload: Partial<any>): Promise<ApiResult<any>> {
  const backendPayload = toBackendPatient(payload);

  const res = await request<any>(`/api/patients/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(backendPayload),
  });
  if (res.ok && res.data) {
    return { success: true, data: fromBackendPatient(res.data), message: res.message };
  }
  return { success: res.ok, data: res.data, message: res.message };
}

// Export the updated functions
export {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  getContact,
  createContact,
  updateContact,
  getProvider,
  createProvider,
  updateProvider,
  getPatient,
  createPatient,
  updatePatient
};

// Create the apiService object with hierarchical structure
export const apiService = {
  appointments: {
    getAll: getAppointments,
    getOne: getAppointment,
    create: createAppointment,
    update: updateAppointment,
  },
  contacts: {
    getAll: async (filters?: ContactFilters): Promise<ApiResult<ContactListResponse>> => {
      const qs = filters
        ? '?' + Object.entries(filters)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join('&')
        : '';
      const res = await request<ContactListResponse>(`/api/admin/contacts${qs}`);
      if (res.ok && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: res.ok, data: res.data, message: res.message };
    },
    getOne: getContact,
    create: createContact,
    update: updateContact,
    delete: async (id: string): Promise<ApiResult<void>> => {
      const res = await request(`/api/admin/contacts/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return { success: res.ok, data: undefined, message: res.message };
    },
    batchUpdate: async (contactIds: string[], status: string): Promise<ApiResult<any>> => {
      const res = await request('/api/admin/contacts/batch-update', {
        method: 'PATCH',
        body: JSON.stringify({ contactIds, status })
      });
      if (res.ok && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: res.ok, data: res.data, message: res.message };
    },
    findDuplicates: async (): Promise<ApiResult<any[]>> => {
      const res = await request('/api/admin/contacts/duplicates');
      if (res.ok && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: res.ok, data: res.data, message: res.message };
    },
    mergeDuplicates: async (primaryId: string, duplicateIds: string[]): Promise<ApiResult<any>> => {
      const res = await request('/api/admin/contacts/merge', {
        method: 'POST',
        body: JSON.stringify({ primaryId, duplicateIds })
      });
      if (res.ok && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: res.ok, data: res.data, message: res.message };
    },
  },
  patients: {
    getAll: async (query?: Record<string, any>): Promise<ApiResult<Patient[]>> => {
      const qs = query
        ? '?' + Object.entries(query)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join('&')
        : '';
      const res = await request<Patient[]>(`/api/patients${qs}`);
      if (res.ok && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: res.ok, data: res.data, message: res.message };
    },
    getOne: getPatient,
    create: createPatient,
    update: updatePatient,
    delete: async (id: string): Promise<ApiResult<void>> => {
      const res = await request(`/api/patients/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return { success: res.ok, data: undefined, message: res.message };
    },
  },
  providers: {
    getAll: async (query?: Record<string, any>): Promise<ApiResult<Provider[]>> => {
      const qs = query
        ? '?' + Object.entries(query)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join('&')
        : '';
      const res = await request<Provider[]>(`/api/providers${qs}`);
      if (res.ok && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: res.ok, data: res.data, message: res.message };
    },
    getOne: getProvider,
    create: createProvider,
    update: updateProvider,
    delete: async (id: string): Promise<ApiResult<void>> => {
      const res = await request(`/api/providers/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return { success: res.ok, data: undefined, message: res.message };
    },
  },
  appointmentTypes: {
    getAll: async (query?: Record<string, any>): Promise<ApiResult<AppointmentType[]>> => {
      const qs = query
        ? '?' + Object.entries(query)
            .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
            .join('&')
        : '';
      const res = await request<AppointmentType[]>(`/api/appointment-types${qs}`);
      if (res.ok && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: res.ok, data: res.data, message: res.message };
    },
  },
  auth: {
    login: async (email: string, password: string): Promise<ApiResult<User>> => {
      const res = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.ok && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: res.ok, data: res.data, message: res.message };
    },
    register: async (userData: Partial<User>): Promise<ApiResult<User>> => {
      const res = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (res.ok && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: res.ok, data: res.data, message: res.message };
    },
    me: async (): Promise<ApiResult<User>> => {
      const res = await request('/api/auth/me');
      if (res.ok && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: res.ok, data: res.data, message: res.message };
    },
    forgotPassword: async (email: string): Promise<ApiResult<void>> => {
      const res = await request('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      return { success: res.ok, data: undefined, message: res.message };
    },
    resetPassword: async (token: string, password: string): Promise<ApiResult<void>> => {
      const res = await request('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password })
      });
      return { success: res.ok, data: undefined, message: res.message };
    },
  },
  dashboard: {
    getStats: async (): Promise<ApiResult<DashboardStats>> => {
      const res = await request('/api/dashboard/stats');
      if (res.ok && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: res.ok, data: res.data, message: res.message };
    },
  },
  public: {
    sendContactForm: async (contactData: Partial<Contact>): Promise<ApiResult<void>> => {
      const res = await request('/api/public/contact', {
        method: 'POST',
        body: JSON.stringify(contactData)
      });
      return { success: res.ok, data: undefined, message: res.message };
    },
  },
  system: {
    health: async (): Promise<ApiResult<{ status: string; timestamp: string }>> => {
      const res = await request('/api/health');
      if (res.ok && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: res.ok, data: res.data, message: res.message };
    },
  },
  patientAuth: {
    login: async (email: string, password: string): Promise<ApiResult<any>> => {
      const res = await request('/api/patient-auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.ok && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: res.ok, data: res.data, message: res.message };
    },
    register: async (data: { patientId?: string; name: string; email: string; phone: string; password: string; clinicId: string }): Promise<ApiResult<any>> => {
      const res = await request('/api/patient-auth/register', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (res.ok && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: res.ok, data: res.data, message: res.message };
    },
    me: async (): Promise<ApiResult<any>> => {
      const res = await request('/api/patient-auth/me');
      if (res.ok && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: res.ok, data: res.data, message: res.message };
    },
  },
  forms: {
    templates: {
      getOne: async (id: string): Promise<ApiResult<FormTemplate>> => {
        const res = await request(`/api/forms/templates/${id}`);
        if (res.ok && res.data) {
          return { success: true, data: res.data, message: res.message };
        }
        return { success: res.ok, data: res.data, message: res.message };
      },
    },
    responses: {
      create: async (response: CreateFormResponse): Promise<ApiResult<FormResponse>> => {
        const res = await request('/api/forms/responses', {
          method: 'POST',
          body: JSON.stringify(response)
        });
        if (res.ok && res.data) {
          return { success: true, data: res.data, message: res.message };
        }
        return { success: res.ok, data: res.data, message: res.message };
      },
    },
    submit: async (formData: FormResponse): Promise<ApiResult<any>> => {
      const res = await request('/api/forms/submit', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (res.ok && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: res.ok, data: res.data, message: res.message };
    },
  },
};
