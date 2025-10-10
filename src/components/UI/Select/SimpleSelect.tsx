import React from 'react';

interface SimpleSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    children: React.ReactNode;
}

export const SimpleSelect: React.FC<SimpleSelectProps> = ({
    label,
    error,
    helperText,
    children,
    className = '',
    id,
    required,
    ...props
}) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`select-group ${error ? 'select-group--error' : ''} ${className}`}>
            {label && (
                <label htmlFor={selectId} className="select__label">
                    {label}
                    {required && <span className="select__required">*</span>}
                </label>
            )}
            <select id={selectId} className="select__field" required={required} {...props}>
                {children}
            </select>
            {error && (
                <p className="select__error" role="alert">
                    {error}
                </p>
            )}
            {helperText && !error && <p className="select__helper">{helperText}</p>}
        </div>
    );
};
