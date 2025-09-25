import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { patientAuthService, PatientRegistrationData, DeviceInfo } from '../services/patientAuthService';
import { authenticatePatient, requirePatientEmailVerification, PatientAuthenticatedRequest } from '../middleware/patientAuth';
import { patientAuthLimiter, passwordResetLimiter } from '../middleware/rateLimiter';
import { isAppError } from '../types/errors';
import type { Patient } from '@topsmile/types';


const router: express.Router = express.Router();

const standardResponse = (data: any, message?: string, req?: express.Request) => ({
    success: true,
    data,
    ...(message && { message }),
    meta: {
        timestamp: new Date().toISOString(),
        requestId: (req as any)?.requestId
    }
});

const enhancedRegisterValidation = [
    body('patientId')
        .optional() // Made optional for new patient registration
        .isMongoId()
        .withMessage('ID do paciente inválido'),

    body('firstName')
        .if(body('patientId').not().exists()) // Required if no patientId
        .notEmpty()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres'),

    body('lastName')
        .if(body('patientId').not().exists()) // Required if no patientId
        .notEmpty()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Sobrenome deve ter entre 2 e 100 caracteres'),

    body('phone')
        .if(body('patientId').not().exists())
        .notEmpty()
        .trim()
        .matches(/^\(?\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4}$|^\d{10,11}$/)
        .withMessage('Telefone deve estar em formato brasileiro válido'),

    body('clinicId')
        .if(body('patientId').not().exists())
        .isMongoId()
        .withMessage('ID da clínica inválido'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('E-mail inválido'),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Senha deve ter pelo menos 8 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('E-mail inválido'),

  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
];

router.post('/register', 
    ...(process.env.NODE_ENV !== 'test' ? [patientAuthLimiter] : []),
    enhancedRegisterValidation, 
    async (req: express.Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors.array()
                });
            }

            const deviceInfo: DeviceInfo = {
                userAgent: req.headers['user-agent'],
                ipAddress: req.ip || req.connection.remoteAddress,
                deviceId: req.headers['x-device-id'] as string
            };

            const result = await patientAuthService.register(req.body as PatientRegistrationData, deviceInfo);

            const { accessToken, refreshToken, expiresIn, patient, patientUser, requiresEmailVerification } = result.data;

            res.cookie('patientAccessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.cookie('patientRefreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/api/patient-auth/refresh', // IMPORTANT: Limit scope of refresh token
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            const responseData = {
                patient,
                patientUser,
                expiresIn,
                requiresEmailVerification,
                ...(process.env.NODE_ENV === 'test' && { accessToken })
            };

            return res.status(201).json(standardResponse(responseData, 'Conta criada com sucesso', req));

        } catch (error) {
            console.error('Patient registration error:', error);
            
            if (isAppError(error)) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
);

router.post('/login', 
    ...(process.env.NODE_ENV !== 'test' ? [patientAuthLimiter] : []),
    loginValidation, 
    async (req: express.Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors.array()
                });
            }

            const deviceInfo: DeviceInfo = {
                userAgent: req.headers['user-agent'],
                ipAddress: req.ip || req.connection.remoteAddress,
                deviceId: req.headers['x-device-id'] as string
            };

            const result = await patientAuthService.login({
                email: req.body.email,
                password: req.body.password
            }, deviceInfo);

            const { accessToken, refreshToken, expiresIn, patient, patientUser, requiresEmailVerification } = result.data;

            res.cookie('patientAccessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000 // 15 minutes
            });

            res.cookie('patientRefreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/api/patient-auth/refresh', // IMPORTANT: Limit scope of refresh token
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });

            const responseData = {
                patient,
                patientUser,
                expiresIn,
                requiresEmailVerification,
                ...(process.env.NODE_ENV === 'test' && { accessToken })
            };

            return res.json(standardResponse(responseData, 'Login realizado com sucesso', req));

        } catch (error) {
            console.error('Patient login error:', error);
            
            if (isAppError(error)) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
);

router.post('/refresh', async (req: express.Request, res: Response) => {
    try {
        const { patientRefreshToken } = req.cookies;
        if (!patientRefreshToken) {
            return res.status(401).json({ 
                success: false, 
                message: 'Token de atualização obrigatório' 
            });
        }

        const { accessToken, expiresIn } = await patientAuthService.refreshAccessToken(patientRefreshToken);

        res.cookie('patientAccessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000 // 15 minutes
        });

        return res.json(standardResponse({ expiresIn }, 'Token atualizado com sucesso', req));

    } catch (error) {
        console.error('Patient refresh token error:', error);
        if (isAppError(error)) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

router.post('/logout', authenticatePatient, async (req: PatientAuthenticatedRequest, res: Response) => {
    try {
        const { patientRefreshToken } = req.cookies;
        if (patientRefreshToken) {
            await patientAuthService.logout(patientRefreshToken);
        }
        
        res.clearCookie('patientAccessToken', { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        res.clearCookie('patientRefreshToken', { 
            path: '/api/patient-auth/refresh',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.json(standardResponse(null, 'Logout realizado com sucesso', req));

    } catch (error) {
        console.error('Patient logout error:', error);
        if (isAppError(error)) {
            return res.status(error.statusCode).json({ success: false, message: error.message });
        }
        return res.status(500).json({ success: false, message: 'Erro interno do servidor' });
    }
});

router.patch('/profile', 
    authenticatePatient,
    ...(process.env.NODE_ENV !== 'test' ? [requirePatientEmailVerification] : []),
    [
        body('firstName').optional().trim().isLength({ min: 2, max: 100 }),
        body('lastName').optional().trim().isLength({ min: 2, max: 100 }),
        body('phone').optional().matches(/^\(?\d{2}\)?[\s-]?9?\d{4}[\s-]?\d{4}$|^\d{10,11}$/),
        body('birthDate').optional().isISO8601(),
    ],
    async (req: PatientAuthenticatedRequest, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors.array()
                });
            }

            const updatedPatient = await patientAuthService.updateProfile((req.patient!._id as any), req.body);

            return res.json(standardResponse(updatedPatient, 'Perfil atualizado com sucesso', req));
        } catch (error) {
            console.error('Patient profile update error:', error);
            
            if (isAppError(error)) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
);

router.patch('/change-password',
    authenticatePatient,
    [
        body('currentPassword').notEmpty(),
        body('newPassword')
            .isLength({ min: 8 })
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    ],
    async (req: PatientAuthenticatedRequest, res: Response) => {
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

            await patientAuthService.changePassword(req.patientUser!.id, currentPassword, newPassword);

            return res.json(standardResponse(null, 'Senha alterada com sucesso', req));
        } catch (error) {
            console.error('Patient change password error:', error);
            
            if (isAppError(error)) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
);

router.post('/resend-verification',
    ...(process.env.NODE_ENV !== 'test' ? [patientAuthLimiter] : []),
    [body('email').isEmail().normalizeEmail()],
    async (req: express.Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors.array()
                });
            }

            await patientAuthService.resendVerificationEmail(req.body.email);

            return res.json(standardResponse(null, 'Se o e-mail estiver registrado, um novo link de verificação foi enviado.', req));
        } catch (error) {
            console.error('Resend verification email error:', error);
            
            if (isAppError(error)) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
);

router.post('/forgot-password',
    ...(process.env.NODE_ENV !== 'test' ? [passwordResetLimiter] : []),
    [body('email').isEmail().normalizeEmail()],
    async (req: express.Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors.array()
                });
            }

            await patientAuthService.resendVerificationEmail(req.body.email);

            return res.json(standardResponse(null, 'Se o e-mail estiver registrado, um link de recuperação foi enviado.', req));
        } catch (error) {
            console.error('Password reset request error:', error);
            
            if (isAppError(error)) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }
            
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
);

router.delete('/account',
    authenticatePatient,
    ...(process.env.NODE_ENV !== 'test' ? [requirePatientEmailVerification] : []),
    [body('password').notEmpty()],
    async (req: PatientAuthenticatedRequest, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors.array()
                });
            }

            await patientAuthService.deleteAccount(req.patientUser!.id, req.body.password);

            return res.json(standardResponse(null, 'Conta deletada com sucesso', req));
        } catch (error) {
            console.error('Patient account deletion error:', error);

            if (isAppError(error)) {
                return res.status(error.statusCode).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
);

router.get('/me', authenticatePatient, async (req: PatientAuthenticatedRequest, res: Response) => {
    try {
        return res.json(standardResponse({
            patient: req.patient,
            patientUser: req.patientUser
        }, 'Perfil obtido com sucesso', req));
    } catch (error) {
        console.error('Patient get me error:', error);

        if (isAppError(error)) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

export default router;
