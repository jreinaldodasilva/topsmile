// backend/src/models/Appointment.ts - Enhanced version
import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
    patient: mongoose.Types.ObjectId;
    clinic: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    appointmentType: mongoose.Types.ObjectId;
    scheduledStart: Date;
    scheduledEnd: Date;
    actualStart?: Date;
    actualEnd?: Date;
    status: 'scheduled' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
    priority: 'routine' | 'urgent' | 'emergency';
    notes?: string;
    privateNotes?: string; // Staff-only notes
    remindersSent: {
        confirmation: boolean;
        reminder24h: boolean;
        reminder2h: boolean;
    };
    cancellationReason?: string;
    rescheduleHistory: Array<{
        oldDate: Date;
        newDate: Date;
        reason: string;
        rescheduleBy: 'patient' | 'clinic';
        timestamp: Date;
    }>;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Paciente é obrigatório']
    },
    clinic: {
        type: Schema.Types.ObjectId,
        ref: 'Clinic',
        required: [true, 'Clínica é obrigatória']
    },
    provider: {
        type: Schema.Types.ObjectId,
        ref: 'Provider',
        required: [true, 'Profissional é obrigatório']
    },
    appointmentType: {
        type: Schema.Types.ObjectId,
        ref: 'AppointmentType',
        required: [true, 'Tipo de agendamento é obrigatório']
    },
    scheduledStart: {
        type: Date,
        required: [true, 'Data/hora de início é obrigatória']
    },
    scheduledEnd: {
        type: Date,
        required: [true, 'Data/hora de término é obrigatória']
    },
    actualStart: Date,
    actualEnd: Date,
    status: {
        type: String,
        enum: ['scheduled', 'confirmed', 'checked_in', 'in_progress', 'completed', 'cancelled', 'no_show'],
        default: 'scheduled'
    },
    priority: {
        type: String,
        enum: ['routine', 'urgent', 'emergency'],
        default: 'routine'
    },
    notes: {
        type: String,
        maxlength: [500, 'Observações devem ter no máximo 500 caracteres']
    },
    privateNotes: {
        type: String,
        maxlength: [1000, 'Observações privadas devem ter no máximo 1000 caracteres']
    },
    remindersSent: {
        confirmation: { type: Boolean, default: false },
        reminder24h: { type: Boolean, default: false },
        reminder2h: { type: Boolean, default: false }
    },
    cancellationReason: String,
    rescheduleHistory: [{
        oldDate: { type: Date, required: true },
        newDate: { type: Date, required: true },
        reason: { type: String, required: true },
        rescheduleBy: { 
            type: String, 
            enum: ['patient', 'clinic'], 
            required: true 
        },
        timestamp: { type: Date, default: Date.now }
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete (ret as any).__v;
            return ret;
        }
    }
});

// Indexes for performance
AppointmentSchema.index({ clinic: 1, scheduledStart: 1 });
AppointmentSchema.index({ provider: 1, scheduledStart: 1 });
AppointmentSchema.index({ patient: 1, scheduledStart: 1 });
AppointmentSchema.index({ status: 1, scheduledStart: 1 });
AppointmentSchema.index({ scheduledStart: 1, scheduledEnd: 1 });

// Compound index for availability queries
AppointmentSchema.index({ 
    clinic: 1, 
    provider: 1, 
    scheduledStart: 1, 
    status: 1 
});

export const Appointment = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
