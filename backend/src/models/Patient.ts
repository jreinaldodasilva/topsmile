// backend/src/models/Patient.ts
import mongoose, { Document, Schema } from 'mongoose';
import { Patient as IPatient } from '@topsmile/types';
import { baseSchemaFields, baseSchemaOptions } from './base/baseSchema';
import { clinicScopedFields } from './mixins';

const validateCPF = (cpf: string | undefined): boolean => {
  if (cpf == null) return true; // Optional field

  const cleanCPF = (cpf as string).replace(/[^\d]/g, '');

  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  let sum = 0;
  let remainder: number;

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;

  if ((remainder === 10) || (remainder === 11)) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) {
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;

  if ((remainder === 10) || (remainder === 11)) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) {
    return false;
  }

  return true;
};

const validateBrazilianPhone = (phone: string | undefined): boolean => {
  if (phone == null) return false;

  const cleanPhone = (phone as string).replace(/[^\d]/g, '');

  // Brazilian phone formats:
  // Mobile: (XX) 9XXXX-XXXX (11 digits, starts with 9 after area code)
  // Landline: (XX) XXXX-XXXX (10 digits)
  // Also accept raw 10 or 11 digit numbers
  const isMobile = cleanPhone.length === 11;
  const isLandline = cleanPhone.length === 10;

  if (!(isMobile || isLandline)) return false;
  
  const areaCode = parseInt(cleanPhone.substring(0, 2));
  return areaCode >= 11 && areaCode <= 99;
};

const validateBrazilianZipCode = (zipCode: string | undefined): boolean => {
  if (zipCode == null) return true; // Optional field

  // Brazilian ZIP code format: XXXXX-XXX
  return /^\d{5}-?\d{3}$/.test(zipCode);
};

const validateBirthDate = (birthDate: Date): boolean => {
  if (!birthDate) return true; // Optional field
  
  const today = new Date();
  const birth = new Date(birthDate);
  
  // Must be in the past
  if (birth >= today) return false;
  
  // Reasonable age limits (0-150 years)
  const age = today.getFullYear() - birth.getFullYear();
  return age >= 0 && age <= 150;
};

const validateMedicalArray = (arr: string[]): boolean => {
  if (!arr) return true;

  // Each item should be non-empty and reasonable length
  return arr.every((item: string) =>
    typeof item === 'string' &&
    item.trim().length > 0 &&
    item.length <= 200
  );
};

const PatientSchema = new Schema<IPatient & Document>({
    ...baseSchemaFields,
    ...clinicScopedFields,
    firstName: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true,
        minlength: [2, 'Nome deve ter pelo menos 2 caracteres'],
        maxlength: [100, 'Nome deve ter no máximo 100 caracteres'],
        validate: {
            validator: (name: string) => /^[a-zA-ZÀ-ÿ\s\-'.]+$/.test(name),
            message: 'Nome deve conter apenas letras, espaços, hífens, apostrofes e acentos'
        }
    },
    lastName: {
        type: String,
        required: [true, 'Sobrenome é obrigatório'],
        trim: true,
        minlength: [2, 'Sobrenome deve ter pelo menos 2 caracteres'],
        maxlength: [100, 'Sobrenome deve ter no máximo 100 caracteres'],
        validate: {
            validator: (name: string) => /^[a-zA-ZÀ-ÿ\s\-'.]+$/.test(name),
            message: 'Sobrenome deve conter apenas letras, espaços, hífens, apostrofes e acentos'
        }
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (email: string) {
                if (!email) return true; // Optional
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
            },
            message: 'E-mail inválido ou muito longo'
        }
    },
    phone: {
        type: String,
        required: [true, 'Telefone é obrigatório'],
        trim: true,
        validate: {
            validator: (phone: string) => validateBrazilianPhone(phone),
            message: 'Telefone deve estar em formato brasileiro válido'
        }
    },
    dateOfBirth: {
        type: Date,
        validate: {
            validator: validateBirthDate,
            message: 'Data de nascimento inválida'
        }
    },
    cpf: {
        type: String,
        trim: true,
        validate: {
            validator: validateCPF,
            message: 'CPF inválido'
        }
    },
    address: {
        street: String,
        number: String,
        complement: String,
        neighborhood: String,
        city: String,
        state: String,
        zipCode: {
            type: String,
            trim: true,
            validate: {
                validator: validateBrazilianZipCode,
                message: 'CEP deve estar no formato XXXXX-XXX'
            }
        }
    },
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String
    },
    medicalHistory: {
        allergies: {
            type: [String],
            validate: {
                validator: validateMedicalArray,
                message: 'Lista de alergias inválida'
            }
        },
        medications: {
            type: [String],
            validate: {
                validator: validateMedicalArray,
                message: 'Lista de medicamentos inválida'
            }
        },
        conditions: {
            type: [String],
            validate: {
                validator: validateMedicalArray,
                message: 'Lista de condições inválida'
            }
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [2000, 'Observações médicas muito longas (máximo 2000 caracteres)']
        }
    },
    insurance: {
        primary: {
            provider: String,
            policyNumber: String,
            groupNumber: String,
            subscriberName: String,
            subscriberRelationship: {
                type: String,
                enum: ['self', 'spouse', 'child', 'other']
            },
            effectiveDate: Date,
            expirationDate: Date
        },
        secondary: {
            provider: String,
            policyNumber: String,
            groupNumber: String,
            subscriberName: String,
            subscriberRelationship: {
                type: String,
                enum: ['self', 'spouse', 'child', 'other']
            },
            effectiveDate: Date,
            expirationDate: Date
        }
    },
    familyMembers: [{
        type: Schema.Types.ObjectId,
        ref: 'Patient'
    }],
    photoUrl: {
        type: String,
        trim: true,
        validate: {
            validator: (url: string) => !url || /^https?:\/\/.+/.test(url),
            message: 'URL da foto inválida'
        }
    },
    consentForms: [{
        formType: {
            type: String,
            required: true
        },
        signedAt: {
            type: Date,
            required: true
        },
        signatureUrl: String,
        documentUrl: String,
        version: String
    }],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    ...baseSchemaOptions,
    toJSON: {
        virtuals: true,
        transform: (doc: any, ret: any) => {
            ret.id = ret._id?.toString();
            delete ret._id;
            delete ret.__v;
            if (ret.isDeleted) delete ret.isDeleted;
            return ret;
        }
    }
} as any);

PatientSchema.pre('save', function(this: IPatient & Document, next) {
    // Normalize phone number
    if (this.phone != null) {
        let phone: string = this.phone;
        phone = phone.replace(/[^\d]/g, '');

        // Format for display: (11) 91234-5678
        if (phone.length === 11) {
            phone = `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
        } else if (phone.length === 10) {
            phone = `(${phone.substring(0, 2)}) ${phone.substring(2, 6)}-${phone.substring(6)}`;
        }
        this.phone = phone;
    }

    // Normalize CPF
    if (this.cpf) {
        const cleanCPF = this.cpf.replace(/[^\d]/g, '');
        if (cleanCPF.length === 11) {
            this.cpf = `${cleanCPF.substring(0, 3)}.${cleanCPF.substring(3, 6)}.${cleanCPF.substring(6, 9)}-${cleanCPF.substring(9)}`;
        }
    }

    // Normalize ZIP code
    if (this.address?.zipCode) {
        const cleanZip = this.address.zipCode.replace(/[^\d]/g, '');
        if (cleanZip.length === 8) {
            this.address.zipCode = `${cleanZip.substring(0, 5)}-${cleanZip.substring(5)}`;
        }
    }

    // Trim and clean medical history arrays
    if (this.medicalHistory?.allergies) {
        this.medicalHistory.allergies = this.medicalHistory.allergies
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0);
    }

    if (this.medicalHistory?.medications) {
        this.medicalHistory.medications = this.medicalHistory.medications
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0);
    }

    if (this.medicalHistory?.conditions) {
        this.medicalHistory.conditions = this.medicalHistory.conditions
            .map((item: string) => item.trim())
            .filter((item: string) => item.length > 0);
    }

    next();
});

// Virtual for fullName
PatientSchema.virtual('fullName').get(function(this: any) {
  return `${this.firstName} ${this.lastName}`.trim();
});

// Optimized compound indexes
PatientSchema.index({ clinic: 1, status: 1, lastName: 1, firstName: 1 }, { name: 'clinic_patient_list', background: true });
PatientSchema.index({ clinic: 1, phone: 1 }, { name: 'clinic_phone_lookup', background: true });
PatientSchema.index({ clinic: 1, email: 1 }, { name: 'clinic_email_lookup', background: true });
PatientSchema.index({ clinic: 1, cpf: 1 }, { name: 'clinic_cpf_lookup', background: true, sparse: true });

export const Patient = mongoose.model<IPatient & Document>('Patient', PatientSchema);
