import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { User as IUser, UserRole } from '@topsmile/types';
import { authMixin } from './mixins/authMixin';
import { emailField, passwordField, commonValidators } from '../utils/validation/validators';
import { baseSchemaFields, baseSchemaOptions } from './base/baseSchema';
import { clinicScopedFields } from './mixins';


const UserSchema = new Schema<IUser & Document>({
    name: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true,
        minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
        maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
    },
    email: {
        ...emailField,
        select: true
    },
    password: {
        ...passwordField,
        select: false // Don't include password in queries by default
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.ADMIN
    },
    ...clinicScopedFields,
    ...authMixin.fields,
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
    mfaEnabled: {
        type: Boolean,
        default: false
    },
    mfaSecret: {
        type: String,
        select: false
    },
    mfaBackupCodes: {
        type: [String],
        select: false
    },
    phoneVerified: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        trim: true
    },
    passwordHistory: {
        type: [{
            password: String,
            changedAt: Date
        }],
        select: false,
        default: []
    },
    passwordChangedAt: Date,
    passwordExpiresAt: Date,
    forcePasswordChange: {
        type: Boolean,
        default: false
    },
    ...baseSchemaFields
}, {
    ...baseSchemaOptions,
    toJSON: {
        transform: function (doc: any, ret: any) {
            ret.id = ret._id?.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            if (ret.isDeleted) delete ret.isDeleted;
            return ret;
        }
    }
} as any);

// Password strength validation - runs before other validations
UserSchema.pre('validate', function(this: IUser & Document, next) {
    if (this.isNew || this.isModified('password')) {
        const password = this.password;
        
        // Check for minimum length (additional check beyond schema validation)
        if (password.length < 8) {
            this.invalidate('password', 'Senha deve ter pelo menos 8 caracteres');
            return next();
        }
        
        // Check for uppercase letter
        if (!/(?=.*[A-Z])/.test(password)) {
            this.invalidate('password', 'Senha deve conter pelo menos uma letra maiúscula');
            return next();
        }
        
        // Check for lowercase letter
        if (!/(?=.*[a-z])/.test(password)) {
            this.invalidate('password', 'Senha deve conter pelo menos uma letra minúscula');
            return next();
        }
        
        // Check for number
        if (!/(?=.*\d)/.test(password)) {
            this.invalidate('password', 'Senha deve conter pelo menos um número');
            return next();
        }
        
        // Optional: Check for special character (uncomment if desired)
        // if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\|,.<>\/?])/.test(password)) {
        //     this.invalidate('password', 'Senha deve conter pelo menos um caractere especial');
        //     return next();
        // }
        
        // Check for common weak passwords
        const commonWeakPasswords = [
            '12345678', 'password', 'password123', 'admin123', 
            'qwerty123', '123456789', 'abc123456'
        ];
        
        if (commonWeakPasswords.includes(password.toLowerCase())) {
            this.invalidate('password', 'Senha muito comum. Escolha uma senha mais segura');
            return next();
        }
    }
    
    next();
});

// Hash password before saving
UserSchema.pre('save', async function (this: IUser & Document, next) {
    if (!this.isModified('password')) return next();

    const maxPasswordHistory = 5;
    const passwordExpiryDays = 90;
    const plainTextPassword = this.password;

    // Check password reuse against history (only for existing users)
    if (!this.isNew && this.passwordHistory && this.passwordHistory.length > 0) {
        for (const oldPassword of this.passwordHistory.slice(0, maxPasswordHistory)) {
            const isReused = await bcrypt.compare(plainTextPassword, oldPassword.password);
            if (isReused) {
                return next(new Error('Senha não pode ser igual às últimas 5 senhas utilizadas'));
            }
        }
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(plainTextPassword, salt);

    // Store the OLD hashed password in history (only for existing users changing password)
    if (!this.isNew) {
        // Get the current hashed password from database before we replace it
        const User = mongoose.model('User');
        const currentDoc = await User.findById(this._id).select('+password');
        if (currentDoc && (currentDoc as any).password) {
            if (!this.passwordHistory) {
                this.passwordHistory = [];
            }
            this.passwordHistory.unshift({
                password: (currentDoc as any).password,
                changedAt: new Date()
            });
            if (this.passwordHistory.length > maxPasswordHistory) {
                this.passwordHistory = this.passwordHistory.slice(0, maxPasswordHistory);
            }
        }
    }

    this.password = hashedPassword;
    this.passwordChangedAt = new Date();
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + passwordExpiryDays);
    this.passwordExpiresAt = expiryDate;
    
    this.forcePasswordChange = false;

    next();
});

// Apply authentication methods from mixin
Object.assign(UserSchema.methods, authMixin.methods);
Object.assign(UserSchema.statics, authMixin.statics);

// Indexes
UserSchema.index({ role: 1 });
UserSchema.index({ clinic: 1 });

export const User = mongoose.model<IUser & Document>('User', UserSchema);
