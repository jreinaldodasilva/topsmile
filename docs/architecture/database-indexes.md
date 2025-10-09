# Database Indexes Documentation

## Overview

Database indexes have been added to optimize query performance for common operations.

## Indexes by Collection

### users
```javascript
{ email: 1 } // unique
{ clinic: 1, role: 1 }
{ clinic: 1, isActive: 1 }
```

### patients
```javascript
{ clinic: 1, status: 1, lastName: 1, firstName: 1 }
{ clinic: 1, phone: 1 }
{ clinic: 1, email: 1 }
{ clinic: 1, cpf: 1 } // sparse
{ firstName: 'text', lastName: 'text', email: 'text', phone: 'text' } // text search
{ clinic: 1, dateOfBirth: 1 } // sparse
```

### appointments
```javascript
{ clinic: 1, scheduledStart: 1, status: 1 }
{ provider: 1, scheduledStart: 1, scheduledEnd: 1, status: 1 }
{ provider: 1, scheduledStart: 1, scheduledEnd: 1 } // unique, partial (prevent double-booking)
{ patient: 1, scheduledStart: -1, status: 1 }
{ clinic: 1, provider: 1, scheduledStart: 1 }
{ status: 1, scheduledStart: 1, clinic: 1 }
{ clinic: 1, operatory: 1, scheduledStart: 1, scheduledEnd: 1, status: 1 }
{ followUpRequired: 1, followUpDate: 1, status: 1 }
{ clinic: 1, billingStatus: 1, completedAt: 1 }
```

### providers
```javascript
{ clinic: 1, isActive: 1 }
{ clinic: 1, specialties: 1 }
{ email: 1 } // sparse
```

### refreshTokens
```javascript
{ token: 1 } // unique
{ userId: 1 }
{ expiresAt: 1 } // TTL index
{ userId: 1, isRevoked: 1 }
```

## Index Strategy

- **Compound indexes** for multi-field queries
- **Sparse indexes** for optional fields
- **Text indexes** for search functionality
- **TTL indexes** for automatic cleanup
- **Unique indexes** for data integrity
- **Background creation** to avoid blocking

## Performance Impact

Indexes improve query performance but:
- Increase write operation time
- Consume disk space
- Require maintenance

Monitor index usage with:
```javascript
db.collection.getIndexes()
db.collection.stats()
```

---

**Version:** 1.0  
**Date:** January 2025
