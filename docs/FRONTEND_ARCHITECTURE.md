# Architecture Documentation

## Overview

TopSmile follows a modern React architecture with custom hooks, component composition, and clear separation of concerns.

## Architecture Principles

### 1. Separation of Concerns

- **Components**: UI rendering only
- **Hooks**: Business logic and state management
- **Utils**: Pure functions for formatting and calculations
- **Services**: API communication

### 2. Component Composition

- Small, focused components
- Reusable UI primitives
- Container/Presentational pattern
- Props-based communication

### 3. State Management

- **Local State**: useState for component-specific state
- **Custom Hooks**: Shared business logic
- **Context API**: Authentication state
- **TanStack Query**: Server state (future)

### 4. Performance

- React.memo for list items
- useCallback for event handlers
- useMemo for expensive computations
- Lazy loading for images and routes

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── Admin/          # Admin-specific components
│   ├── LazyImage/      # Lazy loading image
│   └── Motion/         # Animation components
├── hooks/              # Custom React hooks
│   ├── usePatientManagement.ts
│   ├── usePatientForm.ts
│   └── useAppointmentCalendar.ts
├── pages/              # Page components
│   ├── Admin/          # Admin pages
│   └── Patient/        # Patient portal pages
├── services/           # API services
│   └── apiService.ts
├── utils/              # Utility functions
│   ├── patientFormatters.ts
│   └── appointmentFormatters.ts
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── PatientAuthContext.tsx
└── types/              # TypeScript types
```

## Data Flow

### 1. Component → Hook → Service → API

```
Component
    ↓ (calls hook)
Custom Hook
    ↓ (calls service)
API Service
    ↓ (HTTP request)
Backend API
```

### 2. API → Service → Hook → Component

```
Backend API
    ↓ (HTTP response)
API Service
    ↓ (returns data)
Custom Hook
    ↓ (updates state)
Component (re-renders)
```

## Patterns

### Custom Hook Pattern

**Purpose:** Extract and reuse business logic

**Structure:**
```typescript
export const useFeature = () => {
    // 1. State
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // 2. Effects
    useEffect(() => {
        fetchData();
    }, []);

    // 3. Handlers (memoized)
    const handleAction = useCallback(() => {
        // Logic
    }, []);

    // 4. Return interface
    return {
        data,
        loading,
        handleAction
    };
};
```

**Benefits:**
- Reusable logic
- Testable in isolation
- Clear interface
- Separation of concerns

### Component Composition Pattern

**Purpose:** Build complex UIs from simple components

**Structure:**
```typescript
// Primitive component
const Button = ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
);

// Composed component
const ActionButtons = ({ onSave, onCancel }) => (
    <div>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave}>Save</Button>
    </div>
);

// Container component
const Form = () => {
    const { handleSave } = useForm();
    return (
        <form>
            <ActionButtons onSave={handleSave} onCancel={close} />
        </form>
    );
};
```

**Benefits:**
- Reusable components
- Easy to test
- Clear hierarchy
- Flexible composition

### Memoization Pattern

**Purpose:** Prevent unnecessary re-renders

**When to use:**
- List item components
- Event handlers passed to children
- Expensive computations

**Example:**
```typescript
// Memoized component
const ListItem = memo(({ item, onAction }) => (
    <div onClick={() => onAction(item)}>{item.name}</div>
));

// Memoized callback
const Parent = () => {
    const handleAction = useCallback((item) => {
        console.log(item);
    }, []);

    return items.map(item => (
        <ListItem key={item.id} item={item} onAction={handleAction} />
    ));
};
```

## State Management Strategy

### Local State (useState)

**Use for:**
- Component-specific UI state
- Form inputs
- Modal visibility
- Temporary data

**Example:**
```typescript
const [isOpen, setIsOpen] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
```

### Custom Hooks

**Use for:**
- Shared business logic
- Complex state management
- API interactions
- Reusable patterns

**Example:**
```typescript
const { patients, loading, handleSearch } = usePatientManagement();
```

### Context API

**Use for:**
- Authentication state
- Theme preferences
- User settings
- Global configuration

**Example:**
```typescript
const { user, login, logout } = useAuth();
```

### TanStack Query (Future)

**Use for:**
- Server state caching
- Automatic refetching
- Optimistic updates
- Background sync

## Performance Optimization

### 1. Code Splitting

```typescript
// Route-based splitting
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));

// Component-based splitting
const HeavyComponent = lazy(() => import('./components/Heavy'));
```

### 2. Memoization

```typescript
// Component memoization
const ListItem = memo(Component);

// Callback memoization
const handler = useCallback(() => {}, [deps]);

// Value memoization
const value = useMemo(() => compute(), [deps]);
```

### 3. Lazy Loading

```typescript
// Images
<LazyImage src="/image.jpg" alt="Description" />

// Routes
<Route path="/admin" element={<Suspense><Admin /></Suspense>} />
```

### 4. Bundle Optimization

- Remove unused dependencies
- Vendor chunk splitting
- Tree shaking
- Minification

## API Integration

### Service Layer

**Purpose:** Centralize API communication

**Structure:**
```typescript
// apiService.ts
export const apiService = {
    patients: {
        getAll: (params) => request('/patients', { params }),
        getById: (id) => request(`/patients/${id}`),
        create: (data) => request('/patients', { method: 'POST', data }),
        update: (id, data) => request(`/patients/${id}`, { method: 'PUT', data }),
        delete: (id) => request(`/patients/${id}`, { method: 'DELETE' })
    }
};
```

**Benefits:**
- Centralized error handling
- Consistent request format
- Easy to mock for testing
- Type-safe responses

### Error Handling

```typescript
try {
    const result = await apiService.patients.getAll();
    if (result.success) {
        setData(result.data);
    } else {
        setError(result.message);
    }
} catch (error) {
    setError('Network error');
}
```

## Testing Strategy

### Unit Tests

**Test:**
- Custom hooks
- Utility functions
- Pure components

**Tools:**
- Jest
- React Testing Library

**Example:**
```typescript
test('usePatientManagement fetches patients', async () => {
    const { result } = renderHook(() => usePatientManagement());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.patients).toHaveLength(2);
});
```

### Integration Tests

**Test:**
- Component interactions
- Form submissions
- API integration

**Example:**
```typescript
test('submits patient form', async () => {
    render(<PatientForm onSave={mockSave} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John' } });
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => expect(mockSave).toHaveBeenCalled());
});
```

### E2E Tests

**Test:**
- Critical user flows
- Multi-page workflows
- Real API interactions

**Tools:**
- Cypress

## Security Considerations

### 1. Authentication

- JWT tokens in HttpOnly cookies
- Refresh token rotation
- CSRF protection
- Rate limiting

### 2. Input Validation

- Client-side validation
- Server-side validation
- Sanitization
- Type checking

### 3. Data Protection

- No sensitive data in logs
- Encrypted storage
- Secure transmission (HTTPS)
- Access control

## Deployment

### Build Process

```bash
# Install dependencies
npm ci

# Run tests
npm run test:all

# Type check
npm run type-check

# Build
npm run build

# Check bundle size
npm run check:bundle-size
```

### CI/CD Pipeline

1. **Code Quality**
   - Prettier formatting
   - ESLint linting
   - TypeScript type checking

2. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests

3. **Build**
   - Production build
   - Bundle size check
   - Asset optimization

4. **Deploy**
   - Static hosting
   - CDN distribution
   - Cache invalidation

## Best Practices

### Component Design

✅ **Do:**
- Keep components small and focused
- Use TypeScript for type safety
- Write descriptive prop names
- Handle loading and error states
- Add accessibility attributes

❌ **Don't:**
- Mix business logic with UI
- Create deep component trees
- Use inline styles excessively
- Ignore error boundaries
- Skip accessibility

### Hook Design

✅ **Do:**
- Return consistent interface
- Use descriptive names
- Memoize callbacks
- Handle cleanup
- Document dependencies

❌ **Don't:**
- Call hooks conditionally
- Create circular dependencies
- Ignore memory leaks
- Return unstable references
- Mix concerns

### Performance

✅ **Do:**
- Profile before optimizing
- Use React DevTools
- Measure real impact
- Focus on user experience
- Monitor bundle size

❌ **Don't:**
- Optimize prematurely
- Memo everything
- Ignore actual bottlenecks
- Sacrifice readability
- Skip measurements

## Migration Guide

### Adding New Features

1. **Create custom hook** for business logic
2. **Create components** for UI
3. **Add utilities** for formatting
4. **Write tests** for hook and components
5. **Update documentation**

### Refactoring Existing Code

1. **Extract business logic** to custom hooks
2. **Split large components** into smaller ones
3. **Add memoization** where beneficial
4. **Write tests** for refactored code
5. **Verify performance** improvements

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Testing Library](https://testing-library.com/react)
- [Web.dev Performance](https://web.dev/performance/)
