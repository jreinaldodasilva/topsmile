# TopSmile Database Schema

**Version:** 1.0.0 | **Date:** 2024-01-15 | **Status:** ✅ Complete

---

## Collections Overview

| Collection | Purpose | Estimated Docs |
|------------|---------|----------------|
| clinics | Multi-tenant clinic data | ~100 |
| users | Staff users | ~500 |
| patients | Patient records | ~10,000 |
| providers | Dentists/specialists | ~200 |
| appointments | Appointment scheduling | ~50,000 |
| medicalHistory | Patient medical records | ~10,000 |
| refreshTokens | Token management | ~1,000 |

---

## Core Schemas

### Clinic
```typescript
{
  _id: ObjectId,
  name: String,
  address: String,
  phone: String,
  email: String,
  isActive: Boolean,
  createdAt: Date
}
// Index: { name: 1 }, { isActive: 1 }
```

### User (Staff)
```typescript
{
  _id: ObjectId,
  clinicId: ObjectId,
  email: String,
  password: String,
  name: String,
  role: String, // 'super_admin', 'admin', 'provider', 'staff'
  isActive: Boolean
}
// Index: { email: 1 } unique, { clinicId: 1, role: 1 }
```

### Patient
```typescript
{
  _id: ObjectId,
  clinicId: ObjectId,
  email: String,
  password: String,
  name: String,
  phone: String,
  dateOfBirth: Date,
  isActive: Boolean
}
// Index: { email: 1 } unique, { clinicId: 1, isActive: 1 }
```

### Appointment
```typescript
{
  _id: ObjectId,
  clinicId: ObjectId,
  patientId: ObjectId,
  providerId: ObjectId,
  scheduledStart: Date,
  scheduledEnd: Date,
  duration: Number,
  status: String, // 'scheduled', 'confirmed', 'completed', 'cancelled'
  notes: String
}
// Index: { clinicId: 1, scheduledStart: 1, status: 1 }
// Index: { providerId: 1, scheduledStart: 1 }
// Index: { patientId: 1, scheduledStart: -1 }
```

---

## Relationships

```
Clinic (1) → (N) Users, Patients, Providers, Appointments
Patient (1) → (N) Appointments
Provider (1) → (N) Appointments
```

---

## Indexing Strategy

### Critical Indexes
```javascript
// Appointments - most queried
db.appointments.createIndex({ clinic: 1, scheduledStart: 1, status: 1 });
db.appointments.createIndex({ provider: 1, scheduledStart: 1 });

// Authentication
db.users.createIndex({ email: 1 }, { unique: true });
db.patients.createIndex({ email: 1 }, { unique: true });
```

---

## Improvement Recommendations

### 🟥 Critical
1. **Add Partial Indexes** - Active records only (4 hours)
2. **Implement Sharding** - Scalability (1 week)

### 🟧 High Priority
3. **Add TTL Indexes** - Token cleanup (2 hours)
4. **Read Replicas** - Read scaling (3 days)

---

**Related:** [01-System-Architecture-Overview.md](./01-System-Architecture-Overview.md)
