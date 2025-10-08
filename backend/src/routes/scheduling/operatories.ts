// backend/src/routes/operatories.ts
import express, { Request, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth/auth';
import { body, param, validationResult } from 'express-validator';
import type { Operatory as IOperatory } from '@topsmile/types';
import { Operatory } from '../../models/Operatory';

const router: express.Router = express.Router();

router.use(authenticate);

router.post('/', 
    body('name').trim().notEmpty(),
    body('room').trim().notEmpty(),
    async (req: Request, res: Response) => {
        const authReq = req as AuthenticatedRequest;
        
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const operatory = new Operatory({
                ...authReq.body,
                clinic: authReq.user!.clinic
            });

            await operatory.save();

            return res.status(201).json({
                success: true,
                data: operatory
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
        const operatories = await Operatory.find({
            clinic: authReq.user!.clinic,
            isActive: true
        }).sort({ name: 1 });

        return res.json({
            success: true,
            data: operatories
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

router.patch('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const operatory = await Operatory.findOneAndUpdate(
            { _id: authReq.params.id, clinic: authReq.user!.clinic },
            authReq.body,
            { new: true }
        );

        if (!operatory) {
            return res.status(404).json({ success: false, message: 'Operatório não encontrado' });
        }

        return res.json({
            success: true,
            data: operatory
        });
    } catch (error: any) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
