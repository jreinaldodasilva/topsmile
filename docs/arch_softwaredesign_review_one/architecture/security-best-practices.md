# Security Best Practices

## Authentication Security

### Password Management
- **Hashing:** bcrypt with salt rounds
- **Minimum Length:** 8 characters
- **Complexity:** Uppercase, lowercase, number, special char
- **Storage:** Never store plaintext passwords
- **Reset Tokens:** Hash before storing in database

### Token Security
- **JWT Secret:** Minimum 64 characters (32-byte hex)
- **Algorithm:** HS256 (explicit in verification)
- **Storage:** HttpOnly cookies only
- **Expiry:** Short-lived access tokens (15min staff, 24h patient)
- **Rotation:** Refresh tokens rotated on each use
- **Blacklist:** Immediate revocation on logout

### Account Protection
- **Rate Limiting:** 10 login attempts per 15 minutes
- **Account Locking:** Lock after 5 failed attempts
- **Lock Duration:** 30 minutes
- **Session Timeout:** 30 minutes inactivity

## Authorization Security

### Role-Based Access Control (RBAC)
- **Principle of Least Privilege:** Users get minimum required permissions
- **Role Hierarchy:** super_admin > admin > manager > dentist > assistant
- **Clinic Isolation:** Multi-tenant data separation
- **Backend Enforcement:** Never trust frontend checks

### Permission Checks
```typescript
// Always check on backend
router.post('/', 
  authenticate,                    // Verify JWT
  authorize('admin', 'manager'),   // Check role
  ensureClinicAccess(),            // Verify clinic
  handler
);
```

## Input Security

### Validation
- **All Inputs:** Validate type, format, length
- **Whitelist:** Accept only expected values
- **Sanitization:** Remove/escape dangerous characters
- **express-validator:** Use for all request validation

### Injection Prevention
- **NoSQL Injection:** express-mongo-sanitize middleware
- **SQL Injection:** N/A (using Mongoose)
- **XSS:** Sanitize HTML content
- **Command Injection:** Never execute user input

## Network Security

### HTTPS/TLS
- **Enforce HTTPS:** All production traffic
- **TLS Version:** 1.3 minimum
- **Certificate:** Valid SSL certificate
- **HSTS:** Strict-Transport-Security header

### CORS
- **Whitelist Origins:** Explicit allowed origins
- **Credentials:** Allow credentials for cookies
- **Methods:** Restrict to needed methods
- **Headers:** Limit allowed headers

### Headers (Helmet)
```typescript
helmet({
  contentSecurityPolicy: { /* CSP rules */ },
  hsts: { maxAge: 31536000 },
  noSniff: true,
  xssFilter: true
})
```

## Data Security

### Sensitive Data
- **Passwords:** Hashed with bcrypt
- **Tokens:** Stored in HttpOnly cookies
- **Medical Records:** Encrypted at rest
- **Logs:** Mask sensitive data (passwords, tokens)

### Database Security
- **Connection:** Use connection string with auth
- **Indexes:** Add for performance and uniqueness
- **Backups:** Regular automated backups
- **Access Control:** Limit database user permissions

## Monitoring & Logging

### Audit Logging
- **Authentication Events:** Login, logout, failed attempts
- **Authorization Failures:** Access denied events
- **Data Changes:** Create, update, delete operations
- **Security Events:** Token revocation, account locks

### Security Monitoring
- **Failed Logins:** Alert on multiple failures
- **Unusual Activity:** Detect anomalies
- **Token Abuse:** Monitor refresh patterns
- **Rate Limit Violations:** Track excessive requests

## Incident Response

### Security Breach
1. **Identify:** Detect and confirm breach
2. **Contain:** Isolate affected systems
3. **Eradicate:** Remove threat
4. **Recover:** Restore services
5. **Review:** Post-incident analysis

### Token Compromise
1. **Revoke:** Blacklist compromised tokens
2. **Notify:** Alert affected users
3. **Force Reset:** Require password change
4. **Audit:** Review access logs

---

**Version:** 1.0  
**Date:** January 2025
