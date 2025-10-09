# TopSmile Authentication & Authorization Specification

**Version:** 1.0.0 | **Date:** 2024-01-15 | **Status:** ✅ Complete

---

## Authentication Systems

### Dual Authentication Architecture

| System | Users | Token Lifetime | Secret |
|--------|-------|----------------|--------|
| Staff Auth | Admin, Provider, Staff | 15min access, 7d refresh | JWT_SECRET |
| Patient Auth | Patients | 30min access, 30d refresh | PATIENT_JWT_SECRET |

---

## JWT Token Structure

### Staff Access Token
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

### Patient Access Token
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

---

## Role-Based Access Control (RBAC)

### Role Hierarchy
```
super_admin > admin > manager > provider > staff > patient
```

### Permission Matrix

| Resource | super_admin | admin | manager | provider | staff | patient |
|----------|-------------|-------|---------|----------|-------|---------|
| Clinics | CRUD | R | R | R | R | - |
| Users | CRUD | CRUD | RU | R | R | - |
| Patients | CRUD | CRUD | CRUD | CRUD | CRUD | R (self) |
| Providers | CRUD | CRUD | RU | R | R | R |
| Appointments | CRUD | CRUD | CRUD | CRUD | CRUD | RU (own) |
| Medical Records | CRUD | CRUD | R | CRUD | R | R (own) |
| Reports | CRUD | CRUD | R | R | - | - |
| Settings | CRUD | CRUD | RU | - | - | - |

**Legend:** C=Create, R=Read, U=Update, D=Delete

---

## Authentication Endpoints

### Staff Authentication

```typescript
POST /api/auth/login
Body: { email, password }
Response: { success, user, tokens }

POST /api/auth/refresh
Cookie: refresh_token
Response: { success, tokens }

POST /api/auth/logout
Cookie: refresh_token
Response: { success }

POST /api/auth/forgot-password
Body: { email }
Response: { success, message }

POST /api/auth/reset-password
Body: { token, newPassword }
Response: { success, message }
```

### Patient Authentication

```typescript
POST /api/patient-auth/register
Body: { email, password, name, phone }
Response: { success, patient, tokens }

POST /api/patient-auth/login
Body: { email, password }
Response: { success, patient, tokens }

POST /api/patient-auth/refresh
Cookie: patient_refresh_token
Response: { success, tokens }

POST /api/patient-auth/logout
Cookie: patient_refresh_token
Response: { success }
```

---

## Security Mechanisms

### 1. Password Security

**Requirements:**
- Minimum 12 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

**Hashing:**
```typescript
const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hashedPassword);
```

### 2. Token Management

**Access Token:**
- Short-lived (15min staff, 30min patient)
- Stored in HttpOnly cookie
- Used for API authentication

**Refresh Token:**
- Long-lived (7d staff, 30d patient)
- Stored in HttpOnly cookie
- Stored in database
- Rotated on each use
- Blacklisted on logout

### 3. Token Blacklisting

```typescript
// Blacklist token on logout
await redisClient.setex(`blacklist:${token}`, ttl, 'true');

// Check blacklist on authentication
const isBlacklisted = await redisClient.get(`blacklist:${token}`);
if (isBlacklisted) throw new Error('Token inválido');
```

### 4. Rate Limiting

```typescript
// Login attempts: 5 per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.body.email || req.ip
});

// Refresh attempts: 20 per 15 minutes
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20
});
```

### 5. CSRF Protection

```typescript
// Get CSRF token
GET /api/csrf-token
Response: { csrfToken }

// Include in state-changing requests
POST /api/appointments
Headers: { 'X-CSRF-Token': token }
```

---

## Authorization Implementation

### Route Protection

```typescript
// Require authentication
router.use('/api/appointments', authenticate);

// Require specific roles
router.post('/api/appointments', 
  authenticate, 
  authorize('admin', 'staff'),
  handler
);

// Require permission
router.delete('/api/appointments/:id',
  authenticate,
  requirePermission('appointments:delete'),
  handler
);
```

### Resource-Level Authorization

```typescript
// Check ownership
async function canAccessAppointment(userId: string, appointmentId: string) {
  const appointment = await Appointment.findById(appointmentId);
  return appointment.patient.toString() === userId;
}

// Check clinic scope
async function canAccessResource(clinicId: string, resourceId: string) {
  const resource = await Resource.findById(resourceId);
  return resource.clinic.toString() === clinicId;
}
```

---

## Session Management

### Session Storage (Redis)

```typescript
// Session structure
{
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

// Session operations
await redisClient.setex(`session:${userId}:${sessionId}`, ttl, JSON.stringify(session));
await redisClient.get(`session:${userId}:${sessionId}`);
await redisClient.del(`session:${userId}:${sessionId}`);
```

### Multi-Device Support

```typescript
// List active sessions
GET /api/security/sessions
Response: { sessions: [...] }

// Revoke session
DELETE /api/security/sessions/:sessionId
Response: { success }

// Revoke all sessions
DELETE /api/security/sessions
Response: { success }
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
   - **Effort:** 2 weeks

4. **Add Biometric Authentication**
   - WebAuthn support
   - Fingerprint/Face ID
   - **Effort:** 2 weeks

5. **Implement Password Policy Enforcement**
   - Password history
   - Expiration
   - Complexity requirements
   - **Effort:** 1 week

---

**Related:** [07-Authentication-Flows.md](../flows/07-Authentication-Flows.md), [10-Security-Best-Practices.md](./10-Security-Best-Practices.md)
