import logger from '../../utils/logger';
// backend/src/services/smsService.ts
import twilio from 'twilio';
import crypto from 'crypto';

interface VerificationCode {
    code: string;
    expiresAt: Date;
}

class SMSService {
    private client: twilio.Twilio | null = null;
    private verificationCodes: Map<string, VerificationCode> = new Map();

    constructor() {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;

        if (accountSid && authToken && accountSid.startsWith('AC')) {
            this.client = twilio(accountSid, authToken);
        } else if (accountSid && !accountSid.startsWith('AC')) {
            logger.warn('Invalid Twilio Account SID format. SMS service disabled.');
        }
    }

    generateVerificationCode(): string {
        return crypto.randomInt(100000, 999999).toString();
    }

    async sendVerificationSMS(phone: string, code: string): Promise<boolean> {
        if (!this.client) {
            logger.warn({ code }, 'Twilio not configured, logging code instead:');
            return true;
        }

        try {
            const fromNumber = process.env.TWILIO_PHONE_NUMBER;
            
            if (!fromNumber) {
                throw new Error('TWILIO_PHONE_NUMBER not configured');
            }

            await this.client.messages.create({
                body: `Seu código de verificação TopSmile é: ${code}. Válido por 10 minutos.`,
                from: fromNumber,
                to: phone
            });

            return true;
        } catch (error) {
            logger.error({ error }, 'Error sending SMS:');
            return false;
        }
    }

    storeVerificationCode(userId: string, code: string): void {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        this.verificationCodes.set(userId, { code, expiresAt });
    }

    verifyCode(userId: string, code: string): boolean {
        const stored = this.verificationCodes.get(userId);

        if (!stored) {
            return false;
        }

        if (new Date() > stored.expiresAt) {
            this.verificationCodes.delete(userId);
            return false;
        }

        if (stored.code !== code) {
            return false;
        }

        this.verificationCodes.delete(userId);
        return true;
    }

    clearExpiredCodes(): void {
        const now = new Date();
        for (const [userId, data] of this.verificationCodes.entries()) {
            if (now > data.expiresAt) {
                this.verificationCodes.delete(userId);
            }
        }
    }
}

export const smsService = new SMSService();

setInterval(() => {
    smsService.clearExpiredCodes();
}, 5 * 60 * 1000);
