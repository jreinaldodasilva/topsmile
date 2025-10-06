// backend/src/models/base/baseSchema.ts
import { SchemaDefinition, SchemaOptions } from 'mongoose';

export const baseSchemaFields: SchemaDefinition = {
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true
    },
    deletedAt: {
        type: Date
    }
};

export const baseSchemaOptions: SchemaOptions<any> = {
    timestamps: true,
    toJSON: {
        transform: (doc: any, ret: any) => {
            ret.id = ret._id?.toString();
            delete ret._id;
            delete ret.__v;
            if (ret.isDeleted) delete ret.isDeleted;
            return ret;
        }
    }
};
