export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface HttpResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  message?: string;
}

/**
 * Centralized request helper.
 * - Injects JSON headers and optional Bearer token from localStorage ('topsmile_token')
 * - Safely parses JSON responses (handles empty/non-JSON bodies)
 * - Supports AbortSignal via options.signal or explicit signal param
 * - Throws Error on non-ok responses with server message when available
 */
export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth = true,
  signal?: AbortSignal
): Promise<HttpResponse<T>> {
  const token = includeAuth ? (localStorage.getItem('topsmile_token') || '') : '';

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const mergedHeaders = {
    ...defaultHeaders,
    ...(options.headers as Record<string, string> | undefined)
  };

  const config: RequestInit = {
    ...options,
    headers: mergedHeaders,
    signal: signal ?? (options.signal as AbortSignal | undefined)
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const res = await fetch(url, config);

  // Try to read body as text first (handles empty/204 and non-JSON)
  const text = await res.text();
  let payload: any = undefined;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      // Non-JSON body — expose raw text on message
      payload = { message: text };
    }
  }

  if (!res.ok) {
    const msg =
      (payload && (payload.message || payload.error)) ||
      `HTTP ${res.status} ${res.statusText || ''}`.trim();
    const err = new Error(msg);
    // attach metadata for callers who want it
    (err as any).status = res.status;
    (err as any).body = payload;
    throw err;
  }

  // Prefer { data: ... } envelope if present, otherwise return parsed payload directly
  const data = payload === undefined ? undefined : payload?.data ?? payload;

  return {
    ok: res.ok,
    status: res.status,
    data,
    message: payload?.message
  };
}