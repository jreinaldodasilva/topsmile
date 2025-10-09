# Manual Testing - Environment Setup

## Purpose

This document provides detailed instructions for setting up your browser environment and preparing for manual testing of the TopSmile system.

## Browser Requirements

### Supported Browsers

| Browser | Minimum Version | Recommended | Notes |
|---------|----------------|-------------|-------|
| Brave | Latest | ✅ Primary | Chromium-based, privacy-focused |
| Chrome | 90+ | ✅ Primary | Full DevTools support |
| Firefox | 88+ | ✅ Secondary | Good for cross-browser testing |
| Safari | 14+ | ⚠️ macOS only | WebKit engine testing |
| Edge | 90+ | ✅ Secondary | Chromium-based |

### Browser Configuration

1. **Enable JavaScript** - Required for React application
2. **Allow Cookies** - Required for authentication
3. **Disable Ad Blockers** - May interfere with API calls
4. **Enable Developer Tools** - Press F12 or Cmd+Option+I (Mac)

## Environment URLs

### Development Environment

```
Frontend: http://localhost:3000
Backend API: http://localhost:5000
API Documentation: http://localhost:5000/api-docs
```

### Staging Environment (if available)

```
Frontend: https://staging.topsmile.com
Backend API: https://api-staging.topsmile.com
API Documentation: https://api-staging.topsmile.com/api-docs
```

### Production Environment

```
Frontend: https://topsmile.com
Backend API: https://api.topsmile.com
```

**⚠️ WARNING**: Only test in development or staging environments. Never perform testing in production.

## Test Accounts

### Staff Accounts

#### Super Admin
```
Email: superadmin@test.topsmile.com
Password: SuperAdmin123!
Role: super_admin
Clinic: All clinics
```

#### Clinic Admin
```
Email: admin@test.topsmile.com
Password: Admin123!
Role: admin
Clinic: Test Clinic 1
```

#### Provider (Dentist)
```
Email: dentist@test.topsmile.com
Password: Dentist123!
Role: provider
Clinic: Test Clinic 1
Specialty: General Dentistry
```

#### Staff (Receptionist)
```
Email: staff@test.topsmile.com
Password: Staff123!
Role: staff
Clinic: Test Clinic 1
```

### Patient Accounts

#### Patient 1
```
Email: patient1@test.topsmile.com
Password: Patient123!
Name: João Silva
Phone: (11) 98765-4321
```

#### Patient 2
```
Email: patient2@test.topsmile.com
Password: Patient123!
Name: Maria Santos
Phone: (11) 98765-4322
```

**📝 Note**: These are test accounts. Real credentials will be provided by the development team.

## Browser Developer Tools Setup

### Opening Developer Tools

- **Windows/Linux**: Press `F12` or `Ctrl+Shift+I`
- **macOS**: Press `Cmd+Option+I`
- **Right-click**: Select "Inspect" or "Inspect Element"

### Essential Tabs

#### 1. Console Tab
**Purpose**: Monitor JavaScript errors and warnings

**Setup**:
- Keep console open during testing
- Enable "Preserve log" to keep logs across page loads
- Set log level to "Verbose" for detailed output

**What to Monitor**:
- Red errors (critical issues)
- Yellow warnings (potential problems)
- Network request failures
- React component errors

#### 2. Network Tab
**Purpose**: Inspect API requests and responses

**Setup**:
- Enable "Preserve log"
- Disable cache (check "Disable cache")
- Filter by XHR/Fetch to see API calls

**What to Monitor**:
- Request status codes (200, 400, 401, 500, etc.)
- Request/response payloads
- Response times
- Failed requests

#### 3. Application Tab
**Purpose**: Inspect storage and cookies

**Setup**:
- Expand "Cookies" section
- Expand "Local Storage"
- Expand "Session Storage"

**What to Monitor**:
- Authentication tokens (HttpOnly cookies)
- User session data
- Cached data

#### 4. Elements Tab
**Purpose**: Inspect DOM and CSS

**What to Monitor**:
- Element structure
- CSS styles
- Responsive design breakpoints

### Browser Extensions (Optional)

#### React Developer Tools
```
Chrome/Brave: https://chrome.google.com/webstore (search "React Developer Tools")
Firefox: https://addons.mozilla.org (search "React Developer Tools")
```

**Benefits**:
- Inspect React component tree
- View component props and state
- Track component re-renders

#### Redux DevTools (if using Redux)
```
Chrome/Brave: https://chrome.google.com/webstore (search "Redux DevTools")
```

## Environment Verification

### Pre-Test Checklist

Before starting manual testing, verify:

- [ ] **Backend is running**
  - Navigate to http://localhost:5000/api-docs
  - Should see Swagger API documentation

- [ ] **Frontend is running**
  - Navigate to http://localhost:3000
  - Should see TopSmile login page

- [ ] **Database is accessible**
  - Backend console shows "MongoDB connected"
  - No connection errors in logs

- [ ] **Redis is running**
  - Backend console shows "Redis connected"
  - Session management works

- [ ] **Test accounts work**
  - Can log in with at least one staff account
  - Can log in with at least one patient account

### Quick Verification Test

1. Open http://localhost:3000
2. Log in with admin@test.topsmile.com / Admin123!
3. Should see staff dashboard
4. Open browser console (F12)
5. Check for no red errors
6. Open Network tab
7. Refresh page
8. Verify API calls return 200 status

**✅ If all checks pass, environment is ready for testing**

## Test Data Preparation

### Database State

Ensure test database has:
- At least 2 clinics
- At least 3 providers per clinic
- At least 10 patients per clinic
- At least 20 appointments (past and future)
- Various appointment types (consultation, cleaning, treatment)
- Sample treatment plans and clinical notes

### Resetting Test Data

If test data becomes corrupted:

```bash
# Stop the backend
# Run database reset script (if available)
npm run db:reset:test

# Or manually reset via MongoDB
mongo topsmile
db.dropDatabase()
npm run db:seed:test
```

**⚠️ Only reset test databases, never production!**

## Network Configuration

### CORS Settings

Ensure backend allows frontend origin:
```
FRONTEND_URL=http://localhost:3000
```

### API Base URL

Frontend should point to correct backend:
```
REACT_APP_API_URL=http://localhost:5000
```

### Proxy Configuration (if using)

Check `package.json` for proxy settings:
```json
"proxy": "http://localhost:5000"
```

## Common Setup Issues

### Issue: Cannot access localhost:3000

**Symptoms**: Browser shows "This site can't be reached"

**Solutions**:
1. Verify frontend is running: `npm start`
2. Check port 3000 is not in use: `lsof -i :3000` (Mac/Linux)
3. Try alternative port: `PORT=3001 npm start`

### Issue: API calls fail with CORS error

**Symptoms**: Console shows "CORS policy" error

**Solutions**:
1. Verify backend CORS configuration
2. Check FRONTEND_URL in backend .env
3. Restart backend server

### Issue: Cannot log in

**Symptoms**: Login fails with "Invalid credentials"

**Solutions**:
1. Verify test account credentials
2. Check backend is running
3. Verify database has user records
4. Check backend logs for errors

### Issue: Blank page after login

**Symptoms**: Page loads but shows nothing

**Solutions**:
1. Check browser console for errors
2. Verify API calls are successful (Network tab)
3. Clear browser cache and cookies
4. Try different browser

### Issue: Session expires immediately

**Symptoms**: Logged out right after login

**Solutions**:
1. Check browser allows cookies
2. Verify JWT secrets are configured
3. Check Redis is running
4. Verify token expiration settings

## Browser Cache Management

### When to Clear Cache

- Before starting new test session
- After code changes
- When experiencing unexpected behavior
- When testing authentication flows

### How to Clear Cache

**Chrome/Brave**:
1. Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select "Cookies and other site data"
3. Select "Cached images and files"
4. Click "Clear data"

**Firefox**:
1. Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
2. Select "Cookies" and "Cache"
3. Click "Clear Now"

**Hard Reload** (without clearing all cache):
- Windows/Linux: `Ctrl+Shift+R`
- macOS: `Cmd+Shift+R`

## Screen Recording (Optional)

For documenting complex issues:

### Built-in Tools
- **Windows**: Xbox Game Bar (Win+G)
- **macOS**: QuickTime Player or Screenshot app (Cmd+Shift+5)
- **Linux**: SimpleScreenRecorder, Kazam

### Browser Extensions
- Loom (screen + webcam recording)
- Awesome Screenshot (screenshots + annotations)

## Accessibility Testing Tools

### Browser Extensions

**axe DevTools** (Free):
```
Chrome: https://chrome.google.com/webstore (search "axe DevTools")
```

**WAVE** (Free):
```
Chrome: https://chrome.google.com/webstore (search "WAVE Evaluation Tool")
```

### Built-in Browser Tools

**Chrome Lighthouse**:
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Accessibility"
4. Click "Generate report"

## Mobile Testing Setup

### Browser DevTools Device Emulation

1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device from dropdown:
   - iPhone 12 Pro
   - iPad Pro
   - Samsung Galaxy S20
   - Custom dimensions

### Responsive Breakpoints to Test

- **Mobile**: 375px width (iPhone)
- **Tablet**: 768px width (iPad)
- **Desktop**: 1920px width (Full HD)

## Next Steps

Once environment is set up:

1. ✅ Verify all checklist items above
2. 📋 Proceed to **Document 02 - Authentication Tests**
3. 🧪 Begin systematic testing

## Troubleshooting Contacts

- **Environment Issues**: Contact DevOps team
- **Test Account Issues**: Contact development team
- **Database Issues**: Contact backend team
- **Browser Issues**: Try different browser or update current browser

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Maintained By**: QA Team
