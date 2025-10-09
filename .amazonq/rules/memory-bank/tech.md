# Technology Stack

## Programming Languages
- **TypeScript 4.9.5** (Frontend) / **5.9.2** (Backend) - Primary language for type-safe development
- **JavaScript** - For configuration files and legacy scripts

## Frontend Technologies

### Core Framework
- **React 18.2.0** - UI library with concurrent features
- **React Router DOM 6.30.1** - Client-side routing
- **React Scripts 5.0.1** - Create React App build tooling

### State Management
- **Zustand 4.5.7** - Lightweight state management
- **React Context API** - Built-in state sharing
- **TanStack Query 5.89.0** - Server state management and caching

### UI & Styling
- **CSS Modules** - Component-scoped styling
- **Framer Motion 10.16.5** - Animation library
- **React Icons 4.12.0** - Icon library
- **React Calendar 6.0.0** - Calendar component
- **React Slick 0.29.0** - Carousel component

### Payment Integration
- **Stripe React 4.0.2** - Payment UI components
- **Stripe.js 2.1.0** - Stripe SDK

### Utilities
- **Luxon 3.7.1** - Date/time manipulation
- **Web Vitals 3.5.0** - Performance metrics

## Backend Technologies

### Runtime & Framework
- **Node.js >=18.0.0** - JavaScript runtime
- **Express 4.21.2** - Web application framework
- **TypeScript 5.9.2** - Type-safe development

### Database & Caching
- **MongoDB** - Primary database (via Mongoose)
- **Mongoose 8.18.0** - MongoDB ODM
- **Redis 5.8.2** - Caching and session storage
- **IORedis 5.7.0** - Redis client

### Authentication & Security
- **jsonwebtoken 9.0.2** - JWT token generation/validation
- **bcrypt 6.0.0** / **bcryptjs 3.0.2** - Password hashing
- **otplib 12.0.1** - OTP generation for 2FA
- **qrcode 1.5.4** - QR code generation
- **helmet 7.2.0** - Security headers
- **express-rate-limit 7.5.1** - Rate limiting
- **csurf 1.11.0** - CSRF protection
- **express-mongo-sanitize 2.2.0** - NoSQL injection prevention

### Validation & Sanitization
- **Zod 3.22.4** - Schema validation
- **express-validator 7.2.1** - Request validation
- **isomorphic-dompurify 2.26.0** - HTML sanitization

### Background Jobs & Messaging
- **BullMQ 5.58.2** - Job queue management
- **Twilio 5.10.2** - SMS notifications
- **Nodemailer 6.10.1** - Email sending

### Logging & Monitoring
- **Pino 9.11.0** - High-performance logging
- **Pino-HTTP 10.5.0** - HTTP request logging

### Utilities
- **date-fns 4.1.0** - Date manipulation
- **date-fns-tz 3.2.0** - Timezone support
- **Luxon 3.7.1** - Alternative date library
- **uuid 13.0.0** - UUID generation
- **ua-parser-js 2.0.5** - User agent parsing
- **cookie-parser 1.4.7** - Cookie parsing
- **cors 2.8.5** - CORS middleware
- **dotenv 16.6.1** - Environment variable management

### API Documentation
- **swagger-jsdoc 6.2.8** - OpenAPI spec generation
- **swagger-ui-express 5.0.1** - API documentation UI

## Testing Technologies

### Unit & Integration Testing
- **Jest 27.5.1** (Frontend) / **29.7.0** (Backend) - Test framework
- **ts-jest 27.1.4** / **29.4.1** - TypeScript support for Jest
- **Testing Library React 16.3.0** - React component testing
- **Testing Library User Event 14.6.1** - User interaction simulation
- **Testing Library Jest-DOM 6.8.0** - DOM matchers
- **Supertest 7.1.4** - HTTP assertion library

### E2E Testing
- **Cypress 15.1.0** - End-to-end testing framework

### Accessibility Testing
- **jest-axe 10.0.0** - Accessibility testing

### Performance Testing
- **k6** - Load testing tool

### Test Utilities
- **MSW 2.11.2** - API mocking
- **Faker.js 8.4.1** / **10.0.0** - Test data generation
- **MongoDB Memory Server 10.2.0** - In-memory MongoDB for testing
- **jest-junit 16.0.0** - JUnit report generation

### Contract Testing
- **Pact Foundation 12.1.0** - Consumer-driven contract testing

## Development Tools

### Build Tools
- **Webpack** (via React Scripts) - Module bundler
- **Babel** (via React Scripts) - JavaScript transpiler
- **CRACO** - Create React App Configuration Override
- **webpack-bundle-analyzer 4.10.2** - Bundle analysis
- **source-map-explorer 2.5.3** - Source map visualization

### Development Servers
- **nodemon 3.1.10** - Auto-restart for Node.js
- **ts-node 10.9.2** - TypeScript execution
- **tsconfig-paths 4.2.0** - Path mapping support

### Code Quality
- **ESLint 8.57.1** - Linting
- **TypeScript ESLint 6.21.0** - TypeScript linting rules
- **Prettier** (implied) - Code formatting

### Utilities
- **concurrently 9.2.0** - Run multiple commands
- **cross-env 10.1.0** - Cross-platform environment variables

## CI/CD & DevOps

### GitHub Actions Workflows
- `test.yml` - Automated testing
- `coverage.yml` - Code coverage reporting
- `quality.yml` - Code quality checks
- `security-scan.yml` - Security vulnerability scanning
- `pr-validation.yml` - Pull request validation
- `deploy.yml` - Deployment automation

### Performance Monitoring
- **Lighthouse CI** - Performance auditing
- **Web Vitals** - Core web vitals tracking

## Package Management
- **npm >=9.0.0** - Package manager
- **Workspaces** - Monorepo package management

## Development Commands

### Frontend
```bash
npm start                    # Start development server
npm run build               # Production build
npm run test:frontend       # Run frontend tests
npm run test:frontend:coverage  # Test with coverage
npm run lint                # Lint code
npm run type-check          # TypeScript type checking
npm run analyze             # Bundle analysis
```

### Backend
```bash
npm run dev:backend         # Start backend dev server
npm run build               # Build backend
npm run test:backend        # Run backend tests
npm run test:backend:coverage  # Test with coverage
npm run lint                # Lint code
npm run type-check          # TypeScript type checking
```

### Full Stack
```bash
npm run dev                 # Start both frontend and backend
npm run build:all           # Build both applications
npm run test:all            # Run all tests
npm run test:coverage       # Full coverage report
npm run test:ci             # CI test suite
npm run test:e2e            # Run Cypress E2E tests
```

## Environment Requirements
- **Node.js**: >=18.0.0
- **npm**: >=9.0.0
- **MongoDB**: Latest stable version
- **Redis**: Latest stable version (for caching and sessions)

## Browser Support
- **Production**: >0.2%, not dead, not op_mini all
- **Development**: Latest Chrome, Firefox, Safari
