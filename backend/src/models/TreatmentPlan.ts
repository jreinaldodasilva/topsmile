// backend/src/models/TreatmentPlan.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ITreatmentPlan {
    patient: mongoose.Types.ObjectId;
    clinic: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
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
        startDate?: Date;
        completedDate?: Date;
    }>;
    totalCost: number;
    totalInsuranceCoverage: number;
    totalPatientCost: number;
    acceptedAt?: Date;
    acceptedBy?: string;
    notes?: string;
    createdBy: mongoose.Types.ObjectId;
}

const TreatmentPlanSchema = new Schema<ITreatmentPlan & Document>({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: [true, 'Paciente é obrigatório'],
        index: true
    },
    clinic: {
        type: Schema.Types.ObjectId,
        ref: 'Clinic',
        required: [true, 'Clínica é obrigatória'],
        index: true
    },
    provider: {
        type: Schema.Types.ObjectId,
        ref: 'Provider',
        required: [true, 'Profissional é obrigatório']
    },
    title: {
        type: String,
        required: [true, 'Título é obrigatório'],
        trim: true,
        maxlength: [200, 'Título muito longo']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Descrição muito longa']
    },
    status: {
        type: String,
        enum: ['draft', 'proposed', 'accepted', 'in_progress', 'completed', 'cancelled'],
        default: 'draft',
        index: true
    },
    phases: [{
        phaseNumber: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: String,
        procedures: [{
            code: {
                type: String,
                required: true,
                trim: true
            },
            description: {
                type: String,
                required: true
            },
            tooth: String,
            surface: String,
            cost: {
                type: Number,
                required: true,
                min: 0
            },
            insuranceCoverage: {
                type: Number,
                default: 0,
                min: 0
            },
            patientCost: {
                type: Number,
                default: 0,
                min: 0
            }
        }],
        estimatedDuration: Number,
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending'
        },
        startDate: Date,
        completedDate: Date
    }],
    totalCost: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    totalInsuranceCoverage: {
        type: Number,
        default: 0,
        min: 0
    },
    totalPatientCost: {
        type: Number,
        default: 0,
        min: 0
    },
    acceptedAt: Date,
    acceptedBy: String,
    notes: {
        type: String,
        trim: true,
        maxlength: [2000, 'Observações muito longas']
    },
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
            delete (ret as any)._id;
            delete (ret as any).__v;
            return ret;
        }
    }
});

TreatmentPlanSchema.pre('save', function(next) {
    let totalCost = 0;
    let totalInsurance = 0;
    
    this.phases.forEach(phase => {
        phase.procedures.forEach(proc => {
            totalCost += proc.cost;
            totalInsurance += proc.insuranceCoverage || 0;
            proc.patientCost = proc.cost - (proc.insuranceCoverage || 0);
        });
    });
    
    this.totalCost = totalCost;
    this.totalInsuranceCoverage = totalInsurance;
    this.totalPatientCost = totalCost - totalInsurance;
    
    next();
});

TreatmentPlanSchema.index({ patient: 1, status: 1 });
TreatmentPlanSchema.index({ clinic: 1, status: 1 });
TreatmentPlanSchema.index({ provider: 1, status: 1 });

export const TreatmentPlan = mongoose.model<ITreatmentPlan & Document>('TreatmentPlan', TreatmentPlanSchema);
