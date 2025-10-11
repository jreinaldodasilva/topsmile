import React from 'react';
import './Form.css';

export const Form: React.FC<React.FormHTMLAttributes<HTMLFormElement>> = ({
    children,
    className = '',
    ...props
}) => (
    <form className={`form ${className}`} {...props}>
        {children}
    </form>
);

export const FormSection: React.FC<{ title?: string; children: React.ReactNode }> = ({
    title,
    children
}) => (
    <div className="form-section">
        {title && <h3 className="form-section__title">{title}</h3>}
        <div className="form-section__content">{children}</div>
    </div>
);

export const FormGrid: React.FC<{ columns?: 1 | 2 | 3; children: React.ReactNode }> = ({
    columns = 2,
    children
}) => (
    <div className={`form-grid form-grid--${columns}`}>
        {children}
    </div>
);

export const FormActions: React.FC<{ align?: 'left' | 'center' | 'right'; children: React.ReactNode }> = ({
    align = 'right',
    children
}) => (
    <div className={`form-actions form-actions--${align}`}>
        {children}
    </div>
);
