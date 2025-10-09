# Authentication Architecture

## Overview

TopSmile implements **dual authentication systems** with JWT-based tokens stored in HttpOnly cookies.

## Authentication Systems

### 1. Staff Authentication
- **Endpoint:** `/api/auth/*`
- **Context:** `AuthContext.tsx`
- **Service:** `authService.ts`
- **Roles:** super_admin, admin, manager, dentist, hygienist, receptionist, assistant
- **Token Lifetime:** Access 15min, Refresh 7 days

### 2. Patient Authentication
- **Endpoint:** `/api/patient-auth/*`
- **Context:** `PatientAuthContext.tsx`
- **Service:** `patientAuthService.ts`
- **Role:** patient
- **Token Lifetime:** Access 24h, Refresh 7 days

## Token Strategy

### Access Token (JWT)
```json
{
  "userId": "string",
  "email": "string",
  "role": "string",
  "clinicId": "string",
  "exp": "timestamp",
  "iss": "topsmile-api",
  "aud": "topsmile-client"
}
```

### Refresh Token
```json
{
  "token": "48-byte-hex-string",
  "userId": "string",
  "expiresAt": "Date",
  "deviceInfo": {
    "userAgent": "string",
    "ipAddress": "string"
  },
  "isRevoked": "boolean"
}
```

## Token Storage

- **Access Token:** HttpOnly cookie `topsmile_access_token`
- **Refresh Token:** HttpOnly cookie `topsmile_refresh_token`
- **Frontend:** No tokens in localStorage (XSS protection)

## Security Features

### Implemented
- ✅ Password hashing (bcrypt)
- ✅ JWT signing (HS256, 64+ char secret)
- ✅ HttpOnly cookies (XSS prevention)
- ✅ CSRF protection (csurf middleware)
- ✅ Rate limiting (10 attempts/15min for auth)
- ✅ Token rotation (refresh tokens rotated on use)
- ✅ Token blacklisting (immediate revocation)
- ✅ Account locking (after failed attempts)

### Missing
- ❌ Multi-factor authentication (MFA)
- ❌ Device management UI
- ❌ Suspicious activity detection
- ❌ Password expiry policy

## Token Lifecycle

```
Login → Generate Tokens → Store in Cookies
  ↓
User Activity (Token valid)
  ↓
Token Expires (15min/24h)
  ↓
Auto Refresh (13min proactive)
  ↓
Revoke Old Refresh Token
  ↓
Generate New Tokens
  ↓
Continue Activity
  ↓
Logout/Expire → Revoke & Blacklist
```

## Middleware Chain

```
Request
  → Rate Limiter
  → CSRF Protection
  → authenticate (verify JWT)
  → authorize (check role)
  → validation
  → business logic
  → response
```

## Session Management

- **Timeout:** 30 minutes inactivity (frontend)
- **Warning:** 5 minutes before timeout
- **Refresh:** Proactive every 13 minutes
- **Max Tokens:** 5 refresh tokens per user
- **Cleanup:** Old tokens auto-revoked

## Best Practices

1. **Always verify tokens on backend** - Frontend checks are UX only
2. **Use HttpOnly cookies** - Never store tokens in localStorage
3. **Implement CSRF protection** - Required for cookie-based auth
4. **Rotate refresh tokens** - Detect token reuse attacks
5. **Blacklist on logout** - Immediate token revocation
6. **Rate limit auth endpoints** - Prevent brute force
7. **Hash password reset tokens** - Store hashed in database

---

**Version:** 1.0  
**Date:** January 2025
