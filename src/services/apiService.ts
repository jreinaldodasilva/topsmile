// src/services/apiService.ts
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Array<{ msg: string; param: string }>;
}

interface DashboardStats {
  contacts: {
    total: number;
    byStatus: Array<{ _id: string; count: number }>;
    bySource: Array<{ _id: string; count: number }>;
    recentCount: number;
  };
  summary: {
    totalContacts: number;
    newThisWeek: number;
    activeUsers: string;
    revenue: string;
  };
  user: {
    name: string;
    role: string;
    clinicId?: string;
  };
}

interface Contact {
  id: string;
  name: string;
  email: string;
  clinic: string;
  specialty: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  source: string;
  notes?: string;
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  };
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactListResponse {
  contacts: Contact[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

interface ContactFilters {
  status?: string;
  source?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class ApiService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('topsmile_token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data: any;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          localStorage.removeItem('topsmile_token');
          window.location.href = '/login';
          throw new Error('Sessão expirada. Faça login novamente.');
        }

        // Handle other API errors
        const errorMessage = data?.message || `Erro ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
    }
  }

  // Dashboard APIs
  dashboard = {
    getStats: (): Promise<ApiResponse<DashboardStats>> => {
      return this.request<DashboardStats>('/api/admin/dashboard');
    }
  };

  // Contact APIs
  contacts = {
    getAll: (filters: ContactFilters = {}): Promise<ApiResponse<ContactListResponse>> => {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const queryString = queryParams.toString();
      const endpoint = `/api/admin/contacts${queryString ? `?${queryString}` : ''}`;
      
      return this.request<ContactListResponse>(endpoint);
    },

    getById: (id: string): Promise<ApiResponse<Contact>> => {
      return this.request<Contact>(`/api/admin/contacts/${id}`);
    },

    update: (id: string, updates: Partial<Contact>): Promise<ApiResponse<Contact>> => {
      return this.request<Contact>(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
    },

    delete: (id: string): Promise<ApiResponse<void>> => {
      return this.request<void>(`/api/admin/contacts/${id}`, {
        method: 'DELETE'
      });
    },

    getStats: (): Promise<ApiResponse<{
      total: number;
      byStatus: Array<{ _id: string; count: number }>;
      bySource: Array<{ _id: string; count: number }>;
      recentCount: number;
    }>> => {
      return this.request('/api/admin/contacts/stats');
    }
  };

  // Health check
  health = {
    check: (): Promise<ApiResponse<{
      message: string;
      timestamp: string;
      database: string;
      version: string;
    }>> => {
      return this.request('/api/health');
    },

    database: (): Promise<ApiResponse<{
      database: {
        status: string;
        name?: string;
        host?: string;
        port?: number;
        totalContacts?: number;
      };
    }>> => {
      return this.request('/api/health/database');
    }
  };
}

// Create singleton instance
export const apiService = new ApiService();

// Export types for use in components
export type {
  ApiResponse,
  DashboardStats,
  Contact,
  ContactListResponse,
  ContactFilters
};