// backend/src/validation/appointment.ts
import { body, query } from 'express-validator';
import { mongoIdBody, mongoIdParam, optionalMongoIdBody, dateValidation, optionalString, enumValidation, paginationValidation } from './common';
import { AppointmentStatus } from '@topsmile/types';

// Create/Book appointment validation
export const createAppointmentValidation = [
    mongoIdBody('patient').withMessage('ID do paciente inválido'),
    mongoIdBody('provider').withMessage('ID do profissional inválido'),
    mongoIdBody('appointmentType').withMessage('ID do tipo de agendamento inválido'),
    dateValidation('scheduledStart').withMessage('Data/hora de início inválida'),
    optionalString('notes', 500),
    enumValidation('priority', ['routine', 'urgent', 'emergency'], false)
];

// Update appointment validation
export const updateAppointmentValidation = [
    optionalMongoIdBody('patient'),
    optionalMongoIdBody('provider'),
    optionalMongoIdBody('appointmentType'),
    body('scheduledStart').optional().isISO8601().withMessage('Data/hora de início inválida').toDate(),
    body('scheduledEnd').optional().isISO8601().withMessage('Data/hora de término inválida').toDate(),
    body('status').optional().isIn(Object.values(AppointmentStatus)).withMessage('Status inválido'),
    body('priority').optional().isIn(['routine', 'urgent', 'emergency']).withMessage('Prioridade inválida'),
    optionalString('notes', 500)
];

// Update status validation
export const updateStatusValidation = [
    body('status')
        .isIn(Object.values(AppointmentStatus))
        .withMessage('Status inválido'),
    optionalString('cancellationReason', 500)
];

// Reschedule validation
export const rescheduleValidation = [
    body('newStart')
        .isISO8601()
        .withMessage('Nova data/hora inválida')
        .toDate(),
    body('reason')
        .trim()
        .notEmpty()
        .withMessage('Motivo é obrigatório')
        .isLength({ max: 500 })
        .withMessage('Motivo deve ter no máximo 500 caracteres'),
    body('rescheduleBy')
        .isIn(['patient', 'clinic'])
        .withMessage('Tipo de reagendamento inválido')
];

// Get appointments query validation
export const getAppointmentsValidation = [
    query('startDate')
        .notEmpty()
        .withMessage('Data inicial é obrigatória')
        .isISO8601()
        .withMessage('Data inicial inválida')
        .toDate(),
    query('endDate')
        .notEmpty()
        .withMessage('Data final é obrigatória')
        .isISO8601()
        .withMessage('Data final inválida')
        .toDate(),
    query('providerId')
        .optional()
        .isMongoId()
        .withMessage('ID do profissional inválido'),
    query('status')
        .optional()
        .isIn(Object.values(AppointmentStatus))
        .withMessage('Status inválido')
];

// Get availability query validation
export const getAvailabilityValidation = [
    mongoIdParam('providerId').withMessage('ID do profissional inválido'),
    query('date')
        .notEmpty()
        .withMessage('Data é obrigatória')
        .isISO8601()
        .withMessage('Data inválida')
        .toDate(),
    query('appointmentTypeId')
        .notEmpty()
        .withMessage('Tipo de agendamento é obrigatório')
        .isMongoId()
        .withMessage('ID do tipo de agendamento inválido')
];

// Patient appointments query validation
export const getPatientAppointmentsValidation = [
    query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Data inicial inválida')
        .toDate(),
    query('endDate')
        .optional()
        .isISO8601()
        .withMessage('Data final inválida')
        .toDate(),
    query('status')
        .optional()
        .isIn(Object.values(AppointmentStatus))
        .withMessage('Status inválido'),
    ...paginationValidation
];

// Cancel appointment validation
export const cancelAppointmentValidation = [
    optionalString('reason', 500)
];
