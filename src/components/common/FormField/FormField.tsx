// src/components/common/FormField/FormField.tsx
import React from 'react';

interface FormFieldProps {
    label?: string;
    name: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'textarea' | 'select';
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options?: { value: string | number; label: string }[];
    rows?: number;
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    required = false,
    disabled = false,
    options = [],
    rows = 3
}) => {
    const renderInput = () => {
        if (type === 'textarea') {
            return (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    rows={rows}
                    className={`form-textarea ${error ? 'error' : ''}`}
                />
            );
        }

        if (type === 'select') {
            return (
                <select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    className={`form-select ${error ? 'error' : ''}`}
                >
                    <option value="">Selecione...</option>
                    {options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                className={`form-input ${error ? 'error' : ''}`}
            />
        );
    };

    return (
        <div className="form-field">
            {label && (
                <label htmlFor={name} className="form-label">
                    {label}
                    {required && <span className="required">*</span>}
                </label>
            )}
            {renderInput()}
            {error && <span className="form-error">{error}</span>}
        </div>
    );
};

export default FormField;
