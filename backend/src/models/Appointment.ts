// backend/src/models/Appointment.ts
import mongoose, { Document, Schema, Types } from 'mongoose';
import { Appointment as IAppointment, AppointmentStatus, UserRole } from '@topsmile/types';
import { baseSchemaFields, baseSchemaOptions } from './base/baseSchema';
import { clinicScopedFields, auditableFields } from './mixins';

const AppointmentSchema = new Schema<IAppointment & Document>({
    ...baseSchemaFields,
    ...clinicScopedFields,
    ...auditableFields,
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Paciente é obrigatório'],
        index: true
    },
    provider: {
        type: Schema.Types.ObjectId,
        ref: 'Provider',
        required: [true, 'Profissional é obrigatório'],
        index: true
    },
    appointmentType: {
        type: Schema.Types.ObjectId,
        ref: 'AppointmentType',
        required: [true, 'Tipo de agendamento é obrigatório'],
        index: true
    },
    scheduledStart: {
        type: Date,
        required: [true, 'Data/hora de início é obrigatória'],
        index: true
    },
    scheduledEnd: {
        type: Date,
        required: [true, 'Data/hora de término é obrigatória'],
        index: true
    },
    actualStart: Date,
    actualEnd: Date,
    status: {
        type: String,
        enum: Object.values(AppointmentStatus),
        default: AppointmentStatus.SCHEDULED,
        index: true
    },
    priority: {
        type: String,
        enum: ['routine', 'urgent', 'emergency'],
        default: 'routine',
        index: true
    },
    notes: {
        type: String,
        maxlength: [1000, 'Observações devem ter no máximo 1000 caracteres']
    },
    privateNotes: {
        type: String,
        maxlength: [2000, 'Observações privadas devem ter no máximo 2000 caracteres']
    },
    remindersSent: {
        confirmation: { type: Boolean, default: false },
        reminder24h: { type: Boolean, default: false },
        reminder2h: { type: Boolean, default: false },
        customReminder: { type: Boolean, default: false }
    },
    cancellationReason: String,
    rescheduleHistory: {
        type: [{
            oldDate: { type: Date, required: true },
            newDate: { type: Date, required: true },
            reason: { type: String, required: true },
            rescheduleBy: {
                type: String,
                enum: ['patient', 'clinic'],
                required: true
            },
            timestamp: { type: Date, default: Date.now },
            rescheduleCount: { type: Number, default: 1 }
        }],
        maxlength: 10 // Limit to 10 entries
    },

    // Enhanced tracking fields
    checkedInAt: Date,
    completedAt: Date,
    duration: {
        type: Number,
        min: 0,
        max: 1440
    },
    waitTime: {
        type: Number,
        min: 0,
        max: 600
    },

    // NEW: Advanced features
    operatory: {
        type: String,
        maxlength: 50,
        index: true
    },
    room: {
        type: String,
        maxlength: 50,
        index: true
    },
    colorCode: {
        type: String,
        maxlength: 7,
        validate: {
            validator: (v: string) => !v || /^#[0-9A-F]{6}$/i.test(v),
            message: 'Código de cor inválido'
        }
    },
    treatmentDuration: {
        type: Number,
        min: 0
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringPattern: {
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'biweekly', 'monthly']
        },
        interval: Number,
        endDate: Date,
        occurrences: Number
    },
    equipment: [{
        type: String,
        maxlength: 100
    }],
    followUpRequired: {
        type: Boolean,
        default: false,
        index: true // For follow-up tracking
    },
    followUpDate: {
        type: Date,
        index: true // For follow-up scheduling
    },
    billingStatus: {
        type: String,
        enum: ['pending', 'billed', 'paid', 'insurance_pending', 'insurance_approved', 'insurance_denied'],
        default: 'pending',
        index: true // For billing queries
    },
    billingAmount: {
        type: Number,
        min: 0
    },
    insuranceInfo: {
        provider: String,
        policyNumber: String,
        groupNumber: String,
        copayAmount: {
            type: Number,
            min: 0
        }
    },

    // Communication preferences
    preferredContactMethod: {
        type: String,
        enum: ['phone', 'email', 'sms', 'whatsapp'],
        default: 'phone'
    },
    languagePreference: {
        type: String,
        default: 'pt-BR'
    },

    // Quality metrics
    patientSatisfactionScore: {
        type: Number,
        min: 1,
        max: 5
    },
    patientFeedback: {
        type: String,
        maxlength: 1000
    },
    noShowReason: String,

    // Integration fields
    externalId: {
        type: String,
        sparse: true,
        index: true
    },
    syncStatus: {
        type: String,
        enum: ['synced', 'pending', 'error'],
        default: 'synced'
    }
}, baseSchemaOptions as any);

// ENHANCED: All original performance indexes plus new ones

// 1. Primary scheduling queries - MOST IMPORTANT
AppointmentSchema.index({ 
    clinic: 1, 
    scheduledStart: 1, 
    status: 1 
}, { 
    name: 'clinic_schedule_status',
    background: true
});

// 2. Provider availability queries - MOST IMPORTANT
AppointmentSchema.index({ 
    provider: 1, 
    scheduledStart: 1, 
    scheduledEnd: 1,
    status: 1 
}, { 
    name: 'provider_availability',
    background: true
});

// Prevent double-booking
AppointmentSchema.index(
    { provider: 1, scheduledStart: 1, scheduledEnd: 1 },
    {
        unique: true,
        partialFilterExpression: { status: { $nin: ['cancelled', 'no_show'] } }
    }
);

// 3. Patient appointment history - HIGH FREQUENCY
AppointmentSchema.index({ 
    patient: 1, 
    scheduledStart: -1, 
    status: 1 
}, { 
    name: 'patient_history',
    background: true
});

// 4. Daily schedule view - HIGH FREQUENCY  
AppointmentSchema.index({ 
    clinic: 1, 
    provider: 1, 
    scheduledStart: 1 
}, { 
    name: 'daily_schedule',
    background: true
});

// 5. Status-based queries - HIGH FREQUENCY
AppointmentSchema.index({ 
    status: 1, 
    scheduledStart: 1,
    clinic: 1
}, { 
    name: 'status_schedule',
    background: true
});

// NEW: Enhanced indexes for advanced features

// 6. Operatory/Room availability queries
AppointmentSchema.index({ 
    clinic: 1,
    operatory: 1,
    scheduledStart: 1, 
    scheduledEnd: 1,
    status: 1
}, { 
    name: 'operatory_availability',
    background: true
});

AppointmentSchema.index({ 
    clinic: 1,
    room: 1,
    scheduledStart: 1, 
    scheduledEnd: 1,
    status: 1
}, { 
    name: 'room_availability',
    background: true
});

// Recurring appointments index
AppointmentSchema.index({ 
    isRecurring: 1,
    'recurringPattern.endDate': 1
}, { 
    name: 'recurring_appointments',
    background: true
});

// 7. Follow-up tracking
AppointmentSchema.index({ 
    followUpRequired: 1,
    followUpDate: 1,
    status: 1
}, { 
    name: 'followup_tracking',
    background: true
});

// 8. Billing queries
AppointmentSchema.index({ 
    clinic: 1,
    billingStatus: 1,
    completedAt: 1
}, { 
    name: 'billing_status',
    background: true
});

// 9. Patient satisfaction tracking
AppointmentSchema.index({ 
    provider: 1,
    patientSatisfactionScore: 1,
    completedAt: -1
}, { 
    name: 'satisfaction_tracking',
    background: true
});

// 10. Integration sync status
AppointmentSchema.index({ 
    syncStatus: 1,
    updatedAt: 1
}, { 
    name: 'sync_status',
    background: true
});

// All original reminder and analytics indexes remain...
AppointmentSchema.index({ 
    scheduledStart: 1,
    status: 1,
    'remindersSent.confirmation': 1
}, { 
    name: 'reminder_queries',
    background: true
});

AppointmentSchema.index({ 
    priority: 1, 
    scheduledStart: 1,
    status: 1
}, { 
    name: 'priority_schedule',
    background: true
});

// ENHANCED: Pre-save middleware with additional features
AppointmentSchema.pre('save', function(this: any, next) {
    // Original validation
    if (this.scheduledStart >= this.scheduledEnd) {
        return next(new Error('Hora de início deve ser anterior à hora de término'));
    }
    
    // NEW: Validate follow-up date
    if (this.followUpRequired && !this.followUpDate) {
        const followUpDate = new Date(this.scheduledEnd);
        followUpDate.setDate(followUpDate.getDate() + 7); // Default 1 week follow-up
        this.followUpDate = followUpDate;
    }
    
    // Original calculations
    if (this.actualStart && this.actualEnd) {
        const start = this.actualStart as Date;
        const end = this.actualEnd as Date;
        this.duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    }

    if (this.checkedInAt && this.actualStart) {
        const start = this.actualStart as Date;
        const checkedIn = this.checkedInAt as Date;
        this.waitTime = Math.round((start.getTime() - checkedIn.getTime()) / (1000 * 60));
    }
    
    // Enhanced status change handling
    if (this.isModified('status')) {
        const now = new Date();
        
        switch (this.status) {
            case 'checked_in':
                if (!this.checkedInAt) this.checkedInAt = now;
                break;
            case 'in_progress':
                if (!this.actualStart) this.actualStart = now;
                break;
            case 'completed':
                if (!this.actualEnd) this.actualEnd = now;
                if (!this.completedAt) this.completedAt = now;
                // Auto-set billing status if not already set
                if (this.billingStatus === 'pending') {
                    this.billingStatus = 'billed';
                }
                break;
            case 'cancelled':
            case 'no_show':
                // Reset billing status for cancelled/no-show appointments
                this.billingStatus = 'pending';
                break;
        }
    }
    
    // NEW: Track reschedule count
    if (this.isModified('rescheduleHistory') && this.rescheduleHistory && this.rescheduleHistory.length > 0) {
        const lastReschedule = this.rescheduleHistory[this.rescheduleHistory.length - 1];
        lastReschedule.rescheduleCount = this.rescheduleHistory.length;
    }
    
    next();
});

// ENHANCED: Extended static methods
interface AppointmentMatchStage {
    clinic: Types.ObjectId;
    scheduledStart: { $gte: Date };
    scheduledEnd: { $lte: Date };
    provider?: Types.ObjectId;
    status?: string | { $nin: string[] };
    room?: string;
    priority?: string;
}

AppointmentSchema.statics.findByTimeRange = function(
    clinicId: string, 
    startDate: Date, 
    endDate: Date, 
    options: { 
        providerId?: string; 
        status?: string; 
        room?: string;
        priority?: string;
        includeCompleted?: boolean;
    } = {}
) {
    const matchStage: AppointmentMatchStage = {
        clinic: new Types.ObjectId(clinicId),
        scheduledStart: { $gte: startDate },
        scheduledEnd: { $lte: endDate }
    };
    
    if (options.providerId) matchStage.provider = new Types.ObjectId(options.providerId);
    if (options.status) matchStage.status = options.status;
    if (options.room) matchStage.room = options.room;
    if (options.priority) matchStage.priority = options.priority;
    
    if (!options.includeCompleted) {
        matchStage.status = { $nin: ['completed', 'cancelled', 'no_show'] };
    }
    
    return this.aggregate([
        { $match: matchStage },
        {
            $lookup: {
                from: 'patients',
                localField: 'patient',
                foreignField: '_id',
                as: 'patientInfo'
            }
        },
        { $unwind: { path: '$patientInfo', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'providers',
                localField: 'provider',
                foreignField: '_id',
                as: 'providerInfo'
            }
        },
        { $unwind: { path: '$providerInfo', preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: 'appointmenttypes',
                localField: 'appointmentType',
                foreignField: '_id',
                as: 'appointmentTypeInfo'
            }
        },
        { $unwind: { path: '$appointmentTypeInfo', preserveNullAndEmptyArrays: true } },
        {
            $project: {
                _id: 1,
                patient: '$patientInfo',
                clinic: 1,
                provider: '$providerInfo',
                appointmentType: '$appointmentTypeInfo',
                scheduledStart: 1,
                scheduledEnd: 1,
                actualStart: 1,
                actualEnd: 1,
                status: 1,
                priority: 1,
                notes: 1,
                privateNotes: 1,
                remindersSent: 1,
                cancellationReason: 1,
                rescheduleHistory: 1,
                checkedInAt: 1,
                completedAt: 1,
                duration: 1,
                waitTime: 1,
                operatory: 1,
                room: 1,
                colorCode: 1,
                treatmentDuration: 1,
                isRecurring: 1,
                recurringPattern: 1,
                equipment: 1,
                followUpRequired: 1,
                followUpDate: 1,
                billingStatus: 1,
                billingAmount: 1,
                insuranceInfo: 1,
                preferredContactMethod: 1,
                languagePreference: 1,
                patientSatisfactionScore: 1,
                patientFeedback: 1,
                noShowReason: 1,
                externalId: 1,
                syncStatus: 1,
                createdBy: 1,
                createdAt: 1,
                updatedAt: 1
            }
        },
        { $sort: { scheduledStart: 1 } }
    ]);
};

interface ConflictQuery {
    provider?: string;
    clinic?: string;
    room?: string;
    _id?: { $ne: string };
    $or: Array<{
        scheduledStart?: { $lt?: Date; $gte?: Date; $lte?: Date };
        scheduledEnd?: { $gt?: Date; $lte?: Date; $gte?: Date };
    }>;
    status: { $nin: string[] };
}

AppointmentSchema.statics.findAvailabilityConflicts = async function(
    clinicId: string, // Added clinicId to ensure room conflicts are within the same clinic
    providerId: string,
    startTime: Date,
    endTime: Date,
    options: {
        excludeAppointmentId?: string;
        checkRoom?: string;
        checkEquipment?: string[];
    } = {}
) {
    const commonOverlapCondition = {
        $or: [
            { scheduledStart: { $lt: endTime, $gte: startTime } }, // Starts during existing appointment
            { scheduledEnd: { $gt: startTime, $lte: endTime } },   // Ends during existing appointment
            { scheduledStart: { $lte: startTime }, scheduledEnd: { $gte: endTime } } // Existing appointment spans new one
        ],
        status: { $nin: ['cancelled', 'no_show'] }
    };

    const providerConflictQuery: ConflictQuery = {
        provider: providerId,
        ...commonOverlapCondition
    };

    if (options.excludeAppointmentId) {
        providerConflictQuery._id = { $ne: options.excludeAppointmentId };
    }

    const roomConflictQuery: ConflictQuery = {
        clinic: clinicId,
        room: options.checkRoom,
        ...commonOverlapCondition
    };

    if (options.excludeAppointmentId) {
        roomConflictQuery._id = { $ne: options.excludeAppointmentId };
    }

    // Find conflicts for the provider OR conflicts for the room (if specified)
    const combinedQuery = options.checkRoom
        ? { $or: [providerConflictQuery, roomConflictQuery] }
        : providerConflictQuery;

    return this.find(combinedQuery)
        .populate('patient', 'name')
        .populate('provider', 'name')
        .populate('appointmentType', 'name')
        .sort({ scheduledStart: 1 });
};

// NEW: Advanced query methods

interface FollowUpQuery {
    followUpRequired: boolean;
    followUpDate: { $lte: Date };
    status: string;
    clinic?: string;
}

AppointmentSchema.statics.findPendingFollowUps = function(clinicId?: string) {
    const query: FollowUpQuery = {
        followUpRequired: true,
        followUpDate: { $lte: new Date() },
        status: 'completed'
    };
    
    if (clinicId) query.clinic = clinicId;
    
    return this.find(query)
        .populate('patient', 'name phone email')
        .populate('provider', 'name')
        .sort({ followUpDate: 1 });
};

interface BillingQuery {
    clinic: string;
    status: string;
    billingStatus: string;
    completedAt?: {
        $gte?: Date;
        $lte?: Date;
    };
}

AppointmentSchema.statics.findBillingPending = function(clinicId: string, options: {
    status?: 'pending' | 'billed' | 'insurance_pending';
    dateFrom?: Date;
    dateTo?: Date;
} = {}) {
    const query: BillingQuery = {
        clinic: clinicId,
        status: 'completed',
        billingStatus: options.status || 'pending'
    };
    
    if (options.dateFrom || options.dateTo) {
        query.completedAt = {};
        if (options.dateFrom) query.completedAt.$gte = options.dateFrom;
        if (options.dateTo) query.completedAt.$lte = options.dateTo;
    }
    
    return this.find(query)
        .populate('patient', 'name insuranceInfo')
        .populate('provider', 'name')
        .populate('appointmentType', 'name')
        .sort({ completedAt: -1 });
};

interface SatisfactionMatchStage {
    provider: Types.ObjectId;
    patientSatisfactionScore: { $exists: boolean; $ne: null };
    completedAt?: {
        $gte?: Date;
        $lte?: Date;
    };
}

AppointmentSchema.statics.getProviderSatisfactionStats = function(
    providerId: string, 
    dateFrom?: Date, 
    dateTo?: Date
) {
    const matchStage: SatisfactionMatchStage = {
        provider: new Types.ObjectId(providerId),
        patientSatisfactionScore: { $exists: true, $ne: null }
    };
    
    if (dateFrom || dateTo) {
        matchStage.completedAt = {};
        if (dateFrom) matchStage.completedAt.$gte = dateFrom;
        if (dateTo) matchStage.completedAt.$lte = dateTo;
    }
    
    return this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: null,
                averageScore: { $avg: '$patientSatisfactionScore' },
                totalRatings: { $sum: 1 },
                scoreDistribution: {
                    $push: '$patientSatisfactionScore'
                }
            }
        },
        {
            $addFields: {
                scoreBreakdown: {
                    excellent: {
                        $size: {
                            $filter: {
                                input: '$scoreDistribution',
                                cond: { $eq: ['$$this', 5] }
                            }
                        }
                    },
                    good: {
                        $size: {
                            $filter: {
                                input: '$scoreDistribution',
                                cond: { $eq: ['$$this', 4] }
                            }
                        }
                    },
                    average: {
                        $size: {
                            $filter: {
                                input: '$scoreDistribution',
                                cond: { $eq: ['$$this', 3] }
                            }
                        }
                    },
                    poor: {
                        $size: {
                            $filter: {
                                input: '$scoreDistribution',
                                cond: { $lte: ['$$this', 2] }
                            }
                        }
                    }
                }
            }
        }
    ]);
};

AppointmentSchema.statics.getClinicAnalytics = function(
    clinicId: string,
    dateFrom: Date,
    dateTo: Date
) {
    return this.aggregate([
        {
            $match: {
                clinic: new Types.ObjectId(clinicId),
                scheduledStart: { $gte: dateFrom, $lte: dateTo }
            }
        },
        {
            $group: {
                _id: null,
                totalAppointments: { $sum: 1 },
                completedAppointments: {
                    $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                },
                cancelledAppointments: {
                    $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] }
                },
                noShowAppointments: {
                    $sum: { $cond: [{ $eq: ['$status', 'no_show'] }, 1, 0] }
                },
                averageWaitTime: { $avg: '$waitTime' },
                averageDuration: { $avg: '$duration' },
                totalRevenue: {
                    $sum: {
                        $cond: [
                            { $and: [
                                { $eq: ['$status', 'completed'] },
                                { $in: ['$billingStatus', ['paid', 'insurance_approved']] }
                            ]},
                            '$billingAmount',
                            0
                        ]
                    }
                }
            }
        },
        {
            $addFields: {
                completionRate: {
                    $multiply: [
                        { $divide: ['$completedAppointments', '$totalAppointments'] },
                        100
                    ]
                },
                noShowRate: {
                    $multiply: [
                        { $divide: ['$noShowAppointments', '$totalAppointments'] },
                        100
                    ]
                }
            }
        }
    ]);
};

export const Appointment = mongoose.model<IAppointment & Document>('Appointment', AppointmentSchema);
