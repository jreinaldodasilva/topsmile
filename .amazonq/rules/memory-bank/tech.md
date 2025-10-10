# Technology Stack

## Programming Languages

### Frontend
- **TypeScript 4.9.5** - Type-safe JavaScript
- **JavaScript (ES6+)** - Modern JavaScript features
- **CSS3** - Styling with CSS variables and custom properties

### Backend
- **TypeScript 5.9.2** - Type-safe Node.js development
- **Node.js >=18.0.0** - JavaScript runtime

## Frontend Technologies

### Core Framework
- **React 18.2.0** - UI library with concurrent features
- **React DOM 18.2.0** - React renderer for web
- **React Router 6.30.1** - Client-side routing with lazy loading

### State Management
- **Zustand 4.5.7** - Lightweight state management
- **TanStack Query 5.89.0** - Server state management and caching
- **React Context API** - Component tree state sharing

### UI & Styling
- **Framer Motion 10.16.5** - Animation library
- **React Icons 4.12.0** - Icon components
- **React Calendar 6.0.0** - Calendar component
- **React Slick 0.29.0** - Carousel component
- **CSS Modules** - Scoped styling

### Payment Integration
- **@stripe/react-stripe-js 4.0.2** - Stripe React components
- **@stripe/stripe-js 2.1.0** - Stripe JavaScript SDK

### Utilities
- **Luxon 3.7.1** - Date/time manipulation
- **Web Vitals 3.5.0** - Performance metrics

## Backend Technologies

### Core Framework
- **Express 4.21.2** - Web application framework
- **Node.js >=18.0.0** - Runtime environment

### Database & Caching
- **MongoDB** - Primary database (via Mongoose 8.18.0)
- **Mongoose 8.18.0** - MongoDB ODM with schema validation
- **Redis 5.8.2** - Caching and session storage
- **IORedis 5.7.0** - Redis client

### Authentication & Security
- **jsonwebtoken 9.0.2** - JWT token generation/verification
- **bcrypt 6.0.0** - Password hashing
- **bcryptjs 3.0.2** - Alternative bcrypt implementation
- **helmet 7.2.0** - Security headers
- **csurf 1.11.0** - CSRF protection
- **express-rate-limit 7.5.1** - Rate limiting
- **express-mongo-sanitize 2.2.0** - NoSQL injection prevention
- **isomorphic-dompurify 2.26.0** - XSS protection

### Validation & Data Processing
- **express-validator 7.2.1** - Request validation
- **zod 3.22.4** - Schema validation
- **date-fns 4.1.0** - Date utilities
- **date-fns-tz 3.2.0** - Timezone support

### External Services
- **Stripe** - Payment processing (via STRIPE_SECRET_KEY)
- **Twilio 5.10.2** - SMS notifications
- **Nodemailer 6.10.1** - Email notifications

### Background Jobs
- **BullMQ 5.58.2** - Job queue with Redis

### API Documentation
- **swagger-jsdoc 6.2.8** - OpenAPI specification generation
- **swagger-ui-express 5.0.1** - Interactive API documentation

### Logging & Monitoring
- **pino 9.11.0** - High-performance logging
- **pino-http 10.5.0** - HTTP request logging
- **pino-pretty 13.1.1** - Log formatting (dev)

### Utilities
- **cookie-parser 1.4.7** - Cookie parsing
- **cors 2.8.5** - CORS middleware
- **compression 1.8.1** - Response compression
- **dotenv 16.6.1** - Environment variable management
- **uuid 13.0.0** - UUID generation
- **ua-parser-js 2.0.5** - User agent parsing
- **luxon 3.7.1** - Date/time manipulation
- **otplib 12.0.1** - OTP generation
- **qrcode 1.5.4** - QR code generation

## Testing Technologies

### Frontend Testing
- **Jest 27.5.1** - Test framework
- **@testing-library/react 16.3.0** - React component testing
- **@testing-library/jest-dom 6.8.0** - DOM matchers
- **@testing-library/user-event 14.6.1** - User interaction simulation
- **jest-axe 10.0.0** - Accessibility testing
- **MSW 2.11.2** - API mocking
- **Cypress 15.1.0** - E2E testing

### Backend Testing
- **Jest 29.7.0** - Test framework
- **Supertest 7.1.4** - HTTP assertion library
- **@faker-js/faker 10.0.0** - Test data generation
- **mongodb-memory-server 10.2.0** - In-memory MongoDB
- **@pact-foundation/pact 12.1.0** - Contract testing

### Performance Testing
- **k6** - Load testing tool
- **Lighthouse** - Performance auditing

## Build Tools & Development

### Build System
- **React Scripts 5.0.1** - Create React App build system
- **TypeScript Compiler** - Type checking and compilation
- **Webpack** (via React Scripts) - Module bundling
- **Babel** (via React Scripts) - JavaScript transpilation

### Development Tools
- **nodemon 3.1.10** - Auto-restart for Node.js
- **ts-node 10.9.2** - TypeScript execution
- **tsconfig-paths 4.2.0** - Path mapping support
- **concurrently 9.2.0** - Run multiple commands

### Code Quality
- **ESLint 8.57.1** - Linting
- **@typescript-eslint** - TypeScript ESLint rules
- **TypeScript** - Static type checking

### Analysis Tools
- **source-map-explorer 2.5.3** - Bundle analysis
- **webpack-bundle-analyzer 4.10.2** - Bundle visualization

## Shared Packages

### Internal Packages
- **@topsmile/types** - Shared TypeScript types (monorepo package)

## Development Commands

### Frontend
```bash
npm start                    # Start dev server (port 3000)
npm run build                # Production build
npm run test:frontend        # Run frontend tests
npm run test:frontend:watch  # Watch mode
npm run test:frontend:coverage # Coverage report
npm run lint                 # Lint code
npm run type-check           # TypeScript check
npm run analyze              # Bundle analysis
```

### Backend
```bash
npm run dev:backend          # Start dev server (port 5000)
npm run build:backend        # Build backend
npm run test:backend         # Run backend tests
npm run test:backend:watch   # Watch mode
npm run test:backend:coverage # Coverage report
```

### Full Stack
```bash
npm run dev                  # Start both frontend and backend
npm run build:all            # Build both applications
npm run test:all             # Run all tests
npm run test:coverage        # Full coverage report
npm run test:ci              # CI test suite
npm run test:e2e             # Cypress E2E tests
```

## Environment Requirements

### Runtime
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### External Services
- **MongoDB** - Latest stable version
- **Redis** - Latest stable version
- **Stripe Account** - For payment processing
- **Twilio Account** - For SMS notifications
- **SMTP Server** - For email notifications

## API Versioning

- **Current Version**: v1
- **URL Path**: `/api/v1/endpoint`
- **Header**: `Accept: application/vnd.topsmile.v1+json`

## Browser Support

### Production
- >0.2% market share
- Not dead browsers
- Not Opera Mini

### Development
- Latest Chrome
- Latest Firefox
- Latest Safari

## Security Features

- **JWT Authentication** - Access and refresh tokens
- **HttpOnly Cookies** - Secure token storage
- **CSRF Protection** - Token-based CSRF prevention
- **Rate Limiting** - Request throttling
- **Helmet** - Security headers
- **Data Sanitization** - NoSQL injection and XSS prevention
- **Password Hashing** - bcrypt with salt rounds
- **Token Blacklist** - Redis-based revocation
- **Input Validation** - express-validator and zod
