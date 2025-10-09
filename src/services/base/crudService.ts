// src/services/base/crudService.ts
import { request } from '../http';

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function createCrudService<T>(basePath: string) {
  return {
    async getAll(query?: Record<string, any>): Promise<ApiResult<T[]>> {
      const qs = query ? '?' + new URLSearchParams(
        Object.entries(query).reduce((acc, [k, v]) => {
          acc[k] = String(v);
          return acc;
        }, {} as Record<string, string>)
      ).toString() : '';
      
      const response = await request<T[]>(`${basePath}${qs}`);
      return { success: response.ok, data: response.data, message: response.message };
    },

    async getOne(id: string): Promise<ApiResult<T>> {
      const response = await request<T>(`${basePath}/${encodeURIComponent(id)}`);
      return { success: response.ok, data: response.data, message: response.message };
    },

    async create(data: Partial<T>): Promise<ApiResult<T>> {
      const response = await request<T>(basePath, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return { success: response.ok, data: response.data, message: response.message };
    },

    async update(id: string, data: Partial<T>): Promise<ApiResult<T>> {
      const response = await request<T>(`${basePath}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return { success: response.ok, data: response.data, message: response.message };
    },

    async delete(id: string): Promise<ApiResult<void>> {
      const response = await request<void>(`${basePath}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      return { success: response.ok, data: response.data, message: response.message };
    },
  };
}

export function createPaginatedService<T>(basePath: string) {
  const crud = createCrudService<T>(basePath);
  
  return {
    ...crud,
    
    async getPaginated(query?: Record<string, any>): Promise<ApiResult<PaginatedResult<T>>> {
      const qs = query ? '?' + new URLSearchParams(
        Object.entries(query).reduce((acc, [k, v]) => {
          acc[k] = String(v);
          return acc;
        }, {} as Record<string, string>)
      ).toString() : '';
      
      const response = await request<PaginatedResult<T>>(`${basePath}${qs}`);
      return { success: response.ok, data: response.data, message: response.message };
    },
  };
}
