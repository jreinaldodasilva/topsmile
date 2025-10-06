// src/store/appStore.ts
import { create } from 'zustand';

interface AppState {
    // UI State
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    
    // Notification State
    notifications: Array<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
    }>;
    
    // Loading State
    globalLoading: boolean;
    
    // Actions
    toggleSidebar: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
    addNotification: (notification: Omit<AppState['notifications'][0], 'id'>) => void;
    removeNotification: (id: string) => void;
    setGlobalLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Initial State
    sidebarOpen: true,
    theme: 'light',
    notifications: [],
    globalLoading: false,
    
    // Actions
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    
    setTheme: (theme) => set({ theme }),
    
    addNotification: (notification) => set((state) => ({
        notifications: [
            ...state.notifications,
            { ...notification, id: Date.now().toString() }
        ]
    })),
    
    removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
    })),
    
    setGlobalLoading: (loading) => set({ globalLoading: loading })
}));
