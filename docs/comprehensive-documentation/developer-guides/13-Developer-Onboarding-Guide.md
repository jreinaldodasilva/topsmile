# TopSmile Developer Onboarding Guide

**Document Version:** 1.0.0  
**Last Updated:** 2024-01-15  
**Status:** ✅ Complete

---

## Welcome to TopSmile! 🎉

This guide will help you set up your development environment and get started contributing to the TopSmile dental clinic management system.

**Estimated Setup Time:** 30-45 minutes

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Project Structure](#project-structure)
4. [Running the Application](#running-the-application)
5. [Development Workflow](#development-workflow)
6. [Testing](#testing)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)
9. [Next Steps](#next-steps)

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | ≥18.0.0 | Runtime environment |
| npm | ≥9.0.0 | Package manager |
| MongoDB | Latest | Primary database |
| Redis | Latest | Cache and sessions |
| Git | Latest | Version control |

### Recommended Tools

- **VS Code** with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - MongoDB for VS Code
  - Thunder Client (API testing)
- **Postman** or **Insomnia** for API testing
- **MongoDB Compass** for database visualization
- **Redis Commander** for Redis visualization

### Installation Instructions

**macOS (using Homebrew):**
```bash
# Install Node.js
brew install node@18

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Install Redis
brew install redis

# Verify installations
node --version  # Should be ≥18.0.0
npm --version   # Should be ≥9.0.0
mongod --version
redis-server --version
```

**Linux (Ubuntu/Debian):**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Install Redis
sudo apt-get install redis-server

# Verify installations
node --version
npm --version
mongod --version
redis-server --version
```

**Windows:**
1. Download and install Node.js from [nodejs.org](https://nodejs.org/)
2. Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
3. Download and install Redis from [redis.io](https://redis.io/download) or use WSL2

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd topsmile
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Configure Environment Variables

**Backend Configuration:**

```bash
# Copy example environment file
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
# Server Configuration
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
JWT_SECRET=your-super-secret-jwt-key-min-64-characters-long-please-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-64-characters-long-please-change-this
PATIENT_JWT_SECRET=your-patient-jwt-secret-min-64-characters-long-please-change-this
PATIENT_JWT_REFRESH_SECRET=your-patient-refresh-secret-min-64-characters-long-please-change-this

# Token Expiration
ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES_DAYS=7
PATIENT_ACCESS_TOKEN_EXPIRES=30m
PATIENT_REFRESH_TOKEN_EXPIRES_DAYS=30
MAX_REFRESH_TOKENS_PER_USER=5

# CSRF
CSRF_SECRET=your-csrf-secret-key

# Email (Development - uses Ethereal)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=noreply@topsmile.local

# SMS (Optional for development)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Stripe (Test mode)
STRIPE_SECRET_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Trust Proxy (for development behind proxy)
TRUST_PROXY=0
```

**Generate Secure Secrets:**

```bash
# Run the secret generator
npm run generate-env-secrets
```

**Frontend Configuration:**

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_test_key
```

### 4. Start Database Services

**MongoDB:**
```bash
# macOS/Linux
mongod --dbpath ~/data/db

# Or as a service
brew services start mongodb-community  # macOS
sudo systemctl start mongod             # Linux
```

**Redis:**
```bash
# macOS/Linux
redis-server

# Or as a service
brew services start redis               # macOS
sudo systemctl start redis              # Linux
```

### 5. Seed Database (Optional)

```bash
cd backend
npm run seed  # If seed script exists
```

---

## Project Structure

```
topsmile/
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   │   ├── Admin/               # Admin dashboard components
│   │   ├── Auth/                # Authentication components
│   │   ├── Booking/             # Appointment booking
│   │   ├── PatientPortal/       # Patient self-service
│   │   └── UI/                  # Base UI elements
│   ├── features/                # Feature modules (business logic)
│   ├── services/                # API communication layer
│   ├── contexts/                # React Context providers
│   ├── store/                   # Zustand state management
│   ├── hooks/                   # Custom React hooks
│   ├── layouts/                 # Page layouts
│   ├── routes/                  # Route configuration
│   └── App.tsx                  # Root component
│
├── backend/                     # Backend Express application
│   └── src/
│       ├── routes/              # API route handlers
│       │   ├── auth/            # Staff authentication
│       │   ├── patient-auth/    # Patient authentication
│       │   ├── scheduling/      # Appointments
│       │   ├── clinical/        # Clinical workflows
│       │   └── admin/           # Admin operations
│       ├── services/            # Business logic layer
│       ├── models/              # Mongoose database models
│       ├── middleware/          # Express middleware
│       ├── config/              # Configuration files
│       ├── utils/               # Utility functions
│       ├── validation/          # Validation schemas
│       └── app.ts               # Express app setup
│
├── packages/
│   └── types/                   # Shared TypeScript types
│       └── src/
│           ├── models/          # Domain model types
│           ├── api/             # API request/response types
│           └── index.ts         # Type exports
│
├── docs/                        # Documentation
├── cypress/                     # E2E tests
└── scripts/                     # Build and utility scripts
```

### Key Directories Explained

**Frontend (`/src`):**
- `components/`: Presentational components organized by feature
- `features/`: Business logic and state management for features
- `services/`: API communication with backend
- `contexts/`: React Context for global state (auth, errors)
- `store/`: Zustand stores for client-side state
- `hooks/`: Reusable custom hooks
- `layouts/`: Page layout wrappers (dashboard, portal, auth)

**Backend (`/backend/src`):**
- `routes/`: Express route definitions (thin layer)
- `services/`: Business logic (thick layer)
- `models/`: Mongoose schemas and models
- `middleware/`: Request processing (auth, validation, errors)
- `config/`: Configuration and constants
- `validation/`: express-validator schemas

**Shared (`/packages/types`):**
- Domain types shared between frontend and backend
- Ensures type consistency across the stack

---

## Running the Application

### Development Mode

**Option 1: Run Everything Together**
```bash
# From project root
npm run dev
```

This starts:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000

**Option 2: Run Separately**

Terminal 1 (Frontend):
```bash
npm start
```

Terminal 2 (Backend):
```bash
npm run dev:backend
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api-docs
- **Health Check**: http://localhost:5000/api/health

### Default Credentials

After seeding, you can use:

**Staff Login:**
- Email: `admin@topsmile.com`
- Password: `Admin123!@#`

**Patient Login:**
- Email: `patient@example.com`
- Password: `Patient123!@#`

---

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Follow the coding standards in [14-Coding-Standards.md](./14-Coding-Standards.md):
- Use TypeScript
- Follow naming conventions (camelCase, PascalCase)
- Write tests for new features
- Add JSDoc comments for complex functions

### 3. Run Tests

```bash
# Frontend tests
npm run test:frontend

# Backend tests
npm run test:backend

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

### 4. Lint and Type Check

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

**Commit Message Format:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

---

## Testing

### Unit Tests

**Frontend:**
```bash
npm run test:frontend
npm run test:frontend:watch  # Watch mode
npm run test:frontend:coverage  # With coverage
```

**Backend:**
```bash
cd backend
npm test
npm run test:watch
npm run test:coverage
```

### Integration Tests

```bash
cd backend
npm run test:integration
```

### E2E Tests

```bash
# Open Cypress UI
npm run cy:open

# Run headless
npm run cy:run
```

### Writing Tests

**Frontend Component Test:**
```typescript
// src/components/Button/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**Backend Service Test:**
```typescript
// backend/tests/unit/services/appointmentService.test.ts
import { appointmentService } from '../../../src/services/scheduling/appointmentService';
import { Appointment } from '../../../src/models/Appointment';

describe('AppointmentService', () => {
  it('creates appointment successfully', async () => {
    const appointmentData = {
      patient: 'patient_id',
      provider: 'provider_id',
      scheduledStart: new Date(),
      duration: 30
    };

    const result = await appointmentService.createAppointment(appointmentData);
    
    expect(result.success).toBe(true);
    expect(result.data).toHaveProperty('_id');
  });
});
```

---

## Common Tasks

### Add a New API Endpoint

1. **Define route** (`backend/src/routes/scheduling/appointments.ts`):
```typescript
router.post('/', authenticate, authorize('admin'), createValidation, async (req, res) => {
  const authReq = req as AuthenticatedRequest;
  const result = await appointmentService.createAppointment(req.body);
  return res.status(201).json(result);
});
```

2. **Implement service** (`backend/src/services/scheduling/appointmentService.ts`):
```typescript
async createAppointment(data: CreateAppointmentDto) {
  const appointment = await Appointment.create(data);
  return { success: true, data: appointment };
}
```

3. **Add validation** (`backend/src/validation/appointment.ts`):
```typescript
export const createValidation = [
  body('patient').isMongoId(),
  body('provider').isMongoId(),
  body('scheduledStart').isISO8601(),
  body('duration').isInt({ min: 15, max: 480 })
];
```

4. **Update frontend service** (`src/services/api/appointmentService.ts`):
```typescript
export const createAppointment = async (data: CreateAppointmentDto) => {
  return apiService.post('/appointments', data);
};
```

### Add a New React Component

1. **Create component** (`src/components/Booking/TimeSlot.tsx`):
```typescript
interface TimeSlotProps {
  time: string;
  available: boolean;
  onSelect: (time: string) => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ time, available, onSelect }) => {
  return (
    <button
      className={`time-slot ${available ? 'available' : 'unavailable'}`}
      onClick={() => onSelect(time)}
      disabled={!available}
    >
      {time}
    </button>
  );
};

export default TimeSlot;
```

2. **Add tests** (`src/components/Booking/TimeSlot.test.tsx`)

3. **Export from index** (`src/components/Booking/index.ts`)

### Add a Database Model

1. **Create model** (`backend/src/models/Waitlist.ts`):
```typescript
import mongoose, { Schema, Document } from 'mongoose';
import { baseSchemaFields, baseSchemaOptions } from './base/baseSchema';

interface IWaitlist extends Document {
  patient: mongoose.Types.ObjectId;
  appointmentType: mongoose.Types.ObjectId;
  preferredDates: Date[];
  status: 'active' | 'fulfilled' | 'cancelled';
}

const WaitlistSchema = new Schema<IWaitlist>({
  ...baseSchemaFields,
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointmentType: { type: Schema.Types.ObjectId, ref: 'AppointmentType', required: true },
  preferredDates: [{ type: Date }],
  status: { type: String, enum: ['active', 'fulfilled', 'cancelled'], default: 'active' }
}, baseSchemaOptions);

WaitlistSchema.index({ patient: 1, status: 1 });

export const Waitlist = mongoose.model<IWaitlist>('Waitlist', WaitlistSchema);
```

2. **Add types** (`packages/types/src/models/waitlist.ts`)

---

## Troubleshooting

### MongoDB Connection Issues

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
mongod --dbpath ~/data/db

# Or as service
brew services start mongodb-community  # macOS
sudo systemctl start mongod             # Linux
```

### Redis Connection Issues

**Error:** `Error: Redis connection to localhost:6379 failed`

**Solution:**
```bash
# Check if Redis is running
redis-cli ping  # Should return PONG

# Start Redis
redis-server

# Or as service
brew services start redis  # macOS
sudo systemctl start redis # Linux
```

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### TypeScript Errors

**Error:** `Cannot find module '@topsmile/types'`

**Solution:**
```bash
# Rebuild types package
cd packages/types
npm run build
cd ../..

# Reinstall dependencies
npm install
```

### Test Failures

**Error:** Tests fail with database connection errors

**Solution:**
```bash
# Ensure test environment is set
export NODE_ENV=test

# Use in-memory MongoDB for tests
# Tests should use mongodb-memory-server
```

---

## Next Steps

### Learn the Codebase

1. **Read Documentation:**
   - [System Architecture Overview](../architecture/01-System-Architecture-Overview.md)
   - [Coding Standards](./14-Coding-Standards.md)
   - [Testing Guide](./15-Testing-Guide.md)

2. **Explore Key Files:**
   - `src/App.tsx` - Frontend entry point
   - `backend/src/app.ts` - Backend entry point
   - `packages/types/src/index.ts` - Shared types

3. **Review Examples:**
   - Look at existing components in `src/components/`
   - Study service implementations in `backend/src/services/`
   - Examine test files for patterns

### Start Contributing

1. **Pick a Task:**
   - Check GitHub Issues for "good first issue" labels
   - Review the [Improvement Report](../improvements/18-Comprehensive-Improvement-Report.md)

2. **Ask Questions:**
   - Use team communication channels
   - Comment on GitHub issues
   - Reach out to team members

3. **Submit Your First PR:**
   - Start with documentation improvements
   - Fix small bugs
   - Add tests for existing code

---

## Useful Commands Reference

```bash
# Development
npm run dev                    # Start both frontend and backend
npm start                      # Frontend only
npm run dev:backend            # Backend only

# Testing
npm run test:all               # All tests
npm run test:frontend          # Frontend tests
npm run test:backend           # Backend tests
npm run test:e2e               # E2E tests
npm run test:coverage          # Coverage report

# Code Quality
npm run lint                   # Lint code
npm run lint:fix               # Fix linting issues
npm run type-check             # TypeScript check

# Building
npm run build                  # Build frontend
npm run build:backend          # Build backend
npm run build:all              # Build everything

# Utilities
npm run generate-secrets       # Generate JWT secrets
npm run analyze                # Analyze bundle size
```

---

## Getting Help

- **Documentation**: Check `/docs` directory
- **API Docs**: http://localhost:5000/api-docs
- **Team Chat**: [Your team communication tool]
- **GitHub Issues**: [Repository issues page]

---

**Welcome aboard! Happy coding! 🚀**
