// backend/src/routes/public/clinics.ts
import express, { Request, Response } from 'express';
import { Clinic } from '../../models/Clinic';

const router: express.Router = express.Router();

/**
 * @swagger
 * /api/public/clinics:
 *   get:
 *     summary: Lista clínicas ativas disponíveis para registro de pacientes
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Lista de clínicas ativas
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const clinics = await Clinic.find({
            'subscription.status': 'active',
            'settings.allowOnlineBooking': true
        })
        .select('name address.city address.state phone email')
        .sort({ name: 1 });

        return res.json({
            success: true,
            data: clinics
        });
    } catch (error: any) {
        console.error('Error fetching clinics:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro ao buscar clínicas'
        });
    }
});

export default router;
