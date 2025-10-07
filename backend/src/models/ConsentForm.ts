// backend/src/models/ConsentForm.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IConsentForm {
    patient: mongoose.Types.ObjectId;
    clinic: mongoose.Types.ObjectId;
    formType: string;
    title: string;
    content: string;
    version: string;
    signedAt?: Date;
    signedBy?: string;
    signatureUrl?: string;
    witnessName?: string;
    witnessSignature?: string;
    status: 'pending' | 'signed' | 'declined' | 'expired';
    expirationDate?: Date;
}

const ConsentFormSchema = new Schema<IConsentForm & Document>({
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
    formType: {
        type: String,
        required: [true, 'Tipo de formulário é obrigatório'],
        trim: true,
        enum: ['treatment_consent', 'anesthesia_consent', 'privacy_policy', 'financial_agreement', 'photo_release', 'other']
    },
    title: {
        type: String,
        required: [true, 'Título é obrigatório'],
        trim: true,
        maxlength: [200, 'Título muito longo']
    },
    content: {
        type: String,
        required: [true, 'Conteúdo é obrigatório'],
        trim: true
    },
    version: {
        type: String,
        required: true,
        default: '1.0'
    },
    signedAt: Date,
    signedBy: {
        type: String,
        trim: true
    },
    signatureUrl: String,
    witnessName: String,
    witnessSignature: String,
    status: {
        type: String,
        enum: ['pending', 'signed', 'declined', 'expired'],
        default: 'pending',
        index: true
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

ConsentFormSchema.index({ patient: 1, formType: 1, status: 1 });
ConsentFormSchema.index({ clinic: 1, status: 1 });

export const ConsentForm = mongoose.model<IConsentForm & Document>('ConsentForm', ConsentFormSchema);
