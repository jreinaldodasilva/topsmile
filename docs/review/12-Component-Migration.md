# Component Migration to TanStack Query - Progress Report

## Overview
Migrating components from direct fetch/useEffect patterns to standardized TanStack Query custom hooks.

## Completed Migrations ✅

### 1. usePatientManagement Hook
**File**: `src/hooks/usePatientManagement.ts`

**Before**:
- Used useEffect + fetch pattern
- Manual state management (loading, error, data)
- Manual cache invalidation
- ~140 lines of code

**After**:
- Uses `usePatients()` and `useDeletePatient()` hooks
- Automatic state management
- Automatic cache invalidation
- ~60 lines of code (57% reduction)

**Changes**:
```typescript
// Before
const [patients, setPatients] = useState<Patient[]>([]);
const [loading, setLoading] = useState(true);
useEffect(() => {
    fetchPatients();
}, [filters]);

// After
const { data, isLoading, error, refetch } = usePatients(clinicId, filters);
const patients = data?.patients || [];
```

**Benefits**:
- Automatic caching
- Automatic refetching
- Optimistic updates ready
- Type-safe
- Less code to maintain

## Migration Pattern

### Step 1: Identify Direct Fetch Calls
```typescript
// ❌ OLD PATTERN
useEffect(() => {
    fetch('/api/patients')
        .then(res => res.json())
        .then(setPatients);
}, []);
```

### Step 2: Replace with Custom Hook
```typescript
// ✅ NEW PATTERN
const { data: patients, isLoading } = usePatients(clinicId);
```

### Step 3: Update Mutations
```typescript
// ❌ OLD PATTERN
const handleDelete = async (id: string) => {
    await apiService.patients.delete(id);
    fetchPatients(); // Manual refetch
};

// ✅ NEW PATTERN
const deleteMutation = useDeletePatient();
const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
    // Automatic cache invalidation
};
```

## Components to Migrate

### High Priority (Week 1)
- [x] PatientManagement.tsx
- [ ] AppointmentCalendar.tsx
- [ ] ProviderManagement.tsx
- [ ] Dashboard.tsx

### Medium Priority (Week 2)
- [ ] PatientPortal/Dashboard.tsx
- [ ] Booking/BookingFlow.tsx
- [ ] Clinical/TreatmentPlan.tsx
- [ ] Admin/UserManagement.tsx

### Low Priority (Week 3)
- [ ] Reports/PatientReports.tsx
- [ ] Settings/ClinicSettings.tsx
- [ ] Billing/PaymentHistory.tsx

## Migration Checklist

For each component:
- [ ] Identify all fetch/useEffect patterns
- [ ] Replace with appropriate custom hook
- [ ] Update mutations to use mutation hooks
- [ ] Remove manual state management
- [ ] Remove manual error handling (use queryClient defaults)
- [ ] Test loading states
- [ ] Test error states
- [ ] Test cache invalidation
- [ ] Update tests

## Code Reduction Stats

| Component | Before | After | Reduction |
|-----------|--------|-------|-----------|
| usePatientManagement | 140 lines | 60 lines | 57% |
| (More to come) | - | - | - |

## Next Steps

1. Migrate AppointmentCalendar component
2. Migrate ProviderManagement component
3. Update component tests
4. Document migration patterns
5. Create migration script for remaining components

## Status

**Completed**: 1/15 components (7%)
**In Progress**: usePatientManagement ✅
**Next**: AppointmentCalendar
**Timeline**: 3 weeks for full migration
