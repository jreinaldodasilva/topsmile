# TopSmile Authentication & Authorization Review

**Review Date:** January 2025  
**Focus Area:** Authentication Mechanisms, Authorization Patterns, Security Implementation

---

## 1. Authentication Architecture Overview

### 1.1 Dual Authentication Systems

TopSmile implements **two parallel authentication systems**:

```
┌─────────────────────────────────────────────────────────────┐
│                    Staff Authentication                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Endpoint: /api/auth/*                                │   │
│  │ Context: AuthContext.tsx                             │   │
│  │ Store: authStore.ts                                  │   │
│  │ Middleware: authenticate (auth.ts)                   │   │
│  │ Service: authService.ts                              │   │
│  │ Roles: super_admin, admin, manager, dentist, etc.   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   Patient Authentication                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Endpoint: /api/patient-auth/*                        │   │
│  │ Context: PatientAuthContext.tsx                      │   │
│  │ Middleware: patientAuthenticate (patientAuth.ts)     │   │
│  │ Service: patientAuthService.ts                       │   │
│  │ Role: patient                                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Authentication Mechanism: JWT with Refresh Tokens

#### Token Strategy
```typescript
// Access Token (Short-lived)
{
  userId: string;
  email: string;
  role: string;
  clinicId?: string;
  exp: 15 minutes;
  iss: 'topsmile-api';
  aud: 'topsmile-client';
}

// Refresh Token (Long-lived)
{
  token: string (random 48-byte hex);
  userId: string;
  expiresAt: Date (7 days);
  deviceInfo: { userAgent, ipAddress, deviceId };
  isRevoked: boolean;
}
```

#### Token Storage
- **Access Token:** HttpOnly cookie (`topsmile_access_token`)
- **Refresh Token:** HttpOnly cookie (`topsmile_refresh_token`)
- **Frontend:** No tokens stored in localStorage (✅ Security best practice)

---

## 2. Authentication Flow Analysis

### 2.1 Staff Login Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. POST /api/auth/login { email, password }
     ▼
┌─────────────────┐
│  Rate Limiter   │ ← 10 attempts per 15 min
└────┬────────────┘
     │ 2. Validate credentials
     ▼
┌─────────────────┐
│  AuthService    │
│  - Find user    │
│  - Check lock   │
│  - Compare pwd  │
└────┬────────────┘
     │ 3. Generate tokens
     ▼
┌─────────────────┐
│  JWT Service    │
│  - Access token │
│  - Refresh token│
└────┬────────────┘
     │ 4. Set HttpOnly cookies
     ▼
┌─────────────────┐
│   Response      │
│  { user, ... }  │
└─────────────────┘
```

#### ✅ Strengths
1. **Rate limiting** prevents brute force attacks
2. **Account locking** after failed attempts
3. **Password hashing** with bcrypt
4. **HttpOnly cookies** prevent XSS token theft
5. **Refresh token rotation** on each use

#### ❌ Weaknesses
1. **No MFA enforcement** - MFA fields exist but not enforced
2. **No device fingerprinting** - Limited device tracking
3. **No suspicious login detection** - No geolocation or unusual activity checks
4. **Password reset tokens** stored in database (should be hashed)

### 2.2 Patient Login Flow

```
┌─────────┐
│ Patient │
└────┬────┘
     │ 1. POST /api/patient-auth/login { email, password }
     ▼
┌─────────────────┐
│  Rate Limiter   │
└────┬────────────┘
     │ 2. Validate credentials
     ▼
┌──────────────────┐
│ PatientAuthSvc   │
│  - Find patient  │
│  - Compare pwd   │
└────┬─────────────┘
     │ 3. Generate tokens (PATIENT_JWT_SECRET)
     ▼
┌─────────────────┐
│   Response      │
│  { patient }    │
└─────────────────┘
```

#### ✅ Strengths
1. **Separate JWT secret** for patient tokens
2. **Longer token expiry** (24h vs 15m for staff)
3. **Separate cookie names** prevent conflicts

#### ❌ Weaknesses
1. **Code duplication** - 80% similar to staff auth
2. **Inconsistent features** - No account locking for patients
3. **Different middleware** - Harder to maintain
4. **No unified session management**

---

## 3. Authorization Implementation

### 3.1 Role-Based Access Control (RBAC)

#### Defined Roles
```typescript
// Staff Roles
'super_admin'    // Full system access
'admin'          // Clinic-wide management
'manager'        // Operational management
'dentist'        // Clinical + patient access
'hygienist'      // Limited clinical access
'receptionist'   // Scheduling + billing
'lab_technician' // Lab work only
'assistant'      // Support role

// Patient Role
'patient'        // Self-service portal
```

#### Permission Matrix
```typescript
// backend/src/config/security/permissions.ts
export const rolePermissions: Record<string, Permission[]> = {
  super_admin: [
    'patients:read', 'patients:write', 'patients:delete',
    'appointments:read', 'appointments:write', 'appointments:delete',
    'clinical:read', 'clinical:write', 'clinical:delete',
    'billing:read', 'billing:write',
    'users:read', 'users:write', 'users:delete',
    'settings:read', 'settings:write',
    'audit:read'
  ],
  admin: [
    'patients:read', 'patients:write', 'patients:delete',
    'appointments:read', 'appointments:write', 'appointments:delete',
    'clinical:read', 'clinical:write',
    'billing:read', 'billing:write',
    'users:read', 'users:write',
    'settings:read', 'settings:write'
  ],
  // ... other roles
};
```

### 3.2 Authorization Middleware

#### Backend Authorization
```typescript
// Middleware chain
router.post('/',
  authenticate,                          // Verify JWT
  authorize('super_admin', 'admin'),     // Check role
  ensureClinicAccess('body', 'clinicId'), // Verify clinic
  validationRules,                       // Validate input
  async (req, res) => { ... }
);
```

#### ✅ Strengths
1. **Composable middleware** - Easy to combine checks
2. **Clinic-level isolation** - Multi-tenant support
3. **Explicit role checks** - Clear authorization requirements
4. **Super admin bypass** - Flexible for system operations

#### ❌ Weaknesses
1. **No permission-based checks** - Only role-based
2. **Hardcoded role strings** - No type safety
3. **No resource-level permissions** - Can't restrict specific records
4. **No audit trail** - Authorization failures not logged

### 3.3 Frontend Authorization

#### Route Protection
```typescript
// Protected routes
<Route path="/admin" element={
  <ProtectedRoute roles={['super_admin', 'admin', 'manager']}>
    <AdminPage />
  </ProtectedRoute>
} />

<Route path="/patient/dashboard" element={
  <PatientProtectedRoute>
    <PatientDashboard />
  </PatientProtectedRoute>
} />
```

#### ✅ Strengths
1. **Route-level protection** - Prevents unauthorized navigation
2. **Role-based rendering** - Conditional UI elements
3. **Redirect to login** - Clear user flow

#### ❌ Weaknesses
1. **Client-side only** - Not a security boundary (backend must enforce)
2. **No permission checks** - Only role checks
3. **Duplicate logic** - Role checks repeated in components
4. **No loading states** - Flash of unauthorized content possible

---

## 4. Session Management

### 4.1 Token Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                     Token Lifecycle                          │
│                                                              │
│  Login                                                       │
│    ↓                                                         │
│  Generate Access Token (15m) + Refresh Token (7d)           │
│    ↓                                                         │
│  Store in HttpOnly Cookies                                  │
│    ↓                                                         │
│  [User Activity]                                            │
│    ↓                                                         │
│  Access Token Expires (15m)                                 │
│    ↓                                                         │
│  Frontend detects 401                                       │
│    ↓                                                         │
│  POST /api/auth/refresh (with refresh token cookie)         │
│    ↓                                                         │
│  Revoke old refresh token                                   │
│    ↓                                                         │
│  Generate new tokens                                        │
│    ↓                                                         │
│  Continue activity                                          │
│    ↓                                                         │
│  Logout or Refresh Token Expires (7d)                       │
│    ↓                                                         │
│  Revoke all tokens                                          │
│    ↓                                                         │
│  Clear cookies                                              │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Token Refresh Strategy

#### Proactive Refresh
```typescript
// Frontend: src/services/http.ts
export function startTokenRefresh(): void {
  const refreshInterval = 13 * 60 * 1000; // 13 minutes
  
  tokenRefreshTimer = setInterval(async () => {
    await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    });
  }, refreshInterval);
}
```

#### ✅ Strengths
1. **Proactive refresh** - Prevents token expiry during activity
2. **Automatic retry** - Handles 401 responses
3. **Token rotation** - Old refresh tokens revoked

#### ❌ Weaknesses
1. **No exponential backoff** - Could hammer server on failures
2. **No refresh token limit** - User could have unlimited tokens
3. **No concurrent request handling** - Multiple 401s trigger multiple refreshes

### 4.3 Token Blacklisting

```typescript
// backend/src/services/auth/tokenBlacklistService.ts
class TokenBlacklistService {
  async addToBlacklist(token: string, expiresAt: Date): Promise<void> {
    // Store revoked tokens
  }
  
  async isBlacklisted(token: string): Promise<boolean> {
    // Check if token is revoked
  }
}
```

#### ✅ Strengths
1. **Immediate revocation** - Logout takes effect instantly
2. **Expiry-based cleanup** - Old tokens automatically removed

#### ❌ Weaknesses
1. **No distributed cache** - Won't work across multiple servers
2. **Performance impact** - Every request checks blacklist
3. **No Redis implementation visible** - Likely in-memory only

---

## 5. Security Features Assessment

### 5.1 Implemented Security Measures

#### ✅ Strong Security Features

| Feature | Implementation | Rating |
|---------|----------------|--------|
| **Password Hashing** | bcrypt with salt | ⭐⭐⭐⭐⭐ |
| **JWT Signing** | HS256 with 64+ char secret | ⭐⭐⭐⭐ |
| **HttpOnly Cookies** | Prevents XSS token theft | ⭐⭐⭐⭐⭐ |
| **CSRF Protection** | csurf middleware | ⭐⭐⭐⭐ |
| **Rate Limiting** | express-rate-limit | ⭐⭐⭐⭐ |
| **Input Sanitization** | express-mongo-sanitize | ⭐⭐⭐⭐ |
| **Token Rotation** | Refresh tokens rotated | ⭐⭐⭐⭐⭐ |
| **Account Locking** | After failed attempts | ⭐⭐⭐⭐ |

### 5.2 Missing Security Features

#### ❌ Critical Gaps

1. **No Multi-Factor Authentication (MFA)**
   - Fields exist in User model but not enforced
   - No TOTP implementation visible
   - No backup codes generation

2. **No Session Timeout Warning**
   - Users not warned before session expires
   - No "extend session" option

3. **No Device Management**
   - Users can't view active sessions
   - No "logout all devices" in UI
   - Limited device fingerprinting

4. **No Suspicious Activity Detection**
   - No geolocation checks
   - No unusual login time detection
   - No concurrent session limits

5. **No Password Policy Enforcement**
   - Password complexity defined but not enforced in UI
   - No password expiry
   - No password history check

### 5.3 Security Vulnerabilities

#### 🔴 High Risk

**1. Password Reset Token Not Hashed**
```typescript
// backend/src/services/auth/authService.ts
user.passwordResetToken = crypto.createHash('sha256')
  .update(resetToken)
  .digest('hex'); // ✅ Actually hashed - Good!
```
**Status:** ✅ Actually implemented correctly

**2. No Rate Limiting on Token Refresh**
```typescript
// No rate limiter on /api/auth/refresh
app.use('/api/auth', authLimiter);
// But refresh endpoint not specifically limited
```
**Risk:** Attacker could abuse refresh endpoint
**Recommendation:** Add specific rate limit for refresh

#### 🟡 Medium Risk

**3. Token Blacklist Not Distributed**
**Risk:** Won't work in multi-server deployment
**Recommendation:** Use Redis for distributed blacklist

**4. No CORS Whitelist Validation**
```typescript
// Regex patterns allow any subdomain
/\.vercel\.app$/
/\.netlify\.app$/
```
**Risk:** Subdomain takeover could bypass CORS
**Recommendation:** Explicit whitelist of allowed origins

---

## 6. User Navigation and Access Control

### 6.1 Role-Based Navigation

```typescript
// src/contexts/AuthContext.tsx
function getRedirectPath(role?: string): string {
  switch (role) {
    case 'super_admin':
    case 'admin':
    case 'manager':
      return '/admin';
    case 'dentist':
    case 'assistant':
      return '/admin/appointments';
    case 'patient':
      return '/patient/dashboard';
    default:
      return '/login';
  }
}
```

#### ✅ Strengths
1. **Automatic redirect** after login
2. **Role-appropriate landing pages**
3. **Clear separation** between staff and patient portals

#### ❌ Weaknesses
1. **Hardcoded paths** - Difficult to customize per clinic
2. **No "remember last page"** - Always redirects to default
3. **No onboarding flow** - New users go straight to dashboard

### 6.2 Conditional Rendering

```typescript
// Example: Show admin menu only for admins
{user?.role === 'admin' && (
  <AdminMenu />
)}
```

#### ❌ Issues
1. **Scattered role checks** - Repeated throughout components
2. **No centralized permission helper**
3. **Inconsistent patterns** - Some use role, some use permissions

**Recommendation:** Create permission hooks
```typescript
// usePermissions.ts
export function usePermissions() {
  const { user } = useAuthState();
  
  return {
    canRead: (resource: string) => hasPermission(user.role, `${resource}:read`),
    canWrite: (resource: string) => hasPermission(user.role, `${resource}:write`),
    canDelete: (resource: string) => hasPermission(user.role, `${resource}:delete`),
  };
}

// Usage
const { canWrite } = usePermissions();
{canWrite('patients') && <CreatePatientButton />}
```

---

## 7. Logout Behavior

### 7.1 Staff Logout

```typescript
// Frontend: AuthContext.tsx
const logout = async (reason?: string) => {
  stopTokenRefresh();
  setUser(null);
  await httpLogout(); // Calls /api/auth/logout
  navigate('/login');
};

// Backend: authService.ts
async logout(refreshTokenString: string): Promise<void> {
  await RefreshToken.findOneAndUpdate(
    { token: refreshTokenString },
    { isRevoked: true }
  );
}
```

#### ✅ Strengths
1. **Graceful logout** - Doesn't throw on failure
2. **Token revocation** - Refresh token marked as revoked
3. **Cross-tab sync** - Custom event notifies other tabs

#### ❌ Weaknesses
1. **Access token not blacklisted** - Still valid until expiry (15m)
2. **No "logout all devices"** - Only current session
3. **No logout confirmation** - Accidental clicks log out immediately

### 7.2 Session Timeout

```typescript
// src/hooks/useSessionTimeout.ts
export const useSessionTimeout = ({
  enabled,
  onWarning,
  onTimeout
}: SessionTimeoutOptions) => {
  const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minutes
  const WARNING_DURATION = 5 * 60 * 1000;  // 5 minutes before
  
  // Reset timer on user activity
  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });
  }, []);
};
```

#### ✅ Strengths
1. **Activity tracking** - Resets on user interaction
2. **Warning modal** - Gives user chance to extend session
3. **Configurable timeouts** - Can adjust per role

#### ❌ Weaknesses
1. **Frontend only** - Backend doesn't enforce timeout
2. **No server-side session tracking** - Can't force logout
3. **Timer not synced** - Multiple tabs have separate timers

---

## 8. Recommendations

### Critical (Immediate - 1 Week)

1. **Unify Authentication Architecture**
   ```typescript
   // Create base auth service
   abstract class BaseAuthService {
     abstract login(credentials: any): Promise<AuthResponse>;
     abstract logout(token: string): Promise<void>;
     protected generateTokens(user: any): TokenPair { ... }
   }
   
   class StaffAuthService extends BaseAuthService { ... }
   class PatientAuthService extends BaseAuthService { ... }
   ```

2. **Add Rate Limiting to Token Refresh**
   ```typescript
   const refreshLimiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 20, // 20 refreshes per 15 minutes
   });
   app.use('/api/auth/refresh', refreshLimiter);
   ```

3. **Implement Distributed Token Blacklist**
   ```typescript
   // Use Redis for blacklist
   class RedisTokenBlacklist {
     async addToBlacklist(token: string, ttl: number) {
       await redis.setex(`blacklist:${token}`, ttl, '1');
     }
   }
   ```

### High Priority (2-4 Weeks)

4. **Implement MFA**
   - TOTP with QR code generation
   - Backup codes
   - Remember device option

5. **Add Device Management UI**
   - List active sessions
   - Logout specific devices
   - Logout all devices

6. **Create Permission Hooks**
   - Centralize permission checks
   - Type-safe permission strings
   - Consistent UI patterns

7. **Add Audit Logging**
   - Log all authentication events
   - Track authorization failures
   - Monitor suspicious activity

### Medium Priority (1-2 Months)

8. **Implement Password Policy UI**
   - Real-time password strength indicator
   - Enforce complexity requirements
   - Password expiry notifications

9. **Add Session Management**
   - Server-side session tracking
   - Force logout capability
   - Concurrent session limits

10. **Enhance Security Monitoring**
    - Geolocation checks
    - Unusual activity detection
    - Automated account locking

---

## 9. Security Checklist

### Authentication
- [x] Passwords hashed with bcrypt
- [x] JWT tokens signed with strong secret
- [x] Tokens stored in HttpOnly cookies
- [x] Refresh token rotation
- [x] Account locking after failed attempts
- [ ] Multi-factor authentication
- [ ] Device fingerprinting
- [ ] Suspicious login detection

### Authorization
- [x] Role-based access control
- [x] Clinic-level isolation
- [x] Route protection (frontend)
- [x] Middleware authorization (backend)
- [ ] Permission-based checks
- [ ] Resource-level permissions
- [ ] Authorization audit logging

### Session Management
- [x] Token expiry
- [x] Proactive token refresh
- [x] Token blacklisting
- [x] Session timeout (frontend)
- [ ] Distributed token blacklist
- [ ] Server-side session tracking
- [ ] Concurrent session limits

### Security Features
- [x] CSRF protection
- [x] Rate limiting
- [x] Input sanitization
- [x] SQL injection prevention (via Mongoose)
- [ ] XSS prevention (needs CSP review)
- [ ] Security headers (Helmet configured)
- [ ] CORS whitelist validation

---

## 10. Conclusion

**Authentication & Authorization Rating: 7/10**

TopSmile implements solid authentication and authorization foundations with JWT, refresh tokens, RBAC, and comprehensive security middleware. The main areas for improvement are:

1. **Unify dual authentication systems** - Reduce code duplication
2. **Implement MFA** - Add second factor authentication
3. **Enhance session management** - Server-side tracking and distributed state
4. **Add audit logging** - Track all security events
5. **Improve authorization granularity** - Permission-based checks

The system is secure for production use but would benefit significantly from the recommended enhancements, particularly MFA and unified authentication architecture.
