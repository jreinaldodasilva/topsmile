# Authentication Flow Diagrams

## Staff Login Sequence

```
┌──────┐    ┌──────────┐    ┌─────────┐    ┌──────────┐
│ User │    │ Frontend │    │ Backend │    │ Database │
└──┬───┘    └────┬─────┘    └────┬────┘    └────┬─────┘
   │             │               │              │
   │ Enter email/password        │              │
   ├────────────>│               │              │
   │             │ POST /api/auth/login         │
   │             ├──────────────>│              │
   │             │               │ Find user    │
   │             │               ├─────────────>│
   │             │               │<─────────────┤
   │             │               │ Verify pwd   │
   │             │               │ Generate JWT │
   │             │<──────────────┤              │
   │ Set cookies & redirect      │              │
   │<────────────┤               │              │
```

## Token Refresh Flow

```
┌──────────┐    ┌─────────┐
│ Frontend │    │ Backend │
└────┬─────┘    └────┬────┘
     │               │
     │ API Request (401)
     ├──────────────>│
     │<──────────────┤
     │ POST /api/auth/refresh
     ├──────────────>│
     │               │ Verify refresh token
     │               │ Generate new tokens
     │<──────────────┤
     │ Retry original request
     ├──────────────>│
     │<──────────────┤
```

## Logout Flow

```
┌──────┐    ┌──────────┐    ┌─────────┐
│ User │    │ Frontend │    │ Backend │
└──┬───┘    └────┬─────┘    └────┬────┘
   │             │               │
   │ Click Logout│               │
   ├────────────>│               │
   │             │ POST /api/auth/logout
   │             ├──────────────>│
   │             │               │ Revoke refresh token
   │             │               │ Blacklist access token
   │             │<──────────────┤
   │ Clear state & redirect      │
   │<────────────┤               │
```

---

**Version:** 1.0  
**Date:** January 2025
