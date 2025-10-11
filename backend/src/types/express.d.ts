// backend/src/types/express.d.ts
import type { User } from '@topsmile/types';

declare global {
    namespace Express {
        interface Request {
            user?: User & {
                userId: string;
                clinicId: string;
                role: string;
            };
            requestId?: string;
        }
    }
}

export {};
