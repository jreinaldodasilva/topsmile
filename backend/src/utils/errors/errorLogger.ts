// backend/src/utils/errorLogger.ts
import logger from '../logger';
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
            logger.warn(errorLog, 'Operational Error');
        } else {
            logger.error(errorLog, 'Programming Error');
        }

        // TODO: Send to external logging service (Sentry, DataDog, etc.)
    }
}
