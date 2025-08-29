// backend/src/routes/appointments.ts
import express from 'express';
import { schedulingService } from '../services/schedulingService';
import { Request, Response } from 'express';
import { body, query, param, validationResult } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';

const router = express.Router();

/**
 * GET /api/appointments/providers/:providerId/availability
 * Query params:
 *  - date (YYYY-MM-DD) OR from/to (ISO dates)
 *  - typeId (appointmentTypeId) required
 *
 * Returns available time slots for a provider (or clinic if providerId === 'all')
 */
router.get(
  '/providers/:providerId/availability',
  [
    param('providerId').notEmpty().withMessage('providerId required'),
    query('date').optional().isISO8601().withMessage('date must be ISO string'),
    query('from').optional().isISO8601(),
    query('to').optional().isISO8601(),
    query('typeId').notEmpty().withMessage('typeId required')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const providerId = DOMPurify.sanitize(String(req.params.providerId));
      const typeId = DOMPurify.sanitize(String(req.query.typeId));
      const dateStr = req.query.date ? String(req.query.date) : undefined;

      const clinicId = req.query.clinicId ? String(req.query.clinicId) : undefined;

      // Prefer single date if provided
      const date = dateStr ? new Date(dateStr) : undefined;

      // Use schedulingService.getAvailableSlots which expects an
      // object { clinicId?, providerId?, appointmentTypeId, date?, excludeAppointmentId? }
      const slots = await schedulingService.getAvailableSlots({
        clinicId,
        providerId: providerId === 'all' ? undefined : providerId,
        appointmentTypeId: typeId,
        date: date || new Date()
      });

      return res.json({ success: true, data: slots });
    } catch (err: any) {
      console.error('Error fetching availability:', err);
      return res.status(500).json({ success: false, message: err.message || 'Erro ao buscar disponibilidade' });
    }
  }
);

/**
 * POST /api/appointments/book
 * Body:
 *  - clinicId
 *  - patientId
 *  - providerId
 *  - appointmentTypeId
 *  - scheduledStart (ISO string)
 *  - notes (optional)
 */
router.post(
  '/book',
  [
    body('clinicId').notEmpty(),
    body('patientId').notEmpty(),
    body('providerId').notEmpty(),
    body('appointmentTypeId').notEmpty(),
    body('scheduledStart').notEmpty().isISO8601()
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      // Sanitize input
      const payload = {
        clinicId: DOMPurify.sanitize(String(req.body.clinicId)),
        patientId: DOMPurify.sanitize(String(req.body.patientId)),
        providerId: DOMPurify.sanitize(String(req.body.providerId)),
        appointmentTypeId: DOMPurify.sanitize(String(req.body.appointmentTypeId)),
        scheduledStart: new Date(req.body.scheduledStart),
        notes: req.body.notes ? DOMPurify.sanitize(String(req.body.notes)) : undefined,
        priority: req.body.priority ? DOMPurify.sanitize(String(req.body.priority)) : 'routine'
      };

      const appointment = await schedulingService.createAppointment({
        clinicId: payload.clinicId,
        patientId: payload.patientId,
        providerId: payload.providerId,
        appointmentTypeId: payload.appointmentTypeId,
        scheduledStart: payload.scheduledStart,
        notes: payload.notes,
        priority: payload.priority as any,
        createdBy: undefined
      });

      return res.json({ success: true, data: appointment });
    } catch (err: any) {
      console.error('Booking error:', err);
      return res.status(400).json({ success: false, message: err.message || 'Erro ao agendar' });
    }
  }
);

export default router;
