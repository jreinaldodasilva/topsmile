// backend/src/services/authService.ts - FIXED VERSION
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { RefreshToken } from '../models/RefreshToken';
import { SignOptions, JwtPayload } from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { Clinic } from '../models/Clinic';
import { tokenBlacklistService } from './tokenBlacklistService';
import {
    AppError,
    ValidationError,
    UnauthorizedError,
    ConflictError,
    NotFoundError
} from '../types/errors';

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    clinic?: {
        name: string;
        phone: string;
        address: {
            street: string;
            number?: string;
            city?: string;
            state?: string;
            zipCode?: string;
        };
    };
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: true;
    data: {
        user: IUser;
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
    };
}

// FIXED: Proper TypeScript interface for token payload
export interface TokenPayload extends JwtPayload {
    userId: string;
    email: string;
    role: string;
    clinicId?: string;
}

// FIXED: Interface for device information
export interface DeviceInfo {
    userAgent?: string;
    ipAddress?: string;
    deviceId?: string;
}

class AuthService {
    private readonly ACCESS_TOKEN_EXPIRES: string;
    private readonly REFRESH_TOKEN_EXPIRES_DAYS: number;
    private readonly MAX_REFRESH_TOKENS_PER_USER: number;

    constructor() {
        this.ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m';
        this.REFRESH_TOKEN_EXPIRES_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_DAYS || '7', 10);
        this.MAX_REFRESH_TOKENS_PER_USER = parseInt(process.env.MAX_REFRESH_TOKENS_PER_USER || '5', 10);
    }

    // Get JWT secret with runtime environment variable reading
    private getJwtSecret(): string {
        const secret = process.env.JWT_SECRET;

        if (!secret || secret === 'your-secret-key') {
            if (process.env.NODE_ENV === 'production') {
                console.error('FATAL: JWT_SECRET is not configured. Set a strong JWT_SECRET environment variable before starting the app in production.');
                process.exit(1);
            } else {
                // For development and testing, generate a secure, random secret if not provided.
                // This avoids using a predictable default key.
                return crypto.randomBytes(32).toString('hex');
            }
        }
        return secret;
    }

    // FIXED: Generate short-lived access token with proper typing
    private generateAccessToken(payload: TokenPayload): string {
        // Ensure payload is clean and properly typed
        const cleanPayload: TokenPayload = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
            ...(payload.clinicId && { clinicId: payload.clinicId })
        };

        const options: SignOptions = {
            expiresIn: this.ACCESS_TOKEN_EXPIRES as any,
            issuer: 'topsmile-api',
            audience: 'topsmile-client',
            algorithm: 'HS256' // Explicit algorithm for security
        };

        return jwt.sign(cleanPayload, this.getJwtSecret(), options);
    }

    // Generate secure random refresh token string
    private generateRefreshTokenString(): string {
        return crypto.randomBytes(48).toString('hex');
    }

    // FIXED: Create refresh token document in DB with proper typing
    private async createRefreshToken(userId: string, deviceInfo?: DeviceInfo) {
        const tokenStr = this.generateRefreshTokenString();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRES_DAYS);

        await this.cleanupOldRefreshTokens(userId);

        const refreshToken = new RefreshToken({
            token: tokenStr,
            userId,
            expiresAt,
            deviceInfo: deviceInfo || {}
        });

        return await refreshToken.save();
    }

    // Keep only most recent MAX_REFRESH_TOKENS_PER_USER refresh tokens; revoke older ones
    private async cleanupOldRefreshTokens(userId: string): Promise<void> {
        try {
            const tokens = await RefreshToken.find({ 
                userId, 
                isRevoked: false 
            }).sort({ createdAt: -1 });
            
            if (tokens.length >= this.MAX_REFRESH_TOKENS_PER_USER) {
                const toRevoke = tokens.slice(this.MAX_REFRESH_TOKENS_PER_USER - 1);
                const ids = toRevoke.map(t => t._id);
                await RefreshToken.updateMany({ 
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

    // FIXED: Verify access token with proper error handling and typing
    verifyAccessToken(token: string): TokenPayload {
        try {
            if (!token || typeof token !== 'string') {
                throw new UnauthorizedError('Token inválido');
            }

            // Check if token is blacklisted
            if (tokenBlacklistService.isBlacklisted(token)) {
                throw new UnauthorizedError('Token foi revogado');
            }

            const payload = jwt.verify(token, this.getJwtSecret(), {
                issuer: 'topsmile-api',
                audience: 'topsmile-client',
                algorithms: ['HS256'] // Explicit algorithm verification
            });

            // FIXED: Proper type checking instead of unsafe casting
            if (typeof payload === 'string') {
                throw new UnauthorizedError('Formato de token inválido');
            }

            const typedPayload = payload as TokenPayload;

            // Validate required fields
            if (!typedPayload.userId || !typedPayload.email || !typedPayload.role) {
                throw new UnauthorizedError('Token com dados incompletos');
            }

            return typedPayload;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError('Token expirado');
            }

            if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedError('Token inválido');
            }

            console.error('Token verification error:', error as Error);
            throw new UnauthorizedError('Falha na verificação do token');
        }
    }

    // FIXED: Rotate and refresh access token with better error handling
    async refreshAccessToken(refreshTokenString: string): Promise<{ accessToken: string; expiresIn: string }> {
        if (!refreshTokenString) {
            throw new ValidationError('Token de atualização é obrigatório');
        }

        const stored = await RefreshToken.findOne({
            token: refreshTokenString,
            isRevoked: false,
            expiresAt: { $gt: new Date() }
        }).populate('userId');

        if (!stored) {
            throw new UnauthorizedError('Token de atualização inválido ou expirado');
        }

        const user = stored.userId as any;
        if (!user || !user.isActive) {
            // Revoke the token if user is inactive
            stored.isRevoked = true;
            await stored.save();
            throw new UnauthorizedError('Usuário inválido ou inativo');
        }

        // Revoke used refresh token (rotation for security)
        stored.isRevoked = true;
        await stored.save();

        // FIXED: Proper payload construction with type safety
        const payload: TokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            ...(user.clinic && { clinicId: user.clinic.toString() })
        };

        const accessToken = this.generateAccessToken(payload);
        const newRefreshDoc = await this.createRefreshToken(
            user._id.toString(), 
            stored.deviceInfo
        );

        return { 
            accessToken, 
            expiresIn: this.ACCESS_TOKEN_EXPIRES 
        };
    }

    // Logout (revoke a refresh token)
    async logout(refreshTokenString: string): Promise<void> {
        if (!refreshTokenString) return;

        try {
            await RefreshToken.findOneAndUpdate(
                { token: refreshTokenString },
                { isRevoked: true }
            );
        } catch (error) {
            console.error('Error during logout:', error);
            // Don't throw - logout should be graceful
        }
    }

    // Logout with access token (blacklist the access token)
    async logoutWithAccessToken(accessToken: string): Promise<void> {
        if (!accessToken) return;

        try {
            // Decode token to get expiration time
            const decoded = this.verifyAccessToken(accessToken);
            const expiresAt = new Date(decoded.exp! * 1000); // JWT exp is in seconds

            // Add to blacklist
            await tokenBlacklistService.addToBlacklist(accessToken, expiresAt);
        } catch (error) {
            console.error('Error during access token logout:', error);
            // Don't throw - logout should be graceful
        }
    }

    // Logout all devices for a user
    async logoutAllDevices(userId: string): Promise<void> {
        if (!userId) {
            throw new ValidationError('ID do usuário é obrigatório');
        }

        try {
            await RefreshToken.updateMany(
                { userId, isRevoked: false },
                { isRevoked: true }
            );
        } catch (error) {
            console.error('Error during logout all devices:', error as Error);
            throw new AppError('Erro ao fazer logout de todos os dispositivos', 500);
        }
    }

    // FIXED: Register new user with better error handling and validation
    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            // Validate input data
            if (!data.name || !data.email || !data.password) {
                throw new ValidationError('Nome, e-mail e senha são obrigatórios');
            }

            if (data.password.length < 8) {
                throw new ValidationError('Senha deve ter pelo menos 8 caracteres');
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email: data.email.toLowerCase() });
            if (existingUser) {
                throw new ConflictError('Usuário já existe com este e-mail');
            }

            let clinicId;
            if (data.clinic) {
                const clinicData = data.clinic;
                const clinic = new Clinic({
                    name: clinicData.name,
                    email: data.email.toLowerCase(),
                    phone: clinicData.phone,
                    address: clinicData.address,
                    subscription: {
                        plan: 'basic',
                        status: 'active',
                        startDate: new Date()
                    },
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

            // FIXED: Generate tokens with proper typing
            const tokenPayload: TokenPayload = {
                userId: (savedUser._id as any).toString(),
                email: savedUser.email,
                role: savedUser.role,
                ...(savedUser.clinic && { clinicId: savedUser.clinic.toString() })
            };

            const accessToken = this.generateAccessToken(tokenPayload);
            const refreshDoc = await this.createRefreshToken((savedUser._id as any).toString());

            // Update last login
            savedUser.lastLogin = new Date();
            await savedUser.save();

            return {
                success: true,
                data: {
                    user: savedUser,
                    accessToken,
                    refreshToken: refreshDoc.token,
                    expiresIn: this.ACCESS_TOKEN_EXPIRES
                }
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error; // Re-throw our custom errors
            }

            // Handle MongoDB validation errors
            if (error && typeof error === 'object' && 'name' in error && (error as any).name === 'ValidationError') {
                throw new ValidationError('Dados inválidos: ' + (error as any).message);
            }

            // Handle MongoDB duplicate key errors
            if (error && typeof error === 'object' && 'code' in error && (error as any).code === 11000) {
                throw new ConflictError('E-mail já está em uso');
            }

            console.error('Unexpected registration error:', error);
            throw new AppError('Erro interno ao registrar usuário', 500);
        }
    }

    // FIXED: Login user with better error handling and security
    async login(data: LoginData, deviceInfo?: DeviceInfo): Promise<AuthResponse> {
        try {
            // Validate input
            if (!data.email || !data.password) {
                throw new ValidationError('E-mail e senha são obrigatórios');
            }

            const user = await User.findOne({ email: data.email.toLowerCase() })
                .select('+password')
                .populate('clinic');

            if (!user) {
                // Use same message for both cases to prevent user enumeration
                throw new UnauthorizedError('E-mail ou senha inválidos');
            }

            // Check if account is locked
            if (user.isLocked()) {
                throw new UnauthorizedError('Conta temporariamente bloqueada devido a múltiplas tentativas de login. Tente novamente mais tarde.');
            }

            const isMatch = await user.comparePassword(data.password);
            if (!isMatch) {
                // Increment login attempts on failed password
                await user.incLoginAttempts();
                throw new UnauthorizedError('E-mail ou senha inválidos');
            }

            if (!user.isActive) {
                throw new UnauthorizedError('Conta desativada');
            }

            // Reset login attempts on successful login
            if (user.loginAttempts > 0) {
                await user.resetLoginAttempts();
            }

            // FIXED: Proper payload construction
            const tokenPayload: TokenPayload = {
                userId: (user._id as any).toString(),
                email: user.email,
                role: user.role,
                ...(user.clinic && { 
                    clinicId: user.clinic._id?.toString() || user.clinic.toString() 
                })
            };

            const accessToken = this.generateAccessToken(tokenPayload);
            const refreshDoc = await this.createRefreshToken(
                (user._id as any).toString(),
                deviceInfo
            );

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            return {
                success: true,
                data: {
                    user: user,
                    accessToken,
                    refreshToken: refreshDoc.token,
                    expiresIn: this.ACCESS_TOKEN_EXPIRES
                }
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Unexpected login error:', error);
            throw new AppError('Erro interno ao fazer login', 500);
        }
    }

    // Get user by ID with clinic info
    async getUserById(userId: string): Promise<IUser> {
        try {
            if (!userId) {
                throw new ValidationError('ID do usuário é obrigatório');
            }

            const user = await User.findById(userId).populate('clinic', 'name subscription settings');
            if (!user) {
                throw new NotFoundError('Usuário');
            }

            return user;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Error fetching user by ID:', error);
            throw new AppError('Erro ao buscar usuário', 500);
        }
    }

    // FIXED: Change password with better security
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
        try {
            if (!userId || !currentPassword || !newPassword) {
                throw new ValidationError('Todos os campos são obrigatórios');
            }

            if (newPassword.length < 8) {
                throw new ValidationError('Nova senha deve ter pelo menos 8 caracteres');
            }

            if (currentPassword === newPassword) {
                throw new ValidationError('Nova senha deve ser diferente da atual');
            }

            const user = await User.findById(userId).select('+password');
            if (!user) {
                throw new NotFoundError('Usuário');
            }

            const isCurrentPasswordValid = await user.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                throw new UnauthorizedError('Senha atual incorreta');
            }

            user.password = newPassword;
            await user.save();

            // Revoke all refresh tokens to force re-login
            await this.logoutAllDevices(userId);

            return true;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Error changing password:', error);
            throw new AppError('Erro ao alterar senha', 500);
        }
    }

    // Generate a password reset token
    async forgotPassword(email: string): Promise<string> {
        try {
            if (!email) {
                throw new ValidationError('E-mail é obrigatório');
            }

            const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordResetToken +passwordResetExpires');
            if (!user) {
                // To prevent user enumeration, we don't reveal that the user doesn't exist.
                // We can log this event for monitoring purposes.
                console.log(`Password reset attempt for non-existent user: ${email}`);
                return ''; // Return a non-committal response
            }

            // Generate a secure, random token
            const resetToken = crypto.randomBytes(32).toString('hex');

            // Hash the token before saving it to the database for added security
            user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            
            // Set an expiration time for the token (e.g., 10 minutes)
            user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

            await user.save();

            // In a real application, you would send the `resetToken` to the user's email.
            // For this example, we'll return it.
            return resetToken;

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Error in forgotPassword:', error);
            throw new AppError('Erro ao processar a solicitação de redefinição de senha', 500);
        }
    }

    // Reset password with a valid token
    async resetPasswordWithToken(token: string, newPassword: string): Promise<boolean> {
        try {
            if (!token || !newPassword) {
                throw new ValidationError('Token e nova senha são obrigatórios');
            }

            // Hash the token to find it in the database
            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

            const user = await User.findOne({
                passwordResetToken: hashedToken,
                passwordResetExpires: { $gt: new Date() } // Check if the token has not expired
            }).select('+passwordResetToken +passwordResetExpires');

            if (!user) {
                throw new UnauthorizedError('Token de redefinição de senha inválido ou expirado');
            }

            // Set the new password
            user.password = newPassword;
            
            // Clear the reset token fields
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;

            await user.save();

            // Revoke all existing refresh tokens to force re-login on all devices
            await this.logoutAllDevices((user._id as any).toString());

            return true;

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Error in resetPasswordWithToken:', error);
            throw new AppError('Erro ao redefinir a senha', 500);
        }
    }

    // DEPRECATED: Legacy method for backward compatibility - will be removed
    async refreshToken(oldToken: string): Promise<string> {
        console.warn('refreshToken method is deprecated. Use refreshAccessToken instead.');
        try {
            const decoded = this.verifyAccessToken(oldToken);
            const user = await this.getUserById(decoded.userId);

            if (!user || !user.isActive) {
                throw new UnauthorizedError('Usuário inválido ou inativo');
            }

            const payload: TokenPayload = {
                userId: (user._id as any).toString(),
                email: user.email,
                role: user.role,
                ...(user.clinic && {
                    clinicId: user.clinic._id?.toString() || user.clinic.toString()
                })
            };

            return this.generateAccessToken(payload);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Error refreshing token:', error);
            throw new AppError('Erro ao renovar token', 500);
        }
    }
}

export const authService = new AuthService();