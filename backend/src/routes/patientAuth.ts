import express from 'express';
import { body, validationResult } from 'express-validator';
import { patientAuthService, PatientRegistrationData } from '../services/patientAuthService';
import { authenticatePatient, requirePatientEmailVerification, PatientAuthenticatedRequest } from '../middleware/patientAuth';
import { patientAuthLimiter, passwordResetLimiter } from '../middleware/rateLimiter';
import { isAppError } from '../types/errors';

const router = express.Router();

const standardResponse = (data: any, message?: string) => ({
    success: true,
    data,
    ...(message && { message })
});

const enhancedRegisterValidation = [
    body('patientId')
        .optional() // Made optional for new patient registration
        .isMongoId()
        .withMessage('ID do paciente inválido'),

    body('name')
        .if(body('patientId').not().exists()) // Required if no patientId
        .notEmpty()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome deve ter entre 2 e 100 caracteres'),

    body('phone')
        .if(body('patientId').not().exists())
        .notEmpty()
        .trim()
        .matches(/^[\d\s\-()+]{10,20}$/)
        .withMessage('Telefone inválido'),

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
    patientAuthLimiter,
    enhancedRegisterValidation, 
    async (req: express.Request, res: express.Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors.array()
                });
            }

            const result = await patientAuthService.register(req.body as PatientRegistrationData);

            return res.status(201).json(standardResponse({
                patient: result.data.patient,
                patientUser: result.data.patientUser,
                accessToken: result.data.accessToken,
                expiresIn: result.data.expiresIn,
                requiresEmailVerification: result.data.requiresEmailVerification
            }, 'Conta criada com sucesso'));

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
    patientAuthLimiter,
    loginValidation, 
    async (req: express.Request, res: express.Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: errors.array()
                });
            }

            const result = await patientAuthService.login({
                email: req.body.email,
                password: req.body.password
            });

            return res.json(standardResponse({
                patient: result.data.patient,
                patientUser: result.data.patientUser,
                accessToken: result.data.accessToken,
                expiresIn: result.data.expiresIn,
                requiresEmailVerification: result.data.requiresEmailVerification
            }, 'Login realizado com sucesso'));

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

router.patch('/profile', 
    authenticatePatient,
    requirePatientEmailVerification,
    [
        body('name').optional().trim().isLength({ min: 2, max: 100 }),
        body('phone').optional().matches(/^[\d\s\-()+]{10,20}$/),
        body('birthDate').optional().isISO8601(),
    ],
    async (req: PatientAuthenticatedRequest, res: express.Response) => {
        // Update patient profile logic
        res.json({success: true, message: "Not implemented yet"})
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
    async (req: PatientAuthenticatedRequest, res: express.Response) => {
        // Change password logic
        res.json({success: true, message: "Not implemented yet"})
    }
);

router.post('/resend-verification',
    patientAuthLimiter,
    [body('email').isEmail().normalizeEmail()],
    async (req: express.Request, res: express.Response) => {
        // Resend verification email logic
        res.json({success: true, message: "Not implemented yet"})
    }
);

router.delete('/account',
    authenticatePatient,
    requirePatientEmailVerification,
    [body('password').notEmpty()],
    async (req: PatientAuthenticatedRequest, res: express.Response) => {
        // Delete account logic with confirmation
        res.json({success: true, message: "Not implemented yet"})
    }
);

export default router;