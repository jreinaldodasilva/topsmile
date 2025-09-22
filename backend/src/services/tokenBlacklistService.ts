import { AppError } from '../types/errors';
import redisClient from '../config/redis';

class TokenBlacklistService {
    private readonly PREFIX = 'blacklist:';

    /**
     * Add a token to the blacklist in Redis with an expiration.
     * @param token - The JWT token to blacklist.
     * @param expiresAt - When the token naturally expires.
     */
    async addToBlacklist(token: string, expiresAt: Date): Promise<void> {
        try {
            if (!token || !expiresAt) {
                throw new AppError('Token e data de expiração são obrigatórios', 400);
            }

            const key = `${this.PREFIX}${token}`;
            const now = new Date();
            const secondsUntilExpiry = Math.floor((expiresAt.getTime() - now.getTime()) / 1000);

            if (secondsUntilExpiry > 0) {
                await redisClient.set(key, '1', 'EX', secondsUntilExpiry);
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error('Error adding token to blacklist:', error);
            throw new AppError('Erro ao adicionar token à blacklist', 500);
        }
    }

    /**
     * Check if a token is blacklisted.
     * @param token - The JWT token to check.
     * @returns true if blacklisted, false otherwise.
     */
    async isBlacklisted(token: string): Promise<boolean> {
        const key = `${this.PREFIX}${token}`;
        const result = await redisClient.get(key);
        return result === '1';
    }

    /**
     * Clear all blacklisted tokens from Redis (for testing purposes).
     */
    async clear(): Promise<void> {
        const stream = redisClient.scanStream({
            match: `${this.PREFIX}*`,
        });
        stream.on('data', (keys) => {
            if (keys.length) {
                const pipeline = redisClient.pipeline();
                keys.forEach((key: any) => {
                    pipeline.del(key);
                });
                pipeline.exec();
            }
        });
        return new Promise((resolve) => {
            stream.on('end', () => resolve());
        });
    }
}

export const tokenBlacklistService = new TokenBlacklistService();