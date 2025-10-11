import logger from '../../utils/logger';
// backend/src/services/auth/staffAuthService.ts
import crypto from 'crypto';
import { User } from '../../models/User';
import { RefreshToken } from '../../models/RefreshToken';
import { Clinic } from '../../models/Clinic';
import { BaseAuthService, BaseTokenPayload, DeviceInfo, AuthResponse } from './baseAuthService';
import { ValidationError, UnauthorizedError, ConflictError, NotFoundError, AppError } from '../../utils/errors/errors';
import { User as IUser } from '@topsmile/types';

export interface StaffTokenPayload extends BaseTokenPayload {
    userId: string;
    email: string;
    role: string;
    clinicId?: string;
    type: 'staff';
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    clinic?: {
        name: string;
        phone: string;
        address: any;
    };
}

export interface LoginData {
    email: string;
    password: string;
}

class StaffAuthService extends BaseAuthService<any, any> {
    constructor() {
        super(
            process.env.ACCESS_TOKEN_EXPIRES || '15m',
            parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '7', 10),
            parseInt(process.env.MAX_REFRESH_TOKENS_PER_USER || '5', 10)
        );
    }

    protected getUserModel() {
        return User;
    }

    protected getRefreshTokenModel() {
        return RefreshToken;
    }

    protected getJwtSecret(): string {
        const secret = process.env.JWT_SECRET;
        if (!secret || secret.length < 16) {
            throw new Error('JWT_SECRET must be at least 16 characters');
        }
        return secret;
    }

    protected getJwtIssuer(): string {
        return 'topsmile-api';
    }

    protected getJwtAudience(): string {
        return 'topsmile-client';
    }

    protected getUserIdField(): string {
        return 'userId';
    }

    protected createTokenPayload(user: any): StaffTokenPayload {
        return {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            clinicId: user.clinic ? user.clinic.toString() : undefined,
            type: 'staff'
        };
    }

    protected validateUserActive(user: any): void {
        if (!user.isActive) {
            throw new UnauthorizedError('Usuário inativo');
        }
    }

    async register(data: RegisterData, deviceInfo?: DeviceInfo): Promise<AuthResponse<IUser, StaffTokenPayload>> {
        if (!data.name || !data.email || !data.password) {
            throw new ValidationError('Nome, e-mail e senha são obrigatórios');
        }

        if (data.password.length < 8) {
            throw new ValidationError('Senha deve ter pelo menos 8 caracteres');
        }

        const existingUser = await User.findOne({ email: data.email.toLowerCase() });
        if (existingUser) {
            throw new ConflictError('Usuário já existe com este e-mail');
        }

        let clinicId;
        if (data.clinic) {
            const clinic = new Clinic({
                name: data.clinic.name,
                email: data.email.toLowerCase(),
                phone: data.clinic.phone,
                address: data.clinic.address,
                subscription: { plan: 'basic', status: 'active', startDate: new Date() },
                settings: {
                    timezone: 'America/Sao_Paulo',
                    workingHours: {
                        monday: { start: '08:00', end: '18:00', isWorking: true },
                        tuesday: { start: '08:00', end: '18:00', isWorking: true },
                        wednesday: { start: '08:00', end: '18:00', isWorking: true },
                        thursday: { start: '08:00', end: '18:00', isWorking: true },
                        friday: { start: '08:00', end: '18:00', isWorking: true },
                        saturday: { start: '08:00', end: '12:00', isWorking: false },
                        sunday: { start: '08:00', end: '12:00', isWorking: false }
                    },
                    appointmentDuration: 60,
                    allowOnlineBooking: true
                }
            });
            const savedClinic = await clinic.save();
            clinicId = savedClinic._id;
        }

        const user = new User({
            name: data.name,
            email: data.email.toLowerCase(),
            password: data.password,
            clinic: clinicId
        });

        const savedUser = await user.save();
        const accessToken = this.generateAccessToken(savedUser);
        const refreshDoc = await this.createRefreshToken(savedUser._id.toString(), deviceInfo);

        savedUser.lastLogin = new Date();
        await savedUser.save();

        return {
            success: true,
            data: {
                user: this.transformUser(savedUser),
                accessToken,
                refreshToken: refreshDoc.token,
                expiresIn: this.ACCESS_TOKEN_EXPIRES
            }
        };
    }

    async login(data: LoginData, deviceInfo?: DeviceInfo): Promise<AuthResponse<IUser, StaffTokenPayload>> {
        if (!data.email || !data.password) {
            throw new ValidationError('E-mail e senha são obrigatórios');
        }

        const user = await User.findOne({ email: data.email.toLowerCase() })
            .select('+password')
            .populate('clinic');

        if (!user) {
            throw new UnauthorizedError('E-mail ou senha inválidos');
        }

        if (user.isLocked()) {
            throw new UnauthorizedError('Conta temporariamente bloqueada. Tente novamente mais tarde.');
        }

        const isMatch = await user.comparePassword(data.password);
        if (!isMatch) {
            await user.incLoginAttempts();
            throw new UnauthorizedError('E-mail ou senha inválidos');
        }

        if (!user.isActive) {
            throw new UnauthorizedError('Conta desativada');
        }

        if (user.loginAttempts > 0) {
            await user.resetLoginAttempts();
        }

        const accessToken = this.generateAccessToken(user);
        const refreshDoc = await this.createRefreshToken(user._id.toString(), deviceInfo);

        user.lastLogin = new Date();
        await user.save();

        return {
            success: true,
            data: {
                user: this.transformUser(user),
                accessToken,
                refreshToken: refreshDoc.token,
                expiresIn: this.ACCESS_TOKEN_EXPIRES
            }
        };
    }

    async getUserById(userId: string): Promise<IUser> {
        if (!userId) {
            throw new ValidationError('ID do usuário é obrigatório');
        }

        const user = await User.findById(userId).populate('clinic', 'name subscription settings');
        if (!user) {
            throw new NotFoundError('Usuário');
        }

        return this.transformUser(user);
    }

    async forgotPassword(email: string): Promise<string> {
        if (!email) {
            throw new ValidationError('E-mail é obrigatório');
        }

        const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordResetToken +passwordResetExpires');
        if (!user) {
            logger.info(`Password reset attempt for non-existent user: ${email}`);
            return '';
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        return resetToken;
    }

    async resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
        if (!token || !newPassword) {
            throw new ValidationError('Token e nova senha são obrigatórios');
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: new Date() }
        }).select('+passwordResetToken +passwordResetExpires');

        if (!user) {
            throw new UnauthorizedError('Token de redefinição de senha inválido ou expirado');
        }

        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        await this.logoutAllDevices(user._id.toString());
        return true;
    }

    private transformUser(user: any): IUser {
        return {
            id: user._id.toString(),
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            clinic: user.clinic ? (typeof user.clinic === 'string' ? user.clinic : user.clinic._id.toString()) : undefined,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}

export const staffAuthService = new StaffAuthService();
