# Manual Testing - Authentication Tests

## Purpose

Verify authentication functionality for both staff and patient login systems, including login, logout, password recovery, session management, and security features.

## Test Environment

- **URL**: http://localhost:3000
- **Browser**: Brave/Chrome (latest)
- **Prerequisites**: Environment setup complete (Document 01)

## Staff Authentication Tests

### TC-AUTH-001: Staff Login - Valid Credentials

**Objective**: Verify staff can log in with valid credentials

**Test Steps**:
1. Navigate to http://localhost:3000
2. Verify staff login form is displayed
3. Enter email: `admin@test.topsmile.com`
4. Enter password: `Admin123!`
5. Click "Entrar" button
6. Observe redirect and dashboard load

**Expected Results**:
- Login form accepts input
- No validation errors shown
- Redirect to `/dashboard` occurs
- Staff dashboard displays correctly
- User name appears in header/navigation
- No console errors

**Test Data**:
| Email | Password | Role | Expected Outcome |
|-------|----------|------|------------------|
| admin@test.topsmile.com | Admin123! | admin | ✅ Success |
| dentist@test.topsmile.com | Dentist123! | provider | ✅ Success |
| staff@test.topsmile.com | Staff123! | staff | ✅ Success |
| superadmin@test.topsmile.com | SuperAdmin123! | super_admin | ✅ Success |

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-001 | | | |

---

### TC-AUTH-002: Staff Login - Invalid Credentials

**Objective**: Verify appropriate error handling for invalid credentials

**Test Steps**:
1. Navigate to http://localhost:3000
2. Enter email: `admin@test.topsmile.com`
3. Enter password: `WrongPassword123!`
4. Click "Entrar" button
5. Observe error message

**Expected Results**:
- Error message displayed in Portuguese
- Message: "E-mail ou senha inválidos" or similar
- User remains on login page
- Password field cleared or remains filled
- No redirect occurs
- Console shows 401 error (expected)

**Test Data**:
| Email | Password | Expected Error |
|-------|----------|----------------|
| admin@test.topsmile.com | WrongPassword | Credenciais inválidas |
| invalid@test.com | Admin123! | Credenciais inválidas |
| admin@test.topsmile.com | (empty) | Campo obrigatório |
| (empty) | Admin123! | Campo obrigatório |

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-002 | | | |

---

### TC-AUTH-003: Staff Login - Input Validation

**Objective**: Verify client-side validation for login form

**Test Steps**:
1. Navigate to http://localhost:3000
2. Leave email field empty
3. Click "Entrar" button
4. Observe validation message
5. Enter invalid email format: `notanemail`
6. Observe validation message
7. Enter valid email but leave password empty
8. Observe validation message

**Expected Results**:
- Empty email shows: "E-mail é obrigatório"
- Invalid email format shows: "E-mail inválido"
- Empty password shows: "Senha é obrigatória"
- Submit button disabled or validation prevents submission
- No API call made until validation passes

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-003 | | | |

---

### TC-AUTH-004: Staff Logout

**Objective**: Verify staff can log out successfully

**Test Steps**:
1. Log in as admin@test.topsmile.com
2. Navigate to dashboard
3. Click user menu/profile icon
4. Click "Sair" or logout button
5. Observe redirect

**Expected Results**:
- Logout button is visible and clickable
- Redirect to login page occurs
- Session cleared (check Application tab > Cookies)
- Cannot access protected routes after logout
- Attempting to access `/dashboard` redirects to login
- No console errors

**Verification**:
- Open Application tab in DevTools
- Check Cookies - auth tokens should be removed
- Try navigating to http://localhost:3000/dashboard
- Should redirect to login

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-004 | | | |

---

### TC-AUTH-005: Staff Session Persistence

**Objective**: Verify session persists across page refreshes

**Test Steps**:
1. Log in as admin@test.topsmile.com
2. Navigate to dashboard
3. Refresh page (F5)
4. Observe page state

**Expected Results**:
- User remains logged in after refresh
- Dashboard loads without redirect to login
- User data persists
- No re-authentication required

**Additional Test**:
1. Log in
2. Close browser tab
3. Open new tab
4. Navigate to http://localhost:3000/dashboard
5. Should still be logged in (if within token expiry)

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-005 | | | |

---

### TC-AUTH-006: Staff Session Expiration

**Objective**: Verify session expires after configured timeout

**Test Steps**:
1. Log in as admin@test.topsmile.com
2. Note current time
3. Wait for access token expiration (15 minutes by default)
4. Attempt to perform an action (e.g., navigate to patients page)
5. Observe behavior

**Expected Results**:
- After access token expires, refresh token should automatically renew session
- If refresh token also expires (7 days), user redirected to login
- Error message: "Sessão expirada. Por favor, faça login novamente."
- No data loss if form was being filled

**Note**: This test requires waiting or manually expiring tokens in backend.

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-006 | | | |

---

### TC-AUTH-007: Staff Password Recovery - Request Reset

**Objective**: Verify password reset request flow

**Test Steps**:
1. Navigate to http://localhost:3000
2. Click "Esqueceu sua senha?" link
3. Verify password reset form displays
4. Enter email: `admin@test.topsmile.com`
5. Click "Enviar" button
6. Observe success message

**Expected Results**:
- "Esqueceu sua senha?" link is visible
- Password reset form loads
- Email field accepts input
- Success message: "E-mail de recuperação enviado"
- User informed to check email
- Email sent to provided address (check email or backend logs)

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-007 | | | |

---

### TC-AUTH-008: Staff Password Recovery - Invalid Email

**Objective**: Verify error handling for non-existent email

**Test Steps**:
1. Navigate to password reset page
2. Enter email: `nonexistent@test.com`
3. Click "Enviar" button
4. Observe response

**Expected Results**:
- Generic success message shown (security best practice)
- Or specific error: "E-mail não encontrado"
- No email sent
- User cannot determine if email exists in system

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-008 | | | |

---

### TC-AUTH-009: Staff Password Reset - Complete Flow

**Objective**: Verify complete password reset process

**Test Steps**:
1. Request password reset for admin@test.topsmile.com
2. Check email for reset link (or get from backend logs)
3. Click reset link
4. Verify reset form displays with token
5. Enter new password: `NewPassword123!`
6. Confirm password: `NewPassword123!`
7. Click "Redefinir Senha" button
8. Observe success message
9. Attempt login with new password

**Expected Results**:
- Reset link contains valid token
- Reset form loads correctly
- Password requirements shown
- Passwords must match
- Success message: "Senha redefinida com sucesso"
- Redirect to login page
- Can log in with new password
- Cannot log in with old password

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-009 | | | |

---

## Patient Authentication Tests

### TC-AUTH-101: Patient Login - Valid Credentials

**Objective**: Verify patient can log in to patient portal

**Test Steps**:
1. Navigate to http://localhost:3000/patient-portal or patient login page
2. Enter email: `patient1@test.topsmile.com`
3. Enter password: `Patient123!`
4. Click "Entrar" button
5. Observe redirect to patient portal

**Expected Results**:
- Patient login form displays
- Successful authentication
- Redirect to `/patient-portal` or patient dashboard
- Patient name displayed
- Patient-specific navigation visible
- No console errors

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-101 | | | |

---

### TC-AUTH-102: Patient Login - Invalid Credentials

**Objective**: Verify error handling for invalid patient credentials

**Test Steps**:
1. Navigate to patient login page
2. Enter email: `patient1@test.topsmile.com`
3. Enter password: `WrongPassword`
4. Click "Entrar" button
5. Observe error message

**Expected Results**:
- Error message in Portuguese
- User remains on login page
- No redirect occurs

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-102 | | | |

---

### TC-AUTH-103: Patient Session Duration

**Objective**: Verify patient session lasts 30 days

**Test Steps**:
1. Log in as patient1@test.topsmile.com
2. Check Application tab > Cookies
3. Verify refresh token expiration
4. Close browser
5. Reopen browser next day
6. Navigate to patient portal
7. Verify still logged in

**Expected Results**:
- Refresh token expires in 30 days
- Session persists across browser restarts
- Patient remains logged in within 30-day window

**Note**: Full 30-day test impractical; verify token expiration date in cookies.

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-103 | | | |

---

### TC-AUTH-104: Patient Logout

**Objective**: Verify patient can log out

**Test Steps**:
1. Log in as patient1@test.topsmile.com
2. Navigate to patient portal
3. Click logout button
4. Observe redirect

**Expected Results**:
- Logout button visible
- Redirect to patient login page
- Session cleared
- Cannot access patient portal after logout

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-104 | | | |

---

## Security Tests

### TC-AUTH-201: Rate Limiting - Login Attempts

**Objective**: Verify rate limiting prevents brute force attacks

**Test Steps**:
1. Navigate to staff login page
2. Attempt login with wrong password 5 times rapidly
3. Observe response on 6th attempt

**Expected Results**:
- After 5 failed attempts, rate limit triggered
- Error message: "Muitas tentativas. Tente novamente em 15 minutos."
- Login blocked for 15 minutes
- 429 status code in Network tab

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-201 | | | |

---

### TC-AUTH-202: CSRF Protection

**Objective**: Verify CSRF token validation

**Test Steps**:
1. Open DevTools > Network tab
2. Log in successfully
3. Inspect login request headers
4. Verify CSRF token present
5. Attempt to replay request without valid CSRF token

**Expected Results**:
- CSRF token included in requests
- Requests without valid token rejected
- 403 Forbidden response

**Note**: This test may require manual API testing with tools like Postman.

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-202 | | | |

---

### TC-AUTH-203: XSS Prevention

**Objective**: Verify input sanitization prevents XSS

**Test Steps**:
1. Navigate to login page
2. Enter email: `<script>alert('XSS')</script>@test.com`
3. Enter password: `Test123!`
4. Click "Entrar" button
5. Observe behavior

**Expected Results**:
- Script does not execute
- Input sanitized or rejected
- No alert popup
- Error message or validation failure

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-203 | | | |

---

### TC-AUTH-204: SQL Injection Prevention

**Objective**: Verify input sanitization prevents SQL injection

**Test Steps**:
1. Navigate to login page
2. Enter email: `admin@test.com' OR '1'='1`
3. Enter password: `anything`
4. Click "Entrar" button
5. Observe behavior

**Expected Results**:
- Login fails
- No unauthorized access
- Input sanitized
- Error message: "Credenciais inválidas"

| Test ID | Status | Actual Result | Notes |
|---------|--------|---------------|-------|
| TC-AUTH-204 | | | |

---

## Cross-Browser Tests

### TC-AUTH-301: Login in Different Browsers

**Objective**: Verify authentication works across browsers

**Test Steps**:
1. Test staff login in Brave
2. Test staff login in Chrome
3. Test staff login in Firefox
4. Test staff login in Safari (if on macOS)

**Expected Results**:
- Login works consistently across all browsers
- UI renders correctly
- No browser-specific errors

| Browser | Status | Notes |
|---------|--------|-------|
| Brave | | |
| Chrome | | |
| Firefox | | |
| Safari | | |

---

## Test Summary Template

| Category | Total Tests | Passed | Failed | Blocked | Pass Rate |
|----------|-------------|--------|--------|---------|-----------|
| Staff Login | 9 | | | | |
| Patient Login | 4 | | | | |
| Security | 4 | | | | |
| Cross-Browser | 1 | | | | |
| **TOTAL** | **18** | | | | |

## Common Issues and Solutions

### Issue: Login button not responding
- **Check**: Console for JavaScript errors
- **Check**: Network tab for failed API calls
- **Solution**: Verify backend is running

### Issue: Redirect loop after login
- **Check**: Token storage in cookies
- **Check**: Authentication middleware
- **Solution**: Clear cookies and retry

### Issue: Session expires immediately
- **Check**: JWT secret configuration
- **Check**: Redis connection
- **Solution**: Verify environment variables

## Next Steps

After completing authentication tests:
1. ✅ Document all results
2. 🐛 Report any failures as GitHub issues
3. 📋 Proceed to **Document 03 - Staff Dashboard Tests**

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Test Coverage**: Authentication & Security
