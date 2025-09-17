// backend/src/models/PatientRefreshToken.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IPatientRefreshToken extends Document {
    token: string;
    patientUserId: mongoose.Types.ObjectId | any;
    expiresAt: Date;
    isRevoked: boolean;
    deviceInfo?: {
        userAgent?: string;
        ipAddress?: string;
        deviceId?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const PatientRefreshTokenSchema = new Schema<IPatientRefreshToken>({
    token: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    patientUserId: {
        type: Schema.Types.ObjectId,
        ref: 'PatientUser',
        required: true,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isRevoked: {
        type: Boolean,
        default: false,
        index: true
    },
    deviceInfo: {
        userAgent: String,
        ipAddress: String,
        deviceId: String
    }
}, {
    timestamps: true
});

// TTL index for automatic cleanup
PatientRefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for active token queries
PatientRefreshTokenSchema.index({ patientUserId: 1, isRevoked: 1 });

export const PatientRefreshToken = mongoose.model<IPatientRefreshToken>('PatientRefreshToken', PatientRefreshTokenSchema);
