// backend/src/routes/insurance.ts
import express, { Request, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../middleware/auth';
import { body, param, validationResult } from 'express-validator';
import { Insurance } from '../../models/Insurance';

const router: express.Router = express.Router();

router.use(authenticate);

const createValidation = [
    body('patient').isMongoId().withMessage('ID do paciente inválido'),
    body('type').isIn(['primary', 'secondary']).withMessage('Tipo inválido'),
    body('provider').trim().notEmpty().withMessage('Provedor é obrigatório'),
    body('policyNumber').trim().notEmpty().withMessage('Número da apólice é obrigatório'),
    body('subscriberName').trim().notEmpty().withMessage('Nome do titular é obrigatório'),
    body('subscriberRelationship').isIn(['self', 'spouse', 'child', 'other']),
    body('effectiveDate').isISO8601().withMessage('Data de início inválida')
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

        const insurance = new Insurance({
            ...authReq.body,
            clinic: authReq.user!.clinic
        });

        await insurance.save();

        return res.status(201).json({
            success: true,
            message: 'Seguro criado com sucesso',
            data: insurance
        });
    } catch (error: any) {
        console.error('Error creating insurance:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao criar seguro'
        });
    }
});

router.get('/patient/:patientId', param('patientId').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const insurances = await Insurance.find({
            patient: authReq.params.patientId,
            clinic: authReq.user!.clinic,
            isActive: true
        }).sort({ type: 1 }).lean();

        return res.json({
            success: true,
            data: insurances
        });
    } catch (error: any) {
        console.error('Error fetching insurance:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar seguros'
        });
    }
});

router.put('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const insurance = await Insurance.findOneAndUpdate(
            { _id: authReq.params.id, clinic: authReq.user!.clinic },
            authReq.body,
            { new: true, runValidators: true }
        );

        if (!insurance) {
            return res.status(404).json({
                success: false,
                message: 'Seguro não encontrado'
            });
        }

        return res.json({
            success: true,
            message: 'Seguro atualizado com sucesso',
            data: insurance
        });
    } catch (error: any) {
        console.error('Error updating insurance:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao atualizar seguro'
        });
    }
});

router.delete('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const insurance = await Insurance.findOneAndUpdate(
            { _id: authReq.params.id, clinic: authReq.user!.clinic },
            { isActive: false },
            { new: true }
        );

        if (!insurance) {
            return res.status(404).json({
                success: false,
                message: 'Seguro não encontrado'
            });
        }

        return res.json({
            success: true,
            message: 'Seguro desativado com sucesso'
        });
    } catch (error: any) {
        console.error('Error deleting insurance:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao desativar seguro'
        });
    }
});

export default router;
