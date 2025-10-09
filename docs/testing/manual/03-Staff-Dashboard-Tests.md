# Manual Testing - Staff Dashboard Tests

## Purpose

Verify staff dashboard functionality, navigation, widgets, data visualization, and role-specific views.

## Prerequisites

- Complete Document 01 (Environment Setup)
- Complete Document 02 (Authentication Tests)
- Logged in as staff user

## Dashboard Overview Tests

### TC-DASH-001: Dashboard Load and Display

**Objective**: Verify dashboard loads correctly after login

**Test Steps**:
1. Log in as `admin@test.topsmile.com`
2. Observe dashboard page load
3. Verify all dashboard sections render
4. Check page load time

**Expected Results**:
- Dashboard loads within 2 seconds
- All widgets/cards display
- No loading spinners stuck
- No console errors
- Page title: "Dashboard - TopSmile"

**Dashboard Components to Verify**:
- [ ] Header with clinic name
- [ ] Navigation menu (sidebar or top nav)
- [ ] User profile section
- [ ] Main content area
- [ ] Statistics/metrics cards
- [ ] Recent appointments widget
- [ ] Quick actions section

| Test ID | Status | Load Time | Notes |
|---------|--------|-----------|-------|
| TC-DASH-001 | | | |

---

### TC-DASH-002: Dashboard Statistics Display

**Objective**: Verify statistics cards show correct data

**Test Steps**:
1. Navigate to dashboard
2. Locate statistics cards
3. Verify each metric displays a number
4. Check metrics are reasonable

**Expected Metrics**:
- Total de Pacientes (Total Patients)
- Agendamentos Hoje (Appointments Today)
- Agendamentos Pendentes (Pending Appointments)
- Receita do Mês (Monthly Revenue) - if applicable

**Expected Results**:
- All metrics show numeric values
- Values are non-negative
- Metrics update when data changes
- Hover states work (if applicable)
- Click actions work (if applicable)

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-DASH-002 | | | |

---

### TC-DASH-003: Recent Appointments Widget

**Objective**: Verify recent appointments display correctly

**Test Steps**:
1. Navigate to dashboard
2. Locate "Agendamentos Recentes" section
3. Verify appointments list displays
4. Check appointment details

**Expected Results**:
- List shows 5-10 recent appointments
- Each appointment shows:
  - Patient name
  - Date and time
  - Provider name
  - Appointment type
  - Status badge
- Appointments sorted by date (most recent first)
- Click appointment to view details

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-DASH-003 | | | |

---

### TC-DASH-004: Quick Actions

**Objective**: Verify quick action buttons work

**Test Steps**:
1. Navigate to dashboard
2. Locate quick action buttons
3. Click each action button
4. Verify correct page/modal opens

**Expected Quick Actions**:
- "Novo Agendamento" → Opens appointment booking
- "Novo Paciente" → Opens patient registration
- "Ver Calendário" → Opens calendar view
- "Relatórios" → Opens reports page

**Expected Results**:
- All buttons are clickable
- Correct navigation occurs
- Modals open if applicable
- No broken links

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-DASH-004 | | | |

---

## Navigation Tests

### TC-DASH-101: Main Navigation Menu

**Objective**: Verify all navigation menu items work

**Test Steps**:
1. Log in as admin
2. Locate main navigation menu
3. Click each menu item
4. Verify correct page loads

**Expected Menu Items**:
- Dashboard / Início
- Agendamentos / Appointments
- Pacientes / Patients
- Profissionais / Providers
- Calendário / Calendar
- Relatórios / Reports
- Configurações / Settings

**Expected Results**:
- All menu items visible
- Active item highlighted
- Click navigates to correct page
- URL updates correctly
- Breadcrumbs update (if present)

| Menu Item | Expected URL | Status | Notes |
|-----------|--------------|--------|-------|
| Dashboard | /dashboard | | |
| Agendamentos | /appointments | | |
| Pacientes | /patients | | |
| Profissionais | /providers | | |
| Calendário | /calendar | | |
| Relatórios | /reports | | |
| Configurações | /settings | | |

---

### TC-DASH-102: User Profile Menu

**Objective**: Verify user profile dropdown works

**Test Steps**:
1. Navigate to dashboard
2. Click user profile icon/name
3. Verify dropdown menu opens
4. Click each menu option

**Expected Menu Options**:
- Meu Perfil (My Profile)
- Configurações (Settings)
- Ajuda (Help)
- Sair (Logout)

**Expected Results**:
- Dropdown opens on click
- All options visible
- Options navigate correctly
- Logout works (see TC-AUTH-004)

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-DASH-102 | | | |

---

### TC-DASH-103: Breadcrumb Navigation

**Objective**: Verify breadcrumb trail works

**Test Steps**:
1. Navigate to Dashboard
2. Click Pacientes
3. Click specific patient
4. Verify breadcrumb shows: Dashboard > Pacientes > [Patient Name]
5. Click "Pacientes" in breadcrumb
6. Verify navigation back to patients list

**Expected Results**:
- Breadcrumb displays current path
- Each breadcrumb item is clickable
- Navigation works correctly
- Current page not clickable

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-DASH-103 | | | |

---

## Role-Specific Dashboard Tests

### TC-DASH-201: Admin Dashboard View

**Objective**: Verify admin sees all features

**Test Steps**:
1. Log in as `admin@test.topsmile.com`
2. Navigate to dashboard
3. Verify admin-specific features visible

**Expected Admin Features**:
- All statistics visible
- Access to all menu items
- User management options
- Clinic settings access
- Financial reports access

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-DASH-201 | | | |

---

### TC-DASH-202: Provider Dashboard View

**Objective**: Verify provider sees relevant features

**Test Steps**:
1. Log in as `dentist@test.topsmile.com`
2. Navigate to dashboard
3. Verify provider-specific view

**Expected Provider Features**:
- Today's appointments
- Patient list (assigned patients)
- Clinical notes access
- Treatment plans
- Limited admin features

**Should NOT See**:
- Financial reports
- User management
- Clinic settings

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-DASH-202 | | | |

---

### TC-DASH-203: Staff Dashboard View

**Objective**: Verify staff sees appropriate features

**Test Steps**:
1. Log in as `staff@test.topsmile.com`
2. Navigate to dashboard
3. Verify staff-specific view

**Expected Staff Features**:
- Appointment scheduling
- Patient registration
- Basic patient info
- Calendar view

**Should NOT See**:
- Clinical notes
- Treatment plans
- Financial reports
- User management

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-DASH-203 | | | |

---

### TC-DASH-204: Super Admin Dashboard View

**Objective**: Verify super admin sees all features across clinics

**Test Steps**:
1. Log in as `superadmin@test.topsmile.com`
2. Navigate to dashboard
3. Verify super admin features

**Expected Super Admin Features**:
- Clinic selector dropdown
- System-wide statistics
- All clinics data
- User management across clinics
- System configuration

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-DASH-204 | | | |

---

## Data Refresh Tests

### TC-DASH-301: Dashboard Auto-Refresh

**Objective**: Verify dashboard data updates automatically

**Test Steps**:
1. Log in and view dashboard
2. Note current appointment count
3. In another browser/tab, create new appointment
4. Return to dashboard
5. Observe if data updates

**Expected Results**:
- Dashboard refreshes automatically (if implemented)
- Or manual refresh button available
- Data stays current

**Note**: Auto-refresh may not be implemented; verify expected behavior.

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-DASH-301 | | | |

---

### TC-DASH-302: Manual Refresh

**Objective**: Verify manual page refresh updates data

**Test Steps**:
1. View dashboard
2. Press F5 to refresh
3. Verify data reloads
4. Check for loading indicators

**Expected Results**:
- Page refreshes smoothly
- Loading indicators shown
- Data updates correctly
- User remains logged in

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-DASH-302 | | | |

---

## Responsive Design Tests

### TC-DASH-401: Mobile View (375px)

**Objective**: Verify dashboard works on mobile

**Test Steps**:
1. Open DevTools (F12)
2. Enable device toolbar (Ctrl+Shift+M)
3. Select iPhone 12 Pro (375px)
4. Navigate to dashboard
5. Verify layout adapts

**Expected Results**:
- Navigation collapses to hamburger menu
- Statistics stack vertically
- All content accessible
- No horizontal scroll
- Touch targets adequate size

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-DASH-401 | | | |

---

### TC-DASH-402: Tablet View (768px)

**Objective**: Verify dashboard works on tablet

**Test Steps**:
1. Set device emulation to iPad (768px)
2. Navigate to dashboard
3. Verify layout adapts

**Expected Results**:
- Layout optimized for tablet
- Navigation accessible
- Statistics in 2-column grid
- All features usable

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-DASH-402 | | | |

---

### TC-DASH-403: Desktop View (1920px)

**Objective**: Verify dashboard works on large desktop

**Test Steps**:
1. Set browser to full screen (1920px)
2. Navigate to dashboard
3. Verify layout uses space effectively

**Expected Results**:
- Layout scales appropriately
- No excessive whitespace
- Content readable
- Navigation always visible

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-DASH-403 | | | |

---

## Performance Tests

### TC-DASH-501: Dashboard Load Time

**Objective**: Measure dashboard initial load performance

**Test Steps**:
1. Clear browser cache
2. Open DevTools > Network tab
3. Log in
4. Measure time to dashboard fully loaded
5. Check "Load" time in Network tab

**Expected Results**:
- Initial load < 3 seconds
- Time to interactive < 2 seconds
- No unnecessary API calls
- Images optimized

| Test ID | Status | Load Time | Notes |
|---------|--------|-----------|-------|
| TC-DASH-501 | | | |

---

### TC-DASH-502: Dashboard API Calls

**Objective**: Verify efficient API usage

**Test Steps**:
1. Open DevTools > Network tab
2. Filter by XHR/Fetch
3. Navigate to dashboard
4. Count API calls
5. Check for duplicate calls

**Expected Results**:
- Minimal API calls (< 10)
- No duplicate requests
- Parallel loading where possible
- Proper error handling

| Test ID | Status | API Calls | Notes |
|---------|--------|-----------|-------|
| TC-DASH-502 | | | |

---

## Error Handling Tests

### TC-DASH-601: Dashboard with No Data

**Objective**: Verify dashboard handles empty state

**Test Steps**:
1. Log in with account that has no data
2. Navigate to dashboard
3. Observe empty state handling

**Expected Results**:
- Empty state message displayed
- "Nenhum agendamento encontrado" or similar
- Helpful guidance provided
- No errors or broken UI

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-DASH-601 | | | |

---

### TC-DASH-602: Dashboard with API Error

**Objective**: Verify error handling when API fails

**Test Steps**:
1. Stop backend server
2. Navigate to dashboard
3. Observe error handling

**Expected Results**:
- Error message displayed
- "Erro ao carregar dados" or similar
- Retry button available
- UI doesn't break

**Note**: Restart backend after test.

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-DASH-602 | | | |

---

## Test Summary

| Category | Total Tests | Passed | Failed | Blocked | Pass Rate |
|----------|-------------|--------|--------|---------|-----------|
| Dashboard Overview | 4 | | | | |
| Navigation | 3 | | | | |
| Role-Specific | 4 | | | | |
| Data Refresh | 2 | | | | |
| Responsive | 3 | | | | |
| Performance | 2 | | | | |
| Error Handling | 2 | | | | |
| **TOTAL** | **20** | | | | |

## Next Steps

After completing dashboard tests:
1. ✅ Document all results
2. 🐛 Report any failures
3. 📋 Proceed to **Document 04 - Patient Portal Tests**

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Test Coverage**: Staff Dashboard & Navigation
