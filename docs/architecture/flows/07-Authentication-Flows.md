# TopSmile Authentication Flows

**Document Version:** 1.0.0  
**Last Updated:** 2024-01-15  
**Status:** ✅ Complete

---

## Table of Contents

1. [Overview](#overview)
2. [Dual Authentication Architecture](#dual-authentication-architecture)
3. [Staff Authentication Flow](#staff-authentication-flow)
4. [Patient Authentication Flow](#patient-authentication-flow)
5. [Token Management](#token-management)
6. [Session Management](#session-management)
7. [Security Mechanisms](#security-mechanisms)
8. [Improvement Recommendations](#improvement-recommendations)

---

## Overview

TopSmile implements a dual authentication system with separate flows for staff users and patients. Both systems use JWT tokens with HttpOnly cookies, refresh token rotation, and Redis-based token blacklisting.

**Key Features:**
- Dual authentication systems (staff and patient)
- JWT with HttpOnly cookies
- Refresh token rotation
- Token blacklisting via Redis
- Role-based access control (RBAC)
- Rate limiting on authentication endpoints

---

## Dual Authentication Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Layer                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │  Staff Auth System   │      │  Patient Auth System │    │
│  ├──────────────────────┤      ├──────────────────────┤    │
│  │ • JWT Secret 1       │      │ • JWT Secret 2       │    │
│  │ • 15min access       │      │ • 30min access       │    │
│  │ • 7 day refresh      │      │ • 30 day refresh     │    │
│  │ • Role-based access  │      │ • Patient-only access│    │
│  └──────────────────────┘      └──────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Why Dual Authentication?

1. **Security Isolation**: Separate secrets prevent cross-contamination
2. **Different Token Lifetimes**: Staff needs shorter sessions, patients need convenience
3. **Role Separation**: Clear distinction between staff and patient capabilities
4. **Audit Trail**: Separate authentication logs for compliance

---

## Staff Authentication Flow

### Login Flow

```
┌─────────┐                                                    ┌─────────┐
│ Browser │                                                    │ Backend │
└────┬────┘                                                    └────┬────┘
     │                                                              │
     │ 1. POST /api/auth/login                                     │
     │    { email, password }                                      │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │                                    2. Validate credentials  │
     │                                       (bcrypt compare)       │
     │                                                              │
     │                                    3. Check rate limit      │
     │                                       (5 attempts/15min)    │
     │                                                              │
     │                                    4. Generate tokens       │
     │                                       - Access (15min)      │
     │                                       - Refresh (7 days)    │
     │                                                              │
     │                                    5. Store refresh token   │
     │                                       in database           │
     │                                                              │
     │                                    6. Set HttpOnly cookies  │
     │                                                              │
     │ 7. Response with user data                                  │
     │    { success, user, tokens }                                │
     │<────────────────────────────────────────────────────────────┤
     │                                                              │
     │ 8. Store user in context/store                              │
     │                                                              │
```

### Implementation

**Backend (authService.ts):**
```typescript
async login(email: string, password: string, deviceInfo: DeviceInfo) {
  // 1. Find user
  const user = await User.findOne({ email, isActive: true });
  if (!user) {
    throw new AppError('Credenciais inválidas', 'INVALID_CREDENTIALS', 401);
  }

  // 2. Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new AppError('Credenciais inválidas', 'INVALID_CREDENTIALS', 401);
  }

  // 3. Generate tokens
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role, clinicId: user.clinicId },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  // 4. Store refresh token
  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    deviceInfo
  });

  // 5. Return tokens and user data
  return {
    success: true,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      clinicId: user.clinicId
    },
    accessToken,
    refreshToken
  };
}
```

**Frontend (AuthContext.tsx):**
```typescript
const login = async (email: string, password: string) => {
  try {
    const response = await apiService.post('/auth/login', { email, password });
    
    if (response.success) {
      setUser(response.user);
      // Tokens are in HttpOnly cookies, no need to store
      navigate('/admin');
    }
  } catch (error) {
    setError('Login falhou. Verifique suas credenciais.');
  }
};
```

---

## Patient Authentication Flow

### Registration Flow

```
┌─────────┐                                                    ┌─────────┐
│ Browser │                                                    │ Backend │
└────┬────┘                                                    └────┬────┘
     │                                                              │
     │ 1. POST /api/patient-auth/register                          │
     │    { email, password, name, phone }                         │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │                                    2. Validate input         │
     │                                       (express-validator)    │
     │                                                              │
     │                                    3. Check existing user    │
     │                                                              │
     │                                    4. Hash password          │
     │                                       (bcrypt, 10 rounds)    │
     │                                                              │
     │                                    5. Create patient record  │
     │                                                              │
     │                                    6. Generate tokens        │
     │                                       - Access (30min)       │
     │                                       - Refresh (30 days)    │
     │                                                              │
     │                                    7. Send welcome email     │
     │                                                              │
     │ 8. Response with patient data                               │
     │    { success, patient, tokens }                             │
     │<────────────────────────────────────────────────────────────┤
     │                                                              │
```

### Login Flow

```
┌─────────┐                                                    ┌─────────┐
│ Browser │                                                    │ Backend │
└────┬────┘                                                    └────┬────┘
     │                                                              │
     │ 1. POST /api/patient-auth/login                             │
     │    { email, password }                                      │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │                                    2. Find patient           │
     │                                                              │
     │                                    3. Verify password        │
     │                                                              │
     │                                    4. Generate tokens        │
     │                                       - Access (30min)       │
     │                                       - Refresh (30 days)    │
     │                                                              │
     │                                    5. Store refresh token    │
     │                                                              │
     │                                    6. Set HttpOnly cookies   │
     │                                                              │
     │ 7. Response with patient data                               │
     │<────────────────────────────────────────────────────────────┤
     │                                                              │
```

---

## Token Management

### Token Structure

**Staff Access Token:**
```json
{
  "id": "user_id",
  "email": "staff@clinic.com",
  "role": "admin",
  "clinicId": "clinic_id",
  "iat": 1234567890,
  "exp": 1234568790
}
```

**Patient Access Token:**
```json
{
  "id": "patient_id",
  "email": "patient@email.com",
  "role": "patient",
  "clinicId": "clinic_id",
  "iat": 1234567890,
  "exp": 1234569690
}
```

### Token Refresh Flow

```
┌─────────┐                                                    ┌─────────┐
│ Browser │                                                    │ Backend │
└────┬────┘                                                    └────┬────┘
     │                                                              │
     │ 1. API call with expired access token                       │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │ 2. 401 Unauthorized                                          │
     │<────────────────────────────────────────────────────────────┤
     │                                                              │
     │ 3. POST /api/auth/refresh                                   │
     │    (refresh token in cookie)                                │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
     │                                    4. Verify refresh token   │
     │                                                              │
     │                                    5. Check blacklist        │
     │                                       (Redis)                │
     │                                                              │
     │                                    6. Generate new tokens    │
     │                                                              │
     │                                    7. Rotate refresh token   │
     │                                       (invalidate old)       │
     │                                                              │
     │ 8. New tokens                                               │
     │<────────────────────────────────────────────────────────────┤
     │                                                              │
     │ 9. Retry original request                                   │
     ├────────────────────────────────────────────────────────────>│
     │                                                              │
```

### Token Rotation Implementation

```typescript
async refreshToken(oldRefreshToken: string) {
  // 1. Verify token
  const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET!);

  // 2. Check if blacklisted
  const isBlacklisted = await redisClient.get(`blacklist:${oldRefreshToken}`);
  if (isBlacklisted) {
    throw new AppError('Token inválido', 'INVALID_TOKEN', 401);
  }

  // 3. Find token in database
  const tokenDoc = await RefreshToken.findOne({ 
    token: oldRefreshToken,
    user: decoded.id,
    expiresAt: { $gt: new Date() }
  });

  if (!tokenDoc) {
    throw new AppError('Token não encontrado', 'TOKEN_NOT_FOUND', 401);
  }

  // 4. Generate new tokens
  const newAccessToken = jwt.sign(
    { id: decoded.id, email: decoded.email, role: decoded.role },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const newRefreshToken = jwt.sign(
    { id: decoded.id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  // 5. Blacklist old refresh token
  await redisClient.setex(
    `blacklist:${oldRefreshToken}`,
    7 * 24 * 60 * 60, // 7 days
    'true'
  );

  // 6. Store new refresh token
  await RefreshToken.create({
    token: newRefreshToken,
    user: decoded.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  // 7. Delete old token
  await RefreshToken.deleteOne({ _id: tokenDoc._id });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}
```

---

## Session Management

### Session Storage

**Redis Structure:**
```
session:{userId}:{sessionId} = {
  userId: string,
  deviceInfo: {
    userAgent: string,
    ip: string,
    device: string
  },
  createdAt: timestamp,
  lastActivity: timestamp,
  expiresAt: timestamp
}
```

### Session Tracking

```typescript
// Create session on login
async createSession(userId: string, deviceInfo: DeviceInfo) {
  const sessionId = uuidv4();
  const session = {
    userId,
    deviceInfo,
    createdAt: Date.now(),
    lastActivity: Date.now(),
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
  };

  await redisClient.setex(
    `session:${userId}:${sessionId}`,
    7 * 24 * 60 * 60,
    JSON.stringify(session)
  );

  return sessionId;
}

// Update session activity
async updateSessionActivity(userId: string, sessionId: string) {
  const key = `session:${userId}:${sessionId}`;
  const session = await redisClient.get(key);
  
  if (session) {
    const parsed = JSON.parse(session);
    parsed.lastActivity = Date.now();
    await redisClient.setex(key, 7 * 24 * 60 * 60, JSON.stringify(parsed));
  }
}

// List active sessions
async getActiveSessions(userId: string) {
  const keys = await redisClient.keys(`session:${userId}:*`);
  const sessions = await Promise.all(
    keys.map(key => redisClient.get(key))
  );
  return sessions.map(s => JSON.parse(s!));
}

// Revoke session
async revokeSession(userId: string, sessionId: string) {
  await redisClient.del(`session:${userId}:${sessionId}`);
}
```

---

## Security Mechanisms

### 1. Password Security

```typescript
// Password hashing
const hashedPassword = await bcrypt.hash(password, 10);

// Password validation
const passwordSchema = z.string()
  .min(12, 'Senha deve ter no mínimo 12 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter letra minúscula')
  .regex(/[0-9]/, 'Senha deve conter número')
  .regex(/[^A-Za-z0-9]/, 'Senha deve conter caractere especial');
```

### 2. Rate Limiting

```typescript
// Login rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  keyGenerator: (req) => req.body.email || req.ip,
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
});

// Refresh rate limiting
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Muitas tentativas de renovação. Tente novamente em 15 minutos.'
});
```

### 3. CSRF Protection

```typescript
// CSRF token generation
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// CSRF validation on state-changing operations
app.post('/api/auth/login', csrfProtection, loginHandler);
```

### 4. Token Blacklisting

```typescript
// Blacklist token on logout
async logout(refreshToken: string) {
  await redisClient.setex(
    `blacklist:${refreshToken}`,
    7 * 24 * 60 * 60,
    'true'
  );
  
  await RefreshToken.deleteOne({ token: refreshToken });
}

// Check blacklist on token use
async isTokenBlacklisted(token: string): Promise<boolean> {
  const result = await redisClient.get(`blacklist:${token}`);
  return result === 'true';
}
```

---

## Improvement Recommendations

### 🟥 Critical

1. **Implement MFA (Multi-Factor Authentication)**
   - TOTP-based 2FA
   - SMS verification
   - Backup codes
   - **Effort:** 2 weeks

2. **Add Suspicious Activity Detection**
   - Login from new location
   - Multiple failed attempts
   - Unusual access patterns
   - **Effort:** 1 week

### 🟧 High Priority

3. **Implement OAuth2/Social Login**
   - Google OAuth
   - Microsoft OAuth
   - Apple Sign In
   - **Effort:** 2 weeks

4. **Add Session Management UI**
   - View active sessions
   - Revoke sessions remotely
   - Device information display
   - **Effort:** 1 week

5. **Implement Password Reset Flow**
   - Email-based reset
   - Secure token generation
   - Time-limited tokens
   - **Effort:** 3 days

### 🟨 Medium Priority

6. **Add Biometric Authentication**
   - WebAuthn support
   - Fingerprint/Face ID
   - **Effort:** 2 weeks

7. **Implement Remember Me**
   - Extended refresh tokens
   - Secure device recognition
   - **Effort:** 3 days

---

## Related Documents

- [09-Authentication-Authorization-Spec.md](../security/09-Authentication-Authorization-Spec.md)
- [10-Security-Best-Practices.md](../security/10-Security-Best-Practices.md)
- [01-System-Architecture-Overview.md](../architecture/01-System-Architecture-Overview.md)

---

**Version History:**

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01-15 | Initial documentation |
