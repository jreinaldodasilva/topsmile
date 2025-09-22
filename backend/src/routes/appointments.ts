// backend/src/routes/appointments.ts
import express, { Request, Response, NextFunction } from "express";
import { authenticate, authorize, AuthenticatedRequest } from "../middleware/auth";
import { authenticatePatient, requirePatientEmailVerification, PatientAuthenticatedRequest } from "../middleware/patientAuth";
import { schedulingService } from "../services/schedulingService";
import type { Patient, Appointment as AppointmentType } from '@topsmile/types';
import { Appointment } from "../models/Appointment";
import { body, validationResult } from 'express-validator';

const router: express.Router = express.Router();

// All appointment routes require authentication
router.use(authenticate);

// Get provider availability
/**
 * @swagger
 * /api/appointments/providers/{providerId}/availability:
 *   get:
 *     summary: Verificar disponibilidade do profissional
 *     description: Retorna os horários disponíveis de um profissional para uma data específica
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: providerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do profissional
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data para verificar disponibilidade
 *       - in: query
 *         name: appointmentTypeId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do tipo de agendamento
 *     responses:
 *       200:
 *         description: Horários disponíveis retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       startTime:
 *                         type: string
 *                         format: date-time
 *                       endTime:
 *                         type: string
 *                         format: date-time
 *                       available:
 *                         type: boolean
 *       400:
 *         description: Parâmetros inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/providers/:providerId/availability", async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const providerId = authReq.params.providerId;
    const { date, appointmentTypeId } = authReq.query;
    
    if (!date || !appointmentTypeId) {
      return res.status(400).json({ 
        success: false,
        error: "date and appointmentTypeId are required" 
      });
    }

    const targetDate = new Date(date as string);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({ 
        success: false,
        error: "Invalid date format" 
      });
    }

    const slots = await schedulingService.getAvailableSlots({
      clinicId: authReq.user!.clinicId!,
      providerId,
      appointmentTypeId: appointmentTypeId as string,
      date: targetDate
    });

    return res.json({ 
      success: true, 
      data: slots,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (authReq as any).requestId
      }
    });
  } catch (err: any) {
    console.error('Error fetching availability:', err);
    return res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// Validation for booking appointments
const bookingValidation = [
  body('patientId')
    .isMongoId()
    .withMessage('ID do paciente inválido'),
  
  body('providerId')
    .isMongoId()
    .withMessage('ID do profissional inválido'),
    
  body('appointmentTypeId')
    .isMongoId()
    .withMessage('ID do tipo de agendamento inválido'),
    
  body('scheduledStart')
    .isISO8601()
    .withMessage('Data/hora de início inválida'),
    
  body('notes')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Observações devem ter no máximo 500 caracteres'),
    
  body('priority')
    .optional()
    .isIn(['routine', 'urgent', 'emergency'])
    .withMessage('Prioridade inválida')
];

// Create a new appointment (standard CRUD endpoint)
/**
 * @swagger
 * /api/appointments:
 *   post:
 *     summary: Criar agendamento
 *     description: Cria um novo agendamento na clínica
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - providerId
 *               - appointmentTypeId
 *               - scheduledStart
 *             properties:
 *               patientId:
 *                 type: string
 *                 description: ID do paciente
 *               providerId:
 *                 type: string
 *                 description: ID do profissional
 *               appointmentTypeId:
 *                 type: string
 *                 description: ID do tipo de agendamento
 *               scheduledStart:
 *                 type: string
 *                 format: date-time
 *                 description: Data/hora de início
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *                 description: Observações
 *               priority:
 *                 type: string
 *                 enum: [routine, urgent, emergency]
 *                 description: Prioridade
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post("/", bookingValidation, async (req: Request, res: Response) => {
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

    const { patientId, providerId, appointmentTypeId, scheduledStart, notes, priority } = authReq.body;

    const appointment = await schedulingService.createAppointmentModel({
      clinicId: authReq.user!.clinicId!,
      patientId,
      providerId,
      appointmentTypeId,
      scheduledStart: new Date(scheduledStart),
      notes,
      priority,
      createdBy: authReq.user!.id
    });

    return res.status(201).json({ 
      success: true, 
      data: appointment,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (authReq as any).requestId
      }
    });
  } catch (err: any) {
    console.error("Appointment creation error:", err);
    return res.status(400).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// Book a new appointment (legacy endpoint)
router.post("/book", bookingValidation, async (req: Request, res: Response) => {
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

    const { patientId, providerId, appointmentTypeId, scheduledStart, notes, priority } = authReq.body;

    const appointment = await schedulingService.createAppointmentModel({
      clinicId: authReq.user!.clinicId!,
      patientId,
      providerId,
      appointmentTypeId,
      scheduledStart: new Date(scheduledStart),
      notes,
      priority,
      createdBy: authReq.user!.id
    });

    return res.status(201).json({ 
      success: true, 
      data: appointment,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (authReq as any).requestId
      }
    });
  } catch (err: any) {
    console.error("Booking error:", err);
    return res.status(400).json({ 
      success: false, 
      error: err.message 
    });
  }
});

// Get appointments for a date range
/**
 * @swagger
 * /api/appointments:
 *   get:
 *     summary: Listar agendamentos
 *     description: Retorna lista de agendamentos em um intervalo de datas
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data inicial
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data final
 *       - in: query
 *         name: providerId
 *         schema:
 *           type: string
 *         description: Filtrar por profissional
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, confirmed, checked_in, in_progress, completed, cancelled, no_show]
 *         description: Filtrar por status
 *     responses:
 *       200:
 *         description: Agendamentos retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Parâmetros inválidos
 *       401:
 *         description: Não autorizado
 */
router.get("/", async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const { startDate, endDate, providerId, status } = authReq.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'startDate and endDate are required'
      });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format'
      });
    }

    const appointments = await schedulingService.getAppointments(
      authReq.user!.clinicId!,
      start,
      end,
      providerId as string,
      status as string
    );

    return res.json({
      success: true,
      data: appointments,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (authReq as any).requestId
      }
    });
  } catch (err: any) {
    console.error("Error fetching appointments:", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * @swagger
 * /api/appointments/{id}:
 *   get:
 *     summary: Buscar agendamento por ID
 *     description: Retorna um agendamento específico pelo ID
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Agendamento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/:id", async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const appointment = await Appointment.findById(authReq.params.id!)
      .populate('patient', 'name phone email')
      .populate('provider', 'name specialties')
      .populate('appointmentType', 'name duration color category')
      .populate('createdBy', 'name email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    // Check if user has access to this appointment
    if (appointment.clinic.toString() !== authReq.user!.clinicId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    return res.json({
      success: true,
      data: appointment,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (authReq as any).requestId
      }
    });
  } catch (err: any) {
    console.error("Error fetching appointment:", err);
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Update appointment (general update endpoint)
/**
 * @swagger
 * /api/appointments/{id}:
 *   patch:
 *     summary: Atualizar agendamento
 *     description: Atualiza os dados de um agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *                 description: ID do paciente
 *               providerId:
 *                 type: string
 *                 description: ID do profissional
 *               appointmentTypeId:
 *                 type: string
 *                 description: ID do tipo de agendamento
 *               scheduledStart:
 *                 type: string
 *                 format: date-time
 *                 description: Data/hora de início
 *               scheduledEnd:
 *                 type: string
 *                 format: date-time
 *                 description: Data/hora de fim
 *               status:
 *                 type: string
 *                 enum: [scheduled, confirmed, checked_in, in_progress, completed, cancelled, no_show]
 *                 description: Status do agendamento
 *               priority:
 *                 type: string
 *                 enum: [routine, urgent, emergency]
 *                 description: Prioridade
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *                 description: Observações
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Agendamento não encontrado
 */
router.patch("/:id", bookingValidation.map(validation => validation.optional()), async (req: Request, res: Response) => {
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

    const appointment = await Appointment.findById(authReq.params.id!);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Agendamento não encontrado'
      });
    }

    // Check clinic access
    if (appointment.clinic.toString() !== authReq.user!.clinicId) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado'
      });
    }

    // Update fields
    const updateFields = ['patientId', 'providerId', 'appointmentTypeId', 'scheduledStart', 'scheduledEnd', 'status', 'priority', 'notes'];
    updateFields.forEach(field => {
      if (authReq.body[field] !== undefined) {
        if (field === 'scheduledStart' || field === 'scheduledEnd') {
          (appointment as any)[field] = new Date(authReq.body[field]);
        } else if (field === 'patientId') {
          appointment.patient = authReq.body[field];
        } else if (field === 'providerId') {
          appointment.provider = authReq.body[field];
        } else if (field === 'appointmentTypeId') {
          appointment.appointmentType = authReq.body[field];
        } else {
          (appointment as any)[field] = authReq.body[field];
        }
      }
    });

    const updatedAppointment = await appointment.save();
    await updatedAppointment.populate([
      { path: 'patient', select: 'name phone email' },
      { path: 'provider', select: 'name specialties' },
      { path: 'appointmentType', select: 'name duration color category' }
    ]);

    return res.json({
      success: true,
      data: updatedAppointment,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: (authReq as any).requestId
      }
    });
  } catch (err: any) {
    console.error("Error updating appointment:", err);
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   patch:
 *     summary: Atualizar status do agendamento
 *     description: Atualiza o status de um agendamento
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [scheduled, confirmed, checked_in, in_progress, completed, cancelled, no_show]
 *                 description: Novo status
 *               cancellationReason:
 *                 type: string
 *                 maxLength: 500
 *                 description: Motivo do cancelamento (opcional)
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.patch("/:id/status", 
  body('status').isIn(['scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show']),
  body('cancellationReason').optional().isLength({ max: 500 }),
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

      const { status, cancellationReason } = authReq.body;

      const appointment = await Appointment.findById(authReq.params.id!);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Agendamento não encontrado'
        });
      }

      // Check clinic access
      if (appointment.clinic.toString() !== authReq.user!.clinicId) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      if (status === 'cancelled') {
        const updatedAppointment = await schedulingService.cancelAppointmentModel(
          authReq.params.id!,
          cancellationReason || 'Cancelado pelo usuário'
        );
        return res.json({
          success: true,
          data: updatedAppointment,
          meta: {
            timestamp: new Date().toISOString(),
            requestId: (authReq as any).requestId
          }
        });
      } else {
        appointment.status = status;
        if (status === 'checked_in') {
          appointment.actualStart = new Date();
        } else if (status === 'completed') {
          appointment.actualEnd = new Date();
        }
        
        const updatedAppointment = await appointment.save();
        return res.json({
          success: true,
          data: updatedAppointment,
          meta: {
            timestamp: new Date().toISOString(),
            requestId: (authReq as any).requestId
          }
        });
      }
    } catch (err: any) {
      console.error("Error updating appointment status:", err);
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }
);

/**
 * @swagger
 * /api/appointments/{id}/reschedule:
 *   patch:
 *     summary: Reagendar agendamento
 *     description: Reagenda um agendamento para uma nova data/hora
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do agendamento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newStart
 *               - reason
 *               - rescheduleBy
 *             properties:
 *               newStart:
 *                 type: string
 *                 format: date-time
 *                 description: Nova data/hora de início
 *               reason:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 500
 *                 description: Motivo do reagendamento
 *               rescheduleBy:
 *                 type: string
 *                 enum: [patient, clinic]
 *                 description: Quem solicitou o reagendamento
 *     responses:
 *       200:
 *         description: Agendamento reagendado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Agendamento não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.patch("/:id/reschedule",
  body('newStart').isISO8601().withMessage('Nova data/hora inválida'),
  body('reason').isLength({ min: 1, max: 500 }).withMessage('Motivo é obrigatório e deve ter no máximo 500 caracteres'),
  body('rescheduleBy').isIn(['patient', 'clinic']).withMessage('Tipo de reagendamento inválido'),
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

      const { newStart, reason, rescheduleBy } = authReq.body;

      const updatedAppointment = await schedulingService.rescheduleAppointmentModel(
        authReq.params.id!,
        new Date(newStart),
        reason,
        rescheduleBy
      );

      return res.json({
        success: true,
        data: updatedAppointment,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (authReq as any).requestId
        }
      });
    } catch (err: any) {
      console.error("Error rescheduling appointment:", err);
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
  }
);

// Delete appointment (only for admins)
router.delete("/:id", 
  authorize('super_admin', 'admin'), 
  async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
    try {
      const appointment = await Appointment.findById(authReq.params.id!);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Agendamento não encontrado'
        });
      }

      // Check clinic access
      if (appointment.clinic.toString() !== authReq.user!.clinicId) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      await Appointment.findByIdAndDelete(authReq.params.id!);

      return res.json({
        success: true,
        message: 'Agendamento excluído com sucesso',
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (authReq as any).requestId
        }
      });
    } catch (err: any) {
      console.error("Error deleting appointment:", err);
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }
);

// Patient-specific appointment endpoints
router.get("/patient",
  authenticatePatient,
  requirePatientEmailVerification,
  async (req: PatientAuthenticatedRequest, res: Response) => {
    try {
      const { startDate, endDate, status, page = 1, limit = 10 } = req.query;

      // Default to current month if no dates provided
      const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const end = endDate ? new Date(endDate as string) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
          success: false,
          error: 'Invalid date format'
        });
      }

      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);

      if (pageNum < 1 || limitNum < 1 || limitNum > 100) {
        return res.status(400).json({
          success: false,
          error: 'Invalid pagination parameters'
        });
      }

      // Get appointments for this patient
      const appointments = await Appointment.find({
        patient: (req.patient!._id as any).toString(),
        clinic: req.patient!.clinic,
        scheduledStart: { $gte: start, $lte: end }
      })
        .populate('patient', 'name phone email')
        .populate('provider', 'name specialties')
        .populate('appointmentType', 'name duration color category')
        .populate('clinic', 'name')
        .sort({ scheduledStart: -1 })
        .limit(limitNum)
        .skip((pageNum - 1) * limitNum);

      const total = await Appointment.countDocuments({
        patient: (req.patient!._id as any).toString(),
        clinic: req.patient!.clinic,
        scheduledStart: { $gte: start, $lte: end }
      });

      return res.json({
        success: true,
        data: {
          appointments,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum),
            hasNext: pageNum * limitNum < total,
            hasPrev: pageNum > 1
          }
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req as any).requestId
        }
      });
    } catch (err: any) {
      console.error("Error fetching patient appointments:", err);
      return res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }
);

// Patient can create their own appointments
router.post("/patient/book",
  authenticatePatient,
  requirePatientEmailVerification,
  bookingValidation,
  async (req: PatientAuthenticatedRequest, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const { providerId, appointmentTypeId, scheduledStart, notes, priority } = req.body;

      // Ensure the patient can only book for themselves
      const appointment = await schedulingService.createAppointmentModel({
        clinicId: (req.patient!.clinic as any).toString(),
        patientId: (req.patient!._id as any).toString(),
        providerId,
        appointmentTypeId,
        scheduledStart: new Date(scheduledStart),
        notes,
        priority,
        createdBy: (req.patientUser!._id as any).toString()
      });

      return res.status(201).json({
        success: true,
        data: appointment,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req as any).requestId
        }
      });
    } catch (err: any) {
      console.error("Patient booking error:", err);
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
  }
);

// Patient can cancel their own appointments
router.patch("/patient/:id/cancel",
  authenticatePatient,
  requirePatientEmailVerification,
  [body('reason').optional().isLength({ max: 500 })],
  async (req: PatientAuthenticatedRequest, res: any) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const appointment = await Appointment.findById(req.params.id!);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Agendamento não encontrado'
        });
      }

      // Check if appointment belongs to this patient
      if (appointment.patient.toString() !== (req.patient!._id as any).toString()) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      const { reason } = req.body;

      const updatedAppointment = await schedulingService.cancelAppointmentModel(
        req.params.id!,
        reason || 'Cancelado pelo paciente'
      );

      return res.json({
        success: true,
        data: updatedAppointment,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req as any).requestId
        }
      });
    } catch (err: any) {
      console.error("Error cancelling patient appointment:", err);
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }
  }
);

export default router;
