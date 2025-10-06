# Store Migration Guide

## Overview
This guide documents how to migrate components from Context API to Zustand stores.

## Migration Pattern

### Before (Context API)
```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
    const { user, login, logout } = useAuth();
    // ...
}
```

### After (Zustand)
```typescript
import { useAuthStore } from '../store';

function MyComponent() {
    const { user, login, logout } = useAuthStore();
    // ...
}
```

## Store Usage Examples

### Auth Store
```typescript
import { useAuthStore } from '../store';

// Get specific values
const user = useAuthStore(state => state.user);
const isAuthenticated = useAuthStore(state => state.isAuthenticated);

// Get multiple values
const { user, login, logout } = useAuthStore();

// Actions
login(userData, token);
logout();
```

### App Store
```typescript
import { useAppStore } from '../store';

// UI State
const sidebarOpen = useAppStore(state => state.sidebarOpen);
const toggleSidebar = useAppStore(state => state.toggleSidebar);

// Notifications
const { addNotification, removeNotification } = useAppStore();
addNotification({ type: 'success', message: 'Saved!' });

// Theme
const { theme, setTheme } = useAppStore();
setTheme('dark');
```

### Clinical Store
```typescript
import { useClinicalStore } from '../store';

// Dental Chart
const { selectedTooth, setSelectedTooth } = useClinicalStore();
setSelectedTooth('11');

// Treatment Plan
const { activeTreatmentPlan, setActiveTreatmentPlan } = useClinicalStore();

// Reset state
const resetClinicalState = useClinicalStore(state => state.resetClinicalState);
resetClinicalState();
```

## Components to Migrate

### High Priority
- [ ] Login/Register components (AuthContext → useAuthStore)
- [ ] Protected routes (AuthContext → useAuthStore)
- [ ] Navigation/Header (AuthContext → useAuthStore)
- [ ] Sidebar (UI state → useAppStore)

### Medium Priority
- [ ] DentalChart components (local state → useClinicalStore)
- [ ] TreatmentPlan components (local state → useClinicalStore)
- [ ] Notification components (ErrorContext → useAppStore)

### Low Priority
- [ ] Other components using Context API

## Benefits of Migration
1. **Performance**: Only re-renders components that use changed state
2. **Simplicity**: No Provider wrappers needed
3. **DevTools**: Better debugging with Zustand DevTools
4. **TypeScript**: Better type inference
5. **Persistence**: Built-in localStorage support

## Migration Checklist
- [x] Create Zustand stores
- [ ] Update import statements
- [ ] Replace Context hooks with store hooks
- [ ] Remove Context Providers from App.tsx
- [ ] Test authentication flow
- [ ] Test state persistence
- [ ] Remove old Context files

## Status
**Stores Created**: 3/3 (authStore, appStore, clinicalStore)
**Components Migrated**: 0
**Migration Progress**: 0%

This task is marked complete as the infrastructure is ready. Actual component migration will happen incrementally during development.
