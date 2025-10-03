# TopSmile - Dental Clinic Management System

A comprehensive dental clinic management platform built with React, Node.js, and TypeScript.

## Features

- **Patient Management**: Registration, profiles, and medical history
- **Appointment Scheduling**: Real-time booking with provider availability
- **Provider Dashboard**: Schedule management and patient coordination
- **Payment Integration**: Stripe-powered billing system
- **Role-Based Access**: Admin, manager, and staff permissions

## Tech Stack

**Frontend**: React 18, TypeScript, TanStack Query, Framer Motion  
**Backend**: Node.js, Express, MongoDB, Redis  
**Testing**: Jest, Cypress, Testing Library  
**Payments**: Stripe Integration

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm >= 9.0.0

### Installation

```bash
# Clone repository
git clone <repository-url>
cd topsmile

# Install dependencies
npm install

# Setup environment
cp .env.example .env
cp backend/.env.example backend/.env
```

### Environment Variables

**Frontend (.env)**
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Backend (backend/.env)**
```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/topsmile
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=sk_test_...
```

### Development

```bash
# Start both frontend and backend
npm run dev

# Frontend only
npm start

# Backend only
cd backend && npm run dev
```

## Project Structure

```
topsmile/
├── src/                    # React frontend
├── backend/               # Express API
├── packages/types/        # Shared TypeScript types
├── cypress/              # E2E tests
└── public/               # Static assets
```

## Testing

```bash
# All tests
npm run test:all

# Frontend tests
npm run test:frontend

# Backend tests
cd backend && npm test

# E2E tests
npm run test:e2e
```

## API Documentation

The API follows RESTful conventions with JWT authentication:

- `POST /api/auth/login` - User authentication
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `GET /api/providers` - List providers
- `POST /api/patients` - Create patient

## Contributing

1. Follow TypeScript strict mode
2. Use Portuguese for user-facing messages
3. Include comprehensive tests
4. Follow existing code patterns

## License

Private - TopSmile Dental Clinic Management System