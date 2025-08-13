// backend/src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import DOMPurify from 'isomorphic-dompurify';
import { Request, Response } from 'express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Email transporter configuration
const createTransporter = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production - use SendGrid, AWS SES, or similar
    return nodemailer.createTransport({
      service: 'SendGrid', // or your preferred service
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else {
    // Development - use Ethereal Email for testing
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

// Contact form endpoint
app.post('/api/contact', contactLimiter, contactValidation, async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
      return;
    }

    // Sanitize input data
    const sanitizedData = sanitizeContactData(req.body);
    const { name, email, clinic, specialty, phone } = sanitizedData;

    // Create email transporter
    const transporter = createTransporter();

    // Email to TopSmile team
    const adminEmailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@topsmile.com',
      to: process.env.ADMIN_EMAIL || 'contato@topsmile.com',
      subject: `Nova solicitação de contato - ${clinic}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a237e;">Nova Solicitação de Contato</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #3949ab; margin-top: 0;">Dados do Contato</h3>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Clínica:</strong> ${clinic}</p>
            <p><strong>Especialidade:</strong> ${specialty}</p>
            <p><strong>Telefone:</strong> ${phone}</p>
          </div>
          
          <div style="background-color: #e3e7fd; padding: 15px; border-radius: 8px;">
            <p style="margin: 0;"><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
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
              Este é um e-mail automático. Se você não solicitou este contato, pode ignorar esta mensagem.
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

    // TODO: Save to database when implemented
    // await saveContactToDatabase(sanitizedData);

    // Log for development
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Contact form submitted:', {
        name,
        email,
        clinic,
        specialty,
        phone,
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mensagem enviada com sucesso! Retornaremos em até 24 horas.'
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor. Tente novamente mais tarde.'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TopSmile API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TopSmile API running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;