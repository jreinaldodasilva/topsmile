// backend/src/routes/dentalCharts.ts
import express, { Request, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth';
import { body, param, validationResult } from 'express-validator';
import { DentalChart } from '../models/DentalChart';

const router: express.Router = express.Router();

router.use(authenticate);

const createValidation = [
    body('patient').isMongoId().withMessage('ID do paciente inválido'),
    body('provider').isMongoId().withMessage('ID do profissional inválido'),
    body('numberingSystem').isIn(['fdi', 'universal'])
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

        const chart = new DentalChart({
            ...authReq.body,
            clinic: authReq.user!.clinic
        });

        await chart.save();

        return res.status(201).json({
            success: true,
            message: 'Odontograma criado com sucesso',
            data: chart
        });
    } catch (error: any) {
        console.error('Error creating dental chart:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao criar odontograma'
        });
    }
});

router.get('/patient/:patientId', param('patientId').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const charts = await DentalChart.find({
            patient: authReq.params.patientId,
            clinic: authReq.user!.clinic
        })
        .populate('provider', 'name')
        .sort({ chartDate: -1 })
        .lean();

        return res.json({
            success: true,
            data: charts
        });
    } catch (error: any) {
        console.error('Error fetching dental charts:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar odontogramas'
        });
    }
});

router.get('/patient/:patientId/latest', param('patientId').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const chart = await DentalChart.findOne({
            patient: authReq.params.patientId,
            clinic: authReq.user!.clinic
        })
        .populate('provider', 'name')
        .sort({ chartDate: -1 });

        if (!chart) {
            return res.status(404).json({
                success: false,
                message: 'Odontograma não encontrado'
            });
        }

        return res.json({
            success: true,
            data: chart
        });
    } catch (error: any) {
        console.error('Error fetching latest dental chart:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar odontograma'
        });
    }
});

router.get('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const chart = await DentalChart.findOne({
            _id: authReq.params.id,
            clinic: authReq.user!.clinic
        })
        .populate('patient', 'firstName lastName')
        .populate('provider', 'name');

        if (!chart) {
            return res.status(404).json({
                success: false,
                message: 'Odontograma não encontrado'
            });
        }

        return res.json({
            success: true,
            data: chart
        });
    } catch (error: any) {
        console.error('Error fetching dental chart:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar odontograma'
        });
    }
});

router.put('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const chart = await DentalChart.findOneAndUpdate(
            { _id: authReq.params.id, clinic: authReq.user!.clinic },
            authReq.body,
            { new: true, runValidators: true }
        );

        if (!chart) {
            return res.status(404).json({
                success: false,
                message: 'Odontograma não encontrado'
            });
        }

        return res.json({
            success: true,
            message: 'Odontograma atualizado com sucesso',
            data: chart
        });
    } catch (error: any) {
        console.error('Error updating dental chart:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao atualizar odontograma'
        });
    }
});

export default router;
