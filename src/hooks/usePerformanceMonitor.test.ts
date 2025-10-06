// src/hooks/usePerformanceMonitor.test.ts
import { renderHook } from '@testing-library/react';
import { usePerformanceMonitor } from './usePerformanceMonitor';

describe('usePerformanceMonitor', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('tracks component renders', () => {
    const { rerender } = renderHook(() => usePerformanceMonitor('TestComponent'));
    rerender();
    rerender();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('logs stats on unmount in development', () => {
    process.env.NODE_ENV = 'development';
    const { unmount } = renderHook(() => usePerformanceMonitor('TestComponent'));
    unmount();
    expect(console.log).toHaveBeenCalledWith(
      'TestComponent stats:',
      expect.objectContaining({
        renders: expect.any(Number),
        lifetime: expect.any(String)
      })
    );
  });
});
