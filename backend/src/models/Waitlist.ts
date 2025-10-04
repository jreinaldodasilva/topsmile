// backend/src/models/Waitlist.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IWaitlist {
    patient: mongoose.Types.ObjectId;
    clinic: mongoose.Types.ObjectId;
    provider?: mongoose.Types.ObjectId;
    appointmentType: mongoose.Types.ObjectId;
    preferredDates: Date[];
    preferredTimes: string[];
    priority: 'routine' | 'urgent' | 'emergency';
    notes?: string;
    status: 'active' | 'scheduled' | 'cancelled' | 'expired';
    contactAttempts: number;
    lastContactDate?: Date;
    expiresAt: Date;
    createdBy: mongoose.Types.ObjectId;
}

const WaitlistSchema = new Schema<IWaitlist & Document>({
    patient: {
        type: Schema.Types.ObjectId,
        ref: 'Patient',
        required: true,
        index: true
    },
    clinic: {
        type: Schema.Types.ObjectId,
        ref: 'Clinic',
        required: true,
        index: true
    },
    provider: {
        type: Schema.Types.ObjectId,
        ref: 'Provider'
    },
    appointmentType: {
        type: Schema.Types.ObjectId,
        ref: 'AppointmentType',
        required: true
    },
    preferredDates: [Date],
    preferredTimes: [String],
    priority: {
        type: String,
        enum: ['routine', 'urgent', 'emergency'],
        default: 'routine',
        index: true
    },
    notes: String,
    status: {
        type: String,
        enum: ['active', 'scheduled', 'cancelled', 'expired'],
        default: 'active',
        index: true
    },
    contactAttempts: {
        type: Number,
        default: 0
    },
    lastContactDate: Date,
    expiresAt: {
        type: Date,
        required: true,
        index: true
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

WaitlistSchema.index({ clinic: 1, status: 1, priority: -1, createdAt: 1 });
WaitlistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Waitlist = mongoose.model<IWaitlist & Document>('Waitlist', WaitlistSchema);
