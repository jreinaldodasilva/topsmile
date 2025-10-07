# Quick Start Guide

## Prerequisites Check

```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
mongod --version  # MongoDB should be installed
redis-cli --version  # Redis should be installed
```

## 1. Install Dependencies

```bash
# Root (frontend)
npm install

# Backend
cd backend
npm install
cd ..
```

## 2. Generate Secrets

```bash
# Generate JWT secrets
openssl rand -base64 32  # Copy for JWT_SECRET
openssl rand -base64 32  # Copy for JWT_REFRESH_SECRET
```

## 3. Configure Environment

**backend/.env:**
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/topsmile
JWT_SECRET=<paste-first-secret>
JWT_REFRESH_SECRET=<paste-second-secret>
REDIS_URL=redis://localhost:6379
COOKIE_SECURE=false
```

**Frontend .env:**
```bash
REACT_APP_API_URL=http://localhost:5000
```

## 4. Start Services

**Terminal 1 - MongoDB:**
```bash
mongod
```

**Terminal 2 - Redis:**
```bash
redis-server
```

**Terminal 3 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 4 - Frontend:**
```bash
npm start
```

## 5. Test in Browser

Open http://localhost:3000

### Test Authentication:
1. Go to `/login`
2. Open DevTools → Application → Cookies
3. Login (create account first if needed)
4. Verify `accessToken` cookie has `HttpOnly` flag
5. Verify `refreshToken` cookie exists

### Test Session Timeout:
1. After login, open DevTools → Console
2. Run: `setTimeout(() => alert('28 min passed'), 28 * 60 * 1000)`
3. Wait or manually trigger timeout
4. Verify warning modal appears

### Test Clinical Integration:
1. Navigate to `/admin/patients/123` (any ID)
2. Click through tabs: Dental Chart, Treatment Plan, Clinical Notes
3. Verify components load without errors

### Test Token Refresh:
1. Login and wait for token to expire (15 min)
2. Make any API request
3. Check Network tab for `/api/auth/refresh` call
4. Verify request succeeds after refresh

## 6. Run Tests

```bash
# Security tests
bash scripts/security-test.sh

# Integration tests
bash scripts/integration-test.sh

# Unit tests (if configured)
npm test
```

## Troubleshooting

**Port already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**MongoDB connection error:**
```bash
# Check MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod --dbpath /usr/local/var/mongodb
```

**Redis connection error:**
```bash
# Check Redis is running
redis-cli ping

# Start Redis
redis-server
```

**CORS errors:**
- Verify `REACT_APP_API_URL` matches backend URL
- Check backend CORS configuration allows `http://localhost:3000`

## Success Indicators

✅ Frontend loads at http://localhost:3000  
✅ Backend responds at http://localhost:5000/api/health  
✅ Login creates httpOnly cookies  
✅ Session timeout warning appears  
✅ Token refresh works automatically  
✅ Clinical components load in patient detail page  

## Next Steps

After successful testing:
1. Review `docs/NEXT_STEPS.md`
2. Follow `docs/DEPLOYMENT_CHECKLIST_SECURITY.md`
3. Deploy to staging environment
