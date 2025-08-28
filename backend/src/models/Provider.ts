// ============================================================================
// backend/src/models/Provider.ts - New model for dentists/hygienists
// ============================================================================
import mongoose, { Document, Schema } from 'mongoose';


export interface IProvider extends Document {
    clinic: mongoose.Types.ObjectId;
    user?: mongoose.Types.ObjectId; // Link to User if provider has system access
    name: string;
    email?: string;
    phone?: string;
    specialties: string[]; // ['general_dentistry', 'orthodontics', 'oral_surgery']
    licenseNumber?: string;
    isActive: boolean;
    workingHours: {
        monday: { start: string; end: string; isWorking: boolean };
        tuesday: { start: string; end: string; isWorking: boolean };
        wednesday: { start: string; end: string; isWorking: boolean };
        thursday: { start: string; end: string; isWorking: boolean };
        friday: { start: string; end: string; isWorking: boolean };
        saturday: { start: string; end: string; isWorking: boolean };
        sunday: { start: string; end: string; isWorking: boolean };
    };
    timeZone: string;
    bufferTimeBefore: number; // minutes
    bufferTimeAfter: number; // minutes
    appointmentTypes: mongoose.Types.ObjectId[]; // What services this provider offers
    createdAt: Date;
    updatedAt: Date;
}

const ProviderSchema = new Schema<IProvider>({
    clinic: {
        type: Schema.Types.ObjectId,
        ref: 'Clinic',
        required: [true, 'Clínica é obrigatória']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true,
        maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(email: string) {
                return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: 'E-mail inválido'
        }
    },
    phone: {
        type: String,
        trim: true
    },
    specialties: [{
        type: String,
        enum: [
            'general_dentistry',
            'orthodontics', 
            'oral_surgery',
            'periodontics',
            'endodontics',
            'prosthodontics',
            'pediatric_dentistry',
            'oral_pathology',
            'dental_hygiene'
        ]
    }],
    licenseNumber: String,
    isActive: {
        type: Boolean,
        default: true
    },
    workingHours: {
        monday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
        tuesday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
        wednesday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
        thursday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
        friday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
        saturday: { start: String, end: String, isWorking: { type: Boolean, default: false } },
        sunday: { start: String, end: String, isWorking: { type: Boolean, default: false } }
    },
    timeZone: {
        type: String,
        default: 'America/Sao_Paulo'
    },
    bufferTimeBefore: {
        type: Number,
        default: 15,
        min: [0, 'Tempo de intervalo antes deve ser positivo'],
        max: [60, 'Tempo de intervalo antes deve ser no máximo 60 minutos']
    },
    bufferTimeAfter: {
        type: Number,
        default: 15,
        min: [0, 'Tempo de intervalo depois deve ser positivo'],
        max: [60, 'Tempo de intervalo depois deve ser no máximo 60 minutos']
    },
    appointmentTypes: [{
        type: Schema.Types.ObjectId,
        ref: 'AppointmentType'
    }]
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

// Indexes
ProviderSchema.index({ clinic: 1, isActive: 1 });
ProviderSchema.index({ email: 1 });

export const Provider = mongoose.model<IProvider>('Provider', ProviderSchema);
