// src/types/errors.ts
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public errors?: Array<{ field: string; message: string }>
    ) {
        super(message);
        this.name = 'ApiError';
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export class NetworkError extends Error {
    constructor(message: string = 'Erro de conexão. Verifique sua internet.') {
        super(message);
        this.name = 'NetworkError';
        Object.setPrototypeOf(this, NetworkError.prototype);
    }
}

export class AuthenticationError extends Error {
    constructor(message: string = 'Não autenticado. Faça login novamente.') {
        super(message);
        this.name = 'AuthenticationError';
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

export type AppError = ApiError | NetworkError | AuthenticationError | Error;

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;
export const isNetworkError = (error: unknown): error is NetworkError => error instanceof NetworkError;
export const isAuthenticationError = (error: unknown): error is AuthenticationError =>
    error instanceof AuthenticationError;

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Erro desconhecido';
};
