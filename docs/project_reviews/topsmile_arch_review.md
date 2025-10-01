# TopSmile Project Architecture Review

## **Project Overview**
TopSmile is a full-stack dental clinic management system built with modern web technologies, featuring separate patient and administrative portals with comprehensive appointment scheduling, user management, and clinic operations.

## **Technology Stack**

### **Backend Architecture**
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens and role-based access control
- **Caching**: Redis integration
- **Email**: SendGrid service
- **Logging**: Pino HTTP logger
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, CSRF protection, rate limiting, input sanitization

### **Frontend Architecture**
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: React Context + React Query (TanStack Query)
- **Styling**: CSS modules with global styles
- **Performance**: Code splitting with lazy loading
- **Error Handling**: Error boundaries and context-based error management

## **System Architecture**

### **Backend Structure (`/backend`)**
```
src/
├── app.ts                 # Main Express application
├── config/                # Configuration files (DB, logger, Redis, Swagger)
├── middleware/            # Cross-cutting concerns (auth, rate limiting, security)
├── models/                # Mongoose schemas (User, Patient, Appointment, etc.)
├── routes/                # API route handlers
├── services/              # Business logic layer
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

### **Frontend Structure (`/src`)**
```
src/
├── App.tsx                # Main React application
├── components/            # Reusable UI components
├── contexts/              # React context providers
├── hooks/                 # Custom React hooks
├── pages/                 # Page components (routing destinations)
├── providers/             # Application providers (QueryProvider)
├── services/              # API service layer
├── styles/                # Global styles and CSS variables
├── utils/                 # Utility functions
└── types/                 # TypeScript definitions (shared with backend)
```

## **Key Features & Modules**

### **Authentication & Authorization**
- Multi-role system: Super Admin, Admin, Manager, Dentist, Assistant, Patient
- JWT-based authentication with refresh token rotation
- Device-based session management
- Password reset functionality
- Account lockout protection

### **User Management**
- **Admin Users**: Clinic staff with role-based permissions
- **Patients**: Portal access for appointment management
- **Providers**: Dental professionals (dentists, assistants)

### **Appointment System**
- Calendar integration
- Appointment types and scheduling
- Patient booking system
- Provider availability management

### **Administrative Features**
- Contact form management
- Patient management dashboard
- Provider management
- Appointment calendar overview
- Billing/financial management (placeholder)

### **Patient Portal**
- Appointment booking and management
- Profile management
- Appointment history and details

## **Security Implementation**
- **Input Validation**: Express-validator with custom sanitization
- **Rate Limiting**: Tiered rate limiting by endpoint type
- **CSRF Protection**: Double-submit cookie pattern
- **CORS**: Configurable origin policies
- **Helmet**: Security headers
- **Data Sanitization**: MongoDB injection prevention
- **Password Security**: bcrypt hashing with strength requirements

## **API Design**
- RESTful endpoints with consistent response format
- Request ID tracking for debugging
- Comprehensive error handling with custom error types
- Swagger documentation for all endpoints
- Health check endpoints for monitoring

## **Development & Testing**
- **Testing**: Jest framework with unit and integration tests
- **E2E Testing**: Cypress for end-to-end scenarios
- **Mocking**: MSW for API mocking in tests
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Code Quality**: ESLint configuration

## **Deployment Considerations**
- Environment-based configuration validation
- Docker support (implied by structure)
- Production-ready security settings
- Graceful shutdown handling
- Comprehensive logging for production monitoring

The architecture follows modern full-stack development practices with strong separation of concerns, comprehensive security measures, and scalable patterns suitable for a healthcare management system.
