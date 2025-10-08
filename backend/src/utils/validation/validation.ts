import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Email inválido').max(255);
export const passwordSchema = z.string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/\d/, 'Senha deve conter pelo menos um número')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Senha deve conter pelo menos um caractere especial');

export const phoneSchema = z.string()
  .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone deve estar no formato (XX) XXXXX-XXXX');

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID inválido');

// Authentication schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória')
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(['admin', 'manager', 'dentist', 'assistant'])
});

// Patient schemas
export const patientRegistrationSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  clinicId: objectIdSchema,
  patientId: objectIdSchema.optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['male', 'female', 'other']).optional()
});

// Appointment schemas
export const appointmentSchema = z.object({
  patientId: objectIdSchema,
  providerId: objectIdSchema,
  appointmentTypeId: objectIdSchema,
  scheduledStart: z.string().datetime(),
  scheduledEnd: z.string().datetime(),
  notes: z.string().max(1000).optional(),
  priority: z.enum(['routine', 'urgent', 'emergency']).default('routine')
});

// Validation middleware
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.map(err => ({
          msg: err.message,
          param: err.path.join('.')
        }));
        
        return res.status(400).json({
          success: false,
          message: 'Dados de entrada inválidos',
          errors: validationErrors
        });
      }
      next(error);
    }
  };
};