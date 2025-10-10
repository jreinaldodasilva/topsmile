# TopSmile Manual Testing Checklist

**Version**: 2.0.0  
**Last Updated**: 2025-10-10  
**System Status**: 🟩 Production Ready

---

## Quick Test Checklist

Use this checklist for rapid smoke testing or pre-deployment verification.

### ✅ Environment Verification (5 min)

- [ ] Frontend running on http://localhost:3000
- [ ] Backend running on http://localhost:5000
- [ ] Health check passes: http://localhost:5000/api/health
- [ ] Database health: http://localhost:5000/api/health/database
- [ ] API docs accessible: http://localhost:5000/api-docs
- [ ] Browser console shows no errors on load

### ✅ Authentication Tests (10 min)

#### Staff Authentication
- [ ] Staff login works (email + password)
- [ ] Invalid credentials show error in Portuguese
- [ ] Rate limiting triggers after 10 attempts
- [ ] Session persists on page refresh
- [ ] Logout clears session
- [ ] Token refresh works automatically

#### Patient Authentication
- [ ] Patient login works
- [ ] Patient session timeout (30 min)
- [ ] Patient logout works
- [ ] Separate patient/staff sessions

### ✅ Core Functionality (15 min)

#### Appointments
- [ ] View appointment list
- [ ] Create new appointment
- [ ] Edit existing appointment
- [ ] Cancel appointment
- [ ] Appointment status updates
- [ ] Provider availability shows correctly

#### Patients
- [ ] View patient list
- [ ] Search patients
- [ ] Create new patient
- [ ] Edit patient details
- [ ] View patient history

#### Providers
- [ ] View provider list
- [ ] Provider availability calendar
- [ ] Provider specialties display

### ✅ Security Tests (10 min)

- [ ] Unauthorized routes redirect to login
- [ ] Role-based access enforced
- [ ] CSRF token required for POST/PUT/DELETE
- [ ] Rate limiting works (check console)
- [ ] Request ID in response headers (X-Request-ID)
- [ ] Audit log entries created (check backend logs)

### ✅ Error Handling (5 min)

- [ ] Network error shows user-friendly message
- [ ] Validation errors display in Portuguese
- [ ] 404 page shows for invalid routes
- [ ] API errors don't expose sensitive data
- [ ] Console errors are logged with request ID

### ✅ Performance (5 min)

- [ ] Initial page load < 3 seconds
- [ ] API responses < 500ms (check Network tab)
- [ ] No memory leaks (check Performance tab)
- [ ] Lazy loading works for routes
- [ ] Images load progressively

### ✅ UI/UX (10 min)

- [ ] All text in Portuguese
- [ ] Responsive design (resize browser)
- [ ] Mobile view works (DevTools mobile mode)
- [ ] Loading indicators show during API calls
- [ ] Success/error toasts appear
- [ ] Forms validate on submit
- [ ] Buttons disabled during submission

---

## Detailed Test Scenarios

### Scenario 1: New Patient Appointment Booking

**Time**: 10 minutes  
**Role**: Staff

1. [ ] Login as staff user
2. [ ] Navigate to appointments
3. [ ] Click "New Appointment"
4. [ ] Search for patient (or create new)
5. [ ] Select provider
6. [ ] Choose appointment type
7. [ ] Select available time slot
8. [ ] Add notes
9. [ ] Submit appointment
10. [ ] Verify appointment appears in list
11. [ ] Check appointment details
12. [ ] Verify email sent (check logs)

**Expected Results**:
- Appointment created successfully
- Confirmation message in Portuguese
- Appointment visible in calendar
- Provider availability updated
- Audit log entry created

### Scenario 2: Patient Self-Service Booking

**Time**: 10 minutes  
**Role**: Patient

1. [ ] Login as patient
2. [ ] Navigate to "Book Appointment"
3. [ ] Select appointment type
4. [ ] Choose preferred provider
5. [ ] View available slots
6. [ ] Select time slot
7. [ ] Confirm booking
8. [ ] View confirmation
9. [ ] Check "My Appointments"
10. [ ] Verify email received

**Expected Results**:
- Patient can only see their own data
- Available slots are accurate
- Booking confirmation immediate
- Appointment appears in patient portal

### Scenario 3: Role-Based Access Control

**Time**: 15 minutes  
**Roles**: All

#### Super Admin
- [ ] Access all clinics
- [ ] Manage users
- [ ] View system metrics
- [ ] Access admin panel

#### Admin
- [ ] Access own clinic only
- [ ] Manage clinic users
- [ ] View clinic reports
- [ ] Cannot access other clinics

#### Provider
- [ ] View own appointments
- [ ] Access patient records (assigned)
- [ ] Update clinical notes
- [ ] Cannot access admin functions

#### Staff
- [ ] Schedule appointments
- [ ] View patient list
- [ ] Cannot edit clinical notes
- [ ] Cannot access admin panel

#### Patient
- [ ] View own appointments only
- [ ] Book appointments
- [ ] View own records
- [ ] Cannot access staff functions

### Scenario 4: Error Recovery

**Time**: 10 minutes

1. [ ] Start creating appointment
2. [ ] Disconnect network (DevTools offline)
3. [ ] Try to submit
4. [ ] Verify error message
5. [ ] Reconnect network
6. [ ] Retry submission
7. [ ] Verify success

**Expected Results**:
- Clear error message in Portuguese
- No data loss
- Retry works automatically
- User can recover gracefully

### Scenario 5: Concurrent User Testing

**Time**: 15 minutes  
**Setup**: Two browser windows

1. [ ] Login as Staff in Window 1
2. [ ] Login as Patient in Window 2
3. [ ] Staff creates appointment for patient
4. [ ] Patient refreshes their appointments
5. [ ] Verify appointment appears
6. [ ] Patient cancels appointment
7. [ ] Staff refreshes appointments
8. [ ] Verify cancellation reflected

**Expected Results**:
- Real-time updates (or on refresh)
- No data conflicts
- Both users see consistent data

---

## Critical Path Testing

### Must-Pass Tests (Before Production)

1. **Authentication** ✅
   - Staff login/logout
   - Patient login/logout
   - Session management

2. **Appointment Booking** ✅
   - Create appointment
   - View appointments
   - Cancel appointment

3. **Patient Management** ✅
   - Create patient
   - View patient
   - Edit patient

4. **Security** ✅
   - Role-based access
   - CSRF protection
   - Rate limiting

5. **Error Handling** ✅
   - Network errors
   - Validation errors
   - 404 handling

---

## Browser Compatibility Matrix

| Feature | Chrome | Firefox | Safari | Brave |
|---------|--------|---------|--------|-------|
| Authentication | ✅ | ✅ | ✅ | ✅ |
| Appointments | ✅ | ✅ | ✅ | ✅ |
| Patient Portal | ✅ | ✅ | ✅ | ✅ |
| Payments | ✅ | ✅ | ✅ | ✅ |
| Mobile View | ✅ | ✅ | ✅ | ✅ |

**Legend**:
- ✅ Fully supported
- ⚠️ Partial support
- ❌ Not supported
- 🔄 Testing in progress

---

## Performance Benchmarks

| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| Initial Load | < 2s | < 3s | > 3s |
| API Response | < 200ms | < 500ms | > 500ms |
| Page Navigation | < 500ms | < 1s | > 1s |
| Form Submission | < 1s | < 2s | > 2s |

---

## Test Data Requirements

### Minimum Test Data
- 3 clinics
- 5 providers per clinic
- 20 patients per clinic
- 50 appointments (various statuses)
- 10 appointment types

### Test Scenarios Data
- Past appointments (completed)
- Future appointments (scheduled)
- Cancelled appointments
- No-show appointments
- Patients with/without appointments

---

## Issue Severity Guidelines

### 🔴 Critical (Block Release)
- Authentication broken
- Data loss
- Security vulnerability
- System crash

### 🟠 High (Fix Before Release)
- Major feature broken
- Poor error handling
- Performance issues
- Accessibility problems

### 🟡 Medium (Fix Soon)
- Minor feature issues
- UI inconsistencies
- Non-critical bugs
- Missing validations

### 🟢 Low (Nice to Have)
- Cosmetic issues
- Minor UX improvements
- Documentation updates
- Enhancement requests

---

## Quick Commands

### Start Testing
```bash
# Start both servers
npm run dev

# Or separately
npm start                    # Frontend (port 3000)
npm run dev:backend         # Backend (port 5000)
```

### Check System Health
```bash
# Basic health
curl http://localhost:5000/api/health

# Database health
curl http://localhost:5000/api/health/database
```

### View Logs
```bash
# Backend logs (structured JSON)
npm run dev:backend | pino-pretty

# Frontend logs
# Check browser console (F12)
```

### Reset Test Data
```bash
# Contact dev team for reset scripts
# Or manually reset via MongoDB
```

---

## Test Reporting

### Daily Test Summary
- Date: ___________
- Tester: ___________
- Environment: ___________
- Tests Run: ___________
- Tests Passed: ___________
- Tests Failed: ___________
- Critical Issues: ___________
- Notes: ___________

### Issue Template
```markdown
**Issue ID**: MAN-XXX
**Severity**: Critical/High/Medium/Low
**Component**: Authentication/Appointments/etc.
**Browser**: Chrome 120 / Firefox 121 / etc.
**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected**: What should happen
**Actual**: What actually happened
**Screenshots**: [Attach]
**Console Errors**: [Paste]
**Request ID**: [From X-Request-ID header]
```

---

## Next Steps

1. ✅ Complete environment setup
2. ✅ Run quick checklist (1 hour)
3. ✅ Execute detailed scenarios (2-3 hours)
4. ✅ Test critical paths (1 hour)
5. ✅ Browser compatibility (1 hour)
6. ✅ Document all findings
7. ✅ Create GitHub issues for failures

---

**Maintained by**: TopSmile QA Team  
**Last Updated**: 2025-10-10  
**Next Review**: 2024-02-20
