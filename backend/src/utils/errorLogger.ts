// backend/src/utils/errorLogger.ts
import { AppError } from './errors';

export class ErrorLogger {
    static log(error: Error | AppError, context?: string) {
        const timestamp = new Date().toISOString();
        const isOperational = error instanceof AppError ? error.isOperational : false;

        const errorLog = {
            timestamp,
            context,
            name: error.name,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            isOperational,
            ...(error instanceof AppError && {
                statusCode: error.statusCode,
                code: error.code,
                details: error.details
            })
        };

        if (isOperational) {
            console.warn('Operational Error:', JSON.stringify(errorLog, null, 2));
        } else {
            console.error('Programming Error:', JSON.stringify(errorLog, null, 2));
        }

        // TODO: Send to external logging service (Sentry, DataDog, etc.)
    }
}
