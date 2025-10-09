# TopSmile - Technology Stack

## Core Technologies

### Frontend
- **React** 18.2.0 - UI library with concurrent features
- **TypeScript** 4.9.5 - Type-safe JavaScript
- **React Router** 6.30.1 - Client-side routing
- **Zustand** 4.5.7 - Lightweight state management
- **TanStack Query** 5.89.0 - Server state management and caching

### Backend
- **Node.js** >=18.0.0 - JavaScript runtime
- **Express** 4.21.2 - Web application framework
- **TypeScript** 5.9.2 - Type-safe JavaScript
- **Mongoose** 8.18.0 - MongoDB ODM
- **Redis** (ioredis 5.7.0) - Caching and session management

### Database
- **MongoDB** - Primary database (latest stable)
- **Redis** - Caching, sessions, token blacklist (latest stable)

### Shared
- **@topsmile/types** - Monorepo shared TypeScript types package

## Development Tools

### Build & Bundling
- **react-scripts** 5.0.1 - Create React App build system
- **TypeScript Compiler** - Backend compilation
- **ts-node** 10.9.2 - TypeScript execution for development
- **nodemon** 3.1.10 - Auto-restart on file changes
- **tsconfig-paths** 4.2.0 - Path mapping support

### Testing
- **Jest** 27.5.1 (frontend), 29.7.0 (backend) - Test framework
- **Testing Library** 16.3.0 - React component testing
- **Cypress** 15.1.0 - E2E testing
- **Supertest** 7.1.4 - API endpoint testing
- **jest-axe** 10.0.0 - Accessibility testing
- **MSW** 2.11.2 - API mocking
- **mongodb-memory-server** 10.2.0 - In-memory MongoDB for tests
- **k6** - Load and performance testing

### Code Quality
- **ESLint** 8.57.1 - Linting
- **TypeScript** - Static type checking
- **Prettier** (via types) - Code formatting
- **jest-junit** 16.0.0 - JUnit test reports for CI

### Package Management
- **npm** >=9.0.0 - Package manager
- **concurrently** 9.2.0 - Run multiple commands
- **cross-env** 10.1.0 - Cross-platform environment variables

## Frontend Dependencies

### UI & Styling
- **framer-motion** 10.16.5 - Animation library
- **react-icons** 4.12.0 - Icon library
- **react-calendar** 6.0.0 - Calendar component
- **react-slick** 0.29.0 - Carousel component
- **slick-carousel** 1.8.1 - Carousel styles

### Utilities
- **luxon** 3.7.1 - Date/time manipulation
- **web-vitals** 3.5.0 - Performance metrics

### Payment
- **@stripe/react-stripe-js** 4.0.2 - Stripe React components
- **@stripe/stripe-js** 2.1.0 - Stripe JavaScript SDK

### Development
- **@faker-js/faker** 8.4.1 - Test data generation
- **source-map-explorer** 2.5.3 - Bundle analysis
- **webpack-bundle-analyzer** 4.10.2 - Bundle visualization

## Backend Dependencies

### Security
- **bcrypt** 6.0.0 - Password hashing
- **bcryptjs** 3.0.2 - Password hashing (JS implementation)
- **jsonwebtoken** 9.0.2 - JWT token generation/verification
- **helmet** 7.2.0 - Security headers
- **cors** 2.8.5 - CORS middleware
- **csurf** 1.11.0 - CSRF protection
- **express-rate-limit** 7.5.1 - Rate limiting
- **express-mongo-sanitize** 2.2.0 - MongoDB injection prevention
- **isomorphic-dompurify** 2.26.0 - XSS prevention

### Validation
- **express-validator** 7.2.1 - Request validation
- **zod** 3.22.4 - Schema validation

### Utilities
- **date-fns** 4.1.0 - Date utilities
- **date-fns-tz** 3.2.0 - Timezone support
- **luxon** 3.7.1 - Date/time manipulation
- **uuid** 13.0.0 - UUID generation
- **ua-parser-js** 2.0.5 - User agent parsing
- **compression** 1.8.1 - Response compression
- **cookie-parser** 1.4.7 - Cookie parsing

### Notifications
- **nodemailer** 6.10.1 - Email sending
- **twilio** 5.10.2 - SMS notifications

### Queue & Jobs
- **bullmq** 5.58.2 - Job queue with Redis

### Monitoring & Logging
- **pino** 9.11.0 - Logging
- **pino-http** 10.5.0 - HTTP request logging
- **pino-pretty** 13.1.1 - Pretty log formatting (dev)

### Documentation
- **swagger-jsdoc** 6.2.8 - Swagger documentation generation
- **swagger-ui-express** 5.0.1 - Swagger UI

### Payment
- **stripe** (via backend integration) - Payment processing

### Development
- **@faker-js/faker** 10.0.0 - Test data generation
- **@pact-foundation/pact** 12.1.0 - Contract testing
- **dotenv** 16.6.1 - Environment variable loading

## Development Commands

### Frontend
```bash
npm start                      # Start dev server (port 3000)
npm run build                  # Production build
npm run test:frontend          # Run frontend tests
npm run test:frontend:watch    # Watch mode
npm run test:frontend:coverage # Coverage report
npm run lint                   # Lint code
npm run type-check             # TypeScript check
npm run analyze                # Bundle analysis
```

### Backend
```bash
npm run dev:backend            # Start dev server (port 5000)
npm run build:backend          # Build backend
npm run test:backend           # Run backend tests
npm run test:backend:watch     # Watch mode
npm run test:backend:coverage  # Coverage report
```

### Full Stack
```bash
npm run dev                    # Start both frontend and backend
npm run build:all              # Build both applications
npm run test:all               # Run all tests
npm run test:coverage          # Full coverage report
npm run test:ci                # CI test suite
npm run test:e2e               # Cypress E2E tests
```

### Testing
```bash
npm run test:unit              # Unit tests only
npm run test:integration       # Integration tests only
npm run test:a11y              # Accessibility tests
npm run cy:open                # Open Cypress UI
npm run cy:run                 # Run Cypress headless
npm run perf:load              # k6 load tests
```

### Quality & Analysis
```bash
npm run lint                   # Lint all code
npm run lint:fix               # Auto-fix linting issues
npm run type-check             # TypeScript type checking
npm run analyze:bundle         # Analyze bundle size
npm run lighthouse             # Lighthouse audit
npm run lighthouse:ci          # Lighthouse CI
```

### Utilities
```bash
npm run migrate-types          # Migrate to shared types
npm run fix-type-imports       # Fix type imports
npm run generate-secrets       # Generate JWT secrets
npm run generate-env-secrets   # Generate .env secrets
```

## Environment Requirements

### Runtime
- **Node.js** >=18.0.0
- **npm** >=9.0.0
- **MongoDB** latest stable
- **Redis** latest stable

### Development
- Modern browser with ES6+ support
- Git for version control
- Code editor with TypeScript support (VS Code recommended)

## API Versioning

API supports versioning via:
- **URL Path**: `/api/v1/appointments`
- **Accept Header**: `Accept: application/vnd.topsmile.v1+json`

Current version: **v1**

## Browser Support

### Production
- >0.2% market share
- Not dead browsers
- Not Opera Mini

### Development
- Latest Chrome
- Latest Firefox
- Latest Safari

## Configuration Files

- **tsconfig.json** - TypeScript configuration (frontend)
- **backend/tsconfig.json** - TypeScript configuration (backend)
- **tsconfig.build.json** - Build-specific TypeScript config
- **jest.config.js** - Jest configuration (frontend and backend)
- **cypress.config.ts** - Cypress E2E configuration
- **craco.config.js** - Create React App configuration override
- **.babelrc** - Babel configuration
- **.lighthouserc.json** - Lighthouse CI configuration
- **package.json** - Dependencies and scripts (root, backend, types)

## Performance Optimizations

- **Code Splitting**: Dynamic imports for route-based splitting
- **Tree Shaking**: Unused code elimination
- **Compression**: Gzip compression on backend responses
- **Caching**: Redis caching for frequently accessed data
- **Query Optimization**: MongoDB indexes for common queries
- **Bundle Analysis**: Regular bundle size monitoring
- **Lazy Loading**: Component lazy loading with React.lazy
