import React, { lazy, Suspense } from 'react';
import type { HTMLMotionProps } from 'framer-motion';

const MotionDiv = lazy(() =>
    import('framer-motion').then(mod => ({
        default: mod.motion.div
    }))
);

interface LazyMotionDivProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
}

export const LazyMotionDiv: React.FC<LazyMotionDivProps> = ({ children, ...props }) => (
    <Suspense fallback={<div {...(props as any)}>{children}</div>}>
        <MotionDiv {...props}>{children}</MotionDiv>
    </Suspense>
);
