# Component Migration Guide

## Quick Migration Steps

### Step 1: Identify Data Fetching
Look for `useEffect` + `fetch` or `apiService` calls:
```typescript
// ❌ OLD - Remove this
useEffect(() => {
    const fetchData = async () => {
        const result = await apiService.entity.getAll();
        setData(result.data);
    };
    fetchData();
}, []);
```

### Step 2: Replace with Query Hook
```typescript
// ✅ NEW - Use this
import { useEntity } from '../hooks/queries';
const { data, isLoading, error } = useEntity(clinicId);
```

### Step 3: Update Mutations
```typescript
// ❌ OLD
const handleDelete = async (id) => {
    await apiService.entity.delete(id);
    fetchData(); // Manual refetch
};

// ✅ NEW
const deleteMutation = useDeleteEntity();
const handleDelete = async (id) => {
    await deleteMutation.mutateAsync(id);
    toast.success('Excluído com sucesso');
};
```

### Step 4: Remove Manual State
```typescript
// ❌ OLD - Remove these
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// ✅ NEW - Use hook returns
const { data, isLoading, error } = useEntity(clinicId);
```

## Component-Specific Migrations

### Dashboard Components
```typescript
// Use useDashboard hook
import { useDashboard } from '../hooks/useDashboard';

const { stats, todayAppointments, recentPatients, loading } = useDashboard();
```

### Booking Components
```typescript
// Use useBookingFlow hook
import { useBookingFlow } from '../hooks/useBookingFlow';

const {
    providers,
    appointmentTypes,
    timeSlots,
    handleProviderSelect,
    handleBooking
} = useBookingFlow();
```

### List Components
```typescript
// Use management hooks
import { usePatientManagement } from '../hooks/usePatientManagement';

const {
    patients,
    loading,
    handleSearchChange,
    handleDeletePatient
} = usePatientManagement();
```

## Migration Checklist

For each component:
- [ ] Import query hooks
- [ ] Replace useEffect + fetch
- [ ] Replace manual state
- [ ] Update mutations
- [ ] Remove old imports
- [ ] Test loading states
- [ ] Test error states
- [ ] Verify cache invalidation

## Common Patterns

### Pattern 1: Simple List
```typescript
const { data: items, isLoading } = useItems(clinicId);
if (isLoading) return <Skeleton />;
return <List items={items} />;
```

### Pattern 2: List with Filters
```typescript
const [filters, setFilters] = useState({ search: '' });
const { data: items, isLoading } = useItems(clinicId, filters);
```

### Pattern 3: Create/Update/Delete
```typescript
const createMutation = useCreateItem();
const updateMutation = useUpdateItem();
const deleteMutation = useDeleteItem();

const handleCreate = async (data) => {
    await createMutation.mutateAsync(data);
    toast.success('Criado com sucesso');
};
```

### Pattern 4: Parallel Queries
```typescript
const { data: items1 } = useItems1(clinicId);
const { data: items2 } = useItems2(clinicId);
// Both fetch in parallel automatically
```

## Testing After Migration

1. **Loading State**: Verify skeleton/spinner shows
2. **Error State**: Test with network offline
3. **Empty State**: Test with no data
4. **CRUD Operations**: Test create, update, delete
5. **Cache**: Navigate away and back (should be instant)
6. **Filters**: Test search and filters work
7. **Pagination**: Test page navigation

## Rollback Plan

If issues occur:
1. Keep old code commented
2. Test thoroughly before removing
3. Can revert by uncommenting old code
4. No breaking changes to API

## Support

- See `docs/STATE_MANAGEMENT.md` for detailed guide
- See `docs/review/15-Hooks-Complete.md` for all hooks
- Ask team for help with complex migrations
