# Patient Registration Flow Fix

## Issue
The patient registration flow required a `clinicId` but had no way for patients to select a clinic. The frontend was hardcoding a default clinic ID (`'507f1f77bcf86cd799439011'`), which would fail if that clinic didn't exist.

## Solution
Added a public API endpoint to list available clinics and updated the registration form to include a clinic selection dropdown.

## Changes Made

### Backend Changes

#### 1. New Public Endpoint: `/api/public/clinics`
**File**: `backend/src/routes/public/clinics.ts`

- Lists active clinics that allow online booking
- Returns clinic name, city, state, phone, and email
- No authentication required (public endpoint)

**Response Format**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "clinic-id",
      "name": "Clínica Dental",
      "address": {
        "city": "São Paulo",
        "state": "SP"
      },
      "phone": "(11) 99999-9999",
      "email": "contato@clinica.com"
    }
  ]
}
```

#### 2. Updated Public Routes Index
**File**: `backend/src/routes/public/index.ts`

- Added clinics route to public routes

#### 3. Enhanced Validation
**File**: `backend/src/routes/patient/patientAuth.ts`

- Added `.notEmpty()` validation for `clinicId` when creating new patients
- Ensures clinic selection is mandatory for new patient registration

### Frontend Changes

#### 1. Updated Patient Registration Page
**File**: `src/pages/Patient/Register/PatientRegisterPage.tsx`

**Changes**:
- Added `Clinic` interface for type safety
- Added state for clinics list and loading state
- Added `useEffect` to fetch clinics on component mount
- Added clinic selection dropdown as first field in form
- Removed hardcoded default clinic ID
- Added validation to ensure clinic is selected before submission
- Added asterisks (*) to required field labels for better UX

**New Form Flow**:
1. User selects clinic from dropdown (required)
2. User optionally enters existing patient ID
3. User enters name, phone, email, password (required)
4. Form validates clinic selection before submission

## Benefits

1. **User Choice**: Patients can now select which clinic to register with
2. **No Hardcoding**: Removed hardcoded clinic ID that could fail
3. **Better UX**: Clear indication of required fields with asterisks
4. **Scalability**: Supports multiple clinics without code changes
5. **Validation**: Proper validation ensures clinic is selected

## Testing

### Manual Testing
1. Navigate to patient registration page
2. Verify clinic dropdown loads with available clinics
3. Try submitting without selecting clinic (should show error)
4. Select clinic and complete registration
5. Verify patient is created with correct clinic association

### API Testing
```bash
# Test public clinics endpoint
curl http://localhost:5000/api/public/clinics

# Test registration with clinic selection
curl -X POST http://localhost:5000/api/patient-auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "clinicId": "valid-clinic-id",
    "name": "João Silva",
    "email": "joao@example.com",
    "phone": "11999999999",
    "password": "SecurePass123"
  }'
```

## Migration Notes

### For Existing Deployments
1. Ensure at least one clinic exists with:
   - `subscription.status: 'active'`
   - `settings.allowOnlineBooking: true`
2. No database migration required
3. Frontend will automatically fetch and display available clinics

### For New Deployments
1. Create initial clinic(s) before allowing patient registration
2. Set `settings.allowOnlineBooking: true` for clinics that want online registration

## Related Files
- `backend/src/routes/public/clinics.ts` (new)
- `backend/src/routes/public/index.ts` (modified)
- `backend/src/routes/patient/patientAuth.ts` (modified)
- `src/pages/Patient/Register/PatientRegisterPage.tsx` (modified)

## Status
✅ **Completed** - Task 1.7 from Phase 1 Action Plan
