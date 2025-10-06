// src/components/common/FormBuilder/FormBuilder.tsx
import React from 'react';
import FormField from '../FormField/FormField';

export interface FieldConfig {
    name: string;
    label?: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date' | 'textarea' | 'select';
    placeholder?: string;
    required?: boolean;
    options?: { value: string | number; label: string }[];
    rows?: number;
}

interface FormBuilderProps {
    fields: FieldConfig[];
    values: Record<string, any>;
    errors?: Record<string, string>;
    onChange: (name: string, value: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel?: string;
    isSubmitting?: boolean;
}

const FormBuilder: React.FC<FormBuilderProps> = ({
    fields,
    values,
    errors = {},
    onChange,
    onSubmit,
    submitLabel = 'Enviar',
    isSubmitting = false
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onChange(name, value);
    };

    return (
        <form onSubmit={onSubmit} className="form-builder">
            {fields.map(field => (
                <FormField
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    value={values[field.name] || ''}
                    onChange={handleChange}
                    error={errors[field.name]}
                    placeholder={field.placeholder}
                    required={field.required}
                    options={field.options}
                    rows={field.rows}
                    disabled={isSubmitting}
                />
            ))}
            <button type="submit" disabled={isSubmitting} className="form-submit">
                {isSubmitting ? 'Enviando...' : submitLabel}
            </button>
        </form>
    );
};

export default FormBuilder;
