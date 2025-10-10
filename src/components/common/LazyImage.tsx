// src/components/common/LazyImage.tsx
import React, { useState } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface LazyImageProps {
    src: string;
    alt: string;
    placeholder?: string;
    className?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3C/svg%3E',
    className
}) => {
    const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });
    const [loaded, setLoaded] = useState(false);

    return (
        <div ref={ref} className={className}>
            <img
                src={isVisible ? src : placeholder}
                alt={alt}
                onLoad={() => setLoaded(true)}
                style={{ opacity: loaded ? 1 : 0.5, transition: 'opacity 0.3s' }}
            />
        </div>
    );
};
