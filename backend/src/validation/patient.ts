// backend/src/validation/patient.ts
import { body, query } from 'express-validator';
import { requiredString, optionalString, emailValidation, phoneValidation, cpfValidation, dateValidation, enumValidation, arrayValidation, paginationValidation } from './common';

// Name validations
const nameValidations = [
    ...requiredString('firstName', 2, 100),
    ...requiredString('lastName', 2, 100)
];

// Address validations
const addressValidations = [
    optionalString('address.street', 200),
    optionalString('address.number', 20),
    optionalString('address.complement', 100),
    optionalString('address.neighborhood', 100),
    optionalString('address.city', 100),
    optionalString('address.state', 50),
    body('address.zipCode')
        .optional()
        .trim()
        .matches(/^\d{5}-?\d{3}$/)
        .withMessage('CEP deve estar no formato XXXXX-XXX')
];

// Emergency contact validations
const emergencyContactValidations = [
    body('emergencyContact.name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Nome do contato de emergência deve ter entre 2 e 100 caracteres'),
    body('emergencyContact.phone')
        .optional()
        .trim()
        .isLength({ min: 10, max: 15 })
        .withMessage('Telefone do contato de emergência deve ter entre 10 e 15 caracteres'),
    optionalString('emergencyContact.relationship', 50)
];

// Medical history validations
const medicalHistoryValidations = [
    arrayValidation('medicalHistory.allergies'),
    arrayValidation('medicalHistory.medications'),
    arrayValidation('medicalHistory.conditions'),
    optionalString('medicalHistory.notes', 1000)
];

// Create patient validation
export const createPatientValidation = [
    ...nameValidations,
    emailValidation('email', false),
    phoneValidation('phone', true),
    dateValidation('dateOfBirth', false),
    enumValidation('gender', ['male', 'female', 'other'], false),
    cpfValidation('cpf', false),
    ...addressValidations,
    ...emergencyContactValidations,
    ...medicalHistoryValidations
];

// Update patient validation
export const updatePatientValidation = [
    body('firstName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
    body('lastName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Sobrenome deve ter entre 2 e 100 caracteres'),
    emailValidation('email', false),
    phoneValidation('phone', false),
    dateValidation('dateOfBirth', false),
    enumValidation('gender', ['male', 'female', 'other'], false),
    cpfValidation('cpf', false),
    enumValidation('status', ['active', 'inactive'], false),
    ...addressValidations,
    ...emergencyContactValidations,
    ...medicalHistoryValidations
];

// Search patients validation
export const searchPatientsValidation = [
    query('search')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Busca deve ter entre 1 e 100 caracteres'),
    query('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('Status inválido'),
    ...paginationValidation,
    query('sortBy')
        .optional()
        .isIn(['name', 'firstName', 'lastName', 'email', 'phone', 'createdAt', 'updatedAt'])
        .withMessage('Campo de ordenação inválido'),
    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Ordem de classificação inválida')
];

// Update medical history validation
export const updateMedicalHistoryValidation = [
    arrayValidation('allergies'),
    arrayValidation('medications'),
    arrayValidation('conditions'),
    optionalString('notes', 1000)
];
