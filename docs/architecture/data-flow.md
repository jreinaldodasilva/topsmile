# Data Flow Diagrams

## Authentication Flow

```
User → Frontend → Backend → Redis/MongoDB
  │       │          │           │
  │   Login Form     │           │
  │       │          │           │
  │       └─POST────→│           │
  │              Validate        │
  │                  │           │
  │                  ├─Check────→│
  │                  │←─User─────┘
  │                  │
  │              Generate JWT
  │                  │
  │       ←─Cookie───┤
  │                  │
  └─Dashboard────────┘
```

## Appointment Booking Flow

```
Patient → Frontend → Backend → MongoDB
   │         │          │          │
   │    Select Time     │          │
   │         │          │          │
   │         └─POST────→│          │
   │               Validate        │
   │                    │          │
   │                    ├─Check───→│
   │                    │←─Avail───┘
   │                    │
   │               Create Appt
   │                    │
   │         ←─Success──┤
   │                    │
   └─Confirmation───────┘
```

## Payment Processing Flow

```
User → Frontend → Backend → Stripe → Backend → MongoDB
 │        │          │        │        │          │
 │   Enter Card      │        │        │          │
 │        │          │        │        │          │
 │        └─POST────→│        │        │          │
 │            Create Intent   │        │          │
 │                   ├───────→│        │          │
 │                   │←─Secret─┤       │          │
 │        ←─Secret───┤         │       │          │
 │                   │         │       │          │
 │   Confirm Payment │         │       │          │
 │        └──────────┼────────→│       │          │
 │                   │         │       │          │
 │                   │         └──────→│          │
 │                   │            Webhook         │
 │                   │                 ├─Update──→│
 │                   │                 │          │
 │        ←─Success──┤                 │          │
 └────────────────────────────────────┘          │
```
