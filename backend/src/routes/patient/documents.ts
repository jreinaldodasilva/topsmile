// backend/src/routes/documents.ts
import express, { Request, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth';
import { body, validationResult } from 'express-validator';

const router: express.Router = express.Router();

router.use(authenticate);

router.post('/upload',
    body('patientId').isMongoId(),
    body('documentType').isIn(['photo', 'insurance_card', 'id_document', 'consent_form', 'other']),
    body('fileData').notEmpty(),
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            // Placeholder for actual file upload logic (S3, local storage, etc.)
            const documentUrl = `https://storage.example.com/documents/${req.body.patientId}/${Date.now()}.pdf`;

            return res.json({
                success: true,
                message: 'Documento enviado com sucesso',
                data: {
                    url: documentUrl,
                    type: req.body.documentType,
                    uploadedAt: new Date()
                }
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
