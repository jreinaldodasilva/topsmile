// src/services/interceptors/errorInterceptor.test.ts
import { ErrorInterceptor } from './errorInterceptor';
import { AuthenticationError, NetworkError, ValidationError } from '../../utils/errors';

describe('ErrorInterceptor', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        delete (window as any).location;
        (window as any).location = { ...originalLocation, href: '' };
        localStorage.clear();
    });

    afterEach(() => {
        (window as any).location = originalLocation;
    });

    it('should throw NetworkError for network failures', () => {
        expect(() => {
            ErrorInterceptor.handle({ message: 'Network failed' });
        }).toThrow(NetworkError);
    });

    it('should throw ValidationError for 400 status', () => {
        expect(() => {
            ErrorInterceptor.handle({
                response: {
                    status: 400,
                    data: { error: { message: 'Invalid data' } }
                }
            });
        }).toThrow(ValidationError);
    });

    it('should handle authentication error and redirect', () => {
        localStorage.setItem('token', 'test-token');

        expect(() => {
            ErrorInterceptor.handle({
                response: {
                    status: 401,
                    data: { error: { message: 'Unauthorized' } }
                }
            });
        }).toThrow(AuthenticationError);

        expect(localStorage.getItem('token')).toBeNull();
        expect(window.location.href).toBe('/login');
    });

    it('should throw error without redirecting for non-auth errors', () => {
        const href = window.location.href;

        expect(() => {
            ErrorInterceptor.handle({
                response: {
                    status: 500,
                    data: { error: { message: 'Server error' } }
                }
            });
        }).toThrow();

        expect(window.location.href).toBe(href);
    });
});
