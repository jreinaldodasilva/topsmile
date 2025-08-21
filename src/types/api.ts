// frontend/src/services/api.ts
import axios from 'axios';
const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || '' });
export default api;

export type ApiResult<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
};

export type Contact = {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  status?: string; // optional status used in admin UI
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
};

export type ContactFilters = {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  [key: string]: any;
};

export type ContactListResponse = {
  contacts: Contact[];
  total?: number;
  pages?: number;
  [key: string]: any;
};

export type DashboardStats = {
  totalContacts: number;
  newThisMonth: number;
  [key: string]: number;
};

export type User = {
  _id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
};
