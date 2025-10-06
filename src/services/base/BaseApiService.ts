// src/services/base/BaseApiService.ts
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

interface RequestOptions extends RequestInit {
    params?: Record<string, any>;
}

export class BaseApiService {
    protected baseUrl: string;

    constructor(baseUrl: string = API_URL) {
        this.baseUrl = baseUrl;
    }

    protected getAuthHeaders(): HeadersInit {
        // SECURITY: Tokens in httpOnly cookies, no manual auth header needed
        return {
            'Content-Type': 'application/json'
        };
    }

    protected buildUrl(endpoint: string, params?: Record<string, any>): string {
        const url = `${this.baseUrl}${endpoint}`;
        if (!params) return url;

        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                if (value !== undefined && value !== null) {
                    acc[key] = String(value);
                }
                return acc;
            }, {} as Record<string, string>)
        ).toString();

        return queryString ? `${url}?${queryString}` : url;
    }

    protected async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { params, ...fetchOptions } = options;
        const url = this.buildUrl(endpoint, params);

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                credentials: 'include',
                headers: {
                    ...this.getAuthHeaders(),
                    ...fetchOptions.headers
                }
            });

            const data = await response.json();

            if (!response.ok) {
                const { ErrorInterceptor } = await import('../interceptors/errorInterceptor');
                ErrorInterceptor.handle({
                    status: response.status,
                    message: data.message || data.error || 'Request failed',
                    errors: data.errors
                });
            }

            return data;
        } catch (error: any) {
            if (error.status) {
                throw error;
            }
            throw new Error('Erro de conexão. Verifique sua internet.');
        }
    }

    async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET', params });
    }

    async post<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    async put<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    async patch<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(body)
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}
