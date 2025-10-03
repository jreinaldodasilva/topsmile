/**
 * API Contract Schemas for TopSmile Backend
 */

export const patientSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', pattern: '^[a-f\\d]{24}$' },
    firstName: { type: 'string', minLength: 2, maxLength: 50 },
    lastName: { type: 'string', minLength: 2, maxLength: 50 },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string', pattern: '^\\(\\d{2}\\)\\s\\d{4,5}-\\d{4}$' },
    dateOfBirth: { type: 'string', format: 'date' },
    gender: { type: 'string', enum: ['male', 'female', 'other'] },
    status: { type: 'string', enum: ['active', 'inactive', 'deleted'] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: ['_id', 'firstName', 'lastName', 'email', 'status'],
  additionalProperties: false
};

export const appointmentSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', pattern: '^[a-f\\d]{24}$' },
    patient: { type: 'string', pattern: '^[a-f\\d]{24}$' },
    provider: { type: 'string', pattern: '^[a-f\\d]{24}$' },
    scheduledStart: { type: 'string', format: 'date-time' },
    scheduledEnd: { type: 'string', format: 'date-time' },
    type: { type: 'string', enum: ['Consulta', 'Limpeza', 'Tratamento de Canal', 'Extração', 'Ortodontia'] },
    status: { type: 'string', enum: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'] },
    price: { type: 'number', minimum: 0 },
    notes: { type: 'string', maxLength: 500 },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: ['_id', 'patient', 'provider', 'scheduledStart', 'scheduledEnd', 'type', 'status'],
  additionalProperties: false
};

export const userSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string', pattern: '^[a-f\\d]{24}$' },
    name: { type: 'string', minLength: 2, maxLength: 100 },
    email: { type: 'string', format: 'email' },
    role: { type: 'string', enum: ['admin', 'provider', 'patient', 'super_admin'] },
    isActive: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  },
  required: ['_id', 'name', 'email', 'role'],
  additionalProperties: false
};

export const apiResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    data: { type: ['object', 'array', 'null'] },
    meta: {
      type: 'object',
      properties: {
        timestamp: { type: 'string', format: 'date-time' },
        requestId: { type: 'string' },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1 },
            limit: { type: 'number', minimum: 1 },
            total: { type: 'number', minimum: 0 },
            pages: { type: 'number', minimum: 0 }
          }
        }
      }
    }
  },
  required: ['success'],
  additionalProperties: false
};

export const errorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', const: false },
    message: { type: 'string' },
    errors: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          field: { type: 'string' },
          message: { type: 'string' },
          code: { type: 'string' }
        }
      }
    }
  },
  required: ['success', 'message'],
  additionalProperties: false
};