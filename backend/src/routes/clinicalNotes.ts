// backend/src/routes/clinicalNotes.ts
import express, { Request, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth';
import { body, param, validationResult } from 'express-validator';
import { ClinicalNote } from '../models/ClinicalNote';

const router: express.Router = express.Router();

router.use(authenticate);

const createValidation = [
    body('patient').isMongoId().withMessage('ID do paciente inválido'),
    body('provider').isMongoId().withMessage('ID do profissional inválido'),
    body('noteType').isIn(['soap', 'progress', 'consultation', 'procedure', 'other'])
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

        const note = new ClinicalNote({
            ...authReq.body,
            clinic: authReq.user!.clinic,
            createdBy: authReq.user!.id
        });

        await note.save();

        return res.status(201).json({
            success: true,
            message: 'Nota clínica criada com sucesso',
            data: note
        });
    } catch (error: any) {
        console.error('Error creating clinical note:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao criar nota clínica'
        });
    }
});

router.get('/patient/:patientId', param('patientId').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const notes = await ClinicalNote.find({
            patient: authReq.params.patientId,
            clinic: authReq.user!.clinic
        })
        .populate('provider', 'name')
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .lean();

        return res.json({
            success: true,
            data: notes
        });
    } catch (error: any) {
        console.error('Error fetching clinical notes:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar notas'
        });
    }
});

router.get('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const note = await ClinicalNote.findOne({
            _id: authReq.params.id,
            clinic: authReq.user!.clinic
        })
        .populate('patient', 'firstName lastName')
        .populate('provider', 'name')
        .populate('createdBy', 'name');

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Nota não encontrada'
            });
        }

        return res.json({
            success: true,
            data: note
        });
    } catch (error: any) {
        console.error('Error fetching clinical note:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao buscar nota'
        });
    }
});

router.put('/:id', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const note = await ClinicalNote.findOne({
            _id: authReq.params.id,
            clinic: authReq.user!.clinic
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Nota não encontrada'
            });
        }

        if (note.isLocked) {
            return res.status(403).json({
                success: false,
                message: 'Nota está bloqueada e não pode ser editada'
            });
        }

        Object.assign(note, authReq.body);
        await note.save();

        return res.json({
            success: true,
            message: 'Nota atualizada com sucesso',
            data: note
        });
    } catch (error: any) {
        console.error('Error updating clinical note:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao atualizar nota'
        });
    }
});

router.patch('/:id/sign', param('id').isMongoId(), async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    
    try {
        const note = await ClinicalNote.findOneAndUpdate(
            { _id: authReq.params.id, clinic: authReq.user!.clinic },
            {
                signature: {
                    signedBy: authReq.user!.id,
                    signedAt: new Date(),
                    signatureUrl: authReq.body.signatureUrl
                },
                isLocked: true
            },
            { new: true }
        );

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Nota não encontrada'
            });
        }

        return res.json({
            success: true,
            message: 'Nota assinada com sucesso',
            data: note
        });
    } catch (error: any) {
        console.error('Error signing clinical note:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Erro ao assinar nota'
        });
    }
});

export default router;
