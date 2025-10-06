import { useEffect, useRef, useCallback } from 'react';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_TIMEOUT = 2 * 60 * 1000; // 2 minutes warning

interface UseSessionTimeoutOptions {
  onTimeout: () => void;
  onWarning?: () => void;
  enabled?: boolean;
}

export const useSessionTimeout = ({ 
  onTimeout, 
  onWarning,
  enabled = true 
}: UseSessionTimeoutOptions) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();

  const resetTimer = useCallback(() => {
    if (!enabled) return;

    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    // Set warning timer
    if (onWarning) {
      warningRef.current = setTimeout(() => {
        onWarning();
      }, INACTIVITY_TIMEOUT - WARNING_BEFORE_TIMEOUT);
    }

    // Set timeout timer
    timeoutRef.current = setTimeout(() => {
      onTimeout();
    }, INACTIVITY_TIMEOUT);
  }, [enabled, onTimeout, onWarning]);

  useEffect(() => {
    if (!enabled) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [enabled, resetTimer]);

  return { resetTimer };
};
