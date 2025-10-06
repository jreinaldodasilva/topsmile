# C4 Model - Level 3: Component Diagram

## Backend Components

```
┌─────────────────────────────────────────────────────────┐
│                    Express API                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │   Routes     │  │  Middleware  │  │  Services   │  │
│  │              │  │              │  │             │  │
│  │ • Auth       │  │ • Auth       │  │ • Auth      │  │
│  │ • Patients   │  │ • RBAC       │  │ • Email     │  │
│  │ • Appts      │  │ • Validation │  │ • SMS       │  │
│  │ • Clinical   │  │ • Rate Limit │  │ • Stripe    │  │
│  │ • Payments   │  │ • Audit Log  │  │ • Blacklist │  │
│  └──────────────┘  └──────────────┘  └─────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │                   Models                         │  │
│  │  User • Patient • Appointment • DentalChart     │  │
│  │  TreatmentPlan • ClinicalNote • AuditLog        │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Frontend Components

```
┌─────────────────────────────────────────────────────────┐
│                    React SPA                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │   Pages      │  │  Components  │  │  Services   │  │
│  │              │  │              │  │             │  │
│  │ • Login      │  │ • Auth       │  │ • API       │  │
│  │ • Dashboard  │  │ • Clinical   │  │ • Payment   │  │
│  │ • Calendar   │  │ • Booking    │  │ • HTTP      │  │
│  │ • Patient    │  │ • Admin      │  │             │  │
│  └──────────────┘  └──────────────┘  └─────────────┘  │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │   Contexts   │  │    Hooks     │                   │
│  │              │  │              │                   │
│  │ • Auth       │  │ • Session    │                   │
│  │ • Patient    │  │ • API Query  │                   │
│  │ • Error      │  │ • Form       │                   │
│  └──────────────┘  └──────────────┘                   │
└─────────────────────────────────────────────────────────┘
```
