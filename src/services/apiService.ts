// src/services/apiService.ts - Updated for Backend Integration
import { request } from './http';
import type { 
  ApiResult, 
  Contact, 
  ContactFilters, 
  ContactListResponse, 
  DashboardStats, 
  User 
} from '../types/api';

export type { ApiResult, Contact, ContactFilters, ContactListResponse, DashboardStats, User };

// UPDATED: Authentication methods to match backend endpoints
async function login(email: string, password: string): Promise<ApiResult<{ 
  user: User; 
  accessToken: string; 
  refreshToken: string; 
  expiresIn: string; 
}>> {
  const res = await request<{ user: User; accessToken: string; refreshToken: string; expiresIn: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    auth: false
  });
  return { success: res.ok, data: res.data, message: res.message };
}

async function register(payload: { 
  name: string; 
  email: string; 
  password: string;
  clinic?: {
    name: string;
    phone: string;
    address: {
      street: string;
      number?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
  };
}): Promise<ApiResult<{ 
  user: User; 
  accessToken: string; 
  refreshToken: string; 
  expiresIn: string; 
}>> {
  const res = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false
  });
  return { success: res.ok, data: res.data, message: res.message };
}

// UPDATED: Get current user info
async function me(): Promise<ApiResult<User>> {
  const res = await request<User>('/api/auth/me');
  return { success: res.ok, data: res.data, message: res.message };
}

// UPDATED: Refresh token endpoint
async function refreshToken(refreshToken: string): Promise<ApiResult<{
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}>> {
  const res = await request('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
    auth: false
  });
  return { success: res.ok, data: res.data, message: res.message };
}

// UPDATED: Logout with refresh token
async function logout(refreshToken: string): Promise<ApiResult<void>> {
  const res = await request('/api/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
    auth: false
  });
  return { success: res.ok, data: res.data, message: res.message };
}

// UPDATED: Contact management - now uses admin endpoints
async function getContacts(query?: Record<string, any>): Promise<ApiResult<ContactListResponse>> {
  const qs = query
    ? '?' + Object.entries(query)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
    : '';
  
  const res = await request<ContactListResponse>(`/api/admin/contacts${qs}`);
  return { success: res.ok, data: res.data, message: res.message };
}

async function getContact(id: string): Promise<ApiResult<Contact>> {
  const res = await request<Contact>(`/api/admin/contacts/${encodeURIComponent(id)}`);
  return { success: res.ok, data: res.data, message: res.message };
}

async function createContact(payload: Partial<Contact>): Promise<ApiResult<Contact>> {
  const res = await request('/api/admin/contacts', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return { success: res.ok, data: res.data, message: res.message };
}

async function updateContact(id: string, payload: Partial<Contact>): Promise<ApiResult<Contact>> {
  const res = await request(`/api/admin/contacts/${encodeURIComponent(id)}`, {
    method: 'PATCH', // Backend uses PATCH, not PUT
    body: JSON.stringify(payload)
  });
  return { success: res.ok, data: res.data, message: res.message };
}

async function deleteContact(id: string): Promise<ApiResult<void>> {
  const res = await request(`/api/admin/contacts/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  return { success: res.ok, data: res.data, message: res.message };
}

// UPDATED: Dashboard stats endpoint
async function getDashboardStats(): Promise<ApiResult<DashboardStats>> {
  const res = await request<DashboardStats>('/api/admin/dashboard');
  return { success: res.ok, data: res.data, message: res.message };
}

// UPDATED: Contact stats endpoint
async function getContactStats(): Promise<ApiResult<{
  total: number;
  byStatus: Array<{ _id: string; count: number }>;
  bySource: Array<{ _id: string; count: number }>;
  recentCount: number;
  monthlyTrend: Array<{ month: string; count: number }>;
}>> {
  const res = await request('/api/admin/contacts/stats');
  return { success: res.ok, data: res.data, message: res.message };
}

// UPDATED: Public contact form - matches backend validation
async function sendContactForm(payload: { 
  name: string; 
  email: string; 
  clinic: string;
  specialty: string;
  phone: string;
}): Promise<ApiResult<{
  id: string;
  protocol: string;
  estimatedResponse: string;
}>> {
  const res = await request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false
  });
  return { success: res.ok, data: res.data, message: res.message };
}

// ADDED: Batch contact operations
async function batchUpdateContacts(
  contactIds: string[], 
  updates: { status?: string; assignedTo?: string }
): Promise<ApiResult<{ modifiedCount: number; matchedCount: number }>> {
  const res = await request('/api/admin/contacts/batch', {
    method: 'PATCH',
    body: JSON.stringify({ contactIds, updates })
  });
  return { success: res.ok, data: res.data, message: res.message };
}

// ADDED: Find duplicate contacts
async function findDuplicateContacts(): Promise<ApiResult<Array<{
  email: string;
  contacts: Contact[];
  count: number;
}>>> {
  const res = await request('/api/admin/contacts/duplicates');
  return { success: res.ok, data: res.data, message: res.message };
}

// ADDED: Merge duplicate contacts
async function mergeDuplicateContacts(
  primaryContactId: string,
  duplicateContactIds: string[]
): Promise<ApiResult<Contact>> {
  const res = await request('/api/admin/contacts/merge', {
    method: 'POST',
    body: JSON.stringify({ primaryContactId, duplicateContactIds })
  });
  return { success: res.ok, data: res.data, message: res.message };
}

// ADDED: Health check endpoints
async function getHealthStatus(): Promise<ApiResult<{
  timestamp: string;
  uptime: string;
  database: { status: string; name: string };
  memory: { used: string; total: string };
  environment: string;
  version: string;
  nodeVersion: string;
}>> {
  const res = await request('/api/health', { auth: false });
  return { success: res.ok, data: res.data, message: res.message };
}

/**
 * Main API service object with nested structure
 */
export const apiService = {
  auth: { 
    login, 
    register, 
    me, 
    refreshToken,
    logout 
  },
  contacts: {
    getAll: getContacts,
    getOne: getContact,
    create: createContact,
    update: updateContact,
    delete: deleteContact,
    getStats: getContactStats,
    batchUpdate: batchUpdateContacts,
    findDuplicates: findDuplicateContacts,
    mergeDuplicates: mergeDuplicateContacts
  },
  dashboard: { 
    getStats: getDashboardStats 
  },
  public: { 
    sendContactForm 
  },
  system: {
    health: getHealthStatus
  },

  // Flat exports for backward compatibility
  login,
  register,
  me,
  refreshToken,
  logout,
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
  getDashboardStats,
  getContactStats,
  sendContactForm,
  batchUpdateContacts,
  findDuplicateContacts,
  mergeDuplicateContacts,
  getHealthStatus
};

export default apiService;