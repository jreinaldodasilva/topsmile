// backend/src/models/Clinic.ts
import mongoose, { Document, Schema } from 'mongoose';
import { Clinic as IClinic, WorkingHours as IWorkingHours } from '@topsmile/types';

const validateBrazilianCNPJ = (cnpj: string | undefined): boolean => {
  if (cnpj == null) return true; // Optional field

  const c = cnpj as string;
  const cleanCNPJ = c.replace(/[^\d]/g, '');

  if (cleanCNPJ.length !== 14) return false;

  // Check for repeated numbers
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;

  // CNPJ algorithm validation
  const calculateDigit = (cnpj: string, weights: number[]): number => {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(cnpj[i] || '0') * weights[i];
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const digit1 = calculateDigit(cleanCNPJ, weights1);
  const digit2 = calculateDigit(cleanCNPJ + digit1, weights2);

  return digit1 === parseInt(cleanCNPJ.substring(12, 13)) && digit2 === parseInt(cleanCNPJ.substring(13, 14));
};

const validateClinicPhone = (phone: string | undefined): boolean => {
  if (phone == null) return false;
  const p = phone as string;
  const cleanPhone = p.replace(/[^\d]/g, '');
  return /^(\d{10}|\d{11})$/.test(cleanPhone);
};

const validateBrazilianZipCode = (zipCode: string | undefined): boolean => {
  if (zipCode == null) return false;
  return /^\d{5}-?\d{3}$/.test(zipCode);
};

const validateWorkingHours = (hours: any): boolean => {
  if (!hours) return false;
  
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  
  for (const day of days) {
    const dayHours = hours[day];
    if (!dayHours) return false;
    
    if (dayHours.isWorking) {
      if (!dayHours.start || !dayHours.end) return false;
      
      // Validate time format (HH:mm)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(dayHours.start) || !timeRegex.test(dayHours.end)) {
        return false;
      }
      
      // Validate start time is before end time
      const start = new Date(`1970-01-01T${dayHours.start}:00`);
      const end = new Date(`1970-01-01T${dayHours.end}:00`);
      if (start >= end) return false;
    }
  }
  
  return true;
};

const ClinicSchema = new Schema<IClinic & Document>({
    name: {
        type: String,
        required: [true, 'Nome da clínica é obrigatório'],
        trim: true,
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
    phone: {
        type: String,
        required: [true, 'Telefone é obrigatório'],
        trim: true,
        validate: {
            validator: (phone: string) => validateClinicPhone(phone),
            message: 'Telefone deve ser um número brasileiro válido'
        }
    },
    address: {
        street: { type: String, required: true, trim: true },
        number: { type: String, required: true, trim: true },
        complement: { type: String, trim: true },
        neighborhood: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true, maxlength: 2 },
        zipCode: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: validateBrazilianZipCode,
                message: 'CEP deve estar no formato XXXXX-XXX'
            }
        }
    },
    cnpj: {
        type: String,
        trim: true,
        unique: true,
        sparse: true, // Allows multiple null values
        validate: {
            validator: validateBrazilianCNPJ,
            message: 'CNPJ inválido'
        }
    },
    subscription: {
        plan: {
            type: String,
            enum: ['basic', 'professional', 'premium'],
            default: 'basic'
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'suspended', 'canceled'],
            default: 'active'
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: Date
    },
    settings: {
        timezone: {
            type: String,
            default: 'America/Sao_Paulo'
        },
        workingHours: {
            type: Object,
            validate: {
                validator: validateWorkingHours,
                message: 'Horários de funcionamento inválidos'
            }
        },
        appointmentDuration: {
            type: Number,
            default: 60,
            min: [15, 'Duração mínima de 15 minutos'],
            max: [480, 'Duração máxima de 8 horas']
        },
        allowOnlineBooking: {
            type: Boolean,
            default: true
        }
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

ClinicSchema.pre('save', function(this: IClinic & Document, next) {
    // Normalize phone number
    if (this.phone) {
        this.phone = this.phone!.replace(/[^\d]/g, '');

        // Format for display
        if (this.phone.length === 11) {
            this.phone = `(${this.phone.substring(0, 2)}) ${this.phone.substring(2, 7)}-${this.phone.substring(7)}`;
        } else if (this.phone.length === 10) {
            this.phone = `(${this.phone.substring(0, 2)}) ${this.phone.substring(2, 6)}-${this.phone.substring(6)}`;
        }
    }

    // Normalize CNPJ
    if (this.cnpj) {
        const cleanCNPJ = this.cnpj.replace(/[^\d]/g, '');
        if (cleanCNPJ.length === 14) {
            this.cnpj = `${cleanCNPJ.substring(0, 2)}.${cleanCNPJ.substring(2, 5)}.${cleanCNPJ.substring(5, 8)}/${cleanCNPJ.substring(8, 12)}-${cleanCNPJ.substring(12)}`;
        }
    }

    // Normalize ZIP code
    if (this.address?.zipCode) {
        const cleanZip = this.address.zipCode.replace(/[^\d]/g, '');
        if (cleanZip.length === 8) {
            this.address.zipCode = `${cleanZip.substring(0, 5)}-${cleanZip.substring(5)}`;
        }
    }

    next();
});

ClinicSchema.methods.isOperationalToday = function(): boolean {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof IWorkingHours;
    const workingHours = this.settings.workingHours as IWorkingHours;
    return workingHours[today]?.isWorking || false;
};

ClinicSchema.methods.getTodaysHours = function(): { start: string; end: string } | null {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof IWorkingHours;
    const workingHours = this.settings.workingHours as IWorkingHours;
    const todaysHours = workingHours[today];

    if (todaysHours?.isWorking) {
        return { start: todaysHours.start, end: todaysHours.end };
    }

    return null;
};

ClinicSchema.methods.isActiveSubscription = function(): boolean {
    return this.subscription.status === 'active' && 
           (!this.subscription.endDate || this.subscription.endDate > new Date());
};

// Indexes
ClinicSchema.index({ email: 1 });
ClinicSchema.index({ 'address.city': 1, 'address.state': 1 });
ClinicSchema.index({ 'subscription.plan': 1 });
ClinicSchema.index({ createdAt: -1 });

export const Clinic = mongoose.model<IClinic & Document>('Clinic', ClinicSchema);
