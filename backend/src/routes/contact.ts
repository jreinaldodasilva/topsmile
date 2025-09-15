import express, { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';

import { contactService } from '../services/contactService';
import { emailService } from '../services/emailService';

const router = express.Router();

// Rate limiter specific to contact forms
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { success: false, message: 'Muitos formulários enviados. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation middleware
const contactValidation = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s\-'.]*$/)
    .withMessage('Nome contém caracteres inválidos')
    .trim()
    .escape(),
  body('email')
    .isEmail()
    .withMessage('Digite um e-mail válido')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('E-mail muito longo'),
  body('clinic')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome da clínica deve ter entre 2 e 100 caracteres')
    .trim()
    .escape(),
  body('specialty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Especialidade deve ter entre 2 e 100 caracteres')
    .trim()
    .escape(),
  body('phone')
    .matches(/^[\d\s\-()+]{10,20}$/)
    .withMessage('Digite um telefone válido')
    .trim(),
];

interface ContactFormData {
  name: string;
  email: string;
  clinic: string;
  specialty: string;
  phone: string;
}



// POST /api/contact
router.post('/', contactLimiter, contactValidation, async (req: Request, res: Response) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array(),
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req as any).requestId
        }
      });
    }

    const { name, email, clinic, specialty, phone } = req.body;

    // Extract UTM parameters and metadata from request
    const metadata = {
      utmSource: req.query.utm_source as string,
      utmMedium: req.query.utm_medium as string,
      utmCampaign: req.query.utm_campaign as string,
      utmTerm: req.query.utm_term as string,
      utmContent: req.query.utm_content as string,
      referrer: req.get('Referer'),
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    // Create contact record
    const contact = await contactService.createContact({
      name,
      email,
      clinic,
      specialty,
      phone,
      source: 'website_contact_form',
      metadata
    });

    // Send emails asynchronously (don't block response)
    emailService.sendContactEmails({
      id: contact.id as string,
      name,
      email,
      clinic,
      specialty,
      phone
    }).catch(error => {
      console.error('Failed to send contact emails:', error);
    });

    return res.status(200).json({
      success: true,
      message: 'Mensagem enviada com sucesso! Nossa equipe retornará em até 24 horas.',
      data: {
        id: contact.id,
        protocol: contact.id,
        estimatedResponse: '24 horas'
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);

    const isDevelopment = process.env.NODE_ENV !== 'production';
    const errorMessage = isDevelopment && error instanceof Error ? error.message : 'Erro interno do servidor';

    return res.status(500).json({
      success: false,
      message: 'Erro ao processar solicitação. Tente novamente mais tarde.',
      errors: isDevelopment && error instanceof Error ? [errorMessage] : undefined,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    });
  }
});

export default router;
