// backend/src/validation/schemas.ts
import { body, param, query } from 'express-validator';
import { CONSTANTS } from '../config/constants';

// Common validation rules
export const commonValidation = {
  mongoId: (field: string, message?: string) =>
    param(field).isMongoId().withMessage(message || `${field} inválido`),
  
  mongoIdBody: (field: string, message?: string) =>
    body(field).isMongoId().withMessage(message || `${field} inválido`),
  
  email: (field: string = 'email') =>
    body(field).isEmail().normalizeEmail().withMessage('E-mail inválido'),
  
  phone: (field: string = 'phone') =>
    body(field).matches(CONSTANTS.REGEX.PHONE_BR).withMessage('Telefone inválido'),
  
  date: (field: string) =>
    body(field).isISO8601().toDate().withMessage(`${field} deve ser uma data válida`),
  
  string: (field: string, min: number, max: number) =>
    body(field).isString().trim().isLength({ min, max }).withMessage(`${field} deve ter entre ${min} e ${max} caracteres`),
  
  optional: (field: string) =>
    body(field).optional(),
};

// Appointment validation
export const appointmentValidation = {
  create: [
    body('patient').isMongoId().withMessage('ID do paciente inválido'),
    body('provider').isMongoId().withMessage('ID do profissional inválido'),
    body('appointmentType').isMongoId().withMessage('ID do tipo de agendamento inválido'),
    body('scheduledStart').isISO8601().withMessage('Data/hora de início inválida'),
    body('notes').optional().isLength({ max: CONSTANTS.VALIDATION.NOTES_MAX_LENGTH }),
    body('priority').optional().isIn(['routine', 'urgent', 'emergency']),
  ],
  
  update: [
    param('id').isMongoId().withMessage('ID do agendamento inválido'),
    body('patient').optional().isMongoId(),
    body('provider').optional().isMongoId(),
    body('appointmentType').optional().isMongoId(),
    body('scheduledStart').optional().isISO8601(),
    body('status').optional().isIn(Object.values(CONSTANTS.STATUS.APPOINTMENT)),
    body('notes').optional().isLength({ max: CONSTANTS.VALIDATION.NOTES_MAX_LENGTH }),
  ],
  
  reschedule: [
    param('id').isMongoId(),
    body('newStart').isISO8601().withMessage('Nova data/hora inválida'),
    body('reason').isLength({ min: 1, max: CONSTANTS.VALIDATION.CANCELLATION_REASON_MAX_LENGTH }),
    body('rescheduleBy').isIn(['patient', 'clinic']),
  ],
};

// Patient validation
export const patientValidation = {
  create: [
    body('firstName').trim().isLength({ min: CONSTANTS.VALIDATION.NAME_MIN_LENGTH, max: CONSTANTS.VALIDATION.NAME_MAX_LENGTH }),
    body('lastName').trim().isLength({ min: CONSTANTS.VALIDATION.NAME_MIN_LENGTH, max: CONSTANTS.VALIDATION.NAME_MAX_LENGTH }),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').matches(CONSTANTS.REGEX.PHONE_BR),
    body('dateOfBirth').optional().isISO8601().toDate(),
    body('cpf').optional().matches(CONSTANTS.REGEX.CPF),
  ],
  
  update: [
    param('id').isMongoId(),
    body('firstName').optional().trim().isLength({ min: CONSTANTS.VALIDATION.NAME_MIN_LENGTH, max: CONSTANTS.VALIDATION.NAME_MAX_LENGTH }),
    body('lastName').optional().trim().isLength({ min: CONSTANTS.VALIDATION.NAME_MIN_LENGTH, max: CONSTANTS.VALIDATION.NAME_MAX_LENGTH }),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().matches(CONSTANTS.REGEX.PHONE_BR),
  ],
};

// Provider validation
export const providerValidation = {
  create: [
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('phone').matches(CONSTANTS.REGEX.PHONE_BR),
    body('specialties').isArray({ min: 1 }),
    body('licenseNumber').trim().notEmpty(),
  ],
  
  update: [
    param('id').isMongoId(),
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().matches(CONSTANTS.REGEX.PHONE_BR),
  ],
};

// Clinical validation
export const clinicalValidation = {
  dentalChart: [
    body('patient').isMongoId(),
    body('provider').isMongoId(),
    body('numberingSystem').isIn(['fdi', 'universal']),
  ],
  
  treatmentPlan: [
    body('patient').isMongoId(),
    body('provider').isMongoId(),
    body('title').trim().notEmpty(),
    body('phases').isArray({ min: 1 }),
  ],
  
  clinicalNote: [
    body('patient').isMongoId(),
    body('provider').isMongoId(),
    body('content').trim().isLength({ min: 1, max: 5000 }),
  ],
};

// Auth validation
export const authValidation = {
  login: [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: CONSTANTS.PASSWORD.MIN_LENGTH }),
  ],
  
  register: [
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: CONSTANTS.PASSWORD.MIN_LENGTH }),
  ],
  
  changePassword: [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: CONSTANTS.PASSWORD.MIN_LENGTH }),
  ],
};

// Query validation
export const queryValidation = {
  pagination: [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: CONSTANTS.PAGINATION.MAX_LIMIT }).toInt(),
  ],
  
  dateRange: [
    query('startDate').isISO8601().toDate(),
    query('endDate').isISO8601().toDate(),
  ],
};
