# TopSmile Data Flow Diagrams

**Version:** 1.0.0 | **Date:** 2024-01-15 | **Status:** ✅ Complete

---

## Request/Response Flow

```
Browser → Frontend Service → HTTP Client → Backend API → Middleware → Route → Service → Model → Database
                                                                                                    ↓
Browser ← Frontend Service ← HTTP Client ← Backend API ← Middleware ← Route ← Service ← Model ← Database
```

---

## Authentication Data Flow

### Login Flow
```
1. User enters credentials
2. Frontend → POST /api/auth/login
3. Backend validates credentials
4. Backend generates JWT tokens
5. Backend stores refresh token in DB
6. Backend sets HttpOnly cookies
7. Backend returns user data
8. Frontend stores user in context
9. Frontend redirects to dashboard
```

### Token Refresh Flow
```
1. API request with expired token
2. Backend returns 401
3. Frontend → POST /api/auth/refresh
4. Backend validates refresh token
5. Backend checks Redis blacklist
6. Backend generates new tokens
7. Backend blacklists old refresh token
8. Backend returns new tokens
9. Frontend retries original request
```

---

## Appointment Booking Flow

```
Patient selects service
    ↓
Frontend → GET /api/scheduling/availability
    ↓
Backend queries provider schedules
    ↓
Backend calculates available slots
    ↓
Frontend displays time slots
    ↓
Patient selects time
    ↓
Frontend → POST /api/scheduling/appointments
    ↓
Backend validates availability (with lock)
    ↓
Backend creates appointment (transaction)
    ↓
Backend updates provider schedule
    ↓
Backend emits 'appointment.created' event
    ↓
Event handlers send email/SMS
    ↓
Frontend shows confirmation
```

---

## State Management Flow

### Client State (Zustand)
```
User Action → Component → Store Action → State Update → Component Re-render
```

### Server State (React Query)
```
Component Mount → useQuery Hook → Check Cache → API Call (if stale) → Update Cache → Component Re-render
```

### Combined Flow
```
User clicks "Book Appointment"
    ↓
Component calls mutation
    ↓
React Query → API Service → Backend
    ↓
Backend creates appointment
    ↓
Response returns to React Query
    ↓
React Query invalidates 'appointments' cache
    ↓
React Query refetches appointments
    ↓
Components re-render with new data
```

---

## Cache Invalidation Flow

```
Mutation Success
    ↓
Invalidate related queries
    ↓
React Query marks queries as stale
    ↓
Active queries refetch automatically
    ↓
Inactive queries refetch on next mount
```

**Example:**
```typescript
// Create appointment
useMutation({
  mutationFn: appointmentService.create,
  onSuccess: () => {
    queryClient.invalidateQueries(['appointments']);
    queryClient.invalidateQueries(['provider-availability']);
  }
});
```

---

## Multi-Tenant Data Isolation

```
Request with JWT
    ↓
Extract clinicId from token
    ↓
Add clinicId to all queries
    ↓
Database query: { clinic: clinicId, ...otherFilters }
    ↓
Return only clinic-scoped data
```

---

## Event-Driven Flow

```
Service Action (e.g., appointment created)
    ↓
Emit event: eventBus.emit('appointment.created', data)
    ↓
Multiple handlers listen:
    ├─ Email Service → Send confirmation
    ├─ SMS Service → Send reminder
    ├─ Audit Service → Log action
    └─ Analytics Service → Track metric
```

---

## File Upload Flow

```
User selects file
    ↓
Frontend validates file (size, type)
    ↓
Frontend → POST /api/upload (multipart/form-data)
    ↓
Backend validates file
    ↓
Backend uploads to storage (S3/local)
    ↓
Backend saves file metadata to DB
    ↓
Backend returns file URL
    ↓
Frontend displays uploaded file
```

---

## Payment Processing Flow

```
User initiates payment
    ↓
Frontend → POST /api/payments/create-intent
    ↓
Backend → Stripe API (create payment intent)
    ↓
Stripe returns client secret
    ↓
Frontend displays Stripe payment form
    ↓
User enters payment details
    ↓
Stripe processes payment
    ↓
Stripe → Webhook → Backend
    ↓
Backend verifies webhook signature
    ↓
Backend updates payment status in DB
    ↓
Backend emits 'payment.succeeded' event
    ↓
Email service sends receipt
```

---

## Error Handling Flow

```
Error occurs in component
    ↓
Error Boundary catches error
    ↓
Determine error type:
    ├─ Network Error → Show retry option
    ├─ Auth Error → Redirect to login
    ├─ Validation Error → Show field errors
    └─ Server Error → Show generic message
    ↓
Log error to monitoring service
    ↓
Display user-friendly message
```

---

## Real-Time Update Flow (Future)

```
Backend event occurs
    ↓
Emit to WebSocket server
    ↓
WebSocket broadcasts to connected clients
    ↓
Frontend receives message
    ↓
Update local state/cache
    ↓
Components re-render
```

---

## Improvement Recommendations

### 🟥 Critical
1. **Add Request Correlation IDs** - Track requests across services (4 hours)
2. **Implement Optimistic Updates** - Better UX (2 days)

### 🟧 High Priority
3. **Add WebSocket Support** - Real-time updates (2 weeks)
4. **Implement Request Deduplication** - Prevent duplicate calls (1 day)
5. **Add Offline Support** - Service workers (1 week)

---

**Related:** [07-Authentication-Flows.md](./07-Authentication-Flows.md), [11-Component-Interaction-Details.md](../components/11-Component-Interaction-Details.md)
