# TopSmile - Dental Clinic Management System

A comprehensive dental clinic management platform built with React, Node.js, and TypeScript.

## Features

- **Patient Management**: Registration, profiles, and medical history
- **Appointment Scheduling**: Real-time booking with provider availability
- **Provider Dashboard**: Schedule management and patient coordination
- **Payment Integration**: Stripe-powered billing system
- **Role-Based Access**: Admin, manager, and staff permissions

## Tech Stack

**Frontend**: React 18, TypeScript, TanStack Query, Framer Motion  
**Backend**: Node.js, Express, MongoDB, Redis  
**Testing**: Jest, Cypress, Testing Library  
**Payments**: Stripe Integration

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm >= 9.0.0

### Installation

```bash
# Clone repository
git clone <repository-url>
cd topsmile

# Install dependencies
npm install

# Setup environment
cp .env.example .env
cp backend/.env.example backend/.env
```

### Environment Variables

**Frontend (.env)**
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Backend (backend/.env)**
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/topsmile
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_...
```

### Development

```bash
# Start both frontend and backend
npm run dev

# Frontend only
npm start

# Backend only
cd backend && npm run dev
```

## Project Structure

```
topsmile/
├── src/                    # React frontend
├── backend/               # Express API
├── packages/types/        # Shared TypeScript types
├── cypress/              # E2E tests
└── public/               # Static assets
```

## Testing

```bash
# All tests
npm run test:all

# Frontend tests
npm run test:frontend

# Backend tests
cd backend && npm test

# E2E tests
npm run test:e2e
```

## API Documentation

The API follows RESTful conventions with JWT authentication:

- `POST /api/auth/login` - User authentication
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `GET /api/providers` - List providers
- `POST /api/patients` - Create patient

## 📚 Documentation

### Comprehensive Guides
- **[Implementation Summary](docs/IMPLEMENTATION_SUMMARY.md)** - Complete overview of all implemented features
- **[Quick Reference](docs/QUICK_REFERENCE.md)** - Developer quick reference guide
- **[Deployment Checklist](docs/DEPLOYMENT_CHECKLIST.md)** - Production deployment guide
- **[Enhancement Plan](docs/topsmile-enhancement-plan.md)** - Original enhancement plan
- **[Implementation Schedule](docs/implementation-schedule.md)** - Detailed task tracking

### Key Highlights
- ✅ **67% Complete** - 16 of 24 weeks implemented
- ✅ **11 New Models** - Comprehensive data structure
- ✅ **50+ Indexes** - Optimized database performance
- ✅ **40+ Components** - Rich user interface
- ✅ **20+ API Endpoints** - Extensive backend functionality

## 🎯 Implemented Features

### Phase 1: Foundation (Weeks 1-4) ✅
- Enhanced authentication (MFA, SMS, password policies)
- Role-based access control (8 roles, 11 permission types)
- Audit logging and session management
- 9 new database models

### Phase 2: Clinical Features (Weeks 5-10) ✅
- Interactive dental charting with versioning
- Multi-phase treatment planning with CDT codes
- SOAP clinical notes with templates
- Medical history with allergy alerts

### Phase 3: Enhanced Scheduling (Weeks 11-14) ✅
- Color-coded calendar with operatory management
- Waitlist system with priority levels
- Recurring appointments
- Online booking with provider selection

### Phase 4: Patient Portal (Weeks 15-16) ✅
- Insurance management (primary/secondary)
- Family account linking
- Digital consent form signing
- Document upload

## Contributing

1. Follow TypeScript strict mode
2. Use Portuguese for user-facing messages
3. Include comprehensive tests
4. Follow existing code patterns
5. See [Quick Reference](docs/QUICK_REFERENCE.md) for development workflow

## License

Private - TopSmile Dental Clinic Management System