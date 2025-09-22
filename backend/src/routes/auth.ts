//backend/src/routes/auth.ts
import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { authService } from '../services/authService';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import DOMPurify from 'isomorphic-dompurify';
import { Request, Response, NextFunction } from 'express';
import { NotFoundError, UnauthorizedError, AppError } from '../types/errors';
import logger from '../config/logger';

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
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .matches(/^[a-zA-ZÀ-ÿ\s]*$/)
    .withMessage('Nome deve conter apenas letras e espaços')
    .escape(), // Sanitize name

  body('email')
    .isEmail()
    .withMessage('Digite um e-mail válido')
    .normalizeEmail(), // Normalizes email and also sanitizes

  body('password')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Senha deve conter ao menos uma letra minúscula, uma maiúscula e um número'),

  // Clinic validation (optional)
  body('clinic.name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome da clínica deve ter entre 2 e 100 caracteres')
    .escape(), // Sanitize clinic name

  body('clinic.phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-()+]{10,20}$/)
    .withMessage('Telefone da clínica inválido')
    .escape(), // Sanitize phone

  body('clinic.address.street')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Endereço deve ter entre 5 e 100 caracteres')
    .escape(), // Sanitize street

  body('clinic.address.city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Cidade deve ter entre 2 e 50 caracteres')
    .escape(), // Sanitize city

  body('clinic.address.state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 2 })
    .withMessage('Estado deve ter 2 caracteres')
    .toUpperCase() // Convert state to uppercase
    .escape(), // Sanitize state

  body('clinic.address.zipCode')
    .optional()
    .trim()
    .matches(/^\d{5}-?\d{3}$/)
    .withMessage('CEP inválido')
    .escape() // Sanitize zipCode
];

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: E-mail do usuário
 *         password:
 *           type: string
 *           description: Senha do usuário
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Nome completo do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: E-mail do usuário
 *         password:
 *           type: string
 *           minLength: 8
 *           description: Senha (mínimo 8 caracteres, deve conter maiúscula, minúscula, número e símbolo)
 *         clinic:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Nome da clínica
 *             phone:
 *               type: string
 *               description: Telefone da clínica
 *             address:
 *               type: object
 *               properties:
 *                 street:
 *                   type: string
 *                   description: Rua
 *                 number:
 *                   type: string
 *                   description: Número
 *                 neighborhood:
 *                   type: string
 *                   description: Bairro
 *                 city:
 *                   type: string
 *                   description: Cidade
 *                 state:
 *                   type: string
 *                   description: Estado
 *                 zipCode:
 *                   type: string
 *                   description: CEP
 */
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Digite um e-mail válido')
    .normalizeEmail(), // Normalizes email and also sanitizes

  body('password')
    .isLength({ min: 1 })
    .withMessage('Senha é obrigatória')
    .trim()
    .escape() // Sanitize password (though it will be hashed, good practice)
];

const changePasswordValidation = [
  body('currentPassword')
    .isLength({ min: 1 })
    .withMessage('Senha atual é obrigatória')
    .trim()
    .escape(), // Sanitize current password

  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Nova senha deve ter pelo menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Nova senha deve conter ao menos uma letra minúscula, uma maiúscula e um número')
    .trim()
    .escape() // Sanitize new password
];



// Register endpoint
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
 *     description: Cria uma nova conta de usuário no sistema
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Muitas tentativas de registro
 */
router.post('/register', registerLimiter, registerValidation, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const result = await authService.register(req.body);

    const { accessToken, refreshToken, expiresIn, user } = result.data;

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(201).json({
      success: true,
      data: {
        user,
        expiresIn
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    });
  } catch (error) {
    next(error);
    return;
  }
});

// Login endpoint
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login
 *     description: Autentica um usuário e retorna tokens de acesso
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Credenciais inválidas
 *       429:
 *         description: Muitas tentativas de login
 */
router.post('/login', authLimiter, loginValidation, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    // Extract device info for refresh token
    const deviceInfo = {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip || req.connection.remoteAddress,
      deviceId: req.headers['x-device-id'] as string
    };

    const result = await authService.login(req.body, deviceInfo);

    const { accessToken, refreshToken, expiresIn, user } = result.data;

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.json({
      success: true,
      data: {
        user,
        expiresIn
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    });
  } catch (error) {
    next(error);
    return; 
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obter perfil do usuário atual
 *     description: Retorna os dados do usuário autenticado
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autorizado
 */
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getUserById(req.user!.id);

    return res.json({
      success: true,
      data: user,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    });
  } catch (error) {
    next(error);
    return;
  }
});

/**
 * @swagger
 * /api/auth/change-password:
 *   patch:
 *     summary: Alterar senha
 *     description: Altera a senha do usuário autenticado
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Senha atual
 *               newPassword:
 *                 type: string
 *                 description: Nova senha
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Dados inválidos ou senha atual incorreta
 *       401:
 *         description: Não autorizado
 */
router.patch('/change-password', authenticate, changePasswordValidation, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(req.user!.id, currentPassword, newPassword);

    return res.json({
      success: true,
      message: 'Senha alterada com sucesso',
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    });
  } catch (error) {
    next(error);
    return;
  }
});

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renovar token de acesso
 *     description: Renova o token de acesso usando o refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de refresh
 *     responses:
 *       200:
 *         description: Token renovado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Token de refresh inválido ou expirado
 */
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { refreshToken } = req.cookies;
    if (!refreshToken && req.body.refreshToken) {
      refreshToken = req.body.refreshToken;
    }
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Token de atualização obrigatório'
      });
    }

    const { accessToken, refreshToken: newRefreshToken, expiresIn } = await authService.refreshAccessToken(refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.json({
      success: true,
      data: {
        expiresIn
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    });
  } catch (error) {
    next(error);
    return;
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Fazer logout
 *     description: Revoga um token de refresh específico (logout de um dispositivo)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de refresh a ser revogado
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Não autorizado
 */
router.post('/logout', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let { refreshToken } = req.cookies;
    if (!refreshToken && req.body.refreshToken) {
      refreshToken = req.body.refreshToken;
    }
    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    // Log for development
    logger.info(`User ${req.user!.email} logged out at ${new Date().toISOString()}`);

    return res.json({
      success: true,
      message: 'Logout realizado com sucesso',
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    });
  } catch (error) {
    next(error);
    return;
  }
});

/**
 * @swagger
 * /api/auth/logout-all:
 *   post:
 *     summary: Fazer logout de todos os dispositivos
 *     description: Revoga todos os tokens de refresh do usuário (logout de todos os dispositivos)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado em todos os dispositivos
 *       401:
 *         description: Não autorizado
 */
router.post('/logout-all', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await authService.logoutAllDevices(req.user!.id);
    return res.json({ 
      success: true, 
      message: 'Logout realizado em todos os dispositivos',
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    });
  } catch (error) {
    next(error);
    return;
  }
});

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar redefinição de senha
 *     description: Envia um e-mail com um link para redefinir a senha do usuário.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: E-mail do usuário para redefinição de senha.
 *     responses:
 *       200:
 *         description: Se o e-mail existir, um link de redefinição de senha será enviado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Se o e-mail estiver registrado, um link de redefinição de senha foi enviado.'
 *       400:
 *         description: E-mail inválido.
 *       500:
 *         description: Erro interno do servidor.
 */
const forgotPasswordLimiter = rateLimit({
  windowMs: 15*60*1000,
  max: 3,
  message: 'Too many password reset requests; try again later.'
});
router.post('/forgot-password', forgotPasswordLimiter, [
  body('email').isEmail().withMessage('E-mail inválido').normalizeEmail()
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { email } = req.body;
    const resetToken = await authService.forgotPassword(email);

    // In a real application, you would send an email here.
    // For now, we'll just log the token and send a generic success message.
    logger.info(`Password reset token for ${email}: ${resetToken}`);

    return res.json({
      success: true,
      message: 'Se o e-mail estiver registrado, um link de redefinição de senha foi enviado.',
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    });
  } catch (error) {
    next(error);
    return;
  }
});

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   post:
 *     summary: Redefinir senha
 *     description: Redefine a senha do usuário usando um token válido.
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de redefinição de senha.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 description: Nova senha do usuário.
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Senha redefinida com sucesso.'
 *       400:
 *         description: Dados inválidos ou token expirado/inválido.
 *       401:
 *         description: Token inválido ou expirado.
 *       500: 
 *         description: Erro interno do servidor.
 */
router.post('/reset-password/:token', [
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Nova senha deve ter pelo menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Nova senha deve conter ao menos uma letra minúscula, uma maiúscula e um número')
    .trim()
    .escape()
], async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errors.array()
      });
    }

    const { token } = req.params;
    const { newPassword } = req.body;

    await authService.resetPasswordWithToken(token, newPassword);

    return res.json({
      success: true,
      message: 'Senha redefinida com sucesso.',
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any).requestId
      }
    });
  } catch (error) {
    next(error);
    return;
  }
});

export default router;