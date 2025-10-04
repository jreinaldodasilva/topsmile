# TopSmile - Technology Stack

## Programming Languages
- **TypeScript 4.9.5** (Frontend) / **5.9.2** (Backend): Primary language for type safety
- **JavaScript**: Configuration files and legacy code
- **CSS**: Styling with CSS modules and global styles

## Frontend Stack

### Core Framework
- **React 18.2.0**: UI library with concurrent features
- **React Router DOM 6.30.1**: Client-side routing
- **React Scripts 5.0.1**: Create React App build tooling

### State Management & Data Fetching
- **TanStack Query 5.89.0**: Server state management, caching, and synchronization
- **React Context API**: Global state for auth and errors

### UI & Animation
- **Framer Motion 10.16.5**: Animation library
- **React Icons 4.12.0**: Icon components
- **React Calendar 6.0.0**: Calendar component
- **React Slick 0.29.0**: Carousel component

### Payment Integration
- **@stripe/react-stripe-js 4.0.2**: Stripe React components
- **@stripe/stripe-js 2.1.0**: Stripe JavaScript SDK

### Utilities
- **Luxon 3.7.1**: Date/time manipulation
- **Web Vitals 3.5.0**: Performance monitoring

## Backend Stack

### Core Framework
- **Node.js >=18.0.0**: Runtime environment
- **Express 4.21.2**: Web application framework
- **TypeScript 5.9.2**: Type-safe development

### Database & Caching
- **MongoDB**: Primary database (via Mongoose)
- **Mongoose 8.18.0**: MongoDB ODM
- **Redis 5.8.2**: Caching and session storage
- **IORedis 5.7.0**: Redis client

### Authentication & Security
- **jsonwebtoken 9.0.2**: JWT token generation/verification
- **bcrypt 6.0.0 / bcryptjs 3.0.2**: Password hashing
- **helmet 7.2.0**: Security headers
- **cors 2.8.5**: Cross-origin resource sharing
- **express-rate-limit 7.5.1**: Rate limiting
- **express-mongo-sanitize 2.2.0**: MongoDB injection prevention
- **csurf 1.11.0**: CSRF protection

### Validation & Sanitization
- **express-validator 7.2.1**: Request validation
- **zod 3.22.4**: Schema validation
- **isomorphic-dompurify 2.26.0**: HTML sanitization

### Background Jobs
- **BullMQ 5.58.2**: Queue management with Redis

### Utilities
- **date-fns 4.1.0**: Date manipulation
- **date-fns-tz 3.2.0**: Timezone support
- **luxon 3.7.1**: Alternative date library
- **uuid 13.0.0**: UUID generation
- **pino 9.11.0**: Logging
- **pino-http 10.5.0**: HTTP request logging
- **nodemailer 6.10.1**: Email sending

### API Documentation
- **swagger-jsdoc 6.2.8**: OpenAPI spec generation
- **swagger-ui-express 5.0.1**: API documentation UI

## Shared Packages
- **@topsmile/types**: Shared TypeScript type definitions

## Testing Stack

### Frontend Testing
- **Jest 27.5.1**: Test runner and framework
- **@testing-library/react 16.3.0**: React component testing
- **@testing-library/jest-dom 6.8.0**: DOM matchers
- **@testing-library/user-event 14.6.1**: User interaction simulation
- **MSW 2.11.2**: API mocking
- **jest-axe 10.0.0**: Accessibility testing

### Backend Testing
- **Jest 29.7.0**: Test runner and framework
- **Supertest 7.1.4**: HTTP assertion library
- **mongodb-memory-server 10.2.0**: In-memory MongoDB for testing
- **@faker-js/faker**: Test data generation

### E2E Testing
- **Cypress 15.1.0**: End-to-end testing framework

### Test Reporting
- **jest-junit 16.0.0**: JUnit XML reporter for CI/CD

## Development Tools

### Build & Bundling
- **Webpack**: Via React Scripts
- **TypeScript Compiler**: Type checking and transpilation
- **ts-node 10.9.2**: TypeScript execution for development
- **nodemon 3.1.10**: Auto-restart on file changes

### Code Quality
- **ESLint 8.57.1**: Linting
- **@typescript-eslint**: TypeScript-specific linting rules
- **Prettier**: Code formatting (implied by configuration)

### Development Utilities
- **concurrently 9.2.0**: Run multiple commands
- **cross-env 10.0.0**: Cross-platform environment variables
- **tsconfig-paths 4.2.0**: TypeScript path mapping
- **source-map-explorer 2.5.3**: Bundle analysis

### Performance Testing
- **k6**: Load testing tool

## Development Commands

### Frontend
```bash
npm start                    # Start development server
npm run build               # Production build
npm run test:frontend       # Run frontend tests
npm run test:frontend:watch # Watch mode
npm run test:frontend:coverage # With coverage
npm run lint                # Lint code
npm run type-check          # TypeScript type checking
```

### Backend
```bash
npm run dev                 # Start development server
npm run build              # Compile TypeScript
npm start                  # Run production build
npm run test:backend       # Run backend tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e           # E2E tests only
npm run lint               # Lint code
npm run type-check         # TypeScript type checking
```

### Full Stack
```bash
npm run dev                # Start both frontend and backend
npm run build:all          # Build both applications
npm run test:all           # Run all tests
npm run test:coverage      # Full coverage report
npm run test:ci            # CI test suite
```

### E2E Testing
```bash
npm run test:e2e           # Run Cypress tests headless
npm run cy:open            # Open Cypress UI
```

## Environment Requirements
- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **MongoDB**: >= 5.0
- **Redis**: For caching and queues

## Browser Support
- **Production**: >0.2%, not dead, not op_mini all
- **Development**: Latest Chrome, Firefox, Safari
