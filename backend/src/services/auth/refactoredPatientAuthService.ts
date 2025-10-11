import logger from '../../utils/logger';
// backend/src/services/auth/refactoredPatientAuthService.ts
import crypto from 'crypto';
import { PatientUser, IPatientUser } from '../../models/PatientUser';
import { Patient } from '../../models/Patient';
import { PatientRefreshToken } from '../../models/PatientRefreshToken';
import { BaseAuthService, BaseTokenPayload, DeviceInfo, AuthResponse } from './baseAuthService';
import { ValidationError, UnauthorizedError, ConflictError, NotFoundError, AppError } from '../../utils/errors/errors';

export interface PatientTokenPayload extends BaseTokenPayload {
  patientUserId: string;
  patientId: string;
  clinicId: string;
  userId: string;
}

export interface PatientRegistrationData {
  patientId?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  phone?: string;
  password: string;
  clinicId?: string;
  dateOfBirth?: Date;
  birthDate?: string;
}

export interface PatientLoginData {
  email: string;
  password: string;
}

class RefactoredPatientAuthService extends BaseAuthService<IPatientUser, any> {
  constructor() {
    super(
      process.env.PATIENT_ACCESS_TOKEN_EXPIRES || '15m',
      parseInt(process.env.PATIENT_REFRESH_TOKEN_EXPIRES_DAYS || '7', 10),
      parseInt(process.env.MAX_REFRESH_TOKENS_PER_USER || '5', 10)
    );
  }

  protected getUserModel() {
    return PatientUser;
  }

  protected getRefreshTokenModel() {
    return PatientRefreshToken;
  }

  protected getJwtSecret(): string {
    const secret = process.env.PATIENT_JWT_SECRET;
    if (!secret || secret === 'your-secret-key') {
      if (process.env.NODE_ENV === 'production') {
        logger.error('FATAL: PATIENT_JWT_SECRET must be set in production');
        process.exit(1);
      }
      return process.env.PATIENT_JWT_SECRET || crypto.randomBytes(32).toString('hex');
    }
    if (process.env.NODE_ENV === 'production' && secret === process.env.JWT_SECRET) {
      logger.error('FATAL: PATIENT_JWT_SECRET must be different from JWT_SECRET');
      process.exit(1);
    }
    return secret;
  }

  protected getJwtIssuer(): string {
    return 'topsmile-patient-portal';
  }

  protected getJwtAudience(): string {
    return 'topsmile-patients';
  }

  protected getUserIdField(): string {
    return 'patientUserId';
  }

  protected createTokenPayload(user: IPatientUser): PatientTokenPayload {
    const patient = user.patient as any;
    return {
      userId: (user._id as any).toString(),
      patientUserId: (user._id as any).toString(),
      patientId: patient._id.toString(),
      email: user.email,
      clinicId: patient.clinic ? patient.clinic.toString() : '',
      type: 'patient'
    };
  }

  protected validateUserActive(user: IPatientUser): void {
    if (!user.isActive) {
      throw new UnauthorizedError('Conta desativada');
    }
  }

  async register(data: PatientRegistrationData, deviceInfo?: DeviceInfo): Promise<any> {
    const firstName = data.firstName || (data.name ? data.name.split(' ')[0] : '');
    const lastName = data.lastName || (data.name ? data.name.split(' ').slice(1).join(' ') : '');
    
    if (!data.patientId && (!firstName || !lastName || !data.phone || !data.clinicId)) {
      throw new ValidationError('Nome, sobrenome, telefone e clínica são obrigatórios para novos pacientes');
    }
    
    if (!data.email || !data.password) {
      throw new ValidationError('E-mail e senha são obrigatórios');
    }

    if (data.password.length < 8) {
      throw new ValidationError('Senha deve ter pelo menos 8 caracteres');
    }

    const email = data.email.toLowerCase();
    const existingPatientUser = await PatientUser.findOne({ email });
    if (existingPatientUser) {
      throw new ConflictError('Já existe uma conta com este e-mail');
    }

    let patient: any = null;

    if (data.patientId) {
      const existingPatient = await Patient.findOne({
        _id: data.patientId,
        clinic: data.clinicId,
        status: 'active'
      }).populate('clinic');

      if (!existingPatient) {
        throw new NotFoundError('Paciente não encontrado ou inativo');
      }

      const hasUserAccount = await PatientUser.findOne({ patient: data.patientId });
      if (hasUserAccount) {
        throw new ConflictError('Este paciente já possui uma conta no portal');
      }
      patient = existingPatient;
    } else {
      const newPatient = new Patient({
        firstName,
        lastName,
        email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth || (data.birthDate ? new Date(data.birthDate) : undefined),
        clinic: data.clinicId,
        address: { zipCode: '00000-000' },
        medicalHistory: { allergies: [], medications: [], conditions: [], notes: '' },
        status: 'active'
      });

      await newPatient.save();
      const createdPatient = await Patient.findById(newPatient._id).populate('clinic');
      if (!createdPatient) {
        throw new AppError('Failed to create patient', 500);
      }
      patient = createdPatient;
    }

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
    const accessToken = this.generateAccessToken(savedPatientUser);
    const refreshToken = await this.createRefreshToken((savedPatientUser._id as any).toString(), deviceInfo);

    logger.info(`Email verification token for ${email}: ${verificationToken}`);

    return {
      success: true,
      data: {
        user: patient,
        patient,
        patientUser: savedPatientUser,
        accessToken,
        refreshToken: refreshToken.token,
        expiresIn: this.ACCESS_TOKEN_EXPIRES,
        requiresEmailVerification: !savedPatientUser.emailVerified
      }
    };
  }

  async login(data: PatientLoginData, deviceInfo?: DeviceInfo): Promise<any> {
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

    const patient = patientUser.patient as any;
    if (patient.status !== 'active') {
      throw new UnauthorizedError('Cadastro de paciente inativo');
    }

    if (patientUser.loginAttempts > 0) {
      patientUser.resetLoginAttempts();
    }
    patientUser.lastLogin = new Date();
    await patientUser.save();

    const accessToken = this.generateAccessToken(patientUser);
    const refreshToken = await this.createRefreshToken((patientUser._id as any).toString(), deviceInfo);

    return {
      success: true,
      data: {
        user: patient,
        patient,
        patientUser,
        accessToken,
        refreshToken: refreshToken.token,
        expiresIn: this.ACCESS_TOKEN_EXPIRES,
        requiresEmailVerification: !patientUser.emailVerified
      }
    };
  }

  async verifyToken(token: string): Promise<PatientTokenPayload> {
    const payload = await super.verifyToken(token) as PatientTokenPayload;
    if (payload.type !== 'patient') {
      throw new UnauthorizedError('Token não é válido para pacientes');
    }
    return payload;
  }

  async updateProfile(patientId: string, updates: any): Promise<any> {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      throw new NotFoundError('Paciente não encontrado');
    }

    if (updates.name) {
      const nameParts = updates.name.split(' ');
      patient.firstName = nameParts[0];
      patient.lastName = nameParts.slice(1).join(' ');
    }
    if (updates.firstName) patient.firstName = updates.firstName;
    if (updates.lastName) patient.lastName = updates.lastName;
    if (updates.phone) patient.phone = updates.phone;
    if (updates.dateOfBirth) patient.dateOfBirth = updates.dateOfBirth;
    if (updates.birthDate) patient.dateOfBirth = new Date(updates.birthDate);

    return await patient.save();
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const patientUser = await PatientUser.findOne({ email: email.toLowerCase() });
    if (!patientUser) {
      logger.info(`Verification email resend attempt for non-existent user: ${email}`);
      return;
    }

    if (patientUser.emailVerified) {
      throw new ConflictError('Este e-mail já foi verificado.');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    patientUser.verificationToken = verificationToken;
    await patientUser.save();

    logger.info(`New email verification token for ${email}: ${verificationToken}`);
  }

  async deleteAccount(patientUserId: string, password: string): Promise<void> {
    const patientUser = await PatientUser.findById(patientUserId).select('+password');
    if (!patientUser) {
      throw new NotFoundError('Usuário do paciente não encontrado');
    }

    const isMatch = await patientUser.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Senha incorreta');
    }

    await PatientUser.findByIdAndDelete(patientUserId);
  }
}

export const refactoredPatientAuthService = new RefactoredPatientAuthService();
