// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { request } from '../services/http';
import type { User } from '../types/api';

type AuthContextType = {
  user: User | null;
  loading: boolean;        // original internal loading
  isLoading: boolean;      // alias used across components
  isAuthenticated: boolean;
  error: string | null;
  clearError: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'topsmile_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user if token present
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const load = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        if (mounted) setLoading(false);
        return;
      }
      try {
        const res = await request('/auth/me', { method: 'GET' }, true, controller.signal);
        if (mounted) setUser(res.data ?? null);
      } catch (err: any) {
        // If token invalid, remove it
        localStorage.removeItem(TOKEN_KEY);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await request<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }, false);
      const token = res.data?.token;
      if (!token) throw new Error(res.message || 'No token returned');
      localStorage.setItem(TOKEN_KEY, token);

      // fetch profile
      const profile = await request('/auth/me', { method: 'GET' }, true);
      setUser(profile.data ?? null);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: { name: string; email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      // registration often returns token; handle both cases
      const res = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      }, false);
      const token = (res.data && (res.data as any).token) || undefined;
      if (token) localStorage.setItem(TOKEN_KEY, token);

      // attempt to fetch profile if token present or server returned user
      if (token) {
        const profile = await request('/auth/me', { method: 'GET' }, true);
        setUser(profile.data ?? null);
      } else if (res.data && (res.data as any).user) {
        setUser((res.data as any).user);
      }
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await request('/auth/me', { method: 'GET' }, true);
      setUser(res.data ?? null);
    } catch {
      setUser(null);
    }
  };

  const clearError = () => setError(null);

  const value = useMemo(
    () => ({
      user,
      loading,
      isLoading: loading,
      isAuthenticated: !!user,
      error,
      clearError,
      login,
      register,
      logout,
      refreshUser
    }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
