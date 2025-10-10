# TopSmile - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### Installation
```bash
# Clone and install
git clone <repository-url>
cd topsmile
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration
```

### Required Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_VERSION=1.0.0
```

### Optional Environment Variables
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG=false
```

## 🏃 Running the Application

### Development Mode
```bash
# Start frontend only
npm start

# Start backend only
npm run dev:backend

# Start both (recommended)
npm run dev
```

### Production Build
```bash
npm run build
```

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Frontend tests
npm run test:frontend

# Backend tests
npm run test:backend

# All tests
npm run test:all

# E2E tests
npm run test:e2e
```

## 📁 Project Structure

```
topsmile/
├── src/                          # Frontend
│   ├── components/               # Reusable components
│   ├── pages/                    # Page components
│   │   ├── Patient/              # Patient portal pages
│   │   │   ├── Dashboard/
│   │   │   ├── Appointment/
│   │   │   ├── MedicalRecords/   # NEW
│   │   │   ├── Prescriptions/    # NEW
│   │   │   └── Documents/        # NEW
│   │   └── Admin/                # Admin pages
│   ├── services/                 # API services
│   ├── contexts/                 # React contexts
│   ├── hooks/                    # Custom hooks
│   ├── utils/                    # Utilities
│   │   ├── validateEnv.ts        # NEW
│   │   └── toast.ts              # NEW
│   └── routes/                   # Route definitions
├── backend/                      # Backend API
└── packages/types/               # Shared types
```

## 🔑 Key Features

### Patient Portal
- ✅ Dashboard with upcoming appointments
- ✅ Appointment booking with real-time slots
- ✅ Medical records view
- ✅ Prescriptions list
- ✅ Documents and consent forms
- ✅ Profile management

### Admin Portal
- ✅ Patient management
- ✅ Provider management
- ✅ Appointment calendar
- ✅ Contact management
- ✅ Operatory management
- ✅ Waitlist management

## 🛠️ Common Tasks

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `src/routes/index.tsx`
3. Add route in `src/App.tsx`
4. Update navigation if needed

### Adding a New API Endpoint
1. Add method to `src/services/apiService.ts`
2. Create custom hook in `src/hooks/useApiState.ts` (optional)
3. Use in component with proper error handling

### Using Toast Notifications
```typescript
import { toast } from '../utils/toast';

// Success
toast.success('Operação realizada com sucesso!');

// Error
toast.error('Erro ao processar requisição');

// Warning
toast.warning('Atenção: verifique os dados');

// Info
toast.info('Informação importante');
```

### Environment Validation
Environment variables are automatically validated on startup. If required variables are missing, the app will throw an error with details.

## 🔐 Authentication

### Staff Login
- Endpoint: `/api/auth/login`
- Roles: super_admin, admin, manager, dentist, assistant
- Token lifetime: 15min access, 7 days refresh

### Patient Login
- Endpoint: `/api/patient-auth/login`
- Role: patient
- Token lifetime: 30min access, 30 days refresh

### Using Auth in Components
```typescript
// Staff auth
import { useAuthState, useAuthActions } from '../contexts/AuthContext';

const { user, isAuthenticated, loading } = useAuthState();
const { login, logout } = useAuthActions();

// Patient auth
import { usePatientAuth } from '../contexts/PatientAuthContext';

const { patientUser, isAuthenticated, login, logout } = usePatientAuth();
```

## 🎨 Styling

### CSS Variables
Use CSS variables defined in `src/styles/variables.css`:
```css
color: var(--primary-color);
background: var(--background-color);
```

### Component Styles
Each component has its own CSS file:
```
Component.tsx
Component.css
```

## 🐛 Troubleshooting

### Environment Variable Not Found
```bash
# Check .env file exists
ls -la .env

# Verify variable name starts with REACT_APP_
# Restart dev server after changes
```

### Type Errors
```bash
# Run type check
npm run type-check

# Check imports from @topsmile/types
```

### API Connection Issues
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check REACT_APP_API_URL in .env
```

### CORS Errors
Backend must allow frontend origin in CORS configuration.

## 📚 Additional Resources

- [Full Documentation](./docs/)
- [API Documentation](http://localhost:5000/api-docs)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [Development Guidelines](./.amazonq/rules/memory-bank/guidelines.md)

## 🆘 Getting Help

1. Check console for errors
2. Review implementation summary
3. Check API documentation
4. Review development guidelines
5. Check backend logs

## 🎯 Quick Commands Reference

```bash
# Development
npm run dev                    # Start both frontend and backend
npm start                      # Frontend only
npm run dev:backend           # Backend only

# Testing
npm run type-check            # TypeScript validation
npm run test:all              # All tests
npm run test:e2e              # E2E tests

# Building
npm run build                 # Build frontend
npm run build:all             # Build everything

# Quality
npm run lint                  # Lint code
npm run lint:fix              # Fix linting issues
```

## ✅ Verification Checklist

Before starting development:
- [ ] Node.js >= 18.0.0 installed
- [ ] npm >= 9.0.0 installed
- [ ] MongoDB running
- [ ] Redis running
- [ ] .env file configured
- [ ] Dependencies installed (`npm install`)
- [ ] Type check passes (`npm run type-check`)
- [ ] Backend running (`npm run dev:backend`)
- [ ] Frontend running (`npm start`)

You're ready to develop! 🎉
