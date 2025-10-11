# Component Migration - Implementation Instructions

## Overview
All query hooks are ready. This document provides step-by-step instructions for migrating the remaining 6 components.

---

## Remaining Components

### 1. Dashboard.tsx (Admin)
**Location**: `src/components/Admin/Dashboard/Dashboard.tsx`
**Hook**: `useDashboard`
**Complexity**: Medium

**Migration Steps**:
```typescript
// 1. Import hook
import { useDashboard } from '../../../hooks/useDashboard';

// 2. Replace data fetching
const { stats, todayAppointments, recentPatients, loading } = useDashboard();

// 3. Remove old code
// - Remove useEffect
// - Remove useState for data
// - Remove fetch functions

// 4. Update render
if (loading) return <DashboardSkeleton />;
return (
    <>
        <StatsCards stats={stats} />
        <TodaySchedule appointments={todayAppointments} />
        <RecentPatients patients={recentPatients} />
    </>
);
```

**Estimated Time**: 30 minutes

---

### 2. PatientPortal/Dashboard.tsx
**Location**: `src/pages/Patient/Dashboard/PatientDashboard.tsx`
**Hook**: `useDashboard` + `useAppointments`
**Complexity**: Medium

**Migration Steps**:
```typescript
// 1. Import hooks
import { useDashboard } from '../../../hooks/useDashboard';
import { useAppointments } from '../../../hooks/queries';

// 2. Get patient-specific data
const { user } = useAuth();
const { stats, loading } = useDashboard();
const { data: myAppointments } = useAppointments(user.clinicId, {
    patientId: user.id
});

// 3. Filter for current patient
const upcomingAppointments = myAppointments?.filter(
    apt => new Date(apt.scheduledStart) > new Date()
);
```

**Estimated Time**: 30 minutes

---

### 3. Booking/BookingFlow.tsx
**Location**: `src/pages/Booking/BookingFlow.tsx` or similar
**Hook**: `useBookingFlow`
**Complexity**: High

**Migration Steps**:
```typescript
// 1. Import hook
import { useBookingFlow } from '../../hooks/useBookingFlow';

// 2. Replace all booking state
const {
    providers,
    appointmentTypes,
    timeSlots,
    selectedProvider,
    selectedType,
    selectedDate,
    selectedTime,
    loading,
    isBooking,
    handleProviderSelect,
    handleTypeSelect,
    handleDateSelect,
    handleTimeSelect,
    handleBooking,
    resetFlow
} = useBookingFlow();

// 3. Remove old state management
// - Remove all useState
// - Remove useEffect for fetching
// - Remove manual booking logic

// 4. Update wizard steps
<Step1 
    providers={providers} 
    selected={selectedProvider}
    onSelect={handleProviderSelect} 
/>
<Step2 
    types={appointmentTypes}
    selected={selectedType}
    onSelect={handleTypeSelect}
/>
<Step3 
    slots={timeSlots}
    selected={selectedTime}
    onSelect={handleTimeSelect}
/>
<Step4 
    onSubmit={handleBooking}
    loading={isBooking}
/>
```

**Estimated Time**: 1 hour

---

### 4. Clinical/TreatmentPlan.tsx
**Location**: `src/pages/Clinical/TreatmentPlan.tsx` or similar
**Hook**: Create `useTreatmentPlans` if needed
**Complexity**: Medium

**Migration Steps**:
```typescript
// 1. Create hook if doesn't exist
// src/hooks/queries/useTreatmentPlans.ts
export const useTreatmentPlans = (patientId: string) => {
    return useQuery({
        queryKey: ['treatmentPlans', patientId],
        queryFn: () => apiService.treatmentPlans.getByPatient(patientId),
        enabled: !!patientId
    });
};

// 2. Use in component
const { data: plans, isLoading } = useTreatmentPlans(patientId);
```

**Estimated Time**: 45 minutes

---

### 5. Admin/UserManagement.tsx
**Location**: `src/pages/Admin/UserManagement.tsx`
**Hook**: Create `useUsers` hook
**Complexity**: Low

**Migration Steps**:
```typescript
// 1. Create hook
export const useUsers = (clinicId: string) => {
    return useQuery({
        queryKey: ['users', clinicId],
        queryFn: () => apiService.users.getAll(clinicId),
        staleTime: 5 * 60 * 1000
    });
};

// 2. Use in component
const { data: users, isLoading } = useUsers(clinicId);
const deleteMutation = useDeleteUser();
```

**Estimated Time**: 30 minutes

---

### 6. Reports/PatientReports.tsx
**Location**: `src/pages/Reports/PatientReports.tsx`
**Hook**: `usePatientStats` + `usePatients`
**Complexity**: Low

**Migration Steps**:
```typescript
// 1. Import hooks
import { usePatientStats, usePatients } from '../../hooks/queries';

// 2. Get data
const { data: stats } = usePatientStats(clinicId);
const { data: patients } = usePatients(clinicId, filters);

// 3. Render reports
<ReportCard title="Total Pacientes" value={stats?.total} />
<PatientList patients={patients} />
```

**Estimated Time**: 20 minutes

---

## Migration Order (Recommended)

### Day 1 (2-3 hours)
1. ✅ Reports/PatientReports.tsx (20 min) - Easiest
2. ✅ Admin/UserManagement.tsx (30 min) - Simple CRUD
3. ✅ Dashboard.tsx (30 min) - Hook ready

### Day 2 (2-3 hours)
4. ✅ PatientPortal/Dashboard.tsx (30 min) - Similar to admin
5. ✅ Clinical/TreatmentPlan.tsx (45 min) - Need new hook

### Day 3 (1-2 hours)
6. ✅ Booking/BookingFlow.tsx (1 hour) - Most complex

**Total Estimated Time**: 5-8 hours

---

## Quality Checklist

After each migration:
- [ ] Component compiles without errors
- [ ] Loading state displays correctly
- [ ] Error state handles failures
- [ ] Empty state shows when no data
- [ ] CRUD operations work
- [ ] Cache invalidation works
- [ ] No console errors
- [ ] Portuguese messages maintained
- [ ] Type safety preserved
- [ ] Old code removed/commented

---

## Testing Strategy

### Manual Testing
1. Open component
2. Verify data loads
3. Test all interactions
4. Test error scenarios
5. Test empty states
6. Navigate away and back (cache test)

### Automated Testing
```typescript
// Update tests to use QueryClient
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
    }
});

const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
);

test('loads data', async () => {
    render(<Component />, { wrapper });
    await waitFor(() => expect(screen.getByText('Data')).toBeInTheDocument());
});
```

---

## Common Issues & Solutions

### Issue 1: Hook not found
**Solution**: Check import path and barrel exports

### Issue 2: Data undefined
**Solution**: Add optional chaining `data?.items`

### Issue 3: Infinite loop
**Solution**: Check dependency arrays in useCallback

### Issue 4: Cache not invalidating
**Solution**: Verify query keys match in hook and mutation

### Issue 5: TypeScript errors
**Solution**: Import types from `@topsmile/types`

---

## Rollback Procedure

If migration causes issues:
1. Uncomment old code
2. Comment new code
3. Test old functionality
4. Debug issue
5. Re-attempt migration

---

## Success Criteria

### Per Component
- ✅ Compiles without errors
- ✅ All features work
- ✅ No performance regression
- ✅ Tests pass
- ✅ Code review approved

### Overall
- ✅ All 6 components migrated
- ✅ No breaking changes
- ✅ Documentation updated
- ✅ Team trained
- ✅ Production ready

---

## Support & Resources

- **Migration Guide**: `docs/COMPONENT-MIGRATION-GUIDE.md`
- **State Management**: `docs/STATE_MANAGEMENT.md`
- **Hooks Reference**: `docs/review/15-Hooks-Complete.md`
- **Examples**: See migrated components (PatientManagement, etc.)

---

## Timeline

**Start Date**: Immediately
**Target Completion**: 3 days
**Buffer**: 2 days for testing
**Total**: 1 week

---

**Status**: 📋 READY TO START
**Priority**: HIGH
**Assigned**: Development Team
**Next Review**: After Day 1 completion
