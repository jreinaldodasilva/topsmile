// backend/src/models/Insurance.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IInsurance {
    patient: mongoose.Types.ObjectId;
    clinic: mongoose.Types.ObjectId;
    type: 'primary' | 'secondary';
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    subscriberName: string;
    subscriberRelationship: 'self' | 'spouse' | 'child' | 'other';
    subscriberDOB?: Date;
    effectiveDate: Date;
    expirationDate?: Date;
    coverageDetails?: {
        annualMaximum?: number;
        deductible?: number;
        deductibleMet?: number;
        coinsurance?: number;
        copay?: number;
    };
    isActive: boolean;
}

const InsuranceSchema = new Schema<IInsurance & Document>({
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
    type: {
        type: String,
        enum: ['primary', 'secondary'],
        required: [true, 'Tipo de seguro é obrigatório'],
        default: 'primary'
    },
    provider: {
        type: String,
        required: [true, 'Provedor de seguro é obrigatório'],
        trim: true,
        maxlength: [200, 'Nome do provedor muito longo']
    },
    policyNumber: {
        type: String,
        required: [true, 'Número da apólice é obrigatório'],
        trim: true,
        maxlength: [100, 'Número da apólice muito longo']
    },
    groupNumber: {
        type: String,
        trim: true,
        maxlength: [100, 'Número do grupo muito longo']
    },
    subscriberName: {
        type: String,
        required: [true, 'Nome do titular é obrigatório'],
        trim: true,
        maxlength: [200, 'Nome do titular muito longo']
    },
    subscriberRelationship: {
        type: String,
        enum: ['self', 'spouse', 'child', 'other'],
        required: [true, 'Relacionamento com titular é obrigatório']
    },
    subscriberDOB: Date,
    effectiveDate: {
        type: Date,
        required: [true, 'Data de início é obrigatória']
    },
    expirationDate: Date,
    coverageDetails: {
        annualMaximum: Number,
        deductible: Number,
        deductibleMet: Number,
        coinsurance: Number,
        copay: Number
    },
    isActive: {
        type: Boolean,
        default: true
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

InsuranceSchema.index({ patient: 1, type: 1 });
InsuranceSchema.index({ clinic: 1, isActive: 1 });

export const Insurance = mongoose.model<IInsurance & Document>('Insurance', InsuranceSchema);
