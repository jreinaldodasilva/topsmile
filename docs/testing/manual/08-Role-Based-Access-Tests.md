# Manual Testing - Role-Based Access Control Tests

## Purpose

Verify that role-based permissions are correctly enforced across the TopSmile system. Ensure users can only access features and data appropriate for their role.

## Prerequisites

- Test accounts for all roles configured
- Logged in with appropriate role for each test
- Understanding of role hierarchy and permissions

## Role Overview

### Staff Roles
| Role | Code | Access Level | Key Permissions |
|------|------|--------------|-----------------|
| Super Admin | super_admin | System-wide | All features, all clinics |
| Admin | admin | Clinic-wide | Clinic management, reports, users |
| Provider | provider | Clinical | Patient care, appointments, clinical notes |
| Staff | staff | Operational | Scheduling, patient registration |

### Patient Role
| Role | Code | Access Level | Key Permissions |
|------|------|--------------|-----------------|
| Patient | patient | Self-service | Own appointments, records, payments |

## Super Admin Access Tests

### TC-RBAC-001: Super Admin - Full System Access

**Objective**: Verify super admin can access all features

**Test Steps**:
1. Log in as `superadmin@test.topsmile.com`
2. Navigate to each main menu item
3. Verify access granted to all pages

**Expected Access**:
- ✅ Dashboard (all clinics)
- ✅ Appointments (all clinics)
- ✅ Patients (all clinics)
- ✅ Providers (all clinics)
- ✅ Users Management
- ✅ Clinic Management
- ✅ System Settings
- ✅ Reports (all clinics)
- ✅ Financial Reports

**Expected Features**:
- Clinic selector dropdown visible
- Can switch between clinics
- Can view/edit all clinic data
- Can create/edit/delete users
- Can configure system settings

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-001 | | | |

---

### TC-RBAC-002: Super Admin - Clinic Switching

**Objective**: Verify super admin can switch between clinics

**Test Steps**:
1. Log in as super admin
2. Locate clinic selector dropdown
3. Select "Test Clinic 1"
4. Verify data updates to show Clinic 1 data
5. Select "Test Clinic 2"
6. Verify data updates to show Clinic 2 data

**Expected Results**:
- Clinic selector visible in header
- Lists all clinics
- Switching updates all data views
- Dashboard statistics update
- Appointments list updates
- Patients list updates

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-002 | | | |

---

### TC-RBAC-003: Super Admin - User Management

**Objective**: Verify super admin can manage users across clinics

**Test Steps**:
1. Log in as super admin
2. Navigate to Users Management
3. Verify can view all users
4. Create new user for Clinic 1
5. Edit user from Clinic 2
6. Deactivate user from Clinic 1

**Expected Results**:
- Can view users from all clinics
- Can create users for any clinic
- Can edit any user
- Can change user roles
- Can activate/deactivate users
- Can reset passwords

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-003 | | | |

---

## Admin Access Tests

### TC-RBAC-101: Admin - Clinic-Wide Access

**Objective**: Verify admin can access all features within their clinic

**Test Steps**:
1. Log in as `admin@test.topsmile.com`
2. Navigate to each main menu item
3. Verify access to clinic features

**Expected Access**:
- ✅ Dashboard (own clinic only)
- ✅ Appointments (own clinic)
- ✅ Patients (own clinic)
- ✅ Providers (own clinic)
- ✅ Users Management (own clinic)
- ✅ Clinic Settings (own clinic)
- ✅ Reports (own clinic)
- ✅ Financial Reports (own clinic)

**Should NOT Access**:
- ❌ Other clinics' data
- ❌ System-wide settings
- ❌ Clinic selector dropdown

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-101 | | | |

---

### TC-RBAC-102: Admin - User Management (Clinic-Scoped)

**Objective**: Verify admin can only manage users in their clinic

**Test Steps**:
1. Log in as admin (Test Clinic 1)
2. Navigate to Users Management
3. Verify only Clinic 1 users visible
4. Attempt to view Clinic 2 users (should fail)
5. Create new user
6. Verify user assigned to Clinic 1

**Expected Results**:
- Only own clinic users visible
- Cannot see other clinics' users
- Can create users for own clinic
- Can edit own clinic users
- Cannot change clinic assignment
- New users auto-assigned to admin's clinic

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-102 | | | |

---

### TC-RBAC-103: Admin - Financial Reports Access

**Objective**: Verify admin can access financial reports

**Test Steps**:
1. Log in as admin
2. Navigate to Reports
3. Access Financial Reports section
4. Verify can view revenue, payments, etc.

**Expected Results**:
- Financial reports menu visible
- Can view revenue reports
- Can view payment history
- Can export financial data
- Data scoped to own clinic only

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-103 | | | |

---

### TC-RBAC-104: Admin - Clinic Settings Access

**Objective**: Verify admin can configure clinic settings

**Test Steps**:
1. Log in as admin
2. Navigate to Settings
3. Access Clinic Settings
4. Modify clinic information
5. Save changes

**Expected Results**:
- Can edit clinic name, address, contact info
- Can configure business hours
- Can manage appointment types
- Can configure notification settings
- Cannot access system-wide settings

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-104 | | | |

---

## Provider Access Tests

### TC-RBAC-201: Provider - Clinical Access

**Objective**: Verify provider can access clinical features

**Test Steps**:
1. Log in as `dentist@test.topsmile.com`
2. Navigate to available menu items
3. Verify clinical access

**Expected Access**:
- ✅ Dashboard (own appointments)
- ✅ Appointments (own appointments)
- ✅ Patients (assigned patients)
- ✅ Clinical Notes
- ✅ Treatment Plans
- ✅ Calendar (own schedule)

**Should NOT Access**:
- ❌ User Management
- ❌ Clinic Settings
- ❌ Financial Reports
- ❌ Other providers' appointments
- ❌ System configuration

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-201 | | | |

---

### TC-RBAC-202: Provider - Own Appointments Only

**Objective**: Verify provider sees only their appointments

**Test Steps**:
1. Log in as provider
2. Navigate to Appointments
3. Verify only own appointments visible
4. Navigate to Calendar
5. Verify only own schedule visible

**Expected Results**:
- Appointments list filtered to provider
- Cannot view other providers' appointments
- Calendar shows only own availability
- Dashboard shows own statistics only

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-202 | | | |

---

### TC-RBAC-203: Provider - Patient Access (Assigned Only)

**Objective**: Verify provider can only access assigned patients

**Test Steps**:
1. Log in as provider
2. Navigate to Patients
3. Verify only assigned patients visible
4. Attempt to access unassigned patient (via URL)
5. Verify access denied

**Expected Results**:
- Patients list shows only assigned patients
- Can view assigned patient details
- Can add clinical notes for assigned patients
- Cannot access unassigned patients
- Error message if attempting unauthorized access

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-203 | | | |

---

### TC-RBAC-204: Provider - Clinical Notes Access

**Objective**: Verify provider can create/edit clinical notes

**Test Steps**:
1. Log in as provider
2. Open assigned patient record
3. Add clinical note
4. Edit own clinical note
5. Attempt to edit another provider's note

**Expected Results**:
- Can create clinical notes
- Can edit own notes
- Can view other providers' notes (read-only)
- Cannot edit other providers' notes
- Cannot delete clinical notes

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-204 | | | |

---

### TC-RBAC-205: Provider - No Financial Access

**Objective**: Verify provider cannot access financial data

**Test Steps**:
1. Log in as provider
2. Look for Financial Reports menu
3. Attempt to access financial reports via URL
4. Verify access denied

**Expected Results**:
- Financial Reports menu not visible
- Direct URL access returns 403 Forbidden
- Error message: "Acesso negado"
- Redirect to dashboard or error page

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-205 | | | |

---

## Staff Access Tests

### TC-RBAC-301: Staff - Operational Access

**Objective**: Verify staff can access operational features

**Test Steps**:
1. Log in as `staff@test.topsmile.com`
2. Navigate to available menu items
3. Verify operational access

**Expected Access**:
- ✅ Dashboard (basic view)
- ✅ Appointments (create, view, edit)
- ✅ Patients (register, view, edit basic info)
- ✅ Calendar (view all providers)
- ✅ Schedule Management

**Should NOT Access**:
- ❌ Clinical Notes
- ❌ Treatment Plans
- ❌ User Management
- ❌ Clinic Settings
- ❌ Financial Reports
- ❌ Provider Management

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-301 | | | |

---

### TC-RBAC-302: Staff - Appointment Management

**Objective**: Verify staff can manage appointments

**Test Steps**:
1. Log in as staff
2. Create new appointment
3. Edit existing appointment
4. Cancel appointment
5. View all appointments

**Expected Results**:
- Can create appointments for any provider
- Can edit appointment details
- Can cancel appointments
- Can view all clinic appointments
- Cannot access clinical notes from appointments

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-302 | | | |

---

### TC-RBAC-303: Staff - Patient Registration

**Objective**: Verify staff can register and manage patients

**Test Steps**:
1. Log in as staff
2. Create new patient
3. Edit patient demographics
4. View patient list
5. Attempt to access clinical notes

**Expected Results**:
- Can register new patients
- Can edit patient contact info
- Can view patient list
- Cannot access clinical notes
- Cannot view treatment plans
- Cannot access medical history details

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-303 | | | |

---

### TC-RBAC-304: Staff - No Clinical Access

**Objective**: Verify staff cannot access clinical features

**Test Steps**:
1. Log in as staff
2. Look for Clinical Notes menu
3. Attempt to access clinical notes via URL
4. Attempt to access treatment plans via URL

**Expected Results**:
- Clinical features not visible in menu
- Direct URL access returns 403 Forbidden
- Error message displayed
- Redirect to authorized page

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-304 | | | |

---

## Patient Access Tests

### TC-RBAC-401: Patient - Self-Service Access

**Objective**: Verify patient can access own data only

**Test Steps**:
1. Log in as `patient1@test.topsmile.com`
2. Navigate to patient portal
3. Verify self-service features

**Expected Access**:
- ✅ Own Profile
- ✅ Own Appointments
- ✅ Own Medical Records
- ✅ Own Treatment History
- ✅ Appointment Booking
- ✅ Payment History
- ✅ Messages/Communication

**Should NOT Access**:
- ❌ Other patients' data
- ❌ Staff dashboard
- ❌ Clinic management
- ❌ Provider schedules (except for booking)
- ❌ Other patients' appointments

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-401 | | | |

---

### TC-RBAC-402: Patient - Own Appointments Only

**Objective**: Verify patient sees only own appointments

**Test Steps**:
1. Log in as patient1
2. Navigate to Appointments
3. Verify only own appointments visible
4. Attempt to access another patient's appointment (via URL)
5. Verify access denied

**Expected Results**:
- Only own appointments visible
- Cannot view other patients' appointments
- Can book new appointments
- Can cancel own appointments
- Error if accessing unauthorized appointment

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-402 | | | |

---

### TC-RBAC-403: Patient - Own Medical Records Only

**Objective**: Verify patient can only access own records

**Test Steps**:
1. Log in as patient1
2. Navigate to Medical Records
3. Verify only own records visible
4. Attempt to access another patient's records (via URL)
5. Verify access denied

**Expected Results**:
- Can view own medical history
- Can view own treatment plans
- Can view own clinical notes (read-only)
- Cannot access other patients' records
- 403 error if attempting unauthorized access

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-403 | | | |

---

### TC-RBAC-404: Patient - No Staff Features

**Objective**: Verify patient cannot access staff features

**Test Steps**:
1. Log in as patient
2. Attempt to access staff dashboard via URL
3. Attempt to access patient management via URL
4. Attempt to access clinic settings via URL

**Expected Results**:
- Staff URLs return 403 Forbidden
- Error message: "Acesso negado"
- Redirect to patient portal
- No staff menu items visible

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-404 | | | |

---

## Cross-Role Security Tests

### TC-RBAC-501: URL Manipulation - Unauthorized Access

**Objective**: Verify direct URL access is blocked for unauthorized features

**Test Steps**:
1. Log in as staff
2. Manually enter admin URL: `/admin/users`
3. Verify access denied
4. Log in as provider
5. Manually enter URL: `/admin/financial-reports`
6. Verify access denied

**Expected Results**:
- 403 Forbidden response
- Error message displayed
- Redirect to authorized page
- No data leaked in error response

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-501 | | | |

---

### TC-RBAC-502: API Endpoint Protection

**Objective**: Verify API endpoints enforce role permissions

**Test Steps**:
1. Log in as staff
2. Open DevTools > Network tab
3. Attempt to call admin API endpoint
4. Observe response

**Test API Calls**:
```
GET /api/admin/users (as staff) → 403
GET /api/financial-reports (as provider) → 403
GET /api/patients/:id (as different patient) → 403
POST /api/clinic/settings (as staff) → 403
```

**Expected Results**:
- API returns 403 Forbidden
- Error message in response
- No sensitive data in error
- Request logged for security audit

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-502 | | | |

---

### TC-RBAC-503: Session Hijacking Prevention

**Objective**: Verify role cannot be escalated via session manipulation

**Test Steps**:
1. Log in as staff
2. Open DevTools > Application > Cookies
3. Attempt to modify role in token (if visible)
4. Refresh page
5. Verify role not changed

**Expected Results**:
- Token is HttpOnly (not accessible via JavaScript)
- Token is signed/encrypted
- Modified token rejected by backend
- User logged out if token invalid
- No privilege escalation possible

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-503 | | | |

---

### TC-RBAC-504: Multi-Tenant Data Isolation

**Objective**: Verify users cannot access other clinics' data

**Test Steps**:
1. Log in as admin (Clinic 1)
2. Note a patient ID from Clinic 2
3. Attempt to access Clinic 2 patient via URL
4. Verify access denied

**Expected Results**:
- Cannot access other clinics' data
- 403 Forbidden or 404 Not Found
- Error message displayed
- Data properly scoped by clinicId

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-504 | | | |

---

## Permission Matrix Verification

### TC-RBAC-601: Complete Permission Matrix Test

**Objective**: Verify complete permission matrix

**Test Matrix**:

| Feature | Super Admin | Admin | Provider | Staff | Patient |
|---------|-------------|-------|----------|-------|---------|
| Dashboard (All) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Dashboard (Own) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Appointments (All) | ✅ | ✅ | ❌ | ✅ | ❌ |
| Appointments (Own) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Patients (All) | ✅ | ✅ | ❌ | ✅ | ❌ |
| Patients (Assigned) | ✅ | ✅ | ✅ | ❌ | ❌ |
| Patients (Self) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Clinical Notes | ✅ | ✅ | ✅ | ❌ | 👁️ |
| Treatment Plans | ✅ | ✅ | ✅ | ❌ | 👁️ |
| User Management | ✅ | ✅ | ❌ | ❌ | ❌ |
| Clinic Settings | ✅ | ✅ | ❌ | ❌ | ❌ |
| Financial Reports | ✅ | ✅ | ❌ | ❌ | ❌ |
| Payment Processing | ✅ | ✅ | ❌ | ✅ | ✅ |
| System Settings | ✅ | ❌ | ❌ | ❌ | ❌ |

**Legend**: ✅ Full Access | 👁️ Read Only | ❌ No Access

**Test Steps**:
1. Test each cell in matrix
2. Log in with appropriate role
3. Verify access matches matrix
4. Document any discrepancies

| Test ID | Status | Discrepancies | Notes |
|---------|--------|---------------|-------|
| TC-RBAC-601 | | | |

---

## Test Summary

| Category | Total Tests | Passed | Failed | Blocked | Pass Rate |
|----------|-------------|--------|--------|---------|-----------|
| Super Admin | 3 | | | | |
| Admin | 4 | | | | |
| Provider | 5 | | | | |
| Staff | 4 | | | | |
| Patient | 4 | | | | |
| Cross-Role Security | 4 | | | | |
| Permission Matrix | 1 | | | | |
| **TOTAL** | **25** | | | | |

## Common Issues

### Issue: User sees features they shouldn't
- **Check**: Role assignment in database
- **Check**: Frontend route guards
- **Check**: Backend middleware

### Issue: User blocked from authorized features
- **Check**: Role permissions configuration
- **Check**: Token contains correct role
- **Check**: Backend authorization logic

### Issue: Can access via URL but not via UI
- **Check**: Frontend route guards
- **Check**: Menu visibility logic
- **Check**: Consistency between frontend and backend

## Next Steps

After completing RBAC tests:
1. ✅ Document all results
2. 🐛 Report security issues immediately
3. 📋 Proceed to **Document 09 - Payment Processing Tests**

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Test Coverage**: Role-Based Access Control & Security
