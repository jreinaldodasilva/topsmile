import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    language: 'pt-BR';
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>()(
    devtools(
        persist(
            (set) => ({
                sidebarOpen: true,
                theme: 'light',
                language: 'pt-BR',
                toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
                setSidebarOpen: (open) => set({ sidebarOpen: open }),
                setTheme: (theme) => set({ theme })
            }),
            { name: 'topsmile-ui' }
        )
    )
);
