# TopSmile - State Management Guide

## Overview

TopSmile uses a **three-layer state management strategy**:

1. **TanStack Query** - Server state (API data)
2. **Zustand** - UI state (sidebar, theme)
3. **Context** - Authentication state

---

## 1. TanStack Query - Server State

### When to Use
- Fetching data from API
- Creating/updating/deleting resources
- Caching server responses
- Automatic refetching and invalidation

### Custom Hooks Pattern

All server data access uses custom hooks:

```typescript
// ✅ CORRECT
import { usePatients, useCreatePatient } from '../hooks/queries';

const { data: patients, isLoading } = usePatients(clinicId);
const createMutation = useCreatePatient();

// ❌ WRONG
useEffect(() => {
    fetch('/api/patients').then(res => res.json()).then(setPatients);
}, []);
```

### Available Hooks

#### Patients
```typescript
import { 
    usePatients,      // List patients
    usePatient,       // Get single patient
    useCreatePatient, // Create patient
    useUpdatePatient, // Update patient
    useDeletePatient  // Delete patient
} from '../hooks/queries';
```

#### Appointments
```typescript
import { 
    useAppointments,       // List appointments
    useAppointment,        // Get single appointment
    useCreateAppointment,  // Create appointment
    useUpdateAppointment,  // Update appointment
    useCancelAppointment   // Cancel appointment
} from '../hooks/queries';
```

#### Providers
```typescript
import { 
    useProviders,      // List providers
    useProvider,       // Get single provider
    useCreateProvider, // Create provider
    useUpdateProvider, // Update provider
    useDeleteProvider  // Delete provider
} from '../hooks/queries';
```

### Usage Example

```typescript
import { usePatients, useDeletePatient } from '../hooks/queries';
import { toast } from 'react-toastify';

export const PatientList: React.FC = () => {
    const { user } = useAuth();
    const { data: patients, isLoading, error } = usePatients(user!.clinicId);
    const deleteMutation = useDeletePatient();
    
    const handleDelete = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id);
            toast.success('Paciente excluído com sucesso');
        } catch (error) {
            // Error handled by queryClient
        }
    };
    
    if (isLoading) return <Skeleton />;
    if (error) return <ErrorState />;
    if (!patients?.length) return <EmptyState />;
    
    return <Table data={patients} onDelete={handleDelete} />;
};
```

---

## 2. Zustand - UI State

### When to Use
- Sidebar open/closed state
- Theme (light/dark)
- User preferences
- UI-only state shared across components

### Usage

```typescript
import { useUIStore } from '../store/uiStore';

export const Sidebar: React.FC = () => {
    const sidebarOpen = useUIStore(state => state.sidebarOpen);
    const toggleSidebar = useUIStore(state => state.toggleSidebar);
    
    return (
        <aside className={sidebarOpen ? 'open' : 'closed'}>
            <button onClick={toggleSidebar}>Toggle</button>
        </aside>
    );
};
```

### Available State

```typescript
interface UIState {
    sidebarOpen: boolean;
    theme: 'light' | 'dark';
    language: 'pt-BR';
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setTheme: (theme: 'light' | 'dark') => void;
}
```

---

## 3. Context - Authentication

### When to Use
- User authentication state
- Current user information
- Login/logout actions

### Usage

```typescript
import { useAuth } from '../contexts/AuthContext';

export const Dashboard: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    
    if (!isAuthenticated) return <Navigate to="/login" />;
    
    return (
        <div>
            <h1>Bem-vindo, {user.name}</h1>
            <button onClick={logout}>Sair</button>
        </div>
    );
};
```

---

## 4. Local State - useState

### When to Use
- Form inputs
- Component-specific toggles
- Temporary UI state
- State not shared with other components

### Usage

```typescript
export const PatientForm: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [showModal, setShowModal] = useState(false);
    
    return (
        <form>
            <input 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
        </form>
    );
};
```

---

## Decision Tree

```
Need to manage state?
│
├─ Is it server data (from API)?
│  └─ ✅ Use TanStack Query (custom hooks)
│
├─ Is it authentication?
│  └─ ✅ Use AuthContext
│
├─ Is it UI state shared across components?
│  └─ ✅ Use Zustand (useUIStore)
│
└─ Is it local to one component?
   └─ ✅ Use useState
```

---

## Rules

### DO ✅
- Use TanStack Query for ALL server data
- Create custom hooks for each entity
- Use Zustand for UI state only
- Use Context for auth only
- Use useState for local state

### DON'T ❌
- Fetch data with useEffect + fetch
- Store server data in Zustand
- Use Context for non-auth state
- Duplicate query logic across components
- Manually manage cache invalidation

---

## Configuration

### Query Client Setup

```typescript
// src/config/queryClient.ts
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,      // 5 minutes
            gcTime: 10 * 60 * 1000,        // 10 minutes
            retry: 3,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true
        },
        mutations: {
            retry: 1,
            onError: (error: any) => {
                toast.error(error.message || 'Erro ao processar solicitação');
            }
        }
    }
});
```

---

## Creating New Query Hooks

Template for new entity:

```typescript
// src/hooks/queries/useEntity.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../services/api';

const QUERY_KEYS = {
    all: ['entity'] as const,
    lists: () => [...QUERY_KEYS.all, 'list'] as const,
    list: (clinicId: string, filters?: any) => [...QUERY_KEYS.lists(), clinicId, filters] as const,
    details: () => [...QUERY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.details(), id] as const,
};

export const useEntities = (clinicId: string, filters?: any) => {
    return useQuery({
        queryKey: QUERY_KEYS.list(clinicId, filters),
        queryFn: () => apiService.entity.list(clinicId, filters),
        staleTime: 5 * 60 * 1000,
        enabled: !!clinicId
    });
};

export const useCreateEntity = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => apiService.entity.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lists() });
        }
    });
};
```

---

## Migration Checklist

- [x] Create queryClient configuration
- [x] Create custom hooks for Patients
- [x] Create custom hooks for Appointments
- [x] Create custom hooks for Providers
- [x] Create UI-only Zustand store
- [x] Document state management strategy
- [ ] Migrate existing components to use custom hooks
- [ ] Remove direct fetch calls
- [ ] Remove server data from old stores
- [ ] Add optimistic updates
- [ ] Test cache invalidation

---

**Last Updated**: 2024
**Status**: Implementation Complete - Migration In Progress
