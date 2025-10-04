// backend/src/models/Operatory.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IOperatory {
    clinic: mongoose.Types.ObjectId;
    name: string;
    room: string;
    isActive: boolean;
    equipment: string[];
    colorCode?: string;
}

const OperatorySchema = new Schema<IOperatory & Document>({
    clinic: {
        type: Schema.Types.ObjectId,
        ref: 'Clinic',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    room: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    isActive: {
        type: Boolean,
        default: true
    },
    equipment: [String],
    colorCode: {
        type: String,
        maxlength: 7,
        validate: {
            validator: (v: string) => !v || /^#[0-9A-F]{6}$/i.test(v),
            message: 'Código de cor inválido'
        }
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

OperatorySchema.index({ clinic: 1, isActive: 1 });

export const Operatory = mongoose.model<IOperatory & Document>('Operatory', OperatorySchema);
