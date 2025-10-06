# Deployment Checklist - Security Updates

## Pre-Deployment

### Code Review
- [x] All localStorage token usage removed
- [x] httpOnly cookies implemented
- [x] Token blacklist service created
- [x] Automatic token refresh working
- [x] Session timeout implemented
- [x] All tests passing

### Environment Variables

**Backend (.env)**
```bash
# Required
NODE_ENV=production
JWT_SECRET=<generate-with-openssl>
JWT_REFRESH_SECRET=<generate-with-openssl>
REDIS_URL=<redis-connection-string>

# Security
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
SESSION_TIMEOUT=1800000

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

**Frontend (.env.production)**
```bash
REACT_APP_API_URL=https://api.topsmile.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=<production-key>
```

### Infrastructure

- [ ] Redis server running and accessible
- [ ] MongoDB with authentication enabled
- [ ] HTTPS certificate valid
- [ ] Firewall rules configured
- [ ] Backup system operational

### Security Configuration

- [ ] CORS whitelist updated with production domain
- [ ] Rate limiting enabled
- [ ] Helmet security headers configured
- [ ] CSRF protection enabled
- [ ] Cookie settings: httpOnly, secure, sameSite

## Deployment Steps

### 1. Database Migration
```bash
# Backup current database
mongodump --uri="mongodb://..." --out=backup-$(date +%Y%m%d)

# No schema changes needed for security updates
```

### 2. Backend Deployment
```bash
cd backend
npm ci --production
npm run build
pm2 restart topsmile-api
```

### 3. Frontend Deployment
```bash
npm ci --production
npm run build
# Deploy build/ to CDN or static hosting
```

### 4. Redis Setup
```bash
# Ensure Redis is running
redis-cli ping
# Should return: PONG

# Set maxmemory policy for token blacklist
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

## Post-Deployment Verification

### Smoke Tests

**1. Login Flow**
```bash
curl -X POST https://api.topsmile.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}' \
  -c cookies.txt

# Should return 200 with Set-Cookie headers
```

**2. Token in Cookie**
```bash
cat cookies.txt | grep accessToken
# Should show httpOnly flag
```

**3. Protected Endpoint**
```bash
curl https://api.topsmile.com/api/auth/me \
  -b cookies.txt

# Should return user data
```

**4. Token Refresh**
```bash
# Wait for token expiration or manually test
curl -X POST https://api.topsmile.com/api/auth/refresh \
  -b cookies.txt

# Should return 200 with new token
```

**5. Logout**
```bash
curl -X POST https://api.topsmile.com/api/auth/logout \
  -b cookies.txt

# Should return 200 and clear cookies
```

### Security Verification

- [ ] Tokens not visible in browser localStorage
- [ ] Tokens in httpOnly cookies
- [ ] HTTPS enforced (no HTTP access)
- [ ] CORS only allows production domain
- [ ] Rate limiting active (test with multiple requests)
- [ ] Session timeout working (wait 30 minutes)
- [ ] Token blacklist working (logout then reuse token)

### Performance Tests

```bash
# Run load test
k6 run backend/tests/performance/auth-load-test.js

# Expected results:
# - p95 response time < 500ms
# - Error rate < 1%
# - 50 concurrent users handled
```

### Monitoring Setup

- [ ] Error tracking configured (Sentry/Rollbar)
- [ ] Performance monitoring active (New Relic/DataDog)
- [ ] Log aggregation working (CloudWatch/ELK)
- [ ] Alerts configured for:
  - High error rate (>5%)
  - Failed login attempts (>10/min from same IP)
  - Token refresh failures (>5%)
  - Redis connection issues

## Rollback Plan

### If Issues Detected

**1. Immediate Rollback**
```bash
# Backend
pm2 restart topsmile-api --update-env

# Frontend
# Revert to previous build
```

**2. Database Rollback**
```bash
# Restore from backup if needed
mongorestore --uri="mongodb://..." backup-YYYYMMDD/
```

**3. Communication**
- Notify users of temporary issues
- Post status update
- Provide ETA for resolution

## Success Criteria

- [ ] All users can login successfully
- [ ] Session timeout working as expected
- [ ] No localStorage token usage
- [ ] Token refresh automatic and seamless
- [ ] Cross-tab logout syncing
- [ ] Performance within acceptable limits
- [ ] No security vulnerabilities detected
- [ ] Monitoring and alerts operational

## Post-Deployment Tasks

### Day 1
- Monitor error rates closely
- Check user feedback
- Review logs for issues
- Verify all alerts working

### Week 1
- Analyze performance metrics
- Review security logs
- Check for any anomalies
- Gather user feedback

### Month 1
- Security audit review
- Performance optimization
- Update documentation
- Plan next improvements

## Emergency Contacts

- **DevOps Lead:** [contact]
- **Security Team:** [contact]
- **On-Call Engineer:** [contact]

## Documentation Updates

- [x] SECURITY_AUDIT.md
- [x] SECURITY_IMPROVEMENTS.md
- [x] SECURITY_TESTING_GUIDE.md
- [x] TESTING_SUMMARY.md
- [x] ACTION_CHECKLIST.md

## Sign-Off

- [ ] Development Lead: ________________ Date: ______
- [ ] Security Review: _________________ Date: ______
- [ ] QA Approval: ____________________ Date: ______
- [ ] DevOps Approval: ________________ Date: ______
