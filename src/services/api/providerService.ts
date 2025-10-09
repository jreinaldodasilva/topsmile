// src/services/api/providerService.ts
import { request } from '../http';
import type { ApiResult, Provider } from '@topsmile/types';

export const providerService = {
  getAll: async (query?: Record<string, any>): Promise<ApiResult<Provider[]>> => {
    const qs = query ? '?' + new URLSearchParams(query as any).toString() : '';
    const res = await request<Provider[]>(`/api/providers${qs}`);
    return { success: res.ok, data: res.data, message: res.message };
  },

  getOne: async (id: string): Promise<ApiResult<Provider>> => {
    const res = await request<Provider>(`/api/providers/${id}`);
    return { success: res.ok, data: res.data, message: res.message };
  },

  create: async (payload: Partial<Provider>): Promise<ApiResult<Provider>> => {
    const res = await request<Provider>('/api/providers', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return { success: res.ok, data: res.data, message: res.message };
  },

  update: async (id: string, payload: Partial<Provider>): Promise<ApiResult<Provider>> => {
    const res = await request<Provider>(`/api/providers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
    return { success: res.ok, data: res.data, message: res.message };
  },

  delete: async (id: string): Promise<ApiResult<void>> => {
    const res = await request(`/api/providers/${id}`, { method: 'DELETE' });
    return { success: res.ok, data: undefined, message: res.message };
  }
};
