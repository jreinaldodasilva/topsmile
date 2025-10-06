// src/services/http.ts - Updated for Backend Integration
import { ApiResult } from '@topsmile/types';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const LOGOUT_EVENT = 'topsmile-logout';

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];
let csrfToken: string | null = null;

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach(cb => cb(token));
  refreshSubscribers = [];
};

// Test credentials from environment
const TEST_CREDENTIALS = {
  email: process.env.REACT_APP_TEST_EMAIL || 'test@example.com',
  password: process.env.REACT_APP_TEST_PASSWORD || 'TestPassword123!'
};

export interface HttpResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  message?: string;
}

type RequestOptions = RequestInit & { auth?: boolean };



/** Parse response to match backend format */
async function parseResponse(res: Response): Promise<HttpResponse> {
  const text = await res.text();
  let payload: any = undefined;
  
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch (e) {
      payload = { message: text };
    }
  }

  if (!res.ok) {
    return { 
      ok: false, 
      status: res.status, 
      data: payload?.data, 
      message: payload?.message || res.statusText 
    };
  }

  return { 
    ok: true, 
    status: res.status, 
    data: payload?.data || payload,
    message: payload?.message 
  };
}

/** Standardize API response handling */
const handleApiResponse = <T>(response: HttpResponse): ApiResult<T> => {
  return {
    success: response.ok,
    data: response.data,
    message: response.message,
    errors: response.ok ? undefined : [{ msg: response.message || 'Unknown error', param: 'general' }]
  };
};



// Add request interceptor
const requestInterceptor = (config: RequestInit): RequestInit => {
  // Add correlation ID for tracking
  const correlationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  config.headers = {
    ...config.headers,
    'X-Correlation-ID': correlationId,
    'X-Client-Version': process.env.REACT_APP_VERSION || '1.0.0'
  };
  
  // Log request in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[API Request] ${correlationId}:`, config);
  }
  
  return config;
};

/** Enhanced request function with multi-context auth and retry logic */
export async function request<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<HttpResponse<T>> {
  const { auth = true, ...restOfOptions } = options;
  const maxRetries = 3;

  const makeRequest = async () => {
    // Fetch CSRF token if needed for state-changing operations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(restOfOptions.method || 'GET') && !csrfToken) {
      try {
        const csrfRes = await fetch(`${API_BASE_URL}/api/csrf-token`, { credentials: 'include' });
        if (csrfRes.ok) {
          const data = await csrfRes.json();
          csrfToken = data.csrfToken;
        }
      } catch (e) {
        console.warn('Failed to fetch CSRF token:', e);
      }
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
      ...(restOfOptions.headers as Record<string, string> || {})
    };

    let config: RequestInit = {
      ...restOfOptions,
      headers,
      credentials: 'include',
      body: restOfOptions.body ?? undefined
    };

    config = requestInterceptor(config);
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    try {
      const res = await fetch(url, config);
      return res;
    } catch (networkError) {
      throw new Error('Network request failed');
    }
  };

  // Retry logic for network failures
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await makeRequest();
      
      if (res.status === 401 && attempt === 0 && !endpoint.includes('/auth/refresh')) {
        // Try token refresh on first 401
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }
            });
            
            if (refreshRes.ok) {
              isRefreshing = false;
              onRefreshed('refreshed');
              // Retry original request
              const retryRes = await makeRequest();
              return (await parseResponse(retryRes)) as HttpResponse<T>;
            } else {
              isRefreshing = false;
              // Refresh failed, trigger logout
              window.dispatchEvent(new CustomEvent(LOGOUT_EVENT, { detail: { key: 'default' } }));
              return (await parseResponse(res)) as HttpResponse<T>;
            }
          } catch (refreshError) {
            isRefreshing = false;
            window.dispatchEvent(new CustomEvent(LOGOUT_EVENT, { detail: { key: 'default' } }));
            return (await parseResponse(res)) as HttpResponse<T>;
          }
        } else {
          // Wait for refresh to complete
          return new Promise((resolve) => {
            subscribeTokenRefresh(async () => {
              const retryRes = await makeRequest();
              resolve((await parseResponse(retryRes)) as HttpResponse<T>);
            });
          });
        }
      }

      return (await parseResponse(res)) as HttpResponse<T>;
      
    } catch (err: any) {
      if (attempt === maxRetries) {
        if (err instanceof TypeError && err.message.includes('fetch')) {
          throw new Error('Unable to connect to server. Please check your internet connection.');
        }
        throw err instanceof Error ? err : new Error('An unknown network error occurred');
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }

  throw new Error('Request failed after multiple attempts');
}

/** Logout function */
export async function logout(): Promise<void> {
  const logoutUrl = '/api/auth/logout';

  try {
    await fetch(`${API_BASE_URL}${logoutUrl}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.warn('Failed to notify backend about logout:', error);
  }
  
  window.dispatchEvent(new CustomEvent(LOGOUT_EVENT, { detail: { key: 'default' } }));
}

export async function patientLogout(): Promise<void> {
  const logoutUrl = '/api/patient-auth/logout';

  try {
    await fetch(`${API_BASE_URL}${logoutUrl}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.warn('Failed to notify patient backend about logout:', error);
  }
  
  window.dispatchEvent(new CustomEvent(LOGOUT_EVENT, { detail: { key: 'patient' } }));
}


