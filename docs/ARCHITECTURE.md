# TopSmile System Architecture

## 1. Executive Summary

TopSmile is a comprehensive dental clinic management platform built with React, Node.js, TypeScript, and MongoDB. The system provides end-to-end solutions for patient management, appointment scheduling, clinical documentation, and payment processing.

**Implementation Status**: 67% Complete (16 of 24 weeks)
- ✅ Phase 1: Foundation (Weeks 1-4)
- ✅ Phase 2: Clinical Features (Weeks 5-10)
- ✅ Phase 3: Enhanced Scheduling (Weeks 11-14)
- ✅ Phase 4: Patient Portal (Weeks 15-16)
- ⏳ Phase 5: Payments & Billing (Weeks 17-20)
- ⏳ Phase 6: Reporting & Analytics (Weeks 21-24)

**Key Metrics**:
- 11 database models with 50+ optimized indexes
- 8 user roles with 11 permission types
- 40+ React components
- 20+ API endpoints
- Multi-tenancy architecture with clinic scoping

---

## 2. System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │    Mobile    │  │   Tablet     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend Layer (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Components  │  │    Stores    │  │   Services   │          │
│  │  (40+ UI)    │  │   (Zustand)  │  │  (API Layer) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTPS/REST
┌─────────────────────────────────────────────────────────────────┐
│                    Backend Layer (Express)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Routes    │→ │  Middleware  │→ │   Services   │          │
│  │  (20+ APIs)  │  │  (Auth/RBAC) │  │ (Bus. Logic) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Data Layer                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   MongoDB    │  │    Redis     │  │   BullMQ     │          │
│  │ (11 Models)  │  │  (Sessions)  │  │   (Jobs)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   External Services                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Stripe    │  │    Twilio    │  │  Nodemailer  │          │
│  │  (Payments)  │  │    (SMS)     │  │   (Email)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend**:
- React 18.2.0 with TypeScript 4.9.5+
- TanStack Query 5.89.0 (server state)
- Zustand (global state)
- React Router DOM 6.30.1
- Framer Motion 10.16.5 (animations)
- Stripe React components

**Backend**:
- Node.js >=18.0.0
- Express 4.21.2 with TypeScript 5.9.2
- MongoDB 8.18.0 (Mongoose ODM)
- Redis 5.8.2 (caching/sessions)
- JWT authentication
- BullMQ 5.58.2 (job queues)

**External Services**:
- Stripe (payment processing)
- Twilio (SMS notifications)
- Nodemailer (email)

**Testing**:
- Jest (unit/integration)
- Cypress (E2E)
- Testing Library (React)
- Supertest (API)

---

## 3. Multi-Tenancy Architecture

### Clinic Scoping Strategy

Every entity in the system is scoped to a clinic for complete data isolation.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Multi-Tenancy Flow                            │
└─────────────────────────────────────────────────────────────────┘

User Login → JWT Generated
                  ↓
            { userId, clinicId, role, permissions }
                  ↓
         Stored in JWT payload
                  ↓
    Every Request → authenticate middleware
                  ↓
         Extract clinicId from JWT
                  ↓
         Inject into req.user.clinicId
                  ↓
         Service Layer receives clinicId
                  ↓
    ALL queries filter by: { clinic: clinicId, ...filters }
                  ↓
         Data isolation guaranteed
```

### Query Pattern

```typescript
// EVERY database query MUST include clinic scoping
const appointments = await Appointment.find({
  clinic: req.user!.clinicId,  // From JWT
  date: { $gte: startDate },
  status: 'scheduled'
}).lean();

// Compound indexes always start with clinic
Schema.index({ clinic: 1, date: -1, status: 1 });
```

### Data Isolation Guarantees

1. **JWT Level**: clinicId embedded in token
2. **Middleware Level**: Extracted and validated
3. **Service Level**: Passed to all operations
4. **Model Level**: Enforced in queries
5. **Index Level**: Optimized for clinic-first queries

---

## 4. Database Architecture

### Core Models (11 Total)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Entity Relationships                          │
└─────────────────────────────────────────────────────────────────┘

                        ┌──────────────┐
                        │    Clinic    │
                        └──────┬───────┘
                               │ (1:N)
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
         ┌──────────┐   ┌──────────┐   ┌──────────┐
         │   User   │   │ Provider │   │ Patient  │
         └──────────┘   └─────┬────┘   └────┬─────┘
                               │             │
                               │ (1:N)       │ (1:N)
                               ▼             ▼
                        ┌──────────────────────┐
                        │    Appointment       │
                        └──────────┬───────────┘
                                   │ (1:1)
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
            ┌──────────┐   ┌──────────┐   ┌──────────┐
            │  Chart   │   │Treatment │   │Clinical  │
            │          │   │   Plan   │   │   Note   │
            └──────────┘   └──────────┘   └──────────┘

         ┌──────────┐   ┌──────────┐   ┌──────────┐
         │Insurance │   │ Payment  │   │ Session  │
         └──────────┘   └──────────┘   └──────────┘

                        ┌──────────┐
                        │AuditLog  │
                        └──────────┘
```

### Schema Patterns

**Base Schema Fields** (all models):
```typescript
{
  clinic: { type: ObjectId, ref: 'Clinic', required: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null }  // Soft delete
}
```

**Validation Rules**:
- User-facing messages: Portuguese
- Code/comments: English
- Brazilian-specific validators: CPF, phone, ZIP code

### Indexing Strategy (50+ Indexes)

```typescript
// Compound indexes for common queries
// Pattern: clinic ALWAYS first
Schema.index({ clinic: 1, status: 1, date: -1 }, { 
  name: 'clinic_status_date',
  background: true 
});

// Unique indexes with clinic scope
Schema.index({ clinic: 1, email: 1 }, { 
  unique: true,
  sparse: true,
  name: 'clinic_email_unique'
});

// Text search indexes
Schema.index({ 
  firstName: 'text',
  lastName: 'text',
  email: 'text'
}, { 
  name: 'patient_search'
});
```

---

## 5. Authentication & Authorization

### JWT Structure

```typescript
// Access Token (15 minutes)
{
  userId: string,
  clinicId: string,      // Multi-tenancy key
  role: string,          // One of 8 roles
  permissions: string[], // Subset of 11 permissions
  sessionId: string,     // For session tracking
  iat: number,
  exp: number
}

// Refresh Token (7 days)
{
  userId: string,
  sessionId: string,
  deviceInfo: {
    userAgent: string,
    ip: string,
    device: string
  },
  iat: number,
  exp: number
}
```

### Login Flow (Staff)

```
User → POST /api/auth/login { email, password }
           ↓
    Validate credentials (bcrypt.compare)
           ↓
    Check if MFA enabled?
           ↓
    ┌──────┴──────┐
    │ MFA Enabled │ MFA Disabled
    ↓             ↓
Send OTP via SMS  Generate tokens
(Twilio)          ↓
    ↓             Store session in Redis
POST /api/auth/verify-mfa { code }
    ↓             ↓
Validate OTP      Return { accessToken, refreshToken }
(otplib)          ↓
    ↓             Frontend stores in localStorage
Generate tokens   ↓
    ↓             All requests include: Authorization: Bearer <token>
Store session
    ↓
Return tokens
```

### MFA Setup Flow

```
User → Enable MFA in settings
           ↓
    Generate secret (otplib)
           ↓
    Generate QR code (qrcode library)
           ↓
    Display QR to user
           ↓
    User scans with authenticator app
           ↓
    User enters verification code
           ↓
    Validate code
           ↓
    Store secret encrypted in User model
           ↓
    MFA enabled
```

### Role-Based Access Control (RBAC)

**8 Roles** (hierarchical):
1. Admin (full access)
2. Manager (clinic management)
3. Dentist (clinical + scheduling)
4. Hygienist (clinical + limited scheduling)
5. Assistant (support tasks)
6. Receptionist (scheduling + patient registration)
7. Patient (portal access)
8. Guest (limited booking)

**11 Permission Types**:
- `patients:read`, `patients:write`
- `appointments:read`, `appointments:write`
- `clinical:read`, `clinical:write`
- `payments:read`, `payments:write`
- `reports:read`
- `settings:write`
- `users:manage`

### Authorization Middleware Chain

```typescript
// Route definition
router.post('/api/appointments',
  authenticate,                    // Verify JWT
  authorize('admin', 'dentist'),   // Check role
  validateRequest,                 // Validate input
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const clinicId = authReq.user!.clinicId;
    
    // Service receives clinicId for scoping
    const result = await appointmentService.create(clinicId, data);
    
    return res.json({ success: true, data: result });
  }
);
```

### Session Management

```typescript
// Redis storage structure
session:{sessionId} = {
  userId: string,
  clinicId: string,
  role: string,
  deviceInfo: {
    userAgent: string,
    ip: string,
    device: string,  // Parsed by ua-parser-js
    browser: string,
    os: string
  },
  createdAt: Date,
  lastActivity: Date,
  expiresAt: Date
}

// TTL: 7 days (matches refresh token)
```

**Session Features**:
- Device tracking (ua-parser-js)
- Concurrent session limits
- Force logout capability
- Session expiry on password change
- Activity tracking

### Password Policies

```typescript
{
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventReuse: 5,        // Last 5 passwords
  expiryDays: 90,
  maxAttempts: 5,
  lockoutDuration: 30     // minutes
}
```

---

## 6. Critical User Flows

### 6.1 Online Appointment Booking (Patient)

```
Landing Page → "Agendar Consulta"
    ↓
Select Service Type
    ↓
Select Provider (or "Qualquer Disponível")
    ↓
GET /api/booking/availability?providerId=X&date=Y
    ↓
Display Calendar (real-time availability)
    ↓
User selects Date/Time
    ↓
Guest Checkout OR Patient Login
    ↓
If Guest: Fill patient info form
    ↓
POST /api/booking/appointments
    ↓
Backend validates:
  - Provider availability
  - Operatory availability
  - No conflicts
    ↓
If deposit required:
  → Stripe payment flow
    ↓
Create appointment (status: confirmed)
    ↓
Send confirmation email (BullMQ job)
Send SMS reminder (Twilio)
    ↓
Display confirmation page
```

### 6.2 Clinical Workflow (Dentist)

```
Dashboard → Today's Appointments
    ↓
Select Patient
    ↓
GET /api/patients/:id/medical-history
    ↓
Display Medical History
  - Allergies (highlighted in red)
  - Medications
  - Conditions
    ↓
Open Dental Chart
GET /api/charts/:patientId/latest
    ↓
Interactive tooth diagram displayed
    ↓
Dentist annotates teeth:
  - Click tooth → Select condition/procedure
  - Add notes
  - Mark surfaces affected
    ↓
POST /api/charts (creates new version)
    ↓
Create/Update Treatment Plan
    ↓
Add CDT codes + phases
POST /api/treatment-plans
    ↓
Write SOAP Note
  - Subjective
  - Objective
  - Assessment
  - Plan
POST /api/clinical-notes
    ↓
Generate Prescription (if needed)
POST /api/prescriptions
    ↓
Mark Appointment Complete
PATCH /api/appointments/:id { status: 'completed' }
```

### 6.3 Payment Processing Flow

```
Service Completed → Generate Invoice
    ↓
POST /api/payments/create-intent
    ↓
Backend → Stripe API
  stripe.paymentIntents.create({
    amount,
    currency: 'brl',
    metadata: { appointmentId, patientId, clinicId }
  })
    ↓
Return client_secret to frontend
    ↓
Frontend displays Stripe Elements
    ↓
User enters card details
    ↓
Stripe processes payment
    ↓
Webhook → POST /api/webhooks/stripe
    ↓
Verify webhook signature
    ↓
Handle event:
  - payment_intent.succeeded
  - payment_intent.failed
  - charge.refunded
    ↓
Update Payment model
Update Appointment status
    ↓
Queue confirmation email (BullMQ)
    ↓
Return receipt to user
```

### 6.4 Role-Based Dashboard Access

```
User Login → Authenticate → Extract role from JWT
                                    ↓
        ┌───────────────────────────┼───────────────────────────┐
        ▼                           ▼                           ▼
  Admin Dashboard          Dentist Dashboard           Patient Portal
  /dashboard/admin         /dashboard/dentist          /portal
        │                           │                           │
        ├─ User Management          ├─ Today's Schedule         ├─ My Appointments
        ├─ Clinic Settings          ├─ Patient List            ├─ Medical History
        ├─ Reports                  ├─ Clinical Charts         ├─ Documents
        ├─ Audit Logs               ├─ Treatment Plans         ├─ Insurance Info
        └─ Billing                  └─ Performance Metrics     └─ Family Accounts
```


---

## 7. Integration Architecture

### 7.1 Stripe Payment Integration

**Configuration**:
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true
});
```

**Payment Intent Flow**:
```
Frontend → POST /api/payments/create-intent
              ↓
    Backend creates payment intent
              ↓
    stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'brl',
      metadata: {
        appointmentId,
        patientId,
        clinicId
      }
    })
              ↓
    Return { clientSecret }
              ↓
    Frontend loads Stripe Elements
              ↓
    User completes payment
              ↓
    Stripe webhook fires
              ↓
    POST /webhooks/stripe
              ↓
    Verify signature
              ↓
    Update database
              ↓
    Send confirmation
```

**Webhook Events Handled**:
- `payment_intent.succeeded` → Update payment status, send receipt
- `payment_intent.payment_failed` → Notify user, retry logic
- `charge.refunded` → Update records, notify accounting
- `customer.subscription.updated` → Update subscription status

**Error Handling**:
```typescript
try {
  const paymentIntent = await stripe.paymentIntents.create(params);
} catch (error) {
  if (error.type === 'StripeCardError') {
    // Card declined
  } else if (error.type === 'StripeInvalidRequestError') {
    // Invalid parameters
  } else {
    // Other errors
  }
}
```

### 7.2 Twilio SMS Integration

**Configuration**:
```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
```

**Use Cases**:
1. **MFA Verification**: Send OTP codes
2. **Appointment Reminders**: 24h before appointment
3. **Appointment Confirmations**: Immediate after booking
4. **Waitlist Notifications**: When slot becomes available

**SMS Flow**:
```
Service Layer → Queue SMS job (BullMQ)
                      ↓
              Worker picks up job
                      ↓
        client.messages.create({
          body: message,
          from: process.env.TWILIO_PHONE,
          to: patientPhone
        })
                      ↓
              Log delivery status
                      ↓
        Retry on failure (3 attempts)
```

**Rate Limiting**:
- Max 10 SMS per patient per day
- Max 100 SMS per clinic per hour
- Exponential backoff on failures

### 7.3 Nodemailer Email Integration

**Configuration**:
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

**Email Templates**:
- Appointment confirmation
- Appointment reminder
- Password reset
- Payment receipt
- Treatment plan summary
- Clinical notes (patient copy)

**Email Flow**:
```
Service Layer → Queue email job (BullMQ)
                      ↓
              Worker picks up job
                      ↓
        Load template (Handlebars)
                      ↓
        Inject data (patient, appointment, etc.)
                      ↓
        transporter.sendMail({
          from: clinic.email,
          to: patient.email,
          subject,
          html: renderedTemplate
        })
                      ↓
              Log delivery
                      ↓
        Retry on failure (3 attempts)
```

### 7.4 BullMQ Background Jobs

**Queue Configuration**:
```typescript
import { Queue, Worker } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null
});

const emailQueue = new Queue('emails', { connection });
const smsQueue = new Queue('sms', { connection });
const notificationQueue = new Queue('notifications', { connection });
```

**Job Types**:
1. **Email Jobs**: Confirmations, reminders, receipts
2. **SMS Jobs**: OTP, reminders, notifications
3. **Report Jobs**: Generate daily/weekly reports
4. **Cleanup Jobs**: Archive old data, clear cache
5. **Reminder Jobs**: Scheduled appointment reminders

**Worker Pattern**:
```typescript
const emailWorker = new Worker('emails', async (job) => {
  const { to, subject, template, data } = job.data;
  
  try {
    await sendEmail(to, subject, template, data);
    return { success: true };
  } catch (error) {
    throw error; // Will trigger retry
  }
}, {
  connection,
  concurrency: 5,
  limiter: {
    max: 100,
    duration: 60000 // 100 jobs per minute
  }
});
```

**Retry Strategy**:
```typescript
{
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000 // 1s, 2s, 4s
  }
}
```

---

## 8. API Architecture

### Standard Response Format

**Success Response**:
```typescript
{
  success: true,
  data: <result>,
  meta: {
    timestamp: "2024-01-15T10:30:00.000Z",
    requestId: "uuid-v4"
  }
}
```

**Error Response**:
```typescript
{
  success: false,
  error: "Mensagem de erro em português",
  message?: "Additional context",
  errors?: [
    {
      field: "email",
      message: "E-mail inválido"
    }
  ]
}
```

**Paginated Response**:
```typescript
{
  success: true,
  data: {
    items: [...],
    pagination: {
      page: 1,
      limit: 20,
      total: 150,
      pages: 8,
      hasNext: true,
      hasPrev: false
    }
  },
  meta: { ... }
}
```

### Route Structure Pattern

```typescript
router.METHOD('/path',
  authenticate,                    // Verify JWT
  authorize('role1', 'role2'),    // Check role
  validationMiddleware,            // Validate request
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
      // Extract clinicId from JWT
      const clinicId = authReq.user!.clinicId;
      
      // Call service layer
      const result = await service.method(clinicId, params);
      
      return res.status(200).json({
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (authReq as any).requestId
        }
      });
    } catch (err: any) {
      console.error('Error context:', err);
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
  }
);
```

### Validation Middleware

```typescript
import { body, validationResult } from 'express-validator';

// Validation rules
const createAppointmentValidation = [
  body('patientId')
    .isMongoId()
    .withMessage('ID do paciente inválido'),
  
  body('providerId')
    .isMongoId()
    .withMessage('ID do profissional inválido'),
  
  body('date')
    .isISO8601()
    .withMessage('Data inválida'),
  
  body('phone')
    .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/)
    .withMessage('Telefone deve estar no formato (XX) XXXXX-XXXX')
];

// Check validation in route
const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({
    success: false,
    message: 'Dados inválidos',
    errors: errors.array()
  });
}
```

### Brazilian-Specific Validators

```typescript
// CPF Validator
const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Checksum validation
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

// Phone Validator
const validateBrazilianPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  const isMobile = cleanPhone.length === 11;
  const isLandline = cleanPhone.length === 10;
  if (!(isMobile || isLandline)) return false;
  
  const areaCode = parseInt(cleanPhone.substring(0, 2));
  return areaCode >= 11 && areaCode <= 99;
};

// ZIP Code Validator
const validateBrazilianZipCode = (zipCode: string): boolean => {
  return /^\d{5}-?\d{3}$/.test(zipCode);
};
```

### API Endpoints Overview

**Authentication**:
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/setup-mfa` - Enable MFA
- `POST /api/auth/verify-mfa` - Verify MFA code
- `POST /api/auth/reset-password` - Password reset

**Patients**:
- `GET /api/patients` - List patients (paginated)
- `POST /api/patients` - Create patient
- `GET /api/patients/:id` - Get patient details
- `PATCH /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Soft delete patient
- `GET /api/patients/:id/medical-history` - Get medical history

**Appointments**:
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/:id` - Get appointment
- `PATCH /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/availability` - Check availability

**Clinical**:
- `GET /api/charts/:patientId` - Get dental charts
- `POST /api/charts` - Create chart version
- `GET /api/treatment-plans/:patientId` - Get treatment plans
- `POST /api/treatment-plans` - Create treatment plan
- `POST /api/clinical-notes` - Create SOAP note

**Payments**:
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `GET /api/payments/:id` - Get payment details
- `POST /api/webhooks/stripe` - Stripe webhook handler

---

## 9. Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── Admin/              # Admin interfaces
│   ├── Auth/               # Login, MFA, password reset
│   ├── Booking/            # Online booking flow
│   ├── Calendar/           # Scheduling views
│   ├── Clinical/           # Charting, treatment plans, notes
│   ├── PatientPortal/      # Patient-facing components
│   ├── Payment/            # Stripe integration
│   ├── common/             # Shared components
│   ├── UI/                 # Base UI primitives
│   └── lazy/               # Code-split components
│
├── features/               # Feature modules
│   ├── appointments/
│   ├── auth/
│   ├── clinical/
│   ├── patients/
│   └── providers/
│
├── hooks/                  # Custom React hooks
│   ├── useApiQuery.ts
│   ├── useApiState.ts
│   ├── useAuth.ts
│   └── useForm.ts
│
├── services/               # API communication
│   ├── apiService.ts
│   ├── paymentService.ts
│   └── interceptors/
│
├── store/                  # Zustand stores
│   ├── authStore.ts
│   ├── appStore.ts
│   └── clinicalStore.ts
│
├── contexts/               # React contexts
│   ├── AuthContext.tsx
│   ├── ErrorContext.tsx
│   └── PatientAuthContext.tsx
│
└── layouts/                # Page layouts
    ├── MainLayout/
    ├── DashboardLayout/
    ├── AuthLayout/
    └── PatientPortalLayout/
```

### State Management

**Zustand Stores** (Global State):
```typescript
// authStore.ts
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (credentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  login: async (credentials) => { /* ... */ },
  logout: () => { /* ... */ },
  refreshToken: async () => { /* ... */ }
}));
```

**TanStack Query** (Server State):
```typescript
// Automatic caching and refetching
const { data, isLoading, error } = useQuery({
  queryKey: ['appointments', date],
  queryFn: () => appointmentService.getByDate(date),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000 // 10 minutes
});

// Mutations with optimistic updates
const mutation = useMutation({
  mutationFn: appointmentService.create,
  onSuccess: () => {
    queryClient.invalidateQueries(['appointments']);
  }
});
```

### Routing Structure

```typescript
// Public routes
/                           → Landing page
/login                      → Staff login
/portal/login               → Patient login
/booking                    → Online booking

// Protected routes (staff)
/dashboard                  → Role-based dashboard
/calendar                   → Appointment calendar
/patients                   → Patient list
/patients/:id               → Patient details
/clinical/charts/:id        → Dental charting
/clinical/treatment-plans   → Treatment plans

// Protected routes (patient)
/portal/dashboard           → Patient dashboard
/portal/appointments        → My appointments
/portal/documents           → My documents
/portal/insurance           → Insurance info
/portal/family              → Family accounts
```

### Code Splitting Strategy

```typescript
// Route-based splitting
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const Calendar = lazy(() => import('./pages/Calendar'));
const DentalChart = lazy(() => import('./components/Clinical/DentalChart'));

// Usage with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard/admin" element={<AdminDashboard />} />
    <Route path="/calendar" element={<Calendar />} />
  </Routes>
</Suspense>
```

**Bundle Size Optimization**:
- Main bundle: ~200KB (gzipped)
- Route chunks: 20-50KB each
- Total reduction: ~40% vs non-split

---

## 10. Backend Architecture

### Layered Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Routes Layer                             │
│  - HTTP endpoint definitions                                     │
│  - Request/response handling                                     │
│  - Route-level middleware                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       Middleware Layer                           │
│  - authenticate: JWT verification                                │
│  - authorize: Role checking                                      │
│  - validate: Request validation                                  │
│  - errorHandler: Centralized error handling                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        Service Layer                             │
│  - Business logic                                                │
│  - Transaction management                                        │
│  - External service integration                                  │
│  - Data transformation                                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         Model Layer                              │
│  - Mongoose schemas                                              │
│  - Data validation                                               │
│  - Database operations                                           │
│  - Hooks and virtuals                                            │
└─────────────────────────────────────────────────────────────────┘
```

### Service Layer Pattern

```typescript
class AppointmentService {
  /**
   * Create appointment with validation
   * IMPROVED: Added operatory conflict checking
   */
  async create(clinicId: string, data: CreateAppointmentDto) {
    const isTestEnv = process.env.NODE_ENV === 'test';
    const session = isTestEnv ? null : await mongoose.startSession();
    
    try {
      if (!isTestEnv) session!.startTransaction();
      
      // Validation
      const provider = await Provider.findOne({
        _id: data.providerId,
        clinic: clinicId
      }).session(session);
      
      if (!provider) {
        throw new Error('Profissional não encontrado');
      }
      
      // Check conflicts
      const conflict = await this.checkConflicts(
        clinicId,
        data.providerId,
        data.date,
        session
      );
      
      if (conflict) {
        throw new Error('Horário não disponível');
      }
      
      // Create appointment
      const appointment = await Appointment.create([{
        ...data,
        clinic: clinicId,
        status: 'scheduled'
      }], { session });
      
      // Queue notification
      await emailQueue.add('appointment-confirmation', {
        appointmentId: appointment[0]._id,
        patientEmail: data.patientEmail
      });
      
      if (!isTestEnv) await session!.commitTransaction();
      
      return {
        success: true,
        data: appointment[0]
      };
      
    } catch (error) {
      if (!isTestEnv && session) await session.abortTransaction();
      console.error('Error creating appointment:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao criar agendamento'
      };
    } finally {
      if (!isTestEnv && session) session.endSession();
    }
  }
}

export const appointmentService = new AppointmentService();
```

### Transaction Handling

```typescript
// Pattern for multi-document operations
const session = await mongoose.startSession();
session.startTransaction();

try {
  // All operations use session
  await Model1.create([data1], { session });
  await Model2.updateOne(filter, update, { session });
  await Model3.deleteOne(filter, { session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

### Error Handling

```typescript
// Centralized error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Dados inválidos',
      errors: Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }
  
  // JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token inválido'
    });
  }
  
  // Default error
  return res.status(500).json({
    success: false,
    error: 'Erro interno do servidor'
  });
});
```


---

## 11. Data Flow Patterns

### Request/Response Flow

```
User Action (Click button)
    ↓
Component Event Handler
    ↓
Call Hook (useQuery/useMutation)
    ↓
API Service Layer
    ↓
HTTP Client (fetch/axios)
    ↓
Backend Route
    ↓
authenticate Middleware (verify JWT, extract clinicId)
    ↓
authorize Middleware (check role/permissions)
    ↓
validate Middleware (check request data)
    ↓
Route Handler
    ↓
Service Layer (business logic + clinicId scoping)
    ↓
Model Layer (Mongoose operations)
    ↓
MongoDB (query with clinic filter)
    ↓
Response back through layers
    ↓
Frontend updates state
    ↓
Component re-renders
```

### Multi-Tenancy Query Scoping

```typescript
// EVERY query must include clinic scoping

// ❌ WRONG - No clinic scoping
const patients = await Patient.find({ status: 'active' });

// ✅ CORRECT - Clinic scoped
const patients = await Patient.find({
  clinic: clinicId,  // From JWT
  status: 'active'
});

// Service layer pattern
class PatientService {
  async list(clinicId: string, filters: any) {
    return await Patient.find({
      clinic: clinicId,  // Always first
      ...filters
    }).lean();
  }
}
```

### Background Job Processing

```
Service Layer → Queue Job
                    ↓
            BullMQ adds to Redis queue
                    ↓
            Worker picks up job
                    ↓
            Execute job logic
                    ↓
            ┌─────────┴─────────┐
            │ Success           │ Failure
            ↓                   ↓
    Mark job complete    Retry (3 attempts)
            ↓                   ↓
    Log success         Exponential backoff
                               ↓
                        Move to failed queue
                               ↓
                        Alert admin
```

### File Upload Flow

```
Frontend → Select file
              ↓
    Validate (type, size)
              ↓
    POST /api/documents/upload (multipart/form-data)
              ↓
    Backend multer middleware
              ↓
    Validate file
              ↓
    Generate unique filename
              ↓
    Save to disk/S3
              ↓
    Create Document record in MongoDB
              ↓
    Return file URL
              ↓
    Frontend displays uploaded file
```

### Real-Time Calendar Updates

```
User A books appointment
              ↓
    POST /api/appointments
              ↓
    Create appointment in DB
              ↓
    Invalidate cache (Redis)
              ↓
    User B's calendar auto-refreshes (TanStack Query)
              ↓
    GET /api/appointments (cache miss)
              ↓
    Fetch fresh data
              ↓
    Display updated calendar
```

---

## 12. Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│ Layer 1: Network Security                                        │
│  - HTTPS enforcement                                             │
│  - CORS configuration                                            │
│  - Rate limiting                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 2: Authentication                                          │
│  - JWT tokens (access + refresh)                                │
│  - MFA (OTP via SMS)                                             │
│  - Session management                                            │
│  - Password policies                                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 3: Authorization                                           │
│  - RBAC (8 roles, 11 permissions)                               │
│  - Route-level authorization                                     │
│  - Resource-level access control                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 4: Input Validation                                        │
│  - express-validator                                             │
│  - Mongoose schema validation                                    │
│  - Sanitization (mongo-sanitize, DOMPurify)                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Layer 5: Data Protection                                         │
│  - Multi-tenancy isolation                                       │
│  - Encryption at rest                                            │
│  - Audit logging                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Security Headers (Helmet)

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      frameSrc: ["https://js.stripe.com"],
      connectSrc: ["'self'", "https://api.stripe.com"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Muitas requisições, tente novamente mais tarde'
});

// Strict limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per window
  skipSuccessfulRequests: true
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
```

### Input Sanitization

```typescript
import mongoSanitize from 'express-mongo-sanitize';
import DOMPurify from 'isomorphic-dompurify';

// Prevent NoSQL injection
app.use(mongoSanitize());

// Sanitize HTML content
const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};
```

### Audit Logging

```typescript
// Log all sensitive operations
const auditLog = async (
  userId: string,
  action: string,
  resource: string,
  details: any
) => {
  await AuditLog.create({
    user: userId,
    action,
    resource,
    details,
    timestamp: new Date(),
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
};

// Usage
await auditLog(
  req.user!.userId,
  'UPDATE',
  'Patient',
  { patientId, changes }
);
```

---

## 13. Performance & Scalability

### Database Optimization

**Query Optimization**:
```typescript
// ❌ BAD - Loads full documents
const patients = await Patient.find({ clinic: clinicId });

// ✅ GOOD - Lean query (plain objects)
const patients = await Patient.find({ clinic: clinicId }).lean();

// ✅ BETTER - Select only needed fields
const patients = await Patient
  .find({ clinic: clinicId })
  .select('firstName lastName email phone')
  .lean();

// ✅ BEST - With pagination
const patients = await Patient
  .find({ clinic: clinicId })
  .select('firstName lastName email phone')
  .limit(20)
  .skip((page - 1) * 20)
  .lean();
```

**Index Usage**:
```typescript
// Compound indexes for common queries
PatientSchema.index({ clinic: 1, lastName: 1, firstName: 1 });
AppointmentSchema.index({ clinic: 1, date: -1, status: 1 });
ProviderSchema.index({ clinic: 1, specialties: 1 });

// Verify index usage
db.patients.find({ clinic: clinicId, lastName: 'Silva' }).explain('executionStats');
```

**Connection Pooling**:
```typescript
mongoose.connect(process.env.MONGODB_URI!, {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000
});
```

### Redis Caching Strategy

**Cache Layers**:
```typescript
// Layer 1: Static data (1 hour TTL)
const getProviders = async (clinicId: string) => {
  const cacheKey = `providers:${clinicId}`;
  
  // Check cache
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Fetch from DB
  const providers = await Provider.find({ clinic: clinicId }).lean();
  
  // Cache result
  await redis.setex(cacheKey, 3600, JSON.stringify(providers));
  
  return providers;
};

// Layer 2: Dynamic data (5 minutes TTL)
const getAvailability = async (providerId: string, date: string) => {
  const cacheKey = `availability:${providerId}:${date}`;
  
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  const availability = await calculateAvailability(providerId, date);
  await redis.setex(cacheKey, 300, JSON.stringify(availability));
  
  return availability;
};
```

**Cache Invalidation**:
```typescript
// Invalidate on data change
const updateProvider = async (providerId: string, data: any) => {
  const provider = await Provider.findByIdAndUpdate(providerId, data);
  
  // Invalidate cache
  await redis.del(`providers:${provider.clinic}`);
  await redis.del(`availability:${providerId}:*`);
  
  return provider;
};
```

### Frontend Performance

**Code Splitting**:
```typescript
// Route-based splitting
const routes = [
  {
    path: '/dashboard',
    component: lazy(() => import('./pages/Dashboard'))
  },
  {
    path: '/calendar',
    component: lazy(() => import('./pages/Calendar'))
  }
];
```

**Memoization**:
```typescript
// Expensive computations
const sortedAppointments = useMemo(() => {
  return appointments.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}, [appointments]);

// Callbacks
const handleClick = useCallback((id: string) => {
  navigate(`/patients/${id}`);
}, [navigate]);
```

**Virtual Scrolling**:
```typescript
// For large lists (1000+ items)
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={patients.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      {patients[index].name}
    </div>
  )}
</FixedSizeList>
```

### Scalability Considerations

**Horizontal Scaling**:
- Stateless backend (no in-memory sessions)
- Session storage in Redis (shared across instances)
- Load balancer ready (sticky sessions not required)
- Database connection pooling

**Vertical Scaling**:
- MongoDB sharding ready (clinic-based sharding key)
- Redis clustering support
- Worker process scaling (BullMQ)

**Performance Metrics**:
- API response time: <200ms (p95)
- Database query time: <50ms (p95)
- Page load time: <2s (p95)
- Time to interactive: <3s

---

## 14. Testing Strategy

### Test Pyramid

```
                    ┌─────────────┐
                    │     E2E     │  10% - Critical flows
                    │  (Cypress)  │
                    └─────────────┘
                  ┌─────────────────┐
                  │  Integration    │  30% - API endpoints
                  │  (Supertest)    │
                  └─────────────────┘
              ┌───────────────────────┐
              │      Unit Tests       │  60% - Business logic
              │        (Jest)         │
              └───────────────────────┘
```

### Unit Testing

```typescript
// Service layer tests
describe('AppointmentService', () => {
  describe('create', () => {
    it('should create appointment with valid data', async () => {
      const result = await appointmentService.create(clinicId, validData);
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('_id');
      expect(result.data.clinic).toBe(clinicId);
    });
    
    it('should reject conflicting appointments', async () => {
      await appointmentService.create(clinicId, data1);
      const result = await appointmentService.create(clinicId, data2);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('não disponível');
    });
  });
});
```

### Integration Testing

```typescript
// API endpoint tests
describe('POST /api/appointments', () => {
  it('should create appointment with valid token', async () => {
    const response = await request(app)
      .post('/api/appointments')
      .set('Authorization', `Bearer ${validToken}`)
      .send(validData)
      .expect(201);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('_id');
  });
  
  it('should reject without authentication', async () => {
    await request(app)
      .post('/api/appointments')
      .send(validData)
      .expect(401);
  });
});
```

### E2E Testing

```typescript
// Cypress tests
describe('Appointment Booking Flow', () => {
  it('should complete booking as guest', () => {
    cy.visit('/booking');
    cy.get('[data-testid="service-select"]').select('Consulta');
    cy.get('[data-testid="provider-select"]').select('Dr. Silva');
    cy.get('[data-testid="date-picker"]').click();
    cy.get('[data-testid="time-slot-10:00"]').click();
    cy.get('[data-testid="guest-checkout"]').click();
    cy.get('[data-testid="name-input"]').type('João Silva');
    cy.get('[data-testid="email-input"]').type('joao@example.com');
    cy.get('[data-testid="phone-input"]').type('(11) 98765-4321');
    cy.get('[data-testid="confirm-button"]').click();
    cy.url().should('include', '/booking/confirmation');
    cy.contains('Agendamento confirmado').should('be.visible');
  });
});
```

### Test Environment Setup

```typescript
// MongoDB Memory Server for tests
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
```

---

## 15. Deployment & Operations

### Environment Configuration

**Development**:
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/topsmile_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key
STRIPE_SECRET_KEY=sk_test_...
```

**Production**:
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/topsmile
REDIS_URL=redis://redis-cluster:6379
JWT_SECRET=<strong-random-secret>
STRIPE_SECRET_KEY=sk_live_...
```

### Monitoring & Logging

**Structured Logging (Pino)**:
```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

// Usage
logger.info({ userId, action: 'login' }, 'User logged in');
logger.error({ err, context }, 'Error occurred');
```

**Performance Monitoring**:
```typescript
// API response time tracking
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration
    }, 'Request completed');
  });
  
  next();
});
```

### Health Checks

```typescript
// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      mongodb: 'unknown',
      redis: 'unknown'
    }
  };
  
  try {
    await mongoose.connection.db.admin().ping();
    health.services.mongodb = 'ok';
  } catch (error) {
    health.services.mongodb = 'error';
    health.status = 'degraded';
  }
  
  try {
    await redis.ping();
    health.services.redis = 'ok';
  } catch (error) {
    health.services.redis = 'error';
    health.status = 'degraded';
  }
  
  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

### Troubleshooting Guide

**Common Issues**:

1. **Database Connection Failures**
   - Check MongoDB URI
   - Verify network connectivity
   - Check connection pool settings
   - Review MongoDB logs

2. **Authentication Errors**
   - Verify JWT_SECRET matches
   - Check token expiration
   - Validate token format
   - Review session in Redis

3. **Payment Processing Errors**
   - Verify Stripe API keys
   - Check webhook signature
   - Review Stripe dashboard
   - Validate amount format

4. **Background Job Failures**
   - Check Redis connection
   - Review BullMQ logs
   - Verify worker is running
   - Check job retry count

---

## 16. Future Enhancements

### Planned Features (Phases 5-6)

**Phase 5: Payments & Billing** (Weeks 17-20):
- Invoice generation and tracking
- Insurance claim management
- Payment plans and installments
- Automated billing reminders
- Financial reporting

**Phase 6: Reporting & Analytics** (Weeks 21-24):
- Provider performance metrics
- Revenue analytics
- Patient retention analysis
- Appointment analytics
- Custom report builder

### Scalability Roadmap

1. **Database Sharding**: Implement MongoDB sharding by clinic
2. **CDN Integration**: Serve static assets via CDN
3. **Microservices**: Split into domain-specific services
4. **Event Sourcing**: Implement for audit trail
5. **GraphQL API**: Alternative to REST for complex queries

### Technology Upgrades

- React 19 (when stable)
- Node.js 20 LTS
- MongoDB 8.0
- TypeScript 5.5+
- Upgrade to latest Stripe API version

---

## Appendices

### A. Permission Matrix

| Role | Patients | Appointments | Clinical | Payments | Reports | Settings | Users |
|------|----------|--------------|----------|----------|---------|----------|-------|
| Admin | RW | RW | RW | RW | R | RW | RW |
| Manager | RW | RW | R | RW | R | R | R |
| Dentist | RW | RW | RW | R | R | - | - |
| Hygienist | R | RW | RW | - | - | - | - |
| Assistant | R | R | R | - | - | - | - |
| Receptionist | RW | RW | - | R | - | - | - |
| Patient | R (own) | R (own) | R (own) | R (own) | - | - | - |
| Guest | - | R (own) | - | - | - | - | - |

### B. API Response Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### C. Database Indexes Reference

**Patient Model**:
- `{ clinic: 1, email: 1 }` - Unique
- `{ clinic: 1, lastName: 1, firstName: 1 }` - Sorting
- `{ clinic: 1, phone: 1 }` - Lookup
- `{ firstName: 'text', lastName: 'text', email: 'text' }` - Search

**Appointment Model**:
- `{ clinic: 1, date: -1, status: 1 }` - Calendar queries
- `{ clinic: 1, provider: 1, date: -1 }` - Provider schedule
- `{ clinic: 1, patient: 1, date: -1 }` - Patient history
- `{ clinic: 1, operatory: 1, date: 1 }` - Operatory conflicts

**Provider Model**:
- `{ clinic: 1, specialties: 1 }` - Specialty search
- `{ clinic: 1, status: 1 }` - Active providers

---

## Document Version

**Version**: 2.0  
**Last Updated**: 2024-01-15  
**Authors**: Development Team  
**Status**: Complete Rewrite

**Change Log**:
- v2.0 (2024-01-15): Complete rewrite with comprehensive system documentation
- v1.0 (2023-XX-XX): Initial high-level overview
