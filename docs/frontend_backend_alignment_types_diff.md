# Frontend-Backend Type Alignment Differences

This document lists the type definitions that are not aligned between the frontend (`src/types/api.ts`) and backend models (`backend/src/models/`).

## Summary
The frontend types were updated to match backend models, but several differences remain due to:
- Field naming conventions
- Optional vs required fields
- Missing fields in frontend types
- Extra fields in frontend types
- Enum value differences

## Detailed Differences

### 1. User Type
**Backend (IUser):**
- `clinic?: mongoose.Types.ObjectId` (references Clinic)
- Has additional security fields: `password`, `loginAttempts`, `lockUntil`, `passwordResetToken`, `passwordResetExpires`

**Frontend (User):**
- `clinic?: string | Clinic` (inconsistent type)
- `clinicId?: string` (extra field, not in backend)
- Missing security fields (correctly omitted for security)

**Issues:**
- `clinic` type mismatch: ObjectId vs string/ Clinic
- Extra `clinicId` field

### 2. Contact Type
**Backend (IContact):**
- `status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed' | 'deleted' | 'merged'`
- `clinic: string` (clinic name as string)
- Has `assignedToClinic?: mongoose.Types.ObjectId`

**Frontend (Contact):**
- `status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed' | 'deleted' | 'merged'` (includes all)
- `clinic: string`
- `assignedToClinic?: string`
- Extra fields: `tags?: string[]`, `customFields?: Record<string, any>`

**Issues:**
- `assignedToClinic` type: ObjectId vs string
- Extra fields not in backend: `tags`, `customFields`

### 3. Clinic Type
**Backend (IClinic):**
- No `isActive` field
- `subscription.status: 'active' | 'inactive' | 'suspended' | 'canceled'`
- `settings.allowOnlineBooking: boolean`
- No `requireApproval` in settings

**Frontend (Clinic):**
- `isActive?: boolean` (extra field)
- `subscription.status: 'active' | 'inactive' | 'cancelled' | 'past_due'` (different enum values)
- `settings.allowOnlineBooking: boolean` (matches)
- `settings.requireApproval?: boolean` (extra field)

**Issues:**
- Extra `isActive` field
- Different enum values for `subscription.status`
- Extra `requireApproval` in settings

### 4. Patient Type
**Backend (IPatient):**
- `name: string` (single field)
- `birthDate?: Date`
- `clinic: mongoose.Types.ObjectId` (required)
- `status: 'active' | 'inactive'`
- No `isActive` field
- No `rg` field

**Frontend (Patient):**
- `firstName?: string`, `lastName?: string`, `fullName?: string` (split name)
- `dateOfBirth?: string | Date`
- `clinic?: string | Clinic`
- `status?: 'active' | 'inactive'`
- `isActive?: boolean` (extra field)
- `rg?: string` (extra field)

**Issues:**
- Name field structure different
- `birthDate` vs `dateOfBirth`
- `clinic` type: ObjectId vs string/Clinic
- Extra fields: `isActive`, `rg`

### 5. Provider Type
**Backend (IProvider):**
- `licenseNumber?: string`
- `user?: mongoose.Types.ObjectId` (link to User)
- `specialties: string[]`
- `appointmentTypes: mongoose.Types.ObjectId[]`

**Frontend (Provider):**
- `license?: string` (different field name)
- Missing `user` field
- `specialties?: string[]`
- `appointmentTypes?: string[]` (ObjectId vs string)

**Issues:**
- `licenseNumber` vs `license`
- Missing `user` field
- `appointmentTypes` type: ObjectId[] vs string[]

### 6. AppointmentType Type
**Backend (IAppointmentType):**
- `allowOnlineBooking: boolean`
- `preparationInstructions?: string`
- `postTreatmentInstructions?: string`
- `category: 'consultation' | 'cleaning' | 'treatment' | 'surgery' | 'emergency'` (required)

**Frontend (AppointmentType):**
- Missing `allowOnlineBooking`
- Missing `preparationInstructions`
- Missing `postTreatmentInstructions`
- `category?: 'consultation' | 'cleaning' | 'treatment' | 'surgery' | 'emergency'`

**Issues:**
- Missing fields in frontend: `allowOnlineBooking`, `preparationInstructions`, `postTreatmentInstructions`

### 7. Appointment Type
**Backend (IAppointment):**
- All fields match closely with frontend
- Reference fields are ObjectIds

**Frontend (Appointment):**
- Reference fields are `string | Object` (e.g., `patient: string | Patient`)

**Issues:**
- Reference field types: ObjectId vs string/Object

## Recommendations

1. **Standardize reference field types:** Decide whether frontend should use string IDs or populated objects, and ensure consistency.

2. **Update frontend types:** Add missing fields from backend models to frontend types.

3. **Remove extra fields:** Remove fields from frontend types that don't exist in backend.

4. **Fix enum values:** Ensure enum values match between frontend and backend.

5. **Field naming consistency:** Use consistent naming (e.g., `licenseNumber` vs `license`).

6. **Optional vs Required:** Review which fields should be optional vs required in both ends.

## Next Steps

- Update frontend types to include all backend fields
- Remove frontend-only fields or add them to backend if needed
- Ensure API responses populate references consistently
- Add validation in frontend forms based on backend requirements
