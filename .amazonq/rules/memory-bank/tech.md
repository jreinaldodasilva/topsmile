# TopSmile - Technology Stack

## Programming Languages
- **TypeScript 4.9.5+**: Primary language for frontend and backend
- **JavaScript**: Build scripts and configuration
- **CSS3**: Styling with CSS modules and global styles

## Frontend Stack

### Core Framework
- **React 18.2.0**: UI library with concurrent features
- **React DOM 18.2.0**: DOM rendering
- **React Router DOM 6.30.1**: Client-side routing

### State Management
- **TanStack Query 5.89.0**: Server state management and caching
- **Zustand**: Global UI state management (via custom stores)
- **React Context**: Authentication and error state

### UI & Styling
- **Framer Motion 10.16.5**: Animation library
- **React Icons 4.12.0**: Icon library
- **React Calendar 6.0.0**: Calendar component
- **React Slick 0.29.0**: Carousel component
- **CSS Modules**: Component-scoped styling
- **Design Tokens**: Centralized design system

### Payment Integration
- **@stripe/react-stripe-js 4.0.2**: Stripe React components
- **@stripe/stripe-js 2.1.0**: Stripe JavaScript SDK

### Development Tools
- **React Scripts 5.0.1**: Create React App build system
- **CRACO**: Create React App configuration override
- **TypeScript Compiler**: Type checking and compilation

### Testing
- **Jest 27.5.1**: Test runner and framework
- **React Testing Library 16.3.0**: Component testing
- **Jest-axe 10.0.0**: Accessibility testing
- **MSW 2.11.2**: API mocking
- **Cypress 15.1.0**: E2E testing
- **@testing-library/user-event 14.6.1**: User interaction simulation

### Build & Optimization
- **Source Map Explorer 2.5.3**: Bundle analysis
- **Webpack Bundle Analyzer 4.10.2**: Bundle visualization
- **Cross-env 10.0.0**: Cross-platform environment variables

## Backend Stack

### Runtime & Framework
- **Node.js >=18.0.0**: JavaScript runtime
- **Express 4.21.2**: Web application framework
- **TypeScript 5.9.2**: Type-safe development

### Database
- **MongoDB 8.18.0**: NoSQL database
- **Mongoose 8.18.0**: ODM for MongoDB
- **MongoDB Memory Server 10.2.0**: In-memory DB for testing

### Caching & Queues
- **Redis 5.8.2**: Caching and session storage
- **IORedis 5.7.0**: Redis client
- **BullMQ 5.58.2**: Job queue system

### Authentication & Security
- **jsonwebtoken 9.0.2**: JWT token generation/validation
- **bcrypt 6.0.0**: Password hashing
- **bcryptjs 3.0.2**: Password hashing (fallback)
- **otplib 12.0.1**: OTP generation for MFA
- **qrcode 1.5.4**: QR code generation for MFA
- **helmet 7.2.0**: Security headers
- **cors 2.8.5**: CORS middleware
- **csurf 1.11.0**: CSRF protection
- **express-rate-limit 7.5.1**: Rate limiting
- **express-mongo-sanitize 2.2.0**: MongoDB injection prevention

### Validation & Sanitization
- **express-validator 7.2.1**: Request validation
- **zod 3.22.4**: Schema validation
- **isomorphic-dompurify 2.26.0**: HTML sanitization

### External Services
- **Twilio 5.10.2**: SMS notifications
- **Nodemailer 6.10.1**: Email sending
- **Stripe**: Payment processing (via API)

### Utilities
- **date-fns 4.1.0**: Date manipulation
- **date-fns-tz 3.2.0**: Timezone handling
- **luxon 3.7.1**: DateTime library
- **uuid 13.0.0**: UUID generation
- **ua-parser-js 2.0.5**: User agent parsing

### Logging & Monitoring
- **pino 9.11.0**: High-performance logging
- **pino-http 10.5.0**: HTTP request logging
- **pino-pretty 13.1.1**: Log formatting (dev)

### API Documentation
- **swagger-jsdoc 6.2.8**: OpenAPI spec generation
- **swagger-ui-express 5.0.1**: API documentation UI

### Testing
- **Jest 29.7.0**: Test framework
- **ts-jest 29.4.1**: TypeScript Jest transformer
- **Supertest 7.1.4**: HTTP assertion library
- **@faker-js/faker 10.0.0**: Test data generation
- **K6**: Load testing

### Development Tools
- **nodemon 3.1.10**: Auto-restart on file changes
- **ts-node 10.9.2**: TypeScript execution
- **tsconfig-paths 4.2.0**: Path mapping support

## Shared Packages

### @topsmile/types
- Shared TypeScript type definitions
- Interface definitions for API contracts
- Enums and constants
- Type guards and utilities

## Development Environment

### Prerequisites
- **Node.js**: >=18.0.0
- **npm**: >=9.0.0
- **MongoDB**: >=5.0
- **Redis**: Latest stable (optional for caching)

### Environment Variables

#### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### Backend (backend/.env)
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/topsmile
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
STRIPE_SECRET_KEY=sk_test_...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
REDIS_URL=redis://localhost:6379
```

## Development Commands

### Installation
```bash
npm install                    # Install all dependencies (frontend + backend)
```

### Development
```bash
npm run dev                    # Start both frontend and backend
npm start                      # Frontend only (port 3000)
npm run dev:frontend          # Frontend only
npm run dev:backend           # Backend only (port 5000)
cd backend && npm run dev     # Backend with nodemon
```

### Building
```bash
npm run build                 # Build frontend
npm run build:all            # Build frontend and backend
cd backend && npm run build  # Build backend only
```

### Testing
```bash
npm test                      # Run all tests
npm run test:all             # Frontend + backend tests
npm run test:frontend        # Frontend unit tests
npm run test:frontend:watch  # Frontend tests in watch mode
npm run test:frontend:coverage # Frontend with coverage
npm run test:backend         # Backend tests
npm run test:backend:watch   # Backend tests in watch mode
npm run test:backend:coverage # Backend with coverage
npm run test:e2e             # Cypress E2E tests
npm run test:e2e:open        # Cypress interactive mode
npm run test:a11y            # Accessibility tests
npm run test:ci              # CI test suite
```

### Code Quality
```bash
npm run lint                 # Lint frontend code
npm run lint:fix            # Fix linting issues
npm run type-check          # TypeScript type checking
cd backend && npm run lint  # Lint backend code
```

### Analysis & Optimization
```bash
npm run analyze             # Analyze bundle size
npm run analyze:bundle      # Detailed bundle analysis
npm run build:analyze       # Build with source maps and analyze
npm run lighthouse          # Run Lighthouse audit
npm run lighthouse:ci       # Lighthouse CI
```

### Utilities
```bash
npm run migrate-types       # Migrate type definitions
npm run fix-type-imports    # Fix import paths
npm run generate-secrets    # Generate JWT secrets
npm run perf:load          # Run K6 load tests
```

## Build System

### Frontend Build
- **Create React App**: Base build system
- **CRACO**: Configuration customization
- **Webpack**: Module bundling (via CRA)
- **Babel**: JavaScript transpilation (via CRA)
- **PostCSS**: CSS processing

### Backend Build
- **TypeScript Compiler**: Transpile TS to JS
- **Output**: `backend/dist/` directory
- **Source Maps**: Generated for debugging

## Testing Infrastructure

### Unit Testing
- **Jest**: Test runner with coverage
- **ts-jest**: TypeScript support
- **@testing-library/react**: Component testing utilities

### Integration Testing
- **Supertest**: HTTP endpoint testing
- **MongoDB Memory Server**: Isolated database testing

### E2E Testing
- **Cypress**: Browser automation
- **Custom commands**: Reusable test utilities

### Performance Testing
- **K6**: Load testing scripts
- **Lighthouse**: Performance auditing

### Accessibility Testing
- **jest-axe**: Automated a11y testing
- **Manual testing**: WCAG 2.1 AA compliance

## CI/CD Configuration

### GitHub Actions
- `.github/workflows/test.yml`: Test automation
- `.github/workflows/quality.yml`: Code quality checks
- `.github/workflows/pr-validation.yml`: PR validation

### Test Reporting
- **jest-junit**: JUnit XML reports
- **Coverage reports**: LCOV format

## Browser Support

### Production
- >0.2% market share
- Not dead browsers
- Not Opera Mini

### Development
- Latest Chrome
- Latest Firefox
- Latest Safari

## Performance Targets
- **First Contentful Paint**: <1.8s
- **Time to Interactive**: <3.8s
- **Lighthouse Score**: >90
- **Bundle Size**: Optimized with code splitting
