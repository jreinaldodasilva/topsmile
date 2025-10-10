# TopSmile Quick Reference Guide

**Version:** 1.0.0  
**Last Updated:** 2025-10-10

---

## 🚀 Quick Start Commands

### Development
```bash
# Start both frontend and backend
npm run dev

# Frontend only (port 3000)
npm start

# Backend only (port 5000)
npm run dev:backend
```

### Testing
```bash
# Run all tests
npm run test:all

# Frontend tests
npm run test:frontend
npm run test:frontend:watch
npm run test:frontend:coverage

# Backend tests
npm run test:backend
npm run test:backend:watch
npm run test:backend:coverage

# E2E tests
npm run test:e2e
```

### Building
```bash
# Build everything
npm run build:all

# Frontend only
npm run build

# Backend only
npm run build:backend
```

### Code Quality
```bash
# Lint code
npm run lint

# Type check
npm run type-check

# Bundle analysis
npm run analyze
```

---

## 📁 Project Structure

```
topsmile/
├── src/                    # Frontend (React)
│   ├── components/         # UI components
│   ├── features/           # Feature modules
│   ├── services/           # API services
│   ├── contexts/           # React contexts
│   ├── store/              # Zustand stores
│   ├── hooks/              # Custom hooks
│   └── routes/             # Route config
│
├── backend/                # Backend (Express)
│   └── src/
│       ├── routes/         # API routes
│       ├── services/       # Business logic
│       ├── models/         # Mongoose models
│       ├── middleware/     # Express middleware
│       ├── config/         # Configuration
│       └── utils/          # Utilities
│
└── packages/types/         # Shared TypeScript types
```

---

## 🔑 Key Files

### Configuration
- `backend/src/config/env.ts` - Environment config
- `backend/src/config/constants.ts` - Application constants
- `backend/src/config/logger.ts` - Logging config
- `backend/src/config/featureFlags.ts` - Feature flags

### Entry Points
- `src/index.tsx` - Frontend entry
- `backend/src/app.ts` - Backend entry

### Environment Files
- `.env` - Frontend environment
- `backend/.env` - Backend environment

---

## 🌐 API Endpoints

### Base URLs
- **Development:** http://localhost:5000
- **Frontend:** http://localhost:3000

### Health Checks
```bash
GET /api/health                 # Basic health
GET /api/health/database        # Database health
GET /api/health/metrics         # System metrics (admin only)
```

### Authentication
```bash
POST /api/auth/login            # Staff login
POST /api/auth/logout           # Staff logout
POST /api/auth/refresh          # Refresh token
POST /api/patient-auth/login    # Patient login
POST /api/patient-auth/logout   # Patient logout
```

### API Documentation
- **Swagger UI:** http://localhost:5000/api-docs

---

## 🔐 Environment Variables

### Required (All Environments)
```bash
# Database
DATABASE_URL=mongodb://localhost:27017/topsmile

# JWT Secrets (min 64 characters)
JWT_SECRET=your-jwt-secret-min-64-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-64-chars
PATIENT_JWT_SECRET=your-patient-jwt-secret-min-64-chars

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Required (Production Only)
```bash
# Email
SENDGRID_API_KEY=SG.your-sendgrid-key

# Admin
ADMIN_EMAIL=admin@topsmile.com

# Security
NODE_ENV=production
COOKIE_SECURE=true
```

### Optional
```bash
# Redis
REDIS_URL=redis://localhost:6379

# SMS
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token

# Logging
LOG_LEVEL=info
```

---

## 🛠️ Common Tasks

### Add a New API Endpoint

1. **Create route handler** (`backend/src/routes/`)
```typescript
import { Router } from 'express';
import { authenticate } from '../middleware/auth/auth';

const router = Router();

router.get('/my-endpoint', authenticate, async (req, res) => {
  // Implementation
  res.json({ success: true, data: {} });
});

export default router;
```

2. **Mount route** (`backend/src/app.ts`)
```typescript
import myRoutes from './routes/myRoutes';
app.use('/api/my-resource', authenticate, myRoutes);
```

3. **Add Swagger documentation**
```typescript
/**
 * @swagger
 * /api/my-resource:
 *   get:
 *     summary: Get my resource
 *     tags: [MyResource]
 *     responses:
 *       200:
 *         description: Success
 */
```

### Add a New Database Model

1. **Create model** (`backend/src/models/MyModel.ts`)
```typescript
import { Schema, model } from 'mongoose';
import { baseSchemaFields, baseSchemaOptions } from './base/baseSchema';

const MyModelSchema = new Schema({
  ...baseSchemaFields,
  name: { type: String, required: true },
  // ... other fields
}, baseSchemaOptions);

export const MyModel = model('MyModel', MyModelSchema);
```

2. **Add indexes**
```typescript
MyModelSchema.index({ name: 1, clinic: 1 });
```

3. **Export from index**
```typescript
export { MyModel } from './MyModel';
```

### Add a New Frontend Component

1. **Create component** (`src/components/MyComponent/MyComponent.tsx`)
```typescript
import React from 'react';
import './MyComponent.css';

interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return <div className="my-component">{title}</div>;
};
```

2. **Add styles** (`src/components/MyComponent/MyComponent.css`)
```css
.my-component {
  padding: 1rem;
}
```

3. **Export** (`src/components/MyComponent/index.ts`)
```typescript
export { MyComponent } from './MyComponent';
```

### Add a New Service

1. **Create service** (`backend/src/services/myService.ts`)
```typescript
import { MyModel } from '../models/MyModel';

class MyService {
  async getAll() {
    return await MyModel.find().lean();
  }
  
  async getById(id: string) {
    return await MyModel.findById(id).lean();
  }
}

export const myService = new MyService();
```

2. **Use in route**
```typescript
import { myService } from '../services/myService';

router.get('/', async (req, res) => {
  const data = await myService.getAll();
  res.json({ success: true, data });
});
```

---

## 🧪 Testing Patterns

### Backend Unit Test
```typescript
import { myService } from '../services/myService';

describe('MyService', () => {
  it('should get all items', async () => {
    const result = await myService.getAll();
    expect(result).toBeDefined();
  });
});
```

### Backend Integration Test
```typescript
import request from 'supertest';
import app from '../app';

describe('GET /api/my-resource', () => {
  it('should return 200', async () => {
    const response = await request(app)
      .get('/api/my-resource')
      .set('Authorization', 'Bearer token');
    
    expect(response.status).toBe(200);
  });
});
```

### Frontend Component Test
```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders title', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

---

## 🐛 Debugging

### Backend Debugging
```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev:backend

# Check logs
tail -f backend/logs/app.log
```

### Frontend Debugging
```bash
# React DevTools
# Install browser extension

# Redux DevTools (if using Redux)
# Install browser extension
```

### Database Debugging
```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/topsmile

# Show collections
show collections

# Query data
db.appointments.find().pretty()
```

---

## 📊 Monitoring

### Health Checks
```bash
# Basic health
curl http://localhost:5000/api/health

# Database health
curl http://localhost:5000/api/health/database

# System metrics (requires auth)
curl -H "Authorization: Bearer token" \
  http://localhost:5000/api/health/metrics
```

### Logs
```bash
# Backend logs (Pino)
# Development: Pretty printed to console
# Production: JSON to stdout

# View logs
npm run dev:backend | pino-pretty
```

---

## 🔒 Security

### Authentication Flow
1. User submits credentials
2. Backend validates and generates JWT
3. JWT stored in HttpOnly cookie
4. Frontend includes cookie in requests
5. Backend validates JWT on each request

### Rate Limiting
- **Auth endpoints:** 10 requests/15min (production)
- **API endpoints:** 100 requests/15min (production)
- **Contact form:** 5 requests/15min

### CSRF Protection
- Enabled for all state-changing operations (POST, PUT, DELETE)
- Token obtained from `/api/csrf-token`
- Included in `X-CSRF-Token` header

---

## 🚨 Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Failed
```bash
# Check MongoDB is running
mongosh

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Redis Connection Failed
```bash
# Check Redis is running
redis-cli ping

# Start Redis
brew services start redis              # macOS
sudo systemctl start redis             # Linux
```

### Environment Variables Not Loaded
```bash
# Check .env file exists
ls -la backend/.env

# Verify variables
node -e "require('dotenv').config({path:'backend/.env'}); console.log(process.env.JWT_SECRET)"
```

---

## 📚 Additional Resources

### Documentation
- [System Architecture](./architecture/01-System-Architecture-Overview.md)
- [Current State Review](./CURRENT-STATE-REVIEW.md)
- [Implementation Status](./IMPLEMENTATION-STATUS.md)
- [Developer Onboarding](./developer-guides/13-Developer-Onboarding-Guide.md)

### External Links
- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

## 🤝 Getting Help

### Internal Resources
1. Check documentation in `/docs/fullstack/`
2. Review code comments
3. Check test files for examples

### External Resources
1. Stack Overflow
2. GitHub Issues
3. Official documentation

---

**Last Updated:** 2025-10-10  
**Maintained by:** TopSmile Development Team
