// backend/src/models/AuditLog.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog {
    user?: mongoose.Types.ObjectId;
    action: string;
    resource: string;
    resourceId?: string;
    method: string;
    path: string;
    ipAddress: string;
    userAgent?: string;
    statusCode?: number;
    changes?: {
        before?: any;
        after?: any;
    };
    metadata?: Record<string, any>;
    clinic?: mongoose.Types.ObjectId;
}

const AuditLogSchema = new Schema<IAuditLog & Document>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    action: {
        type: String,
        required: true,
        enum: ['login', 'logout', 'create', 'read', 'update', 'delete', 'failed_login', 'password_change', 'mfa_setup', 'mfa_disable', 'export', 'import'],
        index: true
    },
    resource: {
        type: String,
        required: true,
        index: true
    },
    resourceId: {
        type: String,
        index: true
    },
    method: {
        type: String,
        required: true,
        enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    },
    path: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true,
        index: true
    },
    userAgent: String,
    statusCode: Number,
    changes: {
        before: Schema.Types.Mixed,
        after: Schema.Types.Mixed
    },
    metadata: Schema.Types.Mixed,
    clinic: {
        type: Schema.Types.ObjectId,
        ref: 'Clinic',
        index: true
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

AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ user: 1, createdAt: -1 });
AuditLogSchema.index({ clinic: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
AuditLogSchema.index({ resource: 1, resourceId: 1 });

export const AuditLog = mongoose.model<IAuditLog & Document>('AuditLog', AuditLogSchema);
