// backend/src/routes/treatmentPlans.ts
import express, { Request, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../middleware/auth';
import { body, param, query, validationResult } from 'express-validator';
import { TreatmentPlan } from '../../models/TreatmentPlan';
import { treatmentPlanService } from '../../services/treatmentPlanService';
import { CDT_CODES, CDT_CATEGORIES, getCDTCodesByCategory } from '../../config/cdtCodes';

const router: express.Router = express.Router();

router.use(authenticate);

const createValidation = [
    body('patient').isMongoId().withMessage('ID do paciente inválido'),
    body('provider').isMongoId().withMessage('ID do profissional inválido'),
    body('title').trim().notEmpty().withMessage('Título é obrigatório'),
    body('phases').isArray({ min: 1 }).withMessage('Pelo menos uma fase é obrigatória')
];

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

        const plan = new TreatmentPlan({
            ...authReq.body,
            clinic: authReq.user!.clinic,
            createdBy: authReq.user!.id
        });

        await plan.save();

        return res.status(201).json({
            success: true,
            message: 'Plano de tratamento criado com sucesso',
            data: plan
        });
    } catch (error: any) {
        console.error('Error creating treatment plan:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao criar plano de tratamento'
        });
    }
});

router.get('/patient/:patientId', param('patientId').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const plans = await TreatmentPlan.find({
            patient: authReq.params.patientId,
            clinic: authReq.user!.clinic
        })
        .populate('provider', 'name')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .lean();

        return res.json({
            success: true,
            data: plans
        });
    } catch (error: any) {
        console.error('Error fetching treatment plans:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar planos'
        });
    }
});

router.get('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const plan = await TreatmentPlan.findOne({
            _id: authReq.params.id,
            clinic: authReq.user!.clinic
        })
        .populate('patient', 'firstName lastName')
        .populate('provider', 'name')
        .populate('createdBy', 'name');

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plano não encontrado'
            });
        }

        return res.json({
            success: true,
            data: plan
        });
    } catch (error: any) {
        console.error('Error fetching treatment plan:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar plano'
        });
    }
});

router.put('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const plan = await TreatmentPlan.findOneAndUpdate(
            { _id: authReq.params.id, clinic: authReq.user!.clinic },
            authReq.body,
            { new: true, runValidators: true }
        );

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plano não encontrado'
            });
        }

        return res.json({
            success: true,
            message: 'Plano atualizado com sucesso',
            data: plan
        });
    } catch (error: any) {
        console.error('Error updating treatment plan:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao atualizar plano'
        });
    }
});

router.patch('/:id/accept', param('id').isMongoId(), body('acceptedBy').trim().notEmpty(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const plan = await treatmentPlanService.acceptTreatmentPlan(
            authReq.params.id,
            authReq.body.acceptedBy
        );

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: 'Plano não encontrado'
            });
        }

        return res.json({
            success: true,
            message: 'Plano aceito com sucesso',
            data: plan
        });
    } catch (error: any) {
        console.error('Error accepting treatment plan:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao aceitar plano'
        });
    }
});

router.patch('/:id/phase/:phaseNumber', 
    param('id').isMongoId(),
    param('phaseNumber').isInt({ min: 1 }),
    body('status').isIn(['pending', 'in_progress', 'completed']),
    async (req: Request, res: Response) => {
        const authReq = req as AuthenticatedRequest;
        
        try {
            const plan = await treatmentPlanService.updatePhaseStatus(
                authReq.params.id,
                parseInt(authReq.params.phaseNumber),
                authReq.body.status
            );

            if (!plan) {
                return res.status(404).json({
                    success: false,
                    message: 'Plano ou fase não encontrado'
                });
            }

            return res.json({
                success: true,
                message: 'Status da fase atualizado',
                data: plan
            });
        } catch (error: any) {
            console.error('Error updating phase status:', error);
            return res.status(400).json({
                success: false,
                message: error.message || 'Erro ao atualizar fase'
            });
        }
    }
);

router.post('/estimate-insurance',
    body('patientId').isMongoId(),
    body('procedures').isArray({ min: 1 }),
    async (req: Request, res: Response) => {
        try {
            const estimates = await treatmentPlanService.estimateInsuranceCoverage(
                req.body.patientId,
                req.body.procedures
            );

            return res.json({
                success: true,
                data: estimates
            });
        } catch (error: any) {
            console.error('Error estimating insurance:', error);
            return res.status(400).json({
                success: false,
                message: error.message || 'Erro ao estimar cobertura'
            });
        }
    }
);

router.get('/cdt-codes/all', async (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: CDT_CODES
    });
});

router.get('/cdt-codes/categories', async (req: Request, res: Response) => {
    return res.json({
        success: true,
        data: CDT_CATEGORIES
    });
});

router.get('/cdt-codes/category/:category', async (req: Request, res: Response) => {
    const codes = getCDTCodesByCategory(req.params.category);
    return res.json({
        success: true,
        data: codes
    });
});

export default router;
