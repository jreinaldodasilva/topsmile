import logger from '../../utils/logger';
// backend/src/services/mfaService.ts
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import crypto from 'crypto';

class MFAService {
    generateSecret(): string {
        return authenticator.generateSecret();
    }

    generateQRCode(email: string, secret: string): Promise<string> {
        const appName = 'TopSmile';
        const otpauth = authenticator.keyuri(email, appName, secret);
        return QRCode.toDataURL(otpauth);
    }

    verifyToken(token: string, secret: string): boolean {
        try {
            return authenticator.verify({ token, secret });
        } catch (error) {
            return false;
        }
    }

    generateBackupCodes(count: number = 10): string[] {
        const codes: string[] = [];
        for (let i = 0; i < count; i++) {
            const code = crypto.randomBytes(4).toString('hex').toUpperCase();
            codes.push(code);
        }
        return codes;
    }

    hashBackupCode(code: string): string {
        return crypto.createHash('sha256').update(code).digest('hex');
    }

    verifyBackupCode(code: string, hashedCodes: string[]): { valid: boolean; remainingCode?: string } {
        const hashedInput = this.hashBackupCode(code);
        const index = hashedCodes.indexOf(hashedInput);
        
        if (index !== -1) {
            return { valid: true, remainingCode: hashedCodes[index] };
        }
        
        return { valid: false };
    }
}

export const mfaService = new MFAService();
