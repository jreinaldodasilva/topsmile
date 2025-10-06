// backend/src/validation/common.ts
import { body, param, query } from 'express-validator';

// MongoDB ObjectId validation
export const mongoIdParam = (field: string = 'id') =>
    param(field)
        .isMongoId()
        .withMessage(`${field} inválido`);

export const mongoIdBody = (field: string) =>
    body(field)
        .isMongoId()
        .withMessage(`${field} inválido`);

export const optionalMongoIdBody = (field: string) =>
    body(field)
        .optional()
        .isMongoId()
        .withMessage(`${field} inválido`);

// String validations
export const requiredString = (field: string, minLength: number = 2, maxLength: number = 100) => [
    body(field)
        .trim()
        .notEmpty()
        .withMessage(`${field} é obrigatório`)
        .isLength({ min: minLength, max: maxLength })
        .withMessage(`${field} deve ter entre ${minLength} e ${maxLength} caracteres`)
];

export const optionalString = (field: string, maxLength: number = 100) =>
    body(field)
        .optional()
        .trim()
        .isLength({ max: maxLength })
        .withMessage(`${field} deve ter no máximo ${maxLength} caracteres`);

// Email validation
export const emailValidation = (field: string = 'email', required: boolean = true) => {
    const validator = body(field)
        .trim()
        .toLowerCase()
        .isEmail()
        .withMessage('E-mail inválido')
        .isLength({ max: 254 })
        .withMessage('E-mail muito longo');
    
    return required ? validator.notEmpty().withMessage('E-mail é obrigatório') : validator.optional();
};

// Phone validation (Brazilian format)
export const phoneValidation = (field: string = 'phone', required: boolean = true) => {
    const validator = body(field)
        .trim()
        .matches(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/)
        .withMessage('Telefone deve estar em formato brasileiro válido');
    
    return required ? validator.notEmpty().withMessage('Telefone é obrigatório') : validator.optional();
};

// CPF validation
export const cpfValidation = (field: string = 'cpf', required: boolean = false) => {
    const validator = body(field)
        .trim()
        .matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/)
        .withMessage('CPF inválido');
    
    return required ? validator.notEmpty().withMessage('CPF é obrigatório') : validator.optional();
};

// Date validations
export const dateValidation = (field: string, required: boolean = true) => {
    const validator = body(field)
        .isISO8601()
        .withMessage(`${field} deve ser uma data válida`)
        .toDate();
    
    return required ? validator.notEmpty().withMessage(`${field} é obrigatório`) : validator.optional();
};

export const futureDateValidation = (field: string) =>
    body(field)
        .isISO8601()
        .withMessage(`${field} deve ser uma data válida`)
        .custom((value) => {
            const date = new Date(value);
            return date > new Date();
        })
        .withMessage(`${field} deve ser uma data futura`)
        .toDate();

export const pastDateValidation = (field: string) =>
    body(field)
        .isISO8601()
        .withMessage(`${field} deve ser uma data válida`)
        .custom((value) => {
            const date = new Date(value);
            return date < new Date();
        })
        .withMessage(`${field} deve ser uma data passada`)
        .toDate();

// Enum validation
export const enumValidation = (field: string, allowedValues: string[], required: boolean = true) => {
    const validator = body(field)
        .isIn(allowedValues)
        .withMessage(`${field} deve ser um dos valores: ${allowedValues.join(', ')}`);
    
    return required ? validator.notEmpty().withMessage(`${field} é obrigatório`) : validator.optional();
};

// Number validations
export const numberValidation = (field: string, min?: number, max?: number, required: boolean = true) => {
    let validator = body(field)
        .isNumeric()
        .withMessage(`${field} deve ser um número`);
    
    if (min !== undefined) {
        validator = validator.isFloat({ min }).withMessage(`${field} deve ser no mínimo ${min}`);
    }
    if (max !== undefined) {
        validator = validator.isFloat({ max }).withMessage(`${field} deve ser no máximo ${max}`);
    }
    
    return required ? validator.notEmpty().withMessage(`${field} é obrigatório`) : validator.optional();
};

// Pagination query validations
export const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Página deve ser um número inteiro positivo')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limite deve ser entre 1 e 100')
        .toInt(),
    query('sort')
        .optional()
        .isString()
        .withMessage('Ordenação deve ser uma string')
];

// Array validation
export const arrayValidation = (field: string, required: boolean = false) => {
    const validator = body(field)
        .isArray()
        .withMessage(`${field} deve ser um array`);
    
    return required ? validator.notEmpty().withMessage(`${field} é obrigatório`) : validator.optional();
};

// Boolean validation
export const booleanValidation = (field: string, required: boolean = false) => {
    const validator = body(field)
        .isBoolean()
        .withMessage(`${field} deve ser verdadeiro ou falso`)
        .toBoolean();
    
    return required ? validator.notEmpty().withMessage(`${field} é obrigatório`) : validator.optional();
};

// URL validation
export const urlValidation = (field: string, required: boolean = false) => {
    const validator = body(field)
        .trim()
        .isURL()
        .withMessage(`${field} deve ser uma URL válida`);
    
    return required ? validator.notEmpty().withMessage(`${field} é obrigatório`) : validator.optional();
};
