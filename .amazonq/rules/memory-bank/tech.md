# Technology Stack

## Programming Languages

### TypeScript
- **Frontend**: TypeScript 4.9.5
- **Backend**: TypeScript 5.9.2
- **Shared Types**: TypeScript 5.0.4
- **Configuration**: Strict mode enabled for type safety

## Frontend Stack

### Core Framework
- **React**: 18.2.0 - Modern UI library with hooks and concurrent features
- **React DOM**: 18.2.0 - DOM rendering
- **React Router DOM**: 6.30.1 - Client-side routing with protected routes

### State Management
- **Zustand**: 4.5.7 - Lightweight client state management
- **TanStack Query**: 5.89.0 - Server state management, caching, and synchronization
- **TanStack Query DevTools**: 5.89.0 - Development debugging tools

### UI & Animation
- **Framer Motion**: 10.16.5 - Smooth animations and transitions
- **React Icons**: 4.12.0 - Icon library
- **React Calendar**: 6.0.0 - Calendar components
- **React Slick**: 0.29.0 - Carousel components
- **Slick Carousel**: 1.8.1 - Carousel styling

### Payment Processing
- **@stripe/stripe-js**: 2.1.0 - Stripe JavaScript SDK
- **@stripe/react-stripe-js**: 4.0.2 - React Stripe components

### Utilities
- **Luxon**: 3.7.1 - Date and time manipulation
- **Web Vitals**: 3.5.0 - Performance monitoring

### Build Tools
- **React Scripts**: 5.0.1 - Create React App build system
- **CRACO**: Custom React App configuration
- **Cross-env**: 10.0.0 - Cross-platform environment variables

## Backend Stack

### Core Framework
- **Node.js**: >=18.0.0 - JavaScript runtime
- **Express**: 4.21.2 - Web application framework
- **TypeScript**: 5.9.2 - Type-safe backend development

### Database & Caching
- **MongoDB**: 5.0+ - Document database
- **Mongoose**: 8.18.0 - MongoDB ODM with schema validation
- **Redis**: 5.8.2 - Caching and session storage
- **IORedis**: 5.7.0 - Redis client for Node.js

### Authentication & Security
- **jsonwebtoken**: 9.0.2 - JWT token generation and verification
- **bcrypt**: 6.0.0 - Password hashing
- **bcryptjs**: 3.0.2 - Alternative bcrypt implementation
- **otplib**: 12.0.1 - TOTP/HOTP generation for MFA
- **qrcode**: 1.5.4 - QR code generation for MFA setup
- **helmet**: 7.2.0 - Security headers
- **cors**: 2.8.5 - Cross-origin resource sharing
- **csurf**: 1.11.0 - CSRF protection
- **express-mongo-sanitize**: 2.2.0 - MongoDB injection prevention
- **express-rate-limit**: 7.5.1 - Rate limiting
- **cookie-parser**: 1.4.7 - Cookie parsing

### Validation & Sanitization
- **express-validator**: 7.2.1 - Request validation
- **zod**: 3.22.4 - Schema validation
- **isomorphic-dompurify**: 2.26.0 - HTML sanitization

### External Services
- **Twilio**: 5.10.2 - SMS notifications
- **Nodemailer**: 6.10.1 - Email delivery

### Job Queue
- **BullMQ**: 5.58.2 - Redis-based job queue for background tasks

### Logging & Monitoring
- **pino**: 9.11.0 - High-performance logging
- **pino-http**: 10.5.0 - HTTP request logging
- **pino-pretty**: 13.1.1 - Pretty log formatting (development)

### API Documentation
- **swagger-jsdoc**: 6.2.8 - Swagger documentation generation
- **swagger-ui-express**: 5.0.1 - Swagger UI interface

### Utilities
- **dotenv**: 16.6.1 - Environment variable management
- **luxon**: 3.7.1 - Date and time manipulation
- **date-fns**: 4.1.0 - Date utilities
- **date-fns-tz**: 3.2.0 - Timezone support
- **uuid**: 13.0.0 - UUID generation
- **ua-parser-js**: 2.0.5 - User agent parsing

## Shared Types Package

### Dependencies
- **TypeScript**: 5.0.4 - Type definitions
- **@types/react-router-dom**: 5.3.3 - Router type definitions

## Testing Stack

### Frontend Testing
- **Jest**: 27.5.1 - Test framework
- **@testing-library/react**: 16.3.0 - React component testing
- **@testing-library/jest-dom**: 6.8.0 - DOM matchers
- **@testing-library/user-event**: 14.6.1 - User interaction simulation
- **jest-axe**: 10.0.0 - Accessibility testing
- **MSW**: 2.11.2 - API mocking
- **ts-jest**: 27.1.4 - TypeScript Jest transformer

### Backend Testing
- **Jest**: 29.7.0 - Test framework
- **Supertest**: 7.1.4 - HTTP assertion library
- **@faker-js/faker**: 10.0.0 - Test data generation
- **mongodb-memory-server**: 10.2.0 - In-memory MongoDB for testing
- **@pact-foundation/pact**: 12.1.0 - Contract testing
- **ts-jest**: 29.4.1 - TypeScript Jest transformer

### E2E Testing
- **Cypress**: 15.1.0 - End-to-end testing framework

### Performance Testing
- **k6**: Load testing tool
- **Lighthouse**: Web performance auditing

### Test Reporting
- **jest-junit**: 16.0.0 - JUnit XML reports for CI/CD

## Development Tools

### Code Quality
- **ESLint**: 8.57.1 - JavaScript/TypeScript linting
- **@typescript-eslint/eslint-plugin**: 6.21.0 - TypeScript ESLint rules
- **@typescript-eslint/parser**: 6.21.0 - TypeScript parser for ESLint

### Development Utilities
- **nodemon**: 3.1.10 - Auto-restart on file changes
- **ts-node**: 10.9.2 - TypeScript execution
- **tsconfig-paths**: 4.2.0 - Path mapping support
- **concurrently**: 9.2.0 - Run multiple commands concurrently

### Bundle Analysis
- **source-map-explorer**: 2.5.3 - Bundle size analysis
- **webpack-bundle-analyzer**: 4.10.2 - Webpack bundle visualization

### Polyfills
- **text-encoding**: 0.7.0 - TextEncoder/TextDecoder polyfill
- **web-streams-polyfill**: 4.2.0 - Streams API polyfill
- **whatwg-fetch**: 3.6.20 - Fetch API polyfill
- **broadcast-channel**: 7.1.0 - BroadcastChannel polyfill

## Development Commands

### Frontend Development
```bash
npm start                    # Start development server (port 3000)
npm run dev                  # Start frontend + backend concurrently
npm run build                # Production build
npm run build:all            # Build frontend + backend
npm run test:frontend        # Run frontend tests
npm run test:frontend:watch  # Watch mode
npm run test:a11y            # Accessibility tests
npm run lint                 # Lint code
npm run lint:fix             # Fix linting issues
npm run type-check           # TypeScript type checking
npm run analyze              # Bundle size analysis
```

### Backend Development
```bash
cd backend && npm run dev    # Start backend server (port 5000)
cd backend && npm test       # Run backend tests
cd backend && npm run test:watch  # Watch mode
cd backend && npm run test:coverage  # Coverage report
cd backend && npm run lint   # Lint code
cd backend && npm run build  # Build for production
cd backend && npm start      # Start production server
```

### E2E Testing
```bash
npm run test:e2e             # Run Cypress tests headless
npm run cy:open              # Open Cypress UI
```

### Full Test Suite
```bash
npm run test:all             # Run all tests (frontend + backend)
npm run test:ci              # CI test suite with coverage
npm run test:coverage        # Generate coverage reports
```

### Performance & Quality
```bash
npm run lighthouse           # Run Lighthouse audit
npm run perf:load            # Load testing with k6
```

### Utilities
```bash
npm run generate-secrets     # Generate JWT secrets
npm run migrate-types        # Migrate to shared types package
npm run fix-type-imports     # Fix type import paths
```

## Environment Requirements

### Runtime
- **Node.js**: >=18.0.0
- **npm**: >=9.0.0
- **MongoDB**: >=5.0
- **Redis**: Latest stable version

### Development
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for TypeScript
- **Git**: Version control

## External Service Integrations

### Required Services
- **Stripe**: Payment processing (API keys required)
- **Twilio**: SMS notifications (account SID, auth token, phone number)
- **SMTP Server**: Email delivery (Gmail, SendGrid, etc.)

### Optional Services
- **Sentry**: Error tracking (production)
- **LogRocket**: Session replay (production)
- **AWS S3**: Document storage (future)

## Browser Support

### Production
- >0.2% market share
- Not dead browsers
- Not Opera Mini

### Development
- Latest Chrome
- Latest Firefox
- Latest Safari

## Database Indexes
- **50+ Optimized Indexes**: Query performance optimization
- **Compound Indexes**: Multi-field query support
- **Text Indexes**: Full-text search capabilities
- **Unique Indexes**: Data integrity constraints

## Performance Targets
- **Initial Load**: <1.2s
- **Tab Switch**: <0.8s
- **Save Operation**: <0.6s
- **Memory Usage**: <100MB
- **Test Coverage**: 85% frontend, 90% backend
