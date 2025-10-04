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
  role: 'super_admin' | 'admin' | 'manager' | 'dentist' | 'hygienist' | 'receptionist' | 'lab_technician' | 'assistant';
  clinic?: string;
  isActive?: boolean;
  lastLogin?: string | Date;
  mfaEnabled?: boolean;
  mfaSecret?: string;
  mfaBackupCodes?: string[];
  phone?: string;
  phoneVerified?: boolean;
  passwordHistory?: Array<{
    password: string;
    changedAt: Date;
  }>;
  passwordChangedAt?: Date;
  passwordExpiresAt?: Date;
  forcePasswordChange?: boolean;
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
  priority?: 'low' | 'normal' | 'high';
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
  limit?: number;
  pageSize?: number; // Deprecated: use limit instead
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

// ADDED: CreatePatientDTO to enforce required fields for patient creation, aligning with backend model.
export type CreatePatientDTO = {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string; // Required by the backend.
  dateOfBirth?: string | Date;
  gender?: 'male' | 'female' | 'other';
  cpf?: string;
  address: { // The address object is required, with zipCode being a minimal requirement.
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode: string;
  };
  clinic?: string;
};

// UPDATED: Patient type to build upon CreatePatientDTO.
export type Patient = CreatePatientDTO & {
  id?: string;
  _id?: string;
  fullName?: string; // computed from firstName + lastName
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
  insurance?: {
    primary?: {
      provider?: string;
      policyNumber?: string;
      groupNumber?: string;
      subscriberName?: string;
      subscriberRelationship?: 'self' | 'spouse' | 'child' | 'other';
      effectiveDate?: string | Date;
      expirationDate?: string | Date;
    };
    secondary?: {
      provider?: string;
      policyNumber?: string;
      groupNumber?: string;
      subscriberName?: string;
      subscriberRelationship?: 'self' | 'spouse' | 'child' | 'other';
      effectiveDate?: string | Date;
      expirationDate?: string | Date;
    };
  };
  familyMembers?: string[] | Patient[];
  photoUrl?: string;
  consentForms?: Array<{
    formType: string;
    signedAt: string | Date;
    signatureUrl?: string;
    documentUrl?: string;
    version?: string;
  }>;
  status?: 'active' | 'inactive';
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
};

// ADDED: CreateAppointmentDTO to enforce required fields for appointment creation.
export type CreateAppointmentDTO = {
  patient: string | Patient;
  clinic: string | Clinic;
  provider: string | Provider;
  appointmentType: string | AppointmentType;
  scheduledStart: string | Date;
  scheduledEnd: string | Date;
  status: 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  priority: 'routine' | 'urgent' | 'emergency';
  preferredContactMethod: 'phone' | 'email' | 'sms' | 'whatsapp';
  syncStatus: 'synced' | 'pending' | 'error';
  notes?: string;
  privateNotes?: string;
  operatory?: string;
  colorCode?: string;
  treatmentDuration?: number;
  isRecurring?: boolean;
  recurringPattern?: {
    frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    interval?: number;
    endDate?: Date;
    occurrences?: number;
  };
};

// UPDATED: Appointment type to build upon CreateAppointmentDTO.
export type Appointment = Omit<CreateAppointmentDTO, 'operatory' | 'colorCode' | 'treatmentDuration' | 'isRecurring' | 'recurringPattern'> & {
  id?: string;
  _id?: string;
  actualStart?: string | Date;
  actualEnd?: string | Date;
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
  operatory?: string;
  room?: string;
  colorCode?: string;
  treatmentDuration?: number;
  isRecurring?: boolean;
  recurringPattern?: {
    frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    interval?: number;
    endDate?: Date;
    occurrences?: number;
  };
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
  languagePreference?: string;
  patientSatisfactionScore?: number;
  patientFeedback?: string;
  noShowReason?: string;
  externalId?: string;
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
  [key:string]: any;
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

// ADDED: WorkingHours type for clinic and provider schedules
export type WorkingHours = { [key: string]: { start: string; end: string; isWorking: boolean; }; };

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
  HYGIENIST: 'hygienist',
  RECEPTIONIST: 'receptionist',
  LAB_TECHNICIAN: 'lab_technician',
  ASSISTANT: 'assistant'
} as const;

// ADDED: Medical History types
export type MedicalHistory = {
  id?: string;
  _id?: string;
  patient: string | Patient;
  clinic: string | Clinic;
  recordDate: string | Date;
  chiefComplaint?: string;
  presentIllness?: string;
  pastMedicalHistory?: string[];
  pastDentalHistory?: string[];
  medications?: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
    startDate?: string | Date;
    endDate?: string | Date;
  }>;
  allergies?: Array<{
    allergen: string;
    reaction: string;
    severity: 'mild' | 'moderate' | 'severe';
  }>;
  chronicConditions?: string[];
  surgicalHistory?: Array<{
    procedure: string;
    date: string | Date;
    notes?: string;
  }>;
  familyHistory?: string[];
  socialHistory?: {
    smoking?: 'never' | 'former' | 'current';
    alcohol?: 'never' | 'occasional' | 'regular';
    occupation?: string;
  };
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
  };
  recordedBy: string | User;
  notes?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

// ADDED: Insurance types
export type Insurance = {
  id?: string;
  _id?: string;
  patient: string | Patient;
  clinic: string | Clinic;
  type: 'primary' | 'secondary';
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  subscriberName: string;
  subscriberRelationship: 'self' | 'spouse' | 'child' | 'other';
  subscriberDOB?: string | Date;
  effectiveDate: string | Date;
  expirationDate?: string | Date;
  coverageDetails?: {
    annualMaximum?: number;
    deductible?: number;
    deductibleMet?: number;
    coinsurance?: number;
    copay?: number;
  };
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

// ADDED: Treatment Plan types
export type TreatmentPlan = {
  id?: string;
  _id?: string;
  patient: string | Patient;
  clinic: string | Clinic;
  provider: string | Provider;
  title: string;
  description?: string;
  status: 'draft' | 'proposed' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  phases: Array<{
    phaseNumber: number;
    title: string;
    description?: string;
    procedures: Array<{
      code: string;
      description: string;
      tooth?: string;
      surface?: string;
      cost: number;
      insuranceCoverage?: number;
      patientCost?: number;
    }>;
    estimatedDuration?: number;
    status: 'pending' | 'in_progress' | 'completed';
    startDate?: string | Date;
    completedDate?: string | Date;
  }>;
  totalCost: number;
  totalInsuranceCoverage: number;
  totalPatientCost: number;
  acceptedAt?: string | Date;
  acceptedBy?: string;
  notes?: string;
  createdBy: string | User;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

// ADDED: Clinical Note types
export type ClinicalNote = {
  id?: string;
  _id?: string;
  patient: string | Patient;
  clinic: string | Clinic;
  provider: string | Provider;
  appointment?: string | Appointment;
  noteType: 'soap' | 'progress' | 'consultation' | 'procedure' | 'other';
  template?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  content?: string;
  attachments?: Array<{
    url: string;
    type: string;
    filename: string;
  }>;
  signature?: {
    signedBy: string | User;
    signedAt: string | Date;
    signatureUrl?: string;
  };
  isLocked: boolean;
  createdBy: string | User;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

// ADDED: Prescription types
export type Prescription = {
  id?: string;
  _id?: string;
  patient: string | Patient;
  clinic: string | Clinic;
  provider: string | Provider;
  appointment?: string | Appointment;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    instructions?: string;
  }>;
  diagnosis?: string;
  notes?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  prescribedDate: string | Date;
  expirationDate?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

// ADDED: Dental Chart types
export type DentalChart = {
  id?: string;
  _id?: string;
  patient: string | Patient;
  clinic: string | Clinic;
  provider: string | Provider;
  chartDate: string | Date;
  numberingSystem: 'fdi' | 'universal';
  teeth: Array<{
    toothNumber: string;
    conditions: Array<{
      type: 'caries' | 'filling' | 'crown' | 'bridge' | 'implant' | 'extraction' | 'root_canal' | 'missing' | 'other';
      surface?: string;
      status: 'existing' | 'planned' | 'completed';
      notes?: string;
      date?: string | Date;
    }>;
  }>;
  periodontal?: {
    probingDepths?: Record<string, number[]>;
    bleeding?: Record<string, boolean[]>;
    recession?: Record<string, number[]>;
  };
  notes?: string;
  version: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

// ADDED: Consent Form types
export type ConsentForm = {
  id?: string;
  _id?: string;
  patient: string | Patient;
  clinic: string | Clinic;
  formType: 'treatment_consent' | 'anesthesia_consent' | 'privacy_policy' | 'financial_agreement' | 'photo_release' | 'other';
  title: string;
  content: string;
  version: string;
  signedAt?: string | Date;
  signedBy?: string;
  signatureUrl?: string;
  witnessName?: string;
  witnessSignature?: string;
  status: 'pending' | 'signed' | 'declined' | 'expired';
  expirationDate?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

// ADDED: Audit Log types
// ADDED: Session types
export type Session = {
  id?: string;
  _id?: string;
  user: string | User;
  refreshToken?: string;
  deviceInfo: {
    userAgent: string;
    browser?: string;
    os?: string;
    device?: string;
  };
  ipAddress: string;
  lastActivity: string | Date;
  expiresAt: string | Date;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type AuditLog = {
  id?: string;
  _id?: string;
  user?: string | User;
  action: 'login' | 'logout' | 'create' | 'read' | 'update' | 'delete' | 'failed_login' | 'password_change' | 'mfa_setup' | 'mfa_disable' | 'export' | 'import';
  resource: string;
  resourceId?: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  ipAddress: string;
  userAgent?: string;
  statusCode?: number;
  changes?: {
    before?: any;
    after?: any;
  };
  metadata?: Record<string, any>;
  clinic?: string | Clinic;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type CreateConsentFormDTO = {
  patient: string;
  formType: 'treatment_consent' | 'anesthesia_consent' | 'privacy_policy' | 'financial_agreement' | 'photo_release' | 'other';
  title: string;
  content: string;
  version?: string;
  expirationDate?: string | Date;
};

export type CreateDentalChartDTO = {
  patient: string;
  provider: string;
  chartDate?: string | Date;
  numberingSystem?: 'fdi' | 'universal';
  teeth?: Array<{
    toothNumber: string;
    conditions: Array<{
      type: 'caries' | 'filling' | 'crown' | 'bridge' | 'implant' | 'extraction' | 'root_canal' | 'missing' | 'other';
      surface?: string;
      status?: 'existing' | 'planned' | 'completed';
      notes?: string;
      date?: string | Date;
    }>;
  }>;
  periodontal?: {
    probingDepths?: Record<string, number[]>;
    bleeding?: Record<string, boolean[]>;
    recession?: Record<string, number[]>;
  };
  notes?: string;
};

export type CreatePrescriptionDTO = {
  patient: string;
  provider: string;
  appointment?: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    instructions?: string;
  }>;
  diagnosis?: string;
  notes?: string;
  prescribedDate?: string | Date;
  expirationDate?: string | Date;
};

export type CreateClinicalNoteDTO = {
  patient: string;
  provider: string;
  appointment?: string;
  noteType: 'soap' | 'progress' | 'consultation' | 'procedure' | 'other';
  template?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  content?: string;
  attachments?: Array<{
    url: string;
    type: string;
    filename: string;
  }>;
};

export type CreateTreatmentPlanDTO = {
  patient: string;
  provider: string;
  title: string;
  description?: string;
  phases: Array<{
    phaseNumber: number;
    title: string;
    description?: string;
    procedures: Array<{
      code: string;
      description: string;
      tooth?: string;
      surface?: string;
      cost: number;
      insuranceCoverage?: number;
    }>;
    estimatedDuration?: number;
  }>;
  notes?: string;
};

export type CreateInsuranceDTO = {
  patient: string;
  type: 'primary' | 'secondary';
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  subscriberName: string;
  subscriberRelationship: 'self' | 'spouse' | 'child' | 'other';
  subscriberDOB?: string | Date;
  effectiveDate: string | Date;
  expirationDate?: string | Date;
  coverageDetails?: {
    annualMaximum?: number;
    deductible?: number;
    deductibleMet?: number;
    coinsurance?: number;
    copay?: number;
  };
};

export type CreateMedicalHistoryDTO = {
  patient: string;
  recordDate?: string | Date;
  chiefComplaint?: string;
  presentIllness?: string;
  pastMedicalHistory?: string[];
  pastDentalHistory?: string[];
  medications?: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
    startDate?: string | Date;
    endDate?: string | Date;
  }>;
  allergies?: Array<{
    allergen: string;
    reaction: string;
    severity?: 'mild' | 'moderate' | 'severe';
  }>;
  chronicConditions?: string[];
  surgicalHistory?: Array<{
    procedure: string;
    date: string | Date;
    notes?: string;
  }>;
  familyHistory?: string[];
  socialHistory?: {
    smoking?: 'never' | 'former' | 'current';
    alcohol?: 'never' | 'occasional' | 'regular';
    occupation?: string;
  };
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
  };
  notes?: string;
};
