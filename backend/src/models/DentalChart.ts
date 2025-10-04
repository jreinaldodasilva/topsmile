// backend/src/models/DentalChart.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IDentalChart {
    patient: mongoose.Types.ObjectId;
    clinic: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    chartDate: Date;
    numberingSystem: 'fdi' | 'universal';
    teeth: Array<{
        toothNumber: string;
        conditions: Array<{
            type: 'caries' | 'filling' | 'crown' | 'bridge' | 'implant' | 'extraction' | 'root_canal' | 'missing' | 'other';
            surface?: string;
            status: 'existing' | 'planned' | 'completed';
            notes?: string;
            date?: Date;
        }>;
    }>;
    periodontal?: {
        probingDepths?: Record<string, number[]>;
        bleeding?: Record<string, boolean[]>;
        recession?: Record<string, number[]>;
    };
    notes?: string;
    version: number;
}

const DentalChartSchema = new Schema<IDentalChart & Document>({
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
    chartDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    numberingSystem: {
        type: String,
        enum: ['fdi', 'universal'],
        default: 'fdi'
    },
    teeth: [{
        toothNumber: {
            type: String,
            required: true
        },
        conditions: [{
            type: {
                type: String,
                enum: ['caries', 'filling', 'crown', 'bridge', 'implant', 'extraction', 'root_canal', 'missing', 'other'],
                required: true
            },
            surface: String,
            status: {
                type: String,
                enum: ['existing', 'planned', 'completed'],
                default: 'existing'
            },
            notes: String,
            date: Date
        }]
    }],
    periodontal: {
        probingDepths: Schema.Types.Mixed,
        bleeding: Schema.Types.Mixed,
        recession: Schema.Types.Mixed
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [2000, 'Observações muito longas']
    },
    version: {
        type: Number,
        default: 1
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

DentalChartSchema.index({ patient: 1, chartDate: -1 });
DentalChartSchema.index({ clinic: 1, chartDate: -1 });

DentalChartSchema.pre('save', function(next) {
    if (this.isModified('teeth') || this.isModified('periodontal')) {
        this.version += 1;
    }
    next();
});

export const DentalChart = mongoose.model<IDentalChart & Document>('DentalChart', DentalChartSchema);
