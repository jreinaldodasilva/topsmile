import logger from '../../utils/logger';
// backend/src/routes/dentalCharts.ts
import express, { Request, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../../middleware/auth/auth';
import { body, param, validationResult } from 'express-validator';
import type { DentalChart as IDentalChart } from '@topsmile/types';
import { dentalChartService } from '../../services/clinical/dentalChartService';

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

        const chart = await dentalChartService.createDentalChart({
            ...authReq.body,
            clinic: authReq.user!.clinicId!
        });

        return res.status(201).json({
            success: true,
            message: 'Odontograma criado com sucesso',
            data: chart,
            meta: {
                timestamp: new Date().toISOString(),
                requestId: (authReq as any).requestId
            }
        });
    } catch (error: any) {
        logger.error({ error }, 'Error creating dental chart:');
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao criar odontograma'
        });
    }
});

router.get('/patient/:patientId', param('patientId').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const patientId = authReq.params.patientId as string;
        const charts = await dentalChartService.getDentalChartsByPatient(patientId, authReq.user!.clinicId!);

        return res.json({
            success: true,
            data: charts,
            meta: {
                timestamp: new Date().toISOString(),
                requestId: (authReq as any).requestId
            }
        });
    } catch (error: any) {
        logger.error({ error }, 'Error fetching dental charts:');
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar odontogramas'
        });
    }
});

router.get('/patient/:patientId/latest', param('patientId').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const patientId = authReq.params.patientId as string;
        const chart = await dentalChartService.getLatestDentalChart(patientId, authReq.user!.clinicId!);

        if (!chart) {
            return res.status(404).json({
                success: false,
                message: 'Odontograma não encontrado'
            });
        }

        return res.json({
            success: true,
            data: chart,
            meta: {
                timestamp: new Date().toISOString(),
                requestId: (authReq as any).requestId
            }
        });
    } catch (error: any) {
        logger.error({ error }, 'Error fetching latest dental chart:');
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar odontograma'
        });
    }
});

router.get('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const chartId = authReq.params.id as string;
        const chart = await dentalChartService.getDentalChartById(chartId, authReq.user!.clinicId!);

        if (!chart) {
            return res.status(404).json({
                success: false,
                message: 'Odontograma não encontrado'
            });
        }

        return res.json({
            success: true,
            data: chart,
            meta: {
                timestamp: new Date().toISOString(),
                requestId: (authReq as any).requestId
            }
        });
    } catch (error: any) {
        logger.error({ error }, 'Error fetching dental chart:');
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar odontograma'
        });
    }
});

router.put('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const chartId = authReq.params.id as string;
        const chart = await dentalChartService.updateDentalChart(chartId, authReq.user!.clinicId!, authReq.body);

        if (!chart) {
            return res.status(404).json({
                success: false,
                message: 'Odontograma não encontrado'
            });
        }

        return res.json({
            success: true,
            message: 'Odontograma atualizado com sucesso',
            data: chart,
            meta: {
                timestamp: new Date().toISOString(),
                requestId: (authReq as any).requestId
            }
        });
    } catch (error: any) {
        logger.error({ error }, 'Error updating dental chart:');
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao atualizar odontograma'
        });
    }
});

export default router;
