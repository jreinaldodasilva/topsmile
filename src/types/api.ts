// src/types/api.ts - Updated to match backend models
export type ApiResult<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ msg: string; param: string }>;
};

export type Pagination = {
  page?: number;
  limit?: number; // Changed from pageSize to match backend
  total: number;
  pages?: number;
};

// UPDATED: User type to match backend User model
export type User = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager' | 'dentist' | 'assistant';
  clinic?: string;
  isActive?: boolean;
  lastLogin?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
};

// UPDATED: Contact type to match backend Contact model
export type Contact = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  clinic: string;
  specialty?: string;
  phone?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed' | 'deleted' | 'merged';
  source?: 'website_contact_form' | 'phone' | 'email' | 'referral' | 'social_media' | 'advertisement' | string;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  assignedTo?: string | User;
  assignedToClinic?: string;
  followUpDate?: string | Date | null;
  // ADDED: Backend-specific fields
  leadScore?: number;
  lastContactedAt?: string | Date;
  conversionDetails?: {
    convertedAt?: string | Date;
    convertedBy?: string | User;
    conversionNotes?: string;
    conversionValue?: number;
  };
  metadata?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmTerm?: string;
    utmContent?: string;
    referrer?: string;
    ipAddress?: string;
    userAgent?: string;
  };
  deletedAt?: string | Date;
  deletedBy?: string;
  mergedInto?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
};

export type ContactFilters = {
  search?: string;
  status?: string;
  source?: string;
  priority?: string;
  assignedTo?: string;
  dateFrom?: string | Date;
  dateTo?: string;
  page?: number;
  limit?: number; // Changed from pageSize
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any;
};

// UPDATED: Contact list response to match backend
export type ContactListResponse = {
  contacts: Contact[];
  total: number;
  page: number;
  pages: number;
  limit: number;
};

// UPDATED: Clinic type to match backend model
export type Clinic = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  // ADDED: Backend-specific fields
  subscription?: {
    plan: 'basic' | 'professional' | 'premium';
    status: 'active' | 'inactive' | 'suspended' | 'canceled';
    startDate: string | Date;
    endDate?: string | Date;
  };
  settings?: {
    timezone: string;
    workingHours: {
      [key: string]: {
        start: string;
        end: string;
        isWorking: boolean;
      };
    };
    appointmentDuration: number;
    allowOnlineBooking: boolean;
  };
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
};

// UPDATED: Patient type to match backend model
export type Patient = {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  birthDate?: string | Date;
  gender?: 'male' | 'female' | 'other';
  // ADDED: Backend-specific fields
  cpf?: string;
  address?: {
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    notes?: string;
  };
  clinic?: string;
  status?: 'active' | 'inactive';
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
};

// UPDATED: Appointment type to match backend model
export type Appointment = {
  id?: string;
  _id?: string;
  patient: string | Patient;
  clinic: string | Clinic;
  provider: string | Provider;
  appointmentType: string | AppointmentType;
  scheduledStart?: string | Date;
  scheduledEnd?: string | Date;
  actualStart?: string | Date;
  actualEnd?: string | Date;
  status?: 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  priority?: 'routine' | 'urgent' | 'emergency';
  notes?: string;
  privateNotes?: string;
  remindersSent?: {
    confirmation: boolean;
    reminder24h: boolean;
    reminder2h: boolean;
    customReminder?: boolean;
  };
  cancellationReason?: string;
  rescheduleHistory?: Array<{
    oldDate: Date;
    newDate: Date;
    reason: string;
    rescheduleBy: 'patient' | 'clinic';
    timestamp: Date;
    rescheduleCount: number;
  }>;
  checkedInAt?: Date;
  completedAt?: Date;
  duration?: number;
  waitTime?: number;
  room?: string;
  equipment?: string[];
  followUpRequired?: boolean;
  followUpDate?: Date;
  billingStatus?: 'pending' | 'billed' | 'paid' | 'insurance_pending' | 'insurance_approved' | 'insurance_denied';
  billingAmount?: number;
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    copayAmount?: number;
  };
  preferredContactMethod?: 'phone' | 'email' | 'sms' | 'whatsapp';
  languagePreference?: string;
  patientSatisfactionScore?: number;
  patientFeedback?: string;
  noShowReason?: string;
  externalId?: string;
  syncStatus?: 'synced' | 'pending' | 'error';
  createdBy?: User;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
};

// ADDED: Provider type from backend
export type Provider = {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  specialties?: string[];
  licenseNumber?: string;
  clinic?: string | Clinic;
  user?: string;
  // ADDED: Working hours and availability
  workingHours?: {
    [key: string]: {
      start: string;
      end: string;
      isWorking: boolean;
    };
  };
  timeZone?: string;
  bufferTimeBefore?: number;
  bufferTimeAfter?: number;
  appointmentTypes?: string[];
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
};

// ADDED: Appointment type from backend
export type AppointmentType = {
  id?: string;
  _id?: string;
  name?: string;
  description?: string;
  duration?: number; // in minutes
  price?: number;
  color?: string;
  category?: 'consultation' | 'cleaning' | 'treatment' | 'surgery' | 'emergency';
  // ADDED: Buffer times
  bufferBefore?: number;
  bufferAfter?: number;
  allowOnlineBooking: boolean;
  preparationInstructions?: string;
  postTreatmentInstructions?: string;
  requiresApproval?: boolean;
  isActive?: boolean;
  clinic?: string | Clinic;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
};

// UPDATED: Dashboard stats to match backend response
export type DashboardStats = {
  // Contact statistics
  contacts: {
    total: number;
    byStatus: Array<{ _id: string; count: number }>;
    bySource: Array<{ _id: string; count: number }>;
    recentCount: number;
    monthlyTrend: Array<{ month: string; count: number }>;
  };
  // System health
  system?: {
    uptime: number;
    memoryUsage: number;
    databaseStatus: string;
  };
  // Summary metrics
  summary: {
    totalContacts: number;
    newThisWeek: number;
    conversionRate: number;
    revenue?: string;
  };
  // User context
  user: {
    name?: string;
    role?: string;
    clinicId?: string;
    lastActivity: string;
  };
  [key: string]: any;
};

// ADDED: Form field and template types from backend
export type FormField = {
  name: string;
  label?: string;
  type?: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'email' | 'phone' | 'number';
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string;
  };
  placeholder?: string;
  defaultValue?: any;
  [key: string]: any;
};

export type FormTemplate = {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  fields: FormField[];
  category?: string;
  isActive?: boolean;
  clinic: string | Clinic;
  createdBy?: string | User;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
};

// ADDED: Form response type
export type FormResponse = {
  id?: string;
  _id?: string;
  template: string | FormTemplate;
  patient: string | Patient;
  responses: Record<string, any>;
  submittedAt: string | Date;
  isComplete: boolean;
  clinic: string | Clinic;
  [key: string]: any;
};

// ADDED: Create form response payload type
export type CreateFormResponse = {
  templateId: string;
  patientId: string;
  answers: Record<string, any>;
};

// ADDED: Authentication-related types
export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  clinic?: {
    name: string;
    phone: string;
    address: {
      street: string;
      number?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
  };
};

export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  clinic: {
    name: string;
    phone: string;
    address: {
      street: string;
      number: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};

// ADDED: Health check types
export type HealthStatus = {
  timestamp: string;
  uptime: string;
  database: {
    status: string;
    name: string;
  };
  memory: {
    used: string;
    total: string;
  };
  environment: string;
  version: string;
  nodeVersion: string;
};

// ADDED: Batch operation types
export type BatchUpdateResult = {
  modifiedCount: number;
  matchedCount: number;
};

export type DuplicateContactGroup = {
  email: string;
  contacts: Contact[];
  count: number;
};

// ADDED: Error types for better error handling
export type ValidationError = {
  msg: string;
  param: string;
  value?: any;
};

export type ApiError = {
  success: false;
  message: string;
  errors?: ValidationError[];
  debug?: string; // Only in development
};

// ADDED: Calendar types
export type CalendarEvent = {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  patientId?: string;
  providerId?: string;
  appointmentTypeId?: string;
  status?: string;
  notes?: string;
  [key: string]: any;
};

export type CreateCalendarEventRequest = {
  title: string;
  start: string | Date;
  end: string | Date;
  patientId?: string;
  providerId?: string;
  appointmentTypeId?: string;
  notes?: string;
};

// ADDED: Scheduling types
export type TimeSlot = {
  start: Date;
  end: Date;
  available: boolean;
  providerId: string;
  appointmentTypeId?: string;
  conflictReason?: string;
};

export type AvailabilityQuery = {
  clinicId?: string;
  providerId?: string;
  appointmentTypeId: string;
  date: Date;
  excludeAppointmentId?: string;
};

// ADDED: Utility types for better type safety
export type ID = string;
export type DateString = string;
export type TimestampString = string;

// ADDED: Status enums for better type safety
export const ContactStatus = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  CONVERTED: 'converted',
  CLOSED: 'closed',
  DELETED: 'deleted',
  MERGED: 'merged'
} as const;

export const AppointmentStatus = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
} as const;

export const UserRole = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  DENTIST: 'dentist',
  ASSISTANT: 'assistant'
} as const;