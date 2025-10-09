// backend/src/services/auth/baseAuthService.ts
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { Model, Document } from 'mongoose';
import { tokenBlacklistService } from './tokenBlacklistService';
import { ValidationError, UnauthorizedError, AppError } from '../../utils/errors/errors';

export interface BaseTokenPayload {
    userId: string;
    email: string;
    type: 'staff' | 'patient';
}

export interface DeviceInfo {
    userAgent?: string;
    ipAddress?: string;
    deviceId?: string;
}

export interface AuthResponse<TUser, TPayload> {
    success: true;
    data: {
        user: TUser;
        accessToken: string;
        refreshToken: string;
        expiresIn: string;
        additionalData?: any;
    };
}

export abstract class BaseAuthService<TUser extends Document, TRefreshToken extends Document> {
    protected readonly ACCESS_TOKEN_EXPIRES: string;
    protected readonly REFRESH_TOKEN_EXPIRES_DAYS: number;
    protected readonly MAX_REFRESH_TOKENS_PER_USER: number;

    constructor(
        accessTokenExpires: string = '15m',
        refreshTokenExpiresDays: number = 7,
        maxRefreshTokens: number = 5
    ) {
        this.ACCESS_TOKEN_EXPIRES = accessTokenExpires;
        this.REFRESH_TOKEN_EXPIRES_DAYS = refreshTokenExpiresDays;
        this.MAX_REFRESH_TOKENS_PER_USER = maxRefreshTokens;
    }

    protected abstract getUserModel(): Model<TUser>;
    protected abstract getRefreshTokenModel(): Model<TRefreshToken>;
    protected abstract getJwtSecret(): string;
    protected abstract getJwtIssuer(): string;
    protected abstract getJwtAudience(): string;
    protected abstract createTokenPayload(user: TUser): BaseTokenPayload;
    protected abstract validateUserActive(user: TUser): void;

    protected generateAccessToken(user: TUser): string {
        const payload = this.createTokenPayload(user);
        return jwt.sign(payload, this.getJwtSecret(), {
            expiresIn: this.ACCESS_TOKEN_EXPIRES,
            issuer: this.getJwtIssuer(),
            audience: this.getJwtAudience(),
            algorithm: 'HS256'
        } as SignOptions);
    }

    protected generateRefreshTokenString(): string {
        return crypto.randomBytes(48).toString('hex');
    }

    protected async createRefreshToken(userId: string, deviceInfo?: DeviceInfo): Promise<TRefreshToken> {
        const tokenStr = this.generateRefreshTokenString();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + this.REFRESH_TOKEN_EXPIRES_DAYS);

        await this.cleanupOldRefreshTokens(userId);

        const RefreshTokenModel = this.getRefreshTokenModel();
        const refreshToken = new RefreshTokenModel({
            token: tokenStr,
            [this.getUserIdField()]: userId,
            expiresAt,
            deviceInfo: deviceInfo || {}
        });

        return await refreshToken.save();
    }

    protected abstract getUserIdField(): string;

    protected async cleanupOldRefreshTokens(userId: string): Promise<void> {
        try {
            const RefreshTokenModel = this.getRefreshTokenModel();
            const tokens = await RefreshTokenModel.find({
                [this.getUserIdField()]: userId,
                isRevoked: false
            }).sort({ createdAt: -1 });

            if (tokens.length >= this.MAX_REFRESH_TOKENS_PER_USER) {
                const toRevoke = tokens.slice(this.MAX_REFRESH_TOKENS_PER_USER - 1);
                const ids = toRevoke.map(t => t._id);
                await RefreshTokenModel.updateMany(
                    { _id: { $in: ids } },
                    { isRevoked: true }
                );
            }
        } catch (error) {
            console.error('Error cleaning up old refresh tokens:', error);
        }
    }

    async verifyToken(token: string): Promise<BaseTokenPayload> {
        try {
            const payload = jwt.verify(token, this.getJwtSecret(), {
                issuer: this.getJwtIssuer(),
                audience: this.getJwtAudience(),
                algorithms: ['HS256']
            }) as BaseTokenPayload;

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

    async refreshAccessToken(refreshTokenString: string): Promise<{ accessToken: string; refreshToken: string; expiresIn: string }> {
        if (!refreshTokenString) {
            throw new ValidationError('Token de atualização é obrigatório');
        }

        const RefreshTokenModel = this.getRefreshTokenModel();
        const stored = await RefreshTokenModel.findOne({
            token: refreshTokenString,
            isRevoked: false,
            expiresAt: { $gt: new Date() }
        }).populate(this.getUserIdField());

        if (!stored) {
            throw new UnauthorizedError('Token de atualização inválido ou expirado');
        }

        const user = (stored as any)[this.getUserIdField()] as TUser;
        if (!user) {
            throw new UnauthorizedError('Usuário não encontrado');
        }

        this.validateUserActive(user);

        // Revoke used refresh token (rotation)
        (stored as any).isRevoked = true;
        await stored.save();

        // Blacklist old token
        await tokenBlacklistService.addToBlacklist(refreshTokenString, (stored as any).expiresAt);

        const accessToken = this.generateAccessToken(user);
        const newRefreshToken = await this.createRefreshToken(
            (user._id as any).toString(),
            (stored as any).deviceInfo
        );

        return {
            accessToken,
            refreshToken: (newRefreshToken as any).token,
            expiresIn: this.ACCESS_TOKEN_EXPIRES
        };
    }

    async logout(refreshTokenString: string): Promise<void> {
        if (!refreshTokenString) return;

        try {
            const RefreshTokenModel = this.getRefreshTokenModel();
            await RefreshTokenModel.findOneAndUpdate(
                { token: refreshTokenString },
                { isRevoked: true }
            );
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }

    async logoutAllDevices(userId: string): Promise<void> {
        if (!userId) {
            throw new ValidationError('ID do usuário é obrigatório');
        }

        try {
            const RefreshTokenModel = this.getRefreshTokenModel();
            await RefreshTokenModel.updateMany(
                { [this.getUserIdField()]: userId, isRevoked: false },
                { isRevoked: true }
            );
        } catch (error) {
            console.error('Error during logout all devices:', error);
            throw new AppError('Erro ao fazer logout de todos os dispositivos', 500);
        }
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        try {
            const UserModel = this.getUserModel();
            const user = await UserModel.findById(userId).select('+password');

            if (!user) {
                throw new UnauthorizedError('Usuário não encontrado');
            }

            const isMatch = await (user as any).comparePassword(currentPassword);
            if (!isMatch) {
                throw new UnauthorizedError('Senha atual incorreta');
            }

            (user as any).password = newPassword;
            await user.save();
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error('Error changing password:', error);
            throw new AppError('Erro ao alterar senha', 500);
        }
    }
}
