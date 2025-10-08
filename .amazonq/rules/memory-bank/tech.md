# TopSmile Technology Stack

## Programming Languages

### TypeScript
- **Frontend**: TypeScript 4.9.5
- **Backend**: TypeScript 5.9.2
- **Shared Types**: TypeScript 5.0.4
- **Configuration**: Strict mode enabled for type safety

### JavaScript
- Node.js runtime for backend
- React for frontend UI

## Frontend Stack

### Core Framework
- **React**: 18.2.0 - Modern UI library with hooks
- **React DOM**: 18.2.0 - DOM rendering
- **React Router DOM**: 6.30.1 - Client-side routing

### State Management
- **Zustand**: 4.5.7 - Lightweight client state management
- **TanStack Query**: 5.89.0 - Server state management and caching
- **TanStack Query DevTools**: 5.89.0 - Development tools

### UI & Animation
- **Framer Motion**: 10.16.5 - Smooth animations and transitions
- **React Icons**: 4.12.0 - Icon library
- **React Calendar**: 6.0.0 - Calendar component
- **React Slick**: 0.29.0 - Carousel component
- **Slick Carousel**: 1.8.1 - Carousel library

### Payment Processing
- **@stripe/react-stripe-js**: 4.0.2 - Stripe React components
- **@stripe/stripe-js**: 2.1.0 - Stripe JavaScript SDK

### Utilities
- **Luxon**: 3.7.1 - Date/time manipulation
- **Web Vitals**: 3.5.0 - Performance metrics

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
- **Mongoose**: 8.18.0 - MongoDB ODM
- **Redis**: 5.8.2 - Caching and session storage
- **IORedis**: 5.7.0 - Redis client

### Authentication & Security
- **jsonwebtoken**: 9.0.2 - JWT token generation/verification
- **bcrypt**: 6.0.0 - Password hashing
- **bcryptjs**: 3.0.2 - Password hashing (JavaScript)
- **otplib**: 12.0.1 - TOTP/MFA implementation
- **qrcode**: 1.5.4 - QR code generation for MFA
- **helmet**: 7.2.0 - Security headers
- **cors**: 2.8.5 - CORS middleware
- **csurf**: 1.11.0 - CSRF protection
- **express-rate-limit**: 7.5.1 - Rate limiting
- **express-mongo-sanitize**: 2.2.0 - MongoDB injection prevention
- **cookie-parser**: 1.4.7 - Cookie parsing

### Validation & Sanitization
- **express-validator**: 7.2.1 - Request validation
- **zod**: 3.22.4 - Schema validation
- **isomorphic-dompurify**: 2.26.0 - HTML sanitization

### External Services
- **Stripe** (via backend SDK) - Payment processing
- **Twilio**: 5.10.2 - SMS notifications
- **Nodemailer**: 6.10.1 - Email delivery

### Job Queue
- **BullMQ**: 5.58.2 - Redis-based job queue

### Logging & Monitoring
- **Pino**: 9.11.0 - High-performance logging
- **Pino-HTTP**: 10.5.0 - HTTP request logging
- **Pino-Pretty**: 13.1.1 - Pretty log formatting (dev)

### API Documentation
- **Swagger JSDoc**: 6.2.8 - API documentation generation
- **Swagger UI Express**: 5.0.1 - API documentation UI

### Utilities
- **Luxon**: 3.7.1 - Date/time manipulation
- **date-fns**: 4.1.0 - Date utilities
- **date-fns-tz**: 3.2.0 - Timezone support
- **uuid**: 13.0.0 - UUID generation
- **ua-parser-js**: 2.0.5 - User agent parsing
- **dotenv**: 16.6.1 - Environment variable loading

## Shared Packages

### @topsmile/types
- Shared TypeScript type definitions
- Used by both frontend and backend
- Ensures end-to-end type safety

## Testing Stack

### Frontend Testing
- **Jest**: 27.5.1 - Test framework
- **@testing-library/react**: 16.3.0 - React component testing
- **@testing-library/jest-dom**: 6.8.0 - DOM matchers
- **@testing-library/user-event**: 14.6.1 - User interaction simulation
- **jest-axe**: 10.0.0 - Accessibility testing
- **MSW**: 2.11.2 - API mocking
- **ts-jest**: 27.1.4 - TypeScript support for Jest

### Backend Testing
- **Jest**: 29.7.0 - Test framework
- **Supertest**: 7.1.4 - HTTP assertion library
- **@faker-js/faker**: 10.0.0 - Test data generation
- **mongodb-memory-server**: 10.2.0 - In-memory MongoDB for tests
- **@pact-foundation/pact**: 12.1.0 - Contract testing
- **ts-jest**: 29.4.1 - TypeScript support for Jest

### E2E Testing
- **Cypress**: 15.1.0 - End-to-end testing framework

### Performance Testing
- **k6**: Load testing
- **Lighthouse**: Performance auditing

### Test Reporting
- **jest-junit**: 16.0.0 - JUnit XML reports for CI/CD

## Development Tools

### Code Quality
- **ESLint**: 8.57.1 - Code linting
- **@typescript-eslint/eslint-plugin**: 6.21.0 - TypeScript linting rules
- **@typescript-eslint/parser**: 6.21.0 - TypeScript parser for ESLint

### Development Utilities
- **Nodemon**: 3.1.10 - Auto-restart on file changes
- **ts-node**: 10.9.2 - TypeScript execution
- **tsconfig-paths**: 4.2.0 - Path mapping support
- **Concurrently**: 9.2.0 - Run multiple commands concurrently

### Bundle Analysis
- **source-map-explorer**: 2.5.3 - Bundle size analysis
- **webpack-bundle-analyzer**: 4.10.2 - Webpack bundle visualization

### Polyfills
- **text-encoding**: 0.7.0 - TextEncoder/TextDecoder polyfill
- **web-streams-polyfill**: 4.2.0 - Web Streams API polyfill
- **whatwg-fetch**: 3.6.20 - Fetch API polyfill
- **broadcast-channel**: 7.1.0 - BroadcastChannel polyfill

## Build System

### Frontend Build
- **Command**: `npm run build`
- **Tool**: React Scripts (Webpack-based)
- **Output**: Optimized production bundle in `build/`
- **Features**: Code splitting, minification, source maps (optional)

### Backend Build
- **Command**: `npm run build` (in backend/)
- **Tool**: TypeScript compiler (tsc)
- **Output**: Compiled JavaScript in `dist/`

### Development Mode
- **Frontend**: `npm start` - Hot reload on port 3000
- **Backend**: `npm run dev` - Nodemon with ts-node on port 5000
- **Concurrent**: `npm run dev` - Runs both frontend and backend

## Package Management

### Package Manager
- **npm**: >=9.0.0
- **Workspaces**: Monorepo structure with shared packages

### Scripts Overview

#### Frontend Scripts
- `start`: Start development server
- `build`: Production build
- `test`: Run all tests
- `test:frontend`: Frontend unit tests
- `test:backend`: Backend unit tests
- `test:e2e`: Cypress E2E tests
- `test:coverage`: Generate coverage reports
- `lint`: Run ESLint
- `type-check`: TypeScript type checking

#### Backend Scripts
- `dev`: Start development server with hot reload
- `build`: Compile TypeScript to JavaScript
- `start`: Run production server
- `test`: Run all backend tests
- `test:unit`: Unit tests only
- `test:integration`: Integration tests only
- `test:coverage`: Generate coverage reports

## Environment Requirements

### Runtime
- **Node.js**: >=18.0.0
- **npm**: >=9.0.0

### External Services
- **MongoDB**: >=5.0
- **Redis**: Latest stable version

### Development
- TypeScript-enabled IDE recommended (VS Code, WebStorm)
- Git for version control

## CI/CD Integration

### GitHub Actions Workflows
- `pr-validation.yml`: Pull request validation
- `quality.yml`: Code quality checks
- `test.yml`: Automated testing

### Test Reporting
- JUnit XML format for CI/CD integration
- Coverage reports in LCOV format

## Performance Targets
- Initial load: <1.2s
- Tab switch: <0.8s
- Save operation: <0.6s
- Memory usage: <100MB
- Test coverage: 85% frontend, 90% backend
