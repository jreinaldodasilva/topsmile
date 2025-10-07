# TopSmile - Technology Stack

## Programming Languages
- **TypeScript**: 4.9.5 (frontend), 5.9.2 (backend)
- **JavaScript**: ES2020+ for configuration files
- **CSS**: CSS3 with CSS variables

## Frontend Stack

### Core Framework
- **React**: 18.2.0
- **React DOM**: 18.2.0
- **React Router**: 6.30.1

### State Management
- **Zustand**: 4.5.7 - Lightweight state management
- **TanStack Query**: 5.89.0 - Server state management and caching
- **React Context**: Built-in context for auth and errors

### UI & Styling
- **Framer Motion**: 10.16.5 - Animation library
- **React Icons**: 4.12.0 - Icon library
- **React Calendar**: 6.0.0 - Calendar component
- **React Slick**: 0.29.0 - Carousel component
- **CSS Modules**: Component-scoped styling
- **CSS Variables**: Design tokens and theming

### Payment Integration
- **Stripe React**: 4.0.2
- **Stripe JS**: 2.1.0

### Date/Time
- **Luxon**: 3.7.1 - Date manipulation and formatting

### Build Tools
- **React Scripts**: 5.0.1 - Create React App build system
- **CRACO**: Custom React App configuration
- **Webpack**: Bundled with React Scripts
- **Babel**: Transpilation

## Backend Stack

### Runtime & Framework
- **Node.js**: >=18.0.0
- **Express**: 4.21.2
- **TypeScript**: 5.9.2

### Database
- **MongoDB**: >=5.0 (via Mongoose)
- **Mongoose**: 8.18.0 - ODM for MongoDB
- **Redis**: 5.8.2 - Caching and session storage
- **IORedis**: 5.7.0 - Redis client

### Authentication & Security
- **JWT**: 9.0.2 - JSON Web Tokens
- **bcrypt**: 6.0.0 - Password hashing
- **bcryptjs**: 3.0.2 - Alternative bcrypt implementation
- **otplib**: 12.0.1 - OTP generation for MFA
- **qrcode**: 1.5.4 - QR code generation
- **Helmet**: 7.2.0 - Security headers
- **CORS**: 2.8.5 - Cross-origin resource sharing
- **CSURF**: 1.11.0 - CSRF protection
- **express-rate-limit**: 7.5.1 - Rate limiting
- **express-mongo-sanitize**: 2.2.0 - NoSQL injection prevention

### Validation & Sanitization
- **Zod**: 3.22.4 - Schema validation
- **express-validator**: 7.2.1 - Request validation
- **isomorphic-dompurify**: 2.26.0 - HTML sanitization

### External Services
- **Twilio**: 5.10.2 - SMS notifications
- **Nodemailer**: 6.10.1 - Email sending
- **Stripe**: (via frontend SDK) - Payment processing

### Background Jobs
- **BullMQ**: 5.58.2 - Job queue with Redis

### Logging
- **Pino**: 9.11.0 - High-performance logging
- **Pino HTTP**: 10.5.0 - HTTP request logging
- **Pino Pretty**: 13.1.1 - Log formatting (dev)

### API Documentation
- **Swagger JSDoc**: 6.2.8 - API documentation generation
- **Swagger UI Express**: 5.0.1 - API documentation UI

### Date/Time
- **Luxon**: 3.7.1 - Date manipulation
- **date-fns**: 4.1.0 - Date utilities
- **date-fns-tz**: 3.2.0 - Timezone support

### Utilities
- **uuid**: 13.0.0 - UUID generation
- **ua-parser-js**: 2.0.5 - User agent parsing
- **cookie-parser**: 1.4.7 - Cookie parsing
- **dotenv**: 16.6.1 - Environment variables

## Testing Stack

### Frontend Testing
- **Jest**: 27.5.1 - Test runner
- **Testing Library React**: 16.3.0 - React component testing
- **Testing Library User Event**: 14.6.1 - User interaction simulation
- **Testing Library Jest DOM**: 6.8.0 - DOM matchers
- **jest-axe**: 10.0.0 - Accessibility testing
- **MSW**: 2.11.2 - API mocking

### Backend Testing
- **Jest**: 29.7.0 - Test runner
- **ts-jest**: 29.4.1 - TypeScript support for Jest
- **Supertest**: 7.1.4 - HTTP assertion library
- **MongoDB Memory Server**: 10.2.0 - In-memory MongoDB for testing
- **Pact**: 12.1.0 - Contract testing

### E2E Testing
- **Cypress**: 15.1.0 - End-to-end testing framework

### Performance Testing
- **k6**: Load testing tool
- **Lighthouse**: Performance auditing

### Test Utilities
- **Faker**: 8.4.1 (frontend), 10.0.0 (backend) - Test data generation
- **jest-junit**: 16.0.0 - JUnit report generation

## Development Tools

### TypeScript
- **ts-node**: 10.9.2 - TypeScript execution
- **tsconfig-paths**: 4.2.0 - Path mapping support

### Code Quality
- **ESLint**: 8.57.1 - Linting
- **TypeScript ESLint**: 6.21.0 - TypeScript linting rules
- **Prettier**: (via types) - Code formatting

### Development Servers
- **Nodemon**: 3.1.10 - Auto-restart for backend
- **React Scripts**: Hot reload for frontend
- **Concurrently**: 9.2.0 - Run multiple commands

### Build Analysis
- **source-map-explorer**: 2.5.3 - Bundle analysis
- **webpack-bundle-analyzer**: 4.10.2 - Webpack bundle visualization

## CI/CD

### GitHub Actions
- **pr-validation.yml**: Pull request validation
- **quality.yml**: Code quality checks
- **test.yml**: Automated testing

### Testing in CI
- Jest with coverage reporting
- Cypress E2E tests
- Lighthouse CI for performance

## Package Management
- **npm**: >=9.0.0
- **Workspaces**: Monorepo package management

## Development Commands

### Frontend
```bash
npm start                    # Start development server
npm run build               # Production build
npm run test:frontend       # Run frontend tests
npm run test:frontend:watch # Watch mode
npm run test:a11y          # Accessibility tests
npm run analyze            # Bundle analysis
npm run lint               # Lint code
npm run type-check         # TypeScript check
```

### Backend
```bash
cd backend && npm run dev   # Start development server
cd backend && npm run build # Production build
cd backend && npm test      # Run backend tests
cd backend && npm run test:watch # Watch mode
cd backend && npm run lint  # Lint code
```

### Full Stack
```bash
npm run dev                 # Start both frontend and backend
npm run build:all          # Build both applications
npm run test:all           # Run all tests
npm run test:e2e           # Run E2E tests
npm run test:coverage      # Generate coverage reports
npm run test:ci            # CI test suite
```

### Testing
```bash
npm run test:frontend      # Frontend unit/integration tests
npm run test:backend       # Backend unit/integration tests
npm run test:e2e           # Cypress E2E tests
npm run test:a11y          # Accessibility tests
npm run cy:open            # Open Cypress UI
npm run lighthouse         # Run Lighthouse audit
```

### Utilities
```bash
npm run migrate-types      # Migrate shared types
npm run fix-type-imports   # Fix type imports
npm run generate-secrets   # Generate JWT secrets
npm run analyze:bundle     # Analyze bundle size
```

## Environment Requirements
- **Node.js**: >=18.0.0
- **npm**: >=9.0.0
- **MongoDB**: >=5.0
- **Redis**: Latest stable version

## Browser Support
- **Production**: >0.2%, not dead, not op_mini all
- **Development**: Latest Chrome, Firefox, Safari

## Key Configuration Files
- `package.json`: Frontend dependencies and scripts
- `backend/package.json`: Backend dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `jest.config.js`: Jest test configuration
- `cypress.config.ts`: Cypress E2E configuration
- `craco.config.js`: Create React App overrides
- `.env`: Environment variables
