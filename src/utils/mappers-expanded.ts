import { Patient, Clinic, Contact, Appointment, AppointmentType, Provider, User } from '../types/api';

// FrontendPatient is the type used in the frontend components
// with optional fields for flexibility
interface FrontendPatient {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string | Date;
  birthDate?: string | Date;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  cpf?: string;
  rg?: string;
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
  clinic?: string | Clinic;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
}

type BackendPatient = Omit<FrontendPatient, 'firstName' | 'lastName' | 'dateOfBirth' | 'fullName' | 'birthDate'> & {
  name: string;
  birthDate: string;
};

// Appointment mappers
interface FrontendAppointment {
  _id?: string;
  id?: string;
  patient: string | Patient;
  clinic: string | Clinic;
  provider: string | Provider;
  appointmentType: string | AppointmentType;
  scheduledStart: string | Date;
  scheduledEnd: string | Date;
  actualStart?: string | Date;
  actualEnd?: string | Date;
  status: 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
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
}

type BackendAppointment = Omit<FrontendAppointment, 'id'> & {
  _id?: string;
};

// Contact mappers
interface FrontendContact {
  _id?: string;
  id?: string;
  name?: string;
  email: string;
  clinic: string | Clinic;
  specialty?: string;
  phone?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed' | 'deleted' | 'merged';
  source?: 'website_contact_form' | 'phone' | 'email' | 'referral' | 'social_media' | 'advertisement' | string;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  assignedTo?: string | User;
  assignedToClinic?: string;
  followUpDate?: string | Date | null;
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
  tags?: string[];
  customFields?: Record<string, any>;
  deletedAt?: string | Date;
  deletedBy?: string;
  mergedInto?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
}

type BackendContact = Omit<FrontendContact, 'id'> & {
  _id?: string;
};

// Provider mappers
interface FrontendProvider {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  clinic?: string | Clinic;
  phone?: string;
  specialties?: string[];
  license?: string;
  isActive?: boolean;
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
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
}

type BackendProvider = Omit<FrontendProvider, 'id'> & {
  _id?: string;
};

export const toBackendPatient = (patient: FrontendPatient | Patient): Partial<BackendPatient> => {
  const dateValue = patient.dateOfBirth || patient.birthDate;
  let birthDate: string | undefined;
  if (dateValue) {
    if (typeof dateValue === 'string') {
      birthDate = dateValue;
    } else {
      birthDate = dateValue.toISOString();
    }
  }

  const backendPatient: Partial<BackendPatient> = {
    ...patient,
    name: patient.fullName || `${patient.firstName || ''} ${patient.lastName || ''}`.trim(),
    birthDate,
  };

  delete (backendPatient as Partial<FrontendPatient>).firstName;
  delete (backendPatient as Partial<FrontendPatient>).lastName;
  delete (backendPatient as Partial<FrontendPatient>).dateOfBirth;
  delete (backendPatient as Partial<FrontendPatient>).fullName;

  return backendPatient;
};

export const fromBackendPatient = (backendPatient: BackendPatient): FrontendPatient => {
  const fullName = backendPatient.name;
  const nameParts = fullName?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    ...backendPatient,
    id: backendPatient._id,
    firstName,
    lastName,
    fullName,
    dateOfBirth: backendPatient.birthDate ? new Date(backendPatient.birthDate) : undefined,
  };
};

export const toBackendAppointment = (appointment: FrontendAppointment): Partial<BackendAppointment> => {
  const backendAppointment: Partial<BackendAppointment> = {
    ...appointment,
    patient: typeof appointment.patient === 'object' ? appointment.patient._id || appointment.patient.id : appointment.patient,
    clinic: typeof appointment.clinic === 'object' ? appointment.clinic._id || appointment.clinic.id : appointment.clinic,
    provider: typeof appointment.provider === 'object' ? appointment.provider._id || appointment.provider.id : appointment.provider,
    appointmentType: typeof appointment.appointmentType === 'object' ? appointment.appointmentType._id || appointment.appointmentType.id : appointment.appointmentType,
    scheduledStart: appointment.scheduledStart instanceof Date ? appointment.scheduledStart.toISOString() : appointment.scheduledStart,
    scheduledEnd: appointment.scheduledEnd instanceof Date ? appointment.scheduledEnd.toISOString() : appointment.scheduledEnd,
    actualStart: appointment.actualStart instanceof Date ? appointment.actualStart.toISOString() : appointment.actualStart,
    actualEnd: appointment.actualEnd instanceof Date ? appointment.actualEnd.toISOString() : appointment.actualEnd,
  };

  delete (backendAppointment as any).id;
  return backendAppointment;
};

export const fromBackendAppointment = (backendAppointment: BackendAppointment): FrontendAppointment => {
  return {
    ...backendAppointment,
    id: backendAppointment._id,
    scheduledStart: backendAppointment.scheduledStart ? new Date(backendAppointment.scheduledStart as string) : new Date(),
    scheduledEnd: backendAppointment.scheduledEnd ? new Date(backendAppointment.scheduledEnd as string) : new Date(),
    actualStart: backendAppointment.actualStart ? new Date(backendAppointment.actualStart as string) : undefined,
    actualEnd: backendAppointment.actualEnd ? new Date(backendAppointment.actualEnd as string) : undefined,
    // Provide defaults for required fields
    patient: backendAppointment.patient || '',
    clinic: backendAppointment.clinic || '',
    provider: backendAppointment.provider || '',
    appointmentType: backendAppointment.appointmentType || '',
    status: backendAppointment.status || 'scheduled',
    remindersSent: backendAppointment.remindersSent || {
      confirmation: false,
      reminder24h: false,
      reminder2h: false,
      customReminder: false
    },
    followUpRequired: backendAppointment.followUpRequired ?? false,
    billingStatus: backendAppointment.billingStatus || 'pending',
    preferredContactMethod: backendAppointment.preferredContactMethod || 'phone',
    syncStatus: backendAppointment.syncStatus || 'synced',
    priority: backendAppointment.priority || 'routine',
  };
};

export const toBackendContact = (contact: FrontendContact): Partial<BackendContact> => {
  const backendContact: Partial<BackendContact> = {
    ...contact,
    clinic: typeof contact.clinic === 'object' ? contact.clinic._id || contact.clinic.id : contact.clinic,
    assignedTo: typeof contact.assignedTo === 'object' ? contact.assignedTo._id || contact.assignedTo.id : contact.assignedTo,
    followUpDate: contact.followUpDate instanceof Date ? contact.followUpDate.toISOString() : contact.followUpDate,
    lastContactedAt: contact.lastContactedAt instanceof Date ? contact.lastContactedAt.toISOString() : contact.lastContactedAt,
    conversionDetails: contact.conversionDetails ? {
      ...contact.conversionDetails,
      convertedAt: contact.conversionDetails.convertedAt instanceof Date ? contact.conversionDetails.convertedAt.toISOString() : contact.conversionDetails.convertedAt,
      convertedBy: typeof contact.conversionDetails.convertedBy === 'object' ? contact.conversionDetails.convertedBy._id || contact.conversionDetails.convertedBy.id : contact.conversionDetails.convertedBy,
    } : undefined,
  };

  delete (backendContact as any).id;
  return backendContact;
};

export const fromBackendContact = (backendContact: BackendContact): FrontendContact => {
  return {
    ...backendContact,
    id: backendContact._id,
    name: backendContact.name || 'Contato sem nome',
    email: backendContact.email || '',
    clinic: backendContact.clinic || '',
    followUpDate: backendContact.followUpDate ? new Date(backendContact.followUpDate) : null,
    lastContactedAt: backendContact.lastContactedAt ? new Date(backendContact.lastContactedAt) : undefined,
    conversionDetails: backendContact.conversionDetails ? {
      ...backendContact.conversionDetails,
      convertedAt: backendContact.conversionDetails.convertedAt ? new Date(backendContact.conversionDetails.convertedAt) : undefined,
    } : undefined,
  };
};

export const toBackendProvider = (provider: FrontendProvider): Partial<BackendProvider> => {
  const backendProvider: Partial<BackendProvider> = {
    ...provider,
    clinic: typeof provider.clinic === 'object' ? provider.clinic._id || provider.clinic.id : provider.clinic,
  };

  delete (backendProvider as any).id;
  return backendProvider;
};

export const fromBackendProvider = (backendProvider: BackendProvider): FrontendProvider => {
  return {
    ...backendProvider,
    id: backendProvider._id,
  };
};

export {};
