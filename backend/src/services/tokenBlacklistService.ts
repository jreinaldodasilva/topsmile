import { AppError } from '../types/errors';

interface BlacklistedToken {
    token: string;
    expiresAt: Date;
    blacklistedAt: Date;
}

class TokenBlacklistService {
    private blacklist: Map<string, BlacklistedToken> = new Map();
    private readonly CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
    private intervalId: NodeJS.Timeout | null = null;

    constructor() {
        // Clean up expired tokens periodically, but not in Jest tests
        if (!process.env.JEST_WORKER_ID) {
            this.intervalId = setInterval(() => {
                this.cleanup();
            }, this.CLEANUP_INTERVAL);
        }
    }

    /**
     * Add a token to the blacklist
     * @param token - The JWT token to blacklist
     * @param expiresAt - When the token naturally expires
     */
    async addToBlacklist(token: string, expiresAt: Date): Promise<void> {
        try {
            if (!token || !expiresAt) {
                throw new AppError('Token e data de expiração são obrigatórios', 400);
            }

            const blacklistedToken: BlacklistedToken = {
                token,
                expiresAt,
                blacklistedAt: new Date()
            };

            this.blacklist.set(token, blacklistedToken);
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error('Error adding token to blacklist:', error);
            throw new AppError('Erro ao adicionar token à blacklist', 500);
        }
    }

    /**
     * Check if a token is blacklisted
     * @param token - The JWT token to check
     * @returns true if blacklisted, false otherwise
     */
    isBlacklisted(token: string): boolean {
        const blacklistedToken = this.blacklist.get(token);

        if (!blacklistedToken) {
            return false;
        }

        // If the token has naturally expired, remove it from blacklist
        if (blacklistedToken.expiresAt < new Date()) {
            this.blacklist.delete(token);
            return false;
        }

        return true;
    }

    /**
     * Remove expired tokens from the blacklist
     */
    private cleanup(): void {
        const now = new Date();
        const expiredTokens: string[] = [];

        for (const [token, blacklistedToken] of this.blacklist.entries()) {
            if (blacklistedToken.expiresAt < now) {
                expiredTokens.push(token);
            }
        }

        expiredTokens.forEach(token => this.blacklist.delete(token));

        if (expiredTokens.length > 0) {
            console.log(`Cleaned up ${expiredTokens.length} expired blacklisted tokens`);
        }
    }

    /**
     * Get blacklist statistics
     */
    getStats(): { total: number; active: number } {
        const now = new Date();
        let active = 0;

        for (const blacklistedToken of this.blacklist.values()) {
            if (blacklistedToken.expiresAt > now) {
                active++;
            }
        }

        return {
            total: this.blacklist.size,
            active
        };
    }

    /**
     * Clear all blacklisted tokens (for testing purposes)
     */
    clear(): void {
        this.blacklist.clear();
    }

    /**
     * Stop the periodic cleanup interval (for testing purposes)
     */
    stopCleanup(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

export const tokenBlacklistService = new TokenBlacklistService();
