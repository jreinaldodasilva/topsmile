# TopSmile - Quick Reference Guide

## 🚀 Quick Start

### Start Development Environment
```bash
# Start both frontend and backend
npm run dev

# Frontend only (port 3000)
npm start

# Backend only (port 5000)
cd backend && npm run dev
```

### Environment Setup
```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env

# Install dependencies
npm install
```

---

## 📋 API Quick Reference

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication
```bash
# Login
POST /api/auth/login
Body: { email, password }

# Register
POST /api/auth/register
Body: { name, email, password, clinic }

# MFA Setup
POST /api/mfa/setup
Headers: { Authorization: Bearer <token> }

# SMS Verification
POST /api/sms-verification/send
Body: { phone }
```

### Clinical Features
```bash
# Medical History
GET    /api/medical-history/patient/:patientId
POST   /api/medical-history
GET    /api/medical-history/conditions/medical
GET    /api/medical-history/allergies/common

# Treatment Plans
GET    /api/treatment-plans/patient/:patientId
POST   /api/treatment-plans
GET    /api/treatment-plans/cdt-codes/all
POST   /api/treatment-plans/estimate-insurance

# Clinical Notes
GET    /api/clinical-notes/patient/:patientId
POST   /api/clinical-notes
GET    /api/clinical-notes/templates/all
PATCH  /api/clinical-notes/:id/sign

# Dental Charts
GET    /api/dental-charts/patient/:patientId
POST   /api/dental-charts
PUT    /api/dental-charts/:id
```

### Scheduling
```bash
# Appointments
GET    /api/appointments?startDate=...&endDate=...
POST   /api/appointments
PATCH  /api/appointments/:id

# Operatories
GET    /api/operatories
POST   /api/operatories

# Waitlist
GET    /api/waitlist
POST   /api/waitlist
PATCH  /api/waitlist/:id/status

# Online Booking
GET    /api/booking/appointment-types?clinicId=...
GET    /api/booking/available-slots?clinicId=...&appointmentTypeId=...&date=...
POST   /api/booking/book
```

### Patient Portal
```bash
# Insurance
GET    /api/insurance/patient/:patientId
POST   /api/insurance

# Family Linking
GET    /api/family/:patientId
POST   /api/family/link
DELETE /api/family/unlink/:primaryPatientId/:memberId

# Consent Forms
GET    /api/consent-forms/patient/:patientId
PATCH  /api/consent-forms/:id/sign

# Documents
POST   /api/documents/upload
```

---

## 🗄️ Database Models Quick Reference

### Core Models
- **Patient** - Patient information, insurance, family links
- **Appointment** - Scheduling with operatory, recurring, billing
- **Provider** - Healthcare providers
- **User** - System users with roles and permissions

### Clinical Models
- **MedicalHistory** - Medical records, allergies, medications
- **DentalChart** - Odontogram with versioning
- **TreatmentPlan** - Multi-phase treatment plans
- **ClinicalNote** - SOAP notes with templates
- **Prescription** - Medication prescriptions
- **ConsentForm** - Digital consent forms

### System Models
- **AuditLog** - System activity tracking
- **Session** - User session management
- **Insurance** - Insurance information
- **Operatory** - Room/chair management
- **Waitlist** - Appointment waitlist

---

## 👥 Roles & Permissions

### Roles
1. `super_admin` - Full access
2. `admin` - Clinic administration
3. `manager` - Operations management
4. `dentist` - Clinical access
5. `hygienist` - Preventive care
6. `receptionist` - Scheduling
7. `lab_technician` - Lab work
8. `assistant` - Support

### Permission Categories
- `patients` - Patient management
- `appointments` - Scheduling
- `clinical` - Clinical records
- `prescriptions` - Prescriptions
- `billing` - Billing
- `reports` - Reports
- `users` - User management
- `settings` - System settings
- `audit` - Audit logs
- `inventory` - Inventory
- `analytics` - Analytics

---

## 🎨 Frontend Components

### Clinical Components
```typescript
// Dental Chart
import { DentalChartView } from '@/components/Clinical/DentalChart';

// Treatment Plan
import { TreatmentPlanBuilder, TreatmentPlanView } from '@/components/Clinical/TreatmentPlan';

// Clinical Notes
import { ClinicalNoteEditor, NotesTimeline } from '@/components/Clinical/ClinicalNotes';

// Medical History
import { MedicalHistoryForm, AllergyAlert } from '@/components/Clinical/MedicalHistory';
```

### Scheduling Components
```typescript
// Calendar
import { ColorCodedCalendar, WaitlistPanel } from '@/components/Calendar/Enhanced';

// Booking
import { TreatmentTypeSelector, ProviderSelector, TimeSlotPicker } from '@/components/Booking';
```

### Patient Portal Components
```typescript
import { InsuranceForm, FamilyLinking, ConsentFormViewer, DocumentUpload } from '@/components/PatientPortal';
```

---

## 🔐 Security Features

### MFA Setup Flow
1. User enables MFA: `POST /api/mfa/setup`
2. Scan QR code with authenticator app
3. Verify with code: `POST /api/mfa/verify`
4. Save backup codes

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Expires after 90 days
- Cannot reuse last 5 passwords

### Session Management
- Maximum 5 concurrent sessions per user
- 7-day session expiration
- Device tracking (browser, OS, device)
- Force logout capability

---

## 📊 Common Queries

### Get Patient's Complete Medical Record
```javascript
const patientId = '...';

// Medical History
const medicalHistory = await fetch(`/api/medical-history/patient/${patientId}`);

// Dental Charts
const dentalCharts = await fetch(`/api/dental-charts/patient/${patientId}`);

// Treatment Plans
const treatmentPlans = await fetch(`/api/treatment-plans/patient/${patientId}`);

// Clinical Notes
const clinicalNotes = await fetch(`/api/clinical-notes/patient/${patientId}`);

// Prescriptions
const prescriptions = await fetch(`/api/prescriptions/patient/${patientId}`);
```

### Get Available Appointment Slots
```javascript
const slots = await fetch(
  `/api/booking/available-slots?` +
  `clinicId=${clinicId}&` +
  `appointmentTypeId=${typeId}&` +
  `date=${date.toISOString()}&` +
  `providerId=${providerId}` // optional
);
```

### Check User Permissions
```javascript
const hasPermission = await fetch(
  `/api/permissions/check?` +
  `permission=patients.write`
);
```

---

## 🧪 Testing Commands

```bash
# Run all tests
npm run test:all

# Frontend tests
npm run test:frontend
npm run test:frontend:watch
npm run test:frontend:coverage

# Backend tests
cd backend && npm test
npm run test:unit
npm run test:integration
npm run test:e2e

# E2E tests
npm run test:e2e
npm run cy:open
```

---

## 🐛 Common Issues & Solutions

### Issue: MongoDB Connection Failed
```bash
# Check MongoDB is running
mongod --version

# Check connection string in .env
DATABASE_URL=mongodb://localhost:27017/topsmile
```

### Issue: JWT Token Invalid
```bash
# Ensure JWT_SECRET is set and matches between requests
# Check token expiration (default 1 hour)
# Verify Authorization header format: "Bearer <token>"
```

### Issue: CORS Error
```bash
# Check FRONTEND_URL in backend/.env
FRONTEND_URL=http://localhost:3000

# Verify CORS configuration in backend/src/app.ts
```

### Issue: MFA Not Working
```bash
# Verify otplib is installed
npm list otplib

# Check system time is synchronized
# Authenticator apps require accurate time
```

---

## 📦 Dependencies

### Critical Backend Dependencies
```json
{
  "express": "4.21.2",
  "mongoose": "8.18.0",
  "jsonwebtoken": "9.0.2",
  "bcrypt": "6.0.0",
  "otplib": "^12.0.1",
  "qrcode": "^1.5.3",
  "twilio": "^4.19.0"
}
```

### Critical Frontend Dependencies
```json
{
  "react": "18.2.0",
  "@tanstack/react-query": "5.89.0",
  "react-router-dom": "6.30.1",
  "framer-motion": "10.16.5"
}
```

---

## 🔧 Configuration Files

### Backend Configuration
- `backend/.env` - Environment variables
- `backend/src/config/database.ts` - Database configuration
- `backend/src/config/permissions.ts` - Role permissions
- `backend/src/config/cdtCodes.ts` - CDT procedure codes
- `backend/src/config/noteTemplates.ts` - Clinical note templates

### Frontend Configuration
- `.env` - Frontend environment variables
- `src/config/` - Application configuration

---

## 📞 Support Resources

### Documentation
- Implementation Summary: `/docs/IMPLEMENTATION_SUMMARY.md`
- Enhancement Plan: `/docs/topsmile-enhancement-plan.md`
- Implementation Schedule: `/docs/implementation-schedule.md`

### Code References
- Type Definitions: `/packages/types/src/index.ts`
- API Routes: `/backend/src/routes/`
- Components: `/src/components/`

---

## 🎯 Development Workflow

### Adding a New Feature
1. Define types in `/packages/types/src/index.ts`
2. Create model in `/backend/src/models/`
3. Create service in `/backend/src/services/` (if needed)
4. Create routes in `/backend/src/routes/`
5. Mount routes in `/backend/src/app.ts`
6. Create frontend components in `/src/components/`
7. Add tests

### Code Style Guidelines
- **Backend**: 4 spaces indentation
- **Frontend**: 2 spaces indentation
- **Language**: Portuguese for user-facing messages, English for code
- **Naming**: camelCase for variables/functions, PascalCase for types/components
- **Comments**: JSDoc for public APIs

---

**Quick Reference Version**: 1.0  
**Last Updated**: December 2024
