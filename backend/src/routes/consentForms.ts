// backend/src/routes/consentForms.ts
import express, { Request, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth';
import { body, param, validationResult } from 'express-validator';
import { ConsentForm } from '../models/ConsentForm';

const router: express.Router = express.Router();

router.use(authenticate);

const createValidation = [
    body('patient').isMongoId().withMessage('ID do paciente inválido'),
    body('formType').isIn(['treatment_consent', 'anesthesia_consent', 'privacy_policy', 'financial_agreement', 'photo_release', 'other']),
    body('title').trim().notEmpty().withMessage('Título é obrigatório'),
    body('content').trim().notEmpty().withMessage('Conteúdo é obrigatório')
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

        const form = new ConsentForm({
            ...authReq.body,
            clinic: authReq.user!.clinic
        });

        await form.save();

        return res.status(201).json({
            success: true,
            message: 'Formulário de consentimento criado com sucesso',
            data: form
        });
    } catch (error: any) {
        console.error('Error creating consent form:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao criar formulário'
        });
    }
});

router.get('/patient/:patientId', param('patientId').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const forms = await ConsentForm.find({
            patient: authReq.params.patientId,
            clinic: authReq.user!.clinic
        })
        .sort({ createdAt: -1 })
        .lean();

        return res.json({
            success: true,
            data: forms
        });
    } catch (error: any) {
        console.error('Error fetching consent forms:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar formulários'
        });
    }
});

router.get('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const form = await ConsentForm.findOne({
            _id: authReq.params.id,
            clinic: authReq.user!.clinic
        }).populate('patient', 'firstName lastName');

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Formulário não encontrado'
            });
        }

        return res.json({
            success: true,
            data: form
        });
    } catch (error: any) {
        console.error('Error fetching consent form:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar formulário'
        });
    }
});

router.patch('/:id/sign', param('id').isMongoId(), body('signatureUrl').notEmpty(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const form = await ConsentForm.findOneAndUpdate(
            { _id: authReq.params.id, clinic: authReq.user!.clinic, status: 'pending' },
            {
                status: 'signed',
                signedAt: new Date(),
                signedBy: authReq.body.signedBy || 'patient',
                signatureUrl: authReq.body.signatureUrl,
                witnessName: authReq.body.witnessName,
                witnessSignature: authReq.body.witnessSignature
            },
            { new: true }
        );

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Formulário não encontrado ou já assinado'
            });
        }

        return res.json({
            success: true,
            message: 'Formulário assinado com sucesso',
            data: form
        });
    } catch (error: any) {
        console.error('Error signing consent form:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao assinar formulário'
        });
    }
});

router.patch('/:id/decline', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const form = await ConsentForm.findOneAndUpdate(
            { _id: authReq.params.id, clinic: authReq.user!.clinic, status: 'pending' },
            { status: 'declined' },
            { new: true }
        );

        if (!form) {
            return res.status(404).json({
                success: false,
                message: 'Formulário não encontrado'
            });
        }

        return res.json({
            success: true,
            message: 'Formulário recusado',
            data: form
        });
    } catch (error: any) {
        console.error('Error declining consent form:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao recusar formulário'
        });
    }
});

export default router;
