# Security Testing Guide

## Manual Security Testing

### 1. Token Storage Test

**Objective:** Verify tokens not in localStorage

**Steps:**
1. Login to application
2. Open browser DevTools → Application → Local Storage
3. Verify no `accessToken` or `refreshToken` keys
4. Open DevTools → Application → Cookies
5. Verify `accessToken` and `refreshToken` cookies exist
6. Verify cookies have `HttpOnly` flag

**Expected:** Tokens only in httpOnly cookies

### 2. Token Blacklist Test

**Objective:** Verify revoked tokens cannot be reused

**Steps:**
1. Login and capture access token from cookie
2. Logout
3. Manually set the old token in cookie
4. Try to access protected endpoint
5. Verify 401 Unauthorized response

**Expected:** Blacklisted token rejected

### 3. Token Refresh Test

**Objective:** Verify automatic token refresh

**Steps:**
1. Login to application
2. Wait for token to expire (or manually expire)
3. Make API request
4. Check Network tab for `/api/auth/refresh` call
5. Verify original request succeeds after refresh

**Expected:** Automatic refresh and retry

### 4. Session Timeout Test

**Objective:** Verify inactivity timeout

**Steps:**
1. Login to application
2. Do not interact for 28 minutes
3. Verify warning modal appears
4. Click "Continuar Conectado"
5. Verify session continues
6. Do not interact for 30 minutes
7. Verify automatic logout

**Expected:** Warning at 28min, logout at 30min

### 5. Cross-Tab Logout Test

**Objective:** Verify logout syncs across tabs

**Steps:**
1. Login in Tab 1
2. Open Tab 2 with same application
3. Logout from Tab 1
4. Check Tab 2 status

**Expected:** Tab 2 also logged out

### 6. XSS Protection Test

**Objective:** Verify XSS cannot access tokens

**Steps:**
1. Login to application
2. Open console and run:
```javascript
document.cookie
localStorage.getItem('accessToken')
```
3. Verify token not accessible via JavaScript

**Expected:** Token not accessible

### 7. CSRF Protection Test

**Objective:** Verify CSRF protection active

**Steps:**
1. Create external HTML file with form:
```html
<form action="http://localhost:5000/api/appointments" method="POST">
  <input type="submit" value="Submit">
</form>
```
2. Open file in browser while logged in
3. Submit form
4. Verify request blocked

**Expected:** CSRF token missing error

## Automated Security Testing

### Run Security Tests

```bash
# All security tests
npm run test:security

# Specific tests
npm test -- --testPathPattern=security
npm test -- --testPathPattern=auth
```

### Penetration Testing

```bash
# Install OWASP ZAP or Burp Suite
# Run automated scan against localhost:3000
# Review findings
```

### Dependency Scanning

```bash
# Check for vulnerable dependencies
npm audit

# Fix vulnerabilities
npm audit fix
```

## Security Checklist

### Before Deployment

- [ ] All tokens in httpOnly cookies
- [ ] No sensitive data in localStorage
- [ ] Token blacklist operational
- [ ] Session timeout working
- [ ] CSRF protection enabled
- [ ] Rate limiting configured
- [ ] HTTPS enforced
- [ ] Security headers set
- [ ] Input validation active
- [ ] Audit logging enabled

### After Deployment

- [ ] Verify HTTPS certificate valid
- [ ] Test login/logout flow
- [ ] Test token refresh
- [ ] Test session timeout
- [ ] Monitor failed login attempts
- [ ] Check audit logs
- [ ] Review error logs for security issues

## Common Security Issues

### Issue: Token visible in localStorage
**Fix:** Migrate to httpOnly cookies

### Issue: Session never expires
**Fix:** Implement session timeout

### Issue: Revoked token still works
**Fix:** Enable token blacklist

### Issue: User logged out unexpectedly
**Fix:** Check token expiration and refresh logic

### Issue: CORS errors
**Fix:** Verify origin in CORS whitelist

## Security Monitoring

### Metrics Dashboard

Monitor these metrics:
- Failed login attempts per hour
- Token refresh success rate
- Session timeout frequency
- Blacklisted token attempts
- API error rate (401, 403)

### Alert Thresholds

Set alerts for:
- >10 failed logins from same IP in 5 min
- Token refresh failure rate >5%
- >100 401 errors per hour
- Blacklisted token usage detected

## Incident Response

### If Security Breach Detected

1. **Immediate Actions:**
   - Revoke all active tokens
   - Force all users to re-login
   - Enable additional logging

2. **Investigation:**
   - Review audit logs
   - Identify affected users
   - Determine breach scope

3. **Remediation:**
   - Fix vulnerability
   - Deploy patch
   - Notify affected users

4. **Post-Incident:**
   - Document incident
   - Update security procedures
   - Conduct security review

## Tools

### Recommended Tools

- **OWASP ZAP:** Web application security scanner
- **Burp Suite:** Security testing toolkit
- **npm audit:** Dependency vulnerability scanner
- **Snyk:** Continuous security monitoring
- **SonarQube:** Code quality and security analysis

### Browser Extensions

- **Cookie Editor:** Inspect cookies
- **ModHeader:** Modify request headers
- **Postman:** API testing

## References

- OWASP Testing Guide
- NIST Cybersecurity Framework
- CWE Top 25 Most Dangerous Software Weaknesses
