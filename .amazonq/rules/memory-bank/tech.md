# Technology Stack

## Programming Languages
- **TypeScript 4.9.5+**: Primary language for both frontend and backend
- **JavaScript**: Configuration files and legacy scripts

## Frontend Technologies

### Core Framework
- **React 18.2.0**: UI library with functional components and hooks
- **React Router DOM 6.30.1**: Client-side routing
- **React Scripts 5.0.1**: Create React App build tooling

### State Management
- **Zustand 4.5.7**: Lightweight state management
- **TanStack Query 5.89.0**: Server state management and data fetching
- **React Context API**: Authentication and error state

### UI & Styling
- **CSS3**: Custom styling with CSS variables
- **Framer Motion 10.16.5**: Animation library
- **React Icons 4.12.0**: Icon library
- **React Calendar 6.0.0**: Calendar component
- **React Slick 0.29.0**: Carousel component

### Payment Integration
- **Stripe React 4.0.2**: Payment processing UI
- **Stripe.js 2.1.0**: Stripe SDK

### Date/Time
- **Luxon 3.7.1**: Date and time manipulation

## Backend Technologies

### Core Framework
- **Node.js 18+**: Runtime environment
- **Express 4.21.2**: Web application framework
- **TypeScript 5.9.2**: Type-safe backend development

### Database & ODM
- **MongoDB**: NoSQL database
- **Mongoose 8.18.0**: MongoDB object modeling

### Authentication & Security
- **jsonwebtoken 9.0.2**: JWT token generation and verification
- **bcrypt 6.0.0 / bcryptjs 3.0.2**: Password hashing
- **otplib 12.0.1**: OTP generation for 2FA
- **qrcode 1.5.4**: QR code generation
- **Helmet 7.2.0**: Security headers
- **CORS 2.8.5**: Cross-origin resource sharing
- **csurf 1.11.0**: CSRF protection
- **express-rate-limit 7.5.1**: Rate limiting
- **express-mongo-sanitize 2.2.0**: MongoDB injection prevention

### Validation & Sanitization
- **express-validator 7.2.1**: Request validation
- **Zod 3.22.4**: Schema validation
- **isomorphic-dompurify 2.26.0**: HTML sanitization

### Background Jobs & Caching
- **BullMQ 5.58.2**: Job queue management
- **Redis 5.8.2 / ioredis 5.7.0**: Caching and session storage

### Communication
- **Nodemailer 6.10.1**: Email sending
- **Twilio 5.10.2**: SMS notifications

### Logging & Monitoring
- **Pino 9.11.0**: High-performance logging
- **pino-http 10.5.0**: HTTP request logging

### Date/Time
- **date-fns 4.1.0**: Date manipulation
- **date-fns-tz 3.2.0**: Timezone support
- **Luxon 3.7.1**: Advanced date/time handling

### API Documentation
- **swagger-jsdoc 6.2.8**: OpenAPI documentation generation
- **swagger-ui-express 5.0.1**: API documentation UI

### Utilities
- **dotenv 16.6.1**: Environment variable management
- **cookie-parser 1.4.7**: Cookie parsing
- **uuid 13.0.0**: UUID generation
- **ua-parser-js 2.0.5**: User agent parsing

## Testing Technologies

### Frontend Testing
- **Jest 27.5.1**: Test framework
- **Testing Library React 16.3.0**: React component testing
- **Testing Library User Event 14.6.1**: User interaction simulation
- **jest-axe 10.0.0**: Accessibility testing
- **MSW 2.11.2**: API mocking

### Backend Testing
- **Jest 29.7.0**: Test framework
- **Supertest 7.1.4**: HTTP assertion library
- **MongoDB Memory Server 10.2.0**: In-memory MongoDB for testing
- **Faker.js 10.0.0**: Test data generation

### E2E Testing
- **Cypress 15.1.0**: End-to-end testing framework

### Performance Testing
- **k6**: Load testing tool
- **Lighthouse**: Performance auditing

### Test Reporting
- **jest-junit 16.0.0**: JUnit XML reporter for CI/CD

## Build & Development Tools

### Build Tools
- **CRACO**: Create React App Configuration Override
- **TypeScript Compiler**: Type checking and compilation
- **Webpack**: Module bundling (via React Scripts)
- **Babel**: JavaScript transpilation

### Development Tools
- **nodemon 3.1.10**: Auto-restart for backend development
- **ts-node 10.9.2**: TypeScript execution for Node.js
- **tsconfig-paths 4.2.0**: Path mapping support
- **concurrently 9.2.0**: Run multiple commands concurrently

### Code Quality
- **ESLint 8.57.1**: Linting
- **TypeScript ESLint**: TypeScript-specific linting rules
- **Prettier**: Code formatting (implied by types)

### Analysis Tools
- **source-map-explorer 2.5.3**: Bundle size analysis
- **webpack-bundle-analyzer 4.10.2**: Bundle visualization

## CI/CD & DevOps

### Version Control
- **Git**: Source control
- **GitHub**: Repository hosting
- **GitHub Actions**: CI/CD pipelines

### Containerization
- Configuration suggests Docker readiness (production env files)

## Environment Requirements

### Node.js
- **Minimum Version**: 18.0.0
- **npm Version**: 9.0.0+

### Browser Support
- **Production**: >0.2%, not dead, not op_mini all
- **Development**: Latest Chrome, Firefox, Safari

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
npm run test:backend        # Run backend tests
npm run test:backend:coverage  # Backend test coverage
npm run build:all           # Build frontend and backend
```

### Full Stack
```bash
npm run dev                 # Run frontend and backend concurrently
npm run test:all            # Run all tests
npm run test:ci             # CI test suite
npm run test:e2e            # E2E tests with Cypress
```

### Testing
```bash
npm run test:a11y           # Accessibility tests
npm run cy:open             # Open Cypress UI
npm run lighthouse          # Performance audit
npm run perf:load           # Load testing with k6
```

## Package Management
- **npm**: Primary package manager
- **Workspaces**: Monorepo with local package linking (@topsmile/types)
