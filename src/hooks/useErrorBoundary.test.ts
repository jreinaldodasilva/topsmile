// src/hooks/useErrorBoundary.test.ts
import { renderHook, act } from '@testing-library/react';
import { useErrorBoundary } from './useErrorBoundary';

describe('useErrorBoundary', () => {
    it('should initialize with no error', () => {
        const { result } = renderHook(() => useErrorBoundary());

        expect(result.current.error).toBeNull();
    });

    it('should throw error when showBoundary is called', () => {
        const { result } = renderHook(() => useErrorBoundary());
        const testError = new Error('Test error');

        expect(() => {
            act(() => {
                result.current.showBoundary(testError);
            });
        }).toThrow('Test error');
    });

    it('should reset error state', () => {
        const { result } = renderHook(() => useErrorBoundary());

        act(() => {
            result.current.resetBoundary();
        });

        expect(result.current.error).toBeNull();
    });
});
