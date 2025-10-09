# TopSmile System Diagrams

**Document Version:** 1.0.0  
**Last Updated:** 2024-01-15

This document contains Mermaid diagrams for visualizing the TopSmile system architecture and flows.

---

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile Browser]
    end
    
    subgraph "Frontend Layer - Port 3000"
        React[React Application]
        PatientPortal[Patient Portal]
        StaffDashboard[Staff Dashboard]
        AdminConsole[Admin Console]
    end
    
    subgraph "Backend Layer - Port 5000"
        Express[Express API Server]
        Routes[API Routes]
        Middleware[Middleware Pipeline]
        Services[Service Layer]
        EventBus[Event Bus]
    end
    
    subgraph "Data Layer"
        MongoDB[(MongoDB)]
        Redis[(Redis Cache)]
    end
    
    subgraph "External Services"
        Stripe[Stripe Payments]
        SendGrid[SendGrid Email]
        Twilio[Twilio SMS]
    end
    
    Browser --> React
    Mobile --> React
    React --> PatientPortal
    React --> StaffDashboard
    React --> AdminConsole
    
    PatientPortal --> Express
    StaffDashboard --> Express
    AdminConsole --> Express
    
    Express --> Routes
    Routes --> Middleware
    Middleware --> Services
    Services --> EventBus
    
    Services --> MongoDB
    Services --> Redis
    
    Services --> Stripe
    Services --> SendGrid
    Services --> Twilio
```

---

## Authentication Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    participant Redis
    
    User->>Frontend: Enter credentials
    Frontend->>Backend: POST /api/auth/login
    Backend->>Database: Find user by email
    Database-->>Backend: User data
    Backend->>Backend: Verify password (bcrypt)
    Backend->>Backend: Generate JWT tokens
    Backend->>Database: Store refresh token
    Backend->>Redis: Cache user session
    Backend-->>Frontend: Set HttpOnly cookies
    Backend-->>Frontend: Return user data
    Frontend->>Frontend: Store user in context
    Frontend-->>User: Redirect to dashboard
```

---

## Token Refresh Flow

```mermaid
sequenceDiagram
    participant Frontend
    participant Backend
    participant Redis
    participant Database
    
    Frontend->>Backend: API request with expired token
    Backend-->>Frontend: 401 Unauthorized
    Frontend->>Backend: POST /api/auth/refresh
    Backend->>Backend: Verify refresh token
    Backend->>Redis: Check token blacklist
    Redis-->>Backend: Not blacklisted
    Backend->>Database: Find refresh token
    Database-->>Backend: Token valid
    Backend->>Backend: Generate new tokens
    Backend->>Redis: Blacklist old refresh token
    Backend->>Database: Store new refresh token
    Backend->>Database: Delete old refresh token
    Backend-->>Frontend: New tokens in cookies
    Frontend->>Backend: Retry original request
    Backend-->>Frontend: Success response
```

---

## Request/Response Cycle

```mermaid
graph LR
    A[Browser] -->|HTTP Request| B[Frontend Service]
    B -->|API Call| C[Backend Route]
    C -->|Process| D[Middleware Pipeline]
    D -->|Validate| E[Service Layer]
    E -->|Query| F[Database]
    F -->|Data| E
    E -->|Transform| D
    D -->|Format| C
    C -->|JSON| B
    B -->|Update State| A
```

---

## Middleware Pipeline

```mermaid
graph TD
    Request[Incoming Request] --> Helmet[Helmet Security Headers]
    Helmet --> CORS[CORS Validation]
    CORS --> RateLimit[Rate Limiter]
    RateLimit --> BodyParser[Body Parser]
    BodyParser --> Sanitize[MongoDB Sanitization]
    Sanitize --> CSRF{CSRF Check}
    CSRF -->|State-Changing| CSRFProtect[CSRF Protection]
    CSRF -->|Read-Only| Auth[Authentication]
    CSRFProtect --> Auth
    Auth --> Authz[Authorization]
    Authz --> RouteHandler[Route Handler]
    RouteHandler --> Response[Response]
```

---

## Database Schema Relationships

```mermaid
erDiagram
    Clinic ||--o{ User : has
    Clinic ||--o{ Patient : has
    Clinic ||--o{ Provider : has
    Clinic ||--o{ Appointment : has
    
    User ||--o{ RefreshToken : has
    Patient ||--o{ PatientRefreshToken : has
    
    Patient ||--o{ Appointment : books
    Provider ||--o{ Appointment : performs
    AppointmentType ||--o{ Appointment : defines
    
    Patient ||--o{ MedicalHistory : has
    Patient ||--o{ Insurance : has
    Patient ||--o{ TreatmentPlan : has
    
    Appointment ||--o{ ClinicalNote : has
    TreatmentPlan ||--o{ Prescription : includes
    
    Clinic {
        ObjectId _id
        string name
        string address
        boolean isActive
    }
    
    User {
        ObjectId _id
        ObjectId clinicId
        string email
        string password
        string role
        boolean isActive
    }
    
    Patient {
        ObjectId _id
        ObjectId clinicId
        string email
        string name
        string phone
        boolean isActive
    }
    
    Provider {
        ObjectId _id
        ObjectId clinicId
        string name
        string specialty
        boolean isActive
    }
    
    Appointment {
        ObjectId _id
        ObjectId clinicId
        ObjectId patientId
        ObjectId providerId
        Date scheduledStart
        number duration
        string status
    }
```

---

## Component Hierarchy (Frontend)

```mermaid
graph TD
    App[App.tsx] --> Router[React Router]
    Router --> ErrorBoundary[Error Boundary]
    ErrorBoundary --> AuthProvider[Auth Provider]
    AuthProvider --> PatientAuthProvider[Patient Auth Provider]
    PatientAuthProvider --> Routes[Routes]
    
    Routes --> PublicRoutes[Public Routes]
    Routes --> StaffRoutes[Staff Routes]
    Routes --> PatientRoutes[Patient Routes]
    
    PublicRoutes --> Home[Home Page]
    PublicRoutes --> Login[Login Page]
    PublicRoutes --> Features[Features Page]
    
    StaffRoutes --> AdminDashboard[Admin Dashboard]
    StaffRoutes --> PatientManagement[Patient Management]
    StaffRoutes --> AppointmentCalendar[Appointment Calendar]
    
    PatientRoutes --> PatientDashboard[Patient Dashboard]
    PatientRoutes --> BookAppointment[Book Appointment]
    PatientRoutes --> PatientProfile[Patient Profile]
```

---

## Service Layer Architecture (Backend)

```mermaid
graph TD
    Routes[API Routes] --> AuthService[Auth Service]
    Routes --> AppointmentService[Appointment Service]
    Routes --> PatientService[Patient Service]
    Routes --> ProviderService[Provider Service]
    
    AuthService --> UserModel[User Model]
    AuthService --> TokenService[Token Service]
    AuthService --> EmailService[Email Service]
    
    AppointmentService --> AppointmentModel[Appointment Model]
    AppointmentService --> AvailabilityService[Availability Service]
    AppointmentService --> NotificationService[Notification Service]
    
    PatientService --> PatientModel[Patient Model]
    PatientService --> MedicalHistoryModel[Medical History Model]
    
    ProviderService --> ProviderModel[Provider Model]
    
    EmailService --> SendGrid[SendGrid API]
    NotificationService --> Twilio[Twilio API]
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[HTTPS Load Balancer]
    end
    
    subgraph "Application Servers"
        Frontend1[Frontend Instance 1]
        Frontend2[Frontend Instance 2]
        Backend1[Backend Instance 1]
        Backend2[Backend Instance 2]
    end
    
    subgraph "Data Layer"
        MongoDB_Primary[(MongoDB Primary)]
        MongoDB_Secondary1[(MongoDB Secondary 1)]
        MongoDB_Secondary2[(MongoDB Secondary 2)]
        Redis_Master[(Redis Master)]
        Redis_Replica[(Redis Replica)]
    end
    
    subgraph "External Services"
        Stripe_API[Stripe API]
        SendGrid_API[SendGrid API]
        Twilio_API[Twilio API]
    end
    
    LB --> Frontend1
    LB --> Frontend2
    LB --> Backend1
    LB --> Backend2
    
    Backend1 --> MongoDB_Primary
    Backend2 --> MongoDB_Primary
    MongoDB_Primary --> MongoDB_Secondary1
    MongoDB_Primary --> MongoDB_Secondary2
    
    Backend1 --> Redis_Master
    Backend2 --> Redis_Master
    Redis_Master --> Redis_Replica
    
    Backend1 --> Stripe_API
    Backend1 --> SendGrid_API
    Backend1 --> Twilio_API
    Backend2 --> Stripe_API
    Backend2 --> SendGrid_API
    Backend2 --> Twilio_API
```

---

## CI/CD Pipeline

```mermaid
graph LR
    A[Git Push] --> B[GitHub Actions]
    B --> C{Tests Pass?}
    C -->|No| D[Notify Developer]
    C -->|Yes| E[Build]
    E --> F{Lint & Type Check?}
    F -->|No| D
    F -->|Yes| G[Deploy to Staging]
    G --> H[E2E Tests]
    H --> I{Tests Pass?}
    I -->|No| D
    I -->|Yes| J[Deploy to Production]
    J --> K[Health Check]
    K --> L{Healthy?}
    L -->|No| M[Rollback]
    L -->|Yes| N[Success]
```

---

## State Management Flow (Frontend)

```mermaid
graph TD
    UserAction[User Action] --> Component[React Component]
    Component --> Hook[Custom Hook]
    Hook --> Service[API Service]
    Service --> Backend[Backend API]
    Backend --> Service
    Service --> ReactQuery[React Query Cache]
    Service --> Zustand[Zustand Store]
    ReactQuery --> Component
    Zustand --> Component
    Component --> Render[Re-render UI]
```

---

## Error Handling Flow

```mermaid
graph TD
    Error[Error Occurs] --> ErrorBoundary{Error Boundary}
    ErrorBoundary -->|Component Error| ComponentError[Component Error Handler]
    ErrorBoundary -->|API Error| APIError[API Error Handler]
    ErrorBoundary -->|Network Error| NetworkError[Network Error Handler]
    
    ComponentError --> Log[Log Error]
    APIError --> Log
    NetworkError --> Log
    
    Log --> Display{Display to User?}
    Display -->|Yes| UserMessage[Show User-Friendly Message]
    Display -->|No| Silent[Silent Logging]
    
    UserMessage --> Recovery[Recovery Options]
    Recovery --> Retry[Retry Action]
    Recovery --> Fallback[Show Fallback UI]
    Recovery --> Redirect[Redirect to Safe Page]
```

---

## Appointment Booking Flow

```mermaid
sequenceDiagram
    participant Patient
    participant Frontend
    participant Backend
    participant Database
    participant Email
    
    Patient->>Frontend: Select appointment type
    Frontend->>Backend: GET /api/scheduling/availability
    Backend->>Database: Query provider schedules
    Database-->>Backend: Available slots
    Backend-->>Frontend: Return time slots
    Frontend-->>Patient: Display available times
    
    Patient->>Frontend: Select time slot
    Frontend->>Backend: POST /api/scheduling/appointments
    Backend->>Database: Check availability (with lock)
    Backend->>Database: Create appointment
    Backend->>Database: Update provider schedule
    Database-->>Backend: Appointment created
    Backend->>Email: Send confirmation email
    Backend-->>Frontend: Success response
    Frontend-->>Patient: Show confirmation
```

---

## Multi-Tenant Data Isolation

```mermaid
graph TD
    Request[API Request] --> Auth[Authentication]
    Auth --> ExtractClinic[Extract Clinic ID from Token]
    ExtractClinic --> Query[Database Query]
    Query --> Filter{Add Clinic Filter}
    Filter --> MongoDB[(MongoDB)]
    MongoDB --> Results[Filtered Results]
    Results --> Response[API Response]
    
    style Filter fill:#f9f,stroke:#333,stroke-width:4px
```

---

## Caching Strategy

```mermaid
graph TD
    Request[API Request] --> L1{Browser Cache}
    L1 -->|Hit| Return1[Return Cached Data]
    L1 -->|Miss| L2{React Query Cache}
    L2 -->|Hit| Return2[Return Cached Data]
    L2 -->|Miss| L3{Redis Cache}
    L3 -->|Hit| Return3[Return Cached Data]
    L3 -->|Miss| DB[(MongoDB)]
    DB --> Cache[Update All Caches]
    Cache --> Return4[Return Fresh Data]
```

---

## How to Use These Diagrams

1. **Copy Mermaid Code**: Copy the code blocks above
2. **Paste in Markdown**: Use in any markdown file
3. **View in GitHub**: GitHub renders Mermaid automatically
4. **Use Mermaid Live Editor**: https://mermaid.live for editing
5. **Export as Images**: Use Mermaid CLI or online tools

---

## Diagram Legend

- **Rectangles**: Processes or components
- **Cylinders**: Databases
- **Diamonds**: Decision points
- **Arrows**: Data flow or relationships
- **Subgraphs**: Logical groupings

---

**Note:** These diagrams are living documents and should be updated as the system evolves.
