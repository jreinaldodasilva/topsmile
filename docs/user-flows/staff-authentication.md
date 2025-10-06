# Staff Authentication Flow

## Login → Dashboard → Logout

### 1. Login
```
/login
  ↓
Enter email + password
  ↓
[Submit] → POST /api/auth/login
  ↓
Success: httpOnly cookie set
  ↓
Redirect based on role:
  • Admin/Manager → /admin
  • Dentist → /admin/appointments
  • Assistant → /admin/appointments
```

### 2. Dashboard Access
```
/admin
  ↓
GET /api/auth/me (auto with cookie)
  ↓
Load user data
  ↓
Show dashboard:
  • Appointments today
  • Patient list
  • Quick actions
```

### 3. Session Management
```
User inactive 28 min
  ↓
Show warning modal
  ↓
User clicks "Continue" → Reset timer
  OR
User inactive 2 more min → Auto logout
```

### 4. Logout
```
Click "Sair"
  ↓
POST /api/auth/logout
  ↓
Clear cookies + blacklist token
  ↓
Redirect to /login
```

## Error Scenarios

**Invalid Credentials:**
- Show error message
- Allow retry

**Token Expired:**
- Auto refresh attempt
- If fails → logout

**Network Error:**
- Show error message
- Retry button
