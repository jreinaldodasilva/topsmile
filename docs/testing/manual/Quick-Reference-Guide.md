# TopSmile Manual Testing - Quick Reference Guide

## Quick Start Checklist

### Before Testing
- [ ] Browser: Brave/Chrome (latest version)
- [ ] Environment: http://localhost:3000 (frontend) + http://localhost:5000 (backend)
- [ ] DevTools: Open (F12)
- [ ] Cache: Cleared
- [ ] Test Account: Ready

### During Testing
- [ ] Follow test steps exactly
- [ ] Record results in tables
- [ ] Screenshot any issues
- [ ] Copy console errors
- [ ] Note unexpected behavior

### After Testing
- [ ] Document findings
- [ ] Create GitHub issues
- [ ] Update test results
- [ ] Log out properly

## Test Accounts Quick Reference

```
STAFF ACCOUNTS
--------------
Super Admin: superadmin@test.topsmile.com / SuperAdmin123!
Admin:       admin@test.topsmile.com       / Admin123!
Provider:    dentist@test.topsmile.com     / Dentist123!
Staff:       staff@test.topsmile.com       / Staff123!

PATIENT ACCOUNTS
----------------
Patient 1:   patient1@test.topsmile.com    / Patient123!
Patient 2:   patient2@test.topsmile.com    / Patient123!
```

## Environment URLs

```
Development:
  Frontend:  http://localhost:3000
  Backend:   http://localhost:5000
  API Docs:  http://localhost:5000/api-docs

Staging (if available):
  Frontend:  https://staging.topsmile.com
  Backend:   https://api-staging.topsmile.com
```

## Browser DevTools Shortcuts

```
Open DevTools:        F12 (Windows/Linux) | Cmd+Option+I (Mac)
Console Tab:          Ctrl+Shift+J | Cmd+Option+J
Network Tab:          Ctrl+Shift+E | Cmd+Option+E
Device Toolbar:       Ctrl+Shift+M | Cmd+Shift+M
Hard Reload:          Ctrl+Shift+R | Cmd+Shift+R
Clear Cache:          Ctrl+Shift+Delete | Cmd+Shift+Delete
```

## Test Result Status Codes

```
✅ Pass     - Feature works as expected
❌ Fail     - Feature does not work correctly
⚠️ Partial  - Feature works but has minor issues
🔄 Blocked  - Cannot test due to dependency
⏭️ Skipped  - Intentionally not tested
```

## Issue Severity Quick Guide

```
🔴 Critical  - System unusable, data loss, security issue
🟠 High      - Major feature broken, significant impact
🟡 Medium    - Feature partially broken, workaround exists
🟢 Low       - Minor issue, cosmetic problem
```

## Common Test Scenarios

### Login Test
```
1. Navigate to http://localhost:3000
2. Enter email: admin@test.topsmile.com
3. Enter password: Admin123!
4. Click "Entrar"
5. Verify redirect to dashboard
```

### Create Appointment Test
```
1. Navigate to Agendamentos
2. Click "Novo Agendamento"
3. Select patient
4. Select provider
5. Select date and time
6. Click "Agendar"
7. Verify success message
```

### Logout Test
```
1. Click user profile icon
2. Click "Sair"
3. Verify redirect to login
4. Verify cannot access /dashboard
```

## Common Console Errors

### Expected Errors (OK)
```
401 Unauthorized - When testing invalid login
403 Forbidden - When testing unauthorized access
404 Not Found - When testing invalid URLs
```

### Unexpected Errors (Report)
```
500 Internal Server Error - Backend issue
TypeError: Cannot read property - JavaScript error
CORS policy error - Configuration issue
Network request failed - Backend not running
```

## Quick Troubleshooting

### Cannot Access localhost:3000
```
1. Check frontend is running: npm start
2. Check port 3000 not in use
3. Try: PORT=3001 npm start
```

### Cannot Login
```
1. Verify backend is running
2. Check browser console for errors
3. Verify test account credentials
4. Clear browser cache and cookies
```

### API Calls Failing
```
1. Check backend is running on port 5000
2. Verify CORS configuration
3. Check Network tab for error details
4. Verify authentication token present
```

### Blank Page After Login
```
1. Check browser console for errors
2. Verify API calls successful (Network tab)
3. Clear cache and retry
4. Try different browser
```

## Test Case ID Format

```
TC-[AREA]-[NUMBER]

Examples:
TC-AUTH-001  - Authentication test #1
TC-DASH-101  - Dashboard test #101
TC-APPT-201  - Appointment test #201
TC-RBAC-301  - Role-based access test #301
```

## GitHub Issue Quick Template

```markdown
## Issue Summary
[One-line description]

## Severity: [Critical/High/Medium/Low]
## Priority: [P0/P1/P2/P3]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected: [What should happen]
## Actual: [What happened]

## Environment
- Browser: [Brave/Chrome/Firefox]
- OS: [Windows/macOS/Linux]
- URL: [Page URL]

## Screenshots
[Attach screenshots]

## Console Errors
```
[Paste errors]
```

## Labels
[Manual Test] [Bug] [Component]
```

## Role Permission Matrix

| Feature | Super Admin | Admin | Provider | Staff | Patient |
|---------|-------------|-------|----------|-------|---------|
| Dashboard (All) | ✅ | ❌ | ❌ | ❌ | ❌ |
| Dashboard (Own) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Appointments (All) | ✅ | ✅ | ❌ | ✅ | ❌ |
| Appointments (Own) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Clinical Notes | ✅ | ✅ | ✅ | ❌ | 👁️ |
| User Management | ✅ | ✅ | ❌ | ❌ | ❌ |
| Financial Reports | ✅ | ✅ | ❌ | ❌ | ❌ |
| System Settings | ✅ | ❌ | ❌ | ❌ | ❌ |

**Legend**: ✅ Full Access | 👁️ Read Only | ❌ No Access

## Responsive Testing Breakpoints

```
Mobile:  375px  (iPhone 12 Pro)
Tablet:  768px  (iPad)
Desktop: 1920px (Full HD)
```

### Enable Device Emulation
```
1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device from dropdown
4. Test functionality
```

## Common Portuguese Messages

### Success Messages
```
"Agendamento criado com sucesso"
"Paciente cadastrado com sucesso"
"Dados atualizados com sucesso"
"Operação realizada com sucesso"
```

### Error Messages
```
"Dados inválidos"
"E-mail ou senha inválidos"
"Erro ao processar requisição"
"Acesso negado"
"Não autorizado"
"Sessão expirada"
```

### Validation Messages
```
"Campo obrigatório"
"E-mail inválido"
"Senha deve ter no mínimo 8 caracteres"
"Data inválida"
"Horário indisponível"
```

## Test Data Reset Commands

```bash
# Reset test database (if available)
npm run db:reset:test

# Seed test data
npm run db:seed:test

# Restart backend
npm run dev:backend

# Restart frontend
npm start
```

## Document Navigation

```
00 - Overview & Introduction
01 - Environment Setup
02 - Authentication Tests (18 tests)
03 - Staff Dashboard Tests (20 tests)
04 - Patient Portal Tests (planned)
05 - Appointment Management Tests (23 tests)
06 - Patient Management Tests (planned)
07 - Provider Management Tests (planned)
08 - Role-Based Access Tests (25 tests)
09 - Payment Processing Tests (planned)
10 - Error Handling Tests (planned)
11 - Performance Tests (planned)
12 - Issue Reporting Template
```

## Key Contacts

```
QA Team:          qa@topsmile.com
Development Team: dev@topsmile.com
DevOps Team:      devops@topsmile.com
Project Manager:  pm@topsmile.com
```

## Useful Links

```
GitHub Issues:    [Repository URL]/issues
API Docs:         http://localhost:5000/api-docs
Project README:   /README.md
Architecture:     /docs/architecture/
Guidelines:       /.amazonq/rules/memory-bank/guidelines.md
```

## Testing Best Practices

### DO ✅
- Clear cache before testing
- Keep DevTools open
- Record all results
- Take screenshots of issues
- Copy console errors
- Test in multiple browsers
- Verify fixes thoroughly
- Document everything

### DON'T ❌
- Test in production
- Skip reproduction steps
- Ignore console errors
- Assume issues are obvious
- Report without evidence
- Test without clearing cache
- Close issues without verification
- Report duplicates

## Emergency Procedures

### Critical Bug Found
```
1. Stop testing immediately
2. Document issue thoroughly
3. Create GitHub issue with [CRITICAL] tag
4. Notify team lead via Slack/email
5. Include impact assessment
6. Provide reproduction steps
```

### Environment Down
```
1. Check backend: http://localhost:5000/api-docs
2. Check frontend: http://localhost:3000
3. Restart services if needed
4. Contact DevOps if persists
5. Document downtime
```

### Data Corruption
```
1. Stop testing
2. Document what happened
3. Notify development team
4. Do not attempt to fix manually
5. Request database reset
6. Wait for confirmation before resuming
```

## Test Metrics to Track

```
- Total test cases executed
- Pass rate (%)
- Defects found (by severity)
- Test coverage (%)
- Execution time
- Blocked tests
- Reopen rate
```

## Quick Commands

### Start Environment
```bash
# Terminal 1 - Backend
cd backend
npm run dev:backend

# Terminal 2 - Frontend
npm start
```

### Check Services
```bash
# Check if backend is running
curl http://localhost:5000/api-docs

# Check if frontend is running
curl http://localhost:3000
```

### View Logs
```bash
# Backend logs
cd backend
tail -f logs/app.log

# Frontend logs
# Check browser console
```

## Version Info

```
Document Version: 1.0
Last Updated: 2024-01-15
Maintained By: QA Team
Next Review: 2024-04-15
```

---

**Print this page for quick reference during testing sessions**
