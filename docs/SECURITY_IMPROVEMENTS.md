# Security Improvements Documentation

## Overview
This document details all security improvements made to the TopSmile authentication system.

## 1. Token Storage Migration

### Before
```typescript
// INSECURE - Vulnerable to XSS
localStorage.setItem('accessToken', token);
const token = localStorage.getItem('accessToken');
```

### After
```typescript
// SECURE - httpOnly cookies
// Backend sets cookie
res.cookie('accessToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000
});

// Frontend automatically includes cookie
fetch(url, { credentials: 'include' });
```

**Benefits:**
- XSS attacks cannot access tokens
- Automatic inclusion in requests
- Browser handles storage securely

## 2. Token Blacklist Service

### Implementation
```typescript
// backend/src/services/tokenBlacklistService.ts
class TokenBlacklistService {
  async addToBlacklist(token: string, expiresIn: number): Promise<void> {
    await redis.setex(`blacklist:${token}`, expiresIn, '1');
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const result = await redis.get(`blacklist:${token}`);
    return result !== null;
  }
}
```

**Benefits:**
- Revoked tokens cannot be reused
- Automatic expiration with TTL
- Fast Redis-based lookup

## 3. Automatic Token Refresh

### Implementation
```typescript
// src/services/http.ts
if (res.status === 401 && !endpoint.includes('/auth/refresh')) {
  if (!isRefreshing) {
    isRefreshing = true;
    const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    });
    
    if (refreshRes.ok) {
      isRefreshing = false;
      onRefreshed('refreshed');
      return makeRequest(); // Retry original request
    }
  }
}
```

**Benefits:**
- Seamless user experience
- No manual token management
- Prevents concurrent refresh requests

## 4. Session Timeout Tracking

### Implementation
```typescript
// src/hooks/useSessionTimeout.ts
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_TIMEOUT = 2 * 60 * 1000; // 2 minutes

useSessionTimeout({
  enabled: isAuthenticated,
  onWarning: () => setShowTimeoutWarning(true),
  onTimeout: () => performLogout('Sessão expirou por inatividade.')
});
```

**Benefits:**
- Reduces session hijacking risk
- User-friendly warning system
- Activity-based timer reset

## 5. Cross-Tab Logout Sync

### Implementation
```typescript
// Custom event for cross-tab communication
window.dispatchEvent(new CustomEvent(LOGOUT_EVENT, { 
  detail: { key: 'default' } 
}));

// Listen in other tabs
window.addEventListener(LOGOUT_EVENT, (event) => {
  if (customEvent.detail.key === 'default') {
    setUser(null);
    navigate('/login');
  }
});
```

**Benefits:**
- Consistent state across tabs
- Immediate logout propagation
- No localStorage dependency

## Security Best Practices Applied

### 1. Defense in Depth
- Multiple layers of security
- Token blacklist + httpOnly cookies + session timeout
- No single point of failure

### 2. Principle of Least Privilege
- Role-based access control
- Resource-level permissions
- Clinic-level data isolation

### 3. Secure by Default
- httpOnly cookies by default
- Secure flag in production
- SameSite=Strict for CSRF protection

### 4. Fail Securely
- Logout on refresh failure
- Clear state on errors
- Redirect to login on auth failure

### 5. Don't Trust User Input
- Validation on all endpoints
- Sanitization of HTML content
- MongoDB injection prevention

## Migration Guide

### For Developers

1. **Remove localStorage usage:**
```typescript
// Remove these lines
localStorage.setItem('token', token);
localStorage.getItem('token');
localStorage.removeItem('token');
```

2. **Use apiService or request():**
```typescript
// Use this instead
const response = await apiService.method();
// or
const response = await request('/api/endpoint');
```

3. **Credentials included automatically:**
```typescript
// No need to manually add tokens
// Cookies sent automatically with credentials: 'include'
```

### For Testing

1. **Check cookies instead of localStorage:**
```typescript
// Cypress
cy.getCookie('accessToken').should('exist');

// Jest
// Mock document.cookie
```

2. **Test token refresh:**
```typescript
cy.intercept('POST', '/api/auth/refresh').as('refresh');
cy.wait('@refresh');
```

## Monitoring & Alerts

### Metrics to Track
- Failed login attempts per IP
- Token refresh rate
- Session timeout frequency
- Blacklisted token attempts

### Alert Conditions
- >10 failed logins from same IP in 5 minutes
- Token refresh failure rate >5%
- Blacklisted token usage detected

## Rollback Plan

If issues arise:

1. **Immediate:** Increase token expiration time
2. **Short-term:** Disable session timeout temporarily
3. **Long-term:** Revert to previous auth implementation

## References

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
