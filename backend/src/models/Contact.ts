// backend/src/models/Contact.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
    name: string;
    email: string;
    clinic: string;
    specialty: string;
    phone: string;
    status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
    source: string;
    notes: string;
    assignedTo?: mongoose.Types.ObjectId;
    followUpDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ContactSchema = new Schema<IContact>({
    name: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true,
        minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
        maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
    },
    email: {
        type: String,
        required: [true, 'E-mail é obrigatório'],
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: 'E-mail inválido'
        }
    },
    clinic: {
        type: String,
        required: [true, 'Nome da clínica é obrigatório'],
        trim: true,
        maxlength: [100, 'Nome da clínica deve ter no máximo 100 caracteres']
    },
    specialty: {
        type: String,
        required: [true, 'Especialidade é obrigatória'],
        trim: true,
        maxlength: [100, 'Especialidade deve ter no máximo 100 caracteres']
    },
    phone: {
        type: String,
        required: [true, 'Telefone é obrigatório'],
        trim: true,
        validate: {
            validator: function (phone: string) {
                return /^[\d\s\-\(\)\+]{10,20}$/.test(phone);
            },
            message: 'Telefone inválido'
        }
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'qualified', 'converted', 'closed'],
        default: 'new'
    },
    source: {
        type: String,
        default: 'website_contact_form'
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notas devem ter no máximo 1000 caracteres']
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    followUpDate: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete (ret as any).__v;
            return ret;
        }
    }
});

// Indexes for performance
ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ followUpDate: 1 });

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);


