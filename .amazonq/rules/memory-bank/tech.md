# TopSmile - Technology Stack

## Programming Languages
- **TypeScript 4.9.5** (Frontend) / **5.9.2** (Backend)
- **JavaScript** (ES2020+)
- **CSS3** with CSS Variables

## Frontend Stack

### Core Framework
- **React 18.2.0**: UI library with concurrent features
- **React Router 6.30.1**: Client-side routing
- **TypeScript 4.9.5**: Static typing

### State Management
- **Zustand 4.5.7**: Lightweight state management
- **React Context**: Authentication and error handling
- **TanStack Query 5.89.0**: Server state management, caching, and optimistic updates

### UI & Styling
- **CSS Modules**: Component-scoped styling
- **Framer Motion 10.16.5**: Animations and transitions
- **React Icons 4.12.0**: Icon library
- **React Calendar 6.0.0**: Calendar components
- **React Slick 0.29.0**: Carousel components

### Payment Integration
- **@stripe/react-stripe-js 4.0.2**: Stripe React components
- **@stripe/stripe-js 2.1.0**: Stripe JavaScript SDK

### Build Tools
- **React Scripts 5.0.1**: Create React App build system
- **Webpack**: Module bundler (via CRA)
- **Babel**: JavaScript transpiler (via CRA)
- **CRACO**: Create React App Configuration Override

### Development Tools
- **ESLint 8.57.1**: Code linting
- **Prettier 3.6.2**: Code formatting
- **Husky 9.1.7**: Git hooks
- **lint-staged 16.2.3**: Pre-commit linting

## Backend Stack

### Core Framework
- **Node.js >=18.0.0**: Runtime environment
- **Express 4.21.2**: Web framework
- **TypeScript 5.9.2**: Static typing

### Database & Caching
- **MongoDB**: Primary database (via Mongoose 8.18.0)
- **Mongoose 8.18.0**: ODM for MongoDB
- **Redis 5.8.2**: Caching and session management
- **IORedis 5.7.0**: Redis client

### Authentication & Security
- **jsonwebtoken 9.0.2**: JWT token generation/verification
- **bcrypt 6.0.0**: Password hashing
- **helmet 7.2.0**: Security headers
- **express-rate-limit 7.5.1**: Rate limiting
- **csurf 1.11.0**: CSRF protection
- **express-mongo-sanitize 2.2.0**: NoSQL injection prevention
- **isomorphic-dompurify 2.26.0**: XSS protection

### Validation & Data Processing
- **express-validator 7.2.1**: Request validation
- **zod 3.22.4**: Schema validation
- **date-fns 4.1.0**: Date manipulation
- **luxon 3.7.1**: DateTime handling

### External Integrations
- **Stripe**: Payment processing (via secret key)
- **Twilio 5.10.2**: SMS notifications
- **Nodemailer 6.10.1**: Email notifications

### Queue & Background Jobs
- **BullMQ 5.58.2**: Job queue with Redis

### API Documentation
- **swagger-jsdoc 6.2.8**: OpenAPI specification generation
- **swagger-ui-express 5.0.1**: Interactive API documentation

### Logging
- **pino 9.11.0**: High-performance logging
- **pino-http 10.5.0**: HTTP request logging

### Development Tools
- **nodemon 3.1.10**: Auto-restart on file changes
- **ts-node 10.9.2**: TypeScript execution
- **tsconfig-paths 4.2.0**: Path mapping support

## Testing Stack

### Frontend Testing
- **Jest 27.5.1**: Test runner and framework
- **@testing-library/react 16.3.0**: React component testing
- **@testing-library/user-event 14.6.1**: User interaction simulation
- **@testing-library/jest-dom 6.8.0**: DOM matchers
- **jest-axe 10.0.0**: Accessibility testing
- **MSW 2.11.2**: API mocking
- **Cypress 15.1.0**: E2E testing

### Backend Testing
- **Jest 29.7.0**: Test runner and framework
- **Supertest 7.1.4**: HTTP assertion library
- **mongodb-memory-server 10.2.0**: In-memory MongoDB for tests
- **@faker-js/faker**: Test data generation
- **@pact-foundation/pact 12.1.0**: Contract testing

### Performance Testing
- **k6**: Load testing tool

### Test Utilities
- **jest-junit 16.0.0**: JUnit XML reporter for CI
- **ts-jest**: TypeScript preprocessor for Jest

## Shared Packages
- **@topsmile/types**: Shared TypeScript types between frontend and backend

## Development Commands

### Frontend Development
```bash
npm start                    # Start dev server (port 3000)
npm run dev                  # Start both frontend and backend
npm run build                # Production build
npm run test:frontend        # Run frontend tests
npm run test:frontend:watch  # Watch mode
npm run test:frontend:coverage # Coverage report
npm run lint                 # Lint code
npm run lint:fix             # Fix linting issues
npm run type-check           # TypeScript type checking
npm run format               # Format code with Prettier
npm run analyze              # Bundle size analysis
```

### Backend Development
```bash
npm run dev:backend          # Start backend dev server (port 5000)
npm run build:backend        # Build backend
npm run test:backend         # Run backend tests
npm run test:backend:watch   # Watch mode
npm run test:backend:coverage # Coverage report
```

### Testing
```bash
npm run test:all             # Run all tests
npm run test:e2e             # Run Cypress E2E tests
npm run test:e2e:open        # Open Cypress UI
npm run test:coverage        # Full coverage report
npm run test:ci              # CI test suite
npm run test:a11y            # Accessibility tests
```

### Build & Deploy
```bash
npm run build:all            # Build both applications
npm run lighthouse           # Performance audit
npm run lighthouse:ci        # CI performance audit
```

### Utilities
```bash
npm run generate-secrets     # Generate JWT secrets
npm run seed:test            # Seed test users
npm run migrate-types        # Migrate to shared types
npm run check:bundle-size    # Check bundle size limits
```

## Environment Requirements
- **Node.js**: >=18.0.0
- **npm**: >=9.0.0
- **MongoDB**: Latest stable version
- **Redis**: Latest stable version

## Browser Support
### Production
- >0.2% market share
- Not dead browsers
- Not Opera Mini

### Development
- Latest Chrome, Firefox, Safari

## CI/CD Pipelines
- **test.yml**: Automated testing on PR/push
- **coverage.yml**: Code coverage reporting
- **quality.yml**: Code quality checks
- **security-scan.yml**: Security vulnerability scanning
- **deploy.yml**: Deployment automation
- **pr-validation.yml**: PR validation checks

## Performance Targets
- **Lighthouse Score**: >90 for all metrics
- **Bundle Size**: <500KB main bundle
- **Test Coverage**: >80% statements, >75% branches
- **API Response Time**: <200ms for 95th percentile
