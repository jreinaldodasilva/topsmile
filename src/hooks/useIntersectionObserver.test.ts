// src/hooks/useIntersectionObserver.test.ts
import { renderHook } from '@testing-library/react';
import { useIntersectionObserver } from './useIntersectionObserver';

describe('useIntersectionObserver', () => {
    beforeEach(() => {
        global.IntersectionObserver = jest.fn().mockImplementation(callback => ({
            observe: jest.fn(),
            disconnect: jest.fn(),
            unobserve: jest.fn()
        }));
    });

    it('initializes with isVisible false', () => {
        const { result } = renderHook(() => useIntersectionObserver());
        expect(result.current.isVisible).toBe(false);
        expect(result.current.ref.current).toBeNull();
    });

    it('creates IntersectionObserver with options', () => {
        const options = { threshold: 0.5 };
        renderHook(() => useIntersectionObserver(options));
        expect(global.IntersectionObserver).toHaveBeenCalledWith(expect.any(Function), options);
    });
});
