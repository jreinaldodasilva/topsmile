// backend/src/app.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import DOMPurify from 'isomorphic-dompurify';
import { Request, Response, NextFunction } from 'express';

// Database imports
import { connectToDatabase } from './config/database';
import { contactService } from './services/contactService';
import { checkDatabaseConnection, handleValidationError } from './middleware/database';

// Authentication imports
import { authenticate, authorize, ensureClinicAccess, AuthenticatedRequest } from './middleware/auth';
import authRoutes from './routes/auth';
import calendarRoutes from "./routes/calendar";
import appointmentsRoutes from "./routes/appointments"; 


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * Validate critical environment variables on startup.
 * In production we exit the process if required variables are missing.
 */
const validateEnv = () => {
  const requiredInProd = [
    { name: 'JWT_SECRET', message: 'JWT_SECRET is required in production' },
    { name: 'DATABASE_URL', message: 'DATABASE_URL is required in production' }
  ];

  if (process.env.NODE_ENV === 'production') {
    const missing = requiredInProd.filter(v => !process.env[v.name]);
    if (missing.length > 0) {
      console.error('Missing required environment variables:', missing.map(m => m.name).join(', '));
      missing.forEach(m => console.error(m.message));
      process.exit(1);
    }
  } else {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'your-secret-key') {
      console.warn('Warning: JWT_SECRET is not set or uses the insecure default. Set JWT_SECRET for production.');
    }
    if (!process.env.DATABASE_URL) {
      console.warn('Warning: DATABASE_URL is not set. Using default local MongoDB may be intended for development only.');
    }
  }
};

validateEnv();

// Trust proxy if behind a reverse proxy (required for secure cookies / rate limit IP detection)
if (process.env.TRUST_PROXY === '1' || process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Use a slightly stricter helmet configuration
app.use(helmet());


// Connect to database
connectToDatabase();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Muitos formulários enviados. Tente novamente em 15 minutos.'
  }
});

// Global rate limiter for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Muitas requisições. Tente novamente em 15 minutos.'
  }
});

app.use('/api', apiLimiter);

// Body parser middleware (use only express.json, remove body-parser)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection check middleware for API routes
app.use('/api', checkDatabaseConnection);

// Mount routes
app.use('/api/auth', authRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/appointments", appointmentsRoutes); 

// Email transporter configuration
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('FATAL: SENDGRID_API_KEY is required in production for sending emails.');
      process.exit(1);
    }
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else {
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.ETHEREAL_USER || 'ethereal.user@ethereal.email',
        pass: process.env.ETHEREAL_PASS || 'ethereal.pass'
      }
    });
  }
};

// Contact form validation rules
const contactValidation = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]*$/)
    .withMessage('Nome deve conter apenas letras e espaços'),

  body('email')
    .isEmail()
    .withMessage('Digite um e-mail válido')
    .normalizeEmail(),

  body('clinic')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome da clínica deve ter entre 2 e 100 caracteres'),

  body('specialty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Especialidade deve ter entre 2 e 100 caracteres'),

  body('phone')
    .matches(/^[\d\s\-\(\)\+]{10,20}$/)
    .withMessage('Digite um telefone válido')
];

// Interface for contact form data
interface ContactFormData {
  name: string;
  email: string;
  clinic: string;
  specialty: string;
  phone: string;
}

// Sanitize input data
const sanitizeContactData = (data: ContactFormData): ContactFormData => {
  return {
    name: DOMPurify.sanitize(data.name.trim()),
    email: DOMPurify.sanitize(data.email.trim().toLowerCase()),
    clinic: DOMPurify.sanitize(data.clinic.trim()),
    specialty: DOMPurify.sanitize(data.specialty.trim()),
    phone: DOMPurify.sanitize(data.phone.trim())
  };
};

// PUBLIC ENDPOINTS (No authentication required)

// Contact form endpoint (public)
app.post('/api/contact', contactLimiter, contactValidation, async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    // Sanitize input data
    const sanitizedData = sanitizeContactData(req.body);
    const { name, email, clinic, specialty, phone } = sanitizedData;

    // Save to database
    const contact = await contactService.createContact({
      name,
      email,
      clinic,
      specialty,
      phone,
      source: 'website_contact_form'
    });

    // Create email transporter
    const transporter = createTransporter();

    // Email to TopSmile team
    const adminEmailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@topsmile.com',
      to: process.env.ADMIN_EMAIL || 'contato@topsmile.com',
      subject: `Nova solicitação de contato - ${clinic}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background-color: #1a237e; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">TopSmile - Nova Solicitação</h1>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1a237e;">Nova solicitação de contato recebida!</h2>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #3949ab; margin-top: 0;">Dados do Contato</h3>
              <p><strong>ID:</strong> ${contact.id}</p>
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>E-mail:</strong> ${email}</p>
              <p><strong>Clínica:</strong> ${clinic}</p>
              <p><strong>Especialidade:</strong> ${specialty}</p>
              <p><strong>Telefone:</strong> ${phone}</p>
              <p><strong>Status:</strong> ${contact.status}</p>
            </div>
            
            <div style="background-color: #e3e7fd; padding: 15px; border-radius: 8px;">
              <p style="margin: 0;"><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <p>Acesse o painel administrativo para gerenciar este lead.</p>
            </div>
          </div>
        </div>
      `
    };

    // Confirmation email to user
    const userEmailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@topsmile.com',
      to: email,
      subject: 'Obrigado pelo seu interesse no TopSmile!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background-color: #1a237e; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">TopSmile</h1>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1a237e;">Olá, ${name}!</h2>
            
            <p>Obrigado pelo seu interesse no TopSmile! Recebemos sua solicitação de contato e nossa equipe entrará em contato em até 24 horas.</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #3949ab; margin-top: 0;">Seus dados:</h3>
              <p><strong>Clínica:</strong> ${clinic}</p>
              <p><strong>Especialidade:</strong> ${specialty}</p>
              <p><strong>Telefone:</strong> ${phone}</p>
              <p><strong>Protocolo:</strong> #${contact.id}</p>
            </div>
            
            <p>Enquanto isso, você pode conhecer mais sobre nossos recursos em nosso site.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                 style="background-color: #1a237e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Visitar TopSmile
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            
            <p style="color: #64748b; font-size: 14px;">
              Este é um e-mail automático. Se você não solicitou este contato, pode ignorar esta mensagem.<br>
              Protocolo de atendimento: #${contact.id}
            </p>
          </div>
        </div>
      `
    };

    // Send emails
    await Promise.all([
      transporter.sendMail(adminEmailOptions),
      transporter.sendMail(userEmailOptions)
    ]);

    // Log for development
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Contact form submitted and saved to database:', {
        id: contact.id,
        name,
        email,
        clinic,
        specialty,
        phone,
        timestamp: new Date().toISOString()
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Mensagem enviada com sucesso! Retornaremos em até 24 horas.',
      data: {
        id: contact.id,
        protocol: contact.id
      }
    });

  } catch (error) {
    console.error('Error processing contact form:', error);

    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor. Tente novamente mais tarde.'
    });
  }
});

// Health check endpoint (public)
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  return res.status(200).json({
    success: true,
    message: 'TopSmile API is running',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    version: '1.1.0'
  });
});

// Database health endpoint (public for monitoring)
app.get('/api/health/database', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    if (dbState === 1) {
      // Test database with a simple query
      const Contact = require('./models/Contact').Contact;
      const count = await Contact.countDocuments();

      return res.json({
        success: true,
        database: {
          status: states[dbState as keyof typeof states],
          name: mongoose.connection.name,
          host: mongoose.connection.host,
          port: mongoose.connection.port,
          totalContacts: count
        }
      });
    } else {
      return res.status(503).json({
        success: false,
        database: {
          status: states[dbState as keyof typeof states]
        }
      });
    }
  } catch (error) {
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(503).json({
      success: false,
      message: 'Database health check failed',
      error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
});

// PROTECTED ENDPOINTS (Authentication required)

// Contact management endpoints - Admin only
app.get('/api/admin/contacts',
  authenticate,
  authorize('super_admin', 'admin', 'manager'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const search = req.query.search as string;
      const sortBy = req.query.sortBy as string || 'createdAt';
      const sortOrder = req.query.sortOrder as 'asc' | 'desc' || 'desc';

      const filters: any = {};
      if (status) filters.status = status;
      if (search) filters.search = search;

      const result = await contactService.getContacts(filters, {
        page,
        limit,
        sortBy,
        sortOrder
      });

      return res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar contatos'
      });
    }
  }
);

app.get('/api/admin/contacts/stats',
  authenticate,
  authorize('super_admin', 'admin', 'manager'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const stats = await contactService.getContactStats();
      return res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching contact stats:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar estatísticas'
      });
    }
  }
);

app.get('/api/admin/contacts/:id',
  authenticate,
  authorize('super_admin', 'admin', 'manager'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const contact = await contactService.getContactById(req.params.id);
      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contato não encontrado'
        });
      }
      return res.json({
        success: true,
        data: contact
      });
    } catch (error) {
      console.error('Error fetching contact:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar contato'
      });
    }
  }
);

app.patch('/api/admin/contacts/:id',
  authenticate,
  authorize('super_admin', 'admin', 'manager'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const updates = req.body;

      // Add assignedTo if updating status and user is not super_admin
      if (updates.status && req.user && req.user.role !== 'super_admin') {
        updates.assignedTo = req.user.id;
      }

      const contact = await contactService.updateContact(req.params.id, updates);

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Contato não encontrado'
        });
      }

      return res.json({
        success: true,
        data: contact
      });
    } catch (error) {
      console.error('Error updating contact:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar contato'
      });
    }
  }
);

app.delete('/api/admin/contacts/:id',
  authenticate,
  authorize('super_admin', 'admin'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const deleted = await contactService.deleteContact(req.params.id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Contato não encontrado'
        });
      }

      return res.json({
        success: true,
        message: 'Contato excluído com sucesso'
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao excluir contato'
      });
    }
  }
);

// Dashboard stats endpoint
app.get('/api/admin/dashboard',
  authenticate,
  authorize('super_admin', 'admin', 'manager'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const [contactStats] = await Promise.all([
        contactService.getContactStats()
      ]);

      // Calculate additional metrics
      const today = new Date();
      const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

      return res.json({
        success: true,
        data: {
          contacts: contactStats,
          summary: {
            totalContacts: contactStats.total,
            newThisWeek: contactStats.recentCount,
            // Add more metrics as your system grows
            activeUsers: req.user?.role === 'super_admin' ? 'Available in full version' : 'N/A',
            revenue: 'Coming soon'
          },
          user: {
            name: req.user?.email,
            role: req.user?.role,
            clinicId: req.user?.clinicId
          }
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar dados do dashboard'
      });
    }
  }
);

// Error handling middleware
app.use(handleValidationError);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', error);

  return res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
});

// 404 handler
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado'
  });
});

// Start server

// Global process handlers for robust logging
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // In production you might want to exit and let a process manager restart the process
});
app.listen(PORT, () => {
  console.log(`🚀 TopSmile API running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔐 JWT Secret configured: ${process.env.JWT_SECRET ? 'Yes' : 'No'}`);
});

export default app;