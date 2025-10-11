import logger from '../../utils/logger';
// backend/src/routes/waitlist.ts
import express, { Request, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth/auth';
import { body, param, validationResult } from 'express-validator';
import type { Waitlist as IWaitlist } from '@topsmile/types';
import { Waitlist } from '../../models/Waitlist';

const router: express.Router = express.Router();

router.use(authenticate);

router.post('/',
    body('patient').isMongoId(),
    body('appointmentType').isMongoId(),
    body('priority').isIn(['routine', 'urgent', 'emergency']),
    async (req: Request, res: Response) => {
        const authReq = req as AuthenticatedRequest;
        
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);

            const entry = new Waitlist({
                ...authReq.body,
                clinic: authReq.user!.clinic,
                expiresAt,
                createdBy: authReq.user!.id
            });

            await entry.save();

            return res.status(201).json({
                success: true,
                data: entry
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
);

router.get('/', async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const entries = await Waitlist.find({
            clinic: authReq.user!.clinic,
            status: 'active'
        })
        .populate('patient', 'firstName lastName phone email')
        .populate('provider', 'name')
        .populate('appointmentType', 'name')
        .sort({ priority: -1, createdAt: 1 });

        return res.json({
            success: true,
            data: entries
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.patch('/:id/status',
    param('id').isMongoId(),
    body('status').isIn(['active', 'scheduled', 'cancelled', 'expired']),
    async (req: Request, res: Response) => {
        const authReq = req as AuthenticatedRequest;
        
        try {
            const entry = await Waitlist.findOneAndUpdate(
                { _id: authReq.params.id, clinic: authReq.user!.clinic },
                { status: authReq.body.status },
                { new: true }
            );

            if (!entry) {
                return res.status(404).json({ success: false, message: 'Entrada não encontrada' });
            }

            return res.json({
                success: true,
                data: entry
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
);

router.patch('/:id/contact', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const entry = await Waitlist.findOneAndUpdate(
            { _id: authReq.params.id, clinic: authReq.user!.clinic },
            {
                $inc: { contactAttempts: 1 },
                lastContactDate: new Date()
            },
            { new: true }
        );

        if (!entry) {
            return res.status(404).json({ success: false, message: 'Entrada não encontrada' });
        }

        return res.json({
            success: true,
            data: entry
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
