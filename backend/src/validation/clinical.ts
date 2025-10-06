// backend/src/validation/clinical.ts
import { body, param } from 'express-validator';
import { mongoIdParam, mongoIdBody, requiredString, enumValidation, arrayValidation } from './common';

// Treatment Plan validations
export const createTreatmentPlanValidation = [
    mongoIdBody('patient').withMessage('ID do paciente inválido'),
    mongoIdBody('provider').withMessage('ID do profissional inválido'),
    ...requiredString('title', 2, 200),
    body('phases')
        .isArray({ min: 1 })
        .withMessage('Pelo menos uma fase é obrigatória')
];

export const acceptTreatmentPlanValidation = [
    mongoIdParam('id'),
    body('acceptedBy')
        .trim()
        .notEmpty()
        .withMessage('acceptedBy é obrigatório')
];

export const updatePhaseStatusValidation = [
    mongoIdParam('id'),
    param('phaseNumber')
        .isInt({ min: 1 })
        .withMessage('Número da fase inválido')
        .toInt(),
    enumValidation('status', ['pending', 'in_progress', 'completed'])
];

export const estimateInsuranceValidation = [
    mongoIdBody('patientId').withMessage('ID do paciente inválido'),
    body('procedures')
        .isArray({ min: 1 })
        .withMessage('Pelo menos um procedimento é obrigatório')
];

// Dental Chart validations
export const createDentalChartValidation = [
    mongoIdBody('patient').withMessage('ID do paciente inválido'),
    mongoIdBody('provider').withMessage('ID do profissional inválido'),
    enumValidation('numberingSystem', ['fdi', 'universal'])
];

// Clinical Notes validations
export const createClinicalNoteValidation = [
    mongoIdBody('patient').withMessage('ID do paciente inválido'),
    mongoIdBody('provider').withMessage('ID do profissional inválido'),
    mongoIdBody('appointment').withMessage('ID do agendamento inválido'),
    ...requiredString('subjective', 1, 2000),
    ...requiredString('objective', 1, 2000),
    ...requiredString('assessment', 1, 2000),
    ...requiredString('plan', 1, 2000)
];

// Prescription validations
export const createPrescriptionValidation = [
    mongoIdBody('patient').withMessage('ID do paciente inválido'),
    mongoIdBody('provider').withMessage('ID do profissional inválido'),
    body('medications')
        .isArray({ min: 1 })
        .withMessage('Pelo menos um medicamento é obrigatório'),
    body('medications.*.name')
        .trim()
        .notEmpty()
        .withMessage('Nome do medicamento é obrigatório'),
    body('medications.*.dosage')
        .trim()
        .notEmpty()
        .withMessage('Dosagem é obrigatória'),
    body('medications.*.frequency')
        .trim()
        .notEmpty()
        .withMessage('Frequência é obrigatória'),
    body('medications.*.duration')
        .trim()
        .notEmpty()
        .withMessage('Duração é obrigatória')
];
