# TopSmile Developer Guide

**Version:** 1.0.0  
**Last Updated:** 2024  
**Document Type:** Developer Onboarding

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Environment Setup](#development-environment-setup)
3. [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
5. [Coding Standards](#coding-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)
9. [Contribution Guidelines](#contribution-guidelines)

---

## Getting Started

### Prerequisites

- **Node.js:** 18.0.0 or higher
- **npm:** 9.0.0 or higher
- **MongoDB:** 5.0 or higher (local or Atlas)
- **Redis:** 6.0 or higher (optional for development)
- **Git:** Latest version

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-org/topsmile.git
cd topsmile

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
cp backend/.env.example backend/.env

# Start MongoDB (if local)
mongod --dbpath /path/to/data

# Start development servers
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## Development Environment Setup

### 1. Install Dependencies

```bash
# Root dependencies (frontend)
npm install

# Backend dependencies
cd backend
npm install
cd ..

# Shared types package
cd packages/types
npm install
cd ../..
```

### 2. Configure Environment Variables

#### Frontend (.env)

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development

# Stripe (for payment testing)
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_key_here

# Feature Flags
REACT_APP_ENABLE_MOCK_API=false
```

#### Backend (backend/.env)

```bash
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=mongodb://localhost:27017/topsmile
MONGODB_URI=mongodb://localhost:27017/topsmile

# Redis (optional in development)
REDIS_URL=redis://localhost:6379

# JWT Secrets (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_64_character_secret_here
JWT_REFRESH_SECRET=your_64_character_refresh_secret_here
PATIENT_JWT_SECRET=your_64_character_patient_secret_here

# Token Expiration
ACCESS_TOKEN_EXPIRES=15m
PATIENT_ACCESS_TOKEN_EXPIRES=24h
REFRESH_TOKEN_EXPIRES_DAYS=7

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email Configuration (Development)
SENDGRID_API_KEY=your_sendgrid_key_or_leave_empty_for_ethereal
FROM_EMAIL=noreply@topsmile.com
ADMIN_EMAIL=admin@topsmile.com

# SMS Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890

# Security
COOKIE_SECURE=false
TRUST_PROXY=0

# Logging
LOG_LEVEL=debug
ENABLE_REQUEST_LOGGING=true
DETAILED_ERRORS=true
```

### 3. Database Setup

#### Local MongoDB

```bash
# Start MongoDB
mongod --dbpath /path/to/data

# Create database and admin user
mongosh
use topsmile
db.createUser({
  user: "topsmile_admin",
  pwd: "secure_password",
  roles: ["readWrite", "dbAdmin"]
})
```

#### MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Add IP whitelist (0.0.0.0/0 for development)
4. Get connection string
5. Update DATABASE_URL in .env

### 4. Generate Secrets

```bash
# Generate JWT secrets
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('PATIENT_JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Create Admin User

```bash
cd backend
node scripts/createAdmin.js
```

Follow prompts to create your first admin user.

---

## Project Structure

### Monorepo Organization

```
topsmile/
├── src/                          # Frontend source
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   ├── contexts/                 # React contexts
│   ├── store/                    # Zustand stores
│   ├── services/                 # API services
│   ├── hooks/                    # Custom hooks
│   ├── layouts/                  # Layout components
│   ├── features/                 # Feature modules
│   ├── styles/                   # Global styles
│   └── utils/                    # Utility functions
├── backend/                      # Backend source
│   ├── src/
│   │   ├── routes/               # API routes
│   │   ├── services/             # Business logic
│   │   ├── models/               # Database models
│   │   ├── middleware/           # Express middleware
│   │   ├── config/               # Configuration
│   │   ├── utils/                # Utilities
│   │   └── validation/           # Validation schemas
│   └── tests/                    # Backend tests
├── packages/
│   └── types/                    # Shared TypeScript types
├── cypress/                      # E2E tests
├── docs/                         # Documentation
└── scripts/                      # Build/utility scripts
```

### Key Directories Explained

#### Frontend

- **components/**: Reusable UI components organized by feature
- **pages/**: Top-level page components (one per route)
- **contexts/**: React Context providers for global state
- **store/**: Zustand stores for client-side state management
- **services/**: API client and HTTP utilities
- **hooks/**: Custom React hooks for shared logic
- **features/**: Feature-based modules with related logic

#### Backend

- **routes/**: Express route handlers organized by domain
- **services/**: Business logic layer (called by routes)
- **models/**: Mongoose schemas and models
- **middleware/**: Express middleware (auth, validation, etc.)
- **config/**: Configuration files and environment setup

---

## Development Workflow

### Starting Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm start              # Frontend only
npm run dev:backend    # Backend only
```

### Making Changes

1. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes following coding standards**

3. **Run tests**
   ```bash
   npm run test:all
   ```

4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add patient search functionality"
   ```

5. **Push and create pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): implement two-factor authentication
fix(appointments): resolve double-booking issue
docs(api): update authentication endpoints
refactor(services): extract email service logic
test(patients): add integration tests for patient CRUD
```

---

## Coding Standards

### TypeScript

```typescript
// ✅ Good: Explicit types
interface PatientData {
  name: string;
  email: string;
  phone: string;
}

function createPatient(data: PatientData): Promise<Patient> {
  return patientService.create(data);
}

// ❌ Bad: Implicit any
function createPatient(data) {
  return patientService.create(data);
}
```

### React Components

```typescript
// ✅ Good: Functional component with TypeScript
interface PatientCardProps {
  patient: Patient;
  onEdit: (id: string) => void;
}

const PatientCard: React.FC<PatientCardProps> = React.memo(({ patient, onEdit }) => {
  const handleEdit = useCallback(() => {
    onEdit(patient.id);
  }, [patient.id, onEdit]);

  return (
    <div className="patient-card">
      <h3>{patient.name}</h3>
      <button onClick={handleEdit}>Editar</button>
    </div>
  );
});

export default PatientCard;
```

### Backend Services

```typescript
// ✅ Good: Service class with error handling
class PatientService {
  async create(data: CreatePatientDTO): Promise<Patient> {
    try {
      // Validate
      if (!data.email) {
        throw new ValidationError('E-mail é obrigatório');
      }

      // Check duplicates
      const existing = await Patient.findOne({ email: data.email });
      if (existing) {
        throw new ConflictError('Paciente já existe');
      }

      // Create
      const patient = new Patient(data);
      await patient.save();

      // Side effects
      await emailService.sendWelcome(patient.email);

      return patient;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error('Error creating patient', { error, data });
      throw new AppError('Erro ao criar paciente', 500);
    }
  }
}
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Variables | camelCase | `patientData`, `isLoading` |
| Functions | camelCase | `handleSubmit`, `fetchPatients` |
| Components | PascalCase | `PatientCard`, `AppointmentForm` |
| Interfaces | PascalCase | `PatientData`, `ApiResponse` |
| Types | PascalCase | `UserRole`, `AppointmentStatus` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_URL` |
| Files | Match content | `PatientCard.tsx`, `authService.ts` |
| CSS Classes | kebab-case | `patient-card`, `form-group` |

---

## Testing Guidelines

### Unit Tests

```typescript
// Test file: patientService.test.ts
describe('PatientService', () => {
  describe('create', () => {
    it('should create patient with valid data', async () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890'
      };

      const patient = await patientService.create(data);

      expect(patient).toHaveProperty('id');
      expect(patient.name).toBe(data.name);
      expect(patient.email).toBe(data.email);
    });

    it('should throw ValidationError for missing email', async () => {
      const data = {
        name: 'John Doe',
        phone: '1234567890'
      };

      await expect(patientService.create(data as any))
        .rejects.toThrow(ValidationError);
    });
  });
});
```

### Integration Tests

```typescript
// Test file: patients.integration.test.ts
describe('POST /api/patients', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = await getAuthToken('admin@example.com', 'password');
  });

  it('should create patient when authenticated', async () => {
    const response = await request(app)
      .post('/api/patients')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Test Patient',
        email: 'test@example.com',
        phone: '1234567890'
      })
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
  });

  it('should return 401 when not authenticated', async () => {
    await request(app)
      .post('/api/patients')
      .send({
        name: 'Test Patient',
        email: 'test@example.com'
      })
      .expect(401);
  });
});
```

### Running Tests

```bash
# Run all tests
npm run test:all

# Frontend tests
npm run test:frontend
npm run test:frontend:coverage

# Backend tests
npm run test:backend
npm run test:backend:coverage

# E2E tests
npm run test:e2e
npm run cy:open

# Watch mode
npm run test:frontend -- --watch
```

---

## Common Tasks

### Adding a New API Endpoint

1. **Define types** in `packages/types/src/`
2. **Create model** in `backend/src/models/`
3. **Create service** in `backend/src/services/`
4. **Create route** in `backend/src/routes/`
5. **Add to API service** in `src/services/apiService.ts`
6. **Create frontend hook** in `src/hooks/`
7. **Write tests**

Example:

```typescript
// 1. Type (packages/types/src/index.ts)
export interface Prescription {
  id: string;
  patientId: string;
  medication: string;
  dosage: string;
  instructions: string;
  createdAt: Date;
}

// 2. Model (backend/src/models/Prescription.ts)
const PrescriptionSchema = new Schema({
  patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  medication: { type: String, required: true },
  dosage: { type: String, required: true },
  instructions: String,
}, { timestamps: true });

export const Prescription = mongoose.model('Prescription', PrescriptionSchema);

// 3. Service (backend/src/services/prescriptionService.ts)
class PrescriptionService {
  async create(data: CreatePrescriptionDTO) {
    const prescription = new Prescription(data);
    return await prescription.save();
  }
}

// 4. Route (backend/src/routes/clinical/prescriptions.ts)
router.post('/', authenticate, async (req, res) => {
  const prescription = await prescriptionService.create(req.body);
  res.status(201).json({ success: true, data: prescription });
});

// 5. API Service (src/services/apiService.ts)
export const apiService = {
  prescriptions: {
    create: async (data: CreatePrescriptionDTO) =>
      request('/api/prescriptions', { method: 'POST', body: JSON.stringify(data) })
  }
};

// 6. Hook (src/hooks/usePrescriptions.ts)
export const useCreatePrescription = () => {
  return useMutation({
    mutationFn: (data: CreatePrescriptionDTO) =>
      apiService.prescriptions.create(data)
  });
};
```

### Adding a New Page

1. **Create page component** in `src/pages/`
2. **Add route** in `src/routes/index.tsx`
3. **Update App.tsx** with new route
4. **Add navigation link** if needed

### Database Migrations

```bash
# Create migration script
touch backend/scripts/migrations/001-add-field.js

# Run migration
node backend/scripts/migrations/001-add-field.js
```

---

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Find process using port
lsof -i :3000
lsof -i :5000

# Kill process
kill -9 <PID>
```

#### MongoDB Connection Failed

```bash
# Check MongoDB is running
mongosh

# Check connection string
echo $DATABASE_URL

# Restart MongoDB
sudo systemctl restart mongod
```

#### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force
```

#### TypeScript Errors

```bash
# Rebuild types package
cd packages/types
npm run build
cd ../..

# Restart TypeScript server in IDE
# VS Code: Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

---

## Contribution Guidelines

### Before Submitting PR

1. ✅ Code follows style guide
2. ✅ All tests pass
3. ✅ New tests added for new features
4. ✅ Documentation updated
5. ✅ No console.log statements
6. ✅ TypeScript types are explicit
7. ✅ Commit messages follow convention

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### Code Review Process

1. Submit PR with clear description
2. Automated tests run via GitHub Actions
3. At least one approval required
4. Address review comments
5. Squash and merge

---

## Related Documents

- [01-System-Architecture-Overview.md](./01-System-Architecture-Overview.md)
- [04-Frontend-Architecture.md](./04-Frontend-Architecture.md)
- [05-Backend-Architecture.md](./05-Backend-Architecture.md)
- [11-Comprehensive-Improvement-Analysis.md](./11-Comprehensive-Improvement-Analysis.md)

---

## Changelog

### Version 1.0.0 (2024)
- Initial developer guide
- Setup instructions
- Coding standards
- Testing guidelines
- Common tasks and troubleshooting
