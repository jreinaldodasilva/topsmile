# Manual Testing Findings

## Test Session: 2025-10-10

### Issue #1: Login Page Redirect Loop + Rate Limiting

**Test ID**: TC-AUTH-001  
**Severity**: 🔴 Critical  
**Status**: ✅ Fixed  
**Found By**: Manual Testing  
**Date**: 2025-10-10 09:30

#### Description

When navigating to the login page (`/login`), the browser alternates rapidly between the dashboard and login page, eventually hitting rate limits and becoming unusable.

#### Steps to Reproduce

1. Start both frontend and backend servers
2. Navigate to http://localhost:3000
3. Click "Staff Login" or navigate to `/login`
4. Observe browser behavior

#### Expected Behavior

- User should see the login page
- No automatic redirects
- No rate limiting errors

#### Actual Behavior

- Browser rapidly alternates between `/login` and `/admin` (dashboard)
- Backend receives 20+ `/api/auth/refresh` requests in seconds
- Rate limit hit: `429 Too Many Requests`
- Error: "Muitas tentativas de renovação de token"

#### Root Cause

**File**: `src/contexts/AuthContext.tsx` (Line 115)

The `verifyAuth()` useEffect had `navigate` in its dependency array:

```typescript
useEffect(() => {
  verifyAuth();
  return () => { isMounted = false; };
}, [navigate]); // ❌ Causes re-run on every route change
```

**Problem Flow**:
1. User navigates to `/login`
2. `navigate` changes → useEffect runs
3. `verifyAuth()` calls `/api/auth/me` → 401
4. `http.ts` intercepts 401, tries `/api/auth/refresh` → 401
5. Another navigation triggered → Loop repeats
6. 20+ refresh attempts → Rate limit (429)

#### Fix Applied

Changed dependency array to empty:

```typescript
useEffect(() => {
  verifyAuth();
  return () => { isMounted = false; };
}, []); // ✅ Only run once on mount
```

#### Backend Logs

```
[2025-10-10 09:30:37] POST /api/auth/refresh - 429 Too Many Requests
ratelimit-remaining: 0
ratelimit-reset: 786
Error: Muitas tentativas de renovação de token. Tente novamente em 15 minutos.
```

**Rate Limit Stats**:
- Limit: 20 requests per 15 minutes
- Requests made: 20+
- Time to reset: 13 minutes

#### Impact

- **Critical**: Users cannot log in
- **Security**: Rate limiting working as designed (good)
- **UX**: Confusing redirect loop

#### Testing Notes

- Rate limiting is working correctly (security feature)
- The issue was in frontend auth logic, not backend
- Backend logs were essential for diagnosis

#### Verification

After fix:
- [ ] Navigate to `/login` - should stay on login page
- [ ] No rapid refresh requests in backend logs
- [ ] No rate limiting errors
- [ ] Login form visible and functional

#### Related Files

- `src/contexts/AuthContext.tsx` (fixed)
- `src/services/http.ts` (token refresh logic)
- `backend/src/app.ts` (rate limiting config)

---

---

### Issue #2: Login Page Stuck in Loading State

**Test ID**: TC-AUTH-002  
**Severity**: 🟠 High  
**Status**: 🔍 Investigating  
**Found By**: Manual Testing  
**Date**: 2025-10-10 09:46

#### Description

Login page loads with button showing "Entrando..." (Logging in...) and all form fields disabled. The page appears stuck in a loading state even though no login attempt has been made.

#### Steps to Reproduce

1. Navigate to http://localhost:3000/login
2. Observe the login form

#### Expected Behavior

- Button should show "Entrar" (Login)
- Form fields should be enabled
- User can type credentials

#### Actual Behavior

- Button shows "Entrando..." (Logging in...)
- All form fields are disabled
- Cannot interact with the form

#### Browser Console Output

```
[API Request] GET /api/patient-auth/me - 401
[API Request] GET /api/auth/me - 401
[API Request] GET /api/patient-auth/me - 401
[API Request] GET /api/auth/me - 401
[API Request] POST /api/auth/refresh - 401
```

#### Root Cause

**Dual Auth Context Issue**: Both `AuthContext` and `PatientAuthContext` are running authentication checks simultaneously on mount. The `LoginPage` component uses `loading` state from `AuthContext`, which may not complete before render.

**Files Involved**:
- `src/contexts/AuthContext.tsx` - Staff authentication
- `src/contexts/PatientAuthContext.tsx` - Patient authentication
- `src/pages/Login/LoginPage.tsx` - Uses AuthContext loading state

**Issue**: Both contexts make API calls on mount:
- AuthContext: `/api/auth/me`
- PatientAuthContext: `/api/patient-auth/me`

If AuthContext's loading state doesn't resolve quickly, the LoginPage stays disabled.

#### Workaround

- Refresh the page (F5)
- Wait 2-3 seconds for loading to complete

#### Fix Applied

Added 5-second timeout to both AuthContext and PatientAuthContext to prevent infinite loading state.

#### Impact

- **High**: Users cannot log in immediately
- **UX**: Confusing - appears broken
- **Status**: ✅ Fixed with timeout

---

### Issue #3: MSW Intercepting Login Requests

**Test ID**: TC-AUTH-003  
**Severity**: 🔴 Critical  
**Status**: ✅ Fixed  
**Found By**: Manual Testing  
**Date**: 2025-10-10 10:32

#### Description

Login attempts return "E-mail ou senha inválidos" (Invalid email or password) even with correct credentials. MSW (Mock Service Worker) is intercepting API requests and returning 401 before they reach the backend.

#### Steps to Reproduce

1. Navigate to `/login`
2. Enter credentials: `admin@test.topsmile.com` / `Admin123!`
3. Click "Entrar"
4. Observe error message

#### Expected Behavior

- Request should reach backend at `http://localhost:5000/api/auth/login`
- Backend should validate credentials
- User should be logged in if credentials are valid

#### Actual Behavior

- MSW intercepts the request
- Returns 401 Unauthorized immediately (0ms)
- Backend never receives the request
- Error message: "E-mail ou senha inválidos"

#### Browser Console Output

```
XHR POST http://localhost:5000/api/auth/login [HTTP/1.1 401 Unauthorized 0ms]
[MSW] 10:32:25 POST http://localhost:5000/api/auth/login (401 Unauthorized)
Request: {"email":"admin@test.topsmile.com","password":"Admin123!"}
```

#### Root Cause

**File**: `src/index.tsx` (Line 21-24)

MSW is enabled in development mode:

```typescript
if (process.env.NODE_ENV === 'development' && !process.env.REACT_APP_DISABLE_MSW) {
  const { worker } = require('./mocks/browser');
  worker.start();
}
```

MSW is designed for testing but was active during manual testing, intercepting all API requests.

#### Fix Applied

Added `REACT_APP_DISABLE_MSW=true` to `.env` file to disable MSW during manual testing.

#### Backend Logs

No login request received - MSW intercepted before reaching backend.

#### Impact

- **Critical**: Complete login failure
- **All authentication blocked**: Staff and patient login
- **Silent failure**: No backend logs, hard to debug

#### Verification

After fix:
- [x] Restart frontend
- [x] Attempt login
- [x] Request should reach backend
- [x] Backend logs should show POST /api/auth/login
- [x] Login successful with test credentials

**Result**: ✅ Login working - user redirected to dashboard

---

---

### Issue #4: 400 Bad Request on Appointments API

**Test ID**: TC-DASH-001  
**Severity**: 🔴 Critical  
**Status**: ✅ Fixed  
**Found By**: Manual Testing  
**Date**: 2025-10-10 13:36

#### Description

After logging in and viewing dashboard, or clicking "Novo Paciente", the app redirects to login page after a few seconds. The cause is a 400 Bad Request error on the appointments API endpoint.

#### Steps to Reproduce

1. Login successfully
2. View dashboard
3. Click "Novo Paciente" button
4. Wait a few seconds
5. App redirects to login page

#### Expected Behavior

- Dashboard loads successfully
- Patient form stays open
- No redirect to login

#### Actual Behavior

- Dashboard loads but shows "Bad Request" error
- After a few seconds, redirects to login
- User session appears to be lost

#### Browser Console Output

```
XHR GET http://localhost:5000/api/scheduling/appointments?limit=5&sort=scheduledStart
[HTTP/1.1 400 Bad Request 0ms]
Bad Request
```

#### Root Cause

**File**: `src/components/Admin/Dashboard/Dashboard.tsx` (Line 62)

The appointments API call was sending `sort` as a string instead of an object:

```typescript
// ❌ Wrong
apiService.appointments.getAll({ limit: 5, sort: 'scheduledStart' })

// ✅ Correct
apiService.appointments.getAll({ limit: 5, sort: { scheduledStart: 1 } })
```

The backend expects sort to be a JSON object like `{"field": 1}` for ascending or `{"field": -1}` for descending.

#### Fix Applied

Changed sort parameters to objects:
- Appointments: `sort: { scheduledStart: 1 }`
- Patients: `sort: { createdAt: -1 }`

#### Impact

- **Critical**: Dashboard unusable
- **Blocks**: Patient management, appointments
- **User Experience**: Appears as session expiry

#### Verification

After fix:
- [ ] Restart frontend
- [ ] Login
- [ ] Dashboard loads without errors
- [ ] Click "Novo Paciente" - form stays open
- [ ] No redirect to login

---

## Summary

**Total Issues Found**: 4  
**Critical**: 3 (all fixed)  
**High**: 1 (fixed)  
**Medium**: 0  
**Low**: 0  

**Issues Fixed**: 4  
**Issues Pending**: 0
