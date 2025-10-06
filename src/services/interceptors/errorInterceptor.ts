// src/services/interceptors/errorInterceptor.ts
import { handleApiError } from '../../utils/errors';

interface ApiError {
    status: number;
    message: string;
    errors?: any;
}

export class ErrorInterceptor {
    static handle(error: any): never {
        const handledError = handleApiError(error);

        // Handle authentication errors
        if (handledError.name === 'AuthenticationError') {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        throw handledError;
    }
}
