export type ApiResult<T = any> = {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Array<{
        msg: string;
        param: string;
    }>;
};
export type Pagination = {
    page?: number;
    limit?: number;
    total: number;
    pages?: number;
};
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
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    [key: string]: any;
};
export type ContactListResponse = {
    contacts: Contact[];
    total: number;
    page: number;
    pages: number;
    limit: number;
};
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
export type CreatePatientDTO = {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    dateOfBirth?: string | Date;
    gender?: 'male' | 'female' | 'other';
    cpf?: string;
    address: {
        street?: string;
        number?: string;
        neighborhood?: string;
        city?: string;
        state?: string;
        zipCode: string;
    };
    clinic?: string;
};
export type Patient = CreatePatientDTO & {
    id?: string;
    _id?: string;
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
    status?: 'active' | 'inactive';
    createdAt?: string | Date;
    updatedAt?: string | Date;
    [key: string]: any;
};
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
};
export type Appointment = CreateAppointmentDTO & {
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
export type AppointmentType = {
    id?: string;
    _id?: string;
    name?: string;
    description?: string;
    duration?: number;
    price?: number;
    color?: string;
    category?: 'consultation' | 'cleaning' | 'treatment' | 'surgery' | 'emergency';
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
export type DashboardStats = {
    contacts: {
        total: number;
        byStatus: Array<{
            _id: string;
            count: number;
        }>;
        bySource: Array<{
            _id: string;
            count: number;
        }>;
        recentCount: number;
        monthlyTrend: Array<{
            month: string;
            count: number;
        }>;
    };
    system?: {
        uptime: number;
        memoryUsage: number;
        databaseStatus: string;
    };
    summary: {
        totalContacts: number;
        newThisWeek: number;
        conversionRate: number;
        revenue?: string;
    };
    user: {
        name?: string;
        role?: string;
        clinicId?: string;
        lastActivity: string;
    };
    [key: string]: any;
};
export type FormField = {
    name: string;
    label?: string;
    type?: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'email' | 'phone' | 'number';
    required?: boolean;
    options?: Array<{
        label: string;
        value: string;
    }>;
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
export type CreateFormResponse = {
    templateId: string;
    patientId: string;
    answers: Record<string, any>;
};
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
export type BatchUpdateResult = {
    modifiedCount: number;
    matchedCount: number;
};
export type DuplicateContactGroup = {
    email: string;
    contacts: Contact[];
    count: number;
};
export type ValidationError = {
    msg: string;
    param: string;
    value?: any;
};
export type ApiError = {
    success: false;
    message: string;
    errors?: ValidationError[];
    debug?: string;
};
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
export type WorkingHours = {
    [key: string]: {
        start: string;
        end: string;
        isWorking: boolean;
    };
};
export type ID = string;
export type DateString = string;
export type TimestampString = string;
export declare const ContactStatus: {
    readonly NEW: "new";
    readonly CONTACTED: "contacted";
    readonly QUALIFIED: "qualified";
    readonly CONVERTED: "converted";
    readonly CLOSED: "closed";
    readonly DELETED: "deleted";
    readonly MERGED: "merged";
};
export declare const AppointmentStatus: {
    readonly SCHEDULED: "scheduled";
    readonly CONFIRMED: "confirmed";
    readonly CHECKED_IN: "checked_in";
    readonly IN_PROGRESS: "in_progress";
    readonly COMPLETED: "completed";
    readonly CANCELLED: "cancelled";
    readonly NO_SHOW: "no_show";
};
export declare const UserRole: {
    readonly SUPER_ADMIN: "super_admin";
    readonly ADMIN: "admin";
    readonly MANAGER: "manager";
    readonly DENTIST: "dentist";
    readonly ASSISTANT: "assistant";
};
