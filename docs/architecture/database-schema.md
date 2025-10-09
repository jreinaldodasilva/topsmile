# Database Schema

## Collections Overview

### users
```
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (super_admin|admin|manager|dentist|assistant),
  clinic: ObjectId → clinics,
  isActive: Boolean,
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- { email: 1 } unique
- { clinic: 1, role: 1 }
```

### patients
```
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  phone: String (required),
  dateOfBirth: Date,
  cpf: String,
  clinic: ObjectId → clinics,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  medicalHistory: {
    allergies: [String],
    medications: [String],
    conditions: [String]
  },
  status: String (active|inactive),
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- { email: 1, clinic: 1 }
- { cpf: 1 } unique, sparse
- { clinic: 1, status: 1 }
```

### appointments
```
{
  _id: ObjectId,
  patient: ObjectId → patients,
  provider: ObjectId → providers,
  clinic: ObjectId → clinics,
  appointmentType: ObjectId → appointmentTypes,
  scheduledStart: Date,
  scheduledEnd: Date,
  status: String (scheduled|confirmed|completed|cancelled),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- { clinic: 1, scheduledStart: 1 }
- { patient: 1, scheduledStart: -1 }
- { provider: 1, scheduledStart: 1 }
```

### providers
```
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  specialties: [String],
  clinic: ObjectId → clinics,
  workingHours: {
    monday: { start: String, end: String, isWorking: Boolean },
    // ... other days
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}

Indexes:
- { clinic: 1, isActive: 1 }
```

### refreshTokens
```
{
  _id: ObjectId,
  token: String (unique),
  userId: ObjectId → users,
  expiresAt: Date,
  isRevoked: Boolean,
  deviceInfo: {
    userAgent: String,
    ipAddress: String
  },
  createdAt: Date
}

Indexes:
- { token: 1 } unique
- { userId: 1, isRevoked: 1 }
- { expiresAt: 1 } (TTL index)
```

---

**Version:** 1.0  
**Date:** January 2025
