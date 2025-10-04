// backend/src/models/Prescription.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPrescription {
    patient: mongoose.Types.ObjectId;
    clinic: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    appointment?: mongoose.Types.ObjectId;
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
    prescribedDate: Date;
    expirationDate?: Date;
}

const PrescriptionSchema = new Schema<IPrescription & Document>({
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
    appointment: {
        type: Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    medications: [{
        name: {
            type: String,
            required: [true, 'Nome do medicamento é obrigatório'],
            trim: true
        },
        dosage: {
            type: String,
            required: [true, 'Dosagem é obrigatória'],
            trim: true
        },
        frequency: {
            type: String,
            required: [true, 'Frequência é obrigatória'],
            trim: true
        },
        duration: {
            type: String,
            required: [true, 'Duração é obrigatória'],
            trim: true
        },
        quantity: {
            type: Number,
            required: [true, 'Quantidade é obrigatória'],
            min: 1
        },
        instructions: {
            type: String,
            trim: true,
            maxlength: [500, 'Instruções muito longas']
        }
    }],
    diagnosis: {
        type: String,
        trim: true,
        maxlength: [500, 'Diagnóstico muito longo']
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Observações muito longas']
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'cancelled'],
        default: 'active',
        index: true
    },
    prescribedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    expirationDate: Date
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

PrescriptionSchema.index({ patient: 1, prescribedDate: -1 });
PrescriptionSchema.index({ clinic: 1, status: 1 });

export const Prescription = mongoose.model<IPrescription & Document>('Prescription', PrescriptionSchema);
