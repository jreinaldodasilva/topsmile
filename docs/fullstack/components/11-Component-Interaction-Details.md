# TopSmile Component Interaction Details

**Version:** 1.0.0 | **Date:** 2024-01-15 | **Status:** ✅ Complete

---

## Frontend Component Communication

### Parent-Child Communication

**Props Down:**
```typescript
// Parent
<AppointmentCard 
  appointment={appointment}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>

// Child
interface AppointmentCardProps {
  appointment: Appointment;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
```

**Events Up:**
```typescript
// Child emits event
const handleClick = () => {
  onEdit(appointment.id);
};

// Parent handles event
const handleEdit = (id: string) => {
  navigate(`/appointments/${id}/edit`);
};
```

---

### Context-Based Communication

**Auth Context:**
```typescript
// Provider
<AuthContext.Provider value={{ user, login, logout }}>
  {children}
</AuthContext.Provider>

// Consumer
const { user, logout } = useAuth();
```

**Error Context:**
```typescript
// Provider
<ErrorContext.Provider value={{ error, setError, clearError }}>
  {children}
</ErrorContext.Provider>

// Consumer
const { setError } = useError();
setError('Erro ao carregar dados');
```

---

### State Management Communication

**Zustand Store:**
```typescript
// Store
const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null })
}));

// Component A
const { setUser } = useAuthStore();
setUser(userData);

// Component B (automatically updates)
const { user } = useAuthStore();
```

**React Query:**
```typescript
// Component A - Mutation
const { mutate } = useMutation({
  mutationFn: appointmentService.create,
  onSuccess: () => {
    queryClient.invalidateQueries(['appointments']);
  }
});

// Component B - Query (automatically refetches)
const { data } = useQuery({
  queryKey: ['appointments'],
  queryFn: appointmentService.getAll
});
```

---

## Backend Service Interactions

### Route → Service

```typescript
// Route
router.post('/', authenticate, async (req, res) => {
  const result = await appointmentService.createAppointment(req.body);
  return res.json(result);
});

// Service
class AppointmentService {
  async createAppointment(data: CreateAppointmentDto) {
    // Business logic
    return await Appointment.create(data);
  }
}
```

---

### Service → Service

```typescript
// AppointmentService uses NotificationService
class AppointmentService {
  constructor(
    private notificationService: NotificationService,
    private availabilityService: AvailabilityService
  ) {}

  async createAppointment(data: CreateAppointmentDto) {
    // Check availability
    const isAvailable = await this.availabilityService.checkSlot(data);
    if (!isAvailable) throw new Error('Horário indisponível');

    // Create appointment
    const appointment = await Appointment.create(data);

    // Send notification
    await this.notificationService.sendConfirmation(appointment);

    return appointment;
  }
}
```

---

### Service → Model

```typescript
// Service
class PatientService {
  async getPatient(id: string) {
    return await Patient.findById(id)
      .populate('clinic')
      .populate('medicalHistory')
      .lean();
  }

  async updatePatient(id: string, data: UpdatePatientDto) {
    return await Patient.findByIdAndUpdate(id, data, { new: true });
  }
}
```

---

## Event-Driven Communication

### Event Emission

```typescript
// Service emits event
class AppointmentService {
  async createAppointment(data: CreateAppointmentDto) {
    const appointment = await Appointment.create(data);
    
    eventBus.emit('appointment.created', {
      appointmentId: appointment._id,
      patientId: appointment.patient,
      providerId: appointment.provider
    });
    
    return appointment;
  }
}
```

### Event Handling

```typescript
// Multiple services listen
eventBus.on('appointment.created', async (data) => {
  await emailService.sendConfirmation(data);
});

eventBus.on('appointment.created', async (data) => {
  await smsService.sendReminder(data);
});

eventBus.on('appointment.created', async (data) => {
  await auditService.logCreation(data);
});
```

---

## API Communication Patterns

### Request Interceptor

```typescript
// Add auth token
httpClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

```typescript
// Handle 401 errors
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await authService.refreshToken();
      return httpClient.request(error.config);
    }
    throw error;
  }
);
```

---

## Database Interaction Patterns

### Query Optimization

```typescript
// Use lean() for read-only
const appointments = await Appointment.find({ clinic: clinicId })
  .select('patient provider scheduledStart status')
  .lean()
  .exec();

// Use populate for relations
const appointment = await Appointment.findById(id)
  .populate('patient', 'name email phone')
  .populate('provider', 'name specialty')
  .exec();
```

### Transaction Handling

```typescript
const session = await mongoose.startSession();
session.startTransaction();

try {
  await Appointment.create([data], { session });
  await Provider.updateOne({ _id: providerId }, update, { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

---

## Caching Patterns

### React Query Cache

```typescript
// Prefetch data
queryClient.prefetchQuery({
  queryKey: ['appointments', date],
  queryFn: () => appointmentService.getByDate(date)
});

// Optimistic update
queryClient.setQueryData(['appointments'], (old) => [...old, newAppointment]);
```

### Redis Cache

```typescript
// Cache frequently accessed data
const cacheKey = `provider:${providerId}:availability`;
const cached = await redisClient.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const data = await this.calculateAvailability(providerId);
await redisClient.setex(cacheKey, 3600, JSON.stringify(data));
return data;
```

---

## Error Propagation

### Frontend Error Handling

```typescript
// Component
try {
  await appointmentService.create(data);
} catch (error) {
  if (error instanceof ValidationError) {
    setFieldErrors(error.fields);
  } else if (error instanceof NetworkError) {
    showRetryDialog();
  } else {
    showGenericError();
  }
}
```

### Backend Error Handling

```typescript
// Service
async createAppointment(data: CreateAppointmentDto): Promise<Result<Appointment>> {
  try {
    const appointment = await Appointment.create(data);
    return { success: true, data: appointment };
  } catch (error) {
    if (error.code === 11000) {
      return { success: false, error: 'Agendamento duplicado' };
    }
    return { success: false, error: error.message };
  }
}
```

---

## Improvement Recommendations

### 🟥 Critical

1. **Implement Request Deduplication** - Prevent duplicate API calls (1 day)
2. **Add Circuit Breaker** - For external services (2 days)

### 🟧 High Priority

3. **Implement WebSocket** - Real-time updates (2 weeks)
4. **Add Request Queuing** - Handle offline scenarios (1 week)
5. **Implement Retry Logic** - With exponential backoff (2 days)

### 🟨 Medium Priority

6. **Add Request Caching** - Reduce API calls (3 days)
7. **Implement Batch Requests** - Combine multiple requests (1 week)

---

**Related:** [02-Frontend-Architecture.md](../architecture/02-Frontend-Architecture.md), [03-Backend-Architecture.md](../architecture/03-Backend-Architecture.md)
