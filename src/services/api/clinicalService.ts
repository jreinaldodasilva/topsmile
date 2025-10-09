// src/services/api/clinicalService.ts
import { request } from '../http';
import type { ApiResult } from '@topsmile/types';

export const clinicalService = {
  dentalCharts: {
    getLatest: async (patientId: string): Promise<ApiResult<any>> => {
      const res = await request(`/api/clinical/dental-charts/patient/${patientId}/latest`);
      return { success: res.ok, data: res.data, message: res.message };
    },
    getHistory: async (patientId: string): Promise<ApiResult<any[]>> => {
      const res = await request(`/api/clinical/dental-charts/patient/${patientId}`);
      return { success: res.ok, data: res.data, message: res.message };
    },
    getOne: async (id: string): Promise<ApiResult<any>> => {
      const res = await request(`/api/clinical/dental-charts/${id}`);
      return { success: res.ok, data: res.data, message: res.message };
    },
    create: async (data: any): Promise<ApiResult<any>> => {
      const res = await request('/api/clinical/dental-charts', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return { success: res.ok, data: res.data, message: res.message };
    },
    update: async (id: string, data: any): Promise<ApiResult<any>> => {
      const res = await request(`/api/clinical/dental-charts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return { success: res.ok, data: res.data, message: res.message };
    },
    delete: async (id: string): Promise<ApiResult<void>> => {
      const res = await request(`/api/clinical/dental-charts/${id}`, { method: 'DELETE' });
      return { success: res.ok, data: undefined, message: res.message };
    }
  },

  treatmentPlans: {
    getAll: async (patientId: string): Promise<ApiResult<any[]>> => {
      const res = await request(`/api/clinical/treatment-plans/patient/${patientId}`);
      return { success: res.ok, data: res.data, message: res.message };
    },
    getOne: async (id: string): Promise<ApiResult<any>> => {
      const res = await request(`/api/clinical/treatment-plans/${id}`);
      return { success: res.ok, data: res.data, message: res.message };
    },
    create: async (data: any): Promise<ApiResult<any>> => {
      const res = await request('/api/clinical/treatment-plans', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return { success: res.ok, data: res.data, message: res.message };
    },
    update: async (id: string, data: any): Promise<ApiResult<any>> => {
      const res = await request(`/api/clinical/treatment-plans/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return { success: res.ok, data: res.data, message: res.message };
    }
  },

  clinicalNotes: {
    getAll: async (patientId: string): Promise<ApiResult<any[]>> => {
      const res = await request(`/api/clinical/clinical-notes/patient/${patientId}`);
      return { success: res.ok, data: res.data, message: res.message };
    },
    getOne: async (id: string): Promise<ApiResult<any>> => {
      const res = await request(`/api/clinical/clinical-notes/${id}`);
      return { success: res.ok, data: res.data, message: res.message };
    },
    create: async (data: any): Promise<ApiResult<any>> => {
      const res = await request('/api/clinical/clinical-notes', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return { success: res.ok, data: res.data, message: res.message };
    },
    update: async (id: string, data: any): Promise<ApiResult<any>> => {
      const res = await request(`/api/clinical/clinical-notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return { success: res.ok, data: res.data, message: res.message };
    }
  },

  prescriptions: {
    getAll: async (patientId: string): Promise<ApiResult<any[]>> => {
      const res = await request(`/api/clinical/prescriptions/patient/${patientId}`);
      return { success: res.ok, data: res.data, message: res.message };
    },
    getOne: async (id: string): Promise<ApiResult<any>> => {
      const res = await request(`/api/clinical/prescriptions/${id}`);
      return { success: res.ok, data: res.data, message: res.message };
    },
    create: async (data: any): Promise<ApiResult<any>> => {
      const res = await request('/api/clinical/prescriptions', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return { success: res.ok, data: res.data, message: res.message };
    },
    update: async (id: string, data: any): Promise<ApiResult<any>> => {
      const res = await request(`/api/clinical/prescriptions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return { success: res.ok, data: res.data, message: res.message };
    }
  }
};
