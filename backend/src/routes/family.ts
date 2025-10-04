// backend/src/routes/family.ts
import express, { Request, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { body, param, validationResult } from 'express-validator';
import { familyService } from '../services/familyService';

const router: express.Router = express.Router();

router.use(authenticate);

router.post('/link',
    body('primaryPatientId').isMongoId(),
    body('memberIds').isArray({ min: 1 }),
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const patient = await familyService.linkFamilyMembers(
                req.body.primaryPatientId,
                req.body.memberIds
            );

            return res.json({
                success: true,
                message: 'Membros da família vinculados com sucesso',
                data: patient
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
);

router.delete('/unlink/:primaryPatientId/:memberId',
    param('primaryPatientId').isMongoId(),
    param('memberId').isMongoId(),
    async (req: Request, res: Response) => {
        try {
            const patient = await familyService.unlinkFamilyMember(
                req.params.primaryPatientId,
                req.params.memberId
            );

            return res.json({
                success: true,
                message: 'Membro da família desvinculado',
                data: patient
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
);

router.get('/:patientId',
    param('patientId').isMongoId(),
    async (req: Request, res: Response) => {
        try {
            const members = await familyService.getFamilyMembers(req.params.patientId);

            return res.json({
                success: true,
                data: members
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
);

export default router;
