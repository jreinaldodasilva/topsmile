# TopSmile - Technology Stack

## Programming Languages
- **TypeScript 4.9.5+**: Primary language for type safety across frontend and backend
- **JavaScript**: Legacy support and configuration files
- **CSS3**: Styling with CSS variables and modern features

## Frontend Stack

### Core Framework
- **React 18.2.0**: UI library with concurrent features
- **React DOM 18.2.0**: DOM rendering
- **React Router DOM 6.30.1**: Client-side routing

### State Management
- **Zustand**: Lightweight global state management
- **TanStack Query 5.89.0**: Server state management, caching, and data fetching
- **React Context**: Authentication and error handling contexts

### UI & Styling
- **Framer Motion 10.16.5**: Animation library
- **React Icons 4.12.0**: Icon library
- **React Calendar 6.0.0**: Calendar component
- **React Slick 0.29.0**: Carousel component
- **CSS Modules**: Component-scoped styling
- **CSS Variables**: Design tokens and theming

### Payment Integration
- **@stripe/stripe-js 2.1.0**: Stripe JavaScript SDK
- **@stripe/react-stripe-js 4.0.2**: React Stripe components

### Build Tools
- **React Scripts 5.0.1**: Create React App build system
- **CRACO**: Create React App Configuration Override
- **Webpack**: Module bundler (via CRA)
- **Babel**: JavaScript transpiler (via CRA)

### Development Tools
- **TypeScript Compiler**: Type checking
- **Source Map Explorer**: Bundle analysis
- **Webpack Bundle Analyzer**: Bundle visualization
- **Concurrently**: Run multiple commands

## Backend Stack

### Runtime & Framework
- **Node.js >=18.0.0**: JavaScript runtime
- **Express 4.21.2**: Web application framework
- **TypeScript 5.9.2**: Type-safe backend development

### Database & Caching
- **MongoDB 8.18.0**: Primary database (Mongoose ODM)
- **Redis 5.8.2**: Caching and session storage
- **IORedis 5.7.0**: Redis client

### Authentication & Security
- **jsonwebtoken 9.0.2**: JWT token generation/verification
- **bcrypt 6.0.0**: Password hashing
- **otplib 12.0.1**: OTP/MFA generation
- **qrcode 1.5.4**: QR code generation for MFA
- **helmet 7.2.0**: Security headers
- **express-rate-limit 7.5.1**: Rate limiting
- **express-mongo-sanitize 2.2.0**: NoSQL injection prevention
- **csurf 1.11.0**: CSRF protection
- **cors 2.8.5**: Cross-origin resource sharing

### Validation & Sanitization
- **express-validator 7.2.1**: Request validation
- **zod 3.22.4**: Schema validation
- **isomorphic-dompurify 2.26.0**: HTML sanitization

### Background Jobs
- **BullMQ 5.58.2**: Queue management for async tasks

### Communication
- **Nodemailer 6.10.1**: Email sending
- **Twilio 5.10.2**: SMS notifications

### Logging & Monitoring
- **Pino 9.11.0**: High-performance logging
- **Pino-HTTP 10.5.0**: HTTP request logging
- **Pino-Pretty 13.1.1**: Development log formatting

### Date & Time
- **Luxon 3.7.1**: Date/time manipulation
- **date-fns 4.1.0**: Date utilities
- **date-fns-tz 3.2.0**: Timezone support

### API Documentation
- **Swagger JSDoc 6.2.8**: API documentation generation
- **Swagger UI Express 5.0.1**: Interactive API documentation

### Utilities
- **uuid 13.0.0**: Unique identifier generation
- **ua-parser-js 2.0.5**: User agent parsing
- **cookie-parser 1.4.7**: Cookie parsing
- **dotenv 16.6.1**: Environment variable management

## Testing Stack

### Frontend Testing
- **Jest 27.5.1**: Test runner and framework
- **Testing Library React 16.3.0**: React component testing
- **Testing Library Jest-DOM 6.8.0**: DOM matchers
- **Testing Library User-Event 14.6.1**: User interaction simulation
- **MSW 2.11.2**: API mocking
- **jest-axe 10.0.0**: Accessibility testing

### Backend Testing
- **Jest 29.7.0**: Test runner
- **Supertest 7.1.4**: HTTP assertion library
- **MongoDB Memory Server 10.2.0**: In-memory MongoDB for testing
- **Faker 10.0.0**: Test data generation

### E2E Testing
- **Cypress 15.1.0**: End-to-end testing framework

### Performance Testing
- **k6**: Load testing tool

### Test Utilities
- **ts-jest**: TypeScript support for Jest
- **jest-junit 16.0.0**: JUnit XML reporter for CI
- **jest-watch-typeahead 1.1.0**: Enhanced watch mode

## Development Tools

### TypeScript
- **ts-node 10.9.2**: TypeScript execution
- **tsconfig-paths 4.2.0**: Path mapping support

### Code Quality
- **ESLint 8.57.1**: Linting
- **@typescript-eslint**: TypeScript ESLint rules
- **Prettier**: Code formatting (via ESLint integration)

### Development Servers
- **Nodemon 3.1.10**: Auto-restart for backend development
- **React Scripts**: Frontend development server with HMR

### CI/CD
- **GitHub Actions**: Automated workflows
- **Lighthouse CI**: Performance monitoring
- **Jest JUnit**: Test reporting for CI

## Package Management
- **npm >=9.0.0**: Package manager
- **Workspaces**: Monorepo package management

## Environment Requirements
- **Node.js**: >=18.0.0
- **npm**: >=9.0.0
- **MongoDB**: >=5.0
- **Redis**: Latest stable

## Development Commands

### Frontend
```bash
npm start                    # Start development server (port 3000)
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
cd backend && npm run dev   # Start backend server (port 5000)
cd backend && npm run build # Build backend
cd backend && npm test      # Run backend tests
cd backend && npm run test:watch # Watch mode
cd backend && npm run lint  # Lint code
```

### Full Stack
```bash
npm run dev                 # Start both frontend and backend
npm run build:all          # Build both applications
npm run test:all           # Run all tests
npm run test:ci            # CI test suite
npm run test:e2e           # E2E tests with Cypress
```

### Testing
```bash
npm run test:frontend:coverage  # Frontend coverage
npm run test:backend:coverage   # Backend coverage
npm run test:coverage          # Full coverage report
npm run cy:open                # Open Cypress UI
npm run cy:run                 # Run Cypress headless
```

### Utilities
```bash
npm run migrate-types      # Migrate shared types
npm run fix-type-imports   # Fix import statements
npm run generate-secrets   # Generate JWT secrets
npm run analyze:bundle     # Analyze bundle size
npm run perf:load         # Run load tests
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

## API Standards
- RESTful conventions
- JWT authentication
- JSON request/response bodies
- Standard HTTP status codes
- Comprehensive error responses
- API versioning ready

## Performance Optimizations
- Code splitting with React.lazy
- Tree shaking
- Bundle optimization
- MongoDB indexing (50+ indexes)
- Redis caching
- Query optimization
- Image optimization
- Lazy loading
- Memoization

## Security Features
- HTTPS enforcement
- JWT with refresh tokens
- Password hashing (bcrypt)
- MFA support
- Rate limiting
- CSRF protection
- XSS prevention
- SQL/NoSQL injection prevention
- Security headers (Helmet)
- Input validation and sanitization
- Audit logging
- Session management
