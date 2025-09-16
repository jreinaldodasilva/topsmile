// src/services/http.ts - Updated for Backend Integration
import { tokenStore } from './tokenStore';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const LOGOUT_EVENT = 'topsmile-logout';

export interface HttpResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  message?: string;
}

type RequestOptions = RequestInit & { auth?: boolean };

function getTokenKey(endpoint: string): string {
  if (endpoint.startsWith('/api/patient-auth')) {
    return 'patient';
  }
  return 'default';
}

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

const refreshingPromise: { [key: string]: Promise<void> | null } = {
  default: null,
  patient: null,
};

/** Perform token refresh for a given context */
async function performRefresh(tokenKey: string): Promise<void> {
  const refreshToken = tokenStore.getRefreshToken(tokenKey);
  if (!refreshToken) throw new Error('No refresh token available');

  const refreshUrl = tokenKey === 'patient' ? '/api/patient-auth/refresh' : '/api/auth/refresh';
  const url = `${API_BASE_URL}${refreshUrl}`;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  const parsedResponse = await parseResponse(res);

  if (!parsedResponse.ok) {
    tokenStore.clear(tokenKey);
    window.dispatchEvent(new CustomEvent(LOGOUT_EVENT, { detail: { key: tokenKey } }));
    throw new Error(parsedResponse.message || 'Failed to refresh token');
  }

  const { data } = parsedResponse;
  if (!data?.accessToken || !data?.refreshToken) {
    throw new Error('Refresh response missing tokens');
  }

  tokenStore.setTokens(data.accessToken, data.refreshToken, tokenKey);
}

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

/** Enhanced request function with multi-context auth */
export async function request<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<HttpResponse<T>> {
  const { auth = true, ...restOfOptions } = options;
  const tokenKey = getTokenKey(endpoint);

  const makeRequest = async (token?: string | null) => {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...(restOfOptions.headers || {})
    });

    if (auth && token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    let config: RequestInit = {
      ...restOfOptions,
      headers,
      body: restOfOptions.body ?? undefined
    };

    config = requestInterceptor(config);

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    try {
      const res = await fetch(url, config);
      return res;
    } catch (networkError) {
      throw new Error('Network error - please check your connection');
    }
  };

  try {
    let accessToken = tokenStore.getAccessToken(tokenKey);

    if (!accessToken && tokenStore.getRefreshToken(tokenKey)) {
      await performRefresh(tokenKey);
      accessToken = tokenStore.getAccessToken(tokenKey);
    }

    const res = await makeRequest(accessToken);
    
    if (res.status !== 401) {
      return (await parseResponse(res)) as HttpResponse<T>;
    }

    if (!refreshingPromise[tokenKey]) {
      refreshingPromise[tokenKey] = performRefresh(tokenKey)
        .catch((err) => {
          refreshingPromise[tokenKey] = null;
          throw err;
        })
        .finally(() => {
          refreshingPromise[tokenKey] = null;
        });
    }

    await refreshingPromise[tokenKey];

    const newAccess = tokenStore.getAccessToken(tokenKey);
    const retryRes = await makeRequest(newAccess);
    return (await parseResponse(retryRes)) as HttpResponse<T>;
    
  } catch (err: any) {
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }
    if (err instanceof Error) {
      throw err;
    }
    throw new Error('An unknown network error occurred');
  }
}

/** Logout function for a given context */
export async function logout(tokenKey: string = 'default'): Promise<void> {
  const refreshToken = tokenStore.getRefreshToken(tokenKey);
  
  tokenStore.clear(tokenKey);
  
  const logoutUrl = tokenKey === 'patient' ? '/api/patient-auth/logout' : '/api/auth/logout';

  if (refreshToken) {
    try {
      await fetch(`${API_BASE_URL}${logoutUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });
    } catch (error) {
      console.warn('Failed to notify backend about logout:', error);
    }
  }
  
  window.dispatchEvent(new CustomEvent(LOGOUT_EVENT, { detail: { key: tokenKey } }));
}

/** Checks if a refresh token exists for a given context */
export function hasTokens(tokenKey: string = 'default'): boolean {
  return !!tokenStore.getRefreshToken(tokenKey);
}

/** Get access token for a given context */
export function getAccessToken(tokenKey: string = 'default'): string | null {
  return tokenStore.getAccessToken(tokenKey);
}

/** Get refresh token for a given context */
export function getRefreshToken(tokenKey: string = 'default'): string | null {
  return tokenStore.getRefreshToken(tokenKey);
}

/** Set tokens for a given context */
export function setTokens(accessToken: string, refreshToken: string, tokenKey: string = 'default'): void {
  tokenStore.setTokens(accessToken, refreshToken, tokenKey);
}
