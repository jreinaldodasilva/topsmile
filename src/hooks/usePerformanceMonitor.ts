// src/hooks/usePerformanceMonitor.ts
import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName: string) => {
    const renderCount = useRef(0);
    const mountTime = useRef(performance.now());

    useEffect(() => {
        renderCount.current += 1;

        if (renderCount.current === 1) {
            const mountDuration = performance.now() - mountTime.current;
            if (mountDuration > 100) {
                console.warn(`${componentName} mount took ${mountDuration.toFixed(2)}ms`);
            }
        }
    });

    useEffect(() => {
        return () => {
            const lifetimeDuration = performance.now() - mountTime.current;
            if (process.env.NODE_ENV === 'development') {
                console.log(`${componentName} stats:`, {
                    renders: renderCount.current,
                    lifetime: `${lifetimeDuration.toFixed(2)}ms`
                });
            }
        };
    }, [componentName]);
};
