// backend/src/models/Session.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface ISession {
    user: mongoose.Types.ObjectId;
    refreshToken: string;
    deviceInfo: {
        userAgent: string;
        browser?: string;
        os?: string;
        device?: string;
    };
    ipAddress: string;
    lastActivity: Date;
    expiresAt: Date;
    isActive: boolean;
}

const SessionSchema = new Schema<ISession & Document>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    deviceInfo: {
        userAgent: {
            type: String,
            required: true
        },
        browser: String,
        os: String,
        device: String
    },
    ipAddress: {
        type: String,
        required: true
    },
    lastActivity: {
        type: Date,
        default: Date.now,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function(doc, ret) {
            ret.id = ret._id;
            delete (ret as any)._id;
            delete (ret as any).__v;
            delete (ret as any).refreshToken;
            return ret;
        }
    }
});

SessionSchema.index({ user: 1, isActive: 1 });
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Session = mongoose.model<ISession & Document>('Session', SessionSchema);
