// backend/src/services/sessionService.ts
import UAParser from 'ua-parser-js';
import type { Session as ISession } from '@topsmile/types';
import { Session } from '../../models/Session';

class SessionService {
    private maxConcurrentSessions = 5;

    parseUserAgent(userAgent: string) {
        const parser = new (UAParser as any)(userAgent);
        const result = parser.getResult();
        
        return {
            userAgent,
            browser: result.browser.name,
            os: result.os.name,
            device: result.device.type || 'desktop'
        };
    }

    async createSession(userId: string, refreshToken: string, ipAddress: string, userAgent: string): Promise<void> {
        const deviceInfo = this.parseUserAgent(userAgent);
        
        const activeSessions = await Session.countDocuments({
            user: userId,
            isActive: true
        });

        if (activeSessions >= this.maxConcurrentSessions) {
            await Session.findOneAndUpdate(
                { user: userId, isActive: true },
                { isActive: false },
                { sort: { lastActivity: 1 } }
            );
        }

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await Session.create({
            user: userId,
            refreshToken,
            deviceInfo,
            ipAddress,
            expiresAt
        });
    }

    async updateActivity(refreshToken: string): Promise<void> {
        await Session.findOneAndUpdate(
            { refreshToken, isActive: true },
            { lastActivity: new Date() }
        );
    }

    async revokeSession(refreshToken: string): Promise<boolean> {
        const result = await Session.findOneAndUpdate(
            { refreshToken },
            { isActive: false }
        );
        return !!result;
    }

    async revokeAllUserSessions(userId: string, exceptToken?: string): Promise<number> {
        const filter: any = { user: userId, isActive: true };
        if (exceptToken) {
            filter.refreshToken = { $ne: exceptToken };
        }

        const result = await Session.updateMany(filter, { isActive: false });
        return result.modifiedCount;
    }

    async getUserSessions(userId: string) {
        return Session.find({
            user: userId,
            isActive: true
        })
        .sort({ lastActivity: -1 })
        .lean();
    }

    async isSessionValid(refreshToken: string): Promise<boolean> {
        const session = await Session.findOne({
            refreshToken,
            isActive: true,
            expiresAt: { $gt: new Date() }
        });
        return !!session;
    }

    async cleanupExpiredSessions(): Promise<void> {
        await Session.deleteMany({
            expiresAt: { $lt: new Date() }
        });
    }
}

export const sessionService = new SessionService();

setInterval(() => {
    sessionService.cleanupExpiredSessions();
}, 60 * 60 * 1000);
