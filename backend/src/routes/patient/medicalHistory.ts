// backend/src/routes/medicalHistory.ts
import express, { Request, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../middleware/auth/auth';
import { body, param, validationResult } from 'express-validator';
import { MEDICAL_CONDITIONS, DENTAL_CONDITIONS, COMMON_ALLERGIES } from '../../config/clinical/medicalConditions';
import type { MedicalHistory as IMedicalHistory } from '@topsmile/types';
import { MedicalHistory } from '../../models/MedicalHistory';

const router: express.Router = express.Router();

router.use(authenticate);

const createValidation = [
    body('patient').isMongoId().withMessage('ID do paciente inválido'),
    body('recordDate').optional().isISO8601().withMessage('Data inválida'),
    body('chiefComplaint').optional().trim().isLength({ max: 500 }),
    body('presentIllness').optional().trim().isLength({ max: 1000 })
];

/**
 * @swagger
 * /api/medical-history:
 *   post:
 *     summary: Criar registro de histórico médico
 */
router.post('/', authorize('admin', 'dentist', 'manager'), createValidation, async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dados inválidos',
                errors: errors.array()
            });
        }

        const record = new MedicalHistory({
            ...authReq.body,
            clinic: authReq.user!.clinic,
            recordedBy: authReq.user!.id
        });

        await record.save();

        return res.status(201).json({
            success: true,
            message: 'Histórico médico criado com sucesso',
            data: record
        });
    } catch (error: any) {
        console.error('Error creating medical history:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao criar histórico médico'
        });
    }
});

/**
 * @swagger
 * /api/medical-history/patient/:patientId:
 *   get:
 *     summary: Listar histórico médico do paciente
 */
router.get('/patient/:patientId', param('patientId').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const records = await MedicalHistory.find({
            patient: authReq.params.patientId,
            clinic: authReq.user!.clinic
        })
        .sort({ recordDate: -1 })
        .populate('recordedBy', 'name')
        .lean();

        return res.json({
            success: true,
            data: records
        });
    } catch (error: any) {
        console.error('Error fetching medical history:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar histórico médico'
        });
    }
});

/**
 * @swagger
 * /api/medical-history/:id:
 *   get:
 *     summary: Obter registro específico
 */
router.get('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const record = await MedicalHistory.findOne({
            _id: authReq.params.id,
            clinic: authReq.user!.clinic
        }).populate('recordedBy', 'name');

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Registro não encontrado'
            });
        }

        return res.json({
            success: true,
            data: record
        });
    } catch (error: any) {
        console.error('Error fetching medical history:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar registro'
        });
    }
});

router.get('/conditions/medical', async (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: MEDICAL_CONDITIONS
    });
});

router.get('/conditions/dental', async (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: DENTAL_CONDITIONS
    });
});

router.get('/allergies/common', async (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: COMMON_ALLERGIES
    });
});

router.get('/patient/:patientId/latest', param('patientId').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const record = await MedicalHistory.findOne({
            patient: authReq.params.patientId,
            clinic: authReq.user!.clinic
        })
        .sort({ recordDate: -1 })
        .populate('recordedBy', 'name')
        .lean();

        return res.json({
            success: true,
            data: record
        });
    } catch (error: any) {
        console.error('Error fetching latest medical history:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar histórico'
        });
    }
});

export default router;
