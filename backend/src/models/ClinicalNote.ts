// backend/src/models/ClinicalNote.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IClinicalNote {
    patient: mongoose.Types.ObjectId;
    clinic: mongoose.Types.ObjectId;
    provider: mongoose.Types.ObjectId;
    appointment?: mongoose.Types.ObjectId;
    noteType: 'soap' | 'progress' | 'consultation' | 'procedure' | 'other';
    template?: string;
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    content?: string;
    attachments?: Array<{
        url: string;
        type: string;
        filename: string;
    }>;
    signature?: {
        signedBy: mongoose.Types.ObjectId;
        signedAt: Date;
        signatureUrl?: string;
    };
    isLocked: boolean;
    createdBy: mongoose.Types.ObjectId;
}

const ClinicalNoteSchema = new Schema<IClinicalNote & Document>({
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
    noteType: {
        type: String,
        enum: ['soap', 'progress', 'consultation', 'procedure', 'other'],
        required: true,
        default: 'soap'
    },
    template: String,
    subjective: {
        type: String,
        trim: true,
        maxlength: [2000, 'Subjetivo muito longo']
    },
    objective: {
        type: String,
        trim: true,
        maxlength: [2000, 'Objetivo muito longo']
    },
    assessment: {
        type: String,
        trim: true,
        maxlength: [2000, 'Avaliação muito longa']
    },
    plan: {
        type: String,
        trim: true,
        maxlength: [2000, 'Plano muito longo']
    },
    content: {
        type: String,
        trim: true,
        maxlength: [5000, 'Conteúdo muito longo']
    },
    attachments: [{
        url: {
            type: String,
            required: true
        },
        type: String,
        filename: String
    }],
    signature: {
        signedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        signedAt: Date,
        signatureUrl: String
    },
    isLocked: {
        type: Boolean,
        default: false
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

ClinicalNoteSchema.index({ patient: 1, createdAt: -1 });
ClinicalNoteSchema.index({ clinic: 1, createdAt: -1 });
ClinicalNoteSchema.index({ appointment: 1 });

export const ClinicalNote = mongoose.model<IClinicalNote & Document>('ClinicalNote', ClinicalNoteSchema);
