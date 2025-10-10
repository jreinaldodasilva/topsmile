// src/hooks/useLazyComponent.ts
import { useEffect, useState } from 'react';

export const useLazyComponent = <T>(importFunc: () => Promise<{ default: T }>, delay: number = 0) => {
    const [Component, setComponent] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            importFunc()
                .then(module => {
                    setComponent(() => module.default);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }, delay);

        return () => clearTimeout(timer);
    }, [importFunc, delay]);

    return { Component, loading };
};
