# TopSmile Frontend Architecture

**Document Version:** 1.0.0  
**Last Updated:** 2024-01-15  
**Status:** ✅ Complete

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Component Architecture](#component-architecture)
5. [State Management](#state-management)
6. [Routing Architecture](#routing-architecture)
7. [API Communication](#api-communication)
8. [Performance Optimizations](#performance-optimizations)
9. [Improvement Recommendations](#improvement-recommendations)

---

## Overview

The TopSmile frontend is a React 18.2 single-page application (SPA) built with TypeScript, featuring role-based interfaces for patients, staff, and administrators.

**Key Characteristics:**
- Component-based architecture
- Feature-driven organization
- Centralized state management (Zustand + React Query)
- Code splitting and lazy loading
- Responsive design
- Accessibility compliant

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI library with concurrent features |
| TypeScript | 4.9.5 | Type safety |
| React Router | 6.30.1 | Client-side routing |
| Zustand | 4.5.7 | Global state management |
| TanStack Query | 5.89.0 | Server state & caching |
| Framer Motion | 10.16.5 | Animations |
| Luxon | 3.7.1 | Date/time handling |

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Admin/          # Admin-specific
│   ├── Auth/           # Authentication
│   ├── Booking/        # Appointment booking
│   ├── Clinical/       # Clinical workflows
│   ├── PatientPortal/  # Patient self-service
│   ├── Payment/        # Payment processing
│   └── UI/             # Base components
├── features/           # Feature modules
│   ├── appointments/   # Appointment logic
│   ├── auth/           # Auth logic
│   ├── patients/       # Patient management
│   └── providers/      # Provider management
├── services/           # API communication
│   ├── api/            # API modules
│   ├── base/           # HTTP client
│   └── interceptors/   # Request/response
├── contexts/           # React contexts
├── store/              # Zustand stores
├── hooks/              # Custom hooks
├── layouts/            # Page layouts
├── routes/             # Route config
├── pages/              # Page components
├── styles/             # Global styles
└── utils/              # Utilities
```

---

## Component Architecture

### Component Hierarchy

```
App
├── ErrorBoundary
├── ErrorProvider
├── QueryProvider
├── Router
│   ├── AuthProvider
│   │   ├── PatientAuthProvider
│   │   │   ├── Routes
│   │   │   │   ├── PublicRoutes
│   │   │   │   ├── StaffRoutes (ProtectedRoute)
│   │   │   │   └── PatientRoutes (PatientProtectedRoute)
│   │   │   └── NotificationContainer
```

### Component Types

**1. Presentational Components**
```typescript
// components/UI/Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled, 
  children 
}) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

**2. Container Components**
```typescript
// features/appointments/AppointmentList.tsx
const AppointmentList: React.FC = () => {
  const { data, isLoading } = useAppointments();
  const { deleteAppointment } = useAppointmentMutations();

  if (isLoading) return <Loading />;

  return (
    <div>
      {data?.map(apt => (
        <AppointmentCard 
          key={apt.id} 
          appointment={apt}
          onDelete={deleteAppointment}
        />
      ))}
    </div>
  );
};
```

**3. Layout Components**
```typescript
// layouts/DashboardLayout/DashboardLayout.tsx
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <Header />
        {children}
      </main>
    </div>
  );
};
```

---

## State Management

### Zustand Stores (Client State)

```typescript
// store/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

### React Query (Server State)

```typescript
// hooks/useAppointments.ts
export const useAppointments = () => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: () => appointmentService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAppointmentMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: appointmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });

  return { create: createMutation.mutate };
};
```

### Context Providers

```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Implementation...

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## Routing Architecture

### Route Configuration

```typescript
// routes/index.tsx
export const routes = [
  // Public routes
  { path: '/', element: <Home /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/features', element: <FeaturesPage /> },
  
  // Staff routes (protected)
  { 
    path: '/admin', 
    element: <ProtectedRoute roles={['admin']}><AdminPage /></ProtectedRoute> 
  },
  
  // Patient routes (protected)
  { 
    path: '/patient/dashboard', 
    element: <PatientProtectedRoute><PatientDashboard /></PatientProtectedRoute> 
  },
];
```

### Route Protection

```typescript
// components/Auth/ProtectedRoute/ProtectedRoute.tsx
interface ProtectedRouteProps {
  roles?: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles, children }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

### Lazy Loading

```typescript
// routes/index.tsx
const AdminPage = lazy(() => import('../pages/Admin/AdminPage'));
const PatientDashboard = lazy(() => import('../pages/Patient/PatientDashboard'));

// Usage with Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/admin" element={<AdminPage />} />
  </Routes>
</Suspense>
```

---

## API Communication

### HTTP Client

```typescript
// services/base/httpClient.ts
class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, await response.json());
    }

    return response.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const httpClient = new HttpClient(process.env.REACT_APP_API_URL!);
```

### API Service Layer

```typescript
// services/api/appointmentService.ts
export const appointmentService = {
  getAll: () => httpClient.get<Appointment[]>('/appointments'),
  
  getById: (id: string) => httpClient.get<Appointment>(`/appointments/${id}`),
  
  create: (data: CreateAppointmentDto) => 
    httpClient.post<Appointment>('/appointments', data),
  
  update: (id: string, data: UpdateAppointmentDto) =>
    httpClient.put<Appointment>(`/appointments/${id}`, data),
  
  delete: (id: string) => 
    httpClient.delete(`/appointments/${id}`),
};
```

### Interceptors

```typescript
// services/interceptors/authInterceptor.ts
export const authInterceptor = async (config: RequestInit) => {
  // Add CSRF token
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    config.headers = {
      ...config.headers,
      'X-CSRF-Token': csrfToken,
    };
  }

  return config;
};

export const errorInterceptor = async (error: any) => {
  if (error.status === 401) {
    // Try to refresh token
    try {
      await authService.refreshToken();
      // Retry original request
      return retryRequest(error.config);
    } catch {
      // Redirect to login
      window.location.href = '/login';
    }
  }

  throw error;
};
```

---

## Performance Optimizations

### Code Splitting

```typescript
// Automatic route-based splitting
const routes = [
  { path: '/admin', component: lazy(() => import('./pages/Admin')) },
  { path: '/patient', component: lazy(() => import('./pages/Patient')) },
];
```

### Memoization

```typescript
// useMemo for expensive calculations
const sortedAppointments = useMemo(() => {
  return appointments.sort((a, b) => 
    new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime()
  );
}, [appointments]);

// useCallback for function references
const handleDelete = useCallback((id: string) => {
  deleteAppointment(id);
}, [deleteAppointment]);

// React.memo for component memoization
export const AppointmentCard = React.memo<AppointmentCardProps>(({ appointment }) => {
  return <div>{appointment.title}</div>;
});
```

### Virtual Scrolling

```typescript
// For large lists
import { FixedSizeList } from 'react-window';

const AppointmentList = ({ appointments }) => (
  <FixedSizeList
    height={600}
    itemCount={appointments.length}
    itemSize={80}
  >
    {({ index, style }) => (
      <div style={style}>
        <AppointmentCard appointment={appointments[index]} />
      </div>
    )}
  </FixedSizeList>
);
```

### Image Optimization

```typescript
// Lazy loading images
<img 
  src={imageUrl} 
  loading="lazy" 
  alt="Description"
/>

// Responsive images
<picture>
  <source srcSet="image-large.jpg" media="(min-width: 1024px)" />
  <source srcSet="image-medium.jpg" media="(min-width: 768px)" />
  <img src="image-small.jpg" alt="Description" />
</picture>
```

---

## Improvement Recommendations

### 🟥 Critical

1. **Implement Error Boundaries at Feature Level**
   - Granular error isolation
   - Better error recovery
   - **Effort:** 1 day

2. **Add Request Deduplication**
   - Prevent duplicate API calls
   - Use React Query's built-in features
   - **Effort:** 4 hours

### 🟧 High Priority

3. **Implement Service Workers**
   - Offline support
   - Background sync
   - **Effort:** 1 week

4. **Add Bundle Analysis**
   - Monitor bundle size
   - Identify optimization opportunities
   - **Effort:** 1 day

5. **Implement Virtual Scrolling**
   - For large lists
   - Better performance
   - **Effort:** 2 days

### 🟨 Medium Priority

6. **Add Component Library**
   - Storybook for component documentation
   - Isolated component development
   - **Effort:** 1 week

7. **Implement Skeleton Screens**
   - Better loading UX
   - Perceived performance
   - **Effort:** 2 days

---

## Related Documents

- [01-System-Architecture-Overview.md](./01-System-Architecture-Overview.md)
- [03-Backend-Architecture.md](./03-Backend-Architecture.md)
- [11-Component-Interaction-Details.md](../components/11-Component-Interaction-Details.md)

---

**Version History:**

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-15 | Initial documentation |
