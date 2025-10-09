// src/services/api/appointmentService.ts
import { request } from '../http';
import type { ApiResult, Appointment, CreateAppointmentDTO } from '@topsmile/types';

export const appointmentService = {
  getAll: async (query?: Record<string, any>): Promise<ApiResult<Appointment[]>> => {
    const qs = query ? '?' + new URLSearchParams(query as any).toString() : '';
    const res = await request<Appointment[]>(`/api/appointments${qs}`);
    return { success: res.ok, data: res.data, message: res.message };
  },

  getOne: async (id: string): Promise<ApiResult<Appointment>> => {
    const res = await request<Appointment>(`/api/appointments/${id}`);
    return { success: res.ok, data: res.data, message: res.message };
  },

  create: async (payload: CreateAppointmentDTO): Promise<ApiResult<Appointment>> => {
    const res = await request('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return { success: res.ok, data: res.data, message: res.message };
  },

  update: async (id: string, payload: Partial<Appointment>): Promise<ApiResult<Appointment>> => {
    const res = await request(`/api/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
    return { success: res.ok, data: res.data, message: res.message };
  },

  delete: async (id: string): Promise<ApiResult<void>> => {
    const res = await request(`/api/appointments/${id}`, { method: 'DELETE' });
    return { success: res.ok, data: undefined, message: res.message };
  }
};
