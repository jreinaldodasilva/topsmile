// src/services/http.ts - Updated for Backend Integration
import { ApiResult } from '@topsmile/types';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const LOGOUT_EVENT = 'topsmile-logout';

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
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(restOfOptions.headers || {})
    });

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
      
      if (res.status === 401 && attempt === 0) {
        // Try token refresh on first 401
        const retryRes = await makeRequest();
        return (await parseResponse(retryRes)) as HttpResponse<T>;
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


