// src/hooks/useErrorHandler.ts
import { useState, useCallback } from 'react';
import { handleApiError } from '../utils/errors';

export const useErrorHandler = () => {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((err: any) => {
    const handledError = handleApiError(err);
    setError(handledError);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};
