// src/components/common/LazyWrapper.tsx
import React, { Suspense } from 'react';
import Loading from '../UI/Loading/Loading';

interface LazyWrapperProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({ children, fallback = <Loading /> }) => {
    return <Suspense fallback={fallback}>{children}</Suspense>;
};
