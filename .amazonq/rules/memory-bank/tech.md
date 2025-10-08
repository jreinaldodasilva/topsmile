# Technology Stack

## Programming Languages
- **TypeScript 5.9** (Backend) / **TypeScript 4.9** (Frontend) - Type-safe development across the stack
- **JavaScript** - Runtime execution (Node.js 18+)

## Frontend Stack

### Core Framework
- **React 18.2** - Modern UI library with hooks and concurrent features
- **React Router DOM 6.30** - Client-side routing
- **TypeScript 4.9** - Static type checking

### State Management
- **TanStack Query 5.89** (React Query) - Server state management, caching, and synchronization
- **Zustand 4.5** - Lightweight client state management
- **React Context** - Authentication and error handling contexts

### UI & Styling
- **Framer Motion 10.16** - Animation library for smooth transitions
- **React Icons 4.12** - Icon library
- **React Calendar 6.0** - Calendar component for scheduling
- **React Slick 0.29** - Carousel component
- **Custom CSS** - Design tokens and global styles

### Forms & Validation
- **Custom useForm hook** - Form state management
- **Client-side validation** - Input validation before API calls

### Payment Processing
- **Stripe React 4.0** - Payment UI components
- **Stripe.js 2.1** - Stripe integration

### Build Tools
- **React Scripts 5.0** - Create React App build system
- **CRACO** - Create React App Configuration Override
- **Webpack** - Module bundler (via CRA)
- **Babel** - JavaScript transpiler

## Backend Stack

### Core Framework
- **Node.js 18+** - JavaScript runtime
- **Express 4.21** - Web application framework
- **TypeScript 5.9** - Type-safe backend development

### Database & Caching
- **MongoDB 5.0+** - Document database
- **Mongoose 8.18** - MongoDB ODM with schema validation
- **Redis 5.8** - Caching and session storage
- **IORedis 5.7** - Redis client for Node.js

### Authentication & Security
- **jsonwebtoken 9.0** - JWT token generation and verification
- **bcrypt 6.0** - Password hashing
- **otplib 12.0** - TOTP-based MFA
- **helmet 7.2** - Security headers
- **csurf 1.11** - CSRF protection
- **express-rate-limit 7.5** - Rate limiting
- **express-mongo-sanitize 2.2** - NoSQL injection prevention

### Validation
- **Zod 3.22** - Schema validation
- **express-validator 7.2** - Request validation middleware

### External Services
- **Stripe** - Payment processing
- **Twilio 5.10** - SMS notifications
- **Nodemailer 6.10** - Email delivery

### Job Queue
- **BullMQ 5.58** - Redis-based job queue for background tasks

### Logging & Monitoring
- **Pino 9.11** - High-performance logging
- **Pino-HTTP 10.5** - HTTP request logging

### API Documentation
- **Swagger JSDoc 6.2** - API documentation generation
- **Swagger UI Express 5.0** - Interactive API documentation

### Utilities
- **Luxon 3.7** - Date/time manipulation
- **date-fns 4.1** - Date utilities
- **uuid 13.0** - Unique identifier generation
- **qrcode 1.5** - QR code generation for MFA

## Shared Types Package

### Package
- **@topsmile/types** - Shared TypeScript definitions
- **TypeScript 5.0** - Type definitions compiler

## Testing & Quality

### Frontend Testing
- **Jest 27** - Test framework
- **Testing Library 16.3** - React component testing
- **Jest-axe 10.0** - Accessibility testing
- **MSW 2.11** - API mocking for tests
- **User Event 14.6** - User interaction simulation

### Backend Testing
- **Jest 29** - Test framework
- **Supertest 7.1** - HTTP assertion library
- **MongoDB Memory Server 10.2** - In-memory MongoDB for tests
- **Pact 12.1** - Contract testing
- **Faker 10.0** - Test data generation

### E2E Testing
- **Cypress 15.1** - End-to-end testing framework

### Code Quality
- **ESLint 8.57** - Code linting
- **TypeScript ESLint 6.21** - TypeScript-specific linting rules
- **Prettier** (implicit) - Code formatting

### Performance Testing
- **k6** - Load testing
- **Lighthouse** - Performance auditing
- **Web Vitals 3.5** - Core Web Vitals monitoring

## Development Tools

### Package Management
- **npm 9.0+** - Package manager
- **Workspaces** - Monorepo management

### Development Servers
- **nodemon 3.1** - Auto-restart for backend development
- **ts-node 10.9** - TypeScript execution for Node.js
- **tsconfig-paths 4.2** - Path mapping support

### Build Tools
- **TypeScript Compiler** - Type checking and compilation
- **Source Map Explorer 2.5** - Bundle analysis
- **Webpack Bundle Analyzer 4.10** - Bundle visualization

## Development Commands

### Installation
```bash
npm install                    # Install all dependencies (frontend + backend)
```

### Development
```bash
npm run dev                    # Start both frontend and backend
npm start                      # Start frontend only
npm run dev:frontend           # Start frontend only
npm run dev:backend            # Start backend only (cd backend && npm run dev)
npm run server                 # Start backend only
```

### Building
```bash
npm run build                  # Build frontend
npm run build:all              # Build frontend and backend
cd backend && npm run build    # Build backend only
```

### Testing
```bash
# All tests
npm test                       # Run all tests
npm run test:all               # Run frontend + backend tests

# Frontend tests
npm run test:frontend          # Run frontend tests
npm run test:frontend:watch    # Watch mode
npm run test:frontend:coverage # With coverage
npm run test:frontend:ci       # CI mode

# Backend tests
npm run test:backend           # Run backend tests
cd backend && npm test         # Backend tests (from backend dir)
cd backend && npm run test:watch       # Watch mode
cd backend && npm run test:coverage    # With coverage
cd backend && npm run test:ci          # CI mode

# E2E tests
npm run test:e2e               # Run Cypress tests
npm run cy:open                # Open Cypress UI
npm run cy:run                 # Run Cypress headless

# Specific test types
npm run test:a11y              # Accessibility tests
npm run test:coverage          # All tests with coverage
npm run test:ci                # All tests in CI mode
```

### Code Quality
```bash
npm run lint                   # Lint frontend code
npm run lint:fix               # Fix linting issues
npm run type-check             # TypeScript type checking
cd backend && npm run lint     # Lint backend code
cd backend && npm run lint:fix # Fix backend linting
```

### Performance & Analysis
```bash
npm run lighthouse             # Run Lighthouse audit
npm run lighthouse:ci          # Lighthouse CI
npm run analyze                # Analyze bundle size
npm run analyze:bundle         # Bundle analysis
npm run build:analyze          # Build with source maps and analyze
npm run perf:load              # Load testing with k6
```

### Utilities
```bash
npm run generate-secrets       # Generate JWT secrets
npm run generate-env-secrets   # Generate environment secrets
npm run migrate-types          # Migrate to shared types
npm run fix-type-imports       # Fix type imports
```

## Environment Requirements

### System Requirements
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** >= 5.0
- **Redis** (latest stable)

### Environment Variables

#### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_ENVIRONMENT=development
```

#### Backend (backend/.env)
```bash
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/topsmile
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars

# External Services
STRIPE_SECRET_KEY=sk_test_...
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=noreply@topsmile.com
```

## Browser Support

### Production
- >0.2% market share
- Not dead browsers
- Not Opera Mini

### Development
- Latest Chrome
- Latest Firefox
- Latest Safari
