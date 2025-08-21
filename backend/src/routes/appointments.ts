// backend/src/routes/appointments.ts
import { Router } from 'express';
import { Appointment } from '../models/Appointment';
import { body, validationResult } from 'express-validator';
import { Request, Response } from 'express';

const router = Router();

interface AppointmentBookingBody {
    patientId: string;
    practitionerId: string;
    scheduledAt: string; // ISO 8601 string
    [key: string]: any;
}

router.post(
    '/book',
    [
        body('patientId').isMongoId(),
        body('practitionerId').isMongoId(),
        body('scheduledAt').isISO8601()
    ],
    async (
        req: Request<{}, unknown, AppointmentBookingBody>,
        res: Response,
        next: (err?: any) => void
    ): Promise<void> => {
        const errs = validationResult(req);
        if (!errs.isEmpty()) {
            res.status(400).json({ errors: errs.array() });
            return;
        }
        const appt = new Appointment(req.body);
        await appt.save();
        res.json(appt);
    }
);

router.get('/', async (req, res) => {
    const { practitionerId, from, to } = req.query;
    const query: Record<string, any> = {};
    if (practitionerId) query['practitionerId'] = practitionerId;
    if (from || to) query['scheduledAt'] = {};
    if (from) query['scheduledAt'].$gte = new Date(String(from));
    if (to) query['scheduledAt'].$lte = new Date(String(to));
    const list = await Appointment.find(query).sort('scheduledAt');
    res.json(list);
});

export default router;
