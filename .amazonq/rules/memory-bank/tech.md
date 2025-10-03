# Technology Stack & Development Setup

## Core Technologies

### Frontend Stack
- **React 18.2.0**: Modern React with hooks and concurrent features
- **TypeScript 4.9.5**: Type-safe JavaScript development
- **React Router 6.30.1**: Client-side routing and navigation
- **TanStack Query 5.89.0**: Server state management and caching
- **Framer Motion 10.16.5**: Animation and motion graphics

### Backend Stack
- **Node.js 18+**: JavaScript runtime environment
- **Express 4.21.2**: Web application framework
- **TypeScript 5.9.2**: Type-safe server development
- **MongoDB**: NoSQL database with Mongoose ODM
- **Redis**: Caching and session management

### Development Tools
- **Jest**: Unit and integration testing framework
- **Cypress**: End-to-end testing automation
- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Nodemon**: Development server auto-restart

## Key Dependencies

### Frontend Dependencies
```json
{
  "@stripe/react-stripe-js": "^4.0.2",
  "@tanstack/react-query": "^5.89.0",
  "framer-motion": "^10.16.5",
  "react-calendar": "^6.0.0",
  "react-icons": "^4.12.0",
  "luxon": "^3.7.1"
}
```

### Backend Dependencies
```json
{
  "express": "^4.21.2",
  "mongoose": "^8.18.0",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^3.0.2",
  "express-validator": "^7.2.1",
  "helmet": "^7.2.0",
  "cors": "^2.8.5"
}
```

### Testing & Quality
```json
{
  "jest": "^29.7.0",
  "cypress": "^15.1.0",
  "@testing-library/react": "^16.3.0",
  "supertest": "^7.1.4",
  "msw": "^2.11.2"
}
```

## Development Commands

### Frontend Development
```bash
npm start                    # Start development server
npm run dev                  # Start both frontend and backend
npm run build               # Production build
npm run test:frontend       # Run frontend tests
npm run test:frontend:watch # Watch mode testing
npm run lint               # Code linting
npm run type-check         # TypeScript validation
```

### Backend Development
```bash
cd backend
npm run dev                 # Start development server with hot reload
npm run build              # Compile TypeScript to JavaScript
npm run start              # Start production server
npm test                   # Run all backend tests
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:coverage      # Generate coverage report
```

### Full Stack Commands
```bash
npm run dev                # Start both frontend and backend
npm run build:all          # Build both applications
npm run test:all           # Run all tests (frontend + backend)
npm run test:e2e           # End-to-end testing with Cypress
npm run test:ci            # CI pipeline testing
```

## Environment Configuration

### Required Environment Variables
```bash
# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Backend (backend/.env)
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/topsmile
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_...
REDIS_URL=redis://localhost:6379
```

## Build & Deployment

### Production Build Process
1. **Type Checking**: Validate TypeScript across all packages
2. **Testing**: Run comprehensive test suite
3. **Frontend Build**: Create optimized React production bundle
4. **Backend Build**: Compile TypeScript to JavaScript
5. **Asset Optimization**: Minimize and compress static assets

### System Requirements
- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **MongoDB**: >= 5.0
- **Redis**: >= 6.0 (optional, for caching)

### Development Setup
```bash
# Clone and install dependencies
git clone <repository-url>
cd topsmile
npm install

# Setup environment files
cp .env.example .env
cp backend/.env.example backend/.env

# Start development servers
npm run dev
```

## Architecture Decisions

### Frontend Choices
- **React Query**: Chosen for server state management over Redux for simpler async operations
- **Framer Motion**: Selected for smooth animations and micro-interactions
- **React Calendar**: Integrated for appointment scheduling interface

### Backend Choices
- **Express**: Lightweight and flexible web framework
- **Mongoose**: ODM for MongoDB with schema validation
- **JWT**: Stateless authentication for scalability
- **Helmet**: Security middleware for production safety

### Testing Strategy
- **Jest**: Primary testing framework for both frontend and backend
- **Cypress**: E2E testing for critical user workflows
- **MSW**: API mocking for isolated frontend testing
- **MongoDB Memory Server**: In-memory database for backend testing