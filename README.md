# TopSmile - Dental Clinic Management System

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

A comprehensive full-stack dental clinic management system built with modern web technologies, featuring separate patient and administrative portals with appointment scheduling, user management, and clinic operations.

## 🚀 Features

### 👥 Multi-User System
- **Administrative Portal**: Complete clinic management for staff
- **Patient Portal**: Self-service appointment booking and management
- **Role-Based Access Control**: Super Admin, Admin, Manager, Dentist, Assistant, Patient

### 📅 Appointment Management
- Interactive calendar system
- Multiple appointment types
- Provider availability management
- Automated scheduling and reminders

### 👨‍⚕️ Healthcare Features
- Patient record management
- Provider profiles and specialties
- Treatment history tracking
- Medical form handling

### 🔐 Security & Compliance
- JWT authentication with refresh tokens
- CSRF protection and rate limiting
- HIPAA-compliant data handling
- Secure password policies and account lockout

### 📊 Administrative Tools
- Contact form management
- Billing and financial tracking
- Analytics and reporting
- System health monitoring

## 🏗️ Architecture

### Backend (Express.js + TypeScript)
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh token rotation
- **Caching**: Redis integration
- **Email**: SendGrid service
- **Documentation**: Swagger/OpenAPI

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: React Context + TanStack Query
- **Styling**: CSS modules with global styles
- **Performance**: Code splitting and lazy loading

## 📁 Project Structure

```
topsmile/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── app.ts             # Main Express application
│   │   ├── config/            # Database, logger, Redis configs
│   │   ├── middleware/        # Auth, security, validation
│   │   ├── models/            # Mongoose schemas
│   │   ├── routes/            # API route handlers
│   │   ├── services/          # Business logic layer
│   │   └── utils/             # Utility functions
│   └── tests/                 # Backend tests
├── src/                       # Frontend React application
│   ├── components/            # Reusable UI components
│   ├── contexts/              # React context providers
│   ├── hooks/                 # Custom React hooks
│   ├── pages/                 # Page components
│   ├── services/              # API service layer
│   └── styles/                # Global styles
├── packages/types/            # Shared TypeScript types
├── cypress/                   # End-to-end tests
├── docs/                      # Documentation
└── public/                    # Static assets
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or cloud instance)
- Redis (optional, for caching)
- SendGrid account (for email functionality)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd topsmile
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

   Configure the following environment variables:
   ```env
   # Backend
   NODE_ENV=development
   PORT=5000
   DATABASE_URL=mongodb://localhost:27017/topsmile
   JWT_SECRET=your-super-secure-jwt-secret
   JWT_REFRESH_SECRET=your-refresh-token-secret
   REDIS_URL=redis://localhost:6379
   SENDGRID_API_KEY=your-sendgrid-api-key
   ADMIN_EMAIL=admin@yourclinic.com
   FRONTEND_URL=http://localhost:3000

   # Frontend
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev

   # Or start separately:
   # Backend
   cd backend && npm run dev

   # Frontend (in another terminal)
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api/docs

## 🧪 Testing

### Run All Tests
```bash
npm run test:all
```

### Backend Tests Only
```bash
cd backend && npm test
```

### Frontend Tests Only
```bash
npm run test:frontend
```

### End-to-End Tests
```bash
npm run cy:open  # Interactive mode
npm run cy:run   # Headless mode
```

## 📚 API Documentation

The API is fully documented with Swagger. Once the backend is running, visit:
- **Swagger UI**: http://localhost:5000/api/docs
- **Health Check**: http://localhost:5000/api/health

### Key Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user profile

#### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

#### Patients
- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient record
- `GET /api/patients/:id` - Get patient details

## 🔧 Development Scripts

### Frontend
```bash
npm start              # Start development server
npm run build          # Build for production
npm run test           # Run tests
npm run eject          # Eject from Create React App
```

### Backend
```bash
cd backend
npm run dev            # Start development server with hot reload
npm run build          # Build TypeScript to JavaScript
npm start              # Start production server
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
```

### Project-wide
```bash
npm run build-all      # Build both frontend and backend
npm run test:all       # Run all tests
npm run test:coverage  # Generate test coverage reports
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Build backend
cd backend && npm run build
```

### Environment Variables for Production
Ensure these are set in your production environment:
- `NODE_ENV=production`
- `JWT_SECRET` (64+ characters)
- `DATABASE_URL` (production MongoDB)
- `REDIS_URL` (production Redis)
- `SENDGRID_API_KEY`
- `FRONTEND_URL` (your domain)

### Docker Support
The project includes Docker configuration for containerized deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Use TypeScript for all new code
- Follow ESLint configuration
- Write tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the [documentation](./docs/) folder
- Review the [architecture review](./docs/tomile_review.md)

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for healthcare industry standards
- Focus on security and user experience

---

**TopSmile** - Modern Dental Clinic Management System
