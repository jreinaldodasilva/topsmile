# TopSmile - Technology Stack

## Programming Languages
- **TypeScript 4.9.5 / 5.9.2**: Primary language for type safety
- **JavaScript**: Legacy support and configuration files

## Frontend Stack

### Core Framework
- **React 18.2.0**: UI library with concurrent features
- **React DOM 18.2.0**: DOM rendering
- **React Router DOM 6.30.1**: Client-side routing

### State Management
- **TanStack Query 5.89.0**: Server state management, caching, and synchronization
- **React Context API**: Global state for auth and errors

### UI & Styling
- **Framer Motion 10.16.5**: Animation library
- **React Icons 4.12.0**: Icon components
- **React Calendar 6.0.0**: Calendar component
- **React Slick 0.29.0**: Carousel component
- **CSS Modules**: Component-scoped styling

### Payment Processing
- **Stripe React 4.0.2**: Stripe Elements integration
- **Stripe.js 2.1.0**: Stripe SDK

### Utilities
- **Luxon 3.7.1**: Date/time manipulation
- **Web Vitals 3.5.0**: Performance monitoring

### Build Tools
- **React Scripts 5.0.1**: Create React App build system
- **Webpack**: Module bundler (via CRA)
- **Babel**: JavaScript transpiler (via CRA)

## Backend Stack

### Runtime & Framework
- **Node.js >=18.0.0**: JavaScript runtime
- **Express 4.21.2**: Web application framework
- **TypeScript 5.9.2**: Type-safe development

### Database
- **MongoDB 8.18.0**: NoSQL database
- **Mongoose 8.18.0**: ODM for MongoDB
- **MongoDB Memory Server 10.2.0**: In-memory DB for testing

### Caching & Queues
- **Redis 5.8.2**: Caching and session storage
- **IORedis 5.7.0**: Redis client
- **BullMQ 5.58.2**: Job queue system

### Authentication & Security
- **JWT (jsonwebtoken 9.0.2)**: Token-based authentication
- **Bcrypt 6.0.0 / Bcryptjs 3.0.2**: Password hashing
- **Helmet 7.2.0**: Security headers
- **CORS 2.8.5**: Cross-origin resource sharing
- **CSURF 1.11.0**: CSRF protection
- **Express Rate Limit 7.5.1**: Rate limiting
- **Express Mongo Sanitize 2.2.0**: NoSQL injection prevention
- **Express Validator 7.2.1**: Request validation

### Utilities
- **Date-fns 4.1.0**: Date manipulation
- **Date-fns-tz 3.2.0**: Timezone support
- **Luxon 3.7.1**: Alternative date library
- **UUID 13.0.0**: Unique ID generation
- **Zod 3.22.4**: Schema validation
- **DOMPurify 2.26.0**: XSS sanitization

### Logging
- **Pino 9.11.0**: High-performance logging
- **Pino-HTTP 10.5.0**: HTTP request logging
- **Pino-Pretty 13.1.1**: Log formatting (dev)

### Email
- **Nodemailer 6.10.1**: Email sending

### API Documentation
- **Swagger JSDoc 6.2.8**: API documentation generation
- **Swagger UI Express 5.0.1**: Interactive API docs

### Development Tools
- **Nodemon 3.1.10**: Auto-restart on file changes
- **TS-Node 10.9.2**: TypeScript execution
- **TSConfig Paths 4.2.0**: Path mapping support

## Testing Stack

### Test Frameworks
- **Jest 27.5.1 / 29.7.0**: Unit and integration testing
- **Cypress 15.1.0**: End-to-end testing
- **Supertest 7.1.4**: HTTP assertion library

### Testing Utilities
- **Testing Library React 16.3.0**: React component testing
- **Testing Library Jest-DOM 6.8.0**: DOM matchers
- **Testing Library User Event 14.6.1**: User interaction simulation
- **Jest Axe 10.0.0**: Accessibility testing
- **MSW 2.11.2**: API mocking
- **Faker.js 8.4.1 / 10.0.0**: Test data generation

### Performance Testing
- **K6**: Load and stress testing
- **Jest benchmarks**: Performance benchmarking

### Contract Testing
- **Pact 12.1.0**: Consumer-driven contract testing

### Test Reporting
- **Jest JUnit 16.0.0**: JUnit XML reports for CI/CD

## Shared Packages

### Local Packages
- **@topsmile/types**: Shared TypeScript types between frontend and backend

## Development Tools

### Code Quality
- **ESLint 8.57.1**: Linting
- **TypeScript ESLint**: TypeScript-specific linting rules
- **Prettier**: Code formatting (implicit via ESLint)

### Version Control
- **Git**: Source control
- **GitHub Actions**: CI/CD pipelines

### Package Management
- **npm >=9.0.0**: Package manager
- **Workspaces**: Monorepo management

### Build Scripts
- **Concurrently 9.2.0**: Run multiple commands
- **Cross-env 10.0.0**: Cross-platform environment variables

### Analysis Tools
- **Source Map Explorer 2.5.3**: Bundle analysis
- **Webpack Bundle Analyzer 4.10.2**: Bundle visualization

## Environment Requirements

### Node.js
- Minimum version: 18.0.0
- Recommended: Latest LTS

### npm
- Minimum version: 9.0.0

### MongoDB
- Minimum version: 5.0
- Recommended: Latest stable

### Redis
- Required for caching and job queues
- Recommended: Latest stable

## Development Commands

### Frontend
```bash
npm start                    # Start dev server
npm run build               # Production build
npm run test:frontend       # Run tests
npm run test:e2e           # E2E tests
npm run lint               # Lint code
npm run type-check         # TypeScript check
```

### Backend
```bash
cd backend && npm run dev   # Start dev server
cd backend && npm test      # Run all tests
cd backend && npm run test:unit        # Unit tests
cd backend && npm run test:integration # Integration tests
cd backend && npm run test:security    # Security tests
cd backend && npm run test:k6          # Load tests
cd backend && npm run build            # Production build
```

### Full Stack
```bash
npm run dev                 # Start both frontend and backend
npm run test:all           # Run all tests
npm run build:all          # Build both applications
npm run test:ci            # CI test suite
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

## Deployment Considerations
- Node.js 18+ runtime required
- MongoDB connection required
- Redis instance required
- Environment variables must be configured
- HTTPS recommended for production
- Stripe webhook endpoints needed for payments
