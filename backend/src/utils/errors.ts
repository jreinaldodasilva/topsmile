// backend/src/utils/errors.ts
export class AppError extends Error {
    public readonly isOperational: boolean;
    public readonly timestamp: string;

    constructor(
        public message: string,
        public statusCode: number = 500,
        public code?: string,
        public details?: any,
        isOperational = true
    ) {
        super(message);
        this.name = this.constructor.name;
        this.isOperational = isOperational;
        this.timestamp = new Date().toISOString();
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            success: false,
            error: {
                message: this.message,
                code: this.code,
                statusCode: this.statusCode,
                details: this.details,
                timestamp: this.timestamp
            }
        };
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: any) {
        super(message, 400, 'VALIDATION_ERROR', details);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} não encontrado`, 404, 'NOT_FOUND');
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Não autorizado') {
        super(message, 401, 'UNAUTHORIZED');
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Acesso negado') {
        super(message, 403, 'FORBIDDEN');
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409, 'CONFLICT');
    }
}

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(message, 400, 'BAD_REQUEST');
    }
}
