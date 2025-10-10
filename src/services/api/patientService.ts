// src/services/api/patientService.ts
import { request } from '../http';
import type { ApiResult, Patient, CreatePatientDTO } from '@topsmile/types';

export const patientService = {
    getAll: async (query?: Record<string, any>): Promise<ApiResult<Patient[]>> => {
        const qs = query ? '?' + new URLSearchParams(query as any).toString() : '';
        const res = await request<Patient[]>(`/api/patients${qs}`);
        return { success: res.ok, data: res.data, message: res.message };
    },

    getOne: async (id: string): Promise<ApiResult<Patient>> => {
        const res = await request<Patient>(`/api/patients/${id}`);
        return { success: res.ok, data: res.data, message: res.message };
    },

    create: async (payload: CreatePatientDTO): Promise<ApiResult<Patient>> => {
        const res = await request<Patient>('/api/patients', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        return { success: res.ok, data: res.data, message: res.message };
    },

    update: async (id: string, payload: Partial<Patient>): Promise<ApiResult<Patient>> => {
        const res = await request<Patient>(`/api/patients/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(payload)
        });
        return { success: res.ok, data: res.data, message: res.message };
    },

    delete: async (id: string): Promise<ApiResult<void>> => {
        const res = await request(`/api/patients/${id}`, { method: 'DELETE' });
        return { success: res.ok, data: undefined, message: res.message };
    }
};
