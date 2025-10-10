// src/hooks/useErrorHandler.test.ts
import { renderHook, act } from '@testing-library/react';
import { useErrorHandler } from './useErrorHandler';
import { NetworkError, AuthenticationError, ValidationError } from '../utils/errors';

describe('useErrorHandler', () => {
    it('should initialize with no error', () => {
        const { result } = renderHook(() => useErrorHandler());

        expect(result.current.error).toBeNull();
    });

    it('should handle network error', () => {
        const { result } = renderHook(() => useErrorHandler());

        act(() => {
            result.current.handleError({ message: 'Network failed' });
        });

        expect(result.current.error).toBeInstanceOf(NetworkError);
    });

    it('should handle authentication error', () => {
        const { result } = renderHook(() => useErrorHandler());

        act(() => {
            result.current.handleError({
                response: {
                    status: 401,
                    data: { error: { message: 'Unauthorized' } }
                }
            });
        });

        expect(result.current.error).toBeInstanceOf(AuthenticationError);
    });

    it('should handle validation error', () => {
        const { result } = renderHook(() => useErrorHandler());

        act(() => {
            result.current.handleError({
                response: {
                    status: 400,
                    data: { error: { message: 'Invalid data' } }
                }
            });
        });

        expect(result.current.error).toBeInstanceOf(ValidationError);
    });

    it('should clear error', () => {
        const { result } = renderHook(() => useErrorHandler());

        act(() => {
            result.current.handleError({ message: 'Error' });
        });

        expect(result.current.error).not.toBeNull();

        act(() => {
            result.current.clearError();
        });

        expect(result.current.error).toBeNull();
    });
});
