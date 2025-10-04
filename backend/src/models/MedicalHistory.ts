// backend/src/models/MedicalHistory.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IMedicalHistory {
    patient: mongoose.Types.ObjectId;
    clinic: mongoose.Types.ObjectId;
    recordDate: Date;
    chiefComplaint?: string;
    presentIllness?: string;
    pastMedicalHistory?: string[];
    pastDentalHistory?: string[];
    medications?: Array<{
        name: string;
        dosage?: string;
        frequency?: string;
        startDate?: Date;
        endDate?: Date;
    }>;
    allergies?: Array<{
        allergen: string;
        reaction: string;
        severity: 'mild' | 'moderate' | 'severe';
    }>;
    chronicConditions?: string[];
    surgicalHistory?: Array<{
        procedure: string;
        date: Date;
        notes?: string;
    }>;
    familyHistory?: string[];
    socialHistory?: {
        smoking?: 'never' | 'former' | 'current';
        alcohol?: 'never' | 'occasional' | 'regular';
        occupation?: string;
    };
    vitalSigns?: {
        bloodPressure?: string;
        heartRate?: number;
        temperature?: number;
        weight?: number;
    };
    recordedBy: mongoose.Types.ObjectId;
    notes?: string;
}

const MedicalHistorySchema = new Schema<IMedicalHistory & Document>({
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
    recordDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    chiefComplaint: {
        type: String,
        trim: true,
        maxlength: [500, 'Queixa principal muito longa']
    },
    presentIllness: {
        type: String,
        trim: true,
        maxlength: [1000, 'História da doença atual muito longa']
    },
    pastMedicalHistory: [String],
    pastDentalHistory: [String],
    medications: [{
        name: { type: String, required: true },
        dosage: String,
        frequency: String,
        startDate: Date,
        endDate: Date
    }],
    allergies: [{
        allergen: { type: String, required: true },
        reaction: { type: String, required: true },
        severity: {
            type: String,
            enum: ['mild', 'moderate', 'severe'],
            default: 'moderate'
        }
    }],
    chronicConditions: [String],
    surgicalHistory: [{
        procedure: { type: String, required: true },
        date: { type: Date, required: true },
        notes: String
    }],
    familyHistory: [String],
    socialHistory: {
        smoking: {
            type: String,
            enum: ['never', 'former', 'current']
        },
        alcohol: {
            type: String,
            enum: ['never', 'occasional', 'regular']
        },
        occupation: String
    },
    vitalSigns: {
        bloodPressure: String,
        heartRate: Number,
        temperature: Number,
        weight: Number
    },
    recordedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [2000, 'Observações muito longas']
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

MedicalHistorySchema.index({ patient: 1, recordDate: -1 });
MedicalHistorySchema.index({ clinic: 1, recordDate: -1 });

export const MedicalHistory = mongoose.model<IMedicalHistory & Document>('MedicalHistory', MedicalHistorySchema);
