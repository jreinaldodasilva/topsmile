// backend/src/services/authService.ts
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { RefreshToken } from '../models/RefreshToken';
import { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, IUser } from '../models/User';
import { Clinic } from '../models/Clinic';

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
            zip?: string;
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
        token: string;
        expiresIn: string;
    };
}

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
    clinicId?: string;
}

class AuthService {
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    private readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

    // Generate JWT token
    private generateToken(payload: TokenPayload): string {
        const cleanPayload: TokenPayload = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
            ...(payload.clinicId ? { clinicId: payload.clinicId } : {})
        };

        const options: SignOptions = {
            expiresIn: this.JWT_EXPIRES_IN as SignOptions['expiresIn'],
            issuer: 'topsmile-api',
            audience: 'topsmile-client'
        };

        return jwt.sign(cleanPayload as any, this.JWT_SECRET as string, options);
    }

    // Verify JWT token
    verifyToken(token: string): TokenPayload {
        try {
            return jwt.verify(token, this.JWT_SECRET, {
                issuer: 'topsmile-api',
                audience: 'topsmile-client'
            }) as TokenPayload;
        } catch (error) {
            throw new Error('Token inválido');
        }
    }

    private readonly ACCESS_TOKEN_EXPIRES = '15m';
    private readonly REFRESH_TOKEN_EXPIRES_DAYS = 7;
    private readonly MAX_REFRESH_TOKENS_PER_USER = 5;

    // Generate short-lived access token
    private generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, this.JWT_SECRET as string, {
            expiresIn: this.ACCESS_TOKEN_EXPIRES,
            issuer: 'topsmile-api',
            audience: 'topsmile-client'
        } as jwt.SignOptions);
    }

    // Generate secure random refresh token string
    private generateRefreshTokenString(): string {
        return crypto.randomBytes(48).toString('hex');
    }

    // Create refresh token document in DB and cleanup old tokens
    private async createRefreshToken(userId: string, deviceInfo?: any) {
        const tokenStr = this.generateRefreshTokenString();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRES_DAYS);

        await this.cleanupOldRefreshTokens(userId);

        const refreshToken = new RefreshToken({
            token: tokenStr,
            userId,
            expiresAt,
            deviceInfo
        });

        return await refreshToken.save();
    }

    // Rotate and refresh access token using a refresh token string
    async refreshAccessToken(refreshTokenString: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: string }> {
        const stored = await RefreshToken.findOne({
            token: refreshTokenString,
            isRevoked: false,
            expiresAt: { $gt: new Date() }
        }).populate('userId');

        if (!stored) {
            throw new Error('Token de atualização inválido ou expirado');
        }

        const user = (stored.userId as any);
        if (!user || !user.isActive) {
            throw new Error('Usuário inválido ou inativo');
        }

        // Revoke used refresh token (rotation)
        stored.isRevoked = true;
        await stored.save();

        const payload: TokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
            ...(user.clinic ? { clinicId: (user.clinic as any)._id?.toString?.() ?? user.clinic?.toString?.() } : {})
        };

        const accessToken = this.generateAccessToken(payload);
        const newRefreshDoc = await this.createRefreshToken(user._id.toString(), stored.deviceInfo);

        return { accessToken, refreshToken: newRefreshDoc.token, expiresIn: this.ACCESS_TOKEN_EXPIRES };
    }

    // Logout (revoke a refresh token)
    async logout(refreshTokenString: string): Promise<void> {
        if (!refreshTokenString) return;
        await RefreshToken.findOneAndUpdate({ token: refreshTokenString }, { isRevoked: true });
    }

    // Logout all devices for a user
    async logoutAllDevices(userId: string): Promise<void> {
        await RefreshToken.updateMany({ userId, isRevoked: false }, { isRevoked: true });
    }

    // Keep only most recent MAX_REFRESH_TOKENS_PER_USER refresh tokens; revoke older ones
    private async cleanupOldRefreshTokens(userId: string): Promise<void> {
        const tokens = await RefreshToken.find({ userId, isRevoked: false }).sort({ createdAt: -1 });
        if (tokens.length > this.MAX_REFRESH_TOKENS_PER_USER) {
            const toRevoke = tokens.slice(this.MAX_REFRESH_TOKENS_PER_USER);
            const ids = toRevoke.map(t => t._id);
            await RefreshToken.updateMany({ _id: { $in: ids } }, { isRevoked: true });
        }
    }

    // Register new user with clinic
    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email: data.email });
            if (existingUser) {
                throw new Error('Usuário já existe');
            }

            let clinicId;
            if (data.clinic) {
                const clinic = new Clinic({
                    name: data.clinic.name,
                    email: data.email, // Use user email as clinic email
                    phone: data.clinic.phone,
                    address: data.clinic.address,
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
                email: data.email,
                password: data.password,
                clinic: clinicId
            });

            const savedUser = await user.save();

            // Generate token
            const tokenPayload = {
                userId: (user._id as any).toString(),
                email: user.email,
                role: user.role,
                clinicId: user.clinic?._id?.toString()
            };

            const accessToken = this.generateAccessToken(tokenPayload);
            const refreshDoc = await this.createRefreshToken((user._id as any).toString());

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            return {
                success: true,
                data: {
                    user: savedUser as any,
                    token: accessToken,
                    expiresIn: this.ACCESS_TOKEN_EXPIRES
                }
            } as any;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao registrar usuário');
        }
    }

    // Login user and return access + refresh tokens
// backend/src/services/authService.ts - Standardized login method

async login(data: LoginData, deviceInfo?: any): Promise<{
  success: true;
  data: {
    user: IUser;
    accessToken: string;
    refreshToken: string;
    expiresIn: string;
  };
}> {
  try {
    const user = await User.findOne({ email: data.email })
      .select('+password')
      .populate('clinic');
    
    if (!user) {
      throw new Error('E-mail ou senha inválidos');
    }

    const isMatch = await user.comparePassword(data.password);
    if (!isMatch) {
      throw new Error('E-mail ou senha inválidos');
    }

    if (!user.isActive) {
      throw new Error('Usuário inativo');
    }

    const tokenPayload: TokenPayload = {
      userId: (user._id as any).toString(),
      email: user.email,
      role: user.role,
      clinicId: user.clinic?._id?.toString()
    };

    const accessToken = this.generateAccessToken(tokenPayload);
    const refreshDoc = await this.createRefreshToken(
      (user._id as any).toString(), 
      deviceInfo
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return consistent format
    return {
      success: true,
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken: refreshDoc.token,
        expiresIn: this.ACCESS_TOKEN_EXPIRES
      }
    };
  } catch (error) {
    throw error instanceof Error ? error : new Error('Erro ao fazer login');
  }
}
    // Get user by ID with clinic info
    async getUserById(userId: string): Promise<IUser | null> {
        try {
            return await User.findById(userId).populate('clinic', 'name subscription settings');
        } catch (error) {
            throw new Error('Erro ao buscar usuário');
        }
    }

    // Change password
    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
        try {
            const user = await User.findById(userId).select('+password');
            if (!user) {
                throw new Error('Usuário não encontrado');
            }

            const isCurrentPasswordValid = await user.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                throw new Error('Senha atual incorreta');
            }

            user.password = newPassword;
            await user.save();

            return true;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao alterar senha');
        }
    }

    // Reset password (for forgot password feature)
    async resetPassword(email: string): Promise<string> {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('E-mail não encontrado');
            }

            // Generate temporary password
            const tempPassword = Math.random().toString(36).slice(-8);
            user.password = tempPassword;
            await user.save();

            return tempPassword;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Erro ao resetar senha');
        }
    }

    // Existing convenience method (kept to preserve other code paths)
    async refreshToken(oldToken: string): Promise<string> {
        try {
            const decoded = this.verifyToken(oldToken);
            const user = await this.getUserById(decoded.userId);

            if (!user || !user.isActive) {
                throw new Error('Usuário inválido');
            }

            return this.generateToken({
                userId: (user as any)._id.toString(),
                email: user.email,
                role: user.role,
                clinicId: user.clinic?._id.toString()
            });
        } catch (error) {
            throw new Error('Erro ao renovar token');
        }
    }
}

export const authService = new AuthService();
