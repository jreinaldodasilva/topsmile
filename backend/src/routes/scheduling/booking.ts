import logger from '../../utils/logger';
// backend/src/routes/booking.ts
import express, { Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { bookingService } from '../../services/scheduling/bookingService';
import type { AppointmentType as IAppointmentType } from '@topsmile/types';
import { AppointmentType } from '../../models/AppointmentType';

const router: express.Router = express.Router();

router.get('/appointment-types',
    query('clinicId').isMongoId(),
    async (req: Request, res: Response) => {
        try {
            const types = await AppointmentType.find({
                clinic: req.query.clinicId,
                allowOnlineBooking: true,
                isActive: true
            }).select('name description duration price category').lean();

            return res.json({
                success: true,
                data: types
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
);

router.get('/available-slots',
    query('clinicId').isMongoId(),
    query('appointmentTypeId').isMongoId(),
    query('date').isISO8601(),
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const slots = await bookingService.getAvailableSlots(
                req.query.clinicId as string,
                req.query.appointmentTypeId as string,
                new Date(req.query.date as string),
                req.query.providerId as string | undefined
            );

            return res.json({
                success: true,
                data: slots
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
);

router.post('/book',
    body('patientId').isMongoId(),
    body('clinicId').isMongoId(),
    body('providerId').isMongoId(),
    body('appointmentTypeId').isMongoId(),
    body('scheduledStart').isISO8601(),
    async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ success: false, errors: errors.array() });
            }

            const appointment = await bookingService.createBooking({
                patientId: req.body.patientId,
                clinicId: req.body.clinicId,
                providerId: req.body.providerId,
                appointmentTypeId: req.body.appointmentTypeId,
                scheduledStart: new Date(req.body.scheduledStart),
                notes: req.body.notes
            });

            return res.status(201).json({
                success: true,
                message: 'Agendamento realizado com sucesso',
                data: appointment
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
