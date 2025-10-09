# TopSmile Security Best Practices

**Version:** 1.0.0 | **Date:** 2024-01-15 | **Status:** ✅ Complete

---

## Security Layers

### 1. Network Security

**HTTPS/TLS:**
- All traffic encrypted
- TLS 1.2+ only
- Strong cipher suites

**CORS Configuration:**
```typescript
cors({
  origin: [process.env.FRONTEND_URL, /\.vercel\.app$/],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
})
```

**Security Headers (Helmet):**
```typescript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true }
})
```

---

### 2. Authentication Security

**Password Requirements:**
- Minimum 12 characters
- Uppercase + lowercase + number + special char
- Bcrypt hashing (10 rounds)
- No password reuse (last 5)

**Token Security:**
- HttpOnly cookies (XSS protection)
- Secure flag in production
- SameSite=Strict
- Short expiration times
- Token rotation on refresh

**Session Security:**
```typescript
// Session configuration
{
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  }
}
```

---

### 3. Input Validation

**express-validator:**
```typescript
const createValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 12 }),
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('phone').matches(/^\+?[1-9]\d{1,14}$/)
];
```

**MongoDB Sanitization:**
```typescript
import mongoSanitize from 'express-mongo-sanitize';
app.use(mongoSanitize());
```

**XSS Prevention:**
```typescript
import DOMPurify from 'isomorphic-dompurify';
const clean = DOMPurify.sanitize(userInput);
```

---

### 4. Authorization

**Role-Based Access:**
```typescript
const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ success: false, message: 'Acesso negado' });
    }
    next();
  };
};
```

**Resource-Level Checks:**
```typescript
// Check ownership
if (appointment.patient.toString() !== req.user.id) {
  return res.status(403).json({ success: false, message: 'Acesso negado' });
}

// Check clinic scope
if (resource.clinic.toString() !== req.user.clinicId) {
  return res.status(403).json({ success: false, message: 'Acesso negado' });
}
```

---

### 5. Rate Limiting

**Tiered Rate Limits:**
```typescript
// Authentication endpoints: 5 attempts / 15 min
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

// API endpoints: 100 requests / 15 min
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

// Refresh endpoint: 20 attempts / 15 min
const refreshLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
```

**User-Based Limiting:**
```typescript
const limiter = rateLimit({
  keyGenerator: (req: AuthenticatedRequest) => req.user?.id || req.ip,
  skip: (req) => req.user?.role === 'super_admin'
});
```

---

### 6. Data Protection

**Sensitive Data Handling:**
```typescript
// Never log sensitive data
const sanitizeLog = (obj: any) => {
  const sensitive = ['password', 'token', 'ssn', 'creditCard'];
  const sanitized = { ...obj };
  for (const key of Object.keys(sanitized)) {
    if (sensitive.some(s => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]';
    }
  }
  return sanitized;
};
```

**Database Encryption:**
```typescript
// Encrypt sensitive fields
const encryptField = (value: string) => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  return cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
};

const decryptField = (encrypted: string) => {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
};
```

---

### 7. CSRF Protection

**Implementation:**
```typescript
import csrf from 'csurf';
const csrfProtection = csrf({ cookie: true });

// Get token
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Protect state-changing operations
app.post('/api/*', csrfProtection, handler);
```

---

### 8. SQL/NoSQL Injection Prevention

**Parameterized Queries:**
```typescript
// Good - using Mongoose
await User.findOne({ email: userInput });

// Bad - string concatenation
await User.findOne({ $where: `this.email === '${userInput}'` });
```

**Input Sanitization:**
```typescript
import mongoSanitize from 'express-mongo-sanitize';
app.use(mongoSanitize({ replaceWith: '_' }));
```

---

### 9. Error Handling

**Secure Error Messages:**
```typescript
// Production - generic message
if (process.env.NODE_ENV === 'production') {
  return res.status(500).json({ 
    success: false, 
    message: 'Erro interno do servidor' 
  });
}

// Development - detailed error
return res.status(500).json({ 
  success: false, 
  message: error.message,
  stack: error.stack 
});
```

---

### 10. Audit Logging

**Security Events:**
```typescript
const auditLog = {
  userId: req.user.id,
  action: 'LOGIN',
  resource: 'auth',
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  timestamp: new Date(),
  success: true
};

await AuditLog.create(auditLog);
```

---

## Security Checklist

### Authentication
- [x] Strong password requirements
- [x] Password hashing (bcrypt)
- [x] JWT with HttpOnly cookies
- [x] Token rotation
- [x] Token blacklisting
- [ ] Multi-factor authentication
- [x] Rate limiting on auth endpoints

### Authorization
- [x] Role-based access control
- [x] Resource-level authorization
- [x] Clinic-scoped data isolation
- [x] Permission matrix

### Input Validation
- [x] express-validator on all inputs
- [x] MongoDB sanitization
- [ ] XSS prevention (DOMPurify)
- [x] Type validation

### Data Protection
- [x] HTTPS/TLS
- [x] Secure cookies
- [ ] Field-level encryption
- [x] Sensitive data redaction in logs

### Network Security
- [x] CORS configuration
- [x] Security headers (Helmet)
- [x] Rate limiting
- [x] CSRF protection

### Monitoring
- [ ] Security event logging
- [ ] Suspicious activity detection
- [ ] Failed login tracking
- [ ] Audit trail

---

## Compliance Considerations

### HIPAA (Healthcare)
- Encrypt PHI at rest and in transit
- Audit all access to medical records
- Implement access controls
- Regular security assessments

### GDPR (Data Privacy)
- User consent management
- Right to access data
- Right to deletion
- Data portability
- Breach notification

### PCI DSS (Payment)
- Never store full credit card numbers
- Use Stripe for payment processing
- Secure payment forms
- Regular security scans

---

## Improvement Recommendations

### 🟥 Critical

1. **Implement Field-Level Encryption** - For sensitive data (1 week)
2. **Add Security Event Logging** - Comprehensive audit trail (1 week)
3. **Implement XSS Prevention** - DOMPurify on all inputs (2 days)

### 🟧 High Priority

4. **Add Intrusion Detection** - Monitor suspicious activity (2 weeks)
5. **Implement Security Headers** - Complete CSP policy (1 day)
6. **Add Penetration Testing** - Regular security audits (ongoing)

### 🟨 Medium Priority

7. **Implement Security Scanning** - Automated vulnerability scanning (1 week)
8. **Add Security Training** - Developer security awareness (ongoing)

---

**Related:** [09-Authentication-Authorization-Spec.md](./09-Authentication-Authorization-Spec.md), [07-Authentication-Flows.md](../flows/07-Authentication-Flows.md)
