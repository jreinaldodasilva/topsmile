# TopSmile System Architecture

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  Web Browser     │  │  Mobile Browser  │                    │
│  │  (React SPA)     │  │  (Responsive)    │                    │
│  └────────┬─────────┘  └────────┬─────────┘                    │
└───────────┼──────────────────────┼──────────────────────────────┘
            │                      │
            │   HTTPS/REST API     │
            │                      │
┌───────────▼──────────────────────▼──────────────────────────────┐
│                      API Gateway Layer                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Express.js Application Server                           │   │
│  │  - CORS, Helmet, Rate Limiting                          │   │
│  │  - CSRF Protection, Input Sanitization                  │   │
│  │  - JWT Authentication, Session Management               │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────┬──────────────────────────────────────────────────────┘
            │
┌───────────▼──────────────────────────────────────────────────────┐
│                      Application Layer                           │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │   Routes     │  Middleware  │  Validation  │   Services   │  │
│  │              │              │              │              │  │
│  │ - Auth       │ - Authenticate│ - express-  │ - authService│  │
│  │ - Patients   │ - Authorize  │   validator │ - patientSvc │  │
│  │ - Providers  │ - Error      │ - Zod       │ - appointSvc │  │
│  │ - Appts      │   Handler    │             │ - clinicalSvc│  │
│  │ - Clinical   │ - Audit Log  │             │              │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
└───────────┬──────────────────────────────────────────────────────┘
            │
┌───────────▼──────────────────────────────────────────────────────┐
│                       Data Access Layer                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Mongoose ODM                                            │   │
│  │  - User, Patient, Appointment, Provider Models          │   │
│  │  - Schema Validation, Middleware, Virtuals              │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────┬──────────────────────────────────────────────────────┘
            │
┌───────────▼──────────────────────────────────────────────────────┐
│                      Persistence Layer                           │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │  MongoDB         │  │  Redis (Future)  │                    │
│  │  - Primary DB    │  │  - Cache         │                    │
│  │  - Collections   │  │  - Sessions      │                    │
│  └──────────────────┘  └──────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Authentication Flow

### Staff Authentication
```
User → Login Page → POST /api/auth/login
  → Rate Limiter (10/15min)
  → Validate Credentials
  → Check Account Lock
  → Compare Password (bcrypt)
  → Generate JWT (15min) + Refresh Token (7d)
  → Set HttpOnly Cookies
  → Return User Data
  → Redirect to Dashboard
```

### Patient Authentication
```
Patient → Login Page → POST /api/patient-auth/login
  → Rate Limiter
  → Validate Credentials
  → Generate JWT (24h) + Refresh Token (7d)
  → Set HttpOnly Cookies
  → Return Patient Data
  → Redirect to Patient Portal
```

## 3. Database Schema

```
users ─────► clinics
  │
  └─► refreshTokens

patients ──► clinics
  │
  └─► appointments ──► providers
                   └─► appointmentTypes

contacts ──► clinics

auditLogs ──► users
```

## 4. Technology Stack

**Frontend:** React 18 + TypeScript + Zustand + TanStack Query  
**Backend:** Node.js + Express + TypeScript + Mongoose  
**Database:** MongoDB  
**Cache:** Redis (planned)  
**Auth:** JWT + HttpOnly Cookies  
**Testing:** Jest + Cypress + Testing Library

---

**Version:** 1.0  
**Date:** January 2025
