// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../services/http';

const ACCESS_KEY = 'topsmile_access_token';
const REFRESH_KEY = 'topsmile_refresh_token';

// Define a User interface for type safety
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  clinicId?: string;
}

interface AuthResult {
  success: boolean;
  message?: string;
}


// Updated AuthContextType to include all required properties
interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: (reason?: string) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoutReason, setLogoutReason] = useState<string | null>(null);

  const isAuthenticated = !isLoading && !!accessToken && !!user;

  // Function to fetch user data based on token
  const fetchUser = async (token: string) => {
    try {
      const res = await request('/api/auth/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        // Corrected: Access the `data` property directly instead of calling `res.json()`
        const userData = res.data;
        setUser(userData);
        setAccessToken(token);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem(ACCESS_KEY);
      if (token) {
        await fetchUser(token);
      }
      setLoading(false);
    };
    verifyAuth();
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setError(null);
    setLoading(true);
    try {
      const res = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      // Corrected: Access the `data` property directly
      const data = res.data;

      if (res.ok) {
        localStorage.setItem(ACCESS_KEY, data.accessToken);
        localStorage.setItem(REFRESH_KEY, data.refreshToken);
        await fetchUser(data.accessToken);
        setLoading(false);
        navigate('/dashboard');
        return { success: true };
      } else {
        // Use the message from the response data if available
        const errorMessage = data?.message || res.message || 'Login failed';
        setError(errorMessage);
        setLoading(false);
        return { success: false, message: errorMessage };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Network error';
      setError(errorMessage);
      setLoading(false);
      return { success: false, message: errorMessage };
    }
  };

  const logout = (reason?: string) => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setAccessToken(null);
    setUser(null);
    if (reason) {
      setLogoutReason(reason);
    }
    navigate('/login');
  };

  const clearError = () => {
    setError(null);
  };

  // Sync auth state across tabs
  useEffect(() => {
    const onStorageChange = (e: StorageEvent) => {
      if (e.key === ACCESS_KEY && e.newValue === null) {
        logout('Your session has expired. Please log in again.');
      }
    };
    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  useEffect(() => {
    if (logoutReason) {
      alert(logoutReason);
      setLogoutReason(null);
    }
  }, [logoutReason]);

  const value = { isAuthenticated, accessToken, user, isLoading, error, login, logout, clearError };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};