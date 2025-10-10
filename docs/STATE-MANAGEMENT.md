# State Management Guide

**Last Updated**: January 2025

---

## Overview

TopSmile uses a **multi-layered state management approach** optimized for different types of state:

1. **Server State**: TanStack Query (React Query)
2. **Authentication State**: React Context API
3. **UI State**: Zustand
4. **Local Component State**: React useState/useReducer

---

## Decision Tree

```
What type of state do you need?

├─ Server data (API responses)?
│  └─ Use TanStack Query
│
├─ Authentication state?
│  └─ Use AuthContext or PatientAuthContext
│
├─ Global UI state (theme, sidebar, modals)?
│  └─ Use Zustand (appStore)
│
├─ Feature-specific state (clinical data)?
│  └─ Use Zustand (clinicalStore)
│
└─ Local component state?
   └─ Use useState or useReducer
```

---

## 1. Server State (TanStack Query)

**Use for**: API data, caching, background refetching

### Example:
```typescript
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/apiService';

export const usePatients = (filters?: PatientFilters) => {
  return useQuery({
    queryKey: ['patients', filters],
    queryFn: () => apiService.patients.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });
};

// Usage in component
const { data, isLoading, error } = usePatients({ isActive: true });
```

### Benefits:
- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication

---

## 2. Authentication State (Context API)

**Use for**: User authentication, session management

### Staff Authentication:
```typescript
import { useAuthState, useAuthActions } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated } = useAuthState();
  const { login, logout } = useAuthActions();
  
  // Use authentication state
};
```

### Patient Authentication:
```typescript
import { usePatientAuthState, usePatientAuthActions } from '../contexts/PatientAuthContext';

const MyComponent = () => {
  const { patient, isAuthenticated } = usePatientAuthState();
  const { login, logout } = usePatientAuthActions();
  
  // Use patient authentication state
};
```

### Benefits:
- Centralized auth logic
- Automatic token refresh
- Session timeout handling
- Logout event broadcasting

---

## 3. UI State (Zustand)

**Use for**: Global UI state that doesn't fit in Context

### App Store (Global UI):
```typescript
import { useAppStore } from '../store';

const MyComponent = () => {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { theme, setTheme } = useAppStore();
  
  // Use UI state
};
```

### Clinical Store (Feature-specific):
```typescript
import { useClinicalStore } from '../store';

const MyComponent = () => {
  const { selectedTooth, setSelectedTooth } = useClinicalStore();
  
  // Use clinical state
};
```

### Benefits:
- Simple API
- No boilerplate
- Good performance
- DevTools support

---

## 4. Local Component State

**Use for**: Component-specific state that doesn't need to be shared

### Example:
```typescript
const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(initialData);
  
  // Local state only
};
```

---

## Migration Notes

### ⚠️ Deprecated: useAuthStore

The `useAuthStore` from Zustand has been **removed** (January 2025). 

**Before** (Deprecated):
```typescript
import { useAuthStore } from '../store';
const { user, login } = useAuthStore();
```

**After** (Current):
```typescript
import { useAuthState, useAuthActions } from '../contexts/AuthContext';
const { user } = useAuthState();
const { login } = useAuthActions();
```

**Reason**: Context API provides better separation of concerns and supports multiple auth contexts (staff + patient).

---

## Best Practices

### 1. Keep State Close to Where It's Used
```typescript
// ❌ Bad: Global state for local concern
const { modalOpen, setModalOpen } = useAppStore();

// ✅ Good: Local state for local concern
const [modalOpen, setModalOpen] = useState(false);
```

### 2. Use TanStack Query for Server Data
```typescript
// ❌ Bad: Manual state management for API data
const [patients, setPatients] = useState([]);
useEffect(() => {
  apiService.patients.getAll().then(setPatients);
}, []);

// ✅ Good: TanStack Query handles it
const { data: patients } = usePatients();
```

### 3. Separate State and Actions in Context
```typescript
// ✅ Good: Split contexts for better performance
<AuthStateContext.Provider value={state}>
  <AuthActionsContext.Provider value={actions}>
    {children}
  </AuthActionsContext.Provider>
</AuthStateContext.Provider>
```

### 4. Memoize Selectors in Zustand
```typescript
// ✅ Good: Only re-render when specific state changes
const sidebarOpen = useAppStore(state => state.sidebarOpen);
```

---

## Common Patterns

### Pattern 1: Form State with Server Sync
```typescript
const MyForm = () => {
  // Local form state
  const [formData, setFormData] = useState(initialData);
  
  // Server mutation
  const mutation = useMutation({
    mutationFn: (data) => apiService.patients.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['patients']);
    },
  });
  
  const handleSubmit = () => {
    mutation.mutate(formData);
  };
};
```

### Pattern 2: Optimistic Updates
```typescript
const mutation = useMutation({
  mutationFn: updatePatient,
  onMutate: async (newData) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['patient', id]);
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['patient', id]);
    
    // Optimistically update
    queryClient.setQueryData(['patient', id], newData);
    
    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['patient', id], context.previous);
  },
});
```

### Pattern 3: Global Loading State
```typescript
// In component
const { setGlobalLoading } = useAppStore();

useEffect(() => {
  setGlobalLoading(true);
  fetchData().finally(() => setGlobalLoading(false));
}, []);
```

---

## Troubleshooting

### Issue: "useAuthStore is not a function"
**Solution**: Update to use `AuthContext`:
```typescript
import { useAuthState, useAuthActions } from '../contexts/AuthContext';
```

### Issue: Stale data after mutation
**Solution**: Invalidate queries after mutation:
```typescript
onSuccess: () => {
  queryClient.invalidateQueries(['patients']);
}
```

### Issue: Too many re-renders
**Solution**: Use selectors in Zustand:
```typescript
// Instead of
const store = useAppStore();

// Use
const sidebarOpen = useAppStore(state => state.sidebarOpen);
```

---

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Context Docs](https://react.dev/reference/react/useContext)
- [AuthContext Implementation](../src/contexts/AuthContext.tsx)
- [BaseAuthContext](../src/contexts/BaseAuthContext.tsx)

---

## Summary

| State Type | Solution | When to Use |
|------------|----------|-------------|
| Server Data | TanStack Query | API responses, caching |
| Authentication | Context API | User/patient auth |
| Global UI | Zustand | Theme, sidebar, modals |
| Feature State | Zustand | Clinical data, complex features |
| Local State | useState | Component-specific |

**Key Principle**: Use the simplest solution that works. Start with local state, move to global only when needed.
