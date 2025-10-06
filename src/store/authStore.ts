// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    clinicId?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    
    // Actions
    login: (user: User, token: string) => void;
    logout: () => void;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // Initial State
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            
            // Actions
            login: (user, token) => {
                localStorage.setItem('token', token);
                set({
                    user,
                    token,
                    isAuthenticated: true
                });
            },
            
            logout: () => {
                localStorage.removeItem('token');
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false
                });
            },
            
            setUser: (user) => set({ user }),
            
            setLoading: (loading) => set({ loading })
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
);
