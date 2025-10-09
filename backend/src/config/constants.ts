// backend/src/config/constants.ts
/**
 * Application-wide constants
 * Centralizes magic numbers and strings for better maintainability
 */

export const CACHE = {
  DEFAULT_TTL: 3600,
  PROVIDER_TTL: 7200,
  SETTINGS_TTL: 86400,
  APPOINTMENT_TTL: 300,
  PATIENT_TTL: 1800
};

export const CONSTANTS = {
  // Token Configuration
  TOKEN: {
    ACCESS_EXPIRES: '15m',
    PATIENT_ACCESS_EXPIRES: '24h',
    REFRESH_EXPIRES_DAYS: 7,
    MIN_SECRET_LENGTH: 64,
    MAX_REFRESH_TOKENS_PER_USER: 5,
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    API_MAX: 100,
    API_MAX_PROD: 100,
    API_MAX_DEV: 1000,
    AUTH_MAX: 10,
    AUTH_MAX_DEV: 100,
    CONTACT_MAX: 5,
    PASSWORD_RESET_MAX: 3,
    PASSWORD_RESET_WINDOW: 60 * 60 * 1000, // 1 hour
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
    PATIENT_APPOINTMENTS_LIMIT: 10,
  },

  // Appointment Configuration
  APPOINTMENT: {
    MIN_DURATION: 15, // minutes
    MAX_DURATION: 480, // 8 hours
    DEFAULT_DURATION: 60,
    SLOT_INTERVAL: 15, // minutes
    MAX_SLOTS_PER_DAY: 200,
    DEFAULT_BUFFER_BEFORE: 0,
    DEFAULT_BUFFER_AFTER: 0,
    MAX_RESCHEDULE_HISTORY: 10,
  },

  // Password Policy
  PASSWORD: {
    MIN_LENGTH: 8,
    RECOMMENDED_MIN_LENGTH: 12,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL: true,
    SPECIAL_CHARS: '!@#$%^&*',
  },

  // Request Limits
  REQUEST: {
    BODY_SIZE_LIMIT: '10mb',
    JSON_LIMIT: '10mb',
    URL_ENCODED_LIMIT: '10mb',
    PARAMETER_LIMIT: 100,
    FILE_SIZE_LIMIT: 5 * 1024 * 1024, // 5MB
    MAX_FILES: 5,
  },

  // Session Configuration
  SESSION: {
    TIMEOUT_WARNING: 5 * 60 * 1000, // 5 minutes before timeout
    TIMEOUT_DURATION: 30 * 60 * 1000, // 30 minutes
    COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // Validation
  VALIDATION: {
    NAME_MIN_LENGTH: 2,
    NAME_MAX_LENGTH: 100,
    EMAIL_MAX_LENGTH: 254,
    PHONE_MIN_LENGTH: 10,
    PHONE_MAX_LENGTH: 11,
    CPF_LENGTH: 11,
    ZIP_CODE_LENGTH: 8,
    NOTES_MAX_LENGTH: 1000,
    PRIVATE_NOTES_MAX_LENGTH: 2000,
    MEDICAL_NOTES_MAX_LENGTH: 2000,
    MEDICAL_ITEM_MAX_LENGTH: 200,
    CANCELLATION_REASON_MAX_LENGTH: 500,
    FEEDBACK_MAX_LENGTH: 1000,
  },

  // Age Limits
  AGE: {
    MIN: 0,
    MAX: 150,
  },

  // Working Hours
  WORKING_HOURS: {
    DEFAULT_START: '08:00',
    DEFAULT_END: '18:00',
    SATURDAY_START: '08:00',
    SATURDAY_END: '12:00',
  },

  // Timezone
  TIMEZONE: {
    DEFAULT: 'America/Sao_Paulo',
  },

  // Locale
  LOCALE: {
    DEFAULT: 'pt-BR',
    CURRENCY: 'BRL',
  },

  // Status Values
  STATUS: {
    APPOINTMENT: {
      SCHEDULED: 'scheduled',
      CONFIRMED: 'confirmed',
      CHECKED_IN: 'checked_in',
      IN_PROGRESS: 'in_progress',
      COMPLETED: 'completed',
      CANCELLED: 'cancelled',
      NO_SHOW: 'no_show',
    },
    PATIENT: {
      ACTIVE: 'active',
      INACTIVE: 'inactive',
    },
    CONTACT: {
      NEW: 'new',
      CONTACTED: 'contacted',
      QUALIFIED: 'qualified',
      CONVERTED: 'converted',
      CLOSED: 'closed',
    },
    BILLING: {
      PENDING: 'pending',
      BILLED: 'billed',
      PAID: 'paid',
      INSURANCE_PENDING: 'insurance_pending',
      INSURANCE_APPROVED: 'insurance_approved',
      INSURANCE_DENIED: 'insurance_denied',
    },
  },

  // Priority Levels
  PRIORITY: {
    ROUTINE: 'routine',
    URGENT: 'urgent',
    EMERGENCY: 'emergency',
  },

  // Contact Methods
  CONTACT_METHOD: {
    PHONE: 'phone',
    EMAIL: 'email',
    SMS: 'sms',
    WHATSAPP: 'whatsapp',
  },

  // Roles
  ROLES: {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    MANAGER: 'manager',
    DENTIST: 'dentist',
    ASSISTANT: 'assistant',
    PATIENT: 'patient',
  },

  // Error Messages (Portuguese)
  ERRORS: {
    UNAUTHORIZED: 'Não autorizado',
    FORBIDDEN: 'Acesso negado',
    NOT_FOUND: 'Não encontrado',
    VALIDATION_ERROR: 'Dados inválidos',
    INTERNAL_ERROR: 'Erro interno do servidor',
    NETWORK_ERROR: 'Erro de conexão',
    TOKEN_EXPIRED: 'Token expirado',
    TOKEN_INVALID: 'Token inválido',
    SESSION_EXPIRED: 'Sessão expirada',
    RATE_LIMIT_EXCEEDED: 'Muitas requisições. Tente novamente mais tarde.',
    INVALID_CREDENTIALS: 'E-mail ou senha inválidos',
    ACCOUNT_LOCKED: 'Conta temporariamente bloqueada',
    ACCOUNT_INACTIVE: 'Conta desativada',
    DUPLICATE_EMAIL: 'E-mail já está em uso',
    DUPLICATE_CPF: 'CPF já cadastrado',
    INVALID_DATE_FORMAT: 'Formato de data inválido',
    INVALID_TIME_SLOT: 'Horário não disponível',
    APPOINTMENT_CONFLICT: 'Conflito com agendamento existente',
    REQUIRED_FIELD: 'Campo obrigatório',
  },

  // Success Messages (Portuguese)
  SUCCESS: {
    CREATED: 'Criado com sucesso',
    UPDATED: 'Atualizado com sucesso',
    DELETED: 'Excluído com sucesso',
    SAVED: 'Salvo com sucesso',
    SENT: 'Enviado com sucesso',
    APPOINTMENT_BOOKED: 'Agendamento realizado com sucesso',
    APPOINTMENT_CANCELLED: 'Agendamento cancelado com sucesso',
    APPOINTMENT_RESCHEDULED: 'Agendamento reagendado com sucesso',
    PASSWORD_CHANGED: 'Senha alterada com sucesso',
    PASSWORD_RESET_SENT: 'E-mail de redefinição de senha enviado',
    LOGIN_SUCCESS: 'Login realizado com sucesso',
    LOGOUT_SUCCESS: 'Logout realizado com sucesso',
  },

  // Cache Configuration
  CACHE: {
    PROVIDER_TTL: 300, // 5 minutes
    CLINIC_SETTINGS_TTL: 600, // 10 minutes
    APPOINTMENT_TYPES_TTL: 300, // 5 minutes
    DEFAULT_TTL: 300, // 5 minutes
  },

  // Logging
  LOG: {
    LEVELS: {
      ERROR: 'error',
      WARN: 'warn',
      INFO: 'info',
      DEBUG: 'debug',
    },
  },

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },

  // Regex Patterns
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_BR: /^\d{10,11}$/,
    CPF: /^\d{11}$/,
    ZIP_CODE_BR: /^\d{5}-?\d{3}$/,
    NAME: /^[a-zA-ZÀ-ÿ\s\-'.]+$/,
    COLOR_HEX: /^#[0-9A-F]{6}$/i,
    URL: /^https?:\/\/.+/,
  },

  // Feature Flags
  FEATURES: {
    ENABLE_SMS: process.env.ENABLE_SMS === 'true',
    ENABLE_EMAIL: process.env.ENABLE_EMAIL !== 'false',
    ENABLE_REMINDERS: process.env.ENABLE_REMINDERS !== 'false',
    ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS !== 'false',
    ENABLE_AUDIT_LOG: process.env.ENABLE_AUDIT_LOG !== 'false',
  },
} as const;

// Type-safe constant access
export type Constants = typeof CONSTANTS;

// Helper functions for common operations
export const isValidEmail = (email: string): boolean => {
  return CONSTANTS.REGEX.EMAIL.test(email) && email.length <= CONSTANTS.VALIDATION.EMAIL_MAX_LENGTH;
};

export const isValidBrazilianPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  return CONSTANTS.REGEX.PHONE_BR.test(cleanPhone);
};

export const isValidCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  return CONSTANTS.REGEX.CPF.test(cleanCPF);
};

export const isValidPassword = (password: string): boolean => {
  if (password.length < CONSTANTS.PASSWORD.MIN_LENGTH) return false;
  if (CONSTANTS.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) return false;
  if (CONSTANTS.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) return false;
  if (CONSTANTS.PASSWORD.REQUIRE_NUMBER && !/[0-9]/.test(password)) return false;
  if (CONSTANTS.PASSWORD.REQUIRE_SPECIAL && !new RegExp(`[${CONSTANTS.PASSWORD.SPECIAL_CHARS}]`).test(password)) return false;
  return true;
};

export const formatBrazilianPhone = (phone: string): string => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  if (cleanPhone.length === 11) {
    return `(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 7)}-${cleanPhone.substring(7)}`;
  } else if (cleanPhone.length === 10) {
    return `(${cleanPhone.substring(0, 2)}) ${cleanPhone.substring(2, 6)}-${cleanPhone.substring(6)}`;
  }
  return phone;
};

export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  if (cleanCPF.length === 11) {
    return `${cleanCPF.substring(0, 3)}.${cleanCPF.substring(3, 6)}.${cleanCPF.substring(6, 9)}-${cleanCPF.substring(9)}`;
  }
  return cpf;
};

export const formatZipCode = (zipCode: string): string => {
  const cleanZip = zipCode.replace(/[^\d]/g, '');
  if (cleanZip.length === 8) {
    return `${cleanZip.substring(0, 5)}-${cleanZip.substring(5)}`;
  }
  return zipCode;
};

export default CONSTANTS;
