// src/store/authStore.ts
// DEPRECATED: Use AuthContext instead
// This file is kept for backward compatibility but should not be used
// All authentication state is managed by AuthContext

export const useAuthStore = () => {
    console.warn('useAuthStore is deprecated. Use useAuthState and useAuthActions from AuthContext instead.');
    return null;
};
