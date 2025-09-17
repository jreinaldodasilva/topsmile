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
  AppointmentType
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
async function getContact(id: string): Promise<ApiResult<Contact>> {
  const res = await request<any>(`/api/admin/contacts/${encodeURIComponent(id)}`);
  if (res.ok && res.data) {
    return { success: true, data: fromBackendContact(res.data), message: res.message };
  }
  return { success: res.ok, data: res.data, message: res.message };
}

async function createContact(payload: Partial<Contact>): Promise<ApiResult<Contact>> {
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

async function updateContact(id: string, payload: Partial<Contact>): Promise<ApiResult<Contact>> {
  const backendPayload = toBackendContact(payload);
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
async function getPatient(id: string): Promise<ApiResult<Patient>> {
  const res = await request<any>(`/api/patients/${encodeURIComponent(id)}`);
  if (res.ok && res.data) {
    return { success: true, data: fromBackendPatient ? fromBackendPatient(res.data) : res.data, message: res.message };
  }
  return { success: res.ok, data: res.data, message: res.message };
}

async function createPatient(payload: Partial<Patient>): Promise<ApiResult<Patient>> {
  const backendPayload = toBackendPatient(payload);

  const res = await request<Patient>(`/api/patients`, {
    method: 'POST',
    body: JSON.stringify(backendPayload),
  });
  if (res.ok && res.data) {
    return { success: true, data: fromBackendPatient ? fromBackendPatient(res.data) : res.data, message: res.message };
  }
  return { success: res.ok, data: res.data, message: res.message };
}

async function updatePatient(id: string, payload: Partial<Patient>): Promise<ApiResult<Patient>> {
  const backendPayload = toBackendPatient(payload);

  const res = await request<Patient>(`/api/patients/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(backendPayload),
  });
  if (res.ok && res.data) {
    return { success: true, data: fromBackendPatient ? fromBackendPatient(res.data) : res.data, message: res.message };
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

export {};
