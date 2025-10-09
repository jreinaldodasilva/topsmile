# TopSmile Backend Architecture

**Document Version:** 1.0.0  
**Last Updated:** 2024-01-15  
**Status:** ✅ Complete

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Layered Architecture](#layered-architecture)
4. [Middleware Pipeline](#middleware-pipeline)
5. [Service Layer Patterns](#service-layer-patterns)
6. [Database Layer](#database-layer)
7. [Event-Driven Architecture](#event-driven-architecture)
8. [Improvement Recommendations](#improvement-recommendations)

---

## Overview

The TopSmile backend is an Express.js application built with TypeScript, implementing a layered architecture with clear separation between routes, services, and data access.

**Architecture Pattern:** Layered + Event-Driven  
**API Style:** RESTful with versioning support  
**Database:** MongoDB with Mongoose ODM  
**Cache:** Redis for sessions and caching

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | ≥18.0.0 | Runtime |
| Express | 4.21.2 | Web framework |
| TypeScript | 5.9.2 | Type safety |
| Mongoose | 8.18.0 | MongoDB ODM |
| Redis | 5.7.0 | Caching & sessions |
| JWT | 9.0.2 | Authentication |
| Bcrypt | 6.0.0 | Password hashing |

---

## Layered Architecture

```
Routes Layer → Middleware → Service Layer → Data Layer
```

### Routes Layer

```typescript
router.post('/', authenticate, authorize('admin'), createValidation, async (req, res) => {
  const result = await appointmentService.createAppointment(req.body);
  return res.status(201).json({ success: true, data: result });
});
```

### Service Layer

```typescript
class AppointmentService {
  async createAppointment(data: CreateAppointmentDto): Promise<Result<Appointment>> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const appointment = await Appointment.create([data], { session });
      await session.commitTransaction();
      return { success: true, data: appointment[0] };
    } catch (error) {
      await session.abortTransaction();
      return { success: false, error: error.message };
    } finally {
      session.endSession();
    }
  }
}
```

---

## Middleware Pipeline

```
Request → Helmet → CORS → Rate Limiter → Body Parser → Sanitization → CSRF → Auth → Authorization → Validation → Route Handler → Response
```

### Authentication Middleware

```typescript
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.topsmile_access_token;
  if (!token) return res.status(401).json({ success: false, message: 'Não autorizado' });
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  (req as AuthenticatedRequest).user = decoded;
  next();
};
```

---

## Service Layer Patterns

### Result Pattern

```typescript
interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Transaction Pattern

```typescript
const session = await mongoose.startSession();
session.startTransaction();
try {
  // operations
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
} finally {
  session.endSession();
}
```

---

## Database Layer

### Model Definition

```typescript
const AppointmentSchema = new Schema({
  clinic: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true },
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  scheduledStart: { type: Date, required: true },
  status: { type: String, enum: ['scheduled', 'confirmed', 'completed'], default: 'scheduled' }
});

AppointmentSchema.index({ clinic: 1, scheduledStart: 1, status: 1 });
```

---

## Event-Driven Architecture

```typescript
eventBus.emit('appointment.created', { appointmentId, patientId });
eventBus.on('appointment.created', async (data) => {
  await emailService.sendConfirmation(data);
});
```

---

## Improvement Recommendations

### 🟥 Critical
1. **Implement Request Context** - Correlation IDs (1 day)
2. **Add Circuit Breaker** - For external services (2 days)

### 🟧 High Priority
3. **Implement CQRS** - Separate read/write (2 weeks)
4. **Add API Gateway** - Centralized routing (1 week)

---

## Related Documents

- [01-System-Architecture-Overview.md](./01-System-Architecture-Overview.md)
- [02-Frontend-Architecture.md](./02-Frontend-Architecture.md)

---

**Version:** 1.0.0 | **Date:** 2024-01-15
