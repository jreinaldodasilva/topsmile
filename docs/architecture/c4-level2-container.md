# C4 Model - Level 2: Container Diagram

## TopSmile Containers

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Users & External                           │
└────┬────────────────────────────────────────────────────────────┬───┘
     │                                                             │
     │ HTTPS                                                       │ API
     │                                                             │
┌────▼─────────────────────────────────┐  ┌─────────────────────▼─────┐
│                                      │  │                             │
│      React SPA (Frontend)            │  │   External Services         │
│      Port: 3000                      │  │                             │
│                                      │  │  • Stripe API               │
│  • React 18 + TypeScript             │  │  • Twilio API               │
│  • TanStack Query (caching)          │  │  • SMTP Server              │
│  • Zustand (state)                   │  │                             │
│  • React Router (routing)            │  └─────────────────────────────┘
│                                      │
└────┬─────────────────────────────────┘
     │
     │ HTTPS/REST
     │ (httpOnly cookies)
     │
┌────▼─────────────────────────────────┐
│                                      │
│    Express API (Backend)             │
│    Port: 5000                        │
│                                      │
│  • Node.js + Express                 │
│  • TypeScript                        │
│  • JWT Authentication                │
│  • Role-Based Access Control         │
│  • Rate Limiting                     │
│  • Security Headers (Helmet)         │
│                                      │
└────┬──────────────┬──────────────────┘
     │              │
     │              │
┌────▼────────┐  ┌──▼──────────┐
│             │  │             │
│  MongoDB    │  │   Redis     │
│  Port: 27017│  │   Port: 6379│
│             │  │             │
│  • Patients │  │  • Sessions │
│  • Users    │  │  • Cache    │
│  • Appts    │  │  • Blacklist│
│  • Clinical │  │  • Queues   │
│             │  │             │
└─────────────┘  └─────────────┘
```

## Container Details

### React SPA (Frontend)
**Technology:** React 18, TypeScript, TanStack Query  
**Responsibilities:**
- User interface rendering
- Client-side routing
- State management
- API communication
- Form validation

**Key Features:**
- Server state caching with TanStack Query
- Automatic token refresh
- Session timeout tracking
- Responsive design
- Accessibility (WCAG 2.1 AA)

### Express API (Backend)
**Technology:** Node.js, Express, TypeScript  
**Responsibilities:**
- Business logic
- Authentication/authorization
- Data validation
- External service integration
- Audit logging

**Key Features:**
- JWT with httpOnly cookies
- Token blacklist (Redis)
- Automatic token refresh
- Rate limiting
- CSRF protection
- Input sanitization

### MongoDB Database
**Technology:** MongoDB 5.0+  
**Responsibilities:**
- Persistent data storage
- Document relationships
- Indexing for performance

**Collections:**
- Users, Patients, Providers
- Appointments, Waitlist
- DentalCharts, TreatmentPlans
- ClinicalNotes, Prescriptions
- Insurance, AuditLogs, Sessions

### Redis Cache
**Technology:** Redis 6.0+  
**Responsibilities:**
- Session storage
- Token blacklist
- API response caching
- Job queues (BullMQ)

**Use Cases:**
- Session management
- Revoked token tracking
- Email/SMS queues
- Rate limiting counters

## Communication Patterns

### Frontend ↔ Backend
**Protocol:** HTTPS/REST  
**Authentication:** httpOnly cookies (JWT)  
**Format:** JSON  
**Features:**
- Automatic retry on network failure
- Token refresh on 401
- Request correlation IDs

### Backend ↔ MongoDB
**Protocol:** MongoDB Wire Protocol  
**Driver:** Mongoose ODM  
**Features:**
- Connection pooling
- Automatic reconnection
- Query optimization with indexes

### Backend ↔ Redis
**Protocol:** Redis Protocol  
**Driver:** IORedis  
**Features:**
- Connection pooling
- Pub/Sub for real-time features
- Automatic expiration (TTL)

### Backend ↔ External Services
**Stripe:** REST API (HTTPS)  
**Twilio:** REST API (HTTPS)  
**SMTP:** SMTP protocol (TLS)
