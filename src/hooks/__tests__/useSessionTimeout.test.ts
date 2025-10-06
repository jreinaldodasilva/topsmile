import { renderHook, act } from '@testing-library/react';
import { useSessionTimeout } from '../useSessionTimeout';

jest.useFakeTimers();

describe('useSessionTimeout', () => {
  it('should call onTimeout after inactivity period', () => {
    const onTimeout = jest.fn();
    const onWarning = jest.fn();

    renderHook(() =>
      useSessionTimeout({
        onTimeout,
        onWarning,
        enabled: true
      })
    );

    act(() => {
      jest.advanceTimersByTime(28 * 60 * 1000);
    });
    expect(onWarning).toHaveBeenCalledTimes(1);

    act(() => {
      jest.advanceTimersByTime(2 * 60 * 1000);
    });
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('should reset timer on user activity', () => {
    const onTimeout = jest.fn();

    renderHook(() =>
      useSessionTimeout({
        onTimeout,
        enabled: true
      })
    );

    act(() => {
      jest.advanceTimersByTime(20 * 60 * 1000);
    });

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown'));
    });

    act(() => {
      jest.advanceTimersByTime(20 * 60 * 1000);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });

  it('should not track when disabled', () => {
    const onTimeout = jest.fn();

    renderHook(() =>
      useSessionTimeout({
        onTimeout,
        enabled: false
      })
    );

    act(() => {
      jest.advanceTimersByTime(31 * 60 * 1000);
    });

    expect(onTimeout).not.toHaveBeenCalled();
  });
});
