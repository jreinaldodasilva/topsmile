import mongoose, { Document, Schema, CallbackWithoutResultAndOptionalError } from 'mongoose';
import bcrypt from 'bcryptjs';
import { authMixin } from './mixins/authMixin';
import { emailField, passwordField } from '../utils/validation/validators';


export interface IPatientUser extends Document {
  patient: mongoose.Types.ObjectId; // References Patient
  email: string;
  password: string;
  isActive: boolean;
  emailVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLocked(): boolean;
  incLoginAttempts(): void;
  resetLoginAttempts(): void;
}

const PatientUserSchema = new Schema<IPatientUser>({
  patient: {
    type: Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    unique: true
  },
  email: emailField,
  password: passwordField,
  ...authMixin.fields,
  emailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc: any, ret: any) {
      ret.id = ret._id;
      delete (ret as any)._id;
      delete ret.__v;
      delete ret.password;
      delete ret.verificationToken;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpires;
      return ret;
    }
  }
});

// Indexes
PatientUserSchema.index({ patient: 1 });
PatientUserSchema.index({ verificationToken: 1 });
PatientUserSchema.index({ resetPasswordToken: 1 });

// Pre-save middleware to hash password
PatientUserSchema.pre<IPatientUser>('save', async function (next: CallbackWithoutResultAndOptionalError) {
  const user = this as IPatientUser & mongoose.Document;

  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Apply authentication methods from mixin
Object.assign(PatientUserSchema.methods, authMixin.methods);
Object.assign(PatientUserSchema.statics, authMixin.statics);

export const PatientUser = mongoose.model<IPatientUser>('PatientUser', PatientUserSchema);
