# TopSmile - Dental Clinic Management System

A comprehensive dental clinic management system designed to streamline operations for dental practices. Provides a complete solution for managing appointments, patient records, clinical workflows, and administrative tasks.

## 🎯 Key Features

- **Patient Management** - Registration, profiles, medical history, and clinical records
- **Patient Portal** - Self-service booking, records access, and communication
- **Appointment System** - Real-time scheduling, provider availability, reminders
- **Clinical Workflows** - Treatment planning, documentation, provider-specific workflows
- **Multi-Role Access** - Admin, Provider, Staff, and Patient roles with granular permissions
- **Payment Integration** - Stripe integration for payment processing
- **Security & Compliance** - JWT authentication, CSRF protection, rate limiting, data sanitization

## 🏗️ Architecture

**Monorepo Structure:**
- **Frontend** (`/src`) - React 18 + TypeScript application
- **Backend** (`/backend`) - Express + TypeScript API server
- **Shared Types** (`/packages/types`) - Common TypeScript interfaces

**Tech Stack:**
- **Frontend**: React 18.2, TypeScript 4.9.5, Zustand, TanStack Query, React Router 6
- **Backend**: Node.js >=18, Express 4.21, TypeScript 5.9.2, Mongoose 8.18
- **Database**: MongoDB (primary), Redis (caching/sessions)
- **Testing**: Jest, Cypress, Testing Library, Supertest
- **Security**: JWT, bcrypt, helmet, rate limiting, CSRF protection

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** (latest stable)
- **Redis** (latest stable)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd topsmile
npm install
```

### 2. Environment Configuration

**Backend** (`/backend/.env`):
```env
# Server
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb://localhost:27017/topsmile
DATABASE_NAME=topsmile

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Secrets (generate secure random strings)
JWT_SECRET=your-jwt-secret-min-64-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-64-chars
PATIENT_JWT_SECRET=your-patient-jwt-secret-min-64-chars
PATIENT_JWT_REFRESH_SECRET=your-patient-refresh-secret-min-64-chars

# Token Expiration
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES_DAYS=7
PATIENT_ACCESS_TOKEN_EXPIRES=30m
PATIENT_REFRESH_TOKEN_EXPIRES_DAYS=30
MAX_REFRESH_TOKENS_PER_USER=5

# CSRF
CSRF_SECRET=your-csrf-secret

# Email (Nodemailer)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=noreply@topsmile.com

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`/.env`):
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
```

### 3. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm start                    # Frontend only (port 3000)
npm run dev:backend         # Backend only (port 5000)
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs

## 📦 Available Scripts

### Development
```bash
npm run dev                 # Start both frontend and backend
npm start                   # Start frontend dev server
npm run dev:backend         # Start backend dev server with nodemon
```

### Building
```bash
npm run build:all           # Build both applications
npm run build               # Build frontend only
npm run build:backend       # Build backend only
```

### Testing
```bash
npm run test:all            # Run all tests
npm run test:frontend       # Run frontend tests
npm run test:backend        # Run backend tests
npm run test:coverage       # Full coverage report
npm run test:ci             # CI test suite
npm run test:e2e            # Run Cypress E2E tests
```

### Code Quality
```bash
npm run lint                # Lint code
npm run type-check          # TypeScript type checking
npm run analyze             # Bundle analysis
```

## 🔐 Authentication

TopSmile implements dual authentication systems:

### Staff Authentication
- **Roles**: super_admin, admin, provider, staff
- **Token Lifetime**: 15min access, 7 days refresh
- **Endpoints**: `/api/auth/*`

### Patient Authentication
- **Role**: patient
- **Token Lifetime**: 30min access, 30 days refresh
- **Endpoints**: `/api/patient-auth/*`

**Security Features:**
- JWT with HttpOnly cookies
- Refresh token rotation
- Redis-based token blacklist
- Rate limiting (5 login attempts/15min, 20 refresh attempts/15min)
- CSRF protection
- Password hashing with bcrypt

## 🗄️ Database Schema

### Core Models
- **User** - Staff users (admin, provider, staff)
- **Patient** - Patient records and medical history
- **Provider** - Dentist/provider profiles and specialties
- **Appointment** - Appointment scheduling and status
- **Clinic** - Multi-tenant clinic configuration
- **RefreshToken** - Token management and rotation

**Indexes:**
- User: email (unique), clinicId+role, clinicId+isActive
- Provider: clinicId+isActive, clinicId+specialties, email (sparse)
- Patient: email (unique), clinicId+isActive, phone
- Appointment: clinicId+date+status, patientId, providerId

## 🛣️ API Versioning

API supports versioning via URL path or Accept header:

```bash
# URL path versioning
GET /api/v1/appointments

# Header versioning
GET /api/appointments
Accept: application/vnd.topsmile.v1+json
```

Current version: **v1**

## 📚 Project Structure

```
topsmile/
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   ├── features/                 # Feature modules
│   ├── services/                 # API services
│   ├── contexts/                 # React contexts
│   ├── store/                    # Zustand stores
│   ├── hooks/                    # Custom hooks
│   ├── layouts/                  # Page layouts
│   └── routes/                   # Route definitions
├── backend/                      # Backend Express application
│   └── src/
│       ├── routes/               # API route handlers
│       ├── services/             # Business logic
│       ├── models/               # Mongoose models
│       ├── middleware/           # Express middleware
│       ├── config/               # Configuration
│       └── utils/                # Utilities
├── packages/
│   └── types/                    # Shared TypeScript types
├── docs/                         # Documentation
│   ├── architecture/             # Architecture diagrams
│   └── review/                   # Code review reports
└── .github/workflows/            # CI/CD pipelines
```

## 🧪 Testing Strategy

- **Unit Tests** - Jest for components and services
- **Integration Tests** - Supertest for API endpoints
- **E2E Tests** - Cypress for user workflows
- **Accessibility Tests** - jest-axe for a11y compliance
- **Performance Tests** - k6 for load testing
- **Contract Tests** - Pact for API contracts

**Coverage Targets:**
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## 🔧 Development Guidelines

### Code Style
- **Indentation**: 4 spaces
- **Naming**: camelCase (variables/functions), PascalCase (types/components), UPPER_SNAKE_CASE (constants)
- **Imports**: Grouped (external → internal → types)
- **Messages**: All user-facing messages in Portuguese

### TypeScript
- Explicit types for complex objects
- No `any` without justification
- Type guards for runtime validation
- Shared types in `/packages/types`

### API Routes
- Authentication middleware on protected routes
- express-validator for input validation
- Swagger documentation for all endpoints
- Consistent response format (success/error)

### Error Handling
- Custom error classes (AppError, ValidationError, etc.)
- Try-catch blocks for async operations
- Portuguese error messages
- Centralized error middleware

## 📖 Documentation

- **API Docs**: http://localhost:5000/api-docs (Swagger UI)
- **Architecture**: `/docs/architecture/`
- **Code Reviews**: `/docs/review/`
- **Guidelines**: `/.amazonq/rules/memory-bank/`

## 🚢 Deployment

CI/CD pipelines configured in `.github/workflows/`:
- `test.yml` - Automated testing
- `coverage.yml` - Code coverage
- `quality.yml` - Code quality checks
- `security-scan.yml` - Security scanning
- `deploy.yml` - Deployment automation

## 🤝 Contributing

1. Follow the development guidelines in `/.amazonq/rules/memory-bank/`
2. Write tests for new features
3. Ensure all tests pass: `npm run test:all`
4. Update API documentation for endpoint changes
5. Use Portuguese for user-facing messages

## 📝 License

[Add your license here]

## 👥 Team

[Add team information here]

## 📞 Support

[Add support contact information here]
