// backend/src/routes/patient/documents.ts
import express, { Request, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../../middleware/auth/auth';
import { body, validationResult } from 'express-validator';

const router: express.Router = express.Router();

router.use(authenticate);

const uploadValidation = [
    body('patientId').isMongoId().withMessage('ID do paciente inválido'),
    body('documentType').isIn(['photo', 'insurance_card', 'id_document', 'consent_form', 'other'])
        .withMessage('Tipo de documento inválido'),
    body('fileData').notEmpty().withMessage('Dados do arquivo são obrigatórios')
];

router.post('/upload',
    uploadValidation,
    async (req: Request, res: Response) => {
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

            if (!authReq.user?.clinicId) {
                return res.status(400).json({
                    success: false,
                    message: 'Clínica não identificada'
                });
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
                },
                meta: {
                    timestamp: new Date().toISOString(),
                    requestId: (authReq as any).requestId
                }
            });
        } catch (error: any) {
            console.error('Error uploading document:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Erro ao enviar documento'
            });
        }
    }
);

export default router;
