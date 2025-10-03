# TopSmile - Technology Stack

## Programming Languages
- **TypeScript 4.9.5+**: Primary language for both frontend and backend
- **JavaScript**: Legacy support and configuration files
- **CSS**: Styling with CSS modules and global styles

## Frontend Stack

### Core Framework
- **React 18.2.0**: UI library with hooks and concurrent features
- **React DOM 18.2.0**: React renderer for web
- **React Router 6.30.1**: Client-side routing

### State Management
- **TanStack Query 5.89.0**: Server state management and caching
- **React Context**: Global state for auth and errors

### UI & Styling
- **Framer Motion 10.16.5**: Animation library
- **React Icons 4.12.0**: Icon components
- **React Calendar 6.0.0**: Calendar component
- **React Slick 0.29.0**: Carousel component
- **CSS Modules**: Component-scoped styling

### Payment Integration
- **@stripe/react-stripe-js 4.0.2**: React components for Stripe
- **@stripe/stripe-js 2.1.0**: Stripe JavaScript SDK

### Utilities
- **Luxon 3.7.1**: Date/time manipulation
- **Web Vitals 3.5.0**: Performance monitoring

## Backend Stack

### Core Framework
- **Node.js >=18.0.0**: JavaScript runtime
- **Express 4.21.2**: Web application framework
- **TypeScript 5.9.2**: Type-safe development

### Database & Caching
- **MongoDB**: Primary database (via Mongoose)
- **Mongoose 8.18.0**: MongoDB ODM
- **Redis 5.8.2**: Caching and session storage
- **IORedis 5.7.0**: Redis client

### Authentication & Security
- **jsonwebtoken 9.0.2**: JWT token generation/validation
- **bcrypt 6.0.0**: Password hashing
- **bcryptjs 3.0.2**: Alternative bcrypt implementation
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
- **BullMQ 5.58.2**: Job queue with Redis

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

## Testing Stack

### Frontend Testing
- **Jest 27.5.1**: Test framework
- **@testing-library/react 16.3.0**: React component testing
- **@testing-library/jest-dom 6.8.0**: DOM matchers
- **@testing-library/user-event 14.6.1**: User interaction simulation
- **jest-axe 10.0.0**: Accessibility testing
- **MSW 2.11.2**: API mocking

### Backend Testing
- **Jest 29.7.0**: Test framework
- **Supertest 7.1.4**: HTTP assertion library
- **mongodb-memory-server 10.2.0**: In-memory MongoDB
- **@faker-js/faker**: Test data generation

### E2E Testing
- **Cypress 15.1.0**: End-to-end testing framework

### Test Utilities
- **ts-jest**: TypeScript support for Jest
- **jest-junit 16.0.0**: JUnit report generation

## Build Tools & Development

### Build System
- **react-scripts 5.0.1**: Create React App build configuration
- **TypeScript Compiler**: Type checking and compilation
- **Webpack**: Module bundling (via react-scripts)

### Development Tools
- **nodemon 3.1.10**: Auto-restart for backend
- **ts-node 10.9.2**: TypeScript execution
- **tsconfig-paths 4.2.0**: Path mapping support
- **concurrently 9.2.0**: Run multiple commands

### Code Quality
- **ESLint 8.57.1**: Linting
- **@typescript-eslint**: TypeScript ESLint rules
- **Prettier**: Code formatting (implied)

### Analysis Tools
- **source-map-explorer 2.5.3**: Bundle analysis
- **webpack-bundle-analyzer 4.10.2**: Bundle visualization

## Shared Packages
- **@topsmile/types**: Shared TypeScript type definitions

## Environment Requirements
- **Node.js**: >=18.0.0
- **npm**: >=9.0.0
- **MongoDB**: >=5.0
- **Redis**: Latest stable

## Development Commands

### Frontend
```bash
npm start                    # Start dev server (port 3000)
npm run build               # Production build
npm run test:frontend       # Run frontend tests
npm run test:frontend:watch # Watch mode
npm run test:frontend:coverage # With coverage
npm run lint                # Lint code
npm run type-check          # TypeScript check
```

### Backend
```bash
npm run server              # Start backend dev server (port 5000)
cd backend && npm run dev   # Alternative backend start
cd backend && npm test      # Run backend tests
cd backend && npm run test:watch # Watch mode
cd backend && npm run test:coverage # With coverage
```

### Full Stack
```bash
npm run dev                 # Start both frontend and backend
npm run build:all           # Build both applications
npm run test:all            # Run all tests
npm run test:ci             # CI test suite
```

### E2E Testing
```bash
npm run test:e2e            # Run Cypress tests
npm run cy:open             # Open Cypress UI
```

## Configuration Files
- **tsconfig.json**: TypeScript configuration (frontend & backend)
- **jest.config.js**: Jest test configuration
- **cypress.config.js**: Cypress E2E configuration
- **.env**: Environment variables
- **package.json**: Dependencies and scripts
