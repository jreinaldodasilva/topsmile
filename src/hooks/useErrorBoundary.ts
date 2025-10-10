// src/hooks/useErrorBoundary.ts
import { useState, useCallback } from 'react';

export const useErrorBoundary = () => {
    const [error, setError] = useState<Error | null>(null);

    const showBoundary = useCallback((error: Error) => {
        setError(error);
        throw error;
    }, []);

    const resetBoundary = useCallback(() => {
        setError(null);
    }, []);

    return { showBoundary, resetBoundary, error };
};
