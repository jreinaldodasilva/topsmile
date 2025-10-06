# Component Migration Plan

## Overview
This document tracks the migration of existing components to the new feature-based structure.

## Migration Strategy
1. Identify component dependencies
2. Move shared/generic components to `src/components/common/`
3. Move feature-specific components to `src/features/{feature}/components/`
4. Update imports across the application
5. Test functionality after migration

## Component Inventory

### Common Components (src/components/common/)
- [ ] Button - Generic button component
- [ ] Input - Generic input component
- [ ] Modal - Generic modal component
- [ ] Card - Generic card component
- [ ] Table - Generic table component
- [ ] Loading - Loading spinner component
- [ ] Alert - Alert/notification component

### Appointments Feature (src/features/appointments/)
- [ ] AppointmentList - From src/components/Appointments/
- [ ] AppointmentForm - From src/components/Appointments/
- [ ] AppointmentCalendar - From src/components/Calendar/
- [ ] AppointmentCard - From src/components/Appointments/

### Patients Feature (src/features/patients/)
- [ ] PatientList - From src/components/Patients/
- [ ] PatientForm - From src/components/Patients/
- [ ] PatientCard - From src/components/Patients/
- [ ] PatientDetails - From src/components/Patients/
- [ ] MedicalHistoryForm - From src/components/Patients/

### Providers Feature (src/features/providers/)
- [ ] ProviderList - From src/components/Providers/
- [ ] ProviderForm - From src/components/Providers/
- [ ] ProviderCard - From src/components/Providers/
- [ ] ProviderSchedule - From src/components/Providers/

### Clinical Feature (src/features/clinical/)
- [ ] DentalChart - From src/components/DentalChart/
- [ ] TreatmentPlanForm - From src/components/TreatmentPlan/
- [ ] TreatmentPlanList - From src/components/TreatmentPlan/
- [ ] ClinicalNotes - From src/components/Clinical/
- [ ] ToothSelector - From src/components/DentalChart/

### Auth Feature (src/features/auth/)
- [ ] LoginForm - From src/components/Auth/
- [ ] RegisterForm - From src/components/Auth/
- [ ] ForgotPasswordForm - From src/components/Auth/
- [ ] ProtectedRoute - From src/components/Auth/

### Dashboard Feature (src/features/dashboard/)
- [ ] DashboardStats - From src/components/Dashboard/
- [ ] RecentAppointments - From src/components/Dashboard/
- [ ] UpcomingAppointments - From src/components/Dashboard/
- [ ] QuickActions - From src/components/Dashboard/

## Migration Progress
- **Total Components**: ~30
- **Migrated**: 0
- **Remaining**: 30
- **Progress**: 0%

## Notes
- Components are currently in legacy structure under `src/components/`
- New structure separates common components from feature-specific components
- Each feature module is self-contained with components, hooks, services, and types
- Migration will be done incrementally to avoid breaking changes
