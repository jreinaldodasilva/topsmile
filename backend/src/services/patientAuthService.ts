import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { PatientUser, IPatientUser } from '../models/PatientUser';
import { Patient as IPatient } from '@topsmile/types';
import { Patient as PatientModel } from '../models/Patient';
import { PatientRefreshToken } from '../models/PatientRefreshToken';
import { 
  ValidationError, 
  UnauthorizedError, 
  ConflictError, 
  NotFoundError,
  AppError 
} from '../types/errors';

export interface PatientRegistrationData {
  patientId?: string;
  firstName?: string;
  lastName?: string;
  name?: string; // Legacy support
  email: string;
  phone?: string;
  password: string;
  clinicId?: string;
  dateOfBirth?: Date;
  birthDate?: string; // Legacy support
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
    refreshToken: string;
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

export interface DeviceInfo {
    userAgent?: string;
    ipAddress?: string;
    deviceId?: string;
}

class PatientAuthService {
  private readonly ACCESS_TOKEN_EXPIRES = process.env.PATIENT_ACCESS_TOKEN_EXPIRES || '15m';
  private readonly REFRESH_TOKEN_EXPIRES_DAYS = parseInt(process.env.PATIENT_REFRESH_TOKEN_EXPIRES_DAYS || '7', 10);
  private readonly MAX_REFRESH_TOKENS_PER_USER = parseInt(process.env.MAX_REFRESH_TOKENS_PER_USER || '5', 10);

  // FIXED: Separate JWT secret for patients
  private getPatientJwtSecret(): string {
    const secret = process.env.PATIENT_JWT_SECRET;

    if (!secret || secret === 'your-secret-key') {
      if (process.env.NODE_ENV === 'production') {
        console.error('FATAL: PATIENT_JWT_SECRET must be set in production and be a strong, unique secret.');
        process.exit(1);
      }
      // For development, generate a temporary secret if not provided.
      return process.env.PATIENT_JWT_SECRET || crypto.randomBytes(32).toString('hex');
    }

    // Ensure patient and staff secrets are different in production
    if (process.env.NODE_ENV === 'production' && secret === process.env.JWT_SECRET) {
      console.error('FATAL: PATIENT_JWT_SECRET must be different from JWT_SECRET in production.');
      process.exit(1);
    }

    return secret;
  }

  // FIXED: Generate patient-specific tokens
  private generateAccessToken(patientUser: IPatientUser, patient: IPatient): string {
    const payload: PatientTokenPayload = {
      patientUserId: (patientUser._id as any).toString(),
      patientId: (patient._id as any).toString(),
      email: patientUser.email,
      clinicId: patient.clinic ? (patient.clinic as any).toString() : '',
      type: 'patient'
    };

    return jwt.sign(payload, this.getPatientJwtSecret(), {
      expiresIn: this.ACCESS_TOKEN_EXPIRES,
      issuer: 'topsmile-patient-portal',
      audience: 'topsmile-patients'
    } as SignOptions);
  }

  private generateRefreshTokenString(): string {
    return crypto.randomBytes(48).toString('hex');
  }

  private async createRefreshToken(patientUserId: string, deviceInfo?: DeviceInfo) {
    const tokenStr = this.generateRefreshTokenString();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRES_DAYS);

    await this.cleanupOldRefreshTokens(patientUserId);

    const refreshToken = new PatientRefreshToken({
        token: tokenStr,
        patientUserId,
        expiresAt,
        deviceInfo: deviceInfo || {}
    });

    return await refreshToken.save();
  }

  private async cleanupOldRefreshTokens(patientUserId: string): Promise<void> {
    try {
        const tokens = await PatientRefreshToken.find({ 
            patientUserId, 
            isRevoked: false 
        }).sort({ createdAt: -1 });
        
        if (tokens.length >= this.MAX_REFRESH_TOKENS_PER_USER) {
            const toRevoke = tokens.slice(this.MAX_REFRESH_TOKENS_PER_USER - 1);
            const ids = toRevoke.map(t => t._id);
            await PatientRefreshToken.updateMany({ 
                _id: { $in: ids } 
            }, { 
                isRevoked: true 
            });
        }
    } catch (error) {
        console.error('Error cleaning up old refresh tokens:', error);
        // Don't throw - this is a maintenance operation
    }
  }

  // FIXED: Complete registration with patient creation or linking
  async register(data: PatientRegistrationData, deviceInfo?: DeviceInfo): Promise<PatientAuthResponse> {
    try {
      // Handle legacy name field
      const firstName = data.firstName || (data.name ? data.name.split(' ')[0] : '');
      const lastName = data.lastName || (data.name ? data.name.split(' ').slice(1).join(' ') : '');
      const clinicId = data.clinicId;
      const phone = data.phone;
      
      // Validate input - only require fields for new patient creation
      if (!data.patientId && (!firstName || !lastName || !phone || !clinicId)) {
        throw new ValidationError('Nome, sobrenome, telefone e clínica são obrigatórios para novos pacientes');
      }
      
      if (!data.email || !data.password) {
        throw new ValidationError('E-mail e senha são obrigatórios');
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

      let patient: IPatient | null = null;

      if (data.patientId) {
        // FIXED: Link to existing patient
        const existingPatient = await PatientModel.findOne({
          _id: data.patientId,
          clinic: data.clinicId,
          status: 'active'
        }).populate('clinic');

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
        // Create new patient record
        const newPatientModel = new PatientModel({
          firstName,
          lastName,
          email,
          phone,
          dateOfBirth: data.dateOfBirth || (data.birthDate ? new Date(data.birthDate) : undefined),
          clinic: clinicId,
          address: {
            zipCode: '00000-000' // Minimal required address
          },
          medicalHistory: {
            allergies: [],
            medications: [],
            conditions: [],
            notes: ''
          },
          status: 'active'
        });

        await newPatientModel.save();
        const createdPatient = await PatientModel.findById(newPatientModel._id).populate('clinic');
        if (!createdPatient) {
          throw new AppError('Failed to create patient', 500);
        }
        patient = createdPatient;
      }

      if (!patient) {
        throw new AppError('Patient not found or created', 500);
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
      const refreshToken = await this.createRefreshToken(savedPatientUser._id as any, deviceInfo);

      // TODO: Send verification email
      console.log(`Email verification token for ${email}: ${verificationToken}`);

      return {
        success: true,
        data: {
          patient,
          patientUser,
          accessToken,
          refreshToken: refreshToken.token,
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
  async login(data: PatientLoginData, deviceInfo?: DeviceInfo): Promise<PatientAuthResponse> {
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
        await patientUser.incLoginAttempts();
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
      const refreshToken = await this.createRefreshToken(patientUser._id as any, deviceInfo);

      return {
        success: true,
        data: {
          patient,
          patientUser,
          accessToken,
          refreshToken: refreshToken.token,
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

  async refreshAccessToken(refreshTokenString: string): Promise<{ accessToken: string; expiresIn: string }> {
    if (!refreshTokenString) {
        throw new ValidationError('Token de atualização é obrigatório');
    }

    const stored = await PatientRefreshToken.findOne({
        token: refreshTokenString,
        isRevoked: false,
        expiresAt: { $gt: new Date() }
    }).populate('patientUserId');

    if (!stored) {
        throw new UnauthorizedError('Token de atualização inválido ou expirado');
    }

    const patientUser = stored.patientUserId as any;
    if (!patientUser || !patientUser.isActive) {
        // Revoke the token if user is inactive
        stored.isRevoked = true;
        await stored.save();
        throw new UnauthorizedError('Usuário inválido ou inativo');
    }

    const patient = await PatientModel.findById(patientUser.patient);
    if(!patient) {
        throw new UnauthorizedError('Paciente não encontrado');
    }

    // Revoke used refresh token (rotation for security)
    stored.isRevoked = true;
    await stored.save();

    const accessToken = this.generateAccessToken(patientUser, patient);
    await this.createRefreshToken(
        patientUser._id.toString(), 
        stored.deviceInfo
    );

    return { 
        accessToken, 
        expiresIn: this.ACCESS_TOKEN_EXPIRES 
    };
  }

  async logout(refreshTokenString: string): Promise<void> {
    if (!refreshTokenString) return;

    try {
        await PatientRefreshToken.findOneAndUpdate(
            { token: refreshTokenString },
            { isRevoked: true }
        );
    } catch (error) {
        console.error('Error during logout:', error);
        // Don't throw - logout should be graceful
    }
  }

  async logoutAllDevices(patientUserId: string): Promise<void> {
    if (!patientUserId) {
        throw new ValidationError('ID do usuário é obrigatório');
    }

    try {
        await PatientRefreshToken.updateMany(
            { patientUserId, isRevoked: false },
            { isRevoked: true }
        );
    } catch (error) {
        console.error('Error during logout all devices:', error as Error);
        throw new AppError('Erro ao fazer logout de todos os dispositivos', 500);
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

  async updateProfile(patientId: string, updates: { firstName?: string; lastName?: string; name?: string; phone?: string; dateOfBirth?: Date; birthDate?: string }): Promise<IPatient> {
    try {
      const patient = await PatientModel.findById(patientId);

      if (!patient) {
        throw new NotFoundError('Paciente não encontrado');
      }

      // Handle legacy name field
      if (updates.name) {
        const nameParts = updates.name.split(' ');
        patient.firstName = nameParts[0];
        patient.lastName = nameParts.slice(1).join(' ');
      }
      if (updates.firstName) {
        patient.firstName = updates.firstName;
      }
      if (updates.lastName) {
        patient.lastName = updates.lastName;
      }
      if (updates.phone) {
        patient.phone = updates.phone;
      }
      if (updates.dateOfBirth) {
        patient.dateOfBirth = updates.dateOfBirth;
      }
      if (updates.birthDate) {
        patient.dateOfBirth = new Date(updates.birthDate);
      }

      return await patient.save();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error updating patient profile:', error);
      throw new AppError('Erro ao atualizar perfil do paciente', 500);
    }
  }

  async changePassword(patientUserId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const patientUser = await PatientUser.findById(patientUserId).select('+password');

      if (!patientUser) {
        throw new NotFoundError('Usuário do paciente não encontrado');
      }

      const isMatch = await patientUser.comparePassword(currentPassword);
      if (!isMatch) {
        throw new UnauthorizedError('Senha atual incorreta');
      }

      patientUser.password = newPassword;
      await patientUser.save();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error changing patient password:', error);
      throw new AppError('Erro ao alterar senha do paciente', 500);
    }
  }

  async resendVerificationEmail(email: string): Promise<void> {
    try {
      const patientUser = await PatientUser.findOne({ email: email.toLowerCase() });

      if (!patientUser) {
        // To prevent email enumeration, we don't throw an error here.
        // We just log it and return.
        console.log(`Verification email resend attempt for non-existent user: ${email}`);
        return;
      }

      if (patientUser.emailVerified) {
        throw new ConflictError('Este e-mail já foi verificado.');
      }

      // Generate a new verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      patientUser.verificationToken = verificationToken;
      await patientUser.save();

      // TODO: Send verification email
      console.log(`New email verification token for ${email}: ${verificationToken}`);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error resending verification email:', error);
      throw new AppError('Erro ao reenviar e-mail de verificação', 500);
    }
  }

  async deleteAccount(patientUserId: string, password: string): Promise<void> {
    try {
      const patientUser = await PatientUser.findById(patientUserId).select('+password');

      if (!patientUser) {
        throw new NotFoundError('Usuário do paciente não encontrado');
      }

      const isMatch = await patientUser.comparePassword(password);
      if (!isMatch) {
        throw new UnauthorizedError('Senha incorreta');
      }

      await PatientUser.findByIdAndDelete(patientUserId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Error deleting patient account:', error);
      throw new AppError('Erro ao deletar conta do paciente', 500);
    }
  }
}

export const patientAuthService = new PatientAuthService();