# C4 Model - Level 1: System Context Diagram

## TopSmile System Context

```
┌─────────────────────────────────────────────────────────────────┐
│                        External Systems                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐              │
│  │  Stripe  │      │  Twilio  │      │   SMTP   │              │
│  │ Payment  │      │   SMS    │      │  Email   │              │
│  └────┬─────┘      └────┬─────┘      └────┬─────┘              │
│       │                 │                  │                     │
└───────┼─────────────────┼──────────────────┼─────────────────────┘
        │                 │                  │
        │                 │                  │
┌───────▼─────────────────▼──────────────────▼─────────────────────┐
│                                                                   │
│                      TopSmile System                              │
│          Dental Clinic Management Platform                        │
│                                                                   │
│  • Patient Management      • Clinical Documentation              │
│  • Appointment Scheduling  • Payment Processing                  │
│  • Provider Dashboard      • Audit Logging                       │
│  • Role-Based Access       • MFA Authentication                  │
│                                                                   │
└───────┬─────────────────┬──────────────────┬─────────────────────┘
        │                 │                  │
        │                 │                  │
┌───────▼─────────┐ ┌─────▼──────┐ ┌────────▼────────┐
│                 │ │            │ │                  │
│  Staff Users    │ │  Patients  │ │  Administrators  │
│                 │ │            │ │                  │
│  • Dentists     │ │  • Book    │ │  • Manage Users  │
│  • Hygienists   │ │  • View    │ │  • View Audits   │
│  • Assistants   │ │  • Upload  │ │  • Configure     │
│  • Receptionists│ │  • Sign    │ │  • Reports       │
│                 │ │            │ │                  │
└─────────────────┘ └────────────┘ └──────────────────┘
```

## Actors

### Staff Users
**Role:** Healthcare providers and clinic staff  
**Interactions:**
- Manage patient records
- Schedule appointments
- Document clinical procedures
- Process payments
- View reports

### Patients
**Role:** Dental clinic patients  
**Interactions:**
- Book appointments online
- View treatment history
- Upload documents
- Sign consent forms
- Manage family accounts

### Administrators
**Role:** System and clinic administrators  
**Interactions:**
- Manage user accounts and roles
- Configure system settings
- View audit logs
- Generate reports
- Monitor system health

## External Systems

### Stripe
**Purpose:** Payment processing  
**Integration:** REST API  
**Data Flow:** Payment intents, charges, refunds

### Twilio
**Purpose:** SMS notifications  
**Integration:** REST API  
**Data Flow:** Appointment reminders, MFA codes

### SMTP Server
**Purpose:** Email notifications  
**Integration:** SMTP protocol  
**Data Flow:** Appointment confirmations, password resets

## System Boundaries

**In Scope:**
- Patient and appointment management
- Clinical documentation
- Payment processing
- Authentication and authorization
- Audit logging

**Out of Scope:**
- Insurance claim submission (tracked only)
- Lab integrations
- Imaging systems (PACS)
- Accounting software integration
