// backend/src/routes/auth.ts
import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { authService } from '../services/authService';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import DOMPurify from 'isomorphic-dompurify';
import { Request, Response } from 'express';

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour per IP
  message: {
    success: false,
    message: 'Muitos cadastros realizados. Tente novamente em 1 hora.'
  }
});

// Validation rules
const registerValidation = [
  body('name')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]*$/)
    .withMessage('Nome deve conter apenas letras e espaços'),
  
  body('email')
    .isEmail()
    .withMessage('Digite um e-mail válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter ao menos uma letra minúscula, uma maiúscula e um número'),

  // Clinic validation (optional)
  body('clinic.name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome da clínica deve ter entre 2 e 100 caracteres'),
  
  body('clinic.phone')
    .optional()
    .matches(/^[\d\s\-\(\)\+]{10,20}$/)
    .withMessage('Telefone da clínica inválido'),

  body('clinic.address.street')
    .optional()
    .isLength({ min: 5, max: 100 })
    .withMessage('Endereço deve ter entre 5 e 100 caracteres'),

  body('clinic.address.city')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Cidade deve ter entre 2 e 50 caracteres'),

  body('clinic.address.state')
    .optional()
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado deve ter 2 caracteres'),

  body('clinic.address.zipCode')
    .optional()
    .matches(/^\d{5}-?\d{3}$/)
    .withMessage('CEP inválido')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Digite um e-mail válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 1 })
    .withMessage('Senha é obrigatória')
];

const changePasswordValidation = [
  body('currentPassword')
    .isLength({ min: 1 })
    .withMessage('Senha atual é obrigatória'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Nova senha deve ter pelo menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Nova senha deve conter ao menos uma letra minúscula, uma maiúscula e um número')
];

// Sanitize input data
const sanitizeAuthData = (data: any) => {
  const sanitized: any = {};
  
  for (const key in data) {
    if (typeof data[key] === 'string') {
      sanitized[key] = DOMPurify.sanitize(data[key].trim());
    } else if (typeof data[key] === 'object' && data[key] !== null) {
      sanitized[key] = sanitizeAuthData(data[key]);
    } else {
      sanitized[key] = data[key];
    }
  }
  
  return sanitized;
};

// Register endpoint
router.post('/register', registerLimiter, registerValidation, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
      return;
    }

    // Sanitize input
    const sanitizedData = sanitizeAuthData(req.body);

    const result = await authService.register(sanitizedData);
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Register error:', error);
    
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro ao criar usuário'
    });
  }
});

// Login endpoint
router.post('/login', authLimiter, loginValidation, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
      return;
    }

    // Sanitize input
    const sanitizedData = sanitizeAuthData(req.body);

    const result = await authService.login(sanitizedData);
    
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro ao fazer login'
    });
  }
});

// Get current user profile
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await authService.getUserById(req.user!.id);
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
      return;
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar perfil do usuário'
    });
  }
});

// Change password
router.patch('/change-password', authenticate, changePasswordValidation, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
      return;
    }

    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(req.user!.id, currentPassword, newPassword);
    
    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro ao alterar senha'
    });
  }
});

// Refresh token
router.post('/refresh', async (req: AuthenticatedRequest, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        res.status(401).json({
        success: false,
        message: 'Token obrigatório'
      });
      return;
    }

    const newToken = await authService.refreshToken(token);
    
    res.json({
      success: true,
      data: {
        token: newToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Erro ao renovar token'
    });
  }
});

// Logout (client-side only, but useful for logging)
router.post('/logout', authenticate, (req: AuthenticatedRequest, res) => {
  // JWT tokens are stateless, so logout is handled client-side
  // This endpoint is mainly for logging purposes
  console.log(`User ${req.user!.email} logged out at ${new Date().toISOString()}`);
  
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
});

export default router;