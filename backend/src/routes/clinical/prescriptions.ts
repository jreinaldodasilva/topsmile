// backend/src/routes/prescriptions.ts
import express, { Request, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../middleware/auth';
import { body, param, validationResult } from 'express-validator';
import { Prescription } from '../../models/Prescription';

const router: express.Router = express.Router();

router.use(authenticate);

const createValidation = [
    body('patient').isMongoId().withMessage('ID do paciente inválido'),
    body('provider').isMongoId().withMessage('ID do profissional inválido'),
    body('medications').isArray({ min: 1 }).withMessage('Pelo menos um medicamento é obrigatório'),
    body('medications.*.name').trim().notEmpty().withMessage('Nome do medicamento é obrigatório'),
    body('medications.*.dosage').trim().notEmpty().withMessage('Dosagem é obrigatória'),
    body('medications.*.frequency').trim().notEmpty().withMessage('Frequência é obrigatória'),
    body('medications.*.duration').trim().notEmpty().withMessage('Duração é obrigatória'),
    body('medications.*.quantity').isInt({ min: 1 }).withMessage('Quantidade inválida')
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

        const prescription = new Prescription({
            ...authReq.body,
            clinic: authReq.user!.clinic
        });

        await prescription.save();

        return res.status(201).json({
            success: true,
            message: 'Receita criada com sucesso',
            data: prescription
        });
    } catch (error: any) {
        console.error('Error creating prescription:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao criar receita'
        });
    }
});

router.get('/patient/:patientId', param('patientId').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const prescriptions = await Prescription.find({
            patient: authReq.params.patientId,
            clinic: authReq.user!.clinic
        })
        .populate('provider', 'name')
        .sort({ prescribedDate: -1 })
        .lean();

        return res.json({
            success: true,
            data: prescriptions
        });
    } catch (error: any) {
        console.error('Error fetching prescriptions:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar receitas'
        });
    }
});

router.get('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const prescription = await Prescription.findOne({
            _id: authReq.params.id,
            clinic: authReq.user!.clinic
        })
        .populate('patient', 'firstName lastName')
        .populate('provider', 'name');

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: 'Receita não encontrada'
            });
        }

        return res.json({
            success: true,
            data: prescription
        });
    } catch (error: any) {
        console.error('Error fetching prescription:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar receita'
        });
    }
});

router.patch('/:id/status', param('id').isMongoId(), body('status').isIn(['draft', 'active', 'completed', 'cancelled']), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const prescription = await Prescription.findOneAndUpdate(
            { _id: authReq.params.id, clinic: authReq.user!.clinic },
            { status: authReq.body.status },
            { new: true }
        );

        if (!prescription) {
            return res.status(404).json({
                success: false,
                message: 'Receita não encontrada'
            });
        }

        return res.json({
            success: true,
            message: 'Status atualizado com sucesso',
            data: prescription
        });
    } catch (error: any) {
        console.error('Error updating prescription status:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao atualizar status'
        });
    }
});

export default router;
