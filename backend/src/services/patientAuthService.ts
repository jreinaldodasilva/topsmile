import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { PatientUser, IPatientUser } from '../models/PatientUser';
import { Patient, IPatient } from '../models/Patient';
import { 
  ValidationError, 
  UnauthorizedError, 
  ConflictError, 
  NotFoundError,
  AppError 
} from '../types/errors';

export interface PatientRegistrationData {
  patientId?: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  clinicId: string;
  birthDate?: Date;
  gender?: 'male' | 'female' | 'other';
}

export interface PatientLoginData {
  email: string;
  password: string;
}

export interface PatientAuthResponse {
  success: true;
  data: {
    patient: IPatient;
    patientUser: IPatientUser;
    accessToken: string;
    expiresIn: string;
    requiresEmailVerification: boolean;
  };
}

export interface PatientTokenPayload {
  patientUserId: string;
  patientId: string;
  email: string;
  clinicId: string;
  type: 'patient';
}

class PatientAuthService {
  private readonly ACCESS_TOKEN_EXPIRES = process.env.PATIENT_ACCESS_TOKEN_EXPIRES || '24h';

  // FIXED: Separate JWT secret for patients
  private getPatientJwtSecret(): string {
    const secret = process.env.PATIENT_JWT_SECRET || process.env.JWT_SECRET || '';
    
    if (!secret || secret === 'your-secret-key') {
      if (process.env.NODE_ENV === 'production') {
        console.error('FATAL: Patient JWT secret not configured');
        process.exit(1);
      }
      return 'test-patient-jwt-secret';
    }
    
    // SECURITY WARNING: Same secret as staff
    if (secret === process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
      console.error('SECURITY WARNING: Patient and staff JWT secrets should be different!');
    }
    
    return secret;
  }

  // FIXED: Generate patient-specific tokens
  private generateAccessToken(patientUser: IPatientUser, patient: IPatient): string {
    const payload: PatientTokenPayload = {
      patientUserId: (patientUser._id as any).toString(),
      patientId: (patient._id as any).toString(),
      email: patientUser.email,
      clinicId: (patient.clinic as any).toString(),
      type: 'patient'
    };

    return jwt.sign(payload, this.getPatientJwtSecret(), {
      expiresIn: this.ACCESS_TOKEN_EXPIRES
    } as SignOptions);
  }

  // FIXED: Complete registration with patient creation or linking
  async register(data: PatientRegistrationData): Promise<PatientAuthResponse> {
    try {
      // Validate input
      if (!data.name || !data.email || !data.password || !data.clinicId) {
        throw new ValidationError('Nome, e-mail, senha e clínica são obrigatórios');
      }

      if (data.password.length < 8) {
        throw new ValidationError('Senha deve ter pelo menos 8 caracteres');
      }

      const email = data.email.toLowerCase();

      // Check if patient user already exists
      const existingPatientUser = await PatientUser.findOne({ email });
      if (existingPatientUser) {
        throw new ConflictError('Já existe uma conta com este e-mail');
      }

      let patient: IPatient;

      if (data.patientId) {
        // FIXED: Link to existing patient
        const existingPatient = await Patient.findOne({
          _id: data.patientId,
          clinic: data.clinicId,
          status: 'active'
        }) as IPatient | null;

        if (!existingPatient) {
          throw new NotFoundError('Paciente não encontrado ou inativo');
        }

        // Check if patient already has a user account
        const hasUserAccount = await PatientUser.findOne({ patient: data.patientId });
        if (hasUserAccount) {
          throw new ConflictError('Este paciente já possui uma conta no portal');
        }

        patient = existingPatient;
      } else {
        // FIXED: Create new patient record
        const newPatient = new Patient({
          name: data.name,
          email,
          phone: data.phone,
          birthDate: data.birthDate,
          gender: data.gender,
          clinic: data.clinicId,
          medicalHistory: {
            allergies: [],
            medications: [],
            conditions: [],
            notes: ''
          },
          status: 'active'
        });

        patient = await newPatient.save();
      }

      // Create patient user account
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const patientUser = new PatientUser({
        patient: patient._id,
        email,
        password: data.password,
        isActive: true,
        emailVerified: false,
        verificationToken
      });

      const savedPatientUser = await patientUser.save();

      // Generate access token
      const accessToken = this.generateAccessToken(savedPatientUser, patient);

      // TODO: Send verification email
      console.log(`Email verification token for ${email}: ${verificationToken}`);

      return {
        success: true,
        data: {
          patient,
          patientUser,
          accessToken,
          expiresIn: this.ACCESS_TOKEN_EXPIRES,
          requiresEmailVerification: !patientUser.emailVerified
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      console.error('Patient registration error:', error);
      throw new AppError('Erro ao criar conta de paciente', 500);
    }
  }

  // FIXED: Enhanced login with proper error handling
  async login(data: PatientLoginData): Promise<PatientAuthResponse> {
    try {
      if (!data.email || !data.password) {
        throw new ValidationError('E-mail e senha são obrigatórios');
      }

      const email = data.email.toLowerCase();

      const patientUser = await PatientUser.findOne({ email })
        .populate({
          path: 'patient',
          populate: { path: 'clinic', select: 'name' }
        });

      if (!patientUser) {
        throw new UnauthorizedError('E-mail ou senha incorretos');
      }

      // Check if account is locked
      if (patientUser.isLocked()) {
        throw new UnauthorizedError('Conta temporariamente bloqueada. Tente novamente mais tarde.');
      }

      const isMatch = await patientUser.comparePassword(data.password);
      if (!isMatch) {
        patientUser.incLoginAttempts();
        await patientUser.save();
        throw new UnauthorizedError('E-mail ou senha incorretos');
      }

      if (!patientUser.isActive) {
        throw new UnauthorizedError('Conta desativada');
      }

      const patient = patientUser.patient as any as IPatient;

      if (patient.status !== 'active') {
        throw new UnauthorizedError('Cadastro de paciente inativo');
      }

      // Reset login attempts and update last login
      if (patientUser.loginAttempts > 0) {
        patientUser.resetLoginAttempts();
      }
      patientUser.lastLogin = new Date();
      await patientUser.save();

      const accessToken = this.generateAccessToken(patientUser, patient);

      return {
        success: true,
        data: {
          patient,
          patientUser,
          accessToken,
          expiresIn: this.ACCESS_TOKEN_EXPIRES,
          requiresEmailVerification: !patientUser.emailVerified
        }
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      console.error('Patient login error:', error);
      throw new AppError('Erro ao fazer login', 500);
    }
  }

  // FIXED: Token verification with proper secret
  async verifyToken(token: string): Promise<PatientTokenPayload> {
    try {
      const payload = jwt.verify(token, this.getPatientJwtSecret(), {
        issuer: 'topsmile-patient-portal',
        audience: 'topsmile-patients',
        algorithms: ['HS256']
      }) as PatientTokenPayload;

      if (payload.type !== 'patient') {
        throw new UnauthorizedError('Token não é válido para pacientes');
      }

      return payload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Token inválido');
      } else if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Token expirado');
      }
      throw error;
    }
  }
}

export const patientAuthService = new PatientAuthService();