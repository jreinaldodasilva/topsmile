// src/components/UI/Button/Button.tsx
import React, { useRef, useEffect } from 'react';
import { useAccessibility } from '../../../hooks/useAccessibility';
import './Button.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    isLoading?: boolean;
    loading?: boolean;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    loading = false,
    className = '',
    disabled,
    children,
    ...props
}) => {
    const loadingState = isLoading || loading;
    const classes = [
        'button',
        `button--${variant}`,
        `button--${size}`,
        fullWidth && 'button--full-width',
        loadingState && 'button--loading',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classes}
            disabled={disabled || loadingState}
            aria-busy={loadingState}
            {...props}
        >
            {loadingState ? (
                <>
                    <span className="button__spinner" />
                    <span className="button__text--loading">Carregando...</span>
                </>
            ) : children}
        </button>
    );
};

export default Button;
